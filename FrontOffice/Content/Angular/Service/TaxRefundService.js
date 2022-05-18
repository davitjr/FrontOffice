app.service("taxRefundService",['$http', function ($http) {

    this.getLoanBorrowers = function (productId) {
        var response = $http({
            method: "post",
            url: "/TaxRefund/GetLoanBorrowers",
            params: {
                productId: productId,
            }
        });
        return response;
    };
    
    this.saveTaxRefundAgreementDetails = function (customerNumber, productId, agreementExistence) {
        var response = $http({
            method: "post",
            url: "/TaxRefund/SaveTaxRefundAgreementDetails",
            params: {
                customerNumber: customerNumber,
                productId: productId,
                agreementExistence: agreementExistence
            }
        });
        return response;
    };

    this.getTaxRefundAgreementHistory = function (agreementId) {
        var response = $http({
            method: "post",
            url: "/TaxRefund/GetTaxRefundAgreementHistory",
            params: {
                agreementId: agreementId
            }
        });
        return response;
    };

    this.sendTaxRefundRequest = function (requestParams) {
        var response = $http({
            method: "post",
            url: "/TaxRefund/SendTaxRefundRequest",
            data: JSON.stringify(requestParams),
            dataType: "json"
        });
        return response;
    };

}]);