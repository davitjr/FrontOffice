app.service("preOrderService",['$http', function ($http) {


    this.getSearchedPreOrderDetails = function (searchParams) {

        var response = $http({
            method: "post",
            url: "/PreOrder/GetSearchedPreOrderDetails",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });
        return response;
    };


}]);