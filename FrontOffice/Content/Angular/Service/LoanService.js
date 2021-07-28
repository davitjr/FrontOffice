app.service("loanService",['$http', function ($http) {

    this.getLoans = function (filter) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoans",
            params: {
                filter:filter
            }
        });
        return response;
    };

    this.getLoan = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoan",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getCBKursForDate = function (date, currency) {
        var response = $http({
            method: "post",
            url: "/Loan/GetCBKursForDate",
            params: {
                date: date,
                currency: currency
            }
        });
        return response;
    };

    this.getLoanGrafik = function (loan) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanGrafik",
            data: JSON.stringify(loan),
            dataType: "json"
        });
        return response;
    };

    this.getLoanInceptiveGrafik = function (loan) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanInceptiveGrafik",
            data: JSON.stringify(loan),
            dataType: "json"
        });
        return response;
    };

    this.getLoanGrafikApplication = function (loanFullNumber,startDate) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanGrafikApplication",
            params: {
                loanFullNumber: loanFullNumber,
                startDate: startDate
                
            }
        });
        return response;
    };

    this.printLoanStatement = function (accountNumber, dateFrom, dateTo) {
        var response = $http({
            method: "post",
            url: "/Loan/PrintLoanStatement",
            params: {
                accountNumber: accountNumber,
                dateFrom: dateFrom,
                dateTo: dateTo
            }
        });
        return response;
    };

    this.printLoanStatementNew = function (accountNumber, dateFrom, dateTo, appid, lang, exportFormat) {
        var response = $http({
            method: "post",
            url: "/Loan/PrintLoanStatementNew",
            params: {
                accountNumber: accountNumber,
                dateFrom: dateFrom,
                dateTo: dateTo,
                productId: appid,
                lang: lang,
                exportFormat: exportFormat
            }
        });
        return response;
    };
    this.getLoanInterestRateChangeHistoryDetails = function (productID) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanInterestRateChangeHistoryDetails",
            params: {
                productID: productID
            }
        });
        return response;
    };

    this.getLoanMainContract = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanMainContract",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLoanProductProlongations = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanProductProlongations",
            params: {
                productId: productId
            }
        });
        return response;
    };



    this.getProductOtherFees = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetProductOtherFees",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLoanNextRepayment = function (loan) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanNextRepayment",
            data: JSON.stringify(loan),
            dataType: "json"
        });
        return response;
    };


    this.getGoodsDetails = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetGoodsDetails",
            params: {
                productId: productId,
            }
        });
        return response;
    };

    this.printNotMaturedLoans = function (format) {
        var response = $http({
            method: "post",
            url: "/Loan/PrintNotMaturedLoans"
        });
        return response;
    };

    this.getProductAccountFromCreditCode = function (creditCode,productType, accountType) {
        var response = $http({
            method: "post",
            url: "/Loan/GetProductAccountFromCreditCode",
            params: {
                creditCode: creditCode,
                productType: productType,
                accountType: accountType
            }
        });
        return response;
    };

    this.LoanDetailsForCurrentCustomer = function (productId, productType) {
        var response = $http({
            method: "post",
            url: "/Loan/LoanDetailsForCurrentCustomerB",
            params: {
                productId: productId,
                productType: productType
            }
        });
        return response;
    };

    this.postResetEarlyRepaymentFee = function (productId, description, recovery) {
        var response = $http({
            method: "post",
            url: "/Loan/PostResetEarlyRepaymentFee",
            params: {
                productId: productId,
                description: description,
                recovery: recovery
            }
        });
        return response;
    };

    this.getResetEarlyRepaymentFeePermission = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetResetEarlyRepaymentFeePermission",
            params: {
                productId: productId
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

    this.GetLoanDigitalContractStatus = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanDigitalContractStatus",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLoanRepaymentDelayDetails = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanRepaymentDelayDetails",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLoanInterestRateConcessionDetails = function (productId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanInterestRateConcessionDetails",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getTypeOfLoanDelete = function () {
        var response = $http({
            method: "post",
            url: "/Loan/GetTypeOfLoanDelete",
        });
        return response;
    };

    this.saveLoanDeleteReason = function (LoanDeleteOrder) {
        var response = $http({
            method: "post",
            url: "/Loan/SaveAndApproveLoanDeleteOrder",
            data: JSON.stringify(LoanDeleteOrder),
            dataType: "json"
        });
        return response;
    };

    this.getLoanDeleteOrderDetails = function (orderId) {
        var response = $http({
            method: "post",
            url: "/Loan/GetLoanDeleteOrderDetails",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
}]);