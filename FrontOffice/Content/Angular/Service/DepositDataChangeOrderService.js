app.service("depositDataChangeOrderService", ['$http', function ($http) {

    this.saveDepositDataChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "DepositDataChangeOrder/SaveDepositDataChangeOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


    this.getDepositDataChangeOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/DepositDataChangeOrder/GetDepositDataChangeOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

}]);