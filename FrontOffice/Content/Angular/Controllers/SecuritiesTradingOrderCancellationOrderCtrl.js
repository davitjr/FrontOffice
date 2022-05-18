app.controller("SecuritiesTradingOrderCancellationOrderCtrl", ['$scope', 'securitiesTradingOrderCancellationOrderService', '$http', function ($scope, securitiesTradingOrderCancellationOrderService,  $http) {


    $scope.GetSecuritiesTradingOrderCancellationOrder = function (id) {
        var Data = securitiesTradingOrderCancellationOrderService.GetSecuritiesTradingOrderCancellationOrder(id);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountClosingOrder');
        });
    };

}]);