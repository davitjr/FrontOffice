app.service("creditLineService",['$http', function ($http) {

    this.getCreditLines = function (filter) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLines",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getCreditLineGrafik = function (creditline) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLineGrafik",
            data: JSON.stringify(creditline),
            dataType: "json"
        });
        return response;
    };

    this.getCreditLineGrafikApplication = function (loanFullNumber, startDate) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLineGrafikApplication",
            responseType: 'arraybuffer',
            params: {
                loanFullNumber: loanFullNumber,
                startDate: startDate

            }
        });
        return response;
    };


    this.getCreditLine = function (productId) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLine",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.saveCreditLineTerminationOrder = function (productId) {

        var response = $http({
            method: "post",
            url: "/CreditLine/SaveCreditLineTerminationOrder",
            params: {
                productId: productId,
            }

        });
        return response;

    };

    this.IsCreditLineActivateOnApiGate = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CreditLine/IsCreditLineActivateOnApiGate",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getCreditLineTerminationApplication = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLineTerminationApplication",
            responseType: 'arraybuffer',
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };

    this.getClosedCreditLines = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCardClosedCreditLines",
            params: {
                cardNumber: cardNumber,
            }
        });
        return response;
    };

    this.getCreditLineMainContract = function () {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLineMainContract",
           
        });
        return response;
    };

    this.getCreditLineTerminationOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLineTerminationOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


    this.closedCreditLine = function (productId) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetClosedCreditLine",
            params: {
                productId: productId
            }
        });
        return response;
    };


    this.getDecreaseLoanGrafik = function (loan) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetDecreaseLoanGrafik",
            data: JSON.stringify(loan),
            dataType: "json"
        });
        return response;
    };

    this.getCardsCreditLines = function (filter) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCardsCreditLines",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.sendLoanDigitalContract = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/SendLoanDigitalContract",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.GetCreditLineOrderReport = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/CreditLine/GetCreditLineOrderReport",
            responseType: 'arraybuffer',
            data: JSON.stringify(searchParams)
        });
        return response;
    }
}]);