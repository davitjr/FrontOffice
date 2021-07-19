app.service("cardServiceFeeGrafikDataChangeOrderService", ['$http', function ($http) {
    this.saveCardServiceFeeGrafikDataChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CardServiceFeeGrafikDataChangeOrder/SaveCardServiceFeeGrafikDataChangeOrder",
            data: JSON.stringify(order),
            datType: "json"
        });

        return response;
    };

    this.getCardServiceFeeGrafikDataChangeOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CardServiceFeeGrafikDataChangeOrder/GetCardServiceFeeGrafikDataChangeOrder",
            params: {
                orderID: orderID
            }
        });

        return response;
    };

}]);