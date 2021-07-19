app.service("problemLoanTaxesService", ['$http', function ($http) {

    this.getProblemLoanTaxesList = function (problemLoanTaxFilter, Cache) {
        var response = $http({
            method: "post",
            url: "/ProblemLoanTaxes/SearchProblemLoanTax",
            data: JSON.stringify(problemLoanTaxFilter),
            params: {
                Cache: Cache,
            }
        });
        return response;
    };

    this.getProblemLoanTaxDetails = function (ClaimNumber) {
        var response = $http({
            method: "post",
            url: "/ProblemLoanTaxes/GetProblemLoanTaxDetails",
            params: {
                ClaimNumber: ClaimNumber,
            }
        });
        return response;
    };

    this.getProblemLoanTaxesLenght = function () {
        var response = $http({
            method: "post",
            url: "/ProblemLoanTaxes/GetProblemLoanTaxesLenght",
        });
        return response;
    };
}]);