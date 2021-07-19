app.service("removalOrderService", ['$http', function ($http) {

    this.getRemovableOrderApplication = function (orderId, amount, currency, accountNumber, customerName) {
        var response = $http({
            method: "post",
            url: "/RemovalOrder/GetRemovableOrderApplication",
            responseType: 'arraybuffer',
            params: {
                orderId : orderId,
                amount : amount,
                currency : currency,
                accountNumber : accountNumber,
                customerName : customerName
            }
        });
        return response;
    };

    this.saveRemovalOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/RemovalOrder/SaveRemovalOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getRemovalOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/RemovalOrder/GetRemovalOrderDetails",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

}]);