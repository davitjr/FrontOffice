app.service('customerDataOrderService',['$http', function ($http) {

    this.GetCustomerDataOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CustomerDataOrder/GetCustomerDataOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
    this.SaveCustomerDataOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CustomerDataOrder/SaveCustomerDataOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };



}]);