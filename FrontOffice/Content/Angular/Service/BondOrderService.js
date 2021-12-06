app.service("bondOrderService",['$http', function ($http) {

    this.saveBondOrder = function (bondOrder) {
        var response = $http({
            method: "post",
            url: "BondOrder/SaveBondOrder",
            data: JSON.stringify(bondOrder),
            dataType: "json"
        });
        return response;
    };


    this.getBondOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetBondOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


    this.getAccountsForCouponRepayment = function () {

        var response = $http({
            method: "post",
            url: "BondOrder/GetAccountsForCouponRepayment",
        });
        return response;

    };

    this.getAccountsForBondRepayment = function (currency) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetAccountsForBondRepayment",
            params: {
                currency: currency
            }
        });
        return response;
    };

    this.printBondCustomerCard = function (accountNumber,accountNumberForBond) {
        var response = $http({
            method: "post",
            url: "/BondOrder/PrintBondCustomerCard",
            params: {
                accountNumber: accountNumber,                
                accountNumberForBond: accountNumberForBond

            }
        });
        return response;
    };

    
    this.getBondContract = function (accountNumberForCoupon, accountNumberForBond, contractDate) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetBondContract",
            responseType: 'arraybuffer',
            params: {
                accountNumberForCoupon: accountNumberForCoupon,
                accountNumberForBond: accountNumberForBond,
                contractDate: contractDate
            }
        });
        return response;
    };

    this.getBondOrderIssueSeria = function (bondIssueId) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetBondOrderIssueSeria",
            params: {
                bondIssueId: bondIssueId
            }
        });
        return response;
    };

    this.checkAndSaveDepositoryAccount = function (bondOrder) {
        var response = $http({
            method: "post",
            url: "/BondOrder/CheckAndSaveDepositoryAccount",
            data: JSON.stringify(bondOrder),
            dataType: "json"
        });
        return response;
    };

    this.getStockPurchaseApplication = function (bondId, customerNumber) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetStockPurchaseApplication",
            params: {
                bondId: bondId,
                customerNumber: customerNumber
            },
            responseType: 'arraybuffer'
        });
        return response;
    };

    this.checkAndGetDepositaryAccount = function () {
        var response = $http({
            method: "post",
            url: "/BondOrder/CheckAndGetDepositaryAccount"
        });
        return response;
    };

    this.getAccountsForStock = function () {

        var response = $http({
            method: "post",
            url: "BondOrder/GetAccountsForStock",
        });
        return response;

    };

    this.getConvertationDetails = function (order) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetConvertationDetails",
            data: JSON.stringify(order),
            dataType: "json",

        });
        return response;
    };

    this.getBuyKurs = function (currency) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetBuyKursForDate",
            params: {
                currency: currency
            }
        });
        return response;
    };

    this.getPaymentOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/BondOrder/GetPaymentOrderDetails",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };


}]);