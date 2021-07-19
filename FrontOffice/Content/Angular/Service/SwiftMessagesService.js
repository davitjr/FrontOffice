app.service("swiftMessagesService", ['$http', function ($http) {


    this.getSearchedSwiftMessages = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/SwiftMessages/GetSearchedSwiftMessages",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });

        return response;
    };


    this.getSwiftMessage = function (messageUnicNumber) {
        var response = $http({
            method: "post",
            url: "/SwiftMessages/GetSwiftMessage",
            params: {
                messageUnicNumber: messageUnicNumber
            }
        });
        return response;
    };

    this.saveTransactionSwiftConfirmOrder = function (order) {
        var response = $http({
            method: "post",
            url: "SwiftMessages/SaveTransactionSwiftConfirmOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });

        return response;
    };

    this.getTransactionSwiftConfirmOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/SwiftMessages/GetTransactionSwiftConfirmOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.saveSwiftMessageRejectOrder = function (order) {
        var response = $http({
            method: "post",
            url: "SwiftMessages/SaveSwiftMessageRejectOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });

        return response;
    };

}]);