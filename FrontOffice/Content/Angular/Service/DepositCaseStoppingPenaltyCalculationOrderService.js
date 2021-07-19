app.service("depositCaseStoppingPenaltyCalculationOrderService", ['$http', function ($http) {

   
    this.saveDepositCaseStoppingPenaltyCalculationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/DepositCaseStoppingPenaltyCalculationOrder/SaveDepositCaseStoppingPenaltyCalculationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getDepositCaseStoppingPenaltyCalculationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/DepositCaseStoppingPenaltyCalculationOrder/GetDepositCaseStoppingPenaltyCalculationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

}]);