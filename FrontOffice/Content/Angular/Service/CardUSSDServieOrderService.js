app.service("cardUSSDServiceOrderService", ['$http', function ($http) {
    this.saveAndApproveCardUSSDServiceOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CardUSSDServiceOrder/SaveAndApproveCardUSSDServiceOrder",
            data: JSON.stringify(order),
            datType: "json"
        });

        return response;
    };

    this.getCardMobilePhone = function (productID) {
        var response = $http({
            method: "post",
            url: "/CardUSSDServiceOrder/GetCardMobilePhone",
            params: {
                productID: productID
            }
        });

        return response;
    };

    this.getCardUSSDServiceOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CardUSSDServiceOrder/getCardUSSDServiceOrder",
            params: {
                orderID: orderID
            }
        });

        return response;
    };

    this.getCardUSSDServiceHistory = function (productid) {
        var response = $http({
            method: "post",
            url: "/CardUSSDServiceOrder/GetCardUSSDServiceHistory",
            params: {
                productid: productid
            }
        });
        return response;
    };
    
}]);