app.service("card3DSecureOrderService", ['$http', function ($http) {
    this.saveCard3DSecureServiceOrder = function (order) {
        var response = $http({
            method: "post",
            url: "Card3DSecureServiceOrder/SaveCard3DSecureServiceOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getCard3DSecureServiceHistory = function (productid) {
        var response = $http({
            method: "post",
            url: "/Card3DSecureServiceOrder/GetCard3DSecureServiceHistory",
            params: {
                productid: productid
            }
        });
        return response;
    };

    this.printCard3DSecureReport = function (card3DSecureService) {
        var response = $http({
            method: "post",
            url: "/Card3DSecureServiceOrder/PrintCard3DSecureReport",
            responseType: 'arraybuffer',
            data: JSON.stringify(card3DSecureService),
            dataType: "json"
        });
        return response;
    };
}]);
