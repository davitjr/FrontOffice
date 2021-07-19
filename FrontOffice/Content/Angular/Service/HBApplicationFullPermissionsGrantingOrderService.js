app.service("hbApplicationFullPermissionsGrantingOrderService", ['$http', function ($http) {

    this.saveHBApplicationFullPermissionsGrantingOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/HBApplicationFullPermissionsGrantingOrder/SaveHBApplicationFullPermissionsGrantingOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }


    this.getHBApplicationFullPermissionsGrantingOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/HBApplicationFullPermissionsGrantingOrder/GetHBApplicationFullPermissionsGrantingOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


}]);