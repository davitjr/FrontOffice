app.service("securitiesMarketTradingOrderService", ['$http', function ($http) {
    this.SaveAndApproveSecuritiesMarketTradingOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/SecuritiesMarketTradingOrder/SaveAndApproveSecuritiesMarketTradingOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.GetSecuritiesMarketTradingOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/SecuritiesMarketTradingOrder/GetSecuritiesMarketTradingOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


}]);