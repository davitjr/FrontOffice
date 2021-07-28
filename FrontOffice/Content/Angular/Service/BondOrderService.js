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

    
}]);