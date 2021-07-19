app.service("loanProductOrderService", ['$http', function ($http) {

    this.saveLoanProductOrder = function (order,confirm) {
        var response = $http({
            method: "post",
            url: "LoanProductOrder/SaveLoanProductOrder",
            data: JSON.stringify(order),
            params:{
                confirm:confirm
            },
            dataType: "json"
        });
        return response;
    };

    this.GetLoanOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetLoanOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetCreditLineOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetCreditLineOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetAvailableAmount = function (currency) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetCustomerAvailableAmount",
            params: {
                currency: currency
            }
        });
        return response;
    };

    this.GetProvisionAmount = function (amount,loanCurrency,provisionCurrency) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetProvisionAmount",
            params: {
                amount: amount,
                loanCurrency: loanCurrency,
                provisionCurrency:provisionCurrency
            }
        });
        return response;
    };

    this.GetInterestRate = function (order,cardNumber) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetLoanProductInterestRate",
            data: JSON.stringify(order),
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };

    this.GetDisputeResolutions = function () {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetDisputeResolutions"
        });
        return response;
    };

    this.GetCommunicationTypes = function () {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetCommunicationTypes"
        });
        return response;
    };

    this.getFastOverdraftApplicationEndDate = function (order) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetFastOverdraftApplicationEndDate",
            data: JSON.stringify(order),
            
        });
        return response;
    };


    this.fastOverdraftValidations = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/FastOverdraftValidations",
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };

    this.saveLoanApplicationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/SaveLoanApplicationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getCreditLineProvisionAmount = function (amount, loanCurrency, provisionCurrency, mandatoryPayment, ProductType) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetCreditLineProvisionAmount",
            params: {
                amount: amount,
                loanCurrency: loanCurrency,
                provisionCurrency:provisionCurrency,
                mandatoryPayment: mandatoryPayment,
                creditLineType:ProductType
            }
        });
        return response;
    };

    this.getStatementFixedReceivingType = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/LoanProductOrder/GetStatementFixedReceivingType",
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };



}]);