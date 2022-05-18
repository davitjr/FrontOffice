app.service("securitiesTradingOrderCancellationOrderService", ['$http', function ($http) {
    
    this.GetSecuritiesTradingOrderCancellationOrder = function (id) {
        var response = $http({
            method: "post",
            url: "/SecuritiesTradingOrderCancellationOrder/GetSecuritiesTradingOrderCancellationOrder",
            params: {
                id: id
            }
        });
        return response;
    };


}]);