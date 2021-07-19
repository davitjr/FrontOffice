app.service("creditLineCardReplaceService", ['$http', function ($http) {
    this.getCreditLineCardReplaceOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CreditLineCardReplaceOrder/GetCreditLineCardReplaceOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getCard = function (productId) {
        var response = $http({
            method: "post",
            url: "/CreditLineCardReplaceOrder/GetCard",
            params: {
                productId: productId
            }
        });
        return response;
    }

    this.saveCreditLineCardReplaceOrder = function (creditLineCardReplaceOrder) {
        var response = $http({
            method: "post",
            url: "/CreditLineCardReplaceOrder/SaveCreditLineCardReplaceOrder",
            data: JSON.stringify(creditLineCardReplaceOrder),
            dataType: "json"
        });
        return response;
    };
}]);