app.service("pensionApplicationService", ['$http', function ($http) {

    this.getPensionApplicationHistory = function (filter) {

        var response = $http({
            method: "post",
            url: "/PensionApplication/GetPensionApplicationHistory",
            params: {
                filter: filter
            }
        });
        return response;
    };



    this.accountNoticeForm = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/PensionApplication/AccountNoticeForm",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.pensionCloseApplicationContract = function (contractId) {
        var response = $http({
            method: "post",
            url: "/PensionApplication/PensionCloseApplicationContract",
            params: {
                contractId: contractId
            }
        });
        return response;
    };


  



}]);