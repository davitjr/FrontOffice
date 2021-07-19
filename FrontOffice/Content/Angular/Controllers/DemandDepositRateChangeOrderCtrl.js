app.controller("DemandDepositRateChangeOrderCtrl", ['$scope', 'demandDepositRateChangeOrderService', 'infoService', '$http', '$filter', function ($scope, demandDepositRateChangeOrderService, infoService, $http, $filter) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    if ($scope.demandDepositAccount != undefined) {
        $scope.order.DemandDepositAccount = angular.copy($scope.demandDepositAccount);
    }

    $scope.saveDemandDepositRateChangeOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.error = null;
            $scope.order.Type = 173;
            $scope.order.SubType = 1;

            document.getElementById("DemandDepositRateChangeOrderLoad").classList.remove("hidden");
            var Data = demandDepositRateChangeOrderService.saveDemandDepositRateChangeOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {

                    document.getElementById("DemandDepositRateChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('demandDepositRateChangeOrder');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("DemandDepositRateChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("DemandDepositRateChangeOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveDemandDepositRateChangeOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


    $scope.getDemandDepositRateChangeOrder = function (orderId) {

        var Data = demandDepositRateChangeOrderService.getDemandDepositRateChangeOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getDemandDepositRateChangeOrder');
        });

    };


    $scope.getDemandDepositsTariffGroups = function () {
        var Data = infoService.getDemandDepositsTariffGroups();
        Data.then(function (acc) {
            $scope.demandDepositsTariffGroups = acc.data;
            try {
                if ($scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"] != 1) {
                    delete $scope.demandDepositsTariffGroups['2'];
                }
                if ($scope.order.DemandDepositAccount.Currency != 'AMD') {
                    delete $scope.demandDepositsTariffGroups['3'];
                }
            }
            catch (ex) {
                delete $scope.demandDepositsTariffGroups['2'];
            }

        }, function () {
            alert('Error getDemandDepositsTariffGroups');
        });
    };

    $scope.getDemandDepositRateTariffDocument = function (tariffGroup) {

        if (tariffGroup == 3) {
            var Data = demandDepositRateChangeOrderService.getDemandDepositRateTariffDocument();
            Data.then(function (acc) {
                $scope.demandDepositRateTariffDocument = acc.data;
                if ($scope.demandDepositRateTariffDocument != null) {
                    $scope.order.DocumentNumber = $scope.demandDepositRateTariffDocument.key;
                    $scope.order.DocumentDate = $filter('mydate')($scope.demandDepositRateTariffDocument.value, "dd/MM/yyyy");
                }
            }, function () {
                alert('Error getDemandDepositRateChangeOrder');
            });
        }

    };



}]);