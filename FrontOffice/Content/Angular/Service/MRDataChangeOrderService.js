app.service("MRDataChangeOrderService", ['$http', function ($http) {

    this.postMRDataChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/MRDataChangeOrder/PostMRDataChangeOrder",
            data: order,
            dataType: "json"
        });
        return response;
    };

}]);