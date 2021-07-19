app.controller("PeriodicTransferDataChangeOrderCtrl", ['$scope', 'dialogService', 'infoService', 'periodicTransferDataChangeOrderService', '$uibModal', '$confirm', '$http', '$filter', function ($scope, dialogService, infoService, periodicTransferDataChangeOrderService, $uibModal, $confirm, $http, $filter) {
    if ($scope.periodicorder == undefined) {
        $scope.periodicorder = {};
    }
    if ($scope.currentPeriodic != undefined && $scope.currentPeriodic.DurationType != 1 && $scope.currentPeriodic.EndDate != null) {//ete 2 a uremn fiqsvac date a(anjamket chi ) ....1-anjamket
        $scope.periodicorder.LastOperationDate = $filter('mydate')($scope.currentPeriodic.EndDate, "dd/MM/yyyy");  
    };
    if ($scope.currentPeriodic != undefined) {
        $scope.periodicorder.ProductId = $scope.currentPeriodic.ProductId;
    };

    if ($scope.currentPeriodic != undefined) {
        $scope.periodicorder.FirstTransferDate = $filter('mydate')($scope.currentPeriodic.FirstTransferDate, "dd/MM/yyyy");  
    };
    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });
    };
    $scope.periodiclyType = function () {
        var Data = infoService.PeriodiclyType();
        Data.then(function (acc) {
            $scope.periodiclyTypes = acc.data;
            //$scope.periodicorder.Periodicity = '30';
        }, function () {
            alert('Currencies Error');
        });
    }; 
    $scope.debtType = function () {
        var Data = infoService.DebtType();
        Data.then(function (acc) {
            $scope.debtTypes = acc.data;
        }, function () {
            alert('Currencies Error');
        });
    };
    $scope.setCheckDaysCount = function () {
        if ($scope.periodicorder.Periodicity == 1) {
            $scope.periodicorder.CheckDaysCount = 1;
        }
        else
            $scope.periodicorder.CheckDaysCount = undefined;
    }
    $scope.GetCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });
    };
    $scope.savePeriodicDataChangeOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.periodicorder.Type = 201;
            $scope.periodicorder.SubType = 1;
            document.getElementById("periodicDataChangeOrderLoad").classList.remove("hidden");
            var Data = periodicTransferDataChangeOrderService.savePeriodicTransferDataChangeOrder($scope.periodicorder);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        document.getElementById("periodicDataChangeOrderLoad").classList.add("hidden");
                        CloseBPDialog('periodicDataChange');
                        $scope.path = '#Orders';
                        refresh(201);
                        document.getElementById("accountCloseLoad").classList.add("hidden");
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        CloseBPDialog('closeaccount');
                        refresh($scope.periodicorder.Type);


                    }
                    else {
                        document.getElementById("periodicDataChangeOrderLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    document.getElementById("periodicDataChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveAccount');
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };
    $scope.getPeriodicDataChangeOrder = function (orderId) {
        var Data = periodicTransferDataChangeOrderService.getPeriodicDataChangeOrder(orderId);
        Data.then(function (dep) {
            $scope.order = dep.data;
        }, function () {
            alert('Error getPeriodicDataChangeOrder');
        });
    };
}]);