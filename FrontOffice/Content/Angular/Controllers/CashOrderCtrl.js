app.controller("CashOrderCtrl", ['$scope', 'referenceOrderService', 'cashOrderService', 'infoService', '$location', 'dialogService', 'orderService','$http', function ($scope, referenceOrderService, cashOrderService, infoService, $location, dialogService, orderService,$http) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.getCashOrder = function (OrderId) {
        var Data = cashOrderService.GetCashOrder(OrderId);
        Data.then(function (ch) {
            $scope.order = ch.data;
        }, function () {
            alert('Error GetCashOrder');
        });
    };

    $scope.saveCashOrder = function () {
        if ($http.pendingRequests.length == 0) {


        document.getElementById("cashLoad").classList.remove("hidden");
        var Data = cashOrderService.SaveCashOrder($scope.order);
        Data.then(function (ch) {

            if (validate($scope, ch.data)) {
                document.getElementById("cashLoad").classList.add("hidden");
                CloseBPDialog('cashorder');
                $scope.path = '#Orders';
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
            }
            else {
                document.getElementById("cashLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            document.getElementById("cashLoad").classList.add("hidden");
            if (err.status != 420)
            {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error SaveCheque');
        });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getCashOrderTypes = function () {
        var Data = infoService.GetCashOrderTypes();
        Data.then(function (cash) {
            $scope.cashTypes = cash.data;
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
    $scope.getFilialList = function () {
        var Data = infoService.GetFilialAddressList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error FilialList');
        });
    };

    $scope.callbackgetCashOrder = function () {
        $scope.getCashOrder($scope.selectedOrderId);
        $scope.getCashOrderTypes();
    };



}]);