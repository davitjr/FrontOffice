app.controller("hbTokenUnBlockOrderCtrl", ['$scope', '$location', 'dialogService', '$http', 'hbTokenUnBlockOrderService', function ($scope, $location, dialogService, $http, hbTokenUnBlockOrderService) {
    $scope.order = {};
    $scope.order.HBtoken = {};
    $scope.order.Type = 135;
    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.CustomerNumber = $scope.selectedToken.HBUser.CustomerNumber;

    $scope.saveHBTokenUnBlockOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("hbTokenUnBlockLoad").classList.remove("hidden");
            $scope.order.HBtoken.ID = $scope.selectedToken.ID;
            var Data = hbTokenUnBlockOrderService.saveHBTokenUnBlockOrder($scope.order);
        Data.then(function (result) {

            if (validate($scope, result.data)) {
                document.getElementById("hbTokenUnBlockLoad").classList.add("hidden");
                CloseBPDialog('hbtokenunblock');
                $scope.path = '#Orders';
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
            }
            else {
                document.getElementById("hbTokenUnBlockLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            document.getElementById("hbTokenUnBlockLoad").classList.add("hidden");
            if (err.status != 420)
            {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error saveHBTokenUnBlockOrder');
        });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };
}]);