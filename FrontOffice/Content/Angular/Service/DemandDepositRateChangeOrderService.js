app.service("demandDepositRateChangeOrderService", ['$http', function ($http) {

    this.saveDemandDepositRateChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/DemandDepositRateChangeOrder/SaveDemandDepositRateChangeOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getDemandDepositRateChangeOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/DemandDepositRateChangeOrder/GetDemandDepositRateChangeOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


    this.getDemandDepositRateTariffDocument = function () {
        var response = $http({
            method: "post",
            url: "/DemandDepositRateChangeOrder/GetDemandDepositRateTariffDocument"
        });
        return response;
    };



}]);