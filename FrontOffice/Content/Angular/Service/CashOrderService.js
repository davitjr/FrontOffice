app.service('cashOrderService', ['$http', function ($http) {
    this.GetCashOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CashOrder/GetCashOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
    this.SaveCashOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CashOrder/SaveCashOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;


    };

}]);