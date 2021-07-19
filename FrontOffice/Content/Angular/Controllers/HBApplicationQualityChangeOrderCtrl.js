app.controller("hbApplicationQualityChangeOrderCtrl", ['$scope', '$location', 'dialogService', '$http', 'hbApplicationQualityChangeOrderService', function ($scope, $location, dialogService, $http, hbApplicationQualityChangeOrderService) {
    $scope.order = {};
    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
   

    $scope.saveHBApplicationQualityChangeOrder = function () {
        $scope.order.HBApplication = {};
        $scope.order.HBApplication.ID = $scope.hbApplication.ID;

        if ($scope.hbApplication.Quality == 5 || $scope.hbApplication.Quality == 3) {
            $scope.order.Type = 120;
        }
        else if ($scope.hbApplication.Quality == 6) {
            $scope.order.Type = 119;
        }
        if ($http.pendingRequests.length == 0) {
            document.getElementById("hbApplicationQualityChangeLoad").classList.remove("hidden");
            var Data = hbApplicationQualityChangeOrderService.saveHBApplicationQualityChangeOrder($scope.order);
        Data.then(function (result) {

            if (validate($scope, result.data)) {
                document.getElementById("hbApplicationQualityChangeLoad").classList.add("hidden");
                CloseBPDialog('hbapplicationqualitychange'); 
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                var refreshScope = angular.element(document.getElementById('AllHbApplication')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getHBApplication();
                }
            }
            else {
                document.getElementById("hbApplicationQualityChangeLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            document.getElementById("hbApplicationQualityChangeLoad").classList.add("hidden");
            if (err.status != 420)
            {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error saveHBApplicationQualityChangeOrder');
        });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };


    $scope.getHBApplicationQualityChangeOrder = function (orderId) {
        var Data = hbApplicationQualityChangeOrderService.getHBApplicationQualityChangeOrder(orderId);
        Data.then(function (result) {
            $scope.order = result.data;
        }, function () {
            alert('Error getHBApplicationOrder');
        });
    };
}]);