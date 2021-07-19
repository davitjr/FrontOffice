app.service('swiftCopyOrderService',['$http', function ($http) {
    this.saveSwiftCopyOrder = function (order) {
        var response = $http({
            method: "post",
            url: "SwiftCopyOrder/SaveSwiftCopyOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });

        return response;
    };
    this.GetSwiftCopyOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/SwiftCopyOrder/GetSwiftCopyOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

}]);