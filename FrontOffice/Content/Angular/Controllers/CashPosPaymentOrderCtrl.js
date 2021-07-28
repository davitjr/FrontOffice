app.controller("CashPosPaymentOrderCtrl", ['$scope', 'cashPosPaymentOrderService', 'paymentOrderService', 'infoService', '$filter', '$uibModal', 'accountService', 'orderService', 'customerService', '$http', 'ReportingApiService', function ($scope, cashPosPaymentOrderService, paymentOrderService, infoService, $filter, $uibModal, accountService, orderService, customerService, $http, ReportingApiService) {
    $scope.order = {};
    $scope.additional = "";
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    var Data = customerService.getAuthorizedCustomerNumber();
    Data.then(function (descr) {
        $scope.order.CustomerNumber = descr.data;
        $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

    });
    $scope.setOrderType = function () {
        $scope.order.Type = 68;
    };

    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

    $scope.saveCashPosPaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("cashPosLoad").classList.remove("hidden");
            if ($scope.additional != "") {
                $scope.order.Description = $scope.description.toString() + " " + $scope.additional;
            }
            else
                $scope.order.Description = $scope.description;

            var Data = cashPosPaymentOrderService.saveCashPosPaymentOrder($scope.order);

            Data.then(function (ch) {

                if (validate($scope, ch.data)) {
                    document.getElementById("cashPosLoad").classList.add("hidden");
                    CloseBPDialog('cashpospaymentorder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                }
                else {
                    document.getElementById("cashPosLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function () {
                document.getElementById("cashPosLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error SaveCheque');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };



    $scope.getFee = function () {
        $scope.generateNewOrderNumberForFee();
        if ($scope.order.Currency != undefined && $scope.order.Currency != null) {
            var Data = cashPosPaymentOrderService.getFee($scope.order, $scope.feeType);
            Data.then(function (fee) {

                $scope.order.TransferFee = fee.data;

                if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0) {
                    $scope.order.Fees = [];
                }

                if ($scope.feeType == 0) {
                    if ($scope.order.Fees != undefined && $scope.order.Fees.length > 0) {
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == 6) {
                                $scope.order.Fees.splice(i, 1);
                            }
                        }
                    }
                }
                //կանխիկացում POS-ով
                if ($scope.feeType == '6') {
                    if ($scope.order.Fees.length != 0) {
                        for (var i = 0; i < $scope.order.Fees.length; i++) {
                            if ($scope.order.Fees[i].Type == '6') {
                                $scope.order.Fees[i].Amount = fee.data;
                                $scope.order.Fees[i].Type = $scope.feeType;
                                if ($scope.feeType == '6') {
                                    $scope.Description = "POS տերմինալով Կանխիկացման համար (" + numeral($scope.order.Amount).format('0,0.00') + " " + $scope.order.Currency + " " + $scope.order.CardNumber + ")";
                                    $scope.order.Fees[i].Account = { AccountNumber: 0, Currency: 'AMD' };
                                }
                                else {
                                    if ($scope.order.Fees[i].Account.AccountNumber == undefined) {
                                        $scope.order.Fees[i].Account = {};
                                    }
                                }
                            }
                        }
                    }
                    else {
                        if ($scope.feeType == '6') {
                            $scope.order.Fees.push({
                                Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', Account: { AccountNumber: 0, Currency: 'AMD' }, OrderNumber: $scope.OrderNumberForFee,
                                Description: "POS տերմինալով Կանխիկացման համար (" + numeral($scope.order.Amount).format('0,0.00') + " " + $scope.order.Currency + " " + $scope.order.CardNumber + ")"
                            });
                        }
                        else {
                            $scope.order.Fees.push({ Amount: fee.data, Type: $scope.feeType, Currency: 'AMD', OrderNumber: "" });
                        }
                    }
                }
            }, function () {
                alert('error');
            });

        }
    };



    $scope.GetCashPosOperationFeeTypes = function () {
        $scope.BankOperationFeeType = 1;
        $scope.feeTypes = null;
        $scope.feeType = '0';

        var Data = infoService.GetCashPosOperationFeeTypes($scope.BankOperationFeeType);
        Data.then(function (acc) {
            $scope.feeTypes = {
                0: acc.data[0],
                6: acc.data[6]
            };
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.getCashPosCurrencies = function () {
        var Data = infoService.getCashPosCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.getCashPosPaymentOrder = function (orderID) {
        var Data = cashPosPaymentOrderService.getCashPosPaymentOrder(orderID);
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
        }, function () {
            alert('Error getCashPosPaymentOrder');
        });

    };

    //POS տերմինալով կանխիկացման հանձնարարականի տպում
    $scope.getCashPosPaymentOrderDetails = function (isCopy) {

        if (isCopy == undefined)
            isCopy = false;

        $scope.setOrderType();
        showloading();


        if ($scope.additional != "") {
            $scope.order.Description = $scope.description + ", " + $scope.additional;
        }
        else if ($scope.description != undefined)
            $scope.order.Description = $scope.description;

        //if ($scope.order.Type == 68) {
        //    var Data = cashPosPaymentOrderService.getCashPosPaymentOrderDetails($scope.order, isCopy);
        //    ShowPDF(Data);
        //}

        $scope.getCashPosPaymentOrderFeeDetails(isCopy);

    };

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

    $scope.getSearchedCard = function (selectedCard) {
        $scope.order.CardNumber = selectedCard.CardNumber;
        if (selectedCard.CardNumber != undefined && selectedCard.CardNumber != null && selectedCard.CardNumber != "")
            $scope.ourCard = true;
        $scope.closeSearchCardsModal();
    };

    $scope.closeSearchCardsModal = function () {
        $scope.searchCardsModalInstance.close();
    };

    $scope.isOurCard = function () {
        if ($scope.order.CardNumber != undefined && $scope.order.CardNumber != null)
        var Data = cashPosPaymentOrderService.isOurCard($scope.order.CardNumber);
        Data.then(function (acc) {
            $scope.ourCard = acc.data;
        }, function () {
            alert('Error isOurcard');
        });
    };
    $scope.changeSelection = function () {
        if ($scope.ourCard != null) {
            var feeTypeSelection = document.getElementById('feeTypeSelection');
            if ($scope.ourCard == false) {
                feeTypeSelection.options[1].disabled = false;
                feeTypeSelection.options[1].selected = true;
                feeTypeSelection.options[0].disabled = true;
                $scope.feeType = '6';
                $scope.getFee();
            }

            else {
                feeTypeSelection.options[0].disabled = false;
                feeTypeSelection.options[0].selected = true;
                feeTypeSelection.options[1].disabled = true;
                $scope.feeType = '0';
                $scope.getFee();
            }
        }
        
    };
    $scope.$watch('ourCard', function () {
        $scope.changeSelection();
    });
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

    $scope.$watch('operations', function () {
        if ($scope.operations != undefined)
            $scope.description = $scope.operations[58];
    });

    $scope.callbackgetCashPosPaymentOrder = function () {
        $scope.getCashPosPaymentOrder($scope.selectedOrderId);
    };

    $scope.getCashPosPaymentOrderFeeDetails = function (isCopy) {
        $scope.orderForFee = {};
        if ($scope.order.Fees != null) {
            for (var fee in $scope.order.Fees) {
                if ($scope.order.Fees[fee].Type == 6 && $scope.order.Fees[fee].Amount > 0) {

                    $scope.orderForFee = {};
                    $scope.orderForFee.Amount = $scope.order.Fees[fee].Amount;
                    $scope.orderForFee.Currency = $scope.order.Fees[fee].Currency;
                    $scope.orderForFee.OPPerson = {};
                    $scope.orderForFee.OPPerson = $scope.order.OPPerson;
                    $scope.orderForFee.ReceiverAccount = {};
                    $scope.orderForFee.Type = $scope.order.Type;
                    $scope.orderForFee.CardNumber = $scope.order.CardNumber;
                    $scope.orderForFee.Description = $scope.order.Fees[fee].Description;
                    $scope.orderForFee.OperationDate = $scope.order.OperationDate;
                    $scope.orderForFee.OrderNumber = $scope.order.Fees[fee].OrderNumber;
                    if (!isCopy) {
                        var Data = cashPosPaymentOrderService.getOperationSystemAccountForFee($scope.orderForFee,
                            $scope.feeType);
                        Data.then(function(result) {
                            $scope.orderForFee.ReceiverAccount.AccountNumber = result.data;
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


    };
    $scope.getATSSystemAccounts = function () {

        if ($scope.ForATSAccount != true) {
            $scope.showForATSCreditAccount = false;
            $scope.order.CreditAccount = null;
            return;
        }

        if ($scope.order.Currency != undefined) {
            var Data = accountService.getATSSystemAccounts($scope.order.Currency);
            Data.then(function (acc) {
                if (acc.data.length > 0) {
                    $scope.creditAccounts = acc.data;
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

    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error CashTypes');
        });

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
}]);
