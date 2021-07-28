app.service("hbApplicationService",['$http', function ($http) {

    this.getHBApplication = function () {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/GetHBApplication"

        });
        return response;
    };

    this.getHBApplicationShablon = function () {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/GetHBApplicationShablon"

        });
        return response;
    };


    this.getHBApplicationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/GetHBApplicationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.saveHBApplicationOrder = function (order, hbApplicationUpdate) {
        var data = { order: order, users: hbApplicationUpdate.Users, tokens: hbApplicationUpdate.Tokens }
        var response = $http({
            method: "post",
            url: "HBApplicationOrder/SaveHBApplicationOrder",
            data: JSON.stringify(data),
            dataType: "json"
        });
        return response;
    };


    this.printOnlineRequestLegal = function () {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/PrintOnlineRequestLegal",
            responseType: 'arraybuffer'
            });
        return response;
    };

    this.printOnlineDeactivateTokenRequestPhysical = function () {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/PrintOnlineDeactivateTokenRequestPhysical",
            responseType: 'arraybuffer',
        });
        return response;
    };

    this.printOnlineDeactivateRequestLegal = function () {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/PrintOnlineDeactivateRequestLegal",
            responseType: 'arraybuffer',
           });
        return response;
    };

    this.printOnlineContractPhysical = function (filialCode, contractNumber, contractDate, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/PrintOnlineContractPhysical",
            responseType: 'arraybuffer',
            params: {
                filialCode: filialCode,
                contractNumber: contractNumber,
                contractDate: contractDate,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.printOnlineContractLegal = function (filialCode, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/PrintOnlineContractLegal",
            responseType: 'arraybuffer',
            params: {
                filialCode: filialCode,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };
    this.printOnlineAgreementPhysical = function (filialCode, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/PrintOnlineAgreementPhysical",
            responseType: 'arraybuffer',
            params: {
                filialCode: filialCode,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };
    this.printOnlineAgreementLegal = function (filialCode, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/HBApplicationOrder/PrintOnlineAgreementLegal",
            responseType: 'arraybuffer',
            params: {
                filialCode: filialCode,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };
}]);