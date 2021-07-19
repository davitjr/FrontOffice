app.service("accountClosingOrderService", ['$http', function ($http) {
    this.saveAccountClosingOrder = function (accountClosingOrder) {
        var response = $http({
            method: "post",
            url: "AccountClosingOrder/SaveAccountClosingOrder",
            data: JSON.stringify(accountClosingOrder),
            dataType: "json"
        });
        return response;
    };
    this.GetAccountClosingOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/AccountClosingOrder/GetAccountClosingOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
    this.getAccountClosingApplication = function (accountNumber, closingReasonDescription, isReprint, RegistrationDateString) {
        var response = $http({
            method: "post",
            url: "/AccountClosingOrder/GetAccountClosingApplication",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber,
                closingReason: closingReasonDescription,
                isReprint: isReprint,
                RegistrationDateString: RegistrationDateString
            }
        });
        return response;
    };

}]);