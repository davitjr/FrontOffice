app.service("cardDeliveryOrderService", ['$http', function ($http) {
    this.DownloadCardDeliveryXMLs = function (DateFrom, DateTo) {
        var response = $http({
            method: "post",
            url: "/CardDelivery/DownloadOrderXMLs",
            params: {
                DateFrom: DateFrom,
                DateTo: DateTo
            }
        });
        return response;
    };
}]);