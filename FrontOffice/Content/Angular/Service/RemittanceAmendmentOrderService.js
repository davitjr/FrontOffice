app.service("remittanceAmendmentOrderService", ['$http', function ($http) {

    this.saveRemittanceAmendmentOrder = function (remittanceAmendmentOrder) {
        var response = $http({
            method: "post",
            url: "RemittanceAmendmentOrder/SaveRemittanceAmendmentOrder",
            data: JSON.stringify(remittanceAmendmentOrder),
            dataType: "json"
        });
        return response;
    };


    this.getRemittanceAmendmentOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "RemittanceAmendmentOrder/GetRemittanceAmendmentOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.approveRemittanceAmendmentOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "RemittanceAmendmentOrder/ApproveRemittanceAmendmentOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.getRemittanceAmendmentApplication = function (order, recipient) {
        var response = $http({
            method: "post",
            url: "/RemittanceAmendmentOrder/GetRemittanceAmendmentApplication",
            responseType: 'arraybuffer',
            data: JSON.stringify(order),
            params: {
                recipient: recipient
            }
        });
        return response;
    };

    this.getRemittanceDetails = function (URN) {
        var response = $http({
            method: "post",
            url: "Remittance/GetRemittanceDetailsByURN",
            params: {
                URN: URN
            }
        });
        return response;
    };
    
}]);