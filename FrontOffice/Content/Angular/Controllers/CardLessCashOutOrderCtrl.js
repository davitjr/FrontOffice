app.controller("CardLessCashOutOrderCtrl", ['$scope', 'cardlessCashOutOrderService', '$http', function ($scope, cardlessCashOutOrderService, $http) {
    $scope.order = {};

    $scope.getCardLessCashOutOrder = function (orderId) {
        var Data = cardlessCashOutOrderService.getCardLessCashOutOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
                alert('Error getCardLessCashOutOrder');
        });
    };

}]);