app.service("transferCallsService",['$http', function ($http) {

    this.getTransferList = function (filter) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/GetTransferList",
            data: JSON.stringify(filter),
            dataType: "json"
        });
        return response;
    };

    this.getTransferCallQuality = function () {
        var response = $http({
            method: "post",
            url: "/TransferByCall/GetTransferCallQuality",
        });
        return response;
    };

    this.getTransferTypes = function (isActive) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/GetTransferTypes",
            params: {
                isActive: isActive
            }
        });
        return response;
    };

    this.getTransferSystemCurrency = function (transferSystem) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/GetTransferSystemCurrency",
            params: {
                transferSystem: transferSystem
            }
        });
        return response;
    };


    this.getContractsForTransfersCall = function (customerNumber, accountNumber, cardNumber) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/GetContractsForTransfersCall",
            params: {
                customerNumber: customerNumber,
                accountNumber: accountNumber,
                cardNumber: cardNumber
            }
        });
        return response;
    };

    this.saveTransferCall = function (transferCall) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/SaveTransferCall",
            data: JSON.stringify(transferCall),
            dataType: "json"
        });
        return response;
    };

    this.saveCallTransferChangeOrder = function (transferCall) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/SaveCallTransferChangeOrder",
            data: JSON.stringify(transferCall),
            dataType: "json"
        });
        return response;
    };
 
    this.sendTransfeerCallForPay = function (transferID) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/SendTransfeerCallForPay",
            params: {
                transferID: transferID
            }
        });
        return response;
    };

    this.getTransferDetails = function (transferId) {
        var response = $http({
            method: "post",
            url: "/TransferByCall/GetTransferDetails",
            params: {
                transferId: transferId
            }
        });
        return response;
    };

}]);