app.service("CardAccountClosingOrderService", ['$http', function ($http) {

    this.saveCardAccountClosingOrder = function (CardAccountClosingOrder) {
        var response = $http({
            method: "post",
            url: "/CardAccountClosingOrder/saveCardAccountClosingOrder",
            data: JSON.stringify(CardAccountClosingOrder),
            dataType: "json"
        });
        return response;
    }

    this.getCardAccountClosingOrderDetails = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CardAccountClosingOrder/GetCardAccountClosingOrder",
            dataType: "json",
            params: {
                orderID: orderID
            }
        });
        return response;
    }

    this.getCardAccountClosingApplication = function (productID) {
        var response = $http({
            method: "post",
            url: "/CardAccountClosingOrder/GetCardAccountClosingApplication",
            params: {
                productID: productID
            }
        });
        return response;
    };

}]);