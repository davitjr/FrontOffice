app.service("cardClosingOrderService", ['$http', function ($http) {

    this.saveCardClosingOrder = function (order, cardNumber) {
        var response = $http({
            method: "post",
            url: "CardClosingOrder/SaveCardClosingOrder",
            params: {
                cardNumber: cardNumber
            },
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.GetCardClosingOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CardClosingOrder/GetCardClosingOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetCardClosingWarnings = function (productId) {
        var response = $http({
            method: "post",
            url: "/CardClosingOrder/GetCardClosingWarnings",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getCardClosingApplication = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/CardClosingOrder/GetCardClosingApplication",
            responseType: 'arraybuffer',
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };
}]);