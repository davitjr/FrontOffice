app.service("depositaryAccountService",['$http', function ($http) {



    this.getDepositaryAccountById = function (id) {
        var response = $http({
            method: "post",
            url: "/DepositaryAccount/GetDepositaryAccountById",
            params: {
                id: id
            }
        });
        return response;
    };


}]);
