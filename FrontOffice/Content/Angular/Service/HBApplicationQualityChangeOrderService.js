app.service("hbApplicationQualityChangeOrderService", ['$http', function ($http) {

    this.saveHBApplicationQualityChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/HBApplicationQualityChangeOrder/SaveHBApplicationQualityChangeOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }



    this.getHBApplicationQualityChangeOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/HBApplicationQualityChangeOrder/GetHBApplicationQualityChangeOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };





}]);