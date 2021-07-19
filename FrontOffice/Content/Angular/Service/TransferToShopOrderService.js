app.service("transferToShopOrderService", ['$http', function ($http) {


    this.saveTransferToShopOrder = function (order) {
        var response = $http({
            method: "post",
            url: "TransferToShopOrder/SaveTransferToShopOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });

        return response;
    };


    this.getShopAccount = function (productId) {
        var response = $http({
            method: "post",
            url: "/TransferToShopOrder/GetShopAccount",

            params: {
                productId: productId,
            }
        });
        return response;
    };


    this.getTransferToShopOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/TransferToShopOrder/GetTransferToShopOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    }


    this.getShopTransferAmount = function (productId) {
        var response = $http({
            method: "post",
            url: "/TransferToShopOrder/GetShopTransferAmount",

            params: {
                productId: productId,
            }
        });
        return response;
    };

}]);