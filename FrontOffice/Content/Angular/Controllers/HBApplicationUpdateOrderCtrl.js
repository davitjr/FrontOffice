app.controller("HBApplicationUpdateOrderCtrl", ['$scope', 'hbApplicationUpdateService', '$http', function ($scope, hbApplicationUpdateService, $http) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.saveHBApplicationUpdateOrder = function () {
        var hbApplicationUpdate = JSON.parse(sessionStorage.getItem('hbApplicationUpdate'));
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.Type = 1;
        $scope.order.SubType = 1;

        if ($http.pendingRequests.length == 0 && hbApplicationUpdate != null) {
            document.getElementById("hpApplicationUpdateLoad").classList.remove("hidden");
            var Data = hbApplicationUpdateService.saveHBApplicationUpdateOrder($scope.order, hbApplicationUpdate);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    //$scope.order.Type) refresh(7);
                }
                else {
                    document.getElementById("hpApplicationUpdateLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("hpApplicationUpdateLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveHBApplicationOrder');
            });
        }
        else if (updatedHBApp == null)
        {
            return ShowMessage('Հեռահար բանկինգում ավելացրած չեն փոփոխություններ', 'error');
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

}]);