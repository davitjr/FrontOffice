app.service("pensionPaymentOrderService", ['$http', function ($http) {


    this.GetAllPensionPayment = function () {
        var response = $http({
            method: "post",
            url: "/PensionPaymentOrder/GetAllPensionPayment"
        });
        return response;
    };

    this.GetPensionPaymentOrderDetails = function (orderid) {
        var response = $http({
            method: "post",
            url: "/PensionPaymentOrder/GetPensionPaymentOrderDetails",
            params: {
                orderid: orderid
            },
        });
        return response;
    };

    this.SavePensionPaymentOrder = function (order) {

        var response = $http({
            method: "post",
            url: "/PensionPaymentOrder/SavePensionPaymentOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

}]);