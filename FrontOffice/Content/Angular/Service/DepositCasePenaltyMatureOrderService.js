app.service("depositCasePenaltyMatureOrderService", ['$http', function ($http) {

    this.saveDepositCasePenaltyMatureOrder = function (order) {
        var response = $http({
            method: "post",
            url: "DepositCasePenaltyMatureOrder/SaveDepositCasePenaltyMatureOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getDepositCasePenaltyMatureOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/DepositCasePenaltyMatureOrder/GetDepositCasePenaltyMatureOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.getCashInPaymentOrder = function (order, isCopy) {
        var response = $http({
            method: "post",
            url: "/DepositCasePenaltyMatureOrder/GetCashInPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

}]);