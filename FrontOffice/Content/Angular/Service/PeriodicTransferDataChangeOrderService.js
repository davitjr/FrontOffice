app.service("periodicTransferDataChangeOrderService", ['$http', function ($http) {
    this.savePeriodicTransferDataChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransferDataChangeOrder/SavePeriodicTransferDataChangeOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
    this.getPeriodicDataChangeOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PeriodicTransferDataChangeOrder/GetPeriodicDataChangeOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
}]);