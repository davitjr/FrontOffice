app.service("credentialService", ['$http', function ($http) {

    this.getCredentials = function (filter) {
        var response = $http({
            method: "post",
            url: "/Credential/GetCredentials",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.printCustomerCredentialApplication = function (assigneeCustomerNumber, assignId) {
        var response = $http({
            method: "post",
            url: "/Credential/PrintCustomerCredentialApplication",
            responseType: 'arraybuffer',
            params: {
                assigneeCustomerNumber: assigneeCustomerNumber,
                assignId: assignId
            }
        });
        return response;
    };



    this.saveCredentialActivationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/Credential/SaveCredentialActivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getCredentialActivationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/Credential/GetCredentialActivationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getFeeForCredentialActivationOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/Credential/GetFeeForCredentialActivationOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    

}]);