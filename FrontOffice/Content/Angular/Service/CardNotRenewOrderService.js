app.service("cardNotRenewOrderService", ['$http', function ($http) {
    this.saveCardNotRenewOrder = function (order) {
        debugger;
        var response = $http({
            method: "post",
            url: "CardNotRenewOrder/saveCardNotRenewOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getCardNotRenewOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CardNotRenewOrder/GetCardNotRenewOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
}]);