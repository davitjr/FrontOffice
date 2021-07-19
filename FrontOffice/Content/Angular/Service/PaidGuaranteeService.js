app.service("paidGuaranteeService", ['$http', function ($http) {

    this.getPaidGuarantees = function (filter) {
        var response = $http({
            method: "post",
            url: "/PaidGuarantee/GetPaidGuarantees",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getPaidGuarantee = function (productId) {
        var response = $http({
            method: "post",
            url: "/PaidGuarantee/GetPaidGuarantee",
            params: {
                productId: productId
            }
        });
        return response;
    };

}]);