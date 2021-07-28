app.controller("ARUSFastTransferOrderCtrl", ['$scope', 'fastTransferPaymentOrderService', 'utilityService', 'accountService', 'customerService', 'infoService', 'dialogService', 'paymentOrderService', 'orderService', '$filter', '$uibModal', '$http', 'ReportingApiService', function ($scope, fastTransferPaymentOrderService, utilityService, accountService, customerService, infoService, dialogService, paymentOrderService, orderService, $filter, $uibModal, $http, ReportingApiService) {


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
        $scope.FromFeeInquiry = false;
        $scope.order.SubType = 23;
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (descr) {
            $scope.order.CustomerNumber = descr.data;
            $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

        });
    }


    $scope.getOrderNumberType = function () {
        if ($scope.order.Type == 76 || $scope.order.Type == 102)
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
        if ($scope.order.DebitAccount != undefined && $scope.currencies != undefined) {

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


    $scope.getTransferTypes = function (isActive) {

        var Data = infoService.getTransferTypes(isActive);

        Data.then(function (transferTypes) {
            $scope.transferTypes = transferTypes.data;
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
                    CloseBPDialog('arusfasttransferorder');
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
                alert('Error in saveFastTransferPayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    }


    //Հանձնարարականի տպում
    $scope.printFastTransferPaymentOrder = function (isNewOrder) {

        showloading();
        if (isNewOrder != 1) {
            var Data = fastTransferPaymentOrderService.printFastTransferPaymentOrder($scope.orderDetails);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 76, ReportExportFormat: 1 }
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
        if ($scope.order.Amount == "" || $scope.order.Amount == undefined) {
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
    };

    $scope.closeTransferAdditionalDetailsModal = function () {
        $scope.transferAdditionalDetailsModal.close();
    };

    $scope.getTransferAdditionalData = function (transferAdditionalData) {

        $scope.transferAdditionalData = transferAdditionalData;
        $scope.order.TransferAdditionalData = transferAdditionalData;

        $scope.setReceiverLivingPlaceDesc();
        $scope.setSenderLivingPlaceDesc();
        $scope.setTransferAmountPurposeDesc();
        $scope.isHasAdditionalData = true;
        $scope.transferAdditionalData.dataformtype = transferAdditionalData.dataformtype;
        $scope.closeTransferAdditionalDetailsModal();
    };

    $scope.setReceiverLivingPlaceDesc = function () {

        var Data = infoService.getTransferReceiverLivingPlaceTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].key == $scope.transferAdditionalData.receiverLivingPlace) {
                    $scope.receiverLivingPlaceDesc = result.data[i].value;
                    break;
                }
            }
        }, function () {

        });
    };
    $scope.setSenderLivingPlaceDesc = function () {
        var Data = infoService.getTransferSenderLivingPlaceTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].key == $scope.transferAdditionalData.senderLivingPlace) {
                    $scope.senderLivingPlaceDesc = result.data[i].value;
                    break;
                }
            }
        }, function () {

        });
    };
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
    };


    $scope.deleteAdditionalData = function () {
        $scope.order.TransferAdditionalData = "";
        $scope.isHasAdditionalData = false;
        $scope.transferAdditionalData = undefined;
    };


    $scope.openRemittanceFeeInquiryModal = function () {
        $scope.remittanceFeeInquiryModalInstance = $uibModal.open({

            template: '<remittancefeeinuqiry callback="getRemittanceFeeData(feeData)" close="closeRemittanceFeeInquiryModal()"></remittancefeeinuqiry>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });
    };

    $scope.getRemittanceFeeData = function (feeData) {      
        $scope.FromFeeInquiry = true;       
        $scope.order.Amount = feeData.PrincipalAmount;
        $scope.order.MTOAgentCode = feeData.MTOAgentCode;    
        $scope.order.Fee = feeData.RemittanceFee;
        $scope.order.TransferFee = feeData.AMDFee;
        $scope.order.FeeAcba = feeData.SendingFeeInCurrency;
        $scope.order.PromotionCode = feeData.PromotionCode;
        $scope.order.SettlementExchangeRate = feeData.SettlementExchangeRate;

        $scope.getSendingCurrencies();
        $scope.getCountries();
        $scope.getPayoutDeliveryCodes();
        $scope.getDocumentTypes();
        $scope.getStates(feeData.BeneficiaryCountryCode, 2);
        $scope.getCitiesByCountry(feeData.BeneficiaryCountryCode, 3);
        $scope.getRemittancePurposes();
        $scope.getCitiesByCountry($scope.order.SenderIssueCountryCode, '2');

        $scope.order.Currency = feeData.CurrencyCode;
        $scope.order.Country = feeData.BeneficiaryCountryCode;
        $scope.order.PayoutDeliveryCode = feeData.PayoutDeliveryCode;
        
        $scope.closeRemittanceFeeInquiryModal();
        $scope.getCardFee();
       
    };

    $scope.closeRemittanceFeeInquiryModal = function () {
        $scope.remittanceFeeInquiryModalInstance.close();
    };


    $scope.getMTOList = function () {
        var Data = infoService.getARUSMTOList();
        Data.then(function (c) {
            $scope.MTOList = c.data;
        },
            function () {
                alert('Error getMTOList');
            });

    };


    $scope.getSendingCurrencies = function () {
        $scope.order.Currency = undefined;

        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '') {
            var Data = infoService.getARUSSendingCurrencies($scope.order.MTOAgentCode);
            Data.then(function (c) {
                $scope.currencies = c.data;
            },
                function () {
                    alert('Error getSendingCurrencies');
                });
        }
    };

    $scope.getCountries = function () {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '') {
            var Data = infoService.getARUSCountriesByMTO($scope.order.MTOAgentCode);
            Data.then(function (c) {
                $scope.countries = c.data;
                $scope.senderDocumentCountries = c.data;
                $scope.senderCountries = c.data;
                $scope.senderBirthCountries = c.data;
            },
                function () {
                    alert('Error getCountries');
                });
        }

    };


    $scope.getPayoutDeliveryCodes = function () {
        var Data = infoService.getARUSPayoutDeliveryCodes($scope.order.MTOAgentCode);
        Data.then(function (c) {
            $scope.payoutDeliveryCodes = c.data;
        },
            function () {
                alert('Error getPayoutDeliveryCodes');
            });

    };

    $scope.getStates = function (countryCode, type) {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '' && countryCode != undefined && countryCode != '') {
            var Data = infoService.getARUSStates($scope.order.MTOAgentCode, countryCode);
            Data.then(function (c) {
                //Ուղարկողի մարզեր
                if (type == 1) {
                    $scope.senderStates = c.data;
                }
                //Ստացողի մարզեր
                else if (type == 2) {
                        $scope.beneficiaryStates = c.data;
                    }
                           
            },
                function () {
                    alert('Error getStates');
                });
        }
    };


    $scope.getCitiesByCountry = function (countryCode, citiesType) {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '' && countryCode != undefined && countryCode != '') {
            var Data = infoService.getARUSCitiesByCountry($scope.order.MTOAgentCode, countryCode);
            Data.then(function (c) {
                if (citiesType == '1') {   //Ուղարկողի քաղաքներ
                    $scope.senderCities = c.data;
                }
                else if (citiesType == '2') {   //Ուղարկողի փաստաթղթի թողարկման քաղաքներ
                    $scope.senderDocumentCities = c.data;
                }
                else if (citiesType == '3') {   //Ստացողի քաղաքներ
                    $scope.beneficiaryCities = c.data;
                }

            },
                function () {
                    alert('Error getCitiesByCountry');
                });
        }
    };

    $scope.getDocumentTypes = function () {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '') {
            var Data = infoService.getARUSDocumentTypes($scope.order.MTOAgentCode);
            Data.then(function (types) {
                $scope.documentTypes = types.data;
            },
                function () {
                    alert('getDocumentTypes');
                });
        }
    };

    $scope.getSexes = function () {
        var Data = infoService.getARUSSexes();
        Data.then(function (s) {
            $scope.senderSexes = s.data;
        },
            function () {
                alert('Error getSexes');
            });
    };

    $scope.getCitiesByState = function (countryCode, stateCode, stateType) {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '' && countryCode != undefined && countryCode != '' && stateCode != undefined && stateCode != '') {
            var Data = infoService.getARUSCitiesByState($scope.order.MTOAgentCode, countryCode, stateCode);
            Data.then(function (c) {
                //Ուղարկողի քաղաքներ
                if (stateType == 1) {
                    $scope.senderCities = c.data;
                }
                //Ստացողի քաղաքներ
                else if (stateType == 2) {
                    $scope.beneficiaryCities = c.data;
                }
                
            },
                function () {
                    alert('Error getCitiesByState');
                });
        }
    };

    $scope.getRemittancePurposes = function () {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '') {
            var Data = infoService.getRemittancePurposes($scope.order.MTOAgentCode);
            Data.then(function (types) {
                $scope.remittancePurposes = types.data;
            },
                function () {
                    alert('getRemittancePurposes');
                });
        }
    };

    $scope.getMTOAgencies = function () {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '' && $scope.order.Country != undefined && $scope.order.Country != ''
            && $scope.order.Currency != undefined && $scope.order.Currency != '' && $scope.order.BeneficiaryCityCode != undefined
            && $scope.order.BeneficiaryCityCode != '') {
            var Data = infoService.getMTOAgencies($scope.order.MTOAgentCode, $scope.order.Country, $scope.order.BeneficiaryCityCode, $scope.order.Currency, $scope.order.BeneficiaryStateCode);
            Data.then(function (a) {
                $scope.beneficiaryAgentCodes = a.data;
            },
                function () {
                    alert('getMTOAgencies');
                });
        }
    };

    $scope.getYesNo = function () {
        var Data = infoService.getARUSYesNo();
        Data.then(function (yesNo) {
            $scope.YesNoList = yesNo.data;
        },
            function () {
                alert('Error getYesNo');
            });
    };

    $scope.getSenderData = function () {

        var Data = customerService.getCustomer();
        
        Data.then(function (cust) {
            $scope.SenderData = cust.data;

            //Անուն, ազգանուն, հայրանուն, հասցե, փոստային կոդ
            $scope.order.NATSenderFirstName = $scope.SenderData.FirstName;
            $scope.order.NATSenderLastName = $scope.SenderData.LastName;
            $scope.order.NATSenderMiddleName = $scope.SenderData.MiddleName;
            $scope.order.SenderFirstName = $scope.SenderData.FirstNameEng;
            $scope.order.SenderLastName = $scope.SenderData.LastNameEng;

            $scope.order.SenderOccupationName = $scope.SenderData.Occupation;
            $scope.order.SenderBirthPlaceName = $scope.SenderData.BirthPlaceName;
            $scope.order.SenderZipCode = $scope.SenderData.PostCode;


            //Փաստաթուղթ
            $scope.order.SenderIssueIDNo = $scope.SenderData.DocumentNumber;
            $scope.order.SenderIssueDate = $scope.SenderData.DocumentGivenDate;
            $scope.order.SenderExpirationDate = $scope.SenderData.DocumentExpirationDate;
            if ($scope.SenderData.DocumentCountry != undefined) {
                $scope.order.SenderIssueCountryCode = $scope.countriesA3[$scope.SenderData.DocumentCountry.key];              
            }

            if ($scope.SenderData.DocumentType != undefined) {
                $scope.getARUSDocumentTypeCode($scope.SenderData.DocumentType.key);
            }



            //Ռեզիդենտություն
            if ($scope.SenderData.Residence == 1) {
                $scope.order.SenderResidencyCode = "1";
            }
            else if ($scope.Beneficiary.Residence == 2) {
                $scope.order.SenderResidencyCode = "0";
            }

            //Սեռ
            if ($scope.SenderData.Gender == 1) {
                $scope.order.SenderSexCode = "M";
            }
            else if ($scope.SenderData.Gender == 2) {
                $scope.order.SenderSexCode = "F";
            }

        }, function () {
            alert('Error');
        });

    };

    $scope.getARUSDocumentTypeCode = function (ACBADocumentTypeCode) {
        var Data = infoService.getARUSDocumentTypeCode(ACBADocumentTypeCode);
        Data.then(function (d) {
            $scope.order.SenderDocumentTypeCode = d.data;
        },
            function () {
                alert('getARUSDocumentTypeCode');
            });
    };

    $scope.getCountriesWithA3 = function () {
        var Data = infoService.getCountriesWithA3();
        Data.then(function (c) {
            $scope.countriesA3 = c.data;
        },
            function () {
                alert('getCountriesWithA3');
            });
    };

    $scope.setReceiver = function () {
        $scope.order.Receiver = $scope.order.BeneficiaryFirstName + " " + $scope.order.BeneficiaryLastName;
    };

}]);