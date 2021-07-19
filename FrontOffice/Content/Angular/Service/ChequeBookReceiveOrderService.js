app.service('chequeBookReceiveOrderService', ['$http', function ($http) {

    this.GetChequeBookReceiveOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/ChequeBookReceiveOrder/GetChequeBookReceiveOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
    this.SaveChequeBookReceiveOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/ChequeBookReceiveOrder/SaveChequeBookReceiveOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;

    };
    this.getChequeBookReceiveOrderWarnings = function (customerNumber,accountNumber) {
        var response = $http({
            method: "post",
            url: "/ChequeBookReceiveOrder/GetChequeBookReceiveOrderWarnings",
            params: {
                customerNumber: customerNumber,
                accountNumber:  accountNumber
            }
        });
        return response;
    };
    this.getChequeBookApplication = function (accountNumber, personName, pageNumberStart, pageNumberEnd) {
        var response = $http({
            method: "post",
            url: "/ChequeBookReceiveOrder/GetChequeBookApplication",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber,
                personName: personName,
                pageNumberStart: pageNumberStart,
                pageNumberEnd: pageNumberEnd
            },

        });
        return response;
    };
}]);