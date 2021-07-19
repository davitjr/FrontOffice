app.service("paidAccreditiveService", ['$http', function ($http) {

    this.getPaidAccreditives = function (filter) {
        var response = $http({
            method: "post",
            url: "/PaidAccreditive/GetPaidAccreditives",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getPaidAccreditive = function (productId) {
        var response = $http({
            method: "post",
            url: "/PaidAccreditive/GetPaidAccreditive",
            params: {
                productId: productId
            }
        });
        return response;
    };

}]);