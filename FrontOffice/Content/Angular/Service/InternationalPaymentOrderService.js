app.service("internationalPaymentOrderService", ['$http', function ($http) {


    this.getFee = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/GetFee",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;
    };



    this.saveInternationalPaymentOrder = function (paymentOrder, confirm) {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/SaveInternationalPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
            confirm: confirm
        }
        });
        return response;
    };

    this.getInternationalPaymentOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/GetInternationalPaymentOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.printInternationalPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/PrintInternationalPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };

    this.getCrossConvertationVariant = function (debitCurrency, creditCurrency) {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/GetCrossConvertationVariant",
            params: {
                debitCurrency: debitCurrency,
                creditCurrency: creditCurrency
            }
        });
        return response;
    }

    this.getOperationSystemAccountForFee = function (orderForFee, feeType) {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/GetOperationSystemAccountForFee",
            data: JSON.stringify(orderForFee),
            dataType: "json",
            params: {
                feeType: feeType
            }
        });
        return response;
    };

    this.isUrgentTime = function () {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/IsUrgentTime",

        });
        return response;
    };

    this.getSessionProperties = function () {
        var response = $http({
            method: "post",
            url: "/Customer/GetSessionProperties"

        });
        return response;
    };


    this.postInternationalPaymentAddresses = function (order) {
        var response = $http({
            method: "post",
            url: "/InternationalPaymentOrder/PostInternationalPaymentAddresses",
            data: order,
            dataType: "json"
        });
        return response;
    };


}]);