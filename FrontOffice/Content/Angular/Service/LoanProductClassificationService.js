app.service("loanProductClassificationService", ['$http', function ($http) {

    this.getLoanProductClassifications = function (products, dateFrom) {
        var response = $http({
            method: "post",
            url: "/LoanProductClassification/GetLoanProductClassifications",
            params: {
                products: products,
                dateFrom: dateFrom
            }
        });
        return response;
    };

}]);