app.service("accountFreezeService",['$http', function ($http) {

        
    this.GetAccountFreezeHistory = function (accountNumber, freezeStatus, reasonId) {
        var response = $http({
            method: "post",
            url: "/AccountFreeze/GetAccountFreezeHistory",
            params: {
                accountNumber: accountNumber,
                freezeStatus: freezeStatus,
                reasonId: reasonId
            }
        });
        return response;
    };


    this.GetAccountFreezeDetails = function (freezeId) {
        var response = $http({
            method: "post",
            url: "/AccountFreeze/GetAccountFreezeDetails",
            params: {
                freezeId: freezeId
            }
        });
        return response;
    };

    this.saveAccountFreezeOrder = function (accountFreezeOrder) {
        var response = $http({
            method: "post",
            url: "AccountFreeze/SaveAccountFreezeOrder",
            data: JSON.stringify(accountFreezeOrder),
            dataType: "json"
        });
        return response;
    };

    this.GetAccountFreezeOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/AccountFreeze/GetAccountFreezeOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.saveAccountUnfreezeOrder = function (accountUnfreezeOrder) {
        var response = $http({
            method: "post",
            url: "AccountFreeze/SaveAccountUnfreezeOrder",
            data: JSON.stringify(accountUnfreezeOrder),
            dataType: "json"
        });
        return response;
    };

    this.GetAccountUnfreezeOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/AccountFreeze/GetAccountUnfreezeOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
}]);