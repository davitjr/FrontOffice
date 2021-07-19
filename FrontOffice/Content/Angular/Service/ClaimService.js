app.service("claimService",['$http', function ($http) {



    this.getProductClaims = function (productId,productType) {
        var response = $http({
            method: "post",
            url: "/Claim/GetProductClaims",
            params: {
                productId: productId,
                productType: productType
            }
        });
        return response;
    };

    this.changeProblemLoanTaxQuality = function (taxAppId) {
        var response = $http({
            method: "post",
            url: "/Claim/ChangeProblemLoanTaxQuality",
            data: JSON.stringify(taxAppId),
            dataType: "json",
            params: {
                taxAppId: taxAppId
            }
        });
        return response;
    };

    this.getClaimEvents = function (claimNumber) {
        var response = $http({
            method: "post",
            url: "/Claim/GetClaimEvents",
            params: {
                claimNumber: claimNumber
            }
        });
        return response;
    };

    this.getTax = function (claimNumber, eventNumber) {
        var response = $http({
            method: "post",
            url: "/Claim/GetTax",
            params: {
                claimNumber: claimNumber,
                eventNumber: eventNumber
            }
        });
        return response;
    };


    this.getProblemLoanCalculationsDetail = function (claimNumber, eventNumber) {
        var response = $http({
            method: "post",
            url: "/Claim/GetProblemLoanCalculationsDetail",
            params: {
                claimNumber: claimNumber,
                eventNumber: eventNumber
            }
        });
        return response;
    };


}]);