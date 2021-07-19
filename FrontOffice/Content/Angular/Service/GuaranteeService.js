app.service("guaranteeService", ['$http', function ($http) {

    this.getGuarantees = function (filter) {
        var response = $http({
            method: "post",
            url: "/Guarantee/GetGuarantees",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getGuarantee = function (productId) {
        var response = $http({
            method: "post",
            url: "/Guarantee/GetGuarantee",
            params: {
                productId: productId
            }
        });
        return response;
    };


    this.getGivenGuaranteeReductions = function (productId) {
        var response = $http({
            method: "post",
            url: "/Guarantee/GetGivenGuaranteeReductions",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.saveGuaranteeTerminationOrder = function (productId) {

        var response = $http({
            method: "post",
            url: "/Guarantee/SaveGuaranteeTerminationOrder",
            params: {
                productId: productId,
            }

        });
        return response;

    };

    this.getGuaranteeTerminationOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Guarantee/GetGuaranteeTerminationOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };



}]);