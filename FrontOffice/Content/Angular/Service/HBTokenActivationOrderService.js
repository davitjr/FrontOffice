app.service("hbTokenActivationOrderSerivce", ['$http', function ($http) {

    this.saveHBTokenTokenActivationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBTokenActivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }


    this.getHBServletRequestOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/HBServletRequestOrder/GetHBServletRequestOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


}]);