app.service("bondAmountChargeOrderService", ['$http', function ($http) {

    this.saveBondAmountChargeOrder = function (bondAmountChargeOrder) {
        var response = $http({
            method: "post",
            url: "BondAmountChargeOrder/SaveBondAmountChargeOrder",
            data: JSON.stringify(bondAmountChargeOrder),
            dataType: "json"
        });
        return response;
    };


    this.getBondAmountChargeOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/BondAmountChargeOrder/GetBondAmountChargeOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };



}]);