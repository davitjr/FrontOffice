app.service("creditLineProlongationOrderService", ['$http', function ($http) {

    this.saveCreditLineProlongationOrder = function (productId) {

        var response = $http({
            method: "post",
            url: "/CreditLineProlongationOrder/SaveCreditLineProlongationOrder",
            params: {
                productId: productId,
            }
        });
        return response;
    };

    this.getCreditLineProlongationOrder = function (id) {
        var resp = $http({
            method: "post",
            url: "/CreditLineProlongationOrder/GetCreditLineProlongationOrder",
            params: {
                id: id,
            }
        });
        return resp;
    };

    this.IsCreditLineActivateOnApiGate = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CreditLineProlongationOrder/IsCreditLineActivateOnApiGate",
            params: {
                orderId: orderId
            }
        });
        return response;
    }

}]);