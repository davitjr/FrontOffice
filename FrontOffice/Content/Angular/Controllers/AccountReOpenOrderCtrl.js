
app.controller("AccountReOpenOrderCtrl", ['$scope', 'accountReOpenOrderService', 'infoService', 'dialogService', 'orderService', 'customerService', '$filter', 'paymentOrderService', '$http', function ($scope, accountReOpenOrderService, infoService, dialogService, orderService, customerService, $filter, paymentOrderService, $http) {
    $scope.order = {};
    $scope.order.feeAccount = {};
    $scope.order.ReopenReasonDescription = "Հաշվի վերաբացում" + ($scope.account != null ? " " + $scope.account.AccountNumber : "");
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.customertype = $scope.$root.SessionProperties.CustomerType;

    $scope.order.reOpeningAccounts = [];

    var Data = customerService.getAuthorizedCustomerNumber();
    Data.then(function (descr) {
        $scope.order.CustomerNumber = descr.data;
        $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

    });

    $scope.generateNewOrderNumber = function () {
        var Data = orderService.generateNewOrderNumber(1);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };
    //Հաշվի բացման պահպանում և հաստատում
    $scope.saveAccountReOpenOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.order.Type = 12;

            document.getElementById("acountReLoad").classList.remove("hidden");
            $scope.order.ReOpenAccount = $scope.account;

            if ($scope.account == undefined) {
                $scope.order.reOpeningAccounts = $scope.reOpeningAccounts;
            }
            else {

                $scope.order.reOpeningAccounts[0] = $scope.account;
            }
            if ($scope.feeType == 0) {
                if ($scope.order.Fees == null || $scope.order.Fees.length == 0) {
                    $scope.order.Fees = [{ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null }];
                }
                else {
                    for (i = 0; i < $scope.order.Fees.length; i++)
                        if ($scope.order.Fees[i].Amount == 0) break;
                    if (i == $scope.order.Fees.length)
                        $scope.order.Fees.push({ Amount: 0, Type: 0, Account: { AccountNumber: 0, Currency: 'AMD' }, Currency: "AMD", OrderNumber: null });
                }
            }
            var Data = accountReOpenOrderService.saveAccountReOpenOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("acountReLoad").classList.add("hidden");
                    CloseBPDialog('reopenaccount');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("acountReLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("acountReLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAccount');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getAccountReOpenOrder = function (orderId) {
        var Data = accountReOpenOrderService.GetAccountReOpenOrder(orderId);
        Data.then(function (acc) {
            if (acc.data.FeeChargeType == 0) {
                $scope.feeChargeType = "Բացակայում է";
            }
            else if (acc.data.FeeChargeType == 1)
                $scope.feeChargeType = "Կանխիկ";
            else if (acc.data.FeeChargeType == 2)
                $scope.feeChargeType = "Անկանխիկ";

            $scope.order = acc.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error GetAccountOrder');
        });
    };

    $scope.getStatementDeliveryTypes = function () {
        var Data = infoService.GetStatementDeliveryTypes();
        Data.then(function (delTypes) {
            $scope.deliveryTypes = delTypes.data;
        }, function () {
            alert('Error StatementDeliveryTypes');
        });
    };

    $scope.getFeeChargesTypes = function () {
        var Data = infoService.GetAccountOrderFeeChanrgesTypes();
        Data.then(function (feeTypes) {
            $scope.feeTypes = feeTypes.data;
            $scope.order.FeeChargeType = '1';
            $scope.getFee();
        }, function () {
            alert('Error GetAccountOrderFeeChanrgesTypes');
        });
    };

    $scope.printAccountReOpenApplication = function () {
        showloading();

        if ($scope.account != undefined) {
            var Data = accountReOpenOrderService.printAccountReOpenApplication($scope.account.AccountNumber);
        }
        else {
            var accountNumbers = "";
            for (var i = 0; i < $scope.reOpeningAccounts.length; i++) {
                accountNumbers = accountNumbers + $scope.reOpeningAccounts[i].AccountNumber + ",";
            }
            accountNumbers = accountNumbers.slice(0, -1);
            var Data = accountReOpenOrderService.printAccountReOpenApplication(accountNumbers);
        }
        ShowPDF(Data);
    };

    $scope.getFeeAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
        Data.then(function (acc) {
            $scope.feeAccounts = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });
    };

    $scope.getFee = function () {
        if ($scope.order.FeeChargeType == "1") {
            $scope.feeType = "12";
        }
        else if ($scope.order.FeeChargeType == "2") {
            $scope.feeType = "13";
        }
        else {
            $scope.feeType = $scope.order.FeeChargeType;
            $scope.order.Fees = [];
            $scope.feeAmount = 0;
        }

        if ($scope.order.Fees == undefined || $scope.order.Fees.length == 0)
            $scope.order.Fees = [];

        if ($scope.feeType == "12" || $scope.feeType == "13") {
            var Data = accountReOpenOrderService.getAccountReopenFee($scope.customertype);
            Data.then(function (result) {
                $scope.feeAmount = result.data;

                if ($scope.order.Fees.length != 0) {
                    for (var i = 0; i < $scope.order.Fees.length; i++) {
                        $scope.order.Fees[i].Amount = $scope.feeAmount;
                        $scope.order.Fees[i].Type = $scope.feeType;
                        if ($scope.order.Fees[i].Type == '12') {
                            $scope.order.Fees[i].Account = { AccountNumber: 0, Currency: 'AMD' };
                            $scope.order.Fees[i].OrderNumber = $scope.OrderNumberForFee;
                        }
                        else {
                            $scope.order.Fees[i].Account = $scope.order.feeAccount;
                            $scope.order.Fees[i].OrderNumber = "";
                        }
                    }
                }
                else
                    if ($scope.OrderNumberForFee == undefined) {
                        var Data = orderService.generateNewOrderNumber(1);
                        Data.then(function (nmb) {
                            $scope.OrderNumberForFee = nmb.data;
                            $scope.order.Fees.push({ Account: $scope.order.feeAccount, Amount: $scope.feeAmount, Type: $scope.feeType, Currency: 'AMD', OrderNumber: $scope.feeType == 12 ? $scope.OrderNumberForFee : "", Description: "Հաշվի վերաբացման վարձ" });
                        }, function () {
                            alert('Error generateNewOrderNumber');
                        });
                    }
                    else $scope.order.Fees.push({ Account: $scope.order.feeAccount, Amount: $scope.feeAmount, Type: $scope.feeType, Currency: 'AMD', OrderNumber: $scope.feeType == 12 ? $scope.OrderNumberForFee : "", Description: "Հաշվի վերաբացման վարձ" });

            },
                function () {
                    alert('Error getAccountReopenFee');
                });
        }
    };



    $scope.checkFeeAccount = function () {
        if ($scope.feeType == "13") {
            if ($scope.feeAmount > 0 && ($scope.order.feeAccount == undefined || $scope.order.feeAccount.AccountNumber == undefined)) {
                return false;
            }
            else
                return true;
        }
        else
            return true;
    };

    //Վճարման հանձնարարականի տպում
    $scope.getAccountReOpenOrderOrderDetails = function (isCopy) {

        if (isCopy == undefined)
            isCopy = false;

        $scope.order.Fees = [];

        if ($scope.feeType != "0") {

            if ($scope.feeType == "12") {
                $scope.order.feeAccount = { AccountNumber: 0, Currency: 'AMD' };
            }
            $scope.order.Fees.push({ Account: $scope.order.feeAccount, Amount: $scope.feeAmount, Type: $scope.feeType, Currency: 'AMD' });
        }

        var Data = accountReOpenOrderService.getAccountReOpenOrderOrderDetails($scope.order, isCopy);
        ShowPDF(Data);

    };

    $scope.callbackgetAccountReOpenOrder = function () {
        $scope.getAccountReOpenOrder($scope.selectedOrderId);
    };

    //Ընթացիկ հաշվի վերաբացման միջնորդավճարի հանձնարարականի տպում
    $scope.getAccountReOpenOrderFeeDetails = function (isCopy) {
        $scope.orderForFee = {};
        if ($scope.order.Fees != null) {

            for (var i = 0; i < $scope.order.Fees.length; i++) {
                $scope.orderForFee = {};
                $scope.orderForFee.Amount = $scope.order.Fees[i].Amount;
                $scope.orderForFee.Currency = 'AMD';
                $scope.orderForFee.OPPerson = {};
                $scope.orderForFee.OPPerson = $scope.order.OPPerson;
                $scope.orderForFee.ReceiverAccount = {};
                if ($scope.account == undefined) {
                    $scope.orderForFee.reOpeningAccounts = [];
                    $scope.orderForFee.reOpeningAccounts = $scope.reOpeningAccounts;
                }
                else {
                    $scope.orderForFee.reOpeningAccounts = [];
                    $scope.orderForFee.reOpeningAccounts[0] = $scope.account;
                }
                $scope.orderForFee.Type = $scope.order.Fees[i].Type;
                $scope.orderForFee.OrderNumber = $scope.order.Fees[i].OrderNumber;
                $scope.orderForFee.OperationDate = $scope.order.OperationDate;
                $scope.orderForFee.Description = $scope.order.Fees[i].Description;


                if (!isCopy) {
                    var Data = accountReOpenOrderService.getOperationSystemAccountForFee($scope.orderForFee,
                        $scope.feeType);
                    Data.then(function(result) {
                        $scope.orderForFee.ReceiverAccount.AccountNumber = result.data;

                        var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                        ShowPDF(Data);


                    });

                }
                else {
                    $scope.orderForFee.Currency = $scope.order.Fees[fee].Currency;
                    $scope.orderForFee.ReceiverAccount.AccountNumber = $scope.order.Fees[fee].CreditAccount.AccountNumber;
                    var Data = paymentOrderService.getCashInPaymentOrder($scope.orderForFee, isCopy);
                    ShowPDF(Data);
                }
            }
        }

    };
    $scope.$watch('order.feeAccount', function (newValue, oldValue) {
        if ($scope.details != true) {
            if ($scope.feeType == '13' && $scope.order.Fees != null) {
                for (var i = 0; i < $scope.order.Fees.length; i++) {
                    if ($scope.order.Fees[i].Type == $scope.feeType) {
                        $scope.order.Fees[i].Account = $scope.order.feeAccount;
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



}]);