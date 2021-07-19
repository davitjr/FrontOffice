app.service("periodicTransferService",['$http', function ($http) {

    this.getPeriodicTransfers = function (filter) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/GetPeriodicTransfers",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getPeriodicTransfer = function (productID) {

        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/GetPeriodicTransfer",
            params: {
                productID: productID
            }
        });
        return response;

    };
    this.GetTransfersHistory = function (productID, dateFrom, dateTo) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/GetTransfersHistory",
            params: {
                productID: productID,
                dateFrom: dateFrom,
                dateTo: dateTo
            }
        });
        return response;
    };

    this.getPeriodicTransferDetails = function (productId) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/GetPeriodicTransferDetails",
            responseType: 'arraybuffer',
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getPeriodicTransferClosingDetails = function (productId) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/GetPeriodicTransferClosingDetails",
            responseType: 'arraybuffer',
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getPeriodicSWIFTStatementTransferDetails = function (productId) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/GetPeriodicSWIFTStatementTransferDetails",
            responseType: 'arraybuffer',
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.savePeriodicTerminationOrder = function (periodic) {

        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/SavePeriodicTerminationOrder",
            data: JSON.stringify(periodic),
            dataType: "json"

        });
        return response;

    };

    this.getPeriodicTerminationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransfer/GetPeriodicTerminationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

}]);