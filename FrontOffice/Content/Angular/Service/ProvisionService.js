
app.service('provisionService', ['$http', function ($http) {

    this.getProductProvisions = function (productId) {
        var response = $http({
            method: "post",
            url: "/Provision/GetProductProvisions",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getProvisionOwners = function (productId) {
        var response = $http({
            method: "post",
            url: "/Provision/GetProvisionOwners",
            params: {
                productId: productId
            }
        });
        return response;
    };



    this.getCustomerProvisions = function (currency, type, quality) {
        var response = $http({
            method: "post",
            url: "/Provision/GetCustomerProvisions",
            params: {
                currency: currency,
                type: type,
                quality: quality
            }
        });
        return response;
    };


    this.getProvisionLoans = function (provisionId) {
        var response = $http({
            method: "post",
            url: "/Provision/GetProvisionLoans",
            params: {
                provisionId: provisionId
            }
        });
        return response;
    };



}]);