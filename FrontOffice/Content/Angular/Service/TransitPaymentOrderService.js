app.service('transitPaymentOrderService', ['$http', function ($http) {
    this.getTransitPaymentOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetTransitPaymentOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
    this.saveTransitPaymentOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/SaveTransitPaymentOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getCashInPaymentOrder = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetCashInPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };


    this.getCashInPaymentOrderDetailsForRATransfer = function (order, transitPaymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetCashInPaymentOrderDetailsForRATransfer",
            responseType: 'arraybuffer',
            data:JSON.stringify({ "order":order, "transitPaymentOrder": transitPaymentOrder }),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getCashInPaymentOrderDetailsForBudgetTransfer = function (order, transitPaymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetCashInPaymentOrderDetailsForBudgetTransfer",
            responseType: 'arraybuffer',
            data: JSON.stringify({ "order": order, "transitPaymentOrder": transitPaymentOrder }),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getFee = function (transitPaymentOrder, feeType) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetFee",
            data: JSON.stringify(transitPaymentOrder),
            dataType: "json",
            params: {
                feeType: feeType,
            }
        });
        return response;
    };

    this.getOperationSystemAccountForFee = function (orderForFee, feeType) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetOperationSystemAccountForFee",
            data: JSON.stringify(orderForFee),
            dataType: "json",
            params: {
                feeType: feeType
            }
        });
        return response;
    };

    this.getCashInPaymentOrderDetailsForMatureOrder = function (order, matureOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetCashInPaymentOrderDetailsForMatureOrder",
            responseType: 'arraybuffer',
            data: JSON.stringify({ "order": order, "matureOrder": matureOrder }),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getPaymentOrderDetails = function (order, matureOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify({ "order": order, "matureOrder": matureOrder }),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getPaymentOrderDetailsForBond = function (order, bondOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/TransitPaymentOrder/GetPaymentOrderDetailsForBond",
            responseType: 'arraybuffer',
            data: JSON.stringify({ "order": order, "bondOrder": bondOrder }),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };



}]);