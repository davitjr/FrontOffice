app.service("transferCallContractDetailsService", ['$http', function ($http) {

    this.getTransferCallContracts = function () {
        var response = $http({
            method: "post",
            url: "/TransferCallContractDetails/GetTransferCallContractsDetails"

        });
        return response;
    };



    this.getTransferCallContract = function (contractId) {
        var response = $http({
            method: "post",
            url: "/TransferCallContractDetails/GetTransferCallContractDetails",
            params: {
                contractId: contractId
            }
        });
        return response;
    };


}]);