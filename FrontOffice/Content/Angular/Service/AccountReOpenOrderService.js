app.service("accountReOpenOrderService",['$http', function ($http) {

    this.saveAccountReOpenOrder = function (accountOrder) {
        var response = $http({
            method: "post",
            url: "AccountOrder/SaveAccountReOpenOrder",
            data: JSON.stringify(accountOrder),
            dataType: "json"
        });
        return response;
    };

    this.GetAccountReOpenOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/AccountOrder/GetAccountReOpenOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.printAccountReOpenApplication = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/AccountOrder/PrintAccountReOpenApplication",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.getAccountReOpenOrderOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/AccountOrder/GetAccountReOpenOrderDetails",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getOperationSystemAccountForFee = function (orderForFee, feeType) {
        var response = $http({
            method: "post",
            url: "/AccountOrder/GetOperationSystemAccountForFee",
            data: JSON.stringify(orderForFee),
            dataType: "json",
            params: {
                feeType: feeType
            }
        });
        return response;
    };

    this.getAccountReopenFee = function (customerType) {
        var response = $http({
            method: "post",
            url: "/AccountOrder/GetAccountReopenFee",
            params: {
                customerType: customerType
            }
        });
        return response;
    };
}]);