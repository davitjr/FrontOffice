app.service("loanApplicationService", ['$http', function ($http) {

    this.getLoanApplications = function () {
        var response = $http({
            method: "post",
            url: "/LoanApplication/GetLoanApplications"
        });
        return response;
    };


    this.getLoanApplication = function (productID) {
        var response = $http({
            method: "post",
            url: "/LoanApplication/GetLoanApplication",
            params: {
                productID: productID
            }
        });
        return response;

    };

    this.getLoanApplicationFicoScoreResults = function (productID, requestDate) {
        var response = $http({
            method: "post",
            url: "/LoanApplication/GetLoanApplicationFicoScoreResults",
            params: {
                productID: productID,
                requestDate : requestDate
            }
        });
        return response;

    };

    


    this.getLoanApplicationByDocId = function (docId) {
        var response = $http({
            method: "post",
            url: "/LoanApplication/GetLoanApplicationByDocId",
            params: {
                docId: docId
            }
        });
        return response;

    };

}]);