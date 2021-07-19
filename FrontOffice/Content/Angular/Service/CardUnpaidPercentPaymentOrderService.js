app.service("CardUnpaidPercentPaymentOrderService", ['$http', function ($http) {
    this.saveCardUnpaidPercentPaymentOrder = function(order)
    {
        var response = $http({
            method: "post",
            url: "/CardUnpaidPercentPaymentOrder/SaveCardUnpaidPercentPaymentOrder",
            data: JSON.stringify(order),
            datType: "json"
        });

        return response;
    };

    this.getCardUnpaidPercentPaymentOrder = function (ID) {
        var response = $http({
            method: "post",
            url: "/CardUnpaidPercentPaymentOrder/GetCardUnpaidPercentPaymentOrder",
            params: {
                orderID: ID
            }
        });

        return response;
    };
}]);