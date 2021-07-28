app.service("loanProductActivationOrderService", ['$http', function ($http) {

    this.saveLoanProductActivationOrder = function (order, confirm) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/SaveLoanProductActivationOrder",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                confirm: confirm
            }
        });
        return response;
    };

    this.GetLoanProductActivationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetLoanProductActivationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.IsCreditLineActivateOnApiGate = function (orderId) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/IsCreditLineActivateOnApiGate",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetServiceFee = function (productId,withTax) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetServiceFee",
            params: {
                productId: productId,
                withTax:withTax
            }
        });
        return response;
    };

    this.getConsumeLoanContract = function (productId, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetConsumeLoanContract",
            responseType: 'arraybuffer',
            params: {
                productId: productId,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.getDepositLoanGrafik = function (productId, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetDepositLoanGrafik",
            responseType: 'arraybuffer',
            params: {
                productId: productId,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.getDepositLoanProvisionDetails = function (productId, fillialCode, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetDepositLoanProvisionDetails",
            responseType: 'arraybuffer',
            params: {
                productId: productId,
                fillialCode: fillialCode,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };
    this.getLoanTerms = function (productId) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetLoanTerms",
            responseType: 'arraybuffer',
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getDepositCardCreditLineContract = function (productId, cardtype, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetDepositCardCreditLineContract",
            responseType: 'arraybuffer',
            params: {
                productId: productId,
                cardtype: cardtype,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.getCreditLineTerms = function (productId) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetCreditLineTerms",
            responseType: 'arraybuffer',
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLoanProductActivationWarnings = function (productId,productType) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetLoanProductActivationWarnings",
            params: {
                productId: productId,
                productType:productType
            }
        });
        return response;
    };


    this.getLoanTotalInsuranceAmount = function (productId) {
        var response = $http({
            method: "post",
            url: "/LoanProductActivationOrder/GetLoanTotalInsuranceAmount",
            params: {
                productId: productId
            }
        });
        return response;
    };
}]);