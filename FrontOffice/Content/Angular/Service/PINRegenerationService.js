app.service("pinRegenerationService", ['$http', function ($http) {
    this.getPINRegOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PINRegenerationOrder/GetPINRegenerationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetCustomerValidCards = function () {
        var response = $http({
            method: "post",
            url: "/PINRegenerationOrder/GetValidCards"
        });
        return response;
    }

    this.getCard = function (productId) {
        var response = $http({
            method: "post",
            url: "/PINRegenerationOrder/GetCard",
            params: {
                productId: productId
            }
        });
        return response;
    }

    this.SavePINRegOrder = function (PINRegOrder) {

        var response = $http({
            method: "post",
            url: "/PINRegenerationOrder/SavePINRegenerationOrder",
            data: JSON.stringify(PINRegOrder),
            dataType: "json"
        });
        return response;
    };


}]);