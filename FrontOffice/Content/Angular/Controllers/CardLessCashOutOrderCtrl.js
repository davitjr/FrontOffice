app.controller("CardLessCashOutOrderCtrl", ['$scope', 'cardlessCashOutOrderService', '$http', function ($scope, cardlessCashOutOrderService, $http) {
    $scope.order = {};

    $scope.getCardLessCashOutOrder = function (orderId) {
        var Data = cardlessCashOutOrderService.getCardLessCashOutOrder(orderId);
        $scope.attemptStatusDescription = '';

        Data.then(function (acc) {
            $scope.order = acc.data;

            if ($scope.order.AttemptStatus == 1)
                $scope.attemptStatusDescription = 'չհաջողված';
            else if ($scope.order.AttemptStatus == 2)
                $scope.attemptStatusDescription = 'հաջողված';
            else
                $scope.attemptStatusDescription = '';
        }, function () {
            alert('Error getCardLessCashOutOrder');
        });
    };

}]);