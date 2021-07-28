app.service("printDocumentsService", ['$http', function ($http) {

    ///////////////////////////////////////////////////
    this.getCustomerSignature = function () {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/GetCustomerSignature",
            responseType: 'arraybuffer'
        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.getCustomerKYC = function () {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/PrintCustomerKYC"
        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.getCustomerAllProducts = function (productStatus) {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/PrintCustomerAllProducts",
            responseType: 'arraybuffer',
            params: {
                productStatus: productStatus
        }

        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.getCustomerDocuments = function () {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/PrintCustomerDocuments",
            responseType: 'arraybuffer',

        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.getUnderageCustomerAgreement = function () {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/PrintUnderageCustomerAgreement",
            responseType: 'arraybuffer',

        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.getListOfCustomerDeposits = function () {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/GetListOfCustomerDeposits"

        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.getCustomerMergeApplicationAgreement = function (filialChangeCode) {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/GetCustomerMergeApplicationAgreement",
            responseType: 'arraybuffer',
            params: {
                filialCodeChange: filialChangeCode
            }

        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.getSentSMSMessages = function () {
        var response = $http({
            method: "post",
            url: "/PrintDocuments/GetSentSMSMessages"
        });
        return response;
    };

}]);