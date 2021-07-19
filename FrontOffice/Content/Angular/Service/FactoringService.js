app.service("factoringService", ['$http', function ($http) {

    this.getFactorings = function (filter) {
        var response = $http({
            method: "post",
            url: "/Factoring/GetFactorings",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getFactoring = function (productId) {
        var response = $http({
            method: "post",
            url: "/Factoring/GetFactoring",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.saveFactoringTerminationOrder = function (productId) {

        var response = $http({
            method: "post",
            url: "/Factoring/SaveFactoringTerminationOrder",
            params: {
                productId: productId,
            }

        });
        return response;

    };

    this.getFactoringTerminationOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Factoring/GetFactoringTerminationOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
	};


}]);