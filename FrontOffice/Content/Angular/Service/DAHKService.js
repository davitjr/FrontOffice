app.service("DAHKService", ['$http', function ($http) {

    this.getDahkBlockages = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetDahkBlockages",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };


    this.getDahkCollections = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetDahkCollections",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getCurrentInquestDetails = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetCurrentInquestDetails",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getAccountFreezeDetails = function (customerNumber, inquestId, accountNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetAccountDAHKFreezeDetails",
            params: {
                customerNumber: customerNumber,
                inquestId: inquestId,
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.getDAHKproductAccounts = function (accountnumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetDAHKproductAccounts",
            params: {
                accountnumber: accountnumber
            }
        });
        return response;
    };

    this.makeAvailable = function (freezeIdList, availableAmount) {
        var response = $http({
            method: "post",
            url: "/DAHK/MakeAvailable",
            dataType: "json",
            data: JSON.stringify(freezeIdList),
            params: {
                availableAmount: availableAmount
            }
        });
        return response;

    };

    this.getAccounts = function (customerNumber) {     
        var response = $http({
            method: "post",
            url: "/DAHK/GetAllAccounts",
            params: { customerNumber: customerNumber }
        });
        return response;
    };

    this.getTransitAccountNumberFromCardAccount = function (cardAccountNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetTransitAccountNumberFromCardAccount",
            params: { cardAccountNumber: cardAccountNumber }
        });
        return response;
    };

    this.blockingAmountFromAvailableAccount = function (accountNumber, blockingAmount, inquestDetailsList) {
        var response = $http({
            method: "post",
            url: "/DAHK/BlockingAmountFromAvailableAccount", 
            dataType: "json",
            data: JSON.stringify(inquestDetailsList),
            params: {
                accountNumber: accountNumber,
                blockingAmount: blockingAmount                
            }
        });
        return response;
    };

    this.getFreezedAccounts = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetFreezedAccounts",
            params: { customerNumber: customerNumber }
        });
        return response;

    };


    this.getDahkEmployers = function (customerNumber, quality, inquestId) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetDahkEmployers",
            params: {
                customerNumber: customerNumber,
                quality: quality,
                inquestId: inquestId
            }
        });
        return response;
    };


    this.getDahkAmountTotals = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/GetDahkAmountTotals",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.amountAvailabilitySetting = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/DAHK/AmountAvailabilitySetting",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

}]);