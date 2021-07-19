app.service("nonCreditLineCardReplaceService", ['$http', function ($http) {
    this.getNonCreditLineCardReplaceOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/NonCreditLineCardReplaceOrder/GetNonCreditLineCardReplaceOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getCard = function (productId) {
        var response = $http({
            method: "post",
            url: "/NonCreditLineCardReplaceOrder/GetCard",
            params: {
                productId: productId
            }
        });
        return response;
    }

    this.saveNonCreditLineCardReplaceOrder = function (nonCreditLineCardReplaceOrder) {
        var response = $http({
            method: "post",
            url: "/NonCreditLineCardReplaceOrder/SaveNonCreditLineCardReplaceOrder",
            data: JSON.stringify(nonCreditLineCardReplaceOrder),
            dataType: "json"
        });
        return response;
    };

}]);