app.service("FTPRateService", ['$http', function ($http) {

    this.saveFTPRateChangeOrder = function (FTPRateOrder) {
        var response = $http({
            method: "post",
            url: "/FTPRateOrder/SaveFTPRateChangeOrder",
            data: JSON.stringify(FTPRateOrder),
            dataType: "json"
        });
        return response;
    };

    this.getFTPRateDetails = function (rateType) {
        var response = $http({
            method: "post",
            url: "/FTPRateOrder/GetFTPRateDetails",
            params: {
                rateType: rateType
            }
        });
        return response;
    };

    this.getFTPRateOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/FTPRateOrder/GetFTPRateOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


}]);