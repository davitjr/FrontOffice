app.service("cardNotRenewOrderService", ['$http', function ($http) {

    this.getCard = function (productId) {
        var response = $http({
            method: "post",
            url: "/CardNotRenewOrder/GetCard",
            params: {
                productId: productId
            }
        });
        return response;
    }

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