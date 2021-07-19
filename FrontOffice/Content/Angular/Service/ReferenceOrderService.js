app.service("referenceOrderService",['$http', function ($http) {

    this.GetReferenceOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/ReferenceOrder/GetReferenceOrder",
            params: {
                orderId: orderId
            }

        });
        return response;
    };

    this.GetCurrentAccounts = function () {
        var response = $http({
            method: "post",
            url: "/ReferenceOrder/GetFeeAccounts",
        });
        return response;
    };
    this.GetAccounts = function () {
        var response = $http({
            method: "post",
            url: "/ReferenceOrder/GetAllAccounts",
        });
        return response;
    };
    this.SaveReferenceOrder = function (reference) {
        var response = $http({
            method: "post",
            url: "/ReferenceOrder/SaveReferenceOrder",

            data: JSON.stringify(reference),
            dataType: "json"
        });
        return response;
    };
   
    this.referenceApplication = function (reference) {
        var response = $http({
            method: "post",
            url: "/ReferenceOrder/ReferenceApplication",
            responseType: 'arraybuffer',
            data: JSON.stringify(reference),
            dataType: "json"
        });
        return response;
    };


    this.setReceiveDate = function (urgent) {
        var response = $http({
            method: "post",
            url: "/ReferenceOrder/SetReceiveDate",
            params: {
                urgent: urgent
            }

        });
        return response;
    };

    this.getOrderServiceFeeByIndex = function (indexId) {
        var response = $http({
            method: "post",
            url: "/ReferenceOrder/GetOrderServiceFeeByIndex",
            params: {
                indexId: indexId
            }

        });
        return response;
    };
}]);