app.service("CreditCommitmentForgivenessOrderService", ['$http', function ($http) {

    this.getForgivableLoanCommitment = function (productId, loanType, creditCommitmentForgiveness) {
        var response = $http({
            method: "post",
            url: "/CreditCommitmentForgivenessOrder/GetForgivableLoanCommitment",
            data: JSON.stringify(creditCommitmentForgiveness),
            params: {
                productId: productId,
                loanType: loanType,
            }
        });
        return response;
    };

    this.saveForgivableLoanCommitment = function (creditCommitmentForgiveness) {
        var response = $http({
            method: "post",
            url: "/CreditCommitmentForgivenessOrder/SaveForgivableLoanCommitment",
            data: JSON.stringify(creditCommitmentForgiveness),
            dataType: "json"
        });
        return response;
    };

    this.getCreditCommitmentForgiveness = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CreditCommitmentForgivenessOrder/GetCreditCommitmentForgiveness",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


    this.getTaxForForgiveness = function (capital, RebetType, currency) {
        var response = $http({
            method: "post",
            url: "/CreditCommitmentForgivenessOrder/GetTaxForForgiveness",
            params: {
                capital: capital,
                RebetType: RebetType,
                currency: currency

            }
        });
        return response;
    };


}]);