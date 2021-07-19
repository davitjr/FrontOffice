app.service("remittanceCancellationOrderService", ['$http', function ($http) {

    this.saveRemittanceCancellationOrder = function (remittanceCancellationOrder) {
        var response = $http({
            method: "post",
            url: "RemittanceCancellationOrder/SaveRemittanceCancellationOrder",
            data: JSON.stringify(remittanceCancellationOrder),
            dataType: "json"
        });
        return response;
    };

    this.approveRemittanceCancellationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "RemittanceCancellationOrder/ApproveRemittanceCancellationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getRemittanceCancellationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "RemittanceCancellationOrder/GetRemittanceCancellationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getRemittanceSendCancellationApplication = function (remittanceCancellationOrder) {
        var response = $http({
            method: "post",
            url: "/RemittanceCancellationOrder/GetRemittanceSendCancellationApplication",
            responseType: 'arraybuffer',
            data: JSON.stringify(remittanceCancellationOrder),
            dataType: "json"
           
        });
        return response;
    };

    this.getRemittanceDetails = function (URN) {
        var response = $http({
            method: "post",
            url: "Remittance/GetRemittanceDetailsByURN",
            params: {
                URN: URN
            }
        });
        return response;
    };


}]);