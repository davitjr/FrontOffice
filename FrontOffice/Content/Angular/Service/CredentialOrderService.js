app.service("credentialOrderService", ['$http', function ($http) {   

    this.GetCredentialOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/GetCredentialOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetAllOperations = function () {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/GetAllOperations",
        });
        return response;
    };

    this.GetAssigneeOperationTypes = function () {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/GetAssigneeOperationTypes"
        });
        return response;
    };

    this.GetAssigneeOperationGroupTypes = function () {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/GetAssigneeOperationGroupTypes"
        });
        return response;
    };

    this.saveCredentialOrder = function (credentialOrder) {
        var response = $http({
            method: "post",
            url: "CredentialOrder/SaveCredentialOrder",
            data: JSON.stringify(credentialOrder),
            dataType: "json"
        });
        return response;
    };

    this.saveCredentialTerminationOrder = function (credential) {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/SaveCredentialTerminationOrder",
            data: JSON.stringify(credential),
            dataType: "json"
        });
        return response;
    };

    this.GetCredentialClosingWarnings = function (assignId) {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/GetCredentialClosingWarnings",
            params: {
                assignId: assignId
            }
        });
        return response;
    };

    this.saveCredentialDeleteOrder = function (credential) {        
        var response = $http({
            method: "post",
            url: "/CredentialOrder/SaveCredentialDeleteOrder",           
            data: JSON.stringify(credential),
            dataType: "json"
        });
        return response;
    };

    this.InitOperationGroupList = function (typeOfCustomer, credentialType) {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/InitOperationGroupList",
            params: {
                typeOfCustomer: typeOfCustomer,
                credentialType: credentialType
            }
        });
        return response;
    };

    this.InitAssigneeOperationTypes = function (groupId, typeOfCustomer, credentialType) {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/InitAssigneeOperationTypes",
            params: {
                groupId: groupId,
                typeOfCustomer: typeOfCustomer, 
                credentialType: credentialType
            }
        });
        return response;
    };

    this.InitAccounts = function (operationType) {
        var response = $http({
            method: "post",
            url: "/Credential/GetAccountsForCredential",
            params: {
                operationType: operationType
            }
        });
        return response;
    };


    this.getNextCredentialDocumentNumber = function () {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/GetNextCredentialDocumentNumber",
        });
        return response;
    };


    this.saveAssigneeIdentificationOrder = function (assigneeIdentificationOrder) {
        var response = $http({
            method: "post",
            url: "CredentialOrder/SaveAssigneeIdentificationOrder",
            data: JSON.stringify(assigneeIdentificationOrder),
            dataType: "json"
        });
        return response;
    };

    this.GetAssigneeIdentificationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CredentialOrder/GetAssigneeIdentificationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
}]);