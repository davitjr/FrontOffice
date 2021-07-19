app.service("accreditiveService", ['$http', function ($http) {

    this.getAccreditives = function (filter) {
        var response = $http({
            method: "post",
            url: "/Accreditive/GetAccreditives",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getAccreditive = function (productId) {
        var response = $http({
            method: "post",
            url: "/Accreditive/GetAccreditive",
            params: {
                productId: productId
            }
        });
        return response;
    };


    this.saveAccreditiveTerminationOrder = function (productId) {

        var response = $http({
            method: "post",
            url: "/Accreditive/SaveAccreditiveTerminationOrder",
            params: {
                productId: productId,
            }

        });
        return response;

    };

}]);