app.service("receivedBankMailTransfersService", ['$http', function ($http) {

    this.getTransferList = function (filter) {
        var response = $http({
            method: "post",
            url: "/ReceivedBankMailTransfers/GetTransferList",
            data: JSON.stringify(filter),
            dataType: "json"
        });
        return response;
    };


    this.getTransfer = function (transferID) {
        var response = $http({
            method: "post",
            url: "/ReceivedBankMailTransfers/GetTransfer",
            params: {
                transferID: transferID
            }
        });
        return response;
    };

    this.getTransfer = function (transferID) {
        var response = $http({
            method: "post",
            url: "/ReceivedBankMailTransfers/GetTransfer",
            params: {
                transferID: transferID
            }
        });
        return response;
    };
    this.printTransfer = function (Id) {
        var response = $http({
            method: "post",
            url: "/ReceivedBankMailTransfers/PrintTransfer",
            params: {
                Id: Id
            },
            //data: JSON.stringify(Id),
            dataType: "json",

        });
        return response;
    };
    
}]);