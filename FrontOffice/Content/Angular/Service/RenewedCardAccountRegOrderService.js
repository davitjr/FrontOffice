app.service("renewedCardAccountRegOrderService", ['$http', function ($http) {

    this.saveRenewedCardAccountRegOrder = function (order) {
        debugger;
        var response = $http({
            method: "post",
            url: "RenewedCardAccountRegOrder/SaveRenewedCardAccountRegOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getRenewedCardAccountRegOrder = function (orderId) {
        debugger;
        var response = $http({
            method: "post",
            url: "/RenewedCardAccountRegOrder/GetRenewedCardAccountRegOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getRenewedCardAccountRegWarnings = function (oldCard) {
        var response = $http({
            method: "post",
            url: "/RenewedCardAccountRegOrder/GetRenewedCardAccountRegWarnings",
            data: JSON.stringify(oldCard),
            dataType: "json"
        });
        return response;
    };

    this.checkCreditLineForRenewedCardAccountRegOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/RenewedCardAccountRegOrder/CheckCreditLineForRenewedCardAccountRegOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
}]);
