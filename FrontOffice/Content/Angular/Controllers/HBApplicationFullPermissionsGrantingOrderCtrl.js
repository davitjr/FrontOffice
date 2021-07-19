app.controller("hbApplicationFullPermissionsGrantingOrderCtrl", ['$scope', '$location', 'dialogService', '$http', 'hbApplicationFullPermissionsGrantingOrderService', function ($scope, $location, dialogService, $http, hbApplicationFullPermissionsGrantingOrderService) {
    $scope.order = {};
    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;


    $scope.saveHBApplicationFullPermissionsGrantingOrder = function () {
        $scope.order.HBApplication = {};
        $scope.order.HBApplication.ID = $scope.hbApplication.ID;

        $scope.order.Type = 222;

        if ($http.pendingRequests.length == 0) {
            document.getElementById("hbApplicationFullPermissionsGrantingLoad").classList.remove("hidden");
            var Data = hbApplicationFullPermissionsGrantingOrderService.saveHBApplicationFullPermissionsGrantingOrder($scope.order);
            Data.then(function (result) {

                if (validate($scope, result.data)) {
                    document.getElementById("hbApplicationFullPermissionsGrantingLoad").classList.add("hidden");
                    CloseBPDialog('hbapplicationfullpermissionsgranting');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    var refreshScope = angular.element(document.getElementById('AllHbApplication')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.getHBApplication();
                    }
                }
                else {
                    document.getElementById("hbApplicationFullPermissionsGrantingLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                document.getElementById("hbApplicationFullPermissionsGrantingLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveHBApplicationFullPermissionsGrantingOrder');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };


    $scope.getHBApplicationFullPermissionsGrantingOrder = function (orderId) {
        var Data = hbApplicationFullPermissionsGrantingOrderService.getHBApplicationFullPermissionsGrantingOrder(orderId);
        Data.then(function (result) {
            $scope.order = result.data;
        }, function () {
            alert('Error getHBApplicationFullPermissionsGrantingOrder');
        });
    };
}]);