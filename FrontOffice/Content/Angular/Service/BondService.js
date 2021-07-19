app.service("bondService", ['$http', function ($http) {


    this.getBondByID = function (id) {
        var response = $http({
            method: "post",
            url: "/Bond/GetBondByID",
            params: {
                ID: id
            }
        });
        return response;
    };

    
    this.getBonds = function (filter) {
        var response = $http({
            method: "post",
            url: "/Bond/GetBonds",
            data: JSON.stringify(filter),
            dataType: "json"
        });
        return response;
    };

    this.getBondPrice = function (bondIssueId) {
        var response = $http({
            method: "post",
            url: "/Bond/getBondPrice",
            params: {
                bondIssueId: bondIssueId
            }
        });
        return response;
    };

    this.getCustomerDepositaryAccount = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Bond/GetCustomerDepositaryAccount",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.hasCustomerDepositaryAccountInBankDB = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Bond/HasCustomerDepositaryAccountInBankDB",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getBondAcquirementApplication = function (bondId, amountCreditDate, amountCreditTime) {
        var response = $http({
            method: "post",
            url: "/Bond/GetBondAcquirementApplication",
            responseType: 'arraybuffer',
            params: {
                bondId: bondId,
                amountCreditDate: amountCreditDate,
                amountCreditTime: amountCreditTime
            }
        });
        return response;
    };

    this.getBondsForDealing = function (filter, bondFilterType) {
        var response = $http({
            method: "post",
            url: "/Bond/GetBondsForDealing",
            data: JSON.stringify(filter),
            dataType: "json",
            params: {
                bondFilterType: bondFilterType
            }
        });
        return response;
    };




}]);