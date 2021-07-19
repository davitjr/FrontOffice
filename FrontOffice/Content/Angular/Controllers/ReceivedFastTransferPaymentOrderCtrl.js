app.controller("ReceivedFastTransferPaymentOrderCtrl", ['$scope', 'receivedFastTransferPaymentOrderService', 'utilityService', 'accountService', 'customerService', 'infoService', 'dialogService', 'paymentOrderService', 'orderService', 'fastTransferPaymentOrderService', 'transferCallsService', 'internationalPaymentOrderService', '$confirm', '$filter', '$uibModal', '$http', '$rootScope', '$state', function ($scope, receivedFastTransferPaymentOrderService, utilityService, accountService, customerService, infoService, dialogService, paymentOrderService, orderService, fastTransferPaymentOrderService, transferCallsService, internationalPaymentOrderService, $confirm, $filter, $uibModal, $http, $rootScope, $state) {


    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };
    $scope.transfer = {
        Contract: []
    };
    $scope.NewOrEditFromCallCenter = 0;
    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error getCustomerDocumentWarnings');
        });

    };
    $scope.IsBankSourse = true;
    $scope.getCustomerDebts = function (customerNumber) {
        $scope.customerDahk = "";
        var Data = customerService.GetCustomerDebts(customerNumber);
        Data.then(function (debts) {

            for (var i = 0; i < debts.data.length; i++) {
                if ($scope.customerDahk != "")
                    $scope.customerDahk += ",\n";

                if (debts.data[i].DebtType == 9) {
                    $scope.customerDahk += debts.data[i].DebtDescription + ' - ';
                    if (debts.data[i].Amount != null)
                        $scope.customerDahk += utilityService.formatNumber(parseFloat(debts.data[i].Amount), 2) + ' ' + debts.data[i].Currency;
                    else
                        $scope.customerDahk += debts.data[i].AmountDescription;
                }
            };
        }, function () {
            alert('Error getCustomerDebts');
        });

    };

    if ($scope.order == undefined) {
        $scope.order = {};
        $scope.order.OrderNumber = " ";
        $scope.order.RegistrationDate = new Date();
        $scope.selectedCountry = "";
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        try {
            $scope.isCallCenter = $scope.$root.SessionProperties.AdvancedOptions["isCallCenter"];
        }
        catch (ex) {
            $scope.isCallCenter = "0";
        }

        if ($scope.transferByCall == undefined) {
            $scope.order.Type = 79;
            $scope.order.DescriptionForPayment = 'Non-commercial transfer for personal needs';

            $scope.order.ConvertationRate = 0;
            $scope.order.ConvertationRate1 = 0;
            $scope.order.ClientTransferAmount = 0;
            $scope.transferContracts = [];
            if ($scope.isCallCenter == "1")
                $scope.NewOrEditFromCallCenter = 1;
            else
                $scope.NewOrEditFromCallCenter = 0;

            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (descr) {
                $scope.order.CustomerNumber = descr.data;
                $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);
                if ($scope.isCallTransfer == 1) {
                    var Data = transferCallsService.getContractsForTransfersCall($scope.order.CustomerNumber, "0", "");

                    Data.then(function (ContractsForTransfersCall) {
                        $scope.transferContracts = ContractsForTransfersCall.data;

                    },
                        function () {
                            alert('Error getContractsForTransfersCall');
                        });

                }
            });
        }
        else {
            $scope.changeOrder = {};
            $scope.changeOrder.OrderNumber = " ";
            $scope.changeOrder.RegistrationDate = new Date();

            $scope.changeOrder.OperationDate = $scope.$root.SessionProperties.OperationDate;

            $scope.changeOrder.Type = 145;
            if ($scope.isCallCenter == "1")
                $scope.NewOrEditFromCallCenter = 2;
            else
                $scope.NewOrEditFromCallCenter = 0;
            if ($scope.transferByCall.Source != 2)
                $scope.IsBankSourse = false
            $scope.changeOrder.ReceivedFastTransfer = {};
            $scope.order.SubType = $scope.transferByCall.TransferSystem;
            $scope.order.ConvertationRate = $scope.transferByCall.RateBuy;
            $scope.order.ConvertationRate1 = $scope.transferByCall.RateSell;
            $scope.order.Amount = $scope.transferByCall.Amount;
            $scope.selectedCountry = $scope.transferByCall.Country;
            $scope.order.Country = $scope.transferByCall.Country;
            $scope.order.CustomerNumber = $scope.transferByCall.CustomerNumber;
            $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);
            $scope.getCustomerDebts($scope.order.CustomerNumber);
            $scope.order.Sender = $scope.transferByCall.Sender;
            $scope.order.Code = $scope.transferByCall.Code;
            $scope.order.TransferByCallID = $scope.transferByCall.Id;
            $scope.order.CustomerAmount = $scope.transferByCall.Amount;

            var Data = transferCallsService.getContractsForTransfersCall($scope.order.CustomerNumber, "0", "");

            Data.then(function (ContractsForTransfersCall) {
                $scope.transferContracts = ContractsForTransfersCall.data;
                for (var i = 0; i < $scope.transferContracts.length; i++) {
                    if ($scope.transferContracts[i].ContractId == $scope.transferByCall.ContractID) {
                        $scope.transfer.Contract = $scope.transferContracts[i];
                    }
                }

            },
                function () {
                    alert('Error getContractsForTransfersCall');
                });
            // $scope.getClientTransferAmount(); 
            $scope.transferContracts = [];
        }


    }


    $scope.FromTamplate = false;
    $scope.ForSetFee = false;
    $scope.getCreditAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 2);
        Data.then(function (acc) {
            $scope.creditAccounts = acc.data;
        }, function () {
            alert('Error getcreditaccounts');
        });

    };
    $scope.getCustomer = function () {

        var Data = customerService.getCustomer();
        Data.then(function (cust) {
            $scope.customer = cust.data;

            $scope.order.CustomerType = cust.data.CustomerType;
            $scope.order.Receiver = cust.data.FirstNameEng + ' ' + cust.data.LastNameEng;

            if ($scope.customer.DocumentNumber != null && $scope.customer.DocumentNumber != "")
                $scope.order.ReceiverPassport = $scope.customer.DocumentNumber +
                    ', ' +
                    $scope.customer.DocumentGivenBy +
                    ', ' +
                    $scope.customer.DocumentGivenDate;


        }, function () {
            alert('Error');
        });

    };


    $scope.getClientTransferAmount = function () {
        $scope.disableCurrency = true;
        if ($scope.order.Currency == "" || $scope.order.Currency == undefined || $scope.transfer.Contract.Currency == "" || $scope.transfer.Contract.Currency == undefined || $scope.order.Amount == "" || $scope.order.Amount == undefined) {
            $scope.disableCurrency = false;
            return;
        }
        if ($scope.transfer.Contract.Currency != $scope.order.Currency) {
            if ($scope.transfer.Contract.Currency == "AMD") {
                var Data = utilityService.getLastRates($scope.order.Currency, 6, 2); //Transfer Buy Rate

                Data.then(function (result) {
                    $scope.order.ConvertationRate1 = 0;
                    if ($scope.transferByCall == undefined)
                        $scope.order.ConvertationRate = utilityService.formatNumber(result.data, 2);
                    else
                        $scope.order.ConvertationRate = $scope.transferByCall.RateBuy;
                    $scope.ClientTransferAmount = utilityService.formatNumber(Math.round($scope.order.Amount * $scope.order.ConvertationRate * 100) / 100, 2);
                    $scope.disableCurrency = false;
                },
                    function () {
                        $scope.disableCurrency = false;
                        alert('Error getLastRates Buy');
                    });
            }
            else {
                if ($scope.order.Currency == "AMD") {
                    var Data = utilityService.getLastRates($scope.transfer.Contract.Currency, 6, 1); //Transfer Sell Rate

                    Data.then(function (result) {
                        $scope.order.ConvertationRate = 0;
                        if ($scope.transferByCall == undefined)
                            $scope.order.ConvertationRate1 = utilityService.formatNumber(result.data, 2);
                        else
                            $scope.order.ConvertationRate1 = $scope.transferByCall.RateSell;
                        $scope.ClientTransferAmount = utilityService.formatNumber(Math.round($scope.order.Amount / $scope.order.ConvertationRate1 * 100) / 100, 2);
                        $scope.disableCurrency = false;
                    },
                        function () {
                            $scope.disableCurrency = false;
                            alert('Error getLastRates Sell');
                        });
                }
                else {
                    var Data = utilityService.getLastRates($scope.transfer.Contract.Currency, 5, 1); //Cross Sell Rate

                    Data.then(function (result) {
                        if ($scope.transferByCall == undefined)
                            $scope.order.ConvertationRate1 = utilityService.formatNumber(result.data, 2);
                        else
                            $scope.order.ConvertationRate1 = $scope.transferByCall.RateSell;

                        var Data1 = utilityService.getLastRates($scope.order.Currency, 5, 2); //Cross Buy Rate

                        Data1.then(function (result1) {
                            if ($scope.transferByCall == undefined)
                                $scope.order.ConvertationRate = utilityService.formatNumber(result1.data, 2);
                            else
                                $scope.order.ConvertationRate = $scope.transferByCall.RateBuy;
                            $scope.ClientTransferAmount = utilityService.formatNumber(Math.round($scope.order.Amount * $scope.order.ConvertationRate / $scope.order.ConvertationRate1 * 100) / 100, 2);
                            $scope.disableCurrency = false;
                        },
                            function () {
                                $scope.disableCurrency = false;
                                alert('Error getLastRates Cross Buy');
                            });
                    },
                        function () {
                            $scope.disableCurrency = false;
                            alert('Error getLastRates Cross Sell');
                        });
                }
            }
        }
        else {
            $scope.ClientTransferAmount = utilityService.formatNumber($scope.order.Amount, 2);
            $scope.order.ConvertationRate = 0;
            $scope.order.ConvertationRate1 = 0;
            $scope.disableCurrency = false;
        }
    };


    //Նշվում է արժույթի/ների կուրսերը և փոխարկման տեսակը
    $scope.setConvertationRates = function () {

        if ($scope.order.Currency == "" || $scope.order.Currency == undefined || $scope.transfer.Contract.Currency == "" || $scope.transfer.Contract.Currency == undefined || $scope.order.Amount == "" || $scope.order.Amount == undefined)
            return;

        if ($scope.transfer.Contract.Currency != $scope.order.Currency) {

            var dCur = $scope.order.Currency;
            var cCur = $scope.transfer.Contract.Currency;

            if (dCur == "AMD") {
                $scope.getLastRates(cCur, 2, 1);
            }
            else {
                $scope.calculateCrossRate(dCur, cCur);
            }
        }
        else {
            $scope.order.Rate = 1;
            $scope.order.ConvertationRate = 0;
            $scope.order.ConvertationRate1 = 0;
            $scope.ClientTransferAmount = utilityService.formatNumber($scope.order.Amount, 2);

        }

    }

    //Հաշվարկում է գործող կուրսը և թարմացվում գումարը
    $scope.getLastRates = function (currency, rateType, direction) {
        var Data = utilityService.getLastRates(currency, rateType, direction);

        Data.then(function (result) {
            $scope.order.Rate = Math.round(result.data * 100) / 100;
            $scope.order.ConvertationRate = Math.round(result.data * 100) / 100;

            $scope.order.ConvertationType = direction;

            $scope.calculateConvertationAmount();


        }, function () {
            alert('Error in getLastRates');
        });

    }



    $scope.calculateCrossRate = function (dCur, cCur) {
        var dRate;
        var cRate;


        var Data = internationalPaymentOrderService.getCrossConvertationVariant(dCur, cCur);
        Data.then(function (acc) {
            $scope.crossVariant = acc.data;
            if ($scope.crossVariant == 0) {
                $scope.order.Currency = undefined;
                $scope.order.Rate = 1;
                $scope.order.AmountConvertation = undefined;
                return ShowMessage('Տվյալ զույգ արժույթների համար փոխարկում չի նախատեսված:', 'error');
            }
            var dData = utilityService.getLastRates(dCur, 5, 2);// Cross Buy
            dData.then(function (dResult) {

                dRate = dResult.data;
                $scope.order.ConvertationRate = Math.round(dResult.data * 100) / 100;

                var cData = utilityService.getLastRates(cCur, 5, 1);// Cross Sell
                cData.then(function (cResult) {

                    cRate = cResult.data;
                    $scope.order.ConvertationRate1 = Math.round(cResult.data * 100) / 100;

                    if ($scope.crossVariant == 1) {
                        $scope.order.Rate = dRate / cRate;
                    }
                    else {
                        $scope.order.Rate = cRate / dRate;
                    }

                    $scope.order.Rate = Math.round(($scope.order.Rate) * 10000000) / 10000000;

                    $scope.order.ConvertationType = 3;

                    $scope.calculateConvertationAmount();

                }, function () {
                    alert('Error1 in calculateCrossRate');
                });
            }, function () {
                alert('Error2 in calculateCrossRate');
            });
        }, function () {
            alert('Error getCrossConvertationVariant');
        });

    }

    //Հաշվարկվում է փոխարկվող գումարը կրեդիտագրվող հաշվի արժույթով
    $scope.calculateConvertationAmount = function () {
        if ($scope.order.ConvertationType != 3) $scope.order.ConvertationRate = $scope.order.Rate;
        if ($scope.order.Amount && $scope.order.Rate && $scope.order.DebitAccount.Currency != $scope.order.Currency) {
            if ($scope.order.ConvertationType == 3)//"Կրկնակի փոխարկում"
                $scope.ClientTransferAmount = Math.round(($scope.order.Amount * ($scope.order.ConvertationRate1 / $scope.order.ConvertationRate)) * 1000000) / 1000000;

            $scope.ClientTransferAmount = Math.round(($scope.order.Amount * $scope.order.Rate) * 100) / 100;

            $scope.ClientTransferAmount = utilityService.formatNumber($scope.ClientTransferAmount, 2);
        }
        $scope.getCardFee();
    }


    $scope.setFee = function () {

        var Data = receivedFastTransferPaymentOrderService.getReceivedFastTransferFeePercent($scope.order.SubType == undefined ? 0 : $scope.order.SubType
            , $scope.order.Code == undefined ? "" : $scope.order.Code
            , $scope.order.Country == undefined ? "" : $scope.order.Country
            , $scope.order.Amount == undefined ? 0 : $scope.order.Amount
            , $scope.order.Currency == undefined ? "" : $scope.order.Currency
            , $scope.order.OperationDate == undefined ? new Date() : $scope.order.OperationDate);
        Data.then(function (result) {
            $scope.order.FeeAcba = Math.round(result.data * 100) / 100;

        }, function () {
            alert('Error in GetFastTransferFeeAcbaPercent');
        });

    }



    $scope.getFeeAcbaType = function (isActive) {
        if ($scope.FromTamplate == false || $scope.order.SubType != 21) {
            var Data = receivedFastTransferPaymentOrderService.getFastTransferAcbaCommisionType($scope.order.SubType == undefined ? 0 : $scope.order.SubType, $scope.order.Code == undefined ? "" : $scope.order.Code);
            Data.then(function (result) {
                $scope.FeeAcbaType = result.data;
                if ($scope.FeeAcbaType != 3)
                    $scope.order.Fee = 0;

                if ($scope.FeeAcbaType == 3)
                    $scope.order.FeeAcba = 0;

                if ($scope.FeeAcbaType == 0) {
                    $scope.order.Fee = 0;
                    $scope.order.FeeAcba = 0;
                    if ($scope.order.SubType != undefined && $scope.order.Code != undefined && $scope.IsBankSourse)
                        return ShowMessage('Տեսակը նախատեսված չէ:', 'error');
                }

                $scope.setFee();

            }, function () {
                alert('Error in GetFastTransferFeeAcbaPercent');
            });
        }
    };

    $scope.getTransferTypes = function (isActive) {

        var Data = infoService.getTransferTypes(isActive);

        Data.then(function (transferTypes) {
            $scope.transferTypes = transferTypes.data;
            if ($scope.transferByCall != undefined) {
                $scope.order.SubType = $scope.transferByCall.TransferSystem.toString();
                $scope.getTransferSystemCurrency();
                $scope.setDescription();
                $scope.getFeeAcbaType();
            }
        },
            function () {
                alert('Error getTransferCallTypes');
            });
    };
    $scope.confirm = false;

    $scope.saveReceivedFastTransferPayment = function () {

        if (($scope.isCallTransfer == 1 || $scope.isCallCenter == "1") && $scope.transfer.Contract.ContractId == undefined && $scope.transferByCall.Source != 1 && $scope.transferByCall.Source != 5) {
            showMesageBoxDialog('Համաձայնագիրն ընտրված չէ', $scope, 'information');
        }
        else {
            if ($http.pendingRequests.length == 0) {

                document.getElementById("interLoad").classList.remove("hidden");

                //$scope.order.Type = 3;
                //$scope.order.SubType = 1;
                $scope.order.Attachments = [];

                $scope.order.Description = $scope.description;

                $scope.order.ContractId = $scope.transfer.Contract.ContractId;

                //if ($scope.cashType == 2)
                $scope.order.ReceiverAccount = undefined;
                if ($scope.changeOrder == undefined)
                    var Data = receivedFastTransferPaymentOrderService.saveReceivedFastTransferPaymentOrder($scope.order, $scope.confirm, $scope.NewOrEditFromCallCenter);
                else {
                    if ($scope.NewOrEditFromCallCenter == 2 && $scope.FromTamplate == false && ($scope.order.SubType == 16 || $scope.order.SubType == 17 || $scope.order.SubType == 12 || $scope.order.SubType == 22 || $scope.order.SubType == 15 || $scope.order.SubType == 21)) {
                        showMesageBoxDialog('Ընտրեք շաբլոնից', $scope, 'information');
                        document.getElementById("interLoad").classList.add("hidden");
                    }
                    else {
                        $scope.changeOrder.ReceivedFastTransfer = $scope.order;
                        $scope.changeOrder.ReceivedFastTransfer.Type = 79;
                        var Data = transferCallsService.saveCallTransferChangeOrder($scope.changeOrder);
                    }
                }
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        document.getElementById("interLoad").classList.add("hidden");
                        CloseBPDialog('receivedfasttransferpaymentorder');
                        if (($scope.order.ContractId == undefined || $scope.order.ContractId == 0 || $scope.order.ContractId == null) && $scope.NewOrEditFromCallCenter != 2) {
                            $scope.path = '#transfers';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            $state.go('transfers');
                            $rootScope.FromReceived = true;
                            refresh($scope.order.Type);
                        }
                        else if ($scope.NewOrEditFromCallCenter != 2) {
                            $scope.path = '#transfersByCall';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            $state.go('transfersByCall');
                            $rootScope.FromReceived = true;
                            refresh($scope.order.Type, 1);
                        }
                        else {
                            $scope.path = '#transfersByCall';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            window.location = '#transfersByCall';
                            refresh(145, 1);
                        }
                    }
                    else {
                        if (res.data.ResultCode == 6) {
                            $scope.ResultCode = undefined;
                            CloseBPDialog('receivedfasttransferpaymentorder');
                            $scope.path = '#transfersByCall';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է, սակայն վճարումը կատարված չէ', $scope, 'information');
                            $state.go('transfersByCall');
                        }
                        else {
                            document.getElementById("interLoad").classList.add("hidden");
                            showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveReceivedFastTransferPayment);
                        }
                    }
                }, function () {
                    $scope.confirm = false;
                    document.getElementById("interLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in FastTransferPaymentOrder');
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        }
    }

    $scope.RejectReceivedFastTransfer = function () {

        if ($http.pendingRequests.length == 0) {

            document.getElementById("interLoad").classList.remove("hidden");
            $rootScope.changeOrder.SubType = 3;
            // $rootScope.changeOrder.ReceivedFastTransfer = $scope.order;
            var Data = transferCallsService.saveCallTransferChangeOrder($rootScope.changeOrder);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("interLoad").classList.add("hidden");
                    CloseBPDialog('ReceivedFastTransferReject');
                    CloseBPDialog('receivedfasttransferpaymentorder');
                    $scope.path = '#transfersByCall';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    window.location = '#transfersByCall';
                    refresh($scope.order.Type, 1);

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
        if ($scope.order.Country != undefined && $scope.ForSetFee == false) {
            $scope.setFee();
        }
        $scope.ForSetFee = false;
    });



    $scope.setDescription = function () {
        $scope.description = "Փոխանցում " + $scope.transferTypes[$scope.order.SubType] + " համակարգով";
    };




    $scope.getTransferSystemCurrency = function () {

        $scope.order.Currency = undefined;
        var Data = infoService.getTransferSystemCurrency($scope.order.SubType);

        Data.then(function (transferSystemCurrency) {

            $scope.currencies = transferSystemCurrency.data;
            if ($scope.transferByCall != undefined) {
                $scope.order.Currency = $scope.transferByCall.Currency;
            }
        },
            function () {
                alert('Error getTransferSystemCurrency');
            });
    };


    //$scope.searchCards = function () {
    //    $scope.searchCardsModalInstance = $uibModal.open({
    //        template: '<searchcard callback="getSearchedCard(cardNumber)" close="closeSearchCardsModal()"></searchcard>',
    //        scope: $scope,
    //        backdrop: true,
    //        backdropClick: true,
    //        dialogFade: false,
    //        keyboard: false,
    //        backdrop: 'static',
    //    });

    //    $scope.searchCardsModalInstance.result.then(function (selectedItem) {
    //        $scope.selected = selectedItem;
    //    }, function () {

    //    });
    //};

    //$scope.getSearchedCard = function (cardNumber) {
    //    $scope.order.cardNumber = cardNumber;
    //    $scope.getCard(cardNumber);
    //    $scope.closeSearchCardsModal();
    //};

    //$scope.closeSearchCardsModal = function () {
    //    $scope.searchCardsModalInstance.close();
    //};

    //$scope.searchAccounts = function () {
    //    $scope.searchAccountsModalInstance = $uibModal.open({
    //        template: '<searchaccount callback="getSearchedAccounts(selectedAccount)" close="closeSearchAccountsModal()"></searchaccount>',
    //        scope: $scope,
    //        backdrop: true,
    //        backdropClick: true,
    //        dialogFade: false,
    //        keyboard: false,
    //        backdrop: 'static',
    //    });

    //    $scope.searchAccountsModalInstance.result.then(function (selectedItem) {
    //        $scope.selected = selectedItem;
    //    }, function () {

    //    });
    //};


    //$scope.getSearchedAccounts = function (selectedAccount) {
    //    $scope.order.ReceiverAccount = selectedAccount;
    //    $scope.receiverAccountAccountNumber = selectedAccount.AccountNumber;
    //    $scope.order.ReceiverAccount.AccountNumber = selectedAccount.AccountNumber

    //    $scope.ReceiverBank = selectedAccount.Description;

    //        $scope.setReceiverBank();
    //        $scope.getReceiverAccountWarnings($scope.order.ReceiverAccount.AccountNumber);
    //    $scope.closeSearchAccountsModal();
    //}

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




    $scope.getAcbaFee = function () {
        if ($scope.FeeAcbaType == 3) {
            var Data1 = fastTransferPaymentOrderService.GetFastTransferFeeAcbaPercent($scope.order.SubType);
            Data1.then(function (result) {
                $scope.order.FeeAcba =
                    Math.round(($scope.order.Fee * (Math.round(result.data * 100) / 100)) * 100) / 100;
            
            }, function () {
                alert('Error in GetFastTransferFeeAcbaPercent');
            });
        }
    }



    ////Ստացողի Բանկի որոշում` ըստ ելքագրվող հաշվի
    //$scope.setReceiverBank = function () {
    //    if ($scope.order.ReceiverAccount != null && $scope.order.ReceiverAccount.AccountNumber != 0) {
    //        var receiver_account = $scope.order.ReceiverAccount.AccountNumber;
    //    }

    //    if (receiver_account != "" && receiver_account != undefined) {
    //        // //if (receiver_account.toString().length == 12) {
    //        var Data = paymentOrderService.getBank(receiver_account.toString().substr(0, 5));
    //        Data.then(function (result) {
    //            $scope.ReceiverBank = result.data;
    //            if ($scope.ReceiverBank == "") {
    //                $scope.ReceiverBank = "Ստացողի բանկը գտնված չէ";
    //            }
    //        }, function () {
    //            alert('Error in receiverAccountChanged');
    //        });
    //        $scope.ReceiverBankCode = receiver_account.toString().substr(0, 5);

    //        // //}
    //    }
    //    else {
    //        $scope.ReceiverBank = "";
    //    }

    //}



    //$scope.closeSearchAccountsModal = function () {
    //    $scope.searchAccountsModalInstance.close();
    //};

    $scope.getReceivedFastTransferPaymentOrder = function (orderID) {
        var Data = receivedFastTransferPaymentOrderService.getReceivedFastTransferPaymentOrder(orderID);
        Data.then(function (acc) {

            $scope.orderDetails = acc.data;
            $scope.orderDetails.RegistrationDate = $filter('mydate')($scope.orderDetails.RegistrationDate, "dd/MM/yyyy");
            $scope.orderDetails.OperationDate = $filter('mydate')($scope.orderDetails.OperationDate, "dd/MM/yyyy");
            $scope.orderDetails.SenderDateOfBirth = $filter('mydate')($scope.orderDetails.SenderDateOfBirth, "dd/MM/yyyy");
        }, function () {
            alert('Error getFastTransferPaymentOrder');
        });

    };


    //$scope.getAccountByAccountNumber = function (receiverAccountAccountNumber) {
    //    $scope.receiverAccountAccountNumber = receiverAccountAccountNumber;
    //    if ($scope.receiverAccountAccountNumber != undefined && $scope.receiverAccountAccountNumber != "") {
    //        if ($scope.receiverAccountAccountNumber.toString().substring(0, 5) >= 22000 && $scope.receiverAccountAccountNumber.toString().substring(0, 5) < 22300) {
    //            $scope.hasaccount = true;
    //            $scope.searchParams = {
    //                accountNumber: $scope.receiverAccountAccountNumber,
    //                customerNumber: "",
    //                currency: "",
    //                sintAcc: "",
    //                sintAccNew: "",
    //                filialCode: 0,
    //                isCorAcc: false,
    //                includeClosedAccounts: false,
    //            };

    //            var Data = accountService.getSearchedAccounts($scope.searchParams);
    //            Data.then(function (acc) {
    //                if (acc.data.length > 0) {
    //                    $scope.getSearchedAccounts(acc.data[0])
    //                }
    //                else {
    //                    $scope.order.ReceiverAccount = undefined;
    //                    $scope.hasaccount = false;
    //                }
    //            }, function () {
    //                alert('Error in getSearchedAccounts');
    //            });

    //        }
    //        else {
    //            $scope.order.ReceiverAccount = undefined;
    //            $scope.hasaccount = false;
    //        }
    //    }


    //};

    //$scope.$watch('order.DescriptionForPayment', function (newValue, oldValue) {
    //    if ($scope.order.DescriptionForPayment != undefined ) {

    //        $scope.description = $scope.order.DescriptionForPayment;
    //    }
    //});


    //Փոխանցման լրացուցիչ տվյալներ 
    $scope.order.TransferAdditionalData = {};
    $scope.openTransferAdditionalDetailsModal = function () {
        $scope.isAddDataFormOpening = true;
        if ($scope.order.Amount == "" || $scope.order.Amount == undefined) {
            return;
        }
        $scope.transferAdditionalDetailsModal = $uibModal.open({
            template: '<transferadditionaldataform dataformtype="2" transferamount="order.Amount" cashtransferdata="transferAdditionalData" callback="getTransferAdditionalData(transferAdditionalData)" close="closeTransferAdditionalDetailsModal()"></transferadditionaldataform>',
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
        if (transferAdditionalData.dataformtype == 2) {
            var temp = transferAdditionalData.receiverLivingPlace;
            transferAdditionalData.receiverLivingPlace = transferAdditionalData.senderLivingPlace;
            transferAdditionalData.senderLivingPlace = temp;
        }
        $scope.isHasAdditionalData = true;
        $scope.setReceiverLivingPlaceDesc();
        $scope.setSenderLivingPlaceDesc();
        $scope.setTransferAmountPurposeDesc();

        $scope.transferAdditionalData.dataformtype = transferAdditionalData.dataformtype;
        $scope.closeTransferAdditionalDetailsModal();
    }

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
    }
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
        $scope.transferAdditionalData = undefined;
    }

    $scope.searchReceivedTransfers = function () {
        if ($http.pendingRequests.length == 0) {


            if ($scope.order.SubType == undefined || $scope.order.SubType == 0 || $scope.order.SubType == null)
                showMesageBoxDialog('Ընտրեք փոխանցման տեսակը', $scope, 'information');
            else {
                $scope.transfertype = $scope.order.SubType;
                $scope.openSearchReceivedTransfersModal();

                $scope.searchReceivedTransfersModalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {

                });
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել կոճակը:', 'error');
        }
    };



    $scope.openSearchReceivedTransfersModal = function () {
        $scope.searchReceivedTransfersModalInstance = $uibModal.open({

            template: '<searchreceivedtransfer callback="getSearchedReceivedTransfer(receivedTransfer)" close="closeSearchReceivedTransfersModal()" transfertype="' + $scope.transfertype + '" ></searchreceivedtransfer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    }

    $scope.getSearchedReceivedTransfer = function (receivedTransfer) {
        if (($scope.NewOrEditFromCallCenter == 2 || $scope.transferByCall != undefined) && ($scope.order.Currency != receivedTransfer.Currency || ($scope.order.Code != receivedTransfer.Code && $scope.order.SubType != 21))) {
            $scope.closeSearchReceivedTransfersModal();
            showMesageBoxDialog('Փոխանցման կոդը կամ արժույթը սխալ է:', $scope, 'information');
        }
        else {
            $scope.FromTamplate = true;
            $scope.ForSetFee = true;
            $scope.order.Code = receivedTransfer.Code;
            $scope.order.Sender = receivedTransfer.SenderName;
            $scope.order.Amount = receivedTransfer.TotalAmount;
            $scope.order.Currency = receivedTransfer.Currency;
            if ($scope.order.Currency == 'AMD')
                $scope.order.Amount = Number(($scope.order.Amount).toFixed(1));
            $scope.order.Country = receivedTransfer.CountryCode;
            $scope.getClientTransferAmount();
            if ($scope.transfertype == 8 || $scope.transfertype == 9 || $scope.transfertype == 10 || $scope.transfertype == 11 || $scope.transfertype == 5 || $scope.transfertype == 15 || $scope.transfertype == 16 || $scope.transfertype == 18 || $scope.transfertype == 19 || $scope.transfertype == 20 || $scope.transfertype == 21 || $scope.transfertype == 22)
                $scope.order.FeeAcba = receivedTransfer.AcbaFee;
            else
                $scope.order.FeeAcba = receivedTransfer.ChargeW * receivedTransfer.ProfitPercent;


            $scope.closeSearchReceivedTransfersModal();
        }

    }

    $scope.closeSearchReceivedTransfersModal = function () {
        $scope.searchReceivedTransfersModalInstance.close();
    }

    $scope.showRejectTransfer = function () {
        if ($http.pendingRequests.length == 0) {

            $scope.error = "";

            var temp = '/ReceivedFastTransferPaymentOrder/ReceivedFastTransferReject';
            var cont = 'ReceivedFastTransferPaymentOrderCtrl';
            var id = 'ReceivedFastTransferReject';
            var title = 'Փոխանցման չեղարկում';



            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };
            $scope.order.ContractId = $scope.transfer.Contract.ContractId;
            $scope.changeOrder.ReceivedFastTransfer = $scope.order;
            $rootScope.changeOrder = $scope.changeOrder;
            dialogService.open(id, $scope, title, temp, dialogOptions);
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Մերժել>> կոճակը:', 'error');

        }
    };


    // Հեռախոսային փոխանցման  մերժման պատճառները
    $scope.getCallTransferRejectionReasons = function () {

        var Data = infoService.getCallTransferRejectionReasons();
        Data.then(function (acc) {

            $scope.callTransferRejectionReasons = acc.data;
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'Error');
        });

    };

}]);