app.service("cardLimitChangeOrderService", ['$http', function ($http) {

    this.GetCardLimitChangeOrderActionTypes = function (order) {
        var response = $http({
            method: "post",
            url: "/CardLimitChangeOrder/GetCardLimitChangeOrderActionTypes",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }

    this.SaveCardLimitChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CardLimitChangeOrder/SaveCardLimitChangeOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }

    this.GetCardLimits = function (ProductId) {
        var response = $http({
            method: "post",
            url: "/CardLimitChangeOrder/GetCardLimits",
            params: {
                ProductId: ProductId,
            },
            dataType: "json"
        });
        return response;
    }

    this.GetCardLimitChangeOrder = function (selectedOrder) {
        var response = $http({
            method: "post",
            url: "/CardLimitChangeOrder/GetCardLimitChangeOrder",
            params: {
                selectedOrder: selectedOrder,
            },
        });
        return response;
    }
}]);