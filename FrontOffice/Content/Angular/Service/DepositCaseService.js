app.service("depositCaseService",['$http', function ($http) {


    this.getDepositCases = function (filter) {
        var response = $http({
            method: "post",
            url: "/DepositCase/GetDepositCases",
            params: {
                filter: filter
            }
        });
        return response;
    };
    this.getDepositCase = function (productId) {
        var response = $http({
            method: "post",
            url: "/DepositCase/GetDepositCase",
            params: {
                productId: productId
            }
        });
        return response;
    };
}]);