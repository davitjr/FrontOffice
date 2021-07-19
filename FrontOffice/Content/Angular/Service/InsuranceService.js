app.service("insuranceService", ['$http', function ($http) {

    this.getInsurances = function (filter) {
        var response = $http({
            method: "post",
            url: "/Insurance/GetInsurances",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getInsurance = function (productId) {
        var response = $http({
            method: "post",
            url: "/Insurance/GetInsurance",
            params: {
                productId: productId
            }
        });
        return response;
    };


    this.getPaidInsurance = function (loanProductId) {
        var response = $http({
            method: "post",
            url: "/Insurance/GetPaidInsurance",
            params: {
                loanProductId: loanProductId
            }
        });
        return response;
    };

    this.deleteInsurance = function (insuranceid) {
        var response = $http({
            method: "post",
            url: "/Insurance/DeleteInsurance",
            params: {
                insuranceid: insuranceid
            }
        });
        return response;
    };

    this.HasPermissionForDelete = function () {
        var response = $http({
            method: "post",
            url: "/Insurance/HasPermissionForDelete"
        });
        return response;
    }

}]);