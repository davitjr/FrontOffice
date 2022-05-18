app.service("securitiesTradingService", ['$http', function ($http) {
    this.GetSentSecuritiesTradingOrders = function (filter) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/GetSentSecuritiesTradingOrders",
            data: JSON.stringify(filter),
            dataType: "json"
        });
        return response;
    };

    this.GetSecuritiesTradingLenght = function () {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/GetSecuritiesTradingLenght",
        });
        return response;
    };

    this.GetSentSecuritiesTradingOrder = function (type, orderId) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/GetSentSecuritiesTradingOrder",
            params: {
                type: type,
                orderId: orderId
            }
        });
        return response;
    };

    this.ConfirmSecuritiesTradingOrderCancellationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/ConfirmSecuritiesTradingOrderCancellationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.ConfirmSecuritiesTradingOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/ConfirmSecuritiesTradingOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.RejectSecuritiesTradingOrderCancellationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/RejectSecuritiesTradingOrderCancellationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.RejectSecuritiesTradingOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/RejectSecuritiesTradingOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.UpdateSecuritiesTradingOrderDeposited = function (docId) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/UpdateSecuritiesTradingOrderDeposited",
            params: {
                docId: docId
            }
        });
        return response;
    };

    this.GetStockMarketTickers = function () {
        var response = $http({
            method: "post",
            url: "/SecuritiesTrading/GetStockMarketTickers"
        });
        return response;
    };
}]);