app.controller("TransitPaymentOrderCtrl", ['$scope', 'transitPaymentOrderService', 'infoService', '$location', 'dialogService', '$uibModal', 'orderService', '$filter', 'paymentOrderService', 'customerService', '$http', 'accountService', '$confirm', 'leasingFactory', 'LeasingService', 'ReportingApiService', function ($scope, transitPaymentOrderService, infoService, $location, dialogService, $uibModal, orderService, $filter, paymentOrderService, customerService, $http, accountService, $confirm, leasingFactory, LeasingService, ReportingApiService) {
    $scope.order = {};
    $scope.additional = "";
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.showFeeTypeBlock = true;
    $scope.selectedLeasingInsuranceId = 0;
    $scope.selectedLeasingInsuranceAmount = 0;
    $scope.confirmLeasingOrder = false;
    $scope.confirmLeasingInsuranceOrder = false;

    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

    var Data = customerService.getAuthorizedCustomerNumber();
    Data.then(function (descr) {
        $scope.order.CustomerNumber = descr.data;
        if ($scope.matureOrder != undefined) {
            $scope.setTransitForMatureOrder($scope.matureOrder);
        }
        else if ($scope.bondAmountChargeOrder != undefined) {

            var Data = customerService.getCustomer($scope.order.CustomerNumber);
            Data.then(function (cust) {
                $scope.customer = cust.data;
                $scope.setTransitPaymentOrderForBond($scope.bondAmountChargeOrder, $scope.customer);

            }, function () {
                alert('Error');
            });



        }
        $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

    });

    $scope.generateNewOrderNumber = function () {
        $scope.getOrderNumberType();
        var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    $scope.getOrderNumberType = function () {
        $scope.orderNumberType = 1;
    };

    $scope.generateNewOrderNumber();

    $scope.getATSSystemAccounts = function (currency) {

        if ($scope.ForATSAccount != true) {
            $scope.showForATSDebitAccount = false;
            $scope.order.DebitAccount = null;
            return;
        }

        if (currency != undefined) {
            var Data = accountService.getATSSystemAccounts(currency);
            Data.then(function (acc) {
                if (acc.data.length > 0) {
                    $scope.debitAccounts = acc.data;
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
    $scope.getTransitPaymentOrder = function (OrderId) {
        var Data = transitPaymentOrderService.getTransitPaymentOrder(OrderId);
        Data.then(function (ch) {
            $scope.order = ch.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");

            if ($scope.order.Fees != undefined && $scope.order.Fees != null) {
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
            }
        }, function () {
            alert('Error getTransitPaymentOrder');
        });
    };


    $scope.saveTransitPaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("transitLoad").classList.remove("hidden");

            if ($scope.nonCashPayment != true) {
                $scope.order.Type = 63;
                $scope.order.SubType = 1;
            }

            if ($scope.additional != "" && $scope.isLeasingAccount != true) {
                $scope.order.Description = $scope.description.toString() + " " + $scope.additional;
            }
            else
                $scope.order.Description = $scope.description;

            if ($scope.additional != "" && $scope.order.TransactionTypeByAML !== undefined) {
                $scope.order.TransactionTypeByAML.AdditionalDescription = $scope.additional;
            }

            if ($scope.feeType == 0 && ($scope.order.Currency == 'RUR' || $scope.order.Currency == 'GBP' || $scope.order.Currency == 'CHF')) {
                if ($scope.order.Fees == null || $scope.order.Fees.length == 0) {
                    $scope.order.Fees = [{ Amount: 0, Type: 0, Account: 0, Currency: "AMD", OrderNumber: null }];
                }
                else {
                    $scope.order.Fees.push({ Amount: 0, Type: 0, Account: 0, Currency: "AMD", OrderNumber: null });
                }
            } else if ($scope.feeType == 0 && $scope.order.Currency == 'AMD' && ($scope.order.TransitAccountType == '5' || $scope.order.TransitAccountType == '3')) {
                $scope.order.Fees = [{ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null, DescriptionForRejectFeeType: null, RejectFeeType: $scope.order.RejectFeeType, RejectFeeTypeDescription: null }];
            }

            if ($scope.paymentOrder && $scope.order.OPPerson == null) //Եթե կատարվում է ՀՀ տարածքում պատուհանից:
            {
                $scope.order.OPPerson = $scope.paymentOrder.OPPerson;
            }


            var Data = transitPaymentOrderService.saveTransitPaymentOrder($scope.order);
            Data.then(function (ch) {
                if (validate($scope, ch.data)) {
                    document.getElementById("transitLoad").classList.add("hidden");
                    CloseBPDialog('transitpaymentorder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("transitLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function () {
                document.getElementById("transitLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error SaveCheque');
            });
        }
        else {
            ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getTransitAccountTypes = function (forTranferFromTransit) {
        var forLoanMature = false;
        if ($scope.matureOrder != undefined && $scope.claimRepayment != true && forTranferFromTransit != true)
            forLoanMature = true;

        var Data = infoService.GetTransitAccountTypes(forLoanMature);
        Data.then(function (trans) {
            if (forTranferFromTransit == true) {
                $scope.transitAccountTypesforTranferFromTransit = trans.data;
            } else {
                $scope.transitAccountTypes = trans.data;

            }
        }, function () {
            alert('Error CashTypes');
        });
    };
    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

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

    $scope.setTransitPaymentOrderDescription = function () {
        if ($scope.paymentOrder != undefined) {
            if (($scope.paymentOrder.Type == 64 || $scope.paymentOrder.Type == 76) && $scope.order.Currency == 'AMD') {
                $scope.order.Description = $scope.description = 'Կոմիսիոն ' + ($scope.paymentOrder.Amount == undefined ? "" : $scope.paymentOrder.Amount).toString() + " " + ($scope.paymentOrder.Currency == undefined ? "" : $scope.paymentOrder.Currency).toString() + ' փոխանցելու համար';
                $scope.order.Amount = $scope.paymentOrder.TransferFee;
            }
            else
                $scope.order.Description = $scope.description = 'Փոխանցում կատարելու համար';
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

    $scope.setTransitPaymentOrder = function (paymentorder, isOpenForfee) {


        if (isOpenForfee == true) {
            $scope.order.Currency = "AMD";
            if (paymentorder.Fees != undefined && paymentorder.Fees.length > 0) {
                var feeAmount = 0;
                for (var i = 0; i < paymentorder.Fees.length; i++) {
                    feeAmount += parseFloat(paymentorder.Fees[i].Amount);
                }
                $scope.order.Amount = feeAmount;

            }

            $scope.order.TransitAccountType = '1';
            $scope.order.Description = $scope.description = 'Փոխանցում կատարելու համար';
            if (paymentorder.OPPerson != undefined) {
                $scope.order.OPPerson = paymentorder.OPPerson;
            }
            if ($scope.paymentOrder.Type == 86) {
                $scope.description = $scope.paymentOrder.Description;
            }
        }
        else {
            $scope.order.Currency = paymentorder.Currency;
            if (paymentorder.Fees != undefined && paymentorder.Fees.length > 0 && paymentorder.DebitAccount.Currency == "AMD") {
                var feeAmount = 0;
                for (var i = 0; i < paymentorder.Fees.length; i++) {
                    feeAmount += parseFloat(paymentorder.Fees[i].Amount);
                }
                $scope.order.Amount = parseFloat(paymentorder.Amount) + feeAmount;

            }
            else {
                $scope.order.Amount = parseFloat(paymentorder.Amount);
            }

            $scope.order.TransitAccountType = '1';
            $scope.order.Description = $scope.description = 'Փոխանցում կատարելու համար';
            if (paymentorder.OPPerson != undefined) {
                $scope.order.OPPerson = paymentorder.OPPerson;
            }
            if ($scope.paymentOrder.Type == 86) {
                $scope.description = $scope.paymentOrder.Description;
            }
        }
    };

    $scope.setTransitPaymentOrderForFee = function (paymentorder) {
        $scope.order.Currency = 'AMD';
        $scope.setTransitPaymentOrderDescription();
        $scope.order.TransitAccountType = '1';
        if (paymentorder.OPPerson != undefined) {
            $scope.order.OPPerson = paymentorder.OPPerson;
        }

    };

    if ($scope.paymentOrder != undefined) {
        if ($scope.forFee != undefined)
            $scope.setTransitPaymentOrderForFee($scope.paymentOrder);
        else {
            $scope.setTransitPaymentOrder($scope.paymentOrder, $scope.isOpenForfee);
            $scope.getATSSystemAccounts($scope.paymentOrder.Currency);
        }
    }

    $scope.getPersonalPaymentOrderDetails = function (isCopy) {
        if (isCopy == undefined)
            isCopy = false;
        showloading();

        if ($scope.additional != "") {
            $scope.order.Description = $scope.description + ", " + $scope.additional;
        }
        else if ($scope.description != undefined)
            $scope.order.Description = $scope.description;


        if ($scope.paymentOrder != undefined && $scope.paymentOrder.Type == 56) {
            if ($scope.paymentOrder.SubType == 5 || $scope.paymentOrder.SubType == 6) {
                if ($scope.order.OPPerson == undefined) {
                    $scope.order.OPPerson = $scope.paymentOrder.OPPerson;
                }
                var Data = transitPaymentOrderService.getCashInPaymentOrderDetailsForBudgetTransfer($scope.paymentOrder, $scope.order, isCopy);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 82, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getCashInPaymentOrderDetailsForBudgetTransfer');
                });
            }
            else {
                if ($scope.paymentOrder.OPPerson == undefined) {
                    $scope.paymentOrder.OPPerson = $scope.order.OPPerson;
                }

                if ($scope.paymentOrder.Currency == "AMD") {
                    var Data = transitPaymentOrderService.getCashInPaymentOrderDetailsForRATransfer($scope.paymentOrder, $scope.order, isCopy);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 82, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error getCashInPaymentOrderDetailsForRATransfer');
                    });
                }
                else {
                    var Data = transitPaymentOrderService.getCashInPaymentOrder($scope.order, isCopy);
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
        else if ($scope.matureOrder != undefined && $scope.claimRepayment != true) {
            if ($scope.nonCashPayment != true) {
                var Data = transitPaymentOrderService.getCashInPaymentOrderDetailsForMatureOrder($scope.order, $scope.matureOrder, isCopy);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getCashInPaymentOrderDetailsForMatureOrder');
                });
            }
            else {
                var Data = transitPaymentOrderService.getPaymentOrderDetails($scope.order, $scope.matureOrder, isCopy);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getPaymentOrderDetails');
                });
            }
        }
        else if ($scope.bondAmountChargeOrder != undefined) {
            if ($scope.nonCashPayment == true) {
                var Data = transitPaymentOrderService.getPaymentOrderDetailsForBond($scope.order, $scope.bondAmountChargeOrder, isCopy);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getPaymentOrderDetailsForBond');
                });
            }
            else {
                var Data = transitPaymentOrderService.getCashInPaymentOrder($scope.order, isCopy);
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
        else {
            var Data = transitPaymentOrderService.getCashInPaymentOrder($scope.order, isCopy);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error getCashInPaymentOrder');
            });
        }

        $scope.getPaymentOrderFeeDetails(isCopy);

    };

    $scope.setTransitForMatureOrder = function (matureOrder) {

        $scope.forLoanMature = true;

        if ($scope.checkAmount == 1) {
            $scope.order.Currency = matureOrder.ProductCurrency;
            $scope.order.Amount = matureOrder.Amount;
        }
        else if ($scope.checkAmount == 2) {
            $scope.order.Currency = "AMD";
            $scope.order.Amount = matureOrder.PercentAmountInAMD;
        }
        if ($scope.nonCashPayment == true) {
            $scope.getDebitAccounts($scope.order.Currency);
            $scope.order.Type = 184;
        }

        $scope.order.ProductCurrency = matureOrder.ProductCurrency;
        $scope.order.ProductId = matureOrder.ProductId;

        if ($scope.claimRepayment != true) {
            $scope.order.TransitAccountType = '5';
            $scope.order.Description = $scope.description = 'Վարկի մարման համար' + '(' + $scope.order.CustomerNumber + ')';
        }
        else {
            $scope.order.TransitAccountType = '2';
            $scope.order.Description = $scope.description = 'Խնդրահարույց վարկի մարման համար' + '(' + $scope.order.CustomerNumber + ')';
        }
    };





    $scope.setTransitForServicePaymentOrder = function (servicePaymentOrder) {

        $scope.order.Currency = servicePaymentOrder.Currency;
        $scope.order.Amount = $scope.Amount;
        $scope.order.TransitAccountType = '2';
        if (servicePaymentOrder.Type == 58 || servicePaymentOrder.Type == 61)
            $scope.order.Description = $scope.description = 'Հաշիվների սպասարկման գծով պարտավորության մարման համար';
        else
            $scope.order.Description = $scope.description = 'HB սպասարկման գծով պարտավորության մարման համար';
    };


    if ($scope.servicePaymentOrder != undefined) {
        $scope.setTransitForServicePaymentOrder($scope.servicePaymentOrder);
    }

    $scope.callbackgetTransitPaymentOrder = function () {
        $scope.getTransitPaymentOrder($scope.selectedOrderId);
    };




    $scope.getFee = function () {

        if ($scope.nonCashPayment != true) {
            $scope.order.Type = 63;
            $scope.order.SubType = 1;
        }



        $scope.generateNewOrderNumberForFee();

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

        if ($scope.order.Amount != null && $scope.order.Amount > 0) {
            if ($scope.feeType == undefined) {
                $scope.feeType = 0;
            }
            //$scope.setOrderType();
            if ($scope.feeType != 0) {
                var Data = transitPaymentOrderService.getFee($scope.order, $scope.feeType);

                Data.then(function (fee) {
                    $scope.order.TransferFee = fee.data;
                    if (fee.data == -1) {
                        $scope.order.Fees = undefined;
                        return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:', 'error');
                    }

                    if (fee.data == 0) {
                        $scope.showFeeTypeBlock = false;
                    }
                    else {
                        $scope.showFeeTypeBlock = true;
                    }


                    if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0) {
                        $scope.order.Fees = [];
                    }
                    //Կանխիկ մուտք հաշվին եթե RUR է մուտքագրում իր RUR հաշվին
                    if ($scope.feeType == '8' || $scope.feeType == '9' || $scope.feeType == '28' || $scope.feeType == '29') {
                        if ($scope.order.Fees.length != 0) {
                            for (var i = 0; i < $scope.order.Fees.length; i++) {
                                if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '9' ||
                                    $scope.order.Fees[i].Type == '28' || $scope.order.Fees[i].Type == '29') {
                                    $scope.order.Fees[i].Amount = fee.data;
                                    $scope.order.Fees[i].Type = $scope.feeType;
                                    $scope.order.Fees[i].Description = "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                        numeral($scope.order.Amount).format('0,0.00') +
                                        $scope.order.Currency +
                                        " " +
                                        $scope.order.CustomerNumber +
                                        ")";
                                    if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '28') {
                                        //   $scope.order.Fees[i].OrderNumber = $scope.order.OrderNumber;
                                    } else {
                                        $scope.order.Fees[i].OrderNumber = "";
                                    }

                                    if ($scope.order.Fees[i].Type == '8' || $scope.order.Fees[i].Type == '28') {
                                        $scope.order.Fees[i].Account = {
                                            AccountNumber: 0,
                                            Currency: 'AMD'
                                        };
                                    } else {
                                        if ($scope.order.Fees[i].Account.AccountNumber != undefined) {
                                            $scope.order.Fees[i].Account = {
                                            };
                                        }
                                    }
                                }
                            }
                        } else {
                            if ($scope.feeType == '8') {
                                $scope.order.Fees.push({
                                    Amount: fee.data,
                                    Type: $scope.feeType,
                                    Currency: 'AMD',
                                    Account: { AccountNumber: 0, Currency: 'AMD' },
                                    OrderNumber: $scope.OrderNumberForFee,
                                    Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                        numeral($scope.order.Amount).format('0,0.00') +
                                        $scope.order.Currency +
                                        " " +
                                        $scope.order.CustomerNumber +
                                        ")"
                                });
                            }
                            else if ($scope.feeType == '28') {
                                $scope.order.Fees.push({
                                    Amount: fee.data,
                                    Type: $scope.feeType,
                                    Currency: 'AMD',
                                    Account: { AccountNumber: 0, Currency: 'AMD' },
                                    OrderNumber: $scope.order.OrderNumber,
                                    Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                        numeral($scope.order.Amount).format('0,0.00') +
                                        $scope.order.Currency +
                                        " " +
                                        $scope.order.CustomerNumber +
                                        ")"
                                });
                            }
                            else {
                                $scope.order.Fees.push({
                                    Amount: fee.data,
                                    Type: $scope.feeType,
                                    Currency: 'AMD',
                                    OrderNumber: "",
                                    Description: "Կանխիկ գումարի մուտքագրման միջնորդավճար(" +
                                        numeral($scope.order.Amount).format('0,0.00') +
                                        $scope.order.Currency +
                                        " " +
                                        $scope.order.CustomerNumber +
                                        ")"
                                });
                            }
                        }
                    }
                });

            }
        }
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

    $scope.getFeeAccounts = function () {
        if ($scope.checkForFeeAccount == 0 && $scope.$root.SessionProperties.IsNonCustomerService != true) {
            var Data = paymentOrderService.getAccountsForOrder($scope.order.Type, 1, 3);
            Data.then(function (acc) {
                $scope.feeAccounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        }
    };


    $scope.getBankOperationFeeTypes = function (forAMDAccountFee) {
        if (forAMDAccountFee) {

            $scope.BankOperationFeeType = 6;
        }
        else {
            $scope.BankOperationFeeType = 2;
        }
        if ($scope.details != true) {
            if ($scope.BankOperationFeeType != 0) {
                var Data = infoService.GetBankOperationFeeTypes($scope.BankOperationFeeType);
                Data.then(function (acc) {
                    $scope.feeTypes = acc.data;
                    if ($scope.BankOperationFeeType == 2) {
                        if ($scope.paymentOrder != undefined) {
                            if ($scope.paymentOrder.Type == 76) {
                                $scope.feeType = '0';
                            }
                            else {
                                $scope.feeType = '8';
                            }
                        }
                        else {
                            $scope.feeType = '8';
                        }

                        $scope.getFee();
                    } else if ($scope.BankOperationFeeType == 6) {
                        $scope.feeType = '28';
                        $scope.getFee();
                    }
                }, function () {
                    alert('Currencies Error');
                });
            }
        }
    };

    $scope.$watch('feeType', function (newValue) {
        if ($scope.details != true) {


            $scope.feeAccounts = null;
            if ($scope.feeType == 1 || $scope.feeType == 3 || $scope.feeType == 5 || $scope.feeType == 6 || $scope.feeType == 8 || $scope.feeType == 28) {
                $scope.checkForFeeAccount = 1;

            }
            if ($scope.feeType == 0 || $scope.feeType == 2 || $scope.feeType == 4 ||
                $scope.feeType == 9 || $scope.feeType == 20 || $scope.feeType == 11
                || $scope.feeType == 29) {
                $scope.checkForFeeAccount = 0;
                $scope.getFeeAccounts(1, 2);
                $scope.order.FeeAccount = undefined;
            }
        }
    });

    $scope.$watchGroup(['order.Currency', 'order.TransitAccountType'], function (newValue, oldValue) {
        if ($scope.details != true) {

            var forAMDAccountFee = false;
            if ($scope.order != undefined && $scope.order.Currency == 'AMD' && ($scope.order.TransitAccountType == '5' || $scope.order.TransitAccountType == '3')) {
                forAMDAccountFee = true;
            }

            if (newValue[0] == "RUR" || newValue[0] == "GBP" || newValue[0] == "CHF" || forAMDAccountFee) {
                $scope.getBankOperationFeeTypes(forAMDAccountFee);
            }
            else {
                $scope.order.Fees = undefined;
            }
        }

    });



    $scope.getPaymentOrderFeeDetails = function (isCopy) {
        $scope.orderForFee = {
        };
        if ($scope.order.Fees != null) {
            for (var fee in $scope.order.Fees) {

                if (($scope.order.Fees[fee].Type == 1 || $scope.order.Fees[fee].Type == 3 || $scope.order.Fees[fee].Type == 8) && $scope.order.Fees[fee].Amount > 0) {

                    $scope.orderForFee = {};
                    $scope.orderForFee.Amount = $scope.order.Fees[fee].Amount;
                    $scope.orderForFee.OPPerson = {};
                    $scope.orderForFee.OPPerson = $scope.order.OPPerson;
                    $scope.orderForFee.ReceiverAccount = {
                    };
                    $scope.orderForFee.Type = $scope.order.Type;
                    $scope.orderForFee.RegistrationDate = $scope.order.RegistrationDate;
                    $scope.orderForFee.OperationDate = $scope.order.OperationDate;
                    $scope.orderForFee.Description = $scope.order.Fees[fee].Description;
                    $scope.orderForFee.OrderNumber = $scope.order.Fees[fee].OrderNumber;
                    $scope.orderForFee.TransitAccountType = $scope.order.TransitAccountType;
                    $scope.orderForFee.Fees = [];

                    if ($scope.order.Fees[fee].Type == 28) {
                        $scope.orderForFee.Fees.push($scope.order.Fees[fee]);
                    }

                    if (!isCopy) {
                        $scope.orderForFee.Currency = $scope.order.Currency;
                        if ($scope.order.Fees[fee].Type == 5 && $scope.order.Type == 56)
                            $scope.orderForFee.Currency = "AMD";

                        var Data = transitPaymentOrderService.getOperationSystemAccountForFee($scope.orderForFee,
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
    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error CashTypes');
        });

    };


    //լիզինգի որոնում որոնում

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
    };

    $scope.closeSearchLeasingCustomerModal = function () {
        $scope.searchLeasingCustomersModalInstance.close();
        if ($scope.selectedLeasingLoanDetails == "") {
            $scope.isLeasingAccount = false;
            $scope.order.TransitAccountType = '1';

        }
    };

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
                {
                    'AdditionTypeDescription': 'AccountType', 'AdditionValue': 'LeasingAccount'
                },
                {
                    'AdditionTypeDescription': 'PrepaymentAmount', 'AdditionValue': $scope.selectedLeasingLoanDetails.PrepaymentAmount
                },
                {
                    'AdditionTypeDescription': 'LeasingInsuranceId', 'AdditionValue': $scope.selectedLeasingInsuranceId
                }
            ];
            $scope.description = $scope.selectedLeasingLoanDetails.Description + "  " + $scope.selectedLeasingLoanDetails.AddDescription;
        }
        $scope.isLeasingAccount = true;
        $scope.closeSearchLeasingCustomerModal();
    };

    $scope.setTransitAccount = function () {
        if ($scope.order.TransitAccountType == 3) {
            $scope.order.Currency = "AMD";
            $scope.searchLeasingCustomers();
            $scope.isLeasingAccount = true;
        }
        else {
            $scope.isLeasingAccount = false;
        }

        if ($scope.order.TransitAccountType == 4) {
            $scope.showCustomerTypes = true;
        }
        else {
            $scope.showCustomerTypes = false;
        }
    };


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
            backdrop: 'static'
        });
    };
    $scope.closeCurNominalModal = function () {
        $scope.curNominalModal.close();
    };
    $scope.getAmount = function (amount) {
        $scope.order.Amount = amount;
        $scope.closeCurNominalModal();
    };


    $scope.getDebitAccounts = function (productCurrency) {

        var Data = paymentOrderService.getAccountsForOrder(1, 3, 1);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
            for (var i = $scope.debitAccounts.length - 1; i >= 0; i--) {
                if ($scope.debitAccounts[i].Currency != productCurrency) {
                    $scope.debitAccounts.splice(i, 1);
                }
            }
        }, function () {
            alert('Error getfeeaccounts');
        });

    };

    $scope.setTransitPaymentOrderForBond = function (bondorder, customer) {
        if ($scope.forBond) {
            $scope.order.Currency = bondorder.Currency;
            $scope.order.TransitAccountType = '6';

            //$scope.order.Amount = bondorder.Amount;

            if ($scope.nonCashPayment == true) {            //    Անկանխիկ մուտք
                $scope.getDebitAccounts($scope.order.Currency);
                $scope.order.Type = 184;

                if (bondorder.Currency == 'AMD') {
                    $scope.order.Amount = Number(Math.round(bondorder.Amount + 'e' + 1) + 'e-' + 1);
                }
                else {
                    $scope.order.Amount = Number(Math.round(bondorder.Amount + 'e' + 2) + 'e-' + 2);
                }
            }
            else {  //  կանխիկ մուտք
                if (bondorder.Currency != 'AMD') {
                    $scope.order.Amount = Number(Math.round(bondorder.Amount + 'e' + 0) + 'e-' + 0);
                }
                else {
                    $scope.order.Amount = Number(Math.round(bondorder.Amount + 'e' + 1) + 'e-' + 1);
                }
            }
            $scope.setTransitPaymentOrderBondDescription(bondorder, customer);
        }
    };


    $scope.setTransitPaymentOrderBondDescription = function (bondorder, customer) {
        if (customer != undefined) {
            $scope.order.Description = $scope.description = bondorder.Bond.BondCount + ' հատ պարտատոմսի ձեռք բերում,' +
                (customer.CustomerType == 6 ? customer.FirstName + ' ' + customer.LastName + ',' + customer.DocumentNumber + ',' + customer.DocumentGivenBy + ',' + customer.DocumentGivenDate
                    : customer.OrganisationName + ',' + customer.TaxCode);
        }
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
                                    $scope.saveTransitPaymentOrder();
                                });
                        }
                        else {
                            $scope.saveTransitPaymentOrder();
                        }
                    }
                    else {
                        $scope.order.AdditionalParametrs[9].AdditionValue = null;
                        showMesageBoxDialog('Ապահովագրավճարի տողը ընտրված չէ։', $scope, 'error');
                        return;
                    }
                }
                else {
                    $scope.saveTransitPaymentOrder();
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
                            $scope.saveTransitPaymentOrder();
                        });
                }
                else {
                    $scope.saveTransitPaymentOrder();
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
                            $scope.saveTransitPaymentOrder();
                        }, function () {
                            return;
                        });

                }
                else if ($scope.order.Amount > amount) {
                    $confirm({ title: 'Շարունակե՞լ', text: `Վճարվող գումարից նախ կմարվի ամսական վճարը և առկա այլ պարտավորություններ, այնուհետև տարբերությունը կուղղվի մայր գումարի մասնակի մարման, շարունակե՞լ` })
                        .then(function () {
                            $scope.saveTransitPaymentOrder();
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
