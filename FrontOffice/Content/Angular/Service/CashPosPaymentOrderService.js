app.service('cashPosPaymentOrderService', ['$http', function ($http) {

    this.saveCashPosPaymentOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CashPosPaymentOrder/SaveCashPosPaymentOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;


    };

    this.getFee = function (cashPosPaymentOrder, feeType) {
        var response = $http({
            method: "post",
            url: "/CashPosPaymentOrder/GetFee",
            data: JSON.stringify(cashPosPaymentOrder),
            dataType: "json",
            params: {
                feeType: feeType,
            }
        });
        return response;
    };

    this.getCashPosPaymentOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CashPosPaymentOrder/GetCashPosPaymentOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getCashPosPaymentOrderDetails = function (cashPosPaymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/CashPosPaymentOrder/GetCashPosPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(cashPosPaymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.isOurCard = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/CashPosPaymentOrder/IsOurCard",
            dataType: "json",
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };

    this.getOperationSystemAccountForFee = function (orderForFee, feeType) {
        var response = $http({
            method: "post",
            url: "/CashPosPaymentOrder/GetOperationSystemAccountForFee",
            data: JSON.stringify(orderForFee),
            dataType: "json",
            params: {
                feeType: feeType
            }
        });
        return response;
    };
}]);