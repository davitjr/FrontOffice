app.controller("FeeForServiceProvidedOrderCtrl", ['$scope', 'paymentOrderService', 'customerService', 'infoService', 'dialogService', 'orderService', '$uibModal', '$http', '$confirm', '$filter', 'feeForServiceProvidedOrderService', function ($scope, paymentOrderService, customerService, infoService, dialogService, orderService, $uibModal, $http, $confirm, $filter, feeForServiceProvidedOrderService) {
    $scope.order = {};
    //$scope.order.Amount = 0;
    $scope.order.OrderNumber = "";
    $scope.order.Type = $scope.orderType;
    $scope.order.TaxAccountProvision = $scope.TaxAccountProvision;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;



    $scope.generateNewOrderNumber = function () {
        var Data = orderService.generateNewOrderNumber(1);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    $scope.getFeeAccounts = function (orderType, orderSubType) {
        if (!$scope.nonauthorizedcustomer) {
            var Data = paymentOrderService.getAccountsForOrder(1, 1, 3);
            Data.then(function (acc) {
                $scope.feeAccounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        }
    };

    $scope.getAuthorizedCustomerNumber = function () {
        if (!$scope.nonauthorizedcustomer) {
            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (descr) {
                $scope.CustomerNumber = descr.data;
            });
        }
    };


    $scope.getServiceProvidedTypes = function () {
        var Data = infoService.getServiceProvidedTypes();
        Data.then(function (ref) {
            $scope.serviceProvidedTypes = ref.data;
        }, function () {
            alert('Error ReferenceTypes');
        });
    }


    $scope.setOrderDescription = function () {
        if ($scope.order.ServiceType != undefined) {
            var s = document.getElementById("FeeForPayment");
            if ($scope.order.ServiceType == "918") { s.style.display = "none" };
            if ($scope.order.ServiceType == "920") { s.style.display = "none" };

            $scope.order.Description = $scope.serviceProvidedTypes[$scope.order.ServiceType] + 'ի համար';

            if ($scope.order.Type == 71) {

                var s = document.getElementById("FeeForPayment");
                if ($scope.order.ServiceType == "918") { s.style.display = "none" };
                if ($scope.order.ServiceType == "920") { s.style.display = "none" };
                $scope.order.Description = $scope.order.Description + '(' + $scope.CustomerNumber + ')';
            }


            $scope.getFee();
        }

    }


    $scope.getFee = function () {
        var Data = feeForServiceProvidedOrderService.getFee($scope.order.Type, $scope.order.ServiceType);
        Data.then(function (fee) {
            $scope.order.Amount = fee.data;
        }, function () {
            alert('Error getfee');
        });
    };

    //Հայտի պահպանում
    $scope.saveServiceProvidedOrder = function () {
        if ($http.pendingRequests.length == 0) {


            $scope.error = null;
            document.getElementById("serviceProvidedOrderLoad").classList.remove("hidden");
            var Data = feeForServiceProvidedOrderService.saveFeeForServiceProvidedOrder($scope.order);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    document.getElementById("serviceProvidedOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('serviceProvidedFeeOrder');
                    refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.DebitAccount);
                }
                else {
                    document.getElementById("serviceProvidedOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePayment);

                }
            }, function () {
                $scope.confirm = false;
                document.getElementById("serviceProvidedOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getFeeForServiceProvidedOrder = function (orderID) {
        var Data = feeForServiceProvidedOrderService.getFeeForServiceProvidedOrder(orderID);
        Data.then(function (acc) {
            $scope.order = acc.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getPaymentOrder');
        });

    };


    $scope.$watch('checkForDebitAccount', function (newValue, oldValue) {
        if (newValue == 1) {
            $scope.order.Type = 72;
        }
        else if (newValue == 0) {
            $scope.order.Type = 71;
        }

        if (newValue != undefined) {
            $scope.setOrderDescription();
        }

    });


    //Վճարման հանձնարարականի տպում
    $scope.getFeeForServiceProvidedOrderDetails = function (isCopy) {
        $scope.order.Currency = $scope.order.DebitAccount.Currency;
        if (isCopy == undefined)
            isCopy = false;

        var Data = feeForServiceProvidedOrderService.getFeeForServiceProvidedOrderDetails($scope.order, isCopy);
        ShowPDF(Data);

    };


    $scope.callbackgetFeeForServiceProvidedOrder = function () {
        $scope.details = true;
        $scope.getFeeForServiceProvidedOrder($scope.selectedOrderId);
    }


}]);