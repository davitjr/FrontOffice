app.controller("BudgetPaymentOrderCtrl", ['$scope', 'paymentOrderService', 'utilityService', 'accountService', 'customerService', 'infoService', 'dialogService', 'orderService', '$filter', '$uibModal', '$http', 'ReportingApiService', function ($scope, paymentOrderService, utilityService, accountService, customerService, infoService, dialogService, orderService, $filter, $uibModal, $http, ReportingApiService) {

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
        $scope.order.ReceiverAccount = {};
        $scope.orderAttachment = {};
        $scope.order.Type = $scope.orderType;
        $scope.order.Currency = 'AMD';
        $scope.order.SubType = 5;
        $scope.order.Exaction = false;
        if ($scope.IsPoliceViloation != undefined && $scope.IsPoliceViloation == true)
        {
            $scope.order.SubType = 6;
            $scope.order.PoliceResponseDetailsId = $scope.PoliceResponseDetails.Id;
            $scope.order.ReceiverAccount = { AccountNumber: $scope.PoliceResponseDetails.PoliceAccount };
            var violationDate = $filter('mydate')($scope.PoliceResponseDetails.ViolationDate, "dd/MM/yyyy").toString("dd/MM/yyyy");
            $scope.order.Description = "Որոշում" + " " + $scope.PoliceResponseDetails.ViolationNumber + " " + violationDate + "," + "պետ համարանիշ" + " " + $scope.PoliceResponseDetails.VehicleNumber;
            $scope.order.Receiver = "Ճանապարհային Ոստիկանություն";
            $scope.order.LTACode = "99";
            $scope.order.Amount = $scope.PoliceResponseDetails.RequestedAmount;
            $scope.order.DebitAccount = {Currency : "AMD"};
        }
        else
        {
            $scope.IsPoliceViloation = false;
        }
                               
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function(descr) {
            $scope.order.CustomerNumber = descr.data;
            $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

        });
    };

       
    $scope.seterror = function (error) {
        $scope.error = error;
    };

    $scope.getOrderNumberType = function () {
        if ($scope.periodic != undefined)
            $scope.orderNumberType = 9;
        else if ($scope.order.Type == 1 || $scope.order.Type == 56)
            $scope.orderNumberType = 6;
    };

    $scope.getDebitAccounts = function (orderType, orderSubType) {
     
        if ($scope.periodic != undefined) {
            orderType = 10;
            orderSubType = 5;
        }
        if ($scope.checkForDebitAccountBudgetPayment == 0) {
            var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 1);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;
            }, function () {
                alert('Error getdebitaccounts');
            });
        }
    };

    $scope.getFeeAccounts = function (orderType, orderSubType) {
        if ($scope.checkForFeeAccount == 0 && $scope.order.Type != 56) {
            var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
            Data.then(function (acc) {
                $scope.feeAccounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        }
    };

    $scope.getLTACodes = function () {

        var Data = infoService.getLTACodes();
        Data.then(function (acc) {

            $scope.LTACodes = acc.data;
        }, function () {
            alert('Error getLTACodes');
        });
    };

    $scope.getPoliceCodes = function (accountNumber) {
        $scope.policeCodes = undefined;
        $scope.order.PoliceCode = 0;
        $scope.hasRow = 0;
        var Data = infoService.getPoliceCodes(accountNumber);
        Data.then(function (acc) {
            $scope.policeCodes = acc.data;
            for (var key in acc.data  ) {
                $scope.hasRow = 1;
                break;
            }
            if ($scope.hasRow == 0)
                $scope.policeCodes = undefined;
        }, function () {
            alert('Error getPoliceCodes');
        });

    };

    $scope.getCreditorStatuses = function () {

        var Data = paymentOrderService.getSyntheticStatuses();
        Data.then(function (acc) {

            $scope.creditorStatuses = acc.data;
        }, function () {
            alert('Error getCreditorStatuses');
        });
    };


    $scope.isPoliceAccount = function () {

        if ($scope.order.ReceiverAccount.AccountNumber != null) {
            var accountNumber = $scope.order.ReceiverAccount.AccountNumber.toString();

            var Data = accountService.isPoliceAccount(accountNumber);
            Data.then(function (acc) {
                $scope.isPolice = acc.data;
                $scope.order.PoliceCode = 0;
            }, function () {
                alert('Error isPoliceAccount');
            });
        }

    };

    $scope.checkAccountForPSN = function () {

        if ($scope.order.ReceiverAccount.AccountNumber != null) {
            var accountNumber = $scope.order.ReceiverAccount.AccountNumber.toString();

            var Data = accountService.checkAccountForPSN(accountNumber);
            Data.then(function (acc) {
                $scope.forPSN = acc.data;
            }, function () {
                alert('Error isPoliceAccount');
            });
        }

    };


    $scope.getBudgetPaymentOrder = function (orderID) {
        var Data = paymentOrderService.getBudgetPaymentOrder(orderID);
        Data.then(function (acc) {

            $scope.order = acc.data;
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            if ($scope.order.Fees.length > 0) {
                for (var i = 0; i < $scope.order.Fees.length; i++) {
                    if ($scope.FeesString == undefined) {
                        $scope.FeesString = '';
                    }
                    $scope.FeesString += '\n' + $scope.order.Fees[i].Account.AccountNumber + '-ից' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription;
                }
            }
        }, function () {
            alert('Error getBudgetPaymentOrder');
        });

    };



    $scope.setTransferArmCurrency = function () {
        $scope.order.Currency = $scope.order.DebitAccount.Currency;
    };

    $scope.getFee = function () {
        $scope.generateNewOrderNumberForFee();
        if ((($scope.order.Amount != null && $scope.order.Amount > 0 && $scope.order.Type == 1)
                        || ($scope.order.Amount != null && $scope.order.Amount > 0 && $scope.order.Type == 56) )&& !$scope.order.Exaction) {

           var Data = paymentOrderService.getFee($scope.order, 0);

            Data.then(function (fee) {
                $scope.order.TransferFee = fee.data;

                if ($scope.order.Type == 1)
                {
                        $scope.feeType = 20;
                }
                else if ($scope.order.Type == 56)
                {
                    $scope.feeType = 5;
                }


                if (fee.data == -1) {
                    $scope.order.Fees = undefined;
                    return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:','error');
                }

                if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0) {
                if (fee.data > 0) {
                    $scope.order.Fees = [
                        {
                            Amount: fee.data,
                            Type: $scope.feeType,
                            Account: { AccountNumber: 0, Currency: 'AMD' },
                            Currency: 'AMD',
                            OrderNumber: $scope.order.OrderNumber,
                            Description: ($scope.order.Type == 56) ? $scope.order.Description : ""
                        }
                    ];
                }
                }
                else {
                    var hasFee = false;
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.order.Fees[i].Type == 5 || $scope.order.Fees[i].Type == 20 || $scope.order.Fees[i].Type == 11) {
                            if (fee.data > 0) {
                                hasFee = true;
                                $scope.order.Fees[i].Amount = fee.data;
                                if ($scope.order.Fees[i].Type == 56) $scope.order.Fees[i].Description = $scope.order.Description;
                            }
                            else if (fee.data == 0) {
                                $scope.order.Fees.splice(i, 1);
                            }
                        }
                        else if (hasFee == false && fee.data > 0) {
                            $scope.order.Fees.push({
                                Amount: fee.data,
                                Type: $scope.feeType,
                                Account: { AccountNumber: 0, Currency: 'AMD' },
                                Currency: 'AMD',
                                OrderNumber: $scope.order.Type == 56
                                    ? $scope.OrderNumberForFee
                                    : $scope.order.OrderNumber,
                                Description: ($scope.order.Type == 56) ? $scope.order.Description : ""
                            });
                        }

                    }
                }
                if ($scope.order.DebitAccount.AccountType == 11) {
                    $scope.FeeCurrency = $scope.order.DebitAccount.Currency;
                }
                if ($scope.order.TransferFee <= 0) {
                    $scope.order.TransferFee = null;
                    $scope.order.FeeAccount = "";
                }
            }, function () {
                alert('Error getfee');
            });

        }
        else if ($scope.order.Exaction)
        {
            if ($scope.order.Fees != undefined) {
                for (var i = 0; i < $scope.order.Fees.length; i++) {
                    $scope.order.TransferFee = null;
                    $scope.order.Fees.splice(i, 1);
                }
                $scope.order.Fees.push({
                    Amount: 0,
                    Type: 20,
                    Account: { AccountNumber: 0, Currency: 'AMD' },
                    Currency: 'AMD',
                    OrderNumber: $scope.order.OrderNumber,
                    Description: ""
                });
            }
            else {
                
                $scope.order.Fees = [{ Amount: 0, Type: 20, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: 'AMD', OrderNumber: $scope.order.OrderNumber, Description: "" }];
            }
           
        }

        else {
            $scope.order.TransferFee = null;
            //  $scope.order.FeeAccount = ""
        }

        $scope.getCardFee();
    };

    $scope.getCardFee = function () {

        if ($scope.order.DebitAccount != undefined) {
            if ($scope.order.DebitAccount.AccountType == 11 && $scope.order.DebitAccount.Currency != null && $scope.order.Amount != null && $scope.order.Amount > 0 && !$scope.order.Exaction) {
                var receiverAccount = 0;

                if ($scope.order.ReceiverAccount != undefined) {
                    receiverAccount = $scope.order.ReceiverAccount.AccountNumber;
                }
                if (receiverAccount != null && parseInt(receiverAccount.toString().substring(0, 5)) >= 22000 && parseInt(receiverAccount.toString().substring(0, 5)) < 22300) {
                    $scope.order.SubType = 1;
                }
                var Data = paymentOrderService.getCardFee($scope.order);

                Data.then(function (fee) {
                    $scope.order.CardFee = fee.data;
                    if (($scope.order.Fees == undefined || $scope.order.Fees.length == 0) && fee.data > 0) {
                        $scope.order.Fees = [{ Amount: fee.data, Type: 7, Account: $scope.order.DebitAccount, Currency: $scope.order.DebitAccount.Currency, OrderNumber: $scope.order.OrderNumber }];
                    }
                    else if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                        var hasCardFee = false;
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == 7) {
                                hasCardFee = true;
                                if (fee.data > 0) {
                                    $scope.order.Fees[i].Amount = fee.data;
                                    $scope.order.Fees[i].Account = $scope.order.DebitAccount;
                                    $scope.order.Fees[i].Currency = $scope.order.DebitAccount.Currency;
                                }
                                else {
                                    $scope.order.Fees.splice(i, 1);
                                }


                            }
                        }
                        if (hasCardFee == false && fee.data > 0) {
                            $scope.order.Fees.push({
                                Amount: fee.data,
                                Type: 7,
                                Account: $scope.order.DebitAccount,
                                Currency: $scope.order.DebitAccount.Currency,
                                OrderNumber: $scope.order.OrderNumber
                            });
                        }
                    }

                    if ($scope.order.DebitAccount.AccountType == 11) {
                        $scope.CardFeeCurrency = $scope.order.DebitAccount.Currency;
                    }
                    if ($scope.order.CardFee == 0) {
                        $scope.order.CardFee = null;
                    }
                }, function () {
                    alert('Error getcardfee');
                });

            }
            else {
                if ($scope.order.Fees != undefined) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.order.Fees[i].Type == 7) {
                            $scope.order.Fees.splice(i, 1);
                        }
                    }
                }
           
                $scope.order.CardFee = null;
                $scope.order.CardFeeCurrency = "";
            }
        }
    };



    $scope.saveBudgetPayment = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("budgetLoad").classList.remove("hidden");
            $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
        $scope.order.Attachments = [];

        if ($scope.orderAttachment.attachmentArrayBuffer != undefined && $scope.orderAttachment.attachmentArrayBuffer != null) {
            var oneAttachment = {};
            oneAttachment.Attachment = $scope.orderAttachment.attachmentArrayBuffer;
            oneAttachment.FileName = $scope.orderAttachment.attachmentFile.name;
            oneAttachment.FileExtension = $scope.orderAttachment.attachmentFile.getExtension();

            $scope.order.Attachments.push(oneAttachment);
        }

        $scope.setCreditorDocumentNumbers();

        var Data = paymentOrderService.saveBudgetPaymentOrder($scope.order);

        Data.then(function (res) {

            if (validate($scope, res.data)) {
                document.getElementById("budgetLoad").classList.add("hidden");
                CloseBPDialog('budgetpaymentorder');
                $scope.path = '#Orders';
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
            }
            else {
                document.getElementById("budgetLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            document.getElementById("budgetLoad").classList.add("hidden");
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            alert('Error in TransferArmPayment');
        });
    }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getCustomer = function (customerNumber) {
        var Data = customerService.getCustomer(customerNumber);
        Data.then(function (cust) {
            $scope.customer = cust.data;
            if (customerNumber == undefined) {
                if (cust.data.PhoneList != null) {
                    for (var i = 0; i < cust.data.PhoneList.length; i++) {
                        if (cust.data.PhoneList[i].phoneType.key == 1) {
                            $scope.order.MobilePhoneNumber = cust.data.PhoneList[i].phone.countryCode + cust.data.PhoneList[i].phone.areaCode + cust.data.PhoneList[i].phone.phoneNumber;
                        }
                        else {
                            $scope.order.HomePhoneNumber = cust.data.PhoneList[i].phone.countryCode + cust.data.PhoneList[i].phone.areaCode + cust.data.PhoneList[i].phone.phoneNumber;
                        }
                    }
                }
                if (cust.data.EmailList != null) {
                    if (cust.data.EmailList.length > 1) {
                        $scope.FirstAddress = cust.data.EmailList[0];
                        $scope.SecondAddress = cust.data.EmailList[1];
                    }
                    else {
                        $scope.FirstAddress = cust.data.EmailList[0];
                    }
                }

                $scope.order.Password = cust.data.SecurityCode;
            }
            else {
                $scope.order.CreditorCustomerNumber = $scope.customer.CustomerNumber;
                $scope.order.CreditorDescription = $scope.customer.FirstName + ' ' + $scope.customer.LastName;
                $scope.budgetPaymentOrderForm.CreditorDocumentNumber3 = $scope.customer.DocumentNumber + ' ' + $scope.customer.DocumentGivenDate;
            }


        }, function () {
            alert('Error');
        });
    };



    //Ստացողի Բանկի որոշում` ըստ ելքագրվող հաշվի
    $scope.setReceiverBank = function () {
        if ($scope.order.ReceiverAccount != null && $scope.order.ReceiverAccount.AccountNumber != 0) {
            var receiver_account = $scope.order.ReceiverAccount.AccountNumber;
        }

        if (receiver_account != "" && receiver_account != undefined) {

            var Data = paymentOrderService.getBank(receiver_account.toString().substr(0, 5));
            Data.then(function (result) {
                $scope.ReceiverBank = result.data;
                if ($scope.ReceiverBank == "") {
                    $scope.ReceiverBank = "Ստացողի բանկը գտնված չէ";
                }
            }, function () {
                alert('Error in receiverAccountChanged');
            });
            $scope.ReceiverBankCode = receiver_account.toString().substr(0, 5);
        }
        else {
            $scope.ReceiverBank = "";
        }

    };

    $scope.getAccountDescription = function (account) {
        if (account.AccountType == 11) {
            return account.AccountDescription + ' ' + account.Currency;
        }
        else {
            return account.AccountNumber + ' ' + account.Currency;
        }
    };

    //Բյուջետային փոխանցումների համար անհրաժեշտ դաշտերի զրոյացում/լրացում
    $scope.setBudgetTransferParameters = function () {


        $scope.budgetPaymentOrderForm.CreditorDocumentNumber1 = null;
        $scope.budgetPaymentOrderForm.CreditorDocumentNumber2 = null;
        $scope.budgetPaymentOrderForm.CreditorDocumentNumber3 = null;
        $scope.budgetPaymentOrderForm.CreditorDocumentNumber4 = null;
        $scope.budgetPaymentOrderForm.CreditorDeathDocument = null;
        $scope.order.CreditorDocumentType = null;
        if (!$scope.IsPoliceViloation)
            $scope.order.LTACode = null;

        $scope.order.PoliceCode = null;
        $scope.order.CreditorStatus = null;
        $scope.order.CreditorDescription = null;


    };



    //Փաստաթղթի զրոյացում
    $scope.clearDocumentNumber = function (documentType, forCreditor) {
 
            if (documentType == 1)
                $scope.budgetPaymentOrderForm.CreditorDocumentNumber1 = null;
            else if (documentType == 2)
                $scope.budgetPaymentOrderForm.CreditorDocumentNumber2 = null;
     
    };

    //Վճարման հանձնարարականի տպում
    $scope.getBudgetPaymentOrderDetails = function (isCopy) {
        if ($http.pendingRequests.length == 0) {
        if (isCopy == undefined)
            isCopy = false;
        if (isCopy == false) {
            $scope.setCreditorDocumentNumbers();
        }

            if (!$scope.IsPoliceViloation && isCopy == false && ($scope.order.PoliceResponseDetailsId == 0 || $scope.order.PoliceResponseDetailsId == undefined) && ($scope.order.ReceiverAccount.AccountNumber == '900013150058' || $scope.order.ReceiverAccount.AccountNumber == '900013150025')) {
                var Data = paymentOrderService.getPoliceResponseDetailsIDWithoutRequest($scope.order.ViolationID, $scope.order.ViolationDate);
                Data.then(function (responseID) {
                    $scope.order.PoliceResponseDetailsId = responseID.data;

                    showloading();
                    var Data = paymentOrderService.getBudgetPaymentOrderDetails($scope.order, isCopy);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getBudgetPaymentOrderDetails');
                    });

                }, function () {
                    alert('error getPoliceResponseDetailsIDWithoutRequest');
                });
            }
            else {

                showloading();
                var Data = paymentOrderService.getBudgetPaymentOrderDetails($scope.order, isCopy);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getBudgetPaymentOrderDetails');
                });
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getPoliceResponseDetailsIDWithoutRequest = function () {
        if (!$scope.IsPoliceViloation &&  ($scope.order.PoliceResponseDetailsId == 0 || $scope.order.PoliceResponseDetailsId == undefined) && ($scope.order.ReceiverAccount.AccountNumber == '900013150058' || $scope.order.ReceiverAccount.AccountNumber == '900013150025')) {
            var Data = paymentOrderService.getPoliceResponseDetailsIDWithoutRequest($scope.order.ViolationID, $scope.order.ViolationDate);
            Data.then(function (responseID) {
                $scope.order.PoliceResponseDetailsId = responseID.data;
               
            }, function () {
                alert('error getPoliceResponseDetailsIDWithoutRequest');
            });
            return true;
        }
        else
            return true;
    };

    $scope.getOperationsList = function () {
        var Data = infoService.GetOperationsList();
        Data.then(function (list) {
            $scope.operations = [];
            for (var key in list.data) {
                $scope.operations.push(list.data[key]);
            }

        }, function () {
            alert('error');
        });

    };

    $scope.$watch('order.FeeAccount', function (newValue, oldValue) {
        if ($scope.details != true) {
            if (($scope.feeType == '2' || $scope.feeType == '4' || $scope.feeType == '9' || $scope.feeType == '20' || $scope.feeType == '11') && $scope.order.Fees != null) {
                for (var i = 0; i < $scope.order.Fees.length; i++) {
                    if ($scope.order.Fees[i].Type == $scope.feeType) {
                        $scope.order.Fees[i].Account = $scope.order.FeeAccount;
                    }
                }
            }
        }
    });

    $scope.callbackgetBudgetPaymentOrder = function () {
        $scope.getBudgetPaymentOrder($scope.selectedOrderId);
    };

    $scope.getCreditorCustomer = function (customerNumber) {

        $scope.resetCreditorDocumentNumbers();

        var Data = customerService.getCustomer(customerNumber);
        Data.then(function (cust) {
            $scope.creditorCustomer = cust.data;
            if ( $scope.creditorCustomer!=undefined)
            {
      
                 $scope.getCustomerSyntheticStatus(customerNumber);
                $scope.order.CreditorCustomerNumber = $scope.creditorCustomer.CustomerNumber;
                if ($scope.creditorCustomer.CustomerType == 6) {

                    $scope.order.CreditorDescription = $scope.creditorCustomer.FirstName + ' ' + $scope.creditorCustomer.LastName;
                    if ($scope.creditorCustomer.Residence == 1) {
                        if ($scope.creditorCustomer.SocCardNumber != "") {
                            $scope.order.CreditorDocumentType = 1;
                            $scope.clearDocumentNumber(2, 1);
                            $scope.budgetPaymentOrderForm.CreditorDocumentNumber1 = $scope.creditorCustomer.SocCardNumber;
                        }
                        else if ($scope.creditorCustomer.NoSocCardNumber != "") {
                            $scope.order.CreditorDocumentType = 2;
                            $scope.clearDocumentNumber(1, 1);
                            $scope.budgetPaymentOrderForm.CreditorDocumentNumber2 = $scope.creditorCustomer.NoSocCardNumber;
                        }
                    }
                    else {
                            $scope.budgetPaymentOrderForm.CreditorDocumentNumber3 = $scope.creditorCustomer.DocumentNumber + ' ' + $scope.creditorCustomer.DocumentGivenDate;
                         }

                    }
                else {
                    $scope.order.CreditorDocumentType = 4;
                    $scope.order.CreditorDescription = $scope.creditorCustomer.OrganisationName;
                    $scope.budgetPaymentOrderForm.CreditorDocumentNumber4 = $scope.creditorCustomer.TaxCode;
                }

            }
        }, function () {
            alert('Error');
        });
    };

    $scope.getCustomerSyntheticStatus = function (customerNumber) {
        var Data = customerService.getCustomerSyntheticStatus(customerNumber);
        Data.then(function (cust) {
            $scope.order.CreditorStatus = cust.data.toString();
            if ($scope.order.CreditorStatus == 12 | $scope.order.CreditorStatus == 22)
            {
                $scope.order.CreditorStatus = null;
            }
        }, function () {
            alert('Error');
        });
    };
    $scope.searchCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });


        $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
    $scope.getSearchedCustomer = function (customer) {
        $scope.getCreditorCustomer(customer.customerNumber);
        $scope.closeSearchCustomersModal();
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };

    $scope.setDeathDetails = function () {
        if ($scope.budgetPaymentOrderForm.Death == 1) {
            var Data = utilityService .convertAnsiToUnicode( $scope.creditorCustomer.DeathDocument);
            Data.then(function (text) {
                $scope.creditorCustomer.DeathDocument = text.data.toString();
                $scope.order.CreditorDeathDocument = $scope.creditorCustomer.DeathDocument;
            }, function () {
                alert('Error');
            });
            $scope.order.CreditorDocumentType = 0;
            $scope.budgetPaymentOrderForm.CreditorDocumentNumber1 = "";
            $scope.budgetPaymentOrderForm.CreditorDocumentNumber2 = "";
        }
        else {
            $scope.order.CreditorDeathDocument = undefined;
        }
    };




    $scope.searchTransfersBankMail = function () {
        if ($scope.order.DebitAccount != undefined) {
            if ($scope.order.Type == 56) {

                var Data = utilityService.getOperationSystemAccount($scope.order,1, $scope.order.DebitAccount.Currency);
                Data.then(function (acc) {
                    $scope.accNumber = acc.data.AccountNumber;
                    $scope.openSearchTransfersBankMailModal();
                },
                function () {
                    alert('Error getOperationSystemAccount');
                });

            }
            else {
                $scope.accNumber = $scope.order.DebitAccount.AccountNumber;
                $scope.openSearchTransfersBankMailModal();
            }
        }
        else {
            $scope.accNumber = null;
            $scope.openSearchTransfersBankMailModal();
        }

        $scope.searchTransfersBankMailModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.openSearchTransfersBankMailModal = function () {
        $scope.searchTransfersBankMailModalInstance = $uibModal.open({

            template: '<searchtransferbankmail callback="getSearchedTransferBankMail(transferBankMail)" close="closeSearchTransfersBankMailModal()" accnumber="' + $scope.accNumber + '" isbudget=1></searchtransferbankmail>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    };

    $scope.getSearchedTransferBankMail = function (transferBankMail) {
        $scope.order.ReceiverAccount = { AccountNumber: transferBankMail.ReceiverAccount };
        $scope.receiverAccountAfterApdate();
        $scope.order.Receiver = transferBankMail.ReceiverName;
        $scope.ReceiverBank = transferBankMail.ReceiverBank;
        $scope.order.Description = transferBankMail.DescriptionForPayment;
        $scope.order.LTACode = transferBankMail.SenderRegCode;
     
        $scope.closeSearchTransfersBankMailModal();
    };

    $scope.closeSearchTransfersBankMailModal = function () {
        $scope.searchTransfersBankMailModalInstance.close();
    };


    $scope.searchBudgetAccount = function () {

        if ($scope.order.ReceiverAccount != undefined) {
            $scope.accNumber = $scope.order.ReceiverAccount.AccountNumber;
                $scope.openSearchBudgetAccountModal();
            }
        else {
            $scope.accNumber = null;
            $scope.openSearchBudgetAccountModal();
        }

        $scope.searchBudgetAccountModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.openSearchBudgetAccountModal = function () {
        $scope.searchBudgetAccountModalInstance = $uibModal.open({

            template: '<searchbudgetaccount callback="getSearchedBudgetAccount(budgetAccount)" close="closeSearchBudgetAccountModal()" accnumber="' + $scope.accNumber + '"></searchbudgetaccount>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    };

    $scope.receiverAccountAfterApdate = function () {
       // $scope.isPoliceAccount();
        $scope.checkAccountForPSN();
        $scope.setReceiverBank();
        $scope.order.UrgentSign = false;
        $scope.getFee();
        $scope.getPoliceCodes($scope.order.ReceiverAccount.AccountNumber);
    };


    $scope.getSearchedBudgetAccount = function (budgetAccount) {
 
        $scope.order.ReceiverAccount = { AccountNumber: budgetAccount.AccountNumber };
        $scope.order.Receiver = budgetAccount.Description;
        $scope.receiverAccountAfterApdate();
        $scope.closeSearchBudgetAccountModal();
      
    };

    $scope.closeSearchBudgetAccountModal = function () {
        $scope.searchBudgetAccountModalInstance.close();
    };


    //Մուտք տարանցիկ հաշվին (Կանխիկ մուտք) ստուգում է որ արժույթը ընտրված լինի
    //Մուտք տարանցիկ հաշվին (Կանխիկ մուտք) ստուգում է որ արժույթը ընտրված լինի
    $scope.checkDebitAccountForTransitPaymentOrder = function () {
        $scope.checkForTransit = false;
        if ($scope.order.DebitAccount != undefined && $scope.order.DebitAccount.AccountNumber != undefined) {
            if ($http.pendingRequests.length == 0) {
                if ($scope.budgetPaymentOrderForm.ForCreditor == true)
                    $scope.setCreditorDocumentNumbers();
                $scope.params = { paymentOrder: $scope.order };
                $scope.checkForTransit = true;
                return true;
            }
            else {
                ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել կոճակը:', 'error');
                return false;
            }



        }
        else {
            return false;
        }
    };

    $scope.generateNewOrderNumberForFee = function () {
        if ($scope.OrderNumberForFee == undefined) {
            var Data = orderService.generateNewOrderNumber(1);
            Data.then(function (nmb) {
                $scope.OrderNumberForFee = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        }
    };

    $scope.$watch('order.Description', function () {
        if ($scope.details != true) {
            if ($scope.order.Fees != undefined && $scope.order.Fees.length == 1) {
                $scope.order.Fees[0].Description = $scope.order.Description;
            }
        }
    });

    $scope.getSpecialPriceWarnings = function () {
        if ($scope.order.Type == 1) {
            if ($scope.order.DebitAccount != null && $scope.order.DebitAccount.AccountNumber != null) {
                var Data = paymentOrderService.getSpecialPriceWarnings($scope.order.DebitAccount.AccountNumber, 3);
                Data.then(function (acc) {
                    $scope.warnings = acc.data;
                }, function () {
                    alert('Warning Error');
                });
            }
        }
        else {
            $scope.warning = undefined;
        }
    };

    $scope.getAllBankOperationFeeTypes = function () {
        var Data = infoService.GetBankOperationFeeTypes(3);
        Data.then(function (type) {
            $scope.allFeeTypes = type.data;
        }, function () {
            alert('getAllBankOperationFeeTypes');
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
        $scope.resetCreditorDocumentNumbers = function () {
            $scope.order.CreditorDescription = '';
            $scope.order.CreditorDocumentNumber = '';
            $scope.budgetPaymentOrderForm.CreditorDocumentNumber1 = '';
            $scope.budgetPaymentOrderForm.CreditorDocumentNumber2 = '';
            $scope.budgetPaymentOrderForm.CreditorDocumentNumber3 = '';
            $scope.budgetPaymentOrderForm.CreditorDocumentNumber4 = '';
            $scope.order.CreditorCustomerNumber = '';
            $scope.budgetPaymentOrderForm.CreditorDeathDocument = '';
            $scope.order.CreditorDeathDocument = '';
            $scope.budgetPaymentOrderForm.Death = 0;
            if ($scope.order.CreditorStatus != '10' && $scope.order.CreditorStatus != '20')
                $scope.order.CreditorDocumentType = 4;
            else
                $scope.order.CreditorDocumentType = 0;
        };

        $scope.setCreditorDocumentNumbers = function () {
            if ($scope.order.CreditorDocumentType == 1)
                $scope.order.CreditorDocumentNumber = $scope.budgetPaymentOrderForm.CreditorDocumentNumber1;
            else if ($scope.order.CreditorDocumentType == 2)
                $scope.order.CreditorDocumentNumber = $scope.budgetPaymentOrderForm.CreditorDocumentNumber2;
            else if ($scope.order.CreditorStatus != null && $scope.order.CreditorStatus == '20') {
                $scope.order.CreditorDocumentType = 3;
                $scope.order.CreditorDocumentNumber = $scope.budgetPaymentOrderForm.CreditorDocumentNumber3;
            }
            else if ($scope.order.CreditorStatus != '10' && $scope.order.CreditorStatus != null) {
                $scope.order.CreditorDocumentType = 4;
                $scope.order.CreditorDocumentNumber = $scope.budgetPaymentOrderForm.CreditorDocumentNumber4;
            }
        };


        $scope.$watchGroup(['order.DebitAccount.Currency', 'feeAccounts', 'order.Type', 'order.DebitAccount.AccountNumber'], function (newValues, oldValues) {

            if ($scope.order.DebitAccount != undefined && $scope.feeAccounts != undefined) {
                if ($scope.order.DebitAccount.Currency == 'AMD') {
                    $scope.feeAccountNumber = $scope.order.DebitAccount.AccountNumber;
                }
                else {
                    $scope.feeAccountNumber = $scope.feeAccounts[0].AccountNumber;
                }
            }

    });

    $scope.isUrgentTime = function () {
        $scope.isUrgentTime = false;

        var Data = paymentOrderService.isUrgentTime();
        Data.then(function (acc) {
            $scope.isUrgentTime = acc.data;
        }, function () {
            alert('Error isUrgentTime');
        });

    };

}]);