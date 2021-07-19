app.controller("DepositCaseStoppingPenaltyCalculationOrderCtrl", ['$scope', 'depositCaseStoppingPenaltyCalculationOrderService', '$http', function ($scope, depositCaseStoppingPenaltyCalculationOrderService, $http) {
    $scope.order={}
    $scope.order.SubType = 1;
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.RegistrationDate = new Date();
    $scope.order.DateOfStoppingPenaltyCalculation = $scope.$root.SessionProperties.OperationDate;

    $scope.saveDepositCaseStoppingPenaltyCalculationOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.error = null;
            $scope.order.Type = 165;
            $scope.order.ProductId = $scope.productId;
            document.getElementById("DepositCaseStoppingPenaltyCalculationOrderLoad").classList.remove("hidden");
            var Data = depositCaseStoppingPenaltyCalculationOrderService.saveDepositCaseStoppingPenaltyCalculationOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {

                    document.getElementById("DepositCaseStoppingPenaltyCalculationOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('depositCaseStoppingPenaltyCalculationOrder');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("DepositCaseStoppingPenaltyCalculationOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("DepositCaseStoppingPenaltyCalculationOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveDepositCasePenaltyCancelingOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


    $scope.getDepositCaseStoppingPenaltyCalculationOrder = function (orderId) {

        var Data = depositCaseStoppingPenaltyCalculationOrderService.getDepositCaseStoppingPenaltyCalculationOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getDepositCasePenaltyCancelingOrder');
        });

    };



}])