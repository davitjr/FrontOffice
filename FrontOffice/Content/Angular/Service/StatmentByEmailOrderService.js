app.service('statmentByEmailOrderService',['$http', function ($http) {

    this.GetStatmentByEmailOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/StatmentByEmailOrder/GetStatmentByEmailOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
    this.SaveStatmentByEmailOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/StatmentByEmailOrder/SaveStatmentByEmailOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };



}]);