app.service("loanInterestRateConcessionService", ['$http', function ($http) {

    this.saveLoanInterestRateConcession = function (order) {
        var response = $http({
            method: "post",
            url: "/LoanInterestRateConcession/SaveLoanInterestRateConcession",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getLoanInterestRateConcessionOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/LoanInterestRateConcession/GetLoanInterestRateConcessionOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
}]);