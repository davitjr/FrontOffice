app.service("paidFactoringService", ['$http', function ($http) {

    this.getPaidFactorings = function (filter) {
        var response = $http({
            method: "post",
            url: "/PaidFactoring/GetPaidFactorings",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getPaidFactoring = function (productId) {
        var response = $http({
            method: "post",
            url: "/PaidFactoring/GetPaidFactoring",
            params: {
                productId: productId
            }
        });
        return response;
    };

}]);