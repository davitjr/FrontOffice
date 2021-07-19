app.service("bondQualityUpdateOrderService",['$http', function ($http) {

    this.saveBondQualityUpdateOrder = function (bondQualityUpdateOrder) {
        var response = $http({
            method: "post",
            url: "BondQualityUpdateOrder/SaveBondQualityUpdateOrder",
            data: JSON.stringify(bondQualityUpdateOrder),
            dataType: "json"
        });
        return response;
    };


    this.getBondQualityUpdateOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/BondQualityUpdateOrder/GetBondQualityUpdateOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


}]);