app.service("feeForServiceProvidedOrderService",['$http', function ($http) {


    this.getFee = function (orderType, serviceType) {
        var response = $http({
            method: "post",
            url: "/FeeForServiceProvidedOrder/GetServiceProvidedOrderFee",
            dataType: "json",
            params: {
                orderType : orderType,
                serviceType: serviceType
            }
        });
        return response;
    };

    this.saveFeeForServiceProvidedOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/FeeForServiceProvidedOrder/SaveFeeForServiceProvidedOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getFeeForServiceProvidedOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/FeeForServiceProvidedOrder/GetFeeForServiceProvidedOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getFeeForServiceProvidedOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/FeeForServiceProvidedOrder/GetFeeForServiceProvidedOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

}]);