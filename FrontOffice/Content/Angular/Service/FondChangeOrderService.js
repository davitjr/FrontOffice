app.service("fondChangeOrderService",['$http', function ($http) {

    this.saveFondChangeOrder = function (fondOrder) {
        var response = $http({
            method: "post",
            url: "/FondOrder/SaveFondChangeOrder",
            data: JSON.stringify(fondOrder),
            dataType: "json"
        });
        return response;
    };

    //this.getFondOrder = function (orderID) {
    //    var response = $http({
    //        method: "post",
    //        url: "/FondOrder/GetFondOrder",
    //        params: {
    //            orderID: orderID
    //        }
    //    });
    //    return response;
    //};

    
    
}]);