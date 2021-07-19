app.service("transferCallContractOrderService", ['$http', function ($http) {

    this.saveTransferCallContractOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/TransferCallContractOrder/SaveTransferCallContractOrder",

            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.saveTransferCallContractTerminationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/TransferCallContractOrder/SaveTransferCallContractTerminationOrder",

            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getTransferCallContractOrder= function (orderId) {
        var response = $http({
            method: "post",
            url: "/TransferCallContractOrder/GetTransferCallContractOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };



    this.getTransferCallContractTerminationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/TransferCallContractOrder/GetTransferCallContractTerminationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.transferCallContract = function (contract) {
        var response = $http({
            method: "post",
            url: "/TransferCallContractOrder/TransferCallContract",
            responseType: 'arraybuffer',
            data: JSON.stringify(contract),
            dataType: "json"
        });
        return response;
    };


}]);