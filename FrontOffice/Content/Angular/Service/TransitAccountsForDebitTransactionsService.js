app.service("transitAccountsForDebitTransactionsService", ['$http', function ($http) {

    this.saveTransitAccountForDebitTransactions = function (account, confirm) {
        var response = $http({
            method: "post",
            url: "/TransitAccountsForDebitTransactions/SaveTransitAccountForDebitTransactions",
            data: JSON.stringify(account),
            dataType: "json",
            params: {
                confirm: confirm
            }

        });
        return response;
    };

    this.updateTransitAccountForDebitTransactions = function (account) {
        var response = $http({
            method: "post",
            url: "/TransitAccountsForDebitTransactions/UpdateTransitAccountForDebitTransactions",
            data: JSON.stringify(account),
            dataType: "json",
        });
        return response;
    };


    this.getAllTransitAccountsForDebitTransactions = function (quality) {
        var response = $http({
            method: "post",
            url: "/TransitAccountsForDebitTransactions/GetAllTransitAccountsForDebitTransactions",
            params: {
                quality: quality
            }
        });
        return response;
    };

    this.closeTransitAccountForDebitTransactions = function (account) {
        var response = $http({
            method: "post",
            url: "/TransitAccountsForDebitTransactions/CloseTransitAccountForDebitTransactions",
            data: JSON.stringify(account),
            dataType: "json"
        });
        return response;
    };

    this.getTransitAccountsForDebitTransactions = function () {

        var response = $http({
            method: "post",
            url: "/TransitAccountsForDebitTransactions/GetTransitAccountsForDebitTransactions",
            async: true
        });
        return response;
    };

    this.reopenTransitAccountForDebitTransactions = function (account) {
        var response = $http({
            method: "post",
            url: "/TransitAccountsForDebitTransactions/ReopenTransitAccountForDebitTransactions",
            data: JSON.stringify(account),
            dataType: "json"
        });
        return response;
    };

}]);