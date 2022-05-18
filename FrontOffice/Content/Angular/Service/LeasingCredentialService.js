app.service("LeasingCredentialService", ['$http', function ($http) {

    this.getCredentials = function (customerNumber,filter) {
        var response = $http({
            method: "post",
            url: "/LeasingCredential/GetCredentials",
            params: {
                customerNumber: customerNumber,
                filter: filter
            }
        });
        return response;
    };

    this.printCustomerCredentialApplication = function (assigneeCustomerNumber, assignId) {
        var response = $http({
            method: "post",
            url: "/LeasingCredential/PrintCustomerCredentialApplication",
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
            url: "/LeasingCredential/SaveCredentialActivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getCredentialActivationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/LeasingCredential/GetCredentialActivationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getFeeForCredentialActivationOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/LeasingCredential/GetFeeForCredentialActivationOrderDetails",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.postNewAndEditedLeasingCredential = function (credential) {
        var response = $http({
            method: "post",
            url: "/LeasingCredential/PostNewAndEditedLeasingCredential",
            data: JSON.stringify(credential),
            dataType: "json"
        });
        return response;
    };

    this.postRemovedCredential = function (credentialId) {
        var response = $http({
            method: "post",
            url: "/LeasingCredential/PostRemovedCredential",
            params: {
                credentialId: credentialId
            }
        });
        return response;
    }

    this.postCredentialsTermination = function (credential) {
        var response = $http({
            method: "post",
            url: "/LeasingCredential/PostCredentialsTermination",
            data: JSON.stringify(credential),
            dataType: "json"
        });
        return response;
    };

    // Հաճախորդի մասին տվյալներ
    this.getLeasingCustomerInfo = function (customerNumber) {
        var response = $http({
            method: "GET",
            url: "/LeasingCredential/GetLeasingCustomerInfo",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };



}]);