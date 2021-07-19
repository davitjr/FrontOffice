app.service("fondOrderService",['$http', function ($http) {

    this.saveFondOrder = function (fondOrder) {
        var response = $http({
            method: "post",
            url: "/FondOrder/SaveFondOrder",
            data: JSON.stringify(fondOrder),
            dataType: "json"
        });
        return response;
    };

    this.getFondOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/FondOrder/GetFondOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


    
}]);