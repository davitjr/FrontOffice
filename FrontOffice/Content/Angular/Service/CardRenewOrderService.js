app.service("cardRenewOrderService", ['$http', function ($http) {
    this.getCardRenewOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CardRenewOrder/GetCardRenewOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getCard = function (productId) {
        var response = $http({
            method: "post",
            url: "/CardRenewOrder/GetCard",
            params: {
                productId: productId
            }
        });
        return response;
    }

    this.getPhoneForCardRenew = function (productId) {
        var response = $http({
            method: "post",
            url: "/CardRenewOrder/GetPhoneForCardRenew",
            params: {
                productId: productId
            }
        });
        return response;
    }

    this.saveCardRenewOrder = function (cardRenewOrder) {
        var response = $http({
            method: "post",
            url: "/CardRenewOrder/SaveCardRenewOrder",
            data: JSON.stringify(cardRenewOrder),
            dataType: "json"
        });
        return response;
    };

    this.checkCardRenewOrder = function (cardRenewOrder) {
        var response = $http({
            method: "post",
            url: "/CardRenewOrder/CheckCardRenewOrder",
            data: JSON.stringify(cardRenewOrder),
            dataType: "json"
        });
        return response;
    };
}]);
