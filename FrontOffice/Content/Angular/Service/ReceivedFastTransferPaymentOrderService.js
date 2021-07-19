app.service("receivedFastTransferPaymentOrderService", ['$http', function ($http) {


    this.getFee = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/FastTransferPaymentOrder/GetFee",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;
    };

    this.saveReceivedFastTransferPaymentOrder = function (paymentOrder, confirm, isCallCenter) {
        var response = $http({
            method: "post",
            url: "/ReceivedFastTransferPaymentOrder/SaveReceivedFastTransferPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                confirm: confirm,
                isCallCenter: isCallCenter
            }
        });
        return response;
    };


    this.getReceivedFastTransferFeePercent = function (transferType, code, countryCode, amount, currency, date) {

        var response = $http({
            method: "post",
            url: "/ReceivedFastTransferPaymentOrder/GetReceivedFastTransferFeePercent",
            params: {
                transferType: transferType,
                code: code,
                countryCode: countryCode, 
                amount: amount, 
                currency: currency,
                date: date
            }
        });
        return response;
    };



    this.getFastTransferAcbaCommisionType = function (transferType, code) {

        var response = $http({
            method: "post",
            url: "/ReceivedFastTransferPaymentOrder/GetFastTransferAcbaCommisionType",
            params: {
                transferType: transferType,
                code: code
            }
        });
        return response;
    };
 

    this.getReceivedFastTransferPaymentOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/ReceivedFastTransferPaymentOrder/GetReceivedFastTransferPaymentOrder",
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
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };



}]);
