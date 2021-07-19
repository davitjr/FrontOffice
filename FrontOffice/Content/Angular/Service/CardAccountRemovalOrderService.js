app.service("cardAccountRemovalOrderService", ['$http', function ($http) {

    this.saveCardAccountRemovalOrder = function (Order) {
        var response = $http({
            method: "post",
            url: "/CardAccountRemovalOrder/SaveCardAccountRemovalOrder",
            data: JSON.stringify(Order),
            dataType: "json"
        });
        return response;
    };

    this.getCardAccountRemovalOrder = function (orderID) {

        var response = $http({
            method: "post",
            url: "/CardAccountRemovalOrder/GetCardAccountRemovalOrder",
            dataType: "json",
            params: {
                orderID: orderID
            }
        });
        return response;
    }

    this.getCardAccountRemovalReasons = function () {
        var response = $http({
            method: "post",
            url: "/PlasticCardRemovalOrder/GetCardRemovalReasons",
            dataType: "json"
        });
        return response;
    }

}]);