app.service("depositCaseOrderService", ['$http', function ($http) {


    this.saveDepositCaseOrder = function (order) {
        var response = $http({
            method: "post",
            url: "DepositCaseOrder/SaveDepositCaseOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getDepositCaseContractEndDate = function (startDate, dayCount) {
        var response = $http({
            method: "post",
            url: "/DepositCaseOrder/GetDepositCaseContractEndDate",
            params: {
                startDate: startDate,
                dayCount: dayCount
            }
        });
        return response;

    };
    this.getDepositCaseOrderContractNumber = function () {
        var response = $http({
            method: "post",
            url: "DepositCaseOrder/GetDepositCaseOrderContractNumber",
            dataType: "json"
        });
        return response;
    };

    this.getDepositCaseMap = function (caseSide) {
        var response = $http({
            method: "post",
            url: "DepositCaseOrder/GetDepositCaseMap",
            dataType: "json",
            params: {
                caseSide: caseSide,
            }
        });
        return response;
    };

    this.getDepositCasePrice = function (caseNumber, contractDuration) {
        var response = $http({
            method: "post",
            url: "DepositCaseOrder/GetDepositCasePrice",
            dataType: "json",
            params: {
                caseNumber: caseNumber,
                contractDuration: contractDuration,
            }
        });
        return response;
    };


    this.getDepositCaseOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/DepositCaseOrder/GetDepositCaseOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getDepositCaseContract = function (productId) {
        var response = $http({
            method: "post",
            url: "/DepositCaseOrder/GetDepositCaseContract",
            responseType: 'arraybuffer',
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getDepositCaseCloseContract = function (productId) {
        var response = $http({
            method: "post",
            url: "/DepositCaseOrder/GetDepositCaseCloseContract",
            responseType: 'arraybuffer',
            params: {
                productId: productId
            }
        });
        return response;
    };


    this.printOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/DepositCaseOrder/PrintOrder",
            responseType: 'arraybuffer',
            data: JSON.stringify(order),
            dataType: "json",
        });
        return response;
    };

}]);