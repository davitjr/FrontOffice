app.service("cardStatusChangeOrderService", ['$http', function ($http) {
    this.saveCardStatusChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CardStatusChangeOrder/SaveCardStatusChangeOrder",
            data: JSON.stringify(order),
            datType: "json"
        });

        return response;
    };

    this.getCardStatusChangeOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CardStatusChangeOrder/GetCardStatusChangeOrder",
            params: {
                orderID: orderID
            }
        });

        return response;
    };

}]);