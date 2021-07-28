app.service("posLocationService", ['$http', function ($http) {
   this.getCustomerPosLocations = function (filter) {
        var response = $http({
            method: "post",
            url: "/PosLocation/GetCustomerPosLocations",
            params:{
            filter:filter
            }
        });
        return response;
    };

    this.getPosLocation = function (posLocationId) {
        var response = $http({
            method: "get",
            url: "/PosLocation/GetPosLocation",
            params: {
                posLocationId: posLocationId
            }
        });
        return response;
    };


    this.getPosRates = function (terminalId) {
        var response = $http({
            method: "post",
            url: "/PosLocation/GetPosRates",
            params: {
                terminalId: terminalId
            }
        });
        return response;
    };

     this.getPosCashbackRates = function (terminalId) {
        var response = $http({
            method: "post",
            url: "/PosLocation/GetPosCashbackRates",
            params: {
                terminalId: terminalId
            }
        });
        return response;
     };

     this.printPosStatement = function (accountNumber, dateFrom, dateTo, statementType, exportFormat) {
         var response = $http({
             method: "post",
             url: "/PosLocation/PrintPosStatement",
             params: {
                 accountNumber: accountNumber,
                 dateFrom: dateFrom,
                 dateTo: dateTo,
                 statementType : statementType,
                 exportFormat: exportFormat
             }
         });
         return response;
    };

    this.printPosContract = function (id, contractType, contractNumber) {
        var response = $http({
            method: "post",
            url: "/PosLocation/PrintPosContract",
            responseType: 'arraybuffer',
            params: {
                id: id,
                contractType: contractType,
                contractNumber: contractNumber
            }
        });
        return response;
    };

    this.printInternetContract = function (id, contractType, contractNumber) {
        var response = $http({
            method: "post",
            url: "/PosLocation/PrintInternetContract",
            responseType: 'arraybuffer',
            params: {
                id: id,
                contractType: contractType,
                contractNumber: contractNumber
            }
        });
        return response;
    };

    this.printAgreementWithNoCard = function (id, contractNumber, agreementNumber) {
        var response = $http({
            method: "post",
            url: "/PosLocation/PrintAgreementWithNoCard",
            responseType: 'arraybuffer',
            params: {
                id: id,
                agreementNumber: agreementNumber,
                contractNumber: contractNumber
            }
        });
        return response;
    };

    this.printWithoutCardPaymentContract = function (id, contractNumber, agreementNumber) {
        var response = $http({
            method: "post",
            url: "/PosLocation/PrintWithoutCardPaymentContract",
            responseType: 'arraybuffer',
            params: {
                id: id,
                agreementNumber: agreementNumber,
                contractNumber: contractNumber
            }
        });
        return response;
    };    

    this.printCardPaymentAgreementWithNoCard = function (contractNumber, agreementNumber) {
        var response = $http({
            method: "post",
            url: "/PosLocation/PrintCardPaymentAgreementWithNoCard",
            responseType: 'arraybuffer',
            params: {
                contractNumber: contractNumber,
                agreementNumber: agreementNumber
            }
        });
        return response;
    };

    this.printPosActsPDF = function (id, actType, contractNumber, actNumber, merchantId) {
        var response = $http({
            method: "post",
            url: "/PosLocation/PrintPosActsPDF",
            responseType: 'arraybuffer',
            params: {
                id: id,
                actType: actType,
                contractNumber: contractNumber,
                actNumber: actNumber,
                merchantId: merchantId
            }
        });
        return response;
    };

    this.printPosActs = function (id, actType, merchantId) {
        var response = $http({
            method: "post",
            url: "/PosLocation/PrintPosActs",
            responseType: 'arraybuffer',
            params: {
                id: id,
                actType: actType,
                merchantId: merchantId
            }
        });
        return response;
    };    

}]);

