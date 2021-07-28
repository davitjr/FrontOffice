app.controller("FastTransferPaymentOrderCtrl", ['$scope', 'fastTransferPaymentOrderService', 'utilityService', 'accountService', 'customerService', 'infoService', 'dialogService', 'paymentOrderService', 'orderService', '$filter', '$uibModal', '$http', 'ReportingApiService', function ($scope, fastTransferPaymentOrderService, utilityService, accountService, customerService, infoService, dialogService, paymentOrderService, orderService, $filter, $uibModal, $http, ReportingApiService) {


    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };
    $scope.generateNewOrderNumber = function () {
        $scope.getOrderNumberType();
        var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    if ($scope.order == undefined) {
        $scope.order = {};
        $scope.order.OrderNumber = " ";
        $scope.orderAttachment = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.DescriptionForPayment = 'Non-commercial transfer for personal needs';
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function(descr) {
            $scope.order.CustomerNumber = descr.data;
            $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

        });
    }
       
    
    $scope.getOrderNumberType = function () {
        if ($scope.order.Type == 76 || $scope.order.Type ==102)
            $scope.orderNumberType = 4;  
    };

    $scope.getCustomer = function () {

        var Data = customerService.getCustomer();
        Data.then(function (cust) {
            $scope.customer = cust.data;

            $scope.order.SenderType = cust.data.CustomerType;
            $scope.order.Password = cust.data.SecurityCode;
            $scope.SenderCountry = cust.data.Country;
            $scope.order.Sender = cust.data.FirstNameEng + ' ' + cust.data.LastNameEng;
            $scope.SenderNameEng = $scope.order.Sender;
            if ($scope.customer.DocumentNumber != null && $scope.customer.DocumentNumber != "")
                $scope.order.SenderPassport = $scope.customer.DocumentNumber +
                    ', ' +
                    $scope.customer.DocumentGivenBy +
                    ', ' +
                    $scope.customer.DocumentGivenDate;
            if ($scope.customer.BirthDate != null && $scope.customer.BirthDate != undefined) {
                var birthDate = $scope.customer.BirthDate;
                var dateTmp = moment(birthDate);
                var sec = dateTmp._d.setHours(dateTmp._d.getHours() - dateTmp._d.getTimezoneOffset() / 60);

                $scope.order.SenderDateOfBirth = new Date(sec);
                //$scope.order.SenderDateOfBirth = new Date(parseInt($scope.customer.BirthDate.substr(6)))
            }
             

 
     
            if (cust.data.EmailList != null) {
                if (cust.data.EmailList.length > 0) {
                    $scope.order.SenderEmail = cust.data.EmailList[0];
                }
            }

        }, function () {
            alert('Error');
        });

    };


    $scope.$watch('order.DebitAccount', function (newValue, oldValue) {
        if ($scope.order.DebitAccount != undefined && $scope.currencies !=undefined) {

            if (($scope.order.Type == 102   && $scope.order.DebitAccount.Currency in $scope.currencies)) {
                $scope.order.Currency = $scope.order.DebitAccount.Currency;
            }
 
            $scope.getCardFee();
           
        }
 
    });


    $scope.getDebitAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 1);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error getdebitaccounts');
        });
    };

    $scope.getFee = function () {
        if ($scope.order.Currency != null && $scope.order.Currency!="" && $scope.order.SubType == 21) {

            $scope.order.Fee = Math.round(($scope.order.Amount * 0.007) * 100) / 100;
            $scope.order.FeeAcba = Math.round(($scope.order.Amount * 0.002) * 100) / 100;
       
            if ($scope.order.Currency == 'AMD') {
                $scope.order.TransferFee = ($scope.order.Amount * 0.007).toFixed(1);
                if ($scope.order.TransferFee > 0 && $scope.order.TransferFee <= 5)
                    $scope.order.TransferFee = 10;
                else
                    $scope.order.TransferFee = Math.round($scope.order.TransferFee / 10) * 10;
            }
            else
            {
                var Data = utilityService.getLastRates($scope.order.Currency, 3, 1 );

                    Data.then(function (result) {
                        $scope.order.TransferFee =
                            Math.round(($scope.order.Fee * (Math.round(result.data * 100) / 100)) * 10) / 10;
                        if ($scope.order.TransferFee > 0 && $scope.order.TransferFee<= 5)
                            $scope.order.TransferFee = 10;
                        else
                          $scope.order.TransferFee = Math.round($scope.order.TransferFee / 10) * 10;

                    }, function () {
                        alert('Error in getLastRates');
                    });
            }
        }
        else {
            $scope.order.Fee = 0;
            $scope.order.TransferFee = 0;
            $scope.order.FeeAcba = 0;
 
        }
        
    };

    $scope.getFeeAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
        Data.then(function (acc) {
            $scope.feeAccounts = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });
    };



    $scope.getCardFee = function () {
        if ($scope.order.DebitAccount != undefined && $scope.order.Currency != undefined) {
            if ($scope.order.DebitAccount.AccountType == 11 && $scope.order.DebitAccount.Currency != null && $scope.order.Amount != null && $scope.order.Amount > 0) {

                var Data = paymentOrderService.getCardFee($scope.order);

                Data.then(function (fee) {
                    $scope.order.CardFee = fee.data;
                    $scope.CardFeeCurrency = $scope.order.DebitAccount.Currency;


                }, function () {
                    alert('Error getcardfee');
                });

            }
            else {
                $scope.order.CardFee = null;
                $scope.order.CardFeeCurrency = "";
            }
        }
    };

 
    $scope.setFees = function () {
        if ($scope.order.Currency != null && $scope.order.Currency != "") {
            if ($scope.order.Currency == 'AMD') {
                if ($scope.order.SubType == 21)
                    $scope.order.TransferFee = ($scope.order.Amount * 0.007).toFixed(1);
                else
                    $scope.order.TransferFee = $scope.order.Fee;

                    $scope.order.TransferFee = Math.round($scope.order.TransferFee / 10) * 10;
            }
            else {
                var Data = utilityService.getLastRates($scope.order.Currency, 3, 1);

                Data.then(function (result) {
                    $scope.order.TransferFee =
                        Math.round(($scope.order.Fee * (Math.round(result.data * 100) / 100)) * 10) / 10;
                    if ($scope.order.TransferFee > 0 && $scope.order.TransferFee <= 5)
                        $scope.order.TransferFee = 10;
                    else
                        $scope.order.TransferFee = Math.round($scope.order.TransferFee / 10) * 10;
                }, function () {
                    alert('Error in getLastRates');
                });
            }
        }
        if ($scope.order.SubType==7 || $scope.order.SubType==11 || $scope.order.SubType==12 || $scope.order.SubType==13 || $scope.order.SubType== 14 || $scope.order.SubType== 17 || $scope.order.SubType==15) {
            var Data1 = fastTransferPaymentOrderService.GetFastTransferFeeAcbaPercent($scope.order.SubType);
            Data1.then(function (result) {
                $scope.order.FeeAcba =
                    Math.round(($scope.order.Fee * (Math.round(result.data * 100) / 100)) * 100) / 100;
            }, function () {
                alert('Error in GetFastTransferFeeAcbaPercent');
            });
        }
    }

    $scope.getTransferTypes = function (isActive) {

        var Data = infoService.getTransferTypes(isActive);

        Data.then(function (transferTypes) {
            $scope.transferTypes = transferTypes.data;
            delete ($scope.transferTypes['23']);
        },
        function () {
            alert('Error getTransferCallTypes');
        });
    };

    $scope.checkTransferFeeForTransitPaymentOrder = function () {
        if ($scope.order.TransferFee > 0) {
            $scope.params = {
                paymentOrder: $scope.order, forFee: 1
            };
            return true;
        }
        else {
            showMesageBoxDialog('Միջնորդավճարը սխալ է', $scope, 'information');
            return false;

        }
    }
    $scope.saveFastTransferPayment = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("interLoad").classList.remove("hidden");

            //$scope.order.Type = 3;
            //$scope.order.SubType = 1;
            $scope.order.Attachments = [];
            if ($scope.orderAttachment.attachmentArrayBuffer != undefined && $scope.orderAttachment.attachmentArrayBuffer != null) {
                var oneAttachment = {};
                oneAttachment.Attachment = $scope.orderAttachment.attachmentArrayBuffer;
                oneAttachment.FileName = $scope.orderAttachment.attachmentFile.name;
                oneAttachment.FileExtension = $scope.orderAttachment.attachmentFile.getExtension();

                $scope.order.Attachments.push(oneAttachment);
            }
            $scope.order.Description = $scope.description;
            var Data = fastTransferPaymentOrderService.saveFastTransferPaymentOrder($scope.order);

            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("interLoad").classList.add("hidden");
                    CloseBPDialog('fasttransferpaymentorder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                }
                else {
                    document.getElementById("interLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("interLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in FastTransferPaymentOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    }


 
  
    $scope.$watch('order.Country', function (newValue, oldValue) {
        if ($scope.order.Country != undefined) {
            $scope.getFee();
        }
    });

 

    $scope.changeCurrency = function () {

        $scope.getFee();
    };

    $scope.getTransferSystemCurrency = function () {

        $scope.order.Currency = undefined;
        var Data = infoService.getTransferSystemCurrency($scope.order.SubType);

        Data.then(function (transferSystemCurrency) {

            $scope.currencies = transferSystemCurrency.data;
        },              
        function () {
            alert('Error getTransferSystemCurrency');
        });
    };

    //Միջազգային հանձնարարականի տպում
    $scope.printFastTransferPaymentOrder = function (isNewOrder) {
       
        showloading();
        if (isNewOrder != 1) {
            //var Data = fastTransferPaymentOrderService.printFastTransferPaymentOrder($scope.orderDetails);
            var Data = fastTransferPaymentOrderService.printSTAKSendMoneyPaymentOrder($scope.orderDetails);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 157, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error printFastTransferPaymentOrder');
            });
        }
        else {
            var Data = fastTransferPaymentOrderService.printFastTransferPaymentOrder($scope.order);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 76, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error printFastTransferPaymentOrder');
            });
        }
       
       
    };

  
    $scope.getFastTransferPaymentOrder = function (orderID) {
        var Data = fastTransferPaymentOrderService.getFastTransferPaymentOrder(orderID);
        Data.then(function (acc) {

            $scope.orderDetails = acc.data;
            $scope.orderDetails.RegistrationDate = $filter('mydate')($scope.orderDetails.RegistrationDate, "dd/MM/yyyy");
            $scope.orderDetails.OperationDate = $filter('mydate')($scope.orderDetails.OperationDate, "dd/MM/yyyy");
            $scope.orderDetails.SenderDateOfBirth = $filter('mydate')($scope.orderDetails.SenderDateOfBirth, "dd/MM/yyyy");
        }, function () {
            alert('Error getFastTransferPaymentOrder');
        });

    };
     
    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error CashTypes');
        });

    };

    //Փոխանցման լրացուցիչ տվյալներ 
    $scope.order.TransferAdditionalData = {};
    $scope.openTransferAdditionalDetailsModal = function () {
        $scope.isAddDataFormOpening = true;
        if ($scope.order.Amount == "" || $scope.order.Amount == undefined)
        {
            return;
        }       
        $scope.transferAdditionalDetailsModal = $uibModal.open({
            template: '<transferadditionaldataform dataformtype="1" transferamount="order.Amount" cashtransferdata="transferAdditionalData" callback="getTransferAdditionalData(transferAdditionalData)" close="closeTransferAdditionalDetailsModal()"></transferadditionaldataform>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    }

    $scope.closeTransferAdditionalDetailsModal = function () {
        $scope.transferAdditionalDetailsModal.close();
    }

    $scope.getTransferAdditionalData = function (transferAdditionalData) {
       
        $scope.transferAdditionalData = transferAdditionalData;
        $scope.order.TransferAdditionalData = transferAdditionalData;

        $scope.setReceiverLivingPlaceDesc();
        $scope.setSenderLivingPlaceDesc();
        $scope.setTransferAmountPurposeDesc();
        $scope.isHasAdditionalData = true;
        $scope.transferAdditionalData.dataformtype = transferAdditionalData.dataformtype;
        $scope.closeTransferAdditionalDetailsModal();
    }

    $scope.setReceiverLivingPlaceDesc = function () {

        var Data = infoService.getTransferReceiverLivingPlaceTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++)
            {
                if (result.data[i].key == $scope.transferAdditionalData.receiverLivingPlace)
                {
                    $scope.receiverLivingPlaceDesc = result.data[i].value;
                    break;
                }                        
            }
        }, function () {
                    
        });
    }
    $scope.setSenderLivingPlaceDesc = function () {
        var Data = infoService.getTransferSenderLivingPlaceTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++)
            {
                if (result.data[i].key == $scope.transferAdditionalData.senderLivingPlace)
                {
                    $scope.senderLivingPlaceDesc = result.data[i].value;
                    break;
                }                        
            }
        }, function () {
                    
        });
    }
    $scope.setTransferAmountPurposeDesc = function () {

        var Data = infoService.getTransferAmountTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].key == $scope.transferAdditionalData.transferAmountType) {
                    $scope.transferAmountPurposeDesc = result.data[i].value;
                    break;
                }
            }
        }, function () {

        });
    }


    $scope.deleteAdditionalData = function () {
        $scope.order.TransferAdditionalData = "";
        $scope.isHasAdditionalData = false;
        $scope.transferAdditionalData=undefined;
    }



    //$scope.$watch('order.DescriptionForPayment', function (newValue, oldValue) {
    //    if ($scope.order.DescriptionForPayment != undefined ) {

    //        $scope.description = $scope.order.DescriptionForPayment;
    //    }
    //});


    $scope.getSTAKMTOListAndBestChoice = function (bestChoice) {
        //if ($scope.bestChoice != undefined && $scope.bestChoice != '') {
        var Data = fastTransferPaymentOrderService.getSTAKMTOListAndBestChoice(bestChoice);
        Data.then(function (acc) {
            $scope.MTOListAndBestChoice = acc.data;
        }, function () {
            alert('Error getSTAKMTOListAndBestChoice');
        });
        //}
    };

  
}]);