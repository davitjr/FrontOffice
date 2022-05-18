app.controller("PaymentOrderCtrl", ['$scope', 'paymentOrderService', 'utilityService', 'accountService', 'customerService', 'infoService', 'dialogService', 'orderService', '$uibModal', '$http', 'limitToFilter', '$confirm', '$filter', 'currencyExchangeOrderService', 'casherService', '$timeout', '$controller', 'transitAccountsForDebitTransactionsService', 'leasingFactory', 'LeasingService', 'ReportingApiService',
    function ($scope, paymentOrderService, utilityService, accountService, customerService, infoService, dialogService, orderService, $uibModal, $http, limitToFilter, $confirm, $filter, currencyExchangeOrderService, casherService, $timeout, $controller, transitAccountsForDebitTransactionsService, leasingFactory, LeasingService, ReportingApiService) {

        $scope.lim = false;
        $scope.freezedAmount = false;
        $scope.isCheckedHBReestr = false;
        $scope.reestrHasDAHK = false;
        $scope.creditlinetype = false;
        $scope.error = [];
        $scope.showFeeTypeBlock = true;
        $scope.confirmLeasingOrder = false;
        $scope.confirmLeasingInsuranceOrder = false;
        $scope.selectedLeasingInsuranceId = 0;
        $scope.selectedLeasingInsuranceAmount = 0;

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

        $scope.getSourceType = function () {
            $scope.sourceType = $scope.$root.SessionProperties.SourceType;
        };

        $scope.setOrderSubType = function () {
            if ($scope.order.Type == 1) {

                if ($scope.checkForDebitAccountTransferArmPayment != undefined) {
                    $scope.order.SubType = 2;//ՀՀ տարածքում
                }
                else {
                    if ($scope.forBankTransfers == true) {
                        $scope.order.SubType = 1;//սեփական հաշիվների(3) միջև կամ բանկի ներսում(1)
                    }
                    else {
                        $scope.order.SubType = 3;//սեփական հաշիվների(3) միջև կամ բանկի ներսում(1)
                    }
                }
            }
            else {
                $scope.order.SubType = 1;
            }

        }


        //Փոխանցման տեսակի և ենթատեսակի որոշում
        $scope.setOrderType = function () {

            if ($scope.order.DebitAccount != undefined && $scope.order.ReceiverAccount.Currency != undefined) {
                if ($scope.order.DebitAccount.Currency != $scope.order.ReceiverAccount.Currency && ($scope.order.DebitAccount.AccountNumber == 0 && $scope.order.ReceiverAccount.AccountNumber == 0)) {
                    $scope.order.Type = 53;
                }
                else
                    if ($scope.order.DebitAccount.Currency == $scope.order.ReceiverAccount.Currency) {
                        if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 0) {
                            $scope.order.Type = 1;//RATransfer
                            if ($scope.forBankTransfers == true) {
                                $scope.order.SubType = 1;//սեփական հաշիվների(3) միջև կամ բանկի ներսում(1)
                            }
                            else {
                                $scope.order.SubType = 3;//սեփական հաշիվների(3) միջև կամ բանկի ներսում(1)
                            }
                        }
                        if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1) {
                            $scope.order.Type = 52;
                            $scope.order.SubType = 1;
                        }
                        if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 0) {
                            $scope.order.Type = 51;
                            $scope.order.SubType = 1;
                        }
                    }
                    else {

                        if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 0) {
                            $scope.order.Type = 2;//Convertation
                            $scope.order.SubType = 0;
                        }
                        if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1) {
                            $scope.order.Type = 55;
                        }
                        if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 0) {
                            $scope.order.Type = 54;
                        }
                    }
            }
        }

        $scope.getOrderNumberType = function () {
            //$scope.setOrderType();
            if ($scope.periodic != undefined)
                $scope.orderNumberType = 9;
            else if ($scope.order.Type == 1 || $scope.order.Type == 56)
                if ($scope.order.Type == 1 && $scope.order.SubType == 3) {
                    $scope.orderNumberType = 10;
                }
                else {
                    $scope.orderNumberType = 6;
                }
            else if ($scope.order.Type == 51 || $scope.order.Type == 63 || $scope.order.Type == 95 || $scope.order.Type == 122)
                $scope.orderNumberType = 1;
            else if ($scope.order.Type == 52 || $scope.order.Type == 84 || $scope.order.Type == 133)
                $scope.orderNumberType = 2;
            else if ($scope.order.Type == 85)
                $scope.orderNumberType = 10;
            else if ($scope.order.Type == 2 || $scope.order.Type == 53 || $scope.order.Type == 54 || $scope.order.Type == 55)
                $scope.orderNumberType = 7;
            else if ($scope.order.Type == 83)
                $scope.orderNumberType = 5;
            else if ($scope.order.Type == 86 || $scope.order.Type == 90)
                $scope.orderNumberType = 6;
        };
        $scope.disableDebitAccount = false;
        if ($scope.order == undefined) {
            $scope.order = {};
            //$scope.order.Amount = 0;
            $scope.order.RegistrationDate = new Date();
            $scope.order.OrderNumber = "";
            $scope.order.Type = $scope.orderType;
            if ($scope.order.Type == 122) {
                $scope.disableDebitAccount = true;
            }
            if ($scope.orderType == 83) {
                //Քարտի սպասարկման միջնորդավճարի գանձում
                $scope.order.AdditionalParametrs = [{ AdditionValue: $scope.cardProductId, Id: 99 }];
            }

            if ($scope.interBankTransfer) {
                $scope.order.Type = 90;
            }

            if ($scope.interBankTransferCash) {
                $scope.order.Type = 86;
            }

            $scope.order.ReceiverAccount = {};
            $scope.additional = "";
            $scope.getSourceType();
            $scope.orderAttachment = {};
            $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

            if ($scope.transfer != undefined) {
                $scope.disableDebitAccount = true;
                $scope.order.TransferID = $scope.transfer.Id;
                $scope.order.Amount = ($scope.transfer.Amount - $scope.transfer.PaidAmount).toFixed(2);
                $scope.order.DebitAccount = {};
                $scope.order.DebitAccount = $scope.transfer.DebitAccount;
                //$scope.order.ReceiverAccount = $scope.transfer.CreditAccount;
                if ($scope.transfer.IsCallCenter == 1)
                    $scope.showCustomerInfo = true;
                if ($scope.transfer.CustomerNumber != undefined && $scope.transfer.TransferGroup != 4)
                    $scope.order.CustomerNumber = $scope.transfer.CustomerNumber;
                else {
                    var Data = customerService.getAuthorizedCustomerNumber();
                    Data.then(function (descr) {
                        $scope.order.CustomerNumber = descr.data;
                        $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

                    });
                }
                //$scope.order.ReceiverAccount.Currency = $scope.transfer.CreditAccount.Currency;
                if ($scope.transfer.TransferGroup == 4)
                    $scope.strForDescription = $scope.transfer.Receiver + ' (' + $scope.transfer.UnicNumber + ')';
                else
                    $scope.strForDescription = '(' + $scope.transfer.TransferSystemDescription + ' ' + $scope.transfer.SenderReferance + ')';

                if ($scope.order.Type == 84)
                    $scope.description = 'Գումարի վճարում ' + $scope.strForDescription;
                else
                    $scope.description = 'Փոխանցման հաստատում ' + $scope.strForDescription;
                //var DataCust = customerService.getAuthorizedCustomerNumber();
                //DataCust.then(function (descr) {
                //    if (descr.data == undefined || descr.data == 0 || descr.data == null)
                //        $scope.showOPPerson = true
                //    else
                //        $scope.showOPPerson = false
                //})

                var DataOPPerson = orderService.setOrderPerson($scope.transfer.CustomerNumber);
                DataOPPerson.then(function (ord) {
                    $scope.order.OPPerson = ord.data;
                    $scope.order.OPPerson.PersonBirth = new Date(parseInt(ord.data.PersonBirth.substr(6)));
                }, function () {
                    alert('Error CashTypes');
                });


            }
            else if ($scope.swiftMessage != undefined) {
                $scope.disableDebitAccount = true;
                //var Data = accountService.getAccountInfo($scope.swiftMessage.ReceiverAccount);
                //Data.then(function (acc) {
                //    $scope.order.ReceiverAccount = acc.data;
                //}, function () {

                //    alert('Error getAccount');
                //});
                if ($scope.swiftMessage.CreditAccount != undefined) {
                    $scope.order.ReceiverAccount = $scope.swiftMessage.CreditAccount;
                    $scope.order.ReceiverAccount.Description = $scope.order.ReceiverAccount.AccountDescription;
                }
                else {
                    $scope.order.ReceiverAccount.AccountNumber = $scope.swiftMessage.ReceiverAccount;
                    $scope.order.Description = $scope.swiftMessage.Description;
                    $scope.order.Receiver = $scope.swiftMessage.Receiver;
                }
                $scope.$parent.receiverAccountAccountNumber = $scope.swiftMessage.ReceiverAccount;

                $scope.order.SwiftMessageID = $scope.swiftMessage.ID;
                $scope.order.CustomerNumber = $scope.swiftMessage.CustomerNumber;
                $scope.order.Amount = $scope.swiftMessage.Amount;
                $scope.description = $scope.swiftMessage.Description;
                var DataOPPerson = orderService.setOrderPerson($scope.swiftMessage.CustomerNumber);
                DataOPPerson.then(function (ord) {
                    $scope.order.OPPerson = ord.data;
                    $scope.order.OPPerson.PersonBirth = new Date(parseInt(ord.data.PersonBirth.substr(6)));
                }, function () {
                    alert('Error CashTypes');
                });

            }
            else {
                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function (descr) {
                    $scope.order.CustomerNumber = descr.data;
                    $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

                });
            }
        }



        ////Գումար դաշտը ցույց տալու համար եթե 1 է ցույց է տալի եթե 2 փակում է
        //$scope.getAccountsForOrder = function (orderType, orderSubType, accountType) {
        //    var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, accountType);
        //    Data.then(function (acc) {
        //        if (accountType == 1) {
        //            $scope.debitAccounts = acc.data;
        //        }

        //        else if (accountType == 2) {
        //            $scope.creditAccounts = acc.data
        //        }
        //        else {
        //            $scope.feeAccounts = acc.data;

        //        }
        //    }, function () {
        //        alert('Error getaccounts');
        //    });

        //};

        $scope.seterror = function (error) {
            $scope.error = error;
        }

        $scope.setCustomerNumber = function (value) {
            $scope.order.Amount = value;
        };

        $scope.getDebitAccounts = function (orderSubType) {
            var orderType = $scope.order.Type;
            if ($scope.forBankTransfers) {
                orderSubType = 1;
            }


            if ($scope.checkForDebitAccount == 0 || $scope.checkForDebitAccountTransferArmPayment == 0 || $scope.periodic != undefined) {

                if ($scope.order.Type == 133) {
                    $scope.getTransitAccountsForDebitTransactions();
                }
                else if ($scope.swiftMessage != undefined) {
                    var Data = paymentOrderService.getCustomerAccountsForOrder($scope.swiftMessage.CustomerNumber, orderType, orderSubType, 2);
                    Data.then(function (acc) {
                        $scope.debitAccounts = acc.data;

                        $scope.DebitAccount = $.grep($scope.debitAccounts, function (v) { return v.AccountNumber === $scope.swiftMessage.Account.AccountNumber.toString(); })[0]
                        $scope.DebitAccountNumber = $scope.DebitAccount.AccountNumber;
                        $scope.checkForDebitAccount = 0;
                        if ($scope.swiftMessage.CreditAccount == undefined) {
                            $scope.order.DebitAccount = $scope.DebitAccount
                            $scope.getBankOperationFeeTypes();

                            $scope.receiverAccountAfterApdate();
                        }
                    }, function () {
                        alert('Error getcreditaccounts');
                    });

                }
                else {

                    if ($scope.periodic != undefined) {
                        orderType = 10;
                        orderSubType = 1;
                        if ($scope.periodic == 4)
                            orderSubType = 5;
                        if ($scope.periodic == 2)
                            orderSubType = 3;
                    }
                    else {
                        orderType = $scope.order.Type;
                    }
                    var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 1);
                    Data.then(function (acc) {
                        $scope.debitAccounts = acc.data;
                    }, function () {
                        alert('Error getdebitaccounts');
                    });
                }
            }

        };

        $scope.getCreditAccounts = function (orderType, orderSubType) {
            if ($scope.transfer != undefined) {
                if ($scope.transfer.TransferGroup == 4)
                    var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 2);
                else
                    var Data = paymentOrderService.getCustomerAccountsForOrder($scope.transfer.CustomerNumber, orderType, orderSubType, 2);
                Data.then(function (acc) {
                    $scope.creditAccounts = acc.data;
                    if ($scope.order.Type == 85 && $.grep($scope.creditAccounts, function (v) { return v.AccountNumber === $scope.transfer.CreditAccount.AccountNumber.toString(); })[0] != undefined) {
                        $scope.ReceiverAccount = $.grep($scope.creditAccounts,
                            function (v) {
                                return v.AccountNumber === $scope.transfer.CreditAccount.AccountNumber.toString();
                            })[0];
                        $scope.AccountNumber = $scope.ReceiverAccount.AccountNumber;
                        $scope.$parent.checkForReciverAccount = 0;
                    }


                }, function () {
                    alert('Error getcreditaccounts');
                });
            }
            else {
                if ($scope.checkForReciverAccount == 0) {
                    var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 2);
                    Data.then(function (acc) {
                        $scope.creditAccounts = acc.data;
                    }, function () {
                        alert('Error getcreditaccounts');
                    });
                }
            }
        };

        $scope.getFeeAccounts = function (orderType, orderSubType) {
            if ($scope.checkForFeeAccount == 0 && $scope.order.Type != 56 && $scope.order.Type != 83 && $scope.order.Type != 86) {
                if ($scope.swiftMessage != undefined) {
                    var Data = paymentOrderService.getCustomerAccountsForOrder($scope.swiftMessage.CustomerNumber, orderType, orderSubType, 3);
                    Data.then(function (acc) {
                        $scope.feeAccounts = acc.data;
                    }, function () {
                        alert('Error getfeeaccounts');
                    });
                }
                else {
                    var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
                    Data.then(function (acc) {
                        $scope.feeAccounts = acc.data;
                    }, function () {
                        alert('Error getfeeaccounts');
                    });
                }
            }
        };

        $scope.getPaymentOrder = function (orderID) {
            var Data = paymentOrderService.getPaymentOrder(orderID);
            Data.then(function (acc) {

                $scope.order = acc.data;
                $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
                $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");

                if ($scope.order.Fees.length > 0) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.FeesString == undefined) {
                            $scope.FeesString = '';
                        }
                        if ($scope.order.Fees[i].Account != null) {
                            $scope.FeesString += '\n' + $scope.order.Fees[i].Account.AccountNumber + '-ից' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription;
                        }
                        else {
                            var descriptionForRejectFeeType = "";
                            if ($scope.order.Fees[i].DescriptionForRejectFeeType != null) {
                                descriptionForRejectFeeType = 'Չգանձման պատճառ :' + $scope.order.Fees[i].DescriptionForRejectFeeType;
                            }

                            var rejectFeeTypeDescription = "";
                            if ($scope.order.Fees[i].RejectFeeTypeDescription != null) {
                                rejectFeeTypeDescription = 'Չգանձման պատճառ :' + $scope.order.Fees[i].RejectFeeTypeDescription;
                            }

                            if (rejectFeeTypeDescription != "") {
                                $scope.FeesString += '\n' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription + ' ' + rejectFeeTypeDescription;
                            }
                            else {
                                $scope.FeesString += '\n' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription + ' ' + descriptionForRejectFeeType;
                            }

                        }

                    }
                }

                if ($scope.$root.SessionProperties.IsCalledFromHB == true && $scope.order.Type == 1 && $scope.order.SubType == 1) {

                    if ($scope.order.Type == 1 && $scope.order.ArmPaymentType != 0 && $scope.order.CreditorHasDAHK == true) {
                        $scope.order.ArmPaymentType = $scope.order.ArmPaymentType.toString();
                    }

                }

                if ($scope.$root.SessionProperties.IsCalledFromHB == true && $scope.order.Type == 1) {

                    $scope.getSintAccounts();
                }


            }, function () {
                alert('Error getPaymentOrder');
            });

        };

        $scope.getReestrTransferOrder = function (orderID) {
            var Data = paymentOrderService.getReestrTransferOrder(orderID);
            Data.then(function (acc) {

                $scope.order = acc.data;
                $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
                $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");

                if ($scope.order.Fees.length > 0) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.FeesString == undefined) {
                            $scope.FeesString = '';
                        }
                        if ($scope.order.Fees[i].Account != null) {
                            $scope.FeesString += '\n' + $scope.order.Fees[i].Account.AccountNumber + '-ից' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription;
                        }
                        else {
                            $scope.FeesString += '\n' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription;
                        }

                    }
                }

                if ($scope.$root.SessionProperties.IsCalledFromHB == true) {
                    $scope.isCheckedHBReestr = sessionStorage.getItem("isCheckedHBReestr");
                    if ($scope.isCheckedHBReestr == "true") {
                        $scope.checkTransactionIsChecked();
                    }
                }

            }, function () {
                alert('Error getPaymentOrder');
            });

        };

        $scope.getCurrencyExchangeOrder = function (orderID) {
            var Data = paymentOrderService.getCurrencyExchangeOrder(orderID);
            Data.then(function (acc) {

                $scope.order = acc.data;
                $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
                $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");

                if ($scope.order.OPPerson != undefined && $scope.order.OPPerson.PersonDocument != undefined && $scope.order.OPPerson.PersonDocument != '')
                    $scope.order.HasPassport = true;

                if ($scope.order.Fees.length > 0) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.FeesString == undefined) {
                            $scope.FeesString = '';
                        }
                        if ($scope.order.Fees[i].Account != null) {
                            $scope.FeesString += '\n' + $scope.order.Fees[i].Account.AccountNumber + '-ից' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription;
                        }
                        else {

                            var descriptionForRejectFeeType = "";
                            if ($scope.order.Fees[i].DescriptionForRejectFeeType != null) {
                                descriptionForRejectFeeType = 'Չգանձման պատճառ :' + $scope.order.Fees[i].DescriptionForRejectFeeType;
                            }

                            var rejectFeeTypeDescription = "";
                            if ($scope.order.Fees[i].RejectFeeTypeDescription != null) {
                                rejectFeeTypeDescription = 'Չգանձման պատճառ :' + $scope.order.Fees[i].RejectFeeTypeDescription;
                            }

                            if (rejectFeeTypeDescription != "") {
                                $scope.FeesString += '\n' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription + ' ' + rejectFeeTypeDescription;
                            }
                            else {
                                $scope.FeesString += '\n' + ' ' + $scope.order.Fees[i].Amount + ' ' + $scope.order.Fees[i].Currency + ' ' + $scope.order.Fees[i].TypeDescription + ' ' + descriptionForRejectFeeType;
                            }



                        }

                    }
                }

                if ($scope.$root.SessionProperties.IsCalledFromHB == true && $scope.order.Type == 2) {
                    $scope.getSintAccounts();
                }

            }, function () {
                alert('Error getPaymentOrder');
            });

        };


        $scope.setTransferArmCurrency = function () {
            $scope.order.Currency = $scope.order.DebitAccount.Currency;
        }




        $scope.getFee = function () {
            $scope.setOrderSubType();
            $scope.setCurrency();
            $scope.generateNewOrderNumberForFee();
            if ($scope.order.Type == 51 || $scope.order.Type == 52 || $scope.order.Type == 95 || $scope.order.Type == 133) {

                if ($scope.feeType == 0) {
                    if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == 1 || $scope.order.Fees[i].Type == 2 ||
                                $scope.order.Fees[i].Type == 3 || $scope.order.Fees[i].Type == 4 ||
                                $scope.order.Fees[i].Type == 5 || $scope.order.Fees[i].Type == 6 ||
                                $scope.order.Fees[i].Type == 8 || $scope.order.Fees[i].Type == 9 ||
                                $scope.order.Fees[i].Type == 28 || $scope.order.Fees[i].Type == 29) {
                                $scope.order.Fees.splice(i, 1);
                            }
                        }
                    }
                }

                if ($scope.order.DebitAccount != undefined) {
                    if ($scope.order.Amount != null && $scope.order.Amount > 0) {
                        if ($scope.feeType == undefined) {
                            $scope.feeType = '0';
                        }
                        //$scope.setOrderType();
                        if ($scope.feeType != 0) {
                            var Data = paymentOrderService.getFee($scope.order, $scope.feeType);

                            Data.then(function (fee) {
                                $scope.order.TransferFee = fee.data;

                                if (fee.data == 0) {
                                    $scope.showFeeTypeBlock = false;
                                }
                                else {
                                    $scope.showFeeTypeBlock = true;
                                }

                                if (fee.data == -1) {
                                    $scope.order.Fees = undefined;
                                    return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:', 'error');
                                }
                                if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0) {
                                    $scope.order.Fees = [];
                                }
                                //Կանխիկ մուտք հաշվին եթե RUR է մուտքագրում իր RUR հաշվին կամ GBP->GBP կամ CHF->CHF կամ AMD->AMD
                                if ($scope.feeType == '8' || $scope.feeType == '9' || $scope.feeType == '28' || $scope.feeType == '29') {
                                    if ($scope.order.Fees.length != 0) {
                                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                                            if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '9' || $scope.order.Fees[i].Type == '28' || $scope.order.Fees[i].Type == '29') {
                                                if (fee.data > 0) {
                                                    $scope.order.Fees[i].Amount = fee.data;
                                                    $scope.order.Fees[i].Type = $scope.feeType;
                                                    $scope.order.Fees[i].Description =
                                                        "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                                        numeral($scope.order.Amount).format('0,0.00') +
                                                        ' ' +
                                                        $scope.order.Currency +
                                                        " " +
                                                        $scope.order.CustomerNumber +
                                                        ")";
                                                    if ($scope.order.Fees[i].Type == '8') {
                                                        $scope.order.Fees[i].OrderNumber = $scope.OrderNumberForFee;
                                                    }
                                                    else if ($scope.order.Fees[i].Type == '28') {
                                                        $scope.order.Fees[i].OrderNumber = $scope.order.OrderNumber;
                                                    }
                                                    else {
                                                        $scope.order.Fees[i].OrderNumber = "";
                                                    }

                                                    if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '28') {
                                                        $scope.order.Fees[i].Account = { AccountNumber: 0, Currency: 'AMD' };
                                                    }
                                                    else {
                                                        if ($scope.order.Fees[i].Account.AccountNumber == undefined) {
                                                            $scope.order.Fees[i].Account = {};
                                                        }
                                                    }
                                                }
                                                else if (fee.data == 0) {
                                                    $scope.order.Fees.splice(i, 1);
                                                }
                                            }
                                        }
                                    }
                                    else if (fee.data > 0) {
                                        if ($scope.feeType == '8') {
                                            $scope.order.Fees.push({
                                                Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', Account: { AccountNumber: 0, Currency: 'AMD' }, OrderNumber: $scope.OrderNumberForFee,
                                                Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" + numeral($scope.order.Amount).format('0,0.00') + ' ' + $scope.order.Currency + " " + $scope.order.CustomerNumber + ")"
                                            });
                                        }
                                        else if ($scope.feeType == '28') {
                                            $scope.order.Fees.push({
                                                Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', Account: { AccountNumber: 0, Currency: 'AMD' }, OrderNumber: $scope.order.OrderNumber,
                                                Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" + numeral($scope.order.Amount).format('0,0.00') + ' ' + $scope.order.Currency + " " + $scope.order.CustomerNumber + ")"
                                            });
                                        }
                                        else {
                                            $scope.order.Fees.push({
                                                Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', OrderNumber: "",
                                                Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" + numeral($scope.order.Amount).format('0,0.00') + ' ' + $scope.order.Currency + " " + $scope.order.CustomerNumber + ")"
                                            });
                                        }
                                    }
                                }

                                //Կանխիկ ելք հաշվից եթե հաշվից հանվում է հաշվի արժույթով գումար
                                if ($scope.feeType == '1' || $scope.feeType == '2' || $scope.feeType == '3'
                                    || $scope.feeType == '4' || $scope.feeType == '5' || $scope.feeType == '6') {
                                    if ($scope.order.Fees.length != 0) {
                                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                                            if ($scope.order.Fees[i].Type == '1' || $scope.order.Fees[i].Type == '2' || $scope.order.Fees[i].Type == '3'
                                                || $scope.order.Fees[i].Type == '4' || $scope.order.Fees[i].Type == '5' || $scope.order.Fees[i].Type == '6') {
                                                if (fee.data > 0) {

                                                    $scope.order.Fees[i].Amount = fee.data;
                                                    $scope.order.Fees[i].Type = $scope.feeType;
                                                    if ($scope.feeType == '1' || $scope.feeType == '3' || $scope.feeType == '5' || $scope.feeType == '6') {
                                                        //$scope.order.Fees[i].OrderNumber = $scope.order.OrderNumber;
                                                    }
                                                    else {
                                                        $scope.order.Fees[i].OrderNumber = "";
                                                    }
                                                    if ($scope.feeType == '1' || $scope.feeType == '3' || $scope.feeType == '5' || $scope.feeType == '6') {
                                                        $scope.order.Fees[i].Account = { AccountNumber: 0, Currency: 'AMD' };
                                                        $scope.order.Fees[i].Description = "Կանխիկացման համար (" + numeral($scope.order.Amount).format('0,0.00') + ' ' + $scope.order.Currency + " " + $scope.order.CustomerNumber + ")";
                                                    }
                                                    else {
                                                        if ($scope.order.Fees[i].Account == undefined || $scope.order.Fees[i].Account.AccountNumber == undefined) {
                                                            $scope.order.Fees[i].Account = {};
                                                        }
                                                        $scope.order.Fees[i].Description = "Կանխիկացման համար (" + numeral($scope.order.Amount).format('0,0.00') + ' ' + $scope.order.Currency + " " + $scope.order.CustomerNumber + ")";

                                                    }
                                                }
                                                else if (fee.data == 0) {
                                                    if ($scope.order.Type != 133) {
                                                        $scope.order.Fees.splice(i, 1);
                                                    }
                                                    else {
                                                        $scope.order.Fees = [];
                                                        $scope.order.Fees.push({ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null });
                                                    }


                                                }
                                            }
                                        }
                                    }
                                    else if (fee.data > 0) {
                                        if ($scope.feeType == '1' || $scope.feeType == '3' || $scope.feeType == '5' || $scope.feeType == '6') {

                                            $scope.order.Fees.push({
                                                Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', Account: { AccountNumber: 0, Currency: 'AMD' }, OrderNumber: $scope.OrderNumberForFee,
                                                Description: "Կանխիկացման համար (" + numeral($scope.order.Amount).format('0,0.00') + ' ' + $scope.order.Currency + " " + $scope.order.CustomerNumber + ")"
                                            });




                                        }
                                        else {
                                            $scope.order.Fees.push({
                                                Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', OrderNumber: "",
                                                Description: "Կանխիկացման համար (" + numeral($scope.order.Amount).format('0,0.00') + ' ' + $scope.order.Currency + " " + $scope.order.CustomerNumber + ")"
                                            });
                                        }
                                    }
                                    else {
                                        if ($scope.order.Type == 133) {
                                            $scope.order.Fees = [];
                                            $scope.order.Fees.push({ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null });
                                        }

                                    }
                                }


                                if ($scope.order.TransferFee == 0) {
                                    $scope.order.FeeAccount = "";
                                }
                            }, function () {
                                alert('Error getfee');
                            });
                        }
                        else {
                            $scope.order.TransferFee = 0;
                            $scope.order.FeeAccount = "";
                        }
                    }
                }
            }
            else if (($scope.order.Amount != null && $scope.order.Amount > 0 && $scope.order.Type == 1 && $scope.order.SubType == 2 && $scope.order.DebitAccount != undefined)
                || ($scope.order.Amount != null && $scope.order.Amount > 0 && $scope.order.Type == 56 && $scope.order.DebitAccount != undefined)
                || ($scope.order.Amount != null && $scope.order.Amount > 0 && $scope.order.Type == 1 && $scope.order.SubType == 1 && $scope.forBankTransfers == true && $scope.checkOwnerAccount == true)
                || ($scope.periodic && $scope.order.Type == 1 && $scope.order.SubType == 1 && ($scope.forBankTransfers == true || $scope.checkOwnerAccount == true))) {
                //$scope.order.Type = 1;
                //$scope.order.SubType = 2;

                var receiverAccount = 0;

                if ($scope.feeType == undefined) {
                    $scope.feeType = '0';
                }

                if ($scope.order.Type == 1 && $scope.order.SubType == 1 && $scope.forBankTransfers == true && $scope.checkOwnerAccount == true) {
                    $scope.feeType = '11';

                    //if ($scope.periodic && $scope.checkOwnerAccount == true)
                    //{
                    //    if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0)
                    //    {
                    //        $scope.order.Fees = [{ Amount: 0, Type: $scope.feeType, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: 'AMD', OrderNumber: $scope.order.OrderNumber, Description: ($scope.order.Type == 56) ? $scope.order.Description : "" }]
                    //    }
                    //    else
                    //    {
                    //        $scope.order.Fees.push({ Amount: fee.data, Type: $scope.feeType, Account:{ AccountNumber: 0, Currency: 'AMD' }, Currency: 'AMD', OrderNumber: $scope.order.Type == 56 ? $scope.OrderNumberForFee : $scope.order.OrderNumber, Description: ($scope.order.Type == 56) ? $scope.order.Description : "" })
                    //    }
                    //    return;
                    //}
                    //else if ($scope.periodic)
                    //{
                    //    if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0)
                    //    {
                    //        for (var i = 0; i < $scope.order.Fees.length; i++)
                    //        {
                    //        if ($scope.order.Fees[i].Type == 11) 
                    //                {
                    //                    $scope.order.Fees.splice(i, 1);
                    //                }
                    //        }
                    //    }
                    //    return;
                    //}

                    ////}




                }

                if ($scope.order.ReceiverAccount != undefined) {
                    receiverAccount = $scope.order.ReceiverAccount.AccountNumber;
                }


                if (receiverAccount != null && parseInt(receiverAccount.toString().substring(0, 5)) >= 22000 && parseInt(receiverAccount.toString().substring(0, 5)) < 22300) {
                    $scope.order.SubType = 1;
                }

                var Data = paymentOrderService.getFee($scope.order, $scope.feeType);

                Data.then(function (fee) {
                    $scope.order.TransferFee = fee.data;
                    if (fee.data == -1) {
                        $scope.order.Fees = undefined;
                        return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:', 'error');
                    }
                    if ($scope.order.Type == 1) {
                        if ($scope.forBankTransfers == true && $scope.checkOwnerAccount == true) {
                            $scope.checkForFeeAccount = 0;
                            $scope.feeType = '11';
                        }
                        else {
                            $scope.feeType = '20';
                        }
                    }
                    else if ($scope.order.Type == 56) {
                        $scope.feeType = '5';
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

                        }
                        if (hasFee == false && fee.data > 0) {
                            $scope.order.Fees.push({
                                Amount: fee.data,
                                Type: $scope.feeType,
                                Account: { AccountNumber: 0, Currency: 'AMD' },
                                Currency: 'AMD',
                                OrderNumber: $scope.order.Type == 56 ? $scope.OrderNumberForFee : $scope.order.OrderNumber,
                                Description: ($scope.order.Type == 56) ? $scope.order.Description : ""
                            });
                        }
                    }
                    if ($scope.order.DebitAccount.AccountType == 11) {
                        $scope.FeeCurrency = $scope.order.DebitAccount.Currency;
                    }
                    if ($scope.order.TransferFee == 0) {
                        $scope.order.TransferFee = null;
                        $scope.order.FeeAccount = "";
                    }
                }, function () {
                    alert('Error getfee');
                });

            }
            else if ($scope.transfer != undefined || (($scope.order.Type == 86 || $scope.order.Type == 90) && $scope.feeType != undefined && $scope.order.DebitAccount != undefined)) {
                if ($scope.order.Type == 86 || $scope.order.Type == 90 || ($scope.transfer.TransferGroup == 4 && $scope.transfer.DetailsOfCharges != 'OUR')) {

                    var Data = paymentOrderService.getFee($scope.order, $scope.feeType);

                    Data.then(function (fee) {
                        $scope.order.TransferFee = fee.data;
                        if (fee.data > 0) {
                            $scope.order.Fees = [
                                {
                                    Amount: fee.data,
                                    Type: ($scope.order.Type == 86 || $scope.order.Type == 90) ? $scope.feeType : 5,
                                    Account: { AccountNumber: 0, Currency: 'AMD' },
                                    Currency: 'AMD',
                                    OrderNumber: $scope.OrderNumberForFee,
                                    Description: ($scope.order.Type == 86 || $scope.order.Type == 90)
                                        ? "Միջնորդավճար փոխանցողի կողմից"
                                        : "Կանխիկացման համար (" +
                                        $scope.transfer.Amount.toString() +
                                        " " +
                                        $scope.transfer.Currency +
                                        " " +
                                        $scope.order.CustomerNumber.toString() +
                                        ")"
                                }
                            ];
                        }
                        else if (fee.data == -1) {
                            $scope.order.Fees = undefined;

                            return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:', 'error');
                        }
                    }, function () {
                        alert('Error getfee');
                    });
                }
            }
            else {
                $scope.order.TransferFee = null;
                $scope.order.FeeAccount = "";
            }

            $scope.getCardFee();


        };


        $scope.getCardFee = function () {

            if ($scope.order.DebitAccount != undefined) {
                if ($scope.order.DebitAccount.AccountType == 11 && $scope.order.DebitAccount.Currency != null && $scope.order.Amount != null && $scope.order.Amount > 0) {
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
                            $scope.order.Fees = [{ Amount: fee.data, Type: 7, Account: $scope.order.DebitAccount, Currency: $scope.order.DebitAccount.Currency, OrderNumber: $scope.order.OrderNumber, Description: 'Քարտային ելքագրման միջնորդավճար' }];
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
                                        $scope.order.Fees[i].Description = 'Քարտային ելքագրման միջնորդավճար';
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
                                    OrderNumber: $scope.order.OrderNumber,
                                    Description: 'Քարտային ելքագրման միջնորդավճար'
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
        $scope.confirm = false;

        //Հայտի պահպանում
        $scope.savePayment = function () {

            if ($scope.order.Type != 121 && $scope.order.Type != 122 && ($scope.order.DebitAccount == undefined || $scope.order.ReceiverAccount == undefined ||
                $scope.order.DebitAccount.AccountNumber == undefined || $scope.order.ReceiverAccount.AccountNumber == undefined)) {
                return;
            }

            $scope.error = null;

            $scope.setOrderSubType();
            if ($scope.order.Type != 122 && $scope.order.DebitAccount.Currency != $scope.order.ReceiverAccount.Currency) {
                return ShowMessage('Ընտրված են տարբեր արժույթներով հաշիվներ', 'error');
            }

            if ($http.pendingRequests.length == 0) {
                document.getElementById("paymentLoad").classList.remove("hidden");

                if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.order.Fees[i].Amount == 0 && $scope.order.Type != 133) {
                            $scope.order.Fees.splice(i, 1);
                        }
                    }
                }
                if ($scope.order.Type != 122)
                    $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);

                if ($scope.additional != "" && $scope.isLeasingAccount != true) {
                    $scope.order.Description = $scope.description.toString() + " " + $scope.additional;
                }
                else
                    $scope.order.Description = $scope.description;

                if ($scope.additional != "" && $scope.order.TransactionTypeByAML !== undefined) {
                    $scope.order.TransactionTypeByAML.AdditionalDescription = $scope.additional;
                }
                //$scope.setOrderType();
                $scope.setCurrency();
                //$scope.order.Currency = $scope.order.DebitAccount.Currency;
                if ($scope.feeType == 0 &&
                    (
                        ($scope.order.Type == 52 && $scope.order.DebitAccount.AccountType != 11 &&
                            $scope.order.DebitAccount.Currency == $scope.order.ReceiverAccount.Currency &&
                            $scope.order.DebitAccount.AccountNumber != undefined
                        )
                        ||
                        (
                            ($scope.order.Type == 51 || $scope.order.Type == 95 || $scope.order.Type == 133) &&
                            (
                                ($scope.order.ReceiverAccount.Currency == 'RUR' && $scope.order.DebitAccount.Currency == 'RUR') ||
                                ($scope.order.ReceiverAccount.Currency == 'GBP' && $scope.order.DebitAccount.Currency == 'GBP') ||
                                ($scope.order.ReceiverAccount.Currency == 'CHF' && $scope.order.DebitAccount.Currency == 'CHF') ||
                                $scope.order.Type == 133
                            )
                        )
                        || ($scope.order.Type == 51 && $scope.order.ReceiverAccount.Currency == 'AMD' && $scope.order.DebitAccount.Currency == 'AMD')
                    )
                ) {
                    if ($scope.order.Fees == null || $scope.order.Fees.length == 0) {

                        var descriptionForRejectFeeType = null;
                        var rejectFeeType = null;
                        if ($scope.feeType == 0 && $scope.order.Type == 51 &&
                            $scope.order.ReceiverAccount.Currency == 'AMD' && $scope.order.DebitAccount.Currency == 'AMD') {
                            rejectFeeType = $scope.order.RejectFeeType;
                        }

                        var oneFeeObj = { Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null, DescriptionForRejectFeeType: descriptionForRejectFeeType, RejectFeeType: rejectFeeType, RejectFeeTypeDescription: null };
                        $scope.order.Fees = [oneFeeObj];
                    }
                    else {
                        for (i = 0; i < $scope.order.Fees.length; i++)
                            if ($scope.order.Fees[i].Amount == 0) break;
                        if (i == $scope.order.Fees.length)
                            $scope.order.Fees.push({ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null });
                    }
                }
                if ($scope.order.Type == 95 || $scope.order.Type == 122) {
                    var Data = paymentOrderService.saveReestrTransferOrder($scope.order, $scope.confirm);
                }
                else {
                    var Data = paymentOrderService.savePaymentOrder($scope.order, $scope.confirm);
                }
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        if ($scope.swiftMessage != undefined)
                            $scope.path = '#swiftmessages';
                        else
                            $scope.path = '#Orders';

                        document.getElementById("paymentLoad").classList.add("hidden");
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        CloseBPDialog('paymentorder');
                        refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                    }
                    else {

                        document.getElementById("paymentLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePayment);

                        if ($scope.order.Type == 122) {
                            for (var i = 0; i < res.data.Errors.length; i++) {
                                if (res.data.Errors[i].Params != undefined) {
                                    var hasDahk = false;
                                    if (res.data.Errors[i].Code == 1519) {
                                        hasDahk = true;
                                        $scope.showPaymentType = true;
                                    }

                                    var nonValidateRows = res.data.Errors[i].Params[0].match(/[0-9]+/g);
                                    for (var j = 0; j < nonValidateRows.length; j++) {
                                        var rowIndex = parseInt(nonValidateRows[j]) - 1;
                                        $scope.order.ReestrTransferAdditionalDetails[rowIndex]["NonValidate"] = true;
                                        if (hasDahk) {
                                            $scope.order.ReestrTransferAdditionalDetails[rowIndex]["CardHasDAHK"] = true;
                                        }
                                    }

                                }


                            }
                        }

                    }
                }, function (err) {
                    $scope.confirm = false;
                    document.getElementById("paymentLoad").classList.add("hidden");
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error in savePayment');
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        }




        $scope.saveTransferArmPayment = function () {
            $scope.error = null;
            if ($http.pendingRequests.length == 0) {
                $scope.order.SubType = 2;
                if (!$scope.interBankTransfer) {
                    if (parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) >= 22000
                        && parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) < 22300 && $scope.periodic == undefined) {
                        return ShowMessage('Ներբանկային փոխանցումը անհրաժեշտ է կատարել «Մուտք հաշվին կամ Ելք հաշվից կամ Սեփական հաշիվներից բանկի ներսում» բաժնի միջոցով:', 'error');
                    }
                    $scope.setCreditorDocumentNumbers();
                    $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
                }
                else {
                    $scope.order.SubType = 1;
                    if ($scope.interBankTransferCash) {
                        $scope.order.DebitAccount.Currency = $scope.order.Currency;
                    }
                    $scope.order.ReceiverAccount.Currency = $scope.order.Currency;
                }
                document.getElementById("armload").classList.remove("hidden");



                $scope.order.Attachments = [];

                if ($scope.orderAttachment.attachmentArrayBuffer != undefined && $scope.orderAttachment.attachmentArrayBuffer != null) {
                    var oneAttachment = {};
                    oneAttachment.Attachment = $scope.orderAttachment.attachmentArrayBuffer;
                    oneAttachment.FileName = $scope.orderAttachment.attachmentFile.name;
                    oneAttachment.FileExtension = $scope.orderAttachment.attachmentFile.getExtension();

                    $scope.order.Attachments.push(oneAttachment);
                }

                if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.order.Fees[i].Amount == 0) {
                            $scope.order.Fees.splice(i, 1);
                        }
                    }

                }

                if ($scope.order.Type == 86 || $scope.order.Type == 90) {
                    if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                        var hasInterBankTransferFee = false;
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == 5 || $scope.order.Fees[i].Type == 20) {
                                hasInterBankTransferFee = true;
                            }

                        }
                        if (hasInterBankTransferFee != true) {
                            $scope.order.Fees.push({ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null });
                        }
                    }
                    else {
                        $scope.order.Fees = [];
                        $scope.order.Fees.push({ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null });
                    }

                }


                var Data = paymentOrderService.savePaymentOrder($scope.order, $scope.confirm);

                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        document.getElementById("armload").classList.add("hidden");
                        CloseBPDialog('transferarmpaymentorder');
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                    }
                    else {
                        document.getElementById("armload").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                    }
                }, function () {
                    document.getElementById("armload").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in TransferArmPayment');
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        }

        $scope.getCustomer = function () {
            var Data = customerService.getCustomer();
            Data.then(function (cust) {
                $scope.customer = cust.data;
                if (cust.data.PhoneList != undefined) {
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


            }, function () {
                alert('Error');
            });
        };

        $scope.$watch('order.DebitAccount', function (newValue, oldValue) {
            $scope.getSpecialPriceWarnings();
            if ($scope.details != true) {
                //$scope.setOrderType();
                if ($scope.order.DebitAccount != undefined) {
                    if ($scope.order.Type == 1) {
                        if ($scope.order.DebitAccount.Currency != 'AMD') {
                            $scope.order.UrgentSign = false;
                        }
                    }

                    if ($scope.order.Type == 51 || $scope.order.Type == 52 || $scope.order.Type == 83 || $scope.order.Type == 95 || $scope.order.Type == 121 || $scope.order.Type == 133) {
                        if ($scope.order.Type == 52 || $scope.order.Type == 83 || $scope.order.Type == 121 || $scope.order.Type == 133) {
                            $scope.order.ReceiverAccount = { AccountNumber: 0, Currency: $scope.order.DebitAccount.Currency };
                            $scope.getBankOperationFeeTypes();
                            $scope.feeType = '0';
                        }

                        if ($scope.ForATSAccount == true && $scope.order.Type == 52 && ((newValue == null || oldValue == null) || (newValue.Currency != oldValue.Currency)))
                            $scope.getATSSystemAccounts($scope.order.DebitAccount.Currency, false);
                    }
                    if ($scope.transfer != undefined)
                        if ($scope.transfer.TransferGroup == 4 && $scope.transfer.DetailsOfCharges != 'OUR') {
                            $scope.getBankOperationFeeTypes();
                            $scope.feeType = '0';
                        }

                    //if ($scope.order.Type != null && $scope.order.Type != 1) {
                    //    $scope.setCurrency();
                    //}
                    $scope.setTransferArmCurrency();
                    $scope.setCurrency();

                }
            }
        });
        $scope.$watch('order.ReceiverAccount', function (newValue, oldValue) {
            if ($scope.details != true) {
                if ($scope.order.ReceiverAccount != undefined) {
                    if ($scope.order.ReceiverAccount.AccountNumber != undefined) {
                        if ($scope.order.Type == 51 || $scope.order.Type == 95) {
                            $scope.order.DebitAccount = { AccountNumber: 0, Currency: $scope.order.ReceiverAccount.Currency };
                            if ($scope.ForATSAccount == true && $scope.order.Type == 51 && oldValue != null && newValue != null && newValue.Currency != oldValue.Currency)
                                $scope.getATSSystemAccounts($scope.order.ReceiverAccount.Currency, true);

                        }
                    }
                }
                $scope.setCurrency();
            }
        });


        $scope.setCurrency = function () {

            if ($scope.periodic != 5) {

                if ($scope.order.Type == 51 || $scope.order.Type == 95) {
                    $scope.order.Currency = $scope.order.ReceiverAccount.Currency;
                }
                else if ($scope.order.Type == 52) {
                    if ($scope.order.DebitAccount != undefined)
                        $scope.order.Currency = $scope.order.DebitAccount.Currency;
                }
                else {
                    if ($scope.order.DebitAccount != undefined)
                        $scope.order.Currency = $scope.order.DebitAccount.Currency;
                }
            }
        };



        //Ստացողի Բանկի որոշում` ըստ ելքագրվող հաշվի
        $scope.setReceiverBank = function () {
            if ($scope.order.ReceiverAccount != null && $scope.order.ReceiverAccount.AccountNumber != 0) {
                var receiver_account = $scope.order.ReceiverAccount.AccountNumber;
            }

            if (receiver_account != "" && receiver_account != undefined) {
                // //if (receiver_account.toString().length == 12) {
                var Data = paymentOrderService.getBank(receiver_account.toString().substr(0, 5));
                Data.then(function (result) {
                    $scope.ReceiverBank = result.data;
                    if (receiver_account.length == 5)
                        $scope.order.Receiver = $scope.ReceiverBank;
                    if ($scope.ReceiverBank == "") {
                        $scope.ReceiverBank = "Ստացողի բանկը գտնված չէ";
                    }
                }, function () {
                    alert('Error in receiverAccountChanged');
                });
                $scope.ReceiverBankCode = receiver_account.toString().substr(0, 5);

                // //}
            }
            else {
                $scope.ReceiverBank = "";
            }

        }

        $scope.getCreditorStatuses = function () {

            var Data = paymentOrderService.getSyntheticStatuses();
            Data.then(function (acc) {

                $scope.creditorStatuses = acc.data;
            }, function () {
                alert('Error getCreditorStatuses');
            });
        };
        $scope.getCreditorCustomer = function (customerNumber) {

            $scope.resetCreditorDocumentNumbers();

            var Data = customerService.getCustomer(customerNumber);
            Data.then(function (cust) {
                $scope.creditorCustomer = cust.data;
                if ($scope.creditorCustomer != undefined) {

                    $scope.getCustomerSyntheticStatus(customerNumber);
                    $scope.order.CreditorCustomerNumber = $scope.creditorCustomer.CustomerNumber;
                    if ($scope.creditorCustomer.CustomerType == 6) {
                        $scope.order.CreditorDescription = $scope.creditorCustomer.FirstName + ' ' + $scope.creditorCustomer.LastName;
                        if ($scope.creditorCustomer.Residence == 1) {
                            if ($scope.creditorCustomer.SocCardNumber != "") {
                                $scope.order.CreditorDocumentType = 1;
                                $scope.clearDocumentNumber(2, 1);
                                $scope.transferArmPaymentOrderForm.CreditorDocumentNumber1 = $scope.creditorCustomer.SocCardNumber;
                            }
                            else if ($scope.creditorCustomer.NoSocCardNumber != "") {
                                $scope.order.CreditorDocumentType = 2;
                                $scope.clearDocumentNumber(1, 1);
                                $scope.transferArmPaymentOrderForm.CreditorDocumentNumber2 = $scope.creditorCustomer.NoSocCardNumber;
                            }
                        }
                        else {
                            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber3 = $scope.creditorCustomer.DocumentNumber + ' ' + $scope.creditorCustomer.DocumentGivenDate;
                        }

                    }
                    else {
                        $scope.order.CreditorDocumentType = 4;
                        $scope.order.CreditorDescription = $scope.creditorCustomer.OrganisationName;
                        $scope.transferArmPaymentOrderForm.CreditorDocumentNumber4 = $scope.creditorCustomer.TaxCode;
                    }

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

        $scope.resetCreditorDocumentNumbers = function () {
            $scope.order.CreditorDescription = '';
            $scope.order.CreditorDocumentNumber = '';
            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber1 = '';
            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber2 = '';
            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber3 = '';
            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber4 = '';
            $scope.order.CreditorCustomerNumber = '';
            if ($scope.order.CreditorStatus != '10' && $scope.order.CreditorStatus != '20')
                $scope.order.CreditorDocumentType = 4;
            else
                $scope.order.CreditorDocumentType = 0;
        };

        $scope.setCreditorDocumentNumbers = function () {
            if ($scope.order.CreditorDocumentType == 1)
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber1;
            else if ($scope.order.CreditorDocumentType == 2)
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber2;
            else if ($scope.order.CreditorStatus != null && $scope.order.CreditorStatus == '20') {
                $scope.order.CreditorDocumentType = 3;
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber3;
            }
            else if ($scope.order.CreditorStatus != '10' && $scope.order.CreditorStatus != null) {
                $scope.order.CreditorDocumentType = 4;
                $scope.order.CreditorDocumentNumber = $scope.transferArmPaymentOrderForm.CreditorDocumentNumber4;
            }
        };





        //Փաստաթղթի զրոյացում
        $scope.clearDocumentNumber = function (documentType, forCreditor) {

            if (documentType == 1)
                $scope.transferArmPaymentOrderForm.CreditorDocumentNumber1 = null;
            else if (documentType == 2)
                $scope.transferArmPaymentOrderForm.CreditorDocumentNumber2 = null;

        };

        $scope.getCustomerSyntheticStatus = function (customerNumber) {
            var Data = customerService.getCustomerSyntheticStatus(customerNumber);
            Data.then(function (cust) {
                $scope.order.CreditorStatus = cust.data.toString();
                if ($scope.order.CreditorStatus == 12 | $scope.order.CreditorStatus == 22) {
                    $scope.order.CreditorStatus = null;
                }
            }, function () {
                alert('Error');
            });
        };
        $scope.getAccountDescription = function (account) {
            if (account.AccountType == 11) {
                return account.AccountDescription + ' ' + account.Currency;
            }
            else {
                return account.AccountNumber + ' ' + account.Currency;
            }
        }



        //Դաշտերի զրոյացում
        $scope.resetFields = function () {
            $scope.Amount = "";
            $scope.Rate = "";
            $scope.ConvertationRate = "";
            $scope.ConvertationRate1 = "";
        }

        //Բյուջետային հաշվի ստուգում
        $scope.checkForBudgetAccountAndBankAccount = function (check) {
            if (($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5) == '10300' && $scope.order.ReceiverAccount.AccountNumber.toString().substr(5, 1) == '9') || $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 1) == '9') {
                CloseBPDialog('transferarmpaymentorder');
                ShowMessage('Բյուջետային հաշվին փոխանցումը անհրաժեշտ է կատարել «Բյուջե» բաժնի միջոցով:', 'error');
            }
            if (check != false) {
                if (parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) >= 22000 && parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) < 22300) {

                    if ($scope.periodic != undefined) {
                        return ShowMessage('Ներբանկային պարբերական փոխանցում անհրաժեշտ է կատարել փոխանցում բանկի ներսում բաժնի միջոցով:', 'error');
                    }
                    return ShowMessage('Ներբանկային փոխանցումը անհրաժեշտ է կատարել Մուտք հաշվին կամ Ելք հաշվից կամ Սեփական հաշիվներից բանկի ներսում  բաժնի միջոցով:', 'error');
                }
            }


        }

        //Մուտքագրվող (կրեդիտ) հաշվի որոնում
        $scope.searchAccounts = function () {
            $scope.searchAccountsModalInstance = $uibModal.open({
                template: '<searchaccount callback="getSearchedAccounts(selectedAccount)" close="closeSearchAccountsModal()"></searchaccount>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });

            $scope.searchAccountsModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

        $scope.getSearchedAccounts = function (selectedAccount, isSearchInController) {


            if (isSearchInController != true && selectedAccount.AccountType == 11) {
                $scope.getAccountByAccountNumber(selectedAccount.AccountNumber, true);
            }
            else {

                $scope.order.ReceiverAccount = selectedAccount;
                $scope.receiverAccountAccountNumber = selectedAccount.AccountNumber;
                $scope.order.ReceiverAccount.AccountNumber = selectedAccount.AccountNumber;
                $scope.order.Receiver = selectedAccount.Description;
                $scope.checkForBudgetAccountAndBankAccount(false);

                $scope.ReceiverBank = selectedAccount.Description;
                //$scope.setReceiverBank();
                $scope.isTransferFromBusinessmanToOwnerAccount();

                $scope.order.FeeAccount = '';
                $scope.order.UrgentSign = false;
                if ($scope.forBankTransfers == true) {
                    $scope.setReceiverBank();
                    $scope.getPaymentOrderDescription();
                    $scope.getReceiverAccountWarnings($scope.order.ReceiverAccount.AccountNumber);
                    $scope.getFee();

                }


            }
            $scope.closeSearchAccountsModal();
        }

        $scope.closeSearchAccountsModal = function () {
            if ($scope.searchAccountsModalInstance != undefined)
                $scope.searchAccountsModalInstance.close();
        }

        $scope.getAccountByAccountNumber = function (receiverAccountAccountNumber, isSearchInController) {
            $scope.receiverAccountAccountNumber = receiverAccountAccountNumber;
            if ($scope.receiverAccountAccountNumber != undefined && $scope.receiverAccountAccountNumber != "") {
                if ($scope.receiverAccountAccountNumber.toString().substring(0, 5) >= 22000 && $scope.receiverAccountAccountNumber.toString().substring(0, 5) < 22300) {
                    $scope.hasaccount = true;
                    $scope.searchParams = {
                        accountNumber: $scope.receiverAccountAccountNumber,
                        customerNumber: "",
                        currency: "",
                        sintAcc: "",
                        sintAccNew: "",
                        filialCode: 0,
                        isCorAcc: false,
                        includeClosedAccounts: false,
                    };

                    var Data = accountService.getSearchedAccounts($scope.searchParams);
                    Data.then(function (acc) {
                        if (acc.data.length > 0) {
                            $scope.getSearchedAccounts(acc.data[0], isSearchInController);
                        }
                        else {
                            $scope.order.ReceiverAccount = undefined;
                            $scope.hasaccount = false;
                        }
                    }, function () {
                        alert('Error in getSearchedAccounts');
                    });

                }
                else {
                    $scope.order.ReceiverAccount = undefined;
                    $scope.hasaccount = false;
                }
            }


        };


        //ՀՀ տարածքում վճարման հանձնարարականի տպում
        $scope.getPaymentOrderDetails = function () {
            if ($http.pendingRequests.length == 0) {
                showloading();
                $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);

                var Data = paymentOrderService.getPaymentOrderDetails($scope.order);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getPaymentOrderDetails');
                });

                if ($scope.order != null) {
                    $scope.printCashBigAmountReport();
                }
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        };

        $scope.printCashBigAmountReport = function () {
            var Data = paymentOrderService.isCashBigAmount($scope.order);
            Data.then(function (acc) {
                $scope.isBigAmount = acc.data.m_Item1;
                if ($scope.isBigAmount == true) {
                    if ($scope.order.OPPerson == undefined || $scope.order.OPPerson.CustomerNumber == undefined || $scope.order.OPPerson.CustomerNumber == 0) {
                        return ShowMessage('Տվյալ գործարքը ձևակերպելու համար անհրաժեշտ է մուտքագրել գործարք կատարողի հաճախորդի համարը:', 'error');
                    }


                    var Data = paymentOrderService.printCashBigAmountReport($scope.order, acc.data.m_Item2);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 75, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error printCashBigAmountReport');
                    });
                }
            }, function () {
                alert('Error isBigAmount');
            });
        }



        $scope.printCashBigAmountReportForCurrencyExchangeOrder = function () {
            var Data = currencyExchangeOrderService.isCashBigAmount($scope.order);
            Data.then(function (acc) {
                $scope.isBigAmount = acc.data.m_Item1;
                if ($scope.isBigAmount == true) {
                    if ($scope.order.OPPerson == undefined || $scope.order.OPPerson.CustomerNumber == undefined || $scope.order.OPPerson.CustomerNumber == 0) {
                        return ShowMessage('Տվյալ գործարքը ձևակերպելու համար անհրաժեշտ է մուտքագրել գործարք կատարողի հաճախորդի համարը:', 'error');
                    }

                    var Data = paymentOrderService.printCashBigAmountReport($scope.order, acc.data.m_Item2);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 75, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error printCashBigAmountReport');
                    });
                }
            }, function () {
                alert('Error isBigAmount');
            });
        }
        $scope.setMatureTypeDescription = function () {
            $scope.order.MatureTypeDescription = $scope.loanMatureTypes[$scope.order.MatureType.toString()];
        }
        //Սեփական հաշիվների միջև վճարման հանձնարարականի տպում
        $scope.getPersonalPaymentOrderDetails = function (isCopy) {
            if ($http.pendingRequests.length == 0) {
                if (isCopy == undefined) {
                    $scope.setOrderSubType();
                    isCopy = false;
                }
                if (isCopy == false) {
                    $scope.setCreditorDocumentNumbers();
                }
                showloading();

                if (!$scope.interBankTransfer) {
                    $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
                }
                if ($scope.additional != "") {
                    $scope.order.Description = $scope.description + ", " + $scope.additional;
                }
                else if ($scope.description != undefined)
                    $scope.order.Description = $scope.description;

                if ($scope.transfer != undefined)
                    if ($scope.transfer.InstantMoneyTransfer == 1)
                        $scope.order.DebitAccount = $scope.transfer.DebitAccount;
                    else if ($scope.transfer.TransferGroup == 4)
                        $scope.order.DebitAccount = $scope.transfer.CreditAccount;

                if ($scope.order.Type == 1 || $scope.order.Type == 56 || $scope.order.Type == 85 || $scope.order.Type == 86 || $scope.order.Type == 90) {
                    if (!$scope.interBankTransfer) {
                        $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
                    }
                    var Data = paymentOrderService.getPaymentOrderDetails($scope.order, isCopy);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getPaymentOrderDetails');
                    });
                }
                if ($scope.order.Type == 51) {
                    var Data = paymentOrderService.getCashInPaymentOrder($scope.order, isCopy);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getCashInPaymentOrder');
                    });
                }
                if ($scope.order.Type == 52 || $scope.order.Type == 84 || $scope.order.Type == 133) {
                    var Data = paymentOrderService.getCashOutPaymentOrder($scope.order, isCopy);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 71, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getCashOutPaymentOrder');
                    });
                }
                if ($scope.order.Type == 54 || $scope.order.Type == 80) {
                    if ($scope.order.SubType == 3) {
                        var Data = currencyExchangeOrderService.getCrossConvertationCashNonCash($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 79, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getCrossConvertationCashNonCash');
                        });
                    }
                    else {
                        var Data = currencyExchangeOrderService.getConvertationCashNonCashPaymentOrder($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 73, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getConvertationCashNonCashPaymentOrder');
                        });
                    }
                }
                if ($scope.order.Type == 55 || $scope.order.Type == 81) {
                    if ($scope.order.SubType == 3) {
                        var Data = currencyExchangeOrderService.getCrossConvertationNonCashCash($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 80, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getCrossConvertationNonCashCash');
                        });
                    }
                    else {
                        var Data = currencyExchangeOrderService.getConvertationNonCashCashPaymentOrder($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 74, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getConvertationNonCashCashPaymentOrder');
                        });
                    }



                }
                else if ($scope.order.Type == 2 || $scope.order.Type == 65 || $scope.order.Type == 82) {
                    if ($scope.order.DebitAccount.Currency == 'AMD' || $scope.order.ReceiverAccount.Currency == 'AMD') {
                        var Data = currencyExchangeOrderService.getConvertationDetails($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 64, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getConvertationDetails');
                        });
                    }
                    else {
                        var Data = currencyExchangeOrderService.getCrossConvertationDetails($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 149, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getCrossConvertationDetails');
                        });
                    }
                }
                if ($scope.order.Type == 53) {

                    if ($scope.order.SubType == 3) {
                        var Data = currencyExchangeOrderService.getCrossConvertationCash($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 78, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getCrossConvertationCash');
                        });
                    }
                    else {
                        var Data = currencyExchangeOrderService.getConvertationCashPaymentOrder($scope.order);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 72, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error getConvertationCashPaymentOrder');
                        });
                    }
                }

                if ($scope.order.Type == 95) {
                    var Data = paymentOrderService.getCashInByReestrAmounts($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 85, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getCashInByReestrAmounts');
                    });

                    var Data = paymentOrderService.getCashInByReestr($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 86, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getCashInByReestr');
                    });

                    var Data = paymentOrderService.getCashInByReestrNote($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 87, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getCashInByReestrNote');
                    });

                }

                $scope.getPaymentOrderFeeDetails(isCopy);


                if ($scope.order != null) {
                    if ($scope.order.Type == 2 || $scope.order.Type == 53 || $scope.order.Type == 54 || $scope.order.Type == 55 || $scope.order.Type == 65
                        || $scope.order.Type == 80 || $scope.order.Type == 81 || $scope.order.Type == 82) {
                        $scope.printCashBigAmountReportForCurrencyExchangeOrder();
                    }
                    else {
                        $scope.printCashBigAmountReport();
                    }
                }
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }

        };

        $scope.getReceiverAccountWarnings = function (accountNumber) {
            if (accountNumber != undefined) {
                var bankCode = parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5));
            }

            if (bankCode >= 22000 && bankCode < 22300) {
                var Data = paymentOrderService.getReceiverAccountWarnings(accountNumber);
                Data.then(function (acc) {
                    $scope.warnings = acc.data;

                }, function () {
                    alert('Error getPaymentOrder');
                });
            }

        };

        $scope.getOperationsList = function () {
            var Data = infoService.GetOperationsList();
            Data.then(function (list) {
                $scope.operations = [];
                for (var key in list.data) {
                    $scope.operations.push(list.data[key]);
                }
                $scope.getPaymentOrderDescription();
                $scope.states = $scope.operations;
            }, function () {
                alert('error');
            });

        }



        $scope.getAllBankOperationFeeTypes = function () {
            var Data = infoService.GetBankOperationFeeTypes(3);
            Data.then(function (type) {
                $scope.allFeeTypes = type.data;
            }, function () {
                alert('getAllBankOperationFeeTypes');
            });
        }

        $scope.getLoanMatureTypes = function () {
            var Data = infoService.getLoanMatureTypes();
            Data.then(function (type) {
                $scope.loanMatureTypes = type.data;
                $scope.order.MatureType = 'M';
                $scope.setMatureTypeDescription();
            }, function () {
                alert('getLoanMatureTypes');
            });
        }


        $scope.getBankOperationFeeTypes = function () {
            $scope.BankOperationFeeType = 0;
            $scope.feeTypes = null;
            $scope.feeType = '0';
            if ($scope.order.DebitAccount != undefined && ($scope.order.Type == 52 && $scope.order.DebitAccount.AccountType != 11 && $scope.order.DebitAccount.Currency == $scope.order.ReceiverAccount.Currency)) {
                $scope.BankOperationFeeType = 1;
            }
            else if (($scope.order.Type == 51 || $scope.order.Type == 95) && (
                ($scope.order.ReceiverAccount.Currency == 'RUR' && $scope.order.DebitAccount.Currency == 'RUR') ||
                ($scope.order.ReceiverAccount.Currency == 'CHF' && $scope.order.DebitAccount.Currency == 'CHF') ||
                ($scope.order.ReceiverAccount.Currency == 'GBP' && $scope.order.DebitAccount.Currency == 'GBP')
            )
            ) {
                $scope.BankOperationFeeType = 2;
            }
            else if (($scope.order.Type == 51 && $scope.order.ReceiverAccount.Currency == 'AMD' && $scope.order.DebitAccount.Currency == 'AMD')) {
                $scope.BankOperationFeeType = 6;
            }
            else if ($scope.order.Type == 133) {
                $scope.BankOperationFeeType = 5;
            }

            //else if ($scope.order.Type == 56 || ($scope.order.Type == 1 && $scope.order.SubType ==2))
            //    {
            //        $scope.BankOperationFeeType = 4;
            //    }

            if ($scope.transfer != undefined)
                if ($scope.transfer.TransferGroup == 4 && $scope.transfer.DetailsOfCharges != 'OUR') {
                    $scope.BankOperationFeeType = 4;
                }

            if ($scope.BankOperationFeeType != 0) {
                var Data = infoService.GetBankOperationFeeTypes($scope.BankOperationFeeType);
                Data.then(function (acc) {
                    $scope.feeTypes = acc.data;
                    if ($scope.BankOperationFeeType == 2) {
                        if (
                            ($scope.order.ReceiverAccount.Currency == 'CHF' && $scope.order.DebitAccount.Currency == 'CHF') ||
                            ($scope.order.ReceiverAccount.Currency == 'GBP' && $scope.order.DebitAccount.Currency == 'GBP')
                        ) {
                            delete $scope.feeTypes[0];
                        }

                        $scope.feeType = '9';

                    }
                    else if ($scope.BankOperationFeeType == 6) {
                        if ($scope.order.ReceiverAccount.Currency == 'AMD' && $scope.order.DebitAccount.Currency == 'AMD') {
                            $scope.feeType = '28';
                        }
                    }
                    else if ($scope.BankOperationFeeType == 4) {
                        if ($scope.order.Type == 56) {
                            delete $scope.feeTypes[20];
                            $scope.feeType = '5';
                        }
                        if ($scope.transfer != undefined) {
                            delete $scope.feeTypes[20];
                            delete $scope.feeTypes[21];
                            $scope.feeType = '5';
                        }
                        else {
                            delete $scope.feeTypes[5];
                            $scope.feeType = '20';
                        }

                    }

                    if ($scope.order.Type == 133) {
                        $scope.feeType = '1';
                    }

                }, function () {
                    alert('Currencies Error');
                });
            }
        };
        $scope.$watch('feeType', function (newValue, oldValue) {
            if ($scope.details != true) {
                //$scope.feeAccounts = null;
                if ($scope.feeType == 1 || $scope.feeType == 3 || $scope.feeType == 5 || $scope.feeType == 6 || $scope.feeType == 8 || $scope.feeType == 28 || $scope.feeType == 0) {
                    $scope.checkForFeeAccount = 1;
                    $scope.getFee();
                }
                if ($scope.feeType == 2 || $scope.feeType == 4 || $scope.feeType == 9 || $scope.feeType == 20 || $scope.feeType == 11 || $scope.feeType == 29) {
                    $scope.checkForFeeAccount = 0;
                    $scope.getFee();
                    if ($scope.feeAccounts == undefined) {
                        $scope.getFeeAccounts(1, 2);
                    }
                }

                if ((newValue == 2 || newValue == 4 || newValue == 9 || newValue == 20 || newValue == 11 || newValue == 29) &&
                    (oldValue == 1 || oldValue == 3 || oldValue == 5 || oldValue == 6 || oldValue == 8 || oldValue == 0 || oldValue == 28)) {
                    $scope.order.FeeAccount = null;
                }

            }

        });
        $scope.$watch('(order.Type==52 && order.DebitAccount.AccountType!=11 && order.DebitAccount.Currency==order.ReceiverAccount.Currency) ||  ((order.Type==51 || order.Type == 95) && order.ReceiverAccount.Currency=="RUR" && order.DebitAccount.Currency=="RUR") || (order.Type==133)', function (newValue, oldValue) {

            if (newValue == true && $scope.details != true) {
                $scope.getBankOperationFeeTypes();
            }

        });
        $scope.$watch('transfer != undefined', function (newValue, oldValue) {
            if ($scope.transfer != undefined)
                if ($scope.transfer.TransferGroup == 4 && $scope.transfer.DetailsOfCharges != 'OUR') {
                    $scope.getBankOperationFeeTypes();
                }

        });

        $scope.$watch('((order.Type==51 || order.Type == 95) && (order.ReceiverAccount.Currency=="CHF" && order.DebitAccount.Currency=="CHF") || (order.ReceiverAccount.Currency=="AMD" && order.DebitAccount.Currency=="AMD") || (order.ReceiverAccount.Currency=="GBP" && order.DebitAccount.Currency=="GBP")  )', function (newValue, oldValue) {

            if (newValue == true && $scope.details != true) {
                $scope.getBankOperationFeeTypes();
            }

        });

        $scope.$watch('order.FeeAccount', function (newValue, oldValue) {
            if ($scope.details != true) {
                if (($scope.feeType == '2' || $scope.feeType == '4' || $scope.feeType == '9' || $scope.feeType == '20' || $scope.feeType == '11' || $scope.feeType == '29') && $scope.order.Fees != null) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        if ($scope.order.Fees[i].Type == $scope.feeType) {
                            $scope.order.Fees[i].Account = $scope.order.FeeAccount;
                        }
                    }
                }
            }
        });



        $scope.checkFeeAccount = function () {
            if ($scope.order.Type == 1 && $scope.order.SubType == 2) {
                if ($scope.order.TransferFee > 0 && ($scope.order.FeeAccount == undefined || $scope.order.FeeAccount.AccountNumber == undefined)) {
                    return false;
                }
                else
                    return true;
            }
            if ($scope.order.Type == 56 && $scope.order.SubType == 2) {
                if ($scope.order.TransferFee == -1) {
                    return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:', 'error');
                }
                if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0) {
                    return false;
                }
                else
                    return true;
            }
            if ($scope.feeType != "1" && $scope.feeType != "3" && $scope.feeType != "5" && $scope.feeType != "6" && $scope.feeType != "8") {
                if ($scope.order.TransferFee > 0 && ($scope.order.FeeAccount == undefined || $scope.order.FeeAccount.AccountNumber == undefined)) {
                    return false;
                }
                else
                    return true;
            }
            else
                return true;
        }


        $scope.getPaymentOrderDescription = function () {

            if ($scope.orderType == 122) {
                return;
            }

            if ($scope.isLeasingAccount || $scope.isFirstCall == true) {
                //եթե բացվում է հաշիվը արդեն ընտրված ապա առաջին անգամ պետք չի կանչել տվյալ ֆունկցիան,կանչվում է տվյալ ֆունցկիան դիրեկտիվայից
                $scope.isFirstCall = false;
                return;
            }
            if ($scope.order.Type != undefined && $scope.order.Type != 53 && $scope.order.Type != 54 && $scope.order.Type != 55 && $scope.matureOrder == null && $scope.transfer == undefined && $scope.swiftMessage == undefined) {
                var Data = paymentOrderService.getPaymentOrderDescription($scope.order);
                Data.then(function (result) {
                    $scope.description = result.data;

                    if ($scope.order.ReceiverAccount != undefined && $scope.order.ReceiverAccount.AccountType == 11
                        && result.data.includes("Քարտային հաշվին մուծում")) {
                        var hasDescription = false;
                        for (let i = $scope.operations.length - 1; i >= 0; i--) {
                            if ($scope.operations[i].includes($scope.description)) {
                                hasDescription = true;
                                break;
                            }
                        }
                        if (!hasDescription)
                            $scope.operations.push($scope.description);
                    }

                    if (($scope.order.Type == 52 || $scope.order.Type == 133) && $scope.description == "") {
                        $scope.description = $scope.operations[58];
                    }
                    else if ($scope.order.Type == 83 && $scope.description == "") {
                        $scope.description = 'ՊՔ սպասարկման միջն/վճ. գանձում ' + $scope.cardNumber.toString();
                    }

                }, function () {
                    alert('Error in ddeessxx');
                });
            }
        };

        $scope.updateDescription = function () {
            $scope.description = $scope.description.trim().replace(';Լիզինգի մասնակի մարում', '').replace(';Գույքահարկի մարում', '').replace(';Ապահովագրավճարի մարում', '')
                .replace(';Միջնորդավճարի մարում', '').replace(';Նախավարձի մարում', '').replace(';Փոխհատուցվող հարկերի և տուրքերի մարում', '')
                .replace(';Լիզինգի լրիվ մարում', '').replace(';Լիզինգի Կանխավճար', '');
            if ($scope.order.PayType === "2") {
                $scope.description = $scope.description.trim() + ";Լիզինգի մասնակի մարում";
            }
            else if ($scope.order.PayType === "3") {
                $scope.description = $scope.description.trim() + ";Գույքահարկի մարում";
            }
            else if ($scope.order.PayType === "4") {
                $scope.description = $scope.description.trim() + ";Ապահովագրավճարի մարում";
            }
            else if ($scope.order.PayType === "5") {
                $scope.description = $scope.description.trim() + ";Միջնորդավճարի մարում";
            }
            else if ($scope.order.PayType === "6") {
                $scope.description = $scope.description.trim() + ";Նախավարձի մարում";
            }
            else if ($scope.order.PayType === "7") {
                $scope.description = $scope.description.trim() + ";Փոխհատուցվող հարկերի և տուրքերի մարում";
            }
            else if ($scope.order.PayType === "8") {
                $scope.description = $scope.description.trim() + ";Լիզինգի լրիվ մարում";
            }
            else if ($scope.order.PayType === "9") {
                $scope.description = $scope.description.trim() + ";Լիզինգի Կանխավճար";
            }
        };

        $scope.getPaymentOrderFeeDetails = function (isCopy) {
            $scope.orderForFee = {
            };
            if ($scope.order.Fees != null) {
                for (var fee in $scope.order.Fees) {

                    if (($scope.order.Fees[fee].Type == 1 || $scope.order.Fees[fee].Type == 3 || $scope.order.Fees[fee].Type == 8 || (($scope.transfer != undefined || ($scope.order.TransferID != 0 && $scope.order.TransferID != undefined)) && $scope.order.Fees[fee].Type == 5)) && $scope.order.Fees[fee].Amount > 0) {

                        $scope.orderForFee = {
                        };
                        $scope.orderForFee.Amount = $scope.order.Fees[fee].Amount;
                        $scope.orderForFee.OPPerson = {
                        };
                        $scope.orderForFee.OPPerson = $scope.order.OPPerson;
                        $scope.orderForFee.ReceiverAccount = {
                        };
                        $scope.orderForFee.Type = $scope.order.Type;
                        $scope.orderForFee.RegistrationDate = $scope.order.RegistrationDate;
                        $scope.orderForFee.OperationDate = $scope.order.OperationDate;
                        $scope.orderForFee.Description = $scope.order.Fees[fee].Description;
                        $scope.orderForFee.OrderNumber = $scope.order.Fees[fee].OrderNumber;

                        if (!isCopy) {
                            $scope.orderForFee.Currency = $scope.order.Currency;
                            if ($scope.order.Fees[fee].Type == 5 && $scope.order.Type == 56)
                                $scope.orderForFee.Currency = "AMD";

                            var Data = paymentOrderService.getOperationSystemAccountForFee($scope.orderForFee,
                                $scope.order.Fees[fee].Type);
                            Data.then(function (result) {
                                $scope.orderForFee.ReceiverAccount.AccountNumber = result.data;
                                $scope.orderForFee.Currency = "AMD";
                                var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                                Data.then(function (response) {
                                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                    ReportingApiService.getReport(requestObj, function (result) {
                                        ShowPDFReport(result);
                                    });
                                }, function () {
                                    alert('Error getCashInPaymentOrder');
                                });
                            });
                        }
                        else if ($scope.order.TransferID != 0 && $scope.order.TransferID != undefined) {
                            $scope.orderForFee.Currency = "AMD";
                            var Data = paymentOrderService.getOperationSystemAccountForFee($scope.orderForFee,
                                $scope.order.Fees[fee].Type);
                            Data.then(function (result) {

                                $scope.orderForFee.ReceiverAccount.AccountNumber = result.data;
                                $scope.orderForFee.Currency = $scope.order.Fees[fee].Currency;
                                var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                                Data.then(function (response) {
                                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                    ReportingApiService.getReport(requestObj, function (result) {
                                        ShowPDFReport(result);
                                    });
                                }, function () {
                                    alert('Error getCashInPaymentOrder');
                                });
                            });
                        }
                        else {
                            $scope.orderForFee.Currency = $scope.order.Fees[fee].Currency;
                            $scope.orderForFee.ReceiverAccount.AccountNumber = $scope.order.Fees[fee].CreditAccount.AccountNumber;
                            var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                            Data.then(function (response) {
                                var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                                ReportingApiService.getReport(requestObj, function (result) {
                                    ShowPDFReport(result);
                                });
                            }, function () {
                                alert('Error getCashInPaymentOrder');
                            });
                        }


                    }

                }
            }

        }

        $scope.setPaymentOrderForMature = function (matureOrder) {
            if ($scope.checkAmount == 1) {
                $scope.order.ReceiverAccount = matureOrder.Account;
                if (matureOrder.Account != undefined && matureOrder.Account != null) {
                    if (matureOrder.Account.AccountNumber != undefined) {
                        $scope.AccountNumber = matureOrder.Account.AccountNumber;
                    }
                }

                $scope.order.Amount = matureOrder.Amount == undefined ? undefined : matureOrder.Amount;

            }
            else {
                $scope.order.ReceiverAccount = matureOrder.PercentAccount;
                $scope.order.Amount = matureOrder.PercentAmountInAMD == undefined ? 0 : matureOrder.PercentAmountInAMD;

                if (matureOrder.PercentAccount != undefined && matureOrder.PercentAccount != null) {
                    if (matureOrder.PercentAccount.AccountNumber != undefined) {
                        $scope.AccountNumber = matureOrder.PercentAccount.AccountNumber;
                    }
                }
            }
            $scope.order.MatureType = matureOrder.MatureType;

        }

        if ($scope.matureOrder) {
            $scope.setPaymentOrderForMature($scope.matureOrder);
        }

        $scope.callbackgetPaymentOrder = function () {
            $scope.getPaymentOrder($scope.selectedOrderId);
        }


        $scope.setFeeType = function () {
            $scope.order.FeeType = $scope.feeType;
        }


        $scope.isTransferFromBusinessmanToOwnerAccount = function () {
            if ($scope.order.DebitAccount != undefined && $scope.order.ReceiverAccount != undefined && $scope.order.ReceiverAccount.AccountNumber != undefined && $scope.forBankTransfers == true) {
                var Data = paymentOrderService.isTransferFromBusinessmanToOwnerAccount($scope.order.DebitAccount.AccountNumber, $scope.order.ReceiverAccount.AccountNumber);
                Data.then(function (acc) {
                    $scope.checkOwnerAccount = acc.data;
                    $scope.getFee();
                    if ($scope.checkOwnerAccount == true) {
                        $scope.order.FeeAccount = undefined;
                        $scope.checkForFeeAccount = 0;
                        $scope.getFeeAccounts(1, 2);

                    }
                    if ($scope.checkOwnerAccount == false && $scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == 11) {
                                $scope.order.Fees.splice(i, 1);
                            }
                        }
                    }
                }, function () {
                    alert('Error in isTransferFromBusinessmanToOwnerAccount');
                });
            }
        }

        $scope.searchTransfersBankMail = function () {
            if ($scope.order.DebitAccount != undefined) {
                if ($scope.order.Type == 86 || $scope.order.Type == 56) {

                    var Data = utilityService.getOperationSystemAccount($scope.order, 1, $scope.order.DebitAccount.Currency);
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



            $scope.searchInternationalTransfersModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

        $scope.openSearchTransfersBankMailModal = function () {
            if ($scope.interBankTransfer) {
                $scope.transferGroup = 4;
            }
            else {
                $scope.transferGroup = 1;
            }
            $scope.searchTransfersBankMailModalInstance = $uibModal.open({
                template: '<searchtransferbankmail transfergroup="' + $scope.transferGroup + '" callback="getSearchedTransferBankMail(transferBankMail)" close="closeSearchTransfersBankMailModal()" accnumber="' + $scope.accNumber + '"  isbudget=2></searchtransferbankmail>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });
        }

        $scope.getSearchedTransferBankMail = function (transferBankMail) {
            $scope.order.ReceiverAccount = {
                AccountNumber: transferBankMail.ReceiverAccount
            };
            $scope.order.Receiver = transferBankMail.ReceiverName;
            $scope.ReceiverBank = transferBankMail.ReceiverBank;
            $scope.order.Description = transferBankMail.DescriptionForPayment;
            $scope.receiverAccountAfterApdate();
            $scope.closeSearchTransfersBankMailModal();
        }

        $scope.receiverAccountAfterApdate = function () {
            $scope.checkForBudgetAccountAndBankAccount();
            $scope.setReceiverBank();
            $scope.getReceiverAccountWarnings($scope.order.ReceiverAccount.AccountNumber);
            $scope.getFee();
        }


        $scope.closeSearchTransfersBankMailModal = function () {
            $scope.searchTransfersBankMailModalInstance.close();
        }

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



        //Մուտք տարանցիկ հաշվին (Կանխիկ մուտք) ստուգում է որ արժույթը ընտրված լինի
        $scope.checkDebitAccountForTransitPaymentOrder = function (isOpenForFee) {
            $scope.checkForTransit = false;

            if (isOpenForFee == undefined)
                isOpenForFee = false;
            else
                isOpenForFee = true;
            if ($scope.order.DebitAccount != undefined && $scope.order.DebitAccount.AccountNumber != undefined) {
                if ($http.pendingRequests.length == 0) {
                    $scope.params = { paymentOrder: $scope.order, isOpenForfee: isOpenForFee };
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

        $scope.getSpecialPriceWarnings = function () {
            if (($scope.order.Type == 52 && ($scope.feeType == 2 || $scope.feeType == 4)) || $scope.order.Type == 1) {
                if ($scope.order.DebitAccount != null && $scope.order.DebitAccount.AccountNumber != null) {
                    var Data = paymentOrderService.getSpecialPriceWarnings($scope.order.DebitAccount.AccountNumber, $scope.order.Type == 52 && ($scope.feeType == 2 || $scope.feeType == 4) ? 4 : 3);
                    Data.then(function (acc) {
                        $scope.warning = acc.data;
                    }, function () {
                        alert('Warning Error');
                    });
                }
            }
            else {
                $scope.warning = undefined;
            }
        };

        $scope.getCustomerDocumentWarnings = function (customerNumber) {
            var Data = customerService.getCustomerDocumentWarnings(customerNumber);
            Data.then(function (ord) {
                $scope.customerDocumentWarnings = ord.data;
            }, function () {
                alert('Error CashTypes');
            });

        };

        //Հաշվի որոնում քարտով
        $scope.searchCards = function () {
            $scope.searchCardsModalInstance = $uibModal.open({
                template: '<searchcard callback="getSearchedCard(card)" close="closeSearchCardsModal()"></searchcard>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });

            $scope.searchCardsModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

        $scope.closeSearchCardsModal = function () {
            $scope.searchCardsModalInstance.close();
        };

        $scope.getSearchedCard = function (selectedCard) {
            $scope.order.ReceiverAccount = selectedCard.CardAccount;
            $scope.receiverAccountAccountNumber = selectedCard.CardAccount.AccountNumber;
            $scope.order.ReceiverAccount.AccountNumber = selectedCard.CardAccount.AccountNumber;
            $scope.order.Receiver = selectedCard.CardAccount.AccountDescription;
            $scope.checkForBudgetAccountAndBankAccount(false);
            $scope.order.ReceiverAccount.Description = selectedCard.CardAccount.AccountDescription;
            $scope.ReceiverBank = selectedCard.CardAccount.AccountDescription;
            $scope.isTransferFromBusinessmanToOwnerAccount();

            $scope.order.FeeAccount = '';
            $scope.order.UrgentSign = false;
            if ($scope.forBankTransfers == true) {
                $scope.setReceiverBank();
                $scope.getPaymentOrderDescription();
                $scope.getReceiverAccountWarnings($scope.order.ReceiverAccount.AccountNumber);
                $scope.getFee();

            }
            $scope.closeSearchCardsModal();
        }


        //լիզինգի որոնում 

        $scope.selectedLeasingLoanDetails = "";

        $scope.searchLeasingCustomers = function () {

            $scope.searchLeasingCustomersModalInstance = $uibModal.open({
                template: '<searchleasing customernumber="order.CustomerNumber" callback="getSearchedLeasingLoan(selectedLeasingLoanDetails)" close="closeSearchLeasingCustomerModal()"></searchleasing>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });
        }

        $scope.closeSearchLeasingCustomerModal = function () {
            $scope.searchLeasingCustomersModalInstance.close();
            if ($scope.selectedLeasingLoanDetails == "") {
                $scope.isLeasingAccount = false;
            }
        }
        $scope.getSearchedLeasingLoan = function (selectedLeasingLoanDetails) {
            $scope.selectedLeasingLoanDetails = selectedLeasingLoanDetails;
            if ($scope.selectedLeasingLoanDetails != "") {
                $scope.order.AdditionalParametrs = [
                    { 'AdditionTypeDescription': 'LeasingCustomerNumber', 'AdditionValue': $scope.selectedLeasingLoanDetails.LeasingCustomerNumber },
                    { 'AdditionTypeDescription': 'LoanFullNumber', 'AdditionValue': $scope.selectedLeasingLoanDetails.LoanFullNumber },
                    { 'AdditionTypeDescription': 'StartDate', 'AdditionValue': $scope.selectedLeasingLoanDetails.StartDate != undefined ? $filter('mydate')($scope.selectedLeasingLoanDetails.StartDate, "dd/MM/yyyy") : null },
                    { 'AdditionTypeDescription': 'StartCapital', 'AdditionValue': $scope.selectedLeasingLoanDetails.StartCapital },
                    { 'AdditionTypeDescription': 'Currency', 'AdditionValue': $scope.selectedLeasingLoanDetails.Currency },
                    { 'AdditionTypeDescription': 'Description', 'AdditionValue': $scope.selectedLeasingLoanDetails.Description },
                    { 'AdditionTypeDescription': 'AddDescription', 'AdditionValue': $scope.selectedLeasingLoanDetails.AddDescription },
                    { 'AdditionTypeDescription': 'AccountType', 'AdditionValue': 'LeasingAccount' },
                    { 'AdditionTypeDescription': 'PrepaymentAmount', 'AdditionValue': $scope.selectedLeasingLoanDetails.PrepaymentAmount },
                    { 'AdditionTypeDescription': 'LeasingInsuranceId', 'AdditionValue': $scope.selectedLeasingInsuranceId }
                ];
                $scope.description = $scope.selectedLeasingLoanDetails.Description + "  " + $scope.selectedLeasingLoanDetails.AddDescription;
            }

            $scope.getOperationSystemAccountForLeasing();
            $scope.closeSearchLeasingCustomerModal();
        }

        $scope.setSearchType = function (type) {
            $scope.isLeasingAccount = type;
            if (!$scope.isLeasingAccount) {
                $scope.order.AdditionalParametrs = [];
            }
        }

        $scope.getOperationSystemAccountForLeasing = function () {
            var Data = casherService.getUserFilialCode();
            Data.then(function (filial) {
                $scope.operationFilialCode = filial.data;
                var Data = accountService.getOperationSystemAccountForLeasing("AMD", $scope.operationFilialCode);
                Data.then(function (acc) {
                    $scope.order.ReceiverAccount = acc.data;
                    $scope.receiverAccountAccountNumber = acc.data.AccountNumber;
                    $scope.order.ReceiverAccount.AccountNumber = acc.data.AccountNumber;
                    $scope.order.Receiver = acc.data.AccountDescription;

                    $scope.order.ReceiverAccount.Description = $scope.order.ReceiverAccount.AccountDescription;
                    $scope.isLeasingAccount = true;

                    $scope.checkForBudgetAccountAndBankAccount(false);
                    $scope.ReceiverBank = acc.data.AccountDescription;
                    //$scope.setReceiverBank();           
                    $scope.isTransferFromBusinessmanToOwnerAccount();
                    $scope.order.FeeAccount = '';
                    $scope.order.UrgentSign = false;
                    if ($scope.forBankTransfers == true) {
                        $scope.setReceiverBank();
                        //$scope.getPaymentOrderDescription();
                        $scope.getReceiverAccountWarnings($scope.order.ReceiverAccount.AccountNumber);
                        $scope.getFee();
                    }

                }, function () {
                    alert('Error Get Filial');
                });

            }, function () {
                alert('Error getOperationSystemAccountForLeasing');
            });
        }

        $scope.setFocusAmount = function () {
            $timeout(function () {
                var amount = document.getElementById('amount');
                amount.focus();
            }, 200);


        }

        $scope.addDescription = function () {
            if ($scope.interBankTransfer) {
                if ($scope.order.Description != undefined) {
                    if ($scope.order.Receiver && $scope.order.Description.indexOf($scope.oldReveiver) == -1) {
                        $scope.order.Description += ' Վճարել ' + $scope.order.Receiver;
                        $scope.oldReveiver = $scope.order.Receiver;
                    }
                    else if ($scope.order.Receiver) {
                        $scope.order.Description = $scope.order.Description.replace($scope.oldReveiver, $scope.order.Receiver);
                        $scope.oldReveiver = $scope.order.Receiver;
                    }
                }
                else {
                    if ($scope.order.Receiver) {
                        $scope.order.Description = 'Վճարել ' + $scope.order.Receiver;
                        $scope.oldReveiver = $scope.order.Receiver;
                    }
                }
            }
        }

        var BreakException = {};

        if ($scope.orderType == 95 || $scope.orderType == 122) {

            $scope.order.ReestrTransferAdditionalDetails = [{ Amount: null }];
            var secretEmptyKey = '[$empty$]';
            $scope.stateComparator = function (state, viewValue) {
                return viewValue === secretEmptyKey || ('' + state).toLowerCase().indexOf(('' + viewValue).toLowerCase()) > -1;
            };

            $scope.onFocus = function (e) {
                $timeout(function () {
                    $(e.target).trigger('input');
                });
            };

            $scope.delete = function (index) {
                $scope.order.ReestrTransferAdditionalDetails.splice(index, 1);
                $scope.sumOrderAmount();
            }

            $scope.addTransferDetails = function () {
                if ($scope.order.ReestrTransferAdditionalDetails.length > 0) {
                    for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                        if ($scope.order.ReestrTransferAdditionalDetails[i].Amount <= 0.01) {
                            ShowMessage('Գումարը սխալ է մուտքագրված ', 'error');
                            return;
                        }
                        else if ($scope.order.ReestrTransferAdditionalDetails[i].Description == null || $scope.order.ReestrTransferAdditionalDetails[i].Description == ''
                            || $scope.order.ReestrTransferAdditionalDetails[i].Description == undefined || $scope.order.ReestrTransferAdditionalDetails[i].Description.length == 0
                            || $scope.order.ReestrTransferAdditionalDetails[i].Description.length == undefined || $scope.order.ReestrTransferAdditionalDetails[i].Description.trim().length == 0) {
                            ShowMessage('Նկարագրությունը սխալ է մուտքագրված ', 'error');
                            return;
                        }
                    }
                }

                $scope.order.ReestrTransferAdditionalDetails.push({ Amount: 0 });
                $scope.sumOrderAmount();
            }

            $scope.sumOrderAmount = function (isReestrPaymentOrder, reestrSumAmount) {
                var amount = 0;
                for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                    amount = (parseFloat(amount) + parseFloat($scope.order.ReestrTransferAdditionalDetails[i].Amount)).toFixed(2);
                }
                $scope.order.Amount = amount;
                if (isReestrPaymentOrder != true) {
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
                else {
                    if ($scope.order.Amount != reestrSumAmount) {
                        ShowMessage('Ֆայլի գումարը չի համապատասխանում հաշվարկված գումարին։', 'error');
                    }
                }
                $scope.getFee();

            }

            $scope.readExcellForCashinReestrOrder = function (obj, valid) {
                if (obj.length > 0) {
                    if ($scope.order.ReestrTransferAdditionalDetails.length == 1 && $scope.order.ReestrTransferAdditionalDetails[0].Amount == null) {
                        $scope.order.ReestrTransferAdditionalDetails.splice(0, 1);
                    }
                    for (var i = 0; i < obj.length; i++) {
                        var index = Object.keys(obj[0]);
                        var oneRowAmount = convertToDouble(obj[i][index[0]]);
                        if (isNaN(oneRowAmount)) {
                            return ShowMessage('"' + i + '"տողի գումարը սխալ է մուտքագրված ', 'error');
                        }
                    }
                    for (var i = 0; i < obj.length; i++) {
                        var index = Object.keys(obj[0]);
                        var ReestrTransferAdditionalDetails = { Amount: convertToDouble(obj[i][index[0]]), Description: obj[i][index[1]] };
                        $scope.order.ReestrTransferAdditionalDetails.push(ReestrTransferAdditionalDetails);

                    }
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                    $scope.sumOrderAmount();

                    if (obj.length > 300) {
                        ShowMessage('Մուտքագրվել են "' + obj.length + '" գործառնություն:Առավելագույն գործառնությունների քանակ 300', 'error');
                    }
                    else {
                        ShowMessage('Մուտքագրվել են "' + obj.length + '" գործառնություն', 'ok');
                    }


                }
            }


        }


        $scope.readExcellForReestrPaymentOrder = function (obj, valid) {
            try {
                var reestrSumAmount = 0;
                if (obj.G10 != undefined && obj.G10.v != undefined) {
                    $scope.DebitAccountNumber = obj.G10.v;
                }
                else {
                    ShowMessage('Դեբետ հաշիվը բացակայում է', 'error');
                    $("#paymentorder_my_file_input").val('');
                    return;
                }
                if (obj.H10 != undefined && obj.H10.v != undefined) {
                    reestrSumAmount = parseFloat(obj.H10.v);
                }

                $scope.order.ReestrTransferAdditionalDetails = [];

                var readCreditAccount = true;
                var i = 14;
                while (readCreditAccount) {

                    if ((obj['G' + i.toString()] == '' || obj['G' + i.toString()] == undefined) && obj['H' + i.toString()] != '' && obj['H' + i.toString()] != undefined) {

                        ShowMessage('N ' + i.toString() + ' տողի Կրեդիտ հաշիվը բացակայում է։', 'error');
                        $("#paymentorder_my_file_input").val('');
                        return;
                    }

                    if ((obj['H' + i.toString()] == '' || obj['H' + i.toString()] == undefined) && obj['G' + i.toString()] != '' && obj['G' + i.toString()] != undefined) {

                        ShowMessage('N ' + i.toString() + ' տողի գումարը բացակայում է։', 'error');
                        $("#paymentorder_my_file_input").val('');
                        return;
                    }


                    if (obj['G' + i.toString()] != '' && obj['G' + i.toString()] != undefined && obj['G' + i.toString()].v != undefined && obj['G' + i.toString()].v != '') {

                        var ReestrTransferAdditionalDetails = { Amount: obj['H' + i.toString()].v, Description: obj['A' + i.toString()].v, CreditAccount: { AccountNumber: obj['G' + i.toString().trim()].v } };
                        $scope.order.ReestrTransferAdditionalDetails.push(ReestrTransferAdditionalDetails);
                        i++;
                    }

                    else {

                        readCreditAccount = false;
                        try {
                            var Data = utilityService.convertAnsiToUnicode(obj['A' + (i + 10).toString()].v);
                            Data.then(function (acc) {
                                $scope.description = acc.data;
                            },
                                function () {
                                    alert('Error convertAnsiToUnicode');
                                });
                        }
                        catch (err) {
                            ShowMessage('Նկարագրությունը սխալ է մուտքագրված ', 'error');
                            $("#paymentorder_my_file_input").val('');
                            return;

                        }

                    }

                }
                var Data = paymentOrderService.convertReestrDataToUnicode($scope.order.ReestrTransferAdditionalDetails);
                Data.then(function (acc) {
                    $scope.order.ReestrTransferAdditionalDetails = acc.data;

                    $scope.sumOrderAmount(true, reestrSumAmount);
                    $("#downLoadExcel").addClass("my_disable");
                    ShowMessage('Մուտքագրվել են "' + $scope.order.ReestrTransferAdditionalDetails.length + '" փոխանցումներ', 'ok');


                },
                    function () {
                        alert('Error convertReestrDataToUnicode');
                    });

            }
            catch (err) {
                ShowMessage('Հնարավոր չէ կարդալ Excel-ի ֆայլը', 'error');
                $("#paymentorder_my_file_input").val('');
                return;
            }
        }



        oFileIn = document.getElementById('paymentorder_my_file_input');
        if (oFileIn != undefined && oFileIn.addEventListener) {
            oFileIn.addEventListener('change', filePicked, false);

        }



        function filePicked(oEvent) {
            var isXLSX = false;

            // Get The File From The Input
            var oFile = oEvent.target.files[0];
            // var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();


            if (oFile.name.split('.').pop().toUpperCase() == 'XLSX') {
                isXLSX = true;
            }


            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {

                try {
                    if (!isXLSX) {
                        var data = e.target.result;
                        var cfb = XLS.CFB.read(data, { type: 'binary' });
                        var wb = XLS.parse_xlscfb(cfb);
                    }
                    else {
                        var data = e.target.result;
                        var wb = XLSX.read(data, { type: 'binary' });
                    }
                }
                catch (err) {
                    ShowMessage('Հնարավոր չէ կարդալ Excel-ի ֆայլը', 'error');
                    $("#paymentorder_my_file_input").val('');
                    return;
                }
                // Loop Over Each Sheet

                if ($scope.orderType == 122) {
                    oJS = wb.Sheets[wb.SheetNames[0]];
                    $scope.readExcellForReestrPaymentOrder(oJS, $scope.valid);
                }
                else {
                    wb.SheetNames.forEach(function (sheetName) {
                        $scope.valid = true;
                        var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                        if ($scope.orderType == 95) {
                            $scope.readExcellForCashinReestrOrder(oJS, $scope.valid);
                        }

                        $("#paymentorder_my_file_input").val('');
                        if (!$scope.valid) {
                            throw BreakException;
                        }
                    });
                }
            };
            // Tell JS To Start Reading The File.. You could delay this if desired
            reader.readAsBinaryString(oFile);

        }

        $scope.getReceiverStatuses = function () {
            var Data = paymentOrderService.getSyntheticStatuses();
            Data.then(function (acc) {

                $scope.receiverStatuses = acc.data;
            }, function () {
                alert('Error getReceiverStatuses');
            });
        };

        $scope.setReceiverStatus = function (receiverStatus) {
            $scope.order.AdditionalParametrs =
                [{ AdditionValue: receiverStatus, AdditionTypeDescription: 'InterBankTransfer' }];
        }
        //Հաշվիչ
        $scope.openCurNominalModal = function () {
            if ($scope.order.Currency == undefined) {
                $scope.isClickingCalc = true;
                return;
            }
            $scope.curNominalModal = $uibModal.open({
                template: '<curnominalform  currency="order.Currency"  callback="getAmount(amount)" close="closeCurNominalModal()"></curnominalform>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });
        }
        $scope.closeCurNominalModal = function () {
            $scope.curNominalModal.close();
        }
        $scope.getAmount = function (amount) {
            $scope.order.Amount = amount;
            $scope.closeCurNominalModal();
            $scope.getFee();
        }


        $scope.setOrderTypeForCardServiceFeePayment = function () {
            if ($scope.order.Type == 83) {
                $scope.order.Type = 121;
                $scope.checkForDebitAccount = 1;
                $scope.order.DebitAccount = { AccountNumber: 0, Currency: 'AMD' }

            }
            else {
                $scope.order.Type = 83;
                $scope.checkForDebitAccount = 0;
                $scope.order.DebitAccount = null;
            }
        };

        $scope.getFeeForInterBankTransfer = function (checkForTransitFee) {
            if (checkForTransitFee) {
                if ($scope.order.Type == 86)
                    $scope.feeType = '5';
                else if ($scope.order.Type == 90)
                    $scope.feeType = '20';
                $scope.getFee();
            }
            else {
                $scope.feeType = undefined;
                $scope.order.TransferFee = 0;
                $scope.order.FeeAccount = null;
                for (var i = 0; i < $scope.order.Fees.length; i++) {
                    if ($scope.order.Fees[i].Type == 5 || $scope.order.Fees[i].Type == 20) {
                        $scope.order.Fees.splice(i, 1);
                    }
                }
                $scope.getFee();
            }
        };


        $scope.setATSAccounts = function () {
            if ($scope.order.Type == 52) {
                $scope.getATSSystemAccounts($scope.order.DebitAccount.Currency, false);
            }
            if ($scope.order.Type == 51 || $scope.order.Type == 95) {
                $scope.getATSSystemAccounts($scope.order.ReceiverAccount.Currency, true);
            }
        };


        $scope.getATSSystemAccounts = function (currency, forDebitAccount) {
            $scope.showForATSCreditAccount = false;
            $scope.showForATSDebitAccount = false;
            if ($scope.ForATSAccount != true) {

                if (forDebitAccount == true) {
                    $scope.order.DebitAccount = { AccountNumber: 0, Currency: $scope.order.ReceiverAccount.Currency };
                }
                if (forDebitAccount != true) {
                    $scope.order.ReceiverAccount = { AccountNumber: 0, Currency: $scope.order.DebitAccount.Currency };
                }
                return;
            }


            var Data = accountService.getATSSystemAccounts(currency);
            Data.then(function (acc) {
                if (acc.data.length > 0) {
                    if (forDebitAccount) {
                        $scope.debitAccounts = acc.data;
                        $scope.showForATSDebitAccount = true;
                    }
                    else {
                        $scope.creditAccounts = acc.data;
                        $scope.showForATSCreditAccount = true;

                    }

                }

            }, function () {
                alert('Error getAGTSystemAccounts');
            });
        };

        // $scope.callAnotherController=function()
        //{
        //    $controller('PopUpCtrl', {$scope: $scope});
        //    $scope.checkDebitAccountForTransitPaymentOrder(true);
        //    $scope.openWindowWithTemplate('transitpaymentorder', 'Մուտք տարանցիկ հաշվին', 'transitpaymentorder');
        //}


        $scope.getTransitAccountsForDebitTransactions = function () {

            var Data = transitAccountsForDebitTransactionsService.getTransitAccountsForDebitTransactions();
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;
            }, function () {
                alert('Error getTransitAccountsForDebitTransactions');
            });

        };


        //Բյուջետային փոխանցումների համար անհրաժեշտ դաշտերի զրոյացում/լրացում
        $scope.setCreditor = function () {


            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber1 = null;
            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber2 = null;
            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber3 = null;
            $scope.transferArmPaymentOrderForm.CreditorDocumentNumber4 = null;
            $scope.order.CreditorDocumentType = null;
            $scope.order.CreditorStatus = null;
            $scope.order.CreditorDescription = null;


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

        $scope.initReestrTransferAdditionalDetails = function () {
            if ($scope.order.Type == 6) {
                $scope.checkTransactionIsChecked();
            }
            else {
                for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                    if ($scope.order.ReestrTransferAdditionalDetails[i].CardHasDAHK) {
                        $scope.showPaymentType = true;
                        break;
                    }
                }
            }
        };


        $scope.checkReestrTransferAdditionalDetails = function () {
            showloading();

            if ($scope.order.Type == 6) {
                var Data1 = paymentOrderService.checkHBReestrTransferAdditionalDetails($scope.order.Id, $scope.order.ReestrTransferAdditionalDetails);
                Data1.then(function (acc) {
                    $scope.order.ReestrTransferAdditionalDetails = acc.data;

                    var error = 0;
                    for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                        if ($scope.order.ReestrTransferAdditionalDetails[i].HBCheckResult != null || ($scope.order.ReestrTransferAdditionalDetails[i].HBCheckResult != "OK" && $scope.order.ReestrTransferAdditionalDetails[i].HBCheckResult != "OKBankMail")) {
                            error++;
                        }
                    }
                    for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                        if ($scope.order.ReestrTransferAdditionalDetails[i].HbDAHKCheckResult) {
                            $scope.showPaymentType = true;
                            $scope.reestrHasDAHK = true;
                            break;
                        }
                    }

                    $scope.isCheckedHBReestr = true;

                    sessionStorage.setItem("isCheckedHBReestr", $scope.isCheckedHBReestr);
                    sessionStorage.setItem("HBCheckResult", error);

                    hideloading();
                }, function () {
                    hideloading();
                    alert('Error checkHBReestrTransferAdditionalDetails');
                });
            }
            else {
                var Data = paymentOrderService.checkReestrTransferAdditionalDetails($scope.order.ReestrTransferAdditionalDetails);
                Data.then(function (acc) {
                    $scope.order.ReestrTransferAdditionalDetails = acc.data;

                    for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                        if ($scope.order.ReestrTransferAdditionalDetails[i].CardHasDAHK) {
                            $scope.showPaymentType = true;
                            break;
                        }
                    }
                    hideloading();
                }, function () {
                    hideloading();
                    alert('Error checkReestrTransferAdditionalDetails');
                });
            }


        };


        $scope.getTypeOfPaymentDescriptions = function () {

            var Data = infoService.getTypeOfPaymentDescriptions();
            Data.then(function (acc) {

                $scope.typeOfPaymentDescriptions = acc.data;
            }, function () {
                alert('Error getCreditorStatuses');
            });
        };



        $scope.getCardWithOutBallance = function () {
            var Data = paymentOrderService.getCardWithOutBallance($scope.order.DebitAccount.AccountNumber);
            Data.then(function (acc) {
                $scope.card = acc.data;
            }, function () {
                alert('Error getCardWithOutBallance');
            });
        };

        $scope.isUrgentTime = function () {
            $scope.isUrgentTime = false;

            var Data = paymentOrderService.isUrgentTime();
            Data.then(function (acc) {
                $scope.isUrgentTime = acc.data;
            }, function () {
                alert('Error isUrgentTime');
            });

        };


        //hb

        $scope.checkTransactionIsChecked = function () {
            var Data = paymentOrderService.getTransactionIsChecked($scope.order.Id, $scope.order.ReestrTransferAdditionalDetails);
            Data.then(function (acc) {
                $scope.order.ReestrTransferAdditionalDetails = acc.data;

                var error = 0;
                for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                    if ($scope.order.ReestrTransferAdditionalDetails[i].HBCheckResult != null || ($scope.order.ReestrTransferAdditionalDetails[i].HBCheckResult != "OK" && $scope.order.ReestrTransferAdditionalDetails[i].HBCheckResult != "OKBankMail")) {
                        error++;
                    }
                    if ($scope.order.ReestrTransferAdditionalDetails[i].PaymentType != 0) {
                        $scope.order.ReestrTransferAdditionalDetails[i].PaymentType = $scope.order.ReestrTransferAdditionalDetails[i].PaymentType.toString();
                    }
                }

                if ($scope.order.ReestrTransferAdditionalDetails[0].HBCheckResult != null && $scope.order.ReestrTransferAdditionalDetails[0].HBCheckResult != "") {
                    $scope.isCheckedHBReestr = true;
                }

                for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                    if ($scope.order.ReestrTransferAdditionalDetails[i].HbDAHKCheckResult && $scope.isCheckedHBReestr) {
                        $scope.showPaymentType = true;
                        $scope.reestrHasDAHK = true;
                        break;
                    }
                }


                sessionStorage.setItem("isCheckedHBReestr", $scope.isCheckedHBReestr);
                sessionStorage.setItem("HBCheckResult", error);
            }, function () {
                alert('Error getTransactionIsChecked');
            });
        };

        $scope.showDescriptionFullText = function (event, description) {

            if (description.length > 20) {
                $scope.elementTransactionDescription = description;

                document.getElementById("showDescription").style.display = "block";
                document.getElementById("showDescription").style.left = (event.pageX - 700) + 'px';
                document.getElementById("showDescription").style.top = (event.pageY - 40) + 'px';
            }

        };

        $scope.hideDescriptionFullText = function () {
            if (document.getElementById("showDescription").style.display == "block") {
                document.getElementById("showDescription").style.display = "none";
            }
        };
        $scope.setPaymentTypeForAll = function () {
            for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                if ($scope.order.ReestrTransferAdditionalDetails[i].HbDAHKCheckResult) {
                    $scope.order.ReestrTransferAdditionalDetails[i].PaymentType = $scope.paymentTypeForAll.toString();
                }
            }
        };

        $scope.updatePaymentTypeForAll = function () {
            $scope.checkPaymentTypeForAll = false;
            $scope.paymentTypeForAll = undefined;

        };

        $scope.getSintAccounts = function () {
            var Data = paymentOrderService.getDebetCreditSintAccounts($scope.order.DebitAccount.AccountNumber);
            Data.then(function (bond) {
                if (bond.data) {

                    $scope.debetOldSintAccount = bond.data.m_Item1;
                    $scope.debetNewSintAccount = bond.data.m_Item2;

                    var Data1 = paymentOrderService.getDebetCreditSintAccounts($scope.order.ReceiverAccount.AccountNumber);
                    Data1.then(function (bond1) {

                        $scope.creditOldSintAccount = bond1.data.m_Item1;
                        $scope.creditNewSintAccount = bond1.data.m_Item2;

                    }, function () {
                        alert('Error getCreditSintAccount');
                    });
                }
            }, function () {
                alert('Error getDebetSintAccount');
            });

        };


        $scope.changeFormPosition = function () {
            if ($scope.$root.SessionProperties.IsCalledFromHB == true) {
                document.getElementById("reestrDetails").style.left = "400px";
            }
        };

        $scope.isNonExceptionalOrder = function () {
            $scope.setOrderSubType();
            if ($scope.order.Type == 85 || $scope.order.Type == 122) {
                return false;
            } else {
                return true;
            }
        };

        $scope.isDebetExportAndImportCreditLine = function () {
            var Data1 = paymentOrderService.isDebetExportAndImportCreditLine($scope.order.DebitAccount.AccountNumber);
            Data1.then(function (acc) {
                $scope.creditlinetype = acc.data;
                if ($scope.creditlinetype == 'True') {
                    document.getElementById("paymentLoad").classList.add("hidden");
                    return ShowMessage('ՈՒշադրություն!!! Այս հաշվից ելքագրումները պետք է կատարվեն միայն հաշիվ-ապրանքագրի առկայության դեպքում։Խնդրում ենք ստուգել այն և կցել "Այլ փաստաթղթեր"-ում։', 'error');
                }
            }, function () {
                alert('Error isDebetExportAndImportCreditLine');
            });

        };

        $scope.checkLeasingPayments = function () {
            if ($http.pendingRequests.length == 0) {
                if ($scope.isLeasingAccount && $scope.order.PayType == 4) {
                    var hasLeasingInsurance = sessionStorage.getItem("hasLeasingInsurance");
                    if (hasLeasingInsurance != null && hasLeasingInsurance != "false") {
                        $scope.selectedLeasingInsuranceId = leasingFactory.LeasingInsuranceId;
                        if ($scope.selectedLeasingInsuranceId != 0) {
                            $scope.order.AdditionalParametrs[9].AdditionValue = $scope.selectedLeasingInsuranceId;

                            var leasingInsuranceAmount = leasingFactory.LeasingInsuranceAmount;

                            if (parseFloat(leasingInsuranceAmount) < parseFloat($scope.order.Amount)) {
                                showMesageBoxDialog('Վճարվող գումարը մեծ է ապահովագրավճարի գումարից, մուտքագրեք ճիշտ գումար', $scope, 'error');
                                return;
                            }
                            else if (parseFloat(leasingInsuranceAmount) > parseFloat($scope.order.Amount)) {
                                $confirm({ title: 'Շարունակե՞լ', text: 'Վճարվող գումարը փոքր է ապահովագրավճարի գումարից, շարունակե՞լ' })
                                    .then(function () {
                                        $scope.savePayment();
                                    });
                            }
                            else {
                                $scope.savePayment();
                            }
                        }
                        else {
                            $scope.order.AdditionalParametrs[9].AdditionValue = null;
                            showMesageBoxDialog('Ապահովագրավճարի տողը ընտրված չէ։', $scope, 'error');
                            return;
                        }
                    }
                    else {
                        $scope.savePayment();
                    }
                }

                if ($scope.selectedLeasingLoanDetails != "" && $scope.order.AdditionalParametrs[8].AdditionTypeDescription == "PrepaymentAmount" &&
                    $scope.order.AdditionalParametrs[8].AdditionValue != 0 && $scope.order.PayType == 9) {
                    if (parseFloat($scope.order.AdditionalParametrs[8].AdditionValue) + 1 < parseFloat($scope.order.Amount)) {
                        ShowMessage('Վճարվող կանխավճարի գումարը մեծ է պայմանագրով սահմանված կանխավճարի գումարից, մուտքագրեք ճիշտ գումար', 'error');
                        return;
                    }
                    if (parseFloat($scope.order.AdditionalParametrs[8].AdditionValue) > parseFloat($scope.order.Amount)) {
                        $confirm({ title: 'Շարունակե՞լ', text: 'Վճարվող կանխավճարի գումարը փոքր է պայմանագրով սահմանված կանխավճարի գումարից' })
                            .then(function () {
                                $scope.savePayment();
                            });
                    }
                    else {
                        $scope.savePayment();
                    }
                }
            }
        };

        $scope.getLeasingInsuranceDeatils = function () {
            var dateBeginning = new Date(parseInt($scope.selectedLeasingLoanDetails.StartDate.substr(6)));
            if ($scope.order.PayType === "4") {
                params = { loanFullNumber: $scope.selectedLeasingLoanDetails.LoanFullNumber, dateOfBeginning: dateBeginning };
                leasingFactory.rootCtrlScope = $scope;
                $scope.openWindow('/Leasing/LeasingInsuranceDetails', 'Ապահովագրավճար', 'leasingInsuranceInfo');
            }
        };
        $scope.openWindow = function (url, title, id, callbackFunction) {
            $scope.disabelButton = true;
            if ($scope.$root.openedView.includes(id + '_isOpen') != true) {
                $scope.$root.openedView.push(id + '_isOpen');
                var dialogOptions = {
                    callback: function () {
                        if (dialogOptions.result !== undefined) {
                            cust.mncId = dialogOptions.result.whateverYouWant;
                        }
                    },
                    result: {}
                };

                dialogService.open(id, $scope, title, url, dialogOptions, undefined, undefined, callbackFunction);
            }
            else {
                $scope.disabelButton = true;
            }

        };

        $scope.checkLeasingPartlyPayment = function () {
            if ($scope.isLeasingAccount == true) {
                var Data1 = LeasingService.getPartlyMatureDebts($scope.selectedLeasingLoanDetails.GeneralNumber);
                Data1.then(function (acc) {
                    var amount = acc.data;
                    if ($scope.order.Amount <= amount) {
                        $confirm({ title: 'Շարունակե՞լ', text: `Վճարվող գումարը փոքր է լիզինգի ամսական վճարից և առկա այլ պարտավորություններից, նախ կմարվի ամսական վճարը, շարունակե՞լ` })
                            .then(function () {
                                $scope.savePayment();
                            }, function () {
                                return;
                            });

                    }
                    else if ($scope.order.Amount > amount) {
                        $confirm({ title: 'Շարունակե՞լ', text: `Վճարվող գումարից նախ կմարվի ամսական վճարը և առկա այլ պարտավորություններ, այնուհետև տարբերությունը կուղղվի մայր գումարի մասնակի մարման, շարունակե՞լ` })
                            .then(function () {
                                $scope.savePayment();
                            }, function () {
                                return;
                            });

                    }
                }, function () {
                    alert('Error isDebetExportAndImportCreditLine');
                });

            }
        };

        $scope.getRejectFeeTypes = function () {
            var Data = infoService.getRejectFeeTypes();
            Data.then(function (acc) {
                $scope.rejectFeeTypes = acc.data;
            }, function () {
                alert('Error getRejectFeeTypes');
            });

        };

    }]);

