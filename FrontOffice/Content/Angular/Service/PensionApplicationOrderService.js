app.service("pensionApplicationOrderService", ['$http', function ($http) {

    this.savePensionApplicationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/PensionApplicationOrder/SavePensionApplicationOrder",

            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.savePensionApplicationTerminationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/PensionApplicationOrder/SavePensionApplicationTerminationOrder",

            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getPensionApplicationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PensionApplicationOrder/GetPensionApplicationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };



    this.getPensionApplicationTerminationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PensionApplicationOrder/GetPensionApplicationTerminationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.pensionCloseApplication = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/PensionApplication/PensionCloseApplication",
            responseType: 'arraybuffer',
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };


    this.pensionAgreement = function () {
        var response = $http({
            method: "post",
            url: "/PensionApplication/PensionAgreement",
            responseType: 'arraybuffer',
        });
        return response;
    };

}]);