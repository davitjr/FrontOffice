app.controller("CurrencyExchangeOrderCtrl", ['$scope', 'currencyExchangeOrderService', 'paymentOrderService', 'utilityService', 'infoService', 'orderService', '$uibModal', 'dialogService', 'customerService', '$http', 'accountService', '$confirm', '$filter', 'casherService', 'ReportingApiService', function ($scope, currencyExchangeOrderService, paymentOrderService, utilityService, infoService, orderService, $uibModal, dialogService, customerService, $http, accountService, $confirm, $filter, casherService, ReportingApiService) {


    $scope.showFeeTypeBlock = true;

    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

    $scope.generateNewOrderNumber = function () {
        var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    $scope.generateOrderNumberForShortChange = function () {
        if ($scope.order.checkForShortChange == true) {
            var Data = orderService.generateNewOrderNumber(2);
            Data.then(function (nmb) {
                $scope.order.OrderNumberForShortChange = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        }
        else {
            $scope.order.OrderNumberForShortChange = "";
        }
    }

    $scope.getSourceType = function () {
        $scope.sourceType = $scope.$root.SessionProperties.SourceType;
    };

    $scope.order = {};
    $scope.order.Type = $scope.orderType;
    $scope.order.RegistrationDate = new Date();
    $scope.order.ReceiverAccount = {};
    $scope.orderNumberType = 7;
    $scope.generateNewOrderNumber();
    $scope.additional = "";
    $scope.getSourceType();
    $scope.order.RoundingDirection = '1';
    $scope.orderAttachment = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.labelNameForOrderNumber = 'Համար';
    $scope.strForTransfer = '';
    if ($scope.matureOrder != undefined) {
        $scope.order.ProductCurrency = $scope.matureOrder.ProductCurrency;
        $scope.order.ProductId = $scope.matureOrder.ProductId;
    }


    if ($scope.transfer != undefined) {
        $scope.order.TransferID = $scope.transfer.Id;
        $scope.order.Amount = ($scope.transfer.Amount - $scope.transfer.PaidAmount).toFixed(2);
        $scope.order.DebitAccount = {};
        $scope.order.DebitAccount = $scope.transfer.DebitAccount;
        //$scope.order.ReceiverAccount = $scope.transfer.CreditAccount;
        if ($scope.transfer.CustomerNumber != undefined && $scope.transfer.TransferGroup != 4)
            $scope.order.CustomerNumber = $scope.transfer.CustomerNumber;
        else {
            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (descr) {
                $scope.order.CustomerNumber = descr.data;
                $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

            });
        }


        if ($scope.transfer.AddTableName == "Tbl_transfers_by_call")
            $scope.isCallTransfer = 1;
        else
            $scope.isCallTransfer = undefined;
        if ($scope.transfer.IsCallCenter == 1)
            $scope.showCustomerInfo = true;
        var Data = customerService.getCustomer($scope.transfer.CustomerNumber);
        Data.then(function (cust) {
            $scope.transferCustomer = cust.data;
            if ($scope.transferCustomer != undefined && $scope.transfer.TransferGroup != 4) {
                $scope.strForTransfer = ' ' + $scope.transferCustomer.FirstName + ' ' + $scope.transferCustomer.LastName + ' ' + '(' + $scope.transfer.TransferSystemDescription + ' ' + $scope.transfer.SenderReferance + ')';
                $scope.setDescription();
            }
            else
                if ($scope.transfer.TransferGroup == 4) {
                    $scope.strForTransfer = ' ' + $scope.transfer.Receiver + ' (' + $scope.transfer.UnicNumber + ')';
                    $scope.setDescription();
                }
                else
                    $scope.strForTransfer = '';
        }, function () {
            alert('Error');
        });

        var DataOPPerson = orderService.setOrderPerson($scope.transfer.CustomerNumber);
        DataOPPerson.then(function (ord) {
            $scope.order.OPPerson = ord.data;
            $scope.order.OPPerson.PersonBirth = new Date(parseInt(ord.data.PersonBirth.substr(6)));
        }, function () {
            alert('Error CashTypes');
        });


    }
    else if ($scope.swiftMessage != undefined) {

        $scope.order.ReceiverAccount = $scope.swiftMessage.CreditAccount;
        $scope.$parent.receiverAccountAccountNumber = $scope.swiftMessage.ReceiverAccount;
        $scope.order.ReceiverAccount.Description = $scope.order.ReceiverAccount.AccountDescription;
        $scope.order.Receiver = $scope.order.ReceiverAccount.Description;
        $scope.order.Amount = $scope.swiftMessage.Amount;
        $scope.description = $scope.swiftMessage.Description;
        $scope.order.SwiftMessageID = $scope.swiftMessage.ID;
        $scope.order.CustomerNumber = $scope.swiftMessage.CustomerNumber;




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

    $scope.confirm = false;
    $scope.saveCurrencyExchangeOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("currencyLoad").classList.remove("hidden");

            if ($scope.order.DebitAccount.Currency == $scope.order.ReceiverAccount.Currency) {
                document.getElementById("currencyLoad").classList.add("hidden");
                return ShowMessage('Ընտրված արժույթներ նույն են:', 'error');
            }

            $scope.setOrderSubType();
            $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);

            if ($scope.additional != "" && $scope.isLeasingAccount != true) {
                $scope.order.Description = $scope.description.toString() + " " + $scope.additional;
            }
            else
                $scope.order.Description = $scope.description;

            if ($scope.order.ConvertationTypeNum == 3) {
                $scope.order.ConvertationCrossRate = $scope.order.Rate;
            }

            //ԱԳՍ-ով փոխանցումների դեպքերում 
            if ($scope.showForATSDebitAccount == true && $scope.ForATSAccount == true) {
                $scope.order.DebitAccount.AccountNumber = $scope.order.DebitAccountForATS.AccountNumber;
                $scope.order.DebitAccount.Status = $scope.order.DebitAccountForATS.Status;
                $scope.order.DebitAccount.Currency = $scope.order.DebitAccountForATS.Currency;
            }
            if ($scope.showForATSCreditAccount == true && $scope.ForATSAccount == true) {
                $scope.order.ReceiverAccount.AccountNumber = $scope.order.ReceiverAccountForATS.AccountNumber;
                $scope.order.ReceiverAccount.Status = $scope.order.ReceiverAccountForATS.Status;
                $scope.order.ReceiverAccount.Currency = $scope.order.ReceiverAccountForATS.Currency;
            }

            if ($scope.order.Fees == null || $scope.order.Fees.length == 0) {

                var descriptionForRejectFeeType = null;
                var rejectFeeType = null;
                if ($scope.feeType == 0 && ($scope.order.Type == 54 || $scope.order.AccountType == 5) && $scope.order.DebitAccount.Currency == 'AMD' && $scope.order.ReceiverAccount != undefined && $scope.order.ReceiverAccount.Currency != 'AMD') {
                    rejectFeeType = $scope.order.RejectFeeType;
                }

                var oneFeeObj = { Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null, DescriptionForRejectFeeType: descriptionForRejectFeeType, RejectFeeType: rejectFeeType, RejectFeeTypeDescription: null };
                $scope.order.Fees = [oneFeeObj];
            }


            var Data = currencyExchangeOrderService.SaveCurrencyExchangeOrder($scope.order, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    if ($scope.transfer != undefined)
                        $scope.path = '#transfers';
                    else
                        $scope.path = '#Orders';
                    document.getElementById("currencyLoad").classList.add("hidden");
                    CloseBPDialog('exchangeorder');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);


                }
                else {
                    document.getElementById("currencyLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveCurrencyExchangeOrder);

                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("currencyLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getDebitAccounts = function (orderType, orderSubType) {
        if ($scope.transfer != undefined) {
            if ($scope.transfer.TransferGroup == 4)
                var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 2);
            else
                var Data = paymentOrderService.getCustomerAccountsForOrder($scope.transfer.CustomerNumber, orderType, orderSubType, 1);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;

            }, function () {
                alert('Error getcreditaccounts');
            });
        }
        else if ($scope.swiftMessage != undefined) {
            var Data = paymentOrderService.getCustomerAccountsForOrder($scope.swiftMessage.CustomerNumber, orderType, orderSubType, 2);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;

                $scope.DebitAccount = $.grep($scope.debitAccounts, function (v) { return v.AccountNumber === $scope.swiftMessage.Account.AccountNumber.toString(); })[0]
                $scope.DebitAccountNumber = $scope.DebitAccount.AccountNumber;
                $scope.checkForDebitAccount = 0;
                $scope.order.DebitAccount = $scope.DebitAccount;
                if ($scope.order.Currency == undefined)
                    $scope.setCurrency();
                //if ($scope.order.DebitAccount.Currency != 'AMD')
                //    $scope.order.Amount = $scope.swiftMessage.Amount;
                //else {
                //    $scope.order.AmountInAmd = $scope.swiftMessage.Amount;
                //    $scope.order.RoundingDirection = '2';
                //    $scope.calculateAmount();

                //}
            }, function () {
                alert('Error getcreditaccounts');
            });

        }
        else {
            var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 1);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;
            }, function () {
                alert('Error getdebitaccounts');
            });
        }
    };

    $scope.getCreditAccounts = function (orderType, orderSubType) {
        if ($scope.swiftMessage != undefined)
            return;

        if ($scope.transfer != undefined) {
            if ($scope.transfer.TransferGroup == 4)
                var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 2);
            else
                var Data = paymentOrderService.getCustomerAccountsForOrder($scope.transfer.CustomerNumber, orderType, orderSubType, 2);
            Data.then(function (acc) {
                $scope.creditAccounts = acc.data;
                if ($.grep($scope.creditAccounts, function (v) { return v.AccountNumber === $scope.transfer.CreditAccount.AccountNumber.toString(); })[0] != undefined) {
                    $scope.ReceiverAccount = $.grep($scope.creditAccounts,
                        function (v) {
                            return v.AccountNumber === $scope.transfer.CreditAccount.AccountNumber.toString();
                        })[0];
                    $scope.accountnumber = $scope.ReceiverAccount.AccountNumber;
                    $scope.$parent.checkForReciverAccount = 0;
                }


            }, function () {
                alert('Error getcreditaccounts');
            });
        }
        else {
            var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 2);
            Data.then(function (acc) {
                $scope.creditAccounts = acc.data;
            }, function () {
                alert('Error getcreditaccounts');
            });
        }
    };

    //Հաշվարկում է գործող կուրսը և թարմացվում գումարը
    $scope.getLastRates = function (currency, rateType, direction) {
        var Data = utilityService.getLastRates(currency, rateType, direction);

        Data.then(function (result) {

            if (result.data == 0) {
                return ShowMessage('Տվյալ արտարժույթով փոխարկում հնարավոր չէ:', 'error');
            }

            $scope.order.Rate = Math.round(result.data * 100) / 100;
            $scope.order.ConvertationRate = Math.round(result.data * 100) / 100;

            $scope.order.ConvertationTypeNum = direction;
            if (direction == 1)
                $scope.order.ConvertationType = "Վաճառք";//2
            else if (direction == 2)
                $scope.order.ConvertationType = "Գնում";//1

            $scope.ConvertationTypeNum = direction;
            $scope.calculateConvertationAmount();
            $scope.setLabelNameForOrderNumber();

        }, function () {
            alert('Error in getLastRates');
        });

    }


    $scope.calculateCrossRate = function (dCur, cCur) {
        var dRate;
        var cRate;


        var Data = currencyExchangeOrderService.getCrossConvertationVariant(dCur, cCur);
        Data.then(function (acc) {
            $scope.crossVariant = acc.data;
            if ($scope.crossVariant == 0) {
                return ShowMessage('Տվյալ զույգ արժույթների համար փոխարկում չի նախատեսված:', 'error');
            }
            var dData = utilityService.getLastRates(dCur, 5, 2);// Cross Buy
            dData.then(function (dResult) {

                dRate = dResult.data;
                $scope.order.ConvertationRate = Math.round(dResult.data * 100) / 100;
                $scope.crossBuykurs = $scope.order.ConvertationRate;

                var cData = utilityService.getLastRates(cCur, 5, 1);// Cross Sell
                cData.then(function (cResult) {

                    cRate = cResult.data;
                    $scope.order.ConvertationRate1 = Math.round(cResult.data * 100) / 100;
                    $scope.crossSellkurs = $scope.order.ConvertationRate1;

                    if ($scope.crossVariant == 1) {
                        $scope.order.Rate = parseFloat(dRate / cRate);
                    }
                    else {
                        $scope.order.Rate = parseFloat(cRate / dRate);
                    }

                    $scope.order.Rate = Math.round(($scope.order.Rate + 0.00000001) * 10000000) / 10000000;
                    $scope.Rate = $scope.order.Rate;


                    $scope.order.ConvertationType = "Կրկնակի փոխարկում";//3
                    $scope.order.ConvertationTypeNum = 3;

                    $scope.calculateConvertationAmount();
                    $scope.setLabelNameForOrderNumber();

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


    //Ընտրված հաշիվներից կախված նշվում է  արժույթը
    $scope.setCurrency = function () {
        if ($scope.order.DebitAccount != undefined) {
            var dCur = $scope.order.DebitAccount.Currency;

        }
        if ($scope.order.ReceiverAccount != undefined) {
            var cCur = $scope.order.ReceiverAccount.Currency;

        }
        if (dCur && cCur) {
            if (dCur != cCur) {
                if (dCur == "AMD") {
                    if (cCur != "AMD")
                        $scope.order.Currency = cCur;
                    else
                        $scope.order.Currency = "";
                }
                else
                    $scope.order.Currency = dCur;
            }
            else
                $scope.order.Currency = dCur;

            if (dCur == $scope.order.Currency)
                $scope.order.CurrencyConvertation = cCur;
            else if (cCur == $scope.order.Currency)
                $scope.order.CurrencyConvertation = dCur;
        }

        $scope.setConvertationRates();

        if ($scope.order.DebitAccount != undefined && $scope.order.ReceiverAccount != undefined && $scope.order.DebitAccount.Currency == $scope.order.ReceiverAccount.Currency) {
            ShowMessage('Ընտրված արժույթներ նույն են:', 'error');
        }

    }


    //Նշվում է արժույթի/ների կուրսերը և փոխարկման տեսակը
    $scope.setConvertationRates = function () {

        if ($scope.order.DebitAccount != undefined) {
            var dCur = $scope.order.DebitAccount.Currency;
        }
        if ($scope.order.ReceiverAccount != undefined) {
            var cCur = $scope.order.ReceiverAccount.Currency;
        }
        if ($scope.isCallTransfer != undefined)
            $scope.setTransferRates();
        else if (dCur != undefined && cCur != undefined && dCur != cCur) {
            if (dCur == "AMD" || cCur == "AMD") {
                if (dCur != "AMD" && dCur != undefined) {

                    //Cash Buy
                    if ($scope.order.Type == 53 || $scope.order.Type == 54) {
                        $scope.getLastRates(dCur, 3, 2);
                    }
                    else //NonCash Buy
                    {
                        $scope.getLastRates(dCur, 2, 2);
                    }
                }
                else
                    if (cCur != undefined)
                        //Cashe Sell
                        if ($scope.order.Type == 53 || $scope.order.Type == 55) {
                            $scope.getLastRates(cCur, 3, 1);
                        }
                        else {
                            // NonCash Sale
                            $scope.getLastRates(cCur, 2, 1);
                        }
            }
            else
                if (dCur != undefined && cCur != undefined) {
                    if (dCur != cCur) {
                        $scope.calculateCrossRate(dCur, cCur);
                    }

                }
        }
    }


    $scope.setTransferRates = function () {
        if ($scope.order.DebitAccount != undefined) {
            var dCur = $scope.order.DebitAccount.Currency;
        }
        if ($scope.order.ReceiverAccount != undefined) {
            var cCur = $scope.order.ReceiverAccount.Currency;
        }
        if (dCur != undefined && cCur != undefined && dCur != cCur) {
            if (dCur == "AMD" || cCur == "AMD") {
                if ($scope.transfer.RateSell != undefined && $scope.transfer.RateSell != 0 && $scope.transfer.RateSell != null) {
                    $scope.order.Rate = Math.round($scope.transfer.RateSell * 100) / 100;
                    $scope.order.ConvertationRate = Math.round($scope.transfer.RateSell * 100) / 100;
                    $scope.Rate = $scope.order.Rate;
                    $scope.order.ConvertationTypeNum = 1;
                    $scope.order.ConvertationType = "Վաճառք";//2
                    $scope.calculateConvertationAmount();
                    $scope.setLabelNameForOrderNumber();
                }
                else {
                    $scope.order.Rate = Math.round($scope.transfer.RateBuy * 100) / 100;
                    $scope.order.ConvertationRate = Math.round($scope.transfer.RateBuy * 100) / 100;
                    $scope.Rate = $scope.order.Rate;
                    $scope.order.ConvertationTypeNum = 2;
                    $scope.order.ConvertationType = "Գնում";//2
                    $scope.calculateConvertationAmount();
                    $scope.setLabelNameForOrderNumber();
                }

            }
            else
                if (dCur != undefined && cCur != undefined) {
                    if (dCur != cCur) {
                        var Data = currencyExchangeOrderService.getCrossConvertationVariant(dCur, cCur);
                        Data.then(function (acc) {
                            $scope.crossVariant = acc.data;
                            if ($scope.crossVariant == 0) {
                                return ShowMessage('Տվյալ զույգ արժույթների համար փոխարկում չի նախատեսված:', 'error');
                            }
                            $scope.order.ConvertationRate = $scope.transfer.RateBuy;
                            $scope.order.ConvertationRate1 = $scope.transfer.RateSell;
                            if ($scope.crossVariant == 1) {
                                $scope.order.Rate = parseFloat($scope.order.ConvertationRate / $scope.order.ConvertationRate1);
                            }
                            else {
                                $scope.order.Rate = parseFloat($scope.order.ConvertationRate1 / $scope.order.ConvertationRate);
                            }
                            $scope.order.Rate = Math.round(($scope.order.Rate + 0.00000001) * 10000000) / 10000000;
                            $scope.Rate = $scope.order.Rate;


                            $scope.order.ConvertationType = "Կրկնակի փոխարկում";//3
                            $scope.order.ConvertationTypeNum = 3;

                            $scope.calculateConvertationAmount();
                            $scope.setLabelNameForOrderNumber();

                        }, function () {
                            alert('Error getCrossConvertationVariant');
                        });


                    }

                }
        }
    }

    //Հաշվարկվում է փոխարկվող գումարը կրեդիտագրվող հաշվի արժույթով
    $scope.calculateConvertationAmount = function (checkForAmountInAMD, checkForAmountInCrossCurrency) {
        if ($scope.rateChangingAccess) { if ($scope.order.ConvertationTypeNum != 3) $scope.order.ConvertationRate = $scope.order.Rate }
        if ($scope.order.Amount && $scope.order.Rate && $scope.order.ConvertationType) {
            if ($scope.order.ConvertationTypeNum == 3)//"Կրկնակի փոխարկում"
            {
                $scope.AmountConvertation = Math.round($scope.order.Amount * $scope.order.Rate);
                if ($scope.crossVariant == 1) {
                    $scope.order.AmountInCrossCurrency = round(($scope.order.Amount * ($scope.order.Rate)), 2);
                }
                else {
                    $scope.order.AmountInCrossCurrency = round(($scope.order.Amount * (1 / ($scope.order.Rate))), 2);
                }
                $scope.AmountInCrossCurrency = $scope.order.AmountInCrossCurrency;
                if (checkForAmountInAMD == undefined) {
                    $scope.order.AmountInAmd =
                        round(($scope.order.Amount * $scope.order.ConvertationRate) + 0.00000001, 1);

                }
                $scope.getFee();
                $scope.getCardFee();
            }
            else {
                $scope.AmountConvertation = Math.round(($scope.order.Amount * $scope.order.Rate) * 100) / 100;
                if (checkForAmountInAMD == undefined) {

                    var Data = utilityService.formatRountByDecimals($scope.order.Amount, 1, 1, $scope.order.Rate);
                    Data.then(function (acc) {
                        $scope.order.AmountInAmd = acc.data;
                        $scope.getFee();
                        $scope.getCardFee();
                    }, function () {
                        alert('Error formatRountByDecimals');
                    });
                }
                else {
                    $scope.getFee();
                    $scope.getCardFee();
                }

            }

            $scope.AmountConvertation = utilityService.formatNumber($scope.AmountConvertation, 2);
        }
        else {
            $scope.getFee();
            $scope.getCardFee();
        }
    }

    //Թվի կլորացման համար ըստ կլորացման նիշերի քանակի
    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }


    $scope.rateChangingAccess = false;
    //Արժույթի դաշտի փոփոխման հնարավորության տրամադրում` կախված փոխարկվող գումարից  
    $scope.amountChanged = function () {
        if ($scope.order.Amount != null && $scope.order.Amount != 0 || $scope.$root.SessionProperties.SourceType == 2) {

            if ($scope.$root.SessionProperties.SourceType == 2) {
                var Data = paymentOrderService.manuallyRateChangingAccess(0, 'AMD', 'AMD', $scope.$root.SessionProperties.SourceType);
            }
            else {
                var Data = paymentOrderService.manuallyRateChangingAccess($scope.order.Amount, $scope.order.Currency, $scope.order.CurrencyConvertation, $scope.sourceType);
            }
            Data.then(function (result) {
                $scope.rateChangingAccess = result.data.trim() == 'True';
                //$scope.rateChanged();
            }, function () {
                alert('Error in amountChanged');
            });
        }
    }
    $scope.amountChanged();
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


    $scope.getSearchedAccounts = function (selectedAccount) {
        $scope.receiverAccountAccountNumber = selectedAccount.AccountNumber;
        $scope.order.ReceiverAccount = selectedAccount;
        $scope.order.ReceiverAccount.AccountNumber = selectedAccount.AccountNumber;
        $scope.order.Receiver = selectedAccount.Description;
        $scope.setConvertationRates();
        $scope.setDescription();
        $scope.setCurrency();
        $scope.closeSearchAccountsModal();
    }

    $scope.closeSearchAccountsModal = function () {
        $scope.searchAccountsModalInstance.close();
    }


    $scope.getAccountByAccountNumber = function (receiverAccountAccountNumber) {
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
                        $scope.getSearchedAccounts(acc.data[0]);
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



    //Սեփական հաշիվների միջև վճարման հանձնարարականի տպում
    $scope.getPersonalPaymentOrderDetails = function () {
        if ($http.pendingRequests.length == 0) {


            if ($scope.order.ConvertationTypeNum == 3) {
                $scope.order.ConvertationCrossRate = $scope.order.Rate;
            }

            if ($scope.order.Amount == 0 || $scope.order.Amount == "") {
                return ShowMessage('Գումարը մուտքագրված չէ:', 'error');
            }

            if ($scope.order.DebitAccount.Currency == $scope.order.ReceiverAccount.Currency) {
                return ShowMessage('Ընտրված արժույթներ նույն են:', 'error');
            }


            $scope.setOrderSubType();
            showloading();
            $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);

            if ($scope.additional != "") {
                $scope.order.Description = $scope.description + ", " + $scope.additional;
            }
            else
                $scope.order.Description = $scope.description;

            if ($scope.order.Type == 54) {
                if ($scope.order.SubType != 3) {
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
                else {
                    if ($scope.order.OPPerson.PersonAddress == null || $scope.order.OPPerson.PersonAddress == undefined || $scope.order.OPPerson.PersonAddress == '') {
                        $scope.order.OPPerson.PersonAddress = ' ';
                    }
                    if ($scope.order.HasPassport == false) {
                        $scope.order.OPPerson.PersonDocument = ' ';
                    }
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
            }
            if ($scope.order.Type == 80) {
                if ($scope.order.SubType != 3) {
                    var Data = currencyExchangeOrderService.GetConvertationCashNonCashForMatureOrder($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 73, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error GetConvertationCashNonCashForMatureOrder');
                    });
                }
                else {
                    var Data = currencyExchangeOrderService.GetCrossConvertationCashNonCashForMatureOrder($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 79, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error GetCrossConvertationCashNonCashForMatureOrder');
                    });
                }
            }

            if ($scope.order.Type == 55 || $scope.order.Type == 81) {
                if ($scope.order.SubType != 3) {
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
                else {
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
            }

            if ($scope.order.Type == 53) {
                if ($scope.order.SubType != 3) {
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
                else {
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
            }
            if ($scope.order.Type == 65) {
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

            if ($scope.order.Type == 2 || $scope.order.Type == 82) {
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
            if ($scope.order.Type == 185) {
                if ($scope.order.SubType != 3) {
                    var Data = currencyExchangeOrderService.getConvertationDetailsForMatureOrder($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 64, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getConvertationDetailsForMatureOrder');
                    });
                }
                else {
                    var Data = currencyExchangeOrderService.getCrossConvertationDetailsForMatureOrder($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 149, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getCrossConvertationDetailsForMatureOrder');
                    });
                }
            }

            if ($scope.order != null) {
                $scope.printCashBigAmountReport();
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել կոճակը:', 'error');
        }
    };

    $scope.printCashBigAmountReport = function () {
        var Data = currencyExchangeOrderService.isCashBigAmount($scope.order);
        Data.then(function (acc) {
            $scope.isBigAmount = acc.data.m_Item1;
            if ($scope.isBigAmount == true) {
                if ($scope.order.Type != 53 && $scope.$root.SessionProperties.IsNonCustomerService != true && ($scope.order.OPPerson == undefined || $scope.order.OPPerson.CustomerNumber == undefined || $scope.order.OPPerson.CustomerNumber == 0)) {
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


    $scope.setOrderSubType = function () {
        if ($scope.order.DebitAccount.Currency == 'AMD' && $scope.order.ReceiverAccount.Currency != 'AMD') {
            $scope.order.SubType = 2;
        }
        else
            if ($scope.order.DebitAccount.Currency != 'AMD' && $scope.order.ReceiverAccount.Currency == 'AMD') {
                $scope.order.SubType = 1;
            }
            else
                if ($scope.order.DebitAccount.Currency != 'AMD' && $scope.order.ReceiverAccount.Currency != 'AMD') {
                    $scope.order.SubType = 3;
                }



    }

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

    $scope.calculateAmount = function (checkForAmountInCrossCurrency) {

        if ($scope.order.Rate && $scope.order.ConvertationTypeNum != 3 && $scope.order.AmountInAmd) {
            $scope.order.Amount = ($scope.order.AmountInAmd / $scope.order.Rate).toFixed(2);
        }
        else if ($scope.order.Rate && $scope.order.ConvertationTypeNum == 3 && $scope.order.AmountInCrossCurrency) {
            if ($scope.crossVariant == 2) {
                $scope.order.Amount = ($scope.order.AmountInCrossCurrency * $scope.order.Rate).toFixed(2);
            }
            if ($scope.crossVariant == 1) {
                $scope.order.Amount = ($scope.order.AmountInCrossCurrency / $scope.order.Rate).toFixed(2);
            }
        }
        if (checkForAmountInCrossCurrency == undefined) {
            $scope.checkForAmountInAMD = true;
        }
        $scope.calculateConvertationAmount($scope.checkForAmountInAMD, checkForAmountInCrossCurrency);
        $scope.amountChanged();
    };

    $scope.rateChanged = function () {

        if ($scope.order.ConvertationTypeNum == 3) {
            var dRate = 0;
            if ($scope.order.DebitAccount != undefined) {
                var dCur = $scope.order.DebitAccount.Currency;
            }
            if ($scope.order.ReceiverAccount != undefined) {
                var cCur = $scope.order.ReceiverAccount.Currency;
            }
            var Data = currencyExchangeOrderService.getCrossConvertationVariant(dCur, cCur);
            Data.then(function (acc) {
                $scope.crossVariant = acc.data;
                if ($scope.crossVariant == 1) {
                    var dData = utilityService.getLastRates(dCur, 5, 2);// Cross Buy
                    dData.then(function (dResult) {
                        dRate = dResult.data;
                        $scope.order.ConvertationRate1 = (dRate / $scope.order.Rate).toFixed(6);
                        $scope.crossSellkurs = $scope.order.ConvertationRate1;
                        $scope.calculateConvertationAmount();
                    }, function () {
                        alert('Error in rateChanged');
                    });
                }
                if ($scope.crossVariant == 2) {
                    var dData = utilityService.getLastRates(dCur, 5, 2);// Cross Buy
                    dData.then(function (dResult) {
                        dRate = dResult.data;
                        $scope.order.ConvertationRate1 = (dRate * $scope.order.Rate).toFixed(6);
                        $scope.crossSellkurs = $scope.order.ConvertationRate1;
                        $scope.calculateConvertationAmount();

                    }, function () {
                        alert('Error in rateChanged');
                    });
                }



            }, function () {
                alert('Error in rateChanged');
            });
        }
        else {
            if ($scope.order.ConvertationRate == $scope.order.Rate) {
                return;
            }
            if ($scope.rateChangingAccess) {
                $scope.order.ConvertationRate = $scope.order.Rate;
            }
            $scope.calculateConvertationAmount();
        }

    }

    $scope.setDescription = function () {
        if ($scope.isLeasingAccount || $scope.swiftMessage != undefined) {
            return;
        }

        if ($scope.order.DebitAccount != null && $scope.order.ReceiverAccount != null) {
            if ($scope.order.DebitAccount.Currency && $scope.order.ReceiverAccount.Currency && $scope.order.DebitAccount.Currency != $scope.order.ReceiverAccount.Currency) {
                var Data = customerService.getCustomer();
                Data.then(function (cust) {
                    $scope.customer = cust.data;
                    if ($scope.order.DebitAccount.Currency != "AMD") {
                        if ($scope.order.ReceiverAccount.Currency != "AMD") {
                            //Արտարժույթի առք ու վաճառք
                            $scope.description = $scope.operations[17];
                            $scope.additional = $scope.order.DebitAccount.Currency + "/" + $scope.order.ReceiverAccount.Currency + $scope.strForTransfer;
                        }

                        else {
                            //Արտարժույթի առք (Բանկի տեսանկյունից)                          
                            $scope.description = $scope.operations[16];
                            $scope.additional = $scope.order.DebitAccount.Currency + $scope.strForTransfer;

                        }
                    }
                    else {
                        if ($scope.order.ReceiverAccount.Currency != "AMD") {
                            //Արտարժույթի վաճառք (Բանկի տեսանկյունից)
                            $scope.description = $scope.operations[17];
                            $scope.additional = $scope.order.ReceiverAccount.Currency + $scope.strForTransfer;
                        }
                    }
                    if (!$scope.$root.SessionProperties.IsNonCustomerService && $scope.transfer == undefined) {
                        if ($scope.customer.OrganisationName == null)
                            $scope.additional = $scope.additional + " " + $scope.order.OPPerson.PersonName + " " + $scope.order.OPPerson.PersonLastName + (!$scope.order.OPPerson.CustomerNumber ? "" : "(" + $scope.order.OPPerson.CustomerNumber.toString() + ") ");
                        else
                            $scope.additional = $scope.additional + " " + (!$scope.customer.CustomerNumber ? "" : $scope.order.ForThirdPerson == true ? " " : "(" + $scope.customer.CustomerNumber.toString() + ") ");
                    }
                }, function () {
                    alert('Error');
                });
            }
            else {
                $scope.description = "";
                $scope.additional = "";
            }
        }
        else {
            $scope.description = "";
            $scope.additional = "";
        }
    };

    $scope.getShortChangeAmount = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.lastShortChangeValu = $scope.order.checkForShortChange;
            if ($scope.order.checkForShortChange == true) {
                var Data = currencyExchangeOrderService.getShortChangeAmount($scope.order);
                Data.then(function (am) {
                    var Data = orderService.generateNewOrderNumber(2);
                    Data.then(function (nmb) {
                        $scope.order.OrderNumberForShortChange = nmb.data;
                    }, function () {
                        alert('Error generateNewOrderNumber');
                    });
                    $scope.generateOrderNumberForShortChange();
                    $scope.order.ShortChange = am.data.ShortChange;
                    $scope.order.AmountInCrossCurrency = am.data.AmountInCrossCurrency;
                    $scope.AmountInCrossCurrency = $scope.order.AmountInCrossCurrency;


                }, function () {
                    alert('Error getShortChangeAmount');
                });
            }
            else {

                $scope.amountChanged();
                $scope.calculateConvertationAmount();
                $scope.order.ShortChange = 0;
                $scope.order.checkForShortChange = false;
                $scope.order.OrderNumberForShortChange = "";
            }

        }
        else {
            $scope.order.checkForShortChange = $scope.lastShortChangeValu;
        }
    };




    $scope.$watch('order.ConvertationTypeNum', function (newValue, oldValue) {
        $scope.order.ShortChange = 0;
        $scope.order.checkForShortChange = false;
    });

    $scope.$watch('checkForDebitAccount', function (newValue, oldValue) {
        $scope.order.DebitAccount = undefined;
        $scope.feeType = '0';
        if ($scope.nonauthorizedcustomer != true && $scope.debitAccounts == undefined) {
            $scope.debitAccounts = null;
            $scope.getDebitAccounts(1, 2);
        }
        if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 0) {
            $scope.order.Type = 2;
        }
        else if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1 && $scope.forTransitTransfers == true) {
            $scope.order.Type = 185;
        }
        else if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1 && $scope.forBankTransfers != true) {
            $scope.order.Type = 55;
        }
        else if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1 && $scope.forBankTransfers == true) {
            $scope.order.Type = 65;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 1 && $scope.forTransitTransfers == true) {
            $scope.order.Type = 80;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 1 && $scope.transfer != undefined) {
            $scope.order.Type = 81;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 0 && $scope.transfer != undefined) {
            $scope.order.Type = 82;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 0) {
            $scope.order.Type = 54;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 1) {
            $scope.order.Type = 53;
        }

        if (($scope.order.Type == 53 || $scope.order.Type == 54 || $scope.order.Type == 55 || $scope.order.Type == 80 || $scope.order.Type == 81 || $scope.order.Type == 82) && $scope.order.OrderNumberForDebet == undefined) {

            $scope.order.OrderNumberForDebet = ' ';
            var Data = orderService.generateNewOrderNumber(1);
            Data.then(function (nmb) {
                $scope.order.OrderNumberForDebet = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        }
        if (($scope.order.Type == 53 || $scope.order.Type == 54 || $scope.order.Type == 55 || $scope.order.Type == 81 || $scope.order.Type == 82) && $scope.order.OrderNumberForCredit == undefined) {
            $scope.order.OrderNumberForCredit = ' ';
            var Data = orderService.generateNewOrderNumber(2);
            Data.then(function (nmb) {
                $scope.order.OrderNumberForCredit = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        }

    });

    $scope.$watch('checkForReciverAccount', function (newValue, oldValue) {
        $scope.feeType = '0';
        if ($scope.swiftMessage == undefined) {
            $scope.order.ReceiverAccount = undefined;
        }
        if ($scope.nonauthorizedcustomer != true && $scope.creditAccounts == undefined) {
            $scope.creditAccounts = null;
            $scope.getCreditAccounts(1, 3);
        }

        if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 0) {
            $scope.order.Type = 2;
        }
        else if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1 && $scope.forTransitTransfers == true) {
            $scope.order.Type = 185;
        }
        else if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1 && $scope.forBankTransfers != true) {
            $scope.order.Type = 55;
        }
        else if ($scope.checkForDebitAccount == 0 && $scope.checkForReciverAccount == 1 && $scope.forBankTransfers == true) {
            $scope.order.Type = 65;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 1 && $scope.forTransitTransfers == true) {
            $scope.order.Type = 80;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 1 && $scope.transfer != undefined) {
            $scope.order.Type = 81;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 0 && $scope.transfer != undefined) {
            $scope.order.Type = 82;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 0) {
            $scope.order.Type = 54;
        }
        else if ($scope.checkForDebitAccount == 1 && $scope.checkForReciverAccount == 1) {
            $scope.order.Type = 53;
        }
        if (($scope.order.Type == 53 || $scope.order.Type == 54 || $scope.order.Type == 55 || $scope.order.Type == 80) && $scope.order.OrderNumberForDebet == undefined) {

            $scope.order.OrderNumberForDebet = ' ';
            var Data = orderService.generateNewOrderNumber(1);
            Data.then(function (nmb) {
                $scope.order.OrderNumberForDebet = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        }
        if (($scope.order.Type == 53 || $scope.order.Type == 54 || $scope.order.Type == 55) && $scope.order.OrderNumberForCredit == undefined) {
            $scope.order.OrderNumberForCredit = ' ';
            var Data = orderService.generateNewOrderNumber(2);
            Data.then(function (nmb) {
                $scope.order.OrderNumberForCredit = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        }



    });


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
                var Data = currencyExchangeOrderService.getCardFeeForCurrencyExchangeOrder($scope.order);

                Data.then(function (fee) {
                    $scope.order.CardFee = fee.data;
                    if (($scope.order.Fees == undefined || $scope.order.Fees.length == 0) && fee.data > 0) {
                        $scope.order.Fees = [{
                            Amount: fee.data, Type: 7, Account: $scope.order.DebitAccount, Currency: $scope.order.DebitAccount.Currency, OrderNumber: $scope.order.OrderNumber
                        }];
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


    $scope.ngBlurFunctionForAmountInCrossCurrency = function () {
        $scope.calculateAmount(true);
        $scope.order.ShortChange = 0;
        $scope.order.checkForShortChange = false;
        $scope.AmountInCrossCurrency = $scope.order.AmountInCrossCurrency;
        $scope.amountChanged();

    };


    $scope.ngBlurFunctionForRate = function () {
        if ($scope.order.Rate != $scope.Rate) {

            $scope.rateChanged();
            $scope.order.ShortChange = 0;
            $scope.order.checkForShortChange = false;
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

    $scope.setLabelNameForOrderNumber = function () {
        if (($scope.order.ConvertationTypeNum == 1 || $scope.order.ConvertationTypeNum == 3) && $scope.order.ReceiverAccount != undefined) {
            switch ($scope.order.ReceiverAccount.Currency) {
                case 'USD':
                    $scope.labelNameForOrderNumber = 'ԱԴՎ Համար';
                    break;
                case 'CHF':
                    $scope.labelNameForOrderNumber = 'ԱՇՎ Համար';
                    break;
                case 'EUR':
                    $scope.labelNameForOrderNumber = 'ԱԵՎ Համար';
                    break;
                case 'GBP':
                    $scope.labelNameForOrderNumber = 'ԱՍՎ Համար';
                    break;
                case 'GEL':
                    $scope.labelNameForOrderNumber = 'ԱԼՎ Համար';
                    break;
                case 'GEL':
                    $scope.labelNameForOrderNumber = 'ԱԼՎ Համար';
                    break;
                case 'RUR':
                    $scope.labelNameForOrderNumber = 'ԱՌՎ Համար';
                    break;
            }

        } else if ($scope.order.ConvertationTypeNum == 2 && $scope.order.DebitAccount != undefined) {
            switch ($scope.order.DebitAccount.Currency) {
                case 'USD':
                    $scope.labelNameForOrderNumber = 'ԱԴԳ Համար';
                    break;
                case 'CHF':
                    $scope.labelNameForOrderNumber = 'ԱՇԳ Համար';
                    break;
                case 'EUR':
                    $scope.labelNameForOrderNumber = 'ԱԵԳ Համար';
                    break;
                case 'GBP':
                    $scope.labelNameForOrderNumber = 'ԱՍԳ Համար';
                    break;
                case 'GEL':
                    $scope.labelNameForOrderNumber = 'ԱԼԳ Համար';
                    break;
                case 'GEL':
                    $scope.labelNameForOrderNumber = 'ԱԼԳ Համար';
                    break;
                case 'RUR':
                    $scope.labelNameForOrderNumber = 'ԱՌԳ Համար';
                    break;
            }
        }

    };


    $scope.getTransitAccountTypes = function () {
        var forLoanMature = false;
        if ($scope.matureOrder != undefined) {
            forLoanMature = true;
        }
        var Data = infoService.GetTransitAccountTypes(forLoanMature);
        Data.then(function (trans) {
            $scope.transitAccountTypes = trans.data;
            if (forLoanMature) {
                $scope.order.AccountType = '5';
                $scope.getTransitCurrencyExchangeOrderSystemAccount();

            }

        },
            function () {
                alert('Error CashTypes');
            });
    };


    $scope.getCurrenciesKeyValueType = function () {

        if ($scope.matureOrder != undefined) {
            $scope.currenciesAccount = [];
            $scope.matureOrder.ProductCurrency;

            $scope.currenciesAccount.push({ AccountNumber: 0, Currency: "AMD" });
            if ($scope.matureOrder.ProductCurrency != "AMD") {
                $scope.currenciesAccount.push({ AccountNumber: 0, Currency: $scope.matureOrder.ProductCurrency });
            }

        }
        else if ($scope.forBond) {
            $scope.currenciesAccount = [];
            $scope.currenciesAccount.push({ AccountNumber: 0, Currency: $scope.bondAmountChargeOrder.Currency });
            $scope.ReceiverAccount = $scope.currenciesAccount[0];
            $scope.order.AccountType = '6';
            $scope.getTransitCurrencyExchangeOrderSystemAccount();
        }

        else {
            var Data = infoService.getCurrenciesKeyValueType();
            Data.then(function (acc) {
                $scope.cur = acc.data;
                $scope.currenciesAccount = [];
                for (var i = 0; i < acc.data.length; i++) {
                    $scope.currenciesAccount.push({
                        AccountNumber: 0, Currency: acc.data[i].Key
                    });
                }
            }, function () {
                alert('Currencies Error');
            });
        }
    };


    $scope.saveOrder = function () {
        if ($scope.forTransitTransfers == true) {
            $scope.saveTransitCurrencyExchangeOrder();
        }
        else {
            $scope.saveCurrencyExchangeOrder();
        }
    };



    $scope.confirm = false;
    $scope.saveTransitCurrencyExchangeOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("currencyLoad").classList.remove("hidden");
            //$scope.save = true;

            if ($scope.order.DebitAccount.Currency == $scope.order.ReceiverAccount.Currency) {
                document.getElementById("currencyLoad").classList.add("hidden");
                return ShowMessage('Ընտրված արժույթներ նույն են:', 'error');
            }
            // $scope.setCurrency();
            $scope.setOrderSubType();
            $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);

            if ($scope.additional != "") {
                $scope.order.Description = $scope.description.toString() + " " + $scope.additional;
            }
            else
                $scope.order.Description = $scope.description;

            if ($scope.order.ConvertationTypeNum == 3) {
                $scope.order.ConvertationCrossRate = $scope.order.Rate;
            }
            //ԱԳՍ-ով փոխանցումների դեպքերում 
            if ($scope.showForATSDebitAccount == true && $scope.ForATSAccount == true) {
                $scope.order.DebitAccount.AccountNumber = $scope.order.DebitAccountForATS.AccountNumber;
                $scope.order.DebitAccount.Status = $scope.order.DebitAccountForATS.Status;
                $scope.order.DebitAccount.Currency = $scope.order.DebitAccountForATS.Currency;
            }

            if ($scope.order.Fees == null || $scope.order.Fees.length == 0) {

                var descriptionForRejectFeeType = null;
                var rejectFeeType = null;
                if ($scope.feeType == 0 && ($scope.order.Type == 54 || $scope.order.AccountType == 5) && $scope.order.DebitAccount.Currency == 'AMD' && $scope.order.ReceiverAccount != undefined && $scope.order.ReceiverAccount.Currency != 'AMD') {
                    //descriptionForRejectFeeType = $scope.order.DescriptionForRejectFeeType;
                    rejectFeeType = $scope.order.RejectFeeType;
                }

                var oneFeeObj = { Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null, DescriptionForRejectFeeType: descriptionForRejectFeeType, RejectFeeType: rejectFeeType, RejectFeeTypeDescription: null };
                $scope.order.Fees = [oneFeeObj];
            }

            var Data = currencyExchangeOrderService.saveTransitCurrencyExchangeOrder($scope.order, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    document.getElementById("currencyLoad").classList.add("hidden");
                    CloseBPDialog('exchangeorder');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                }
                else {
                    document.getElementById("currencyLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveCurrencyExchangeOrder);

                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("currencyLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
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
    }

    $scope.getSearchedCard = function (selectedCard) {
        $scope.order.ReceiverAccount = selectedCard.CardAccount;
        $scope.receiverAccountAccountNumber = selectedCard.CardAccount.AccountNumber;
        $scope.order.ReceiverAccount.AccountNumber = selectedCard.CardAccount.AccountNumber;
        $scope.order.Receiver = selectedCard.CardAccount.AccountDescription;
        $scope.setConvertationRates();
        $scope.setDescription();
        $scope.setCurrency();
        $scope.closeSearchCardsModal();
    }

    $scope.closeSearchCardsModal = function () {
        $scope.searchCardsModalInstance.close();
    };



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
            $scope.order.AccountType = '1';
        }

    }

    $scope.getSearchedLeasingLoan = function (selectedLeasingLoanDetails) {

        $scope.selectedLeasingLoanDetails = selectedLeasingLoanDetails;
        if ($scope.selectedLeasingLoanDetails != "") {
            $scope.order.AdditionalParametrs = [
                {
                    'AdditionTypeDescription': 'LeasingCustomerNumber', 'AdditionValue': $scope.selectedLeasingLoanDetails.LeasingCustomerNumber
                },
                {
                    'AdditionTypeDescription': 'LoanFullNumber', 'AdditionValue': $scope.selectedLeasingLoanDetails.LoanFullNumber
                },
                {
                    'AdditionTypeDescription': 'StartDate', 'AdditionValue': $filter('mydate')($scope.selectedLeasingLoanDetails.StartDate, "dd/MM/yyyy")
                },
                {
                    'AdditionTypeDescription': 'StartCapital', 'AdditionValue': $scope.selectedLeasingLoanDetails.StartCapital
                },
                {
                    'AdditionTypeDescription': 'Currency', 'AdditionValue': $scope.selectedLeasingLoanDetails.Currency
                },
                {
                    'AdditionTypeDescription': 'Description', 'AdditionValue': $scope.selectedLeasingLoanDetails.Description
                },
                {
                    'AdditionTypeDescription': 'AddDescription', 'AdditionValue': $scope.selectedLeasingLoanDetails.AddDescription
                },
                { 'AdditionTypeDescription': 'AccountType', 'AdditionValue': 'LeasingAccount' }
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
                $scope.receiverAccountAccountNumber = acc.data.AccountNumber;
                $scope.order.ReceiverAccount = acc.data;
                $scope.order.ReceiverAccount.AccountNumber = acc.data.AccountNumber;
                $scope.order.Receiver = acc.data.AccountDescription;

                $scope.order.ReceiverAccount.Description = $scope.order.ReceiverAccount.AccountDescription;
                $scope.isLeasingAccount = true;


                $scope.setConvertationRates();
                //$scope.setDescription();
                $scope.setCurrency();

            }, function () {
                alert('Error Get Filial');
            });

        }, function () {
            alert('Error getOperationSystemAccountForLeasing');
        });
    };

    $scope.getTransitCurrencyExchangeOrderSystemAccount = function () {


        if ($scope.ReceiverAccount == undefined || $scope.ReceiverAccount.Currency == undefined) {
            return;
        }

        var Data = currencyExchangeOrderService.getTransitCurrencyExchangeOrderSystemAccount($scope.order, $scope.ReceiverAccount.Currency);
        Data.then(function (acc) {
            $scope.order.ReceiverAccount = acc.data;
            $scope.setCurrency();
            $scope.order.ShortChange = 0;
            $scope.order.checkForShortChange = false;
            $scope.setDescription();
        }, function () {
            alert('Error getdebitaccounts');
        });
    };

    $scope.changeOrderAccountType = function (orderType) {
        if (orderType != undefined) {
            if (orderType == 3) {
                $scope.ReceiverAccount = $scope.currenciesAccount[0];
                $scope.searchLeasingCustomers();
                $scope.isLeasingAccount = true;
            }
        }
    };


    $scope.getCreditAccountsForATS = function (currency) {

        if ($scope.ForATSAccount != true)
            return;

        $scope.showForATSCreditAccount = false;
        $scope.order.ReceiverAccountForATS = null;

        if ($scope.checkForReciverAccount == 0)
            return;
        if (currency != undefined) {
            var Data = accountService.getATSSystemAccounts(currency);
            Data.then(function (acc) {
                if (acc.data.length > 0) {
                    $scope.creditAccountsForATS = acc.data;
                    $scope.showForATSCreditAccount = true;

                }
                else {
                    $scope.showForATSCreditAccount = false;
                }
            }, function () {
                alert('Error getAGTSystemAccounts');
            });
        }
    };

    $scope.getDebitAccountsForATS = function (currency) {

        if ($scope.ForATSAccount != true)
            return;

        $scope.showForATSDebitAccount = false;
        $scope.order.DebitAccountForATS = null;
        if ($scope.checkForDebitAccount == 0)
            return;
        if (currency != undefined) {
            var Data = accountService.getATSSystemAccounts(currency);
            Data.then(function (acc) {
                if (acc.data.length > 0) {
                    $scope.debitAccountsForATS = acc.data;
                    $scope.showForATSDebitAccount = true;

                }
                else {
                    $scope.showForATSDebitAccount = false;
                }
            }, function () {
                alert('Error getAGTSystemAccounts');
            });
        }
    };

    $scope.setATSAccounts = function () {
        if ($scope.ForATSAccount != true) {
            $scope.showForATSDebitAccount = false;
            $scope.showForATSCreditAccount = false;
            return;
        }
        if ($scope.checkForDebitAccount == 1 && $scope.order.DebitAccount != undefined) {
            $scope.getDebitAccountsForATS($scope.order.DebitAccount.Currency);
        }
        if ($scope.checkForReciverAccount == 1 && $scope.order.ReceiverAccount != undefined) {
            $scope.getCreditAccountsForATS($scope.order.ReceiverAccount.Currency);
        }
    };

    $scope.setAMDTransitAccount = function () {
        $scope.ReceiverAccount = $scope.currenciesAccount[0];
        $scope.getTransitCurrencyExchangeOrderSystemAccount();


    };


    //***************************************************************************************************************************************************************************
    $scope.getBankOperationFeeTypes = function () {
        $scope.BankOperationFeeType = 0;
        $scope.feeTypes = null;
        $scope.feeType = '0';
        if ((($scope.order.Type == 54 || $scope.order.AccountType == 5) && $scope.order.ReceiverAccount.Currency != 'AMD' && $scope.order.DebitAccount.Currency == 'AMD')) {
            $scope.BankOperationFeeType = 6;
        }

        if ($scope.BankOperationFeeType != 0) {
            var Data = infoService.GetBankOperationFeeTypes($scope.BankOperationFeeType);
            Data.then(function (acc) {
                $scope.feeTypes = acc.data;
                if ($scope.BankOperationFeeType == 6) {

                    $scope.feeType = '28';

                }


            }, function () {
                alert('Currencies Error');
            });
        }
    };


    $scope.$watch('(order.Type == 54 || order.AccountType==5) && order.DebitAccount.Currency=="AMD" && order.ReceiverAccount!=undefined && order.ReceiverAccount.Currency!="AMD"', function (newValue, oldValue) {


        if (newValue == true && $scope.details != true) {
            $scope.getBankOperationFeeTypes();
        }


    });


    $scope.$watch('order.FeeAccount', function (newValue, oldValue) {
        if ($scope.details != true) {
            if ($scope.feeType == '29' && $scope.order.Fees != null) {
                for (var i = 0; i < $scope.order.Fees.length; i++) {
                    if ($scope.order.Fees[i].Type == $scope.feeType) {
                        $scope.order.Fees[i].Account = $scope.order.FeeAccount;
                    }
                }
            }
        }
    });



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


    $scope.$watch('feeType', function (newValue, oldValue) {
        if ($scope.details != true && oldValue != undefined) {

            if ($scope.feeType == 28 || $scope.feeType == 0) {
                $scope.checkForFeeAccount = 1;
                $scope.getFee();
            }
            if ($scope.feeType == 29) {
                $scope.checkForFeeAccount = 0;
                $scope.getFee();
                if ($scope.feeAccounts == undefined) {
                    $scope.getFeeAccounts(1, 2);
                }
            }

            if (newValue == 29 && (oldValue == 0 || oldValue == 28)) {
                $scope.order.FeeAccount = null;
            }

        }

    });

    $scope.getFee = function () {

        $scope.generateNewOrderNumberForFee();

        if ($scope.order.Type != 54 && $scope.order.AccountType != 5) {

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
        }


        if ($scope.order.Type == 54 || $scope.order.AccountType == 5) {
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

                    if ($scope.feeType != 0) {
                        var Data = currencyExchangeOrderService.getFee($scope.order, $scope.feeType);

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
                            if ($scope.feeType == '28' || $scope.feeType == '29') {
                                if ($scope.order.Fees.length != 0) {
                                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                                        if ($scope.order.Fees[i].Type == '28' || $scope.order.Fees[i].Type == '29') {
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
                                                    $scope.order.Fees[i].OrderNumber = $scope.order.OrderNumberForDebet
                                                }
                                                else {
                                                    $scope.order.Fees[i].OrderNumber = "";
                                                }

                                                if ($scope.order.Fees[i].Type == '28') {
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
                                    if ($scope.feeType == '28') {
                                        $scope.order.Fees.push({
                                            Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', Account: { AccountNumber: 0, Currency: 'AMD' }, OrderNumber: $scope.order.OrderNumberForDebet,
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


        else {
            $scope.order.TransferFee = null;
            $scope.order.FeeAccount = "";
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


    //***************************************************************************************************************************************************************************

    $scope.getRejectFeeTypes = function () {
        var Data = infoService.getRejectFeeTypes();
        Data.then(function (acc) {
            $scope.rejectFeeTypes = acc.data;
        }, function () {
            alert('Error getRejectFeeTypes');
        });

    };
}]);
