app.service("fastTransferPaymentOrderService", ['$http', function ($http) {


    this.getFee = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/GetFee",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;
    };

    this.saveFastTransferPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/SaveFastTransferPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;
    };


    this.GetFastTransferFeeAcbaPercent = function (transferType) {

        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/GetFastTransferFeeAcbaPercent",
            params: {
                transferType: transferType
            }
        });
        return response;
    };


    this.getFastTransferPaymentOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/GetFastTransferPaymentOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.printFastTransferPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/PrintFastTransferPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

    this.saveFastTransferOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/SaveFastTransferOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.approveFastTransferOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "FastTransferPaymentOrder/ApproveFastTransferOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.getSTAKMTOListAndBestChoice = function (bestChoice) {
        var response = $http({
            method: "post",
            url: "/Remittance/GetSTAKMTOListAndBestChoice",
            params: {
                bestChoice: bestChoice
            }
        });
        return response;
    };

    this.printSTAKSendMoneyPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/PrintSTAKSendMoneyPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

}]);