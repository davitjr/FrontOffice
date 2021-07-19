app.service("replacedCardAccountRegOrderService", ['$http', function ($http) {

    this.saveReplacedCardAccountRegOrder = function (order) {
        var response = $http({
            method: "post",
            url: "ReplacedCardAccountRegOrder/SaveReplacedCardAccountRegOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getCard = function (productId) {
        var response = $http({
            method: "post",
            url: "/ReplacedCardAccountRegOrder/GetCard",
            params: {
                productId: productId
            }
        });
        return response;
    }

    this.getReplacedCardAccountRegOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/ReplacedCardAccountRegOrder/GetReplacedCardAccountRegOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
}]);