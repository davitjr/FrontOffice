app.service("depositOrderService",['$http', function ($http) {
    this.getAccountsForPercentAccount = function (order) {

        var response = $http({
            method: "post",
            url: "DepositOrder/GetAccountsForPercentAccount",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;

    };

    this.GetAccountsForNewDeposit = function (order) {

        var response = $http({


            method: "post",
            url: "DepositOrder/GetAccountsForNewDeposit",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;

    };

    this.GetThirdPersons = function () {

        var response = $http({
            method: "post",
            url: "DepositOrder/GetThirdPersons",

        });
        return response;

    };

    this.GetThirdPersonsBirthDate = function (customerNumber) {

        var response = $http({
            method: "post",
            url: "DepositOrder/GetThirdPersonsBirthDate",
            params: {
                customerNumber: customerNumber,
            }
        });
        return response;

    };

    this.getDepositTypeCurrency = function (depositType) {
        var response = $http({
            method: "post",
            url: "/DepositOrder/GetDepositTypeCurrency",
            params: {
                depositType: depositType,
            }
        });
        return response;
    };

    this.saveDepositOrder = function (depositOrder) {
        var response = $http({
            method: "post",
            url: "DepositOrder/SaveDepositOrder",
            data: JSON.stringify(depositOrder),
            dataType: "json"
        });
        return response;
    };
    this.GetDepositCondition = function (depositOrder) {
        var response = $http({
            method: "post",
            url: "DepositOrder/GetDepositCondition",
            data: JSON.stringify(depositOrder),
            dataType: "json"
        });
        return response;
    };

    


    this.GetDepositOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/DepositOrder/GetDepositOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };



    this.GetClosedDepositAccountList = function (order) {

        var response = $http({
            method: "post",
            url: "DepositOrder/GetClosedDepositAccountList",
            data: JSON.stringify(order),
        });
        return response;

    };


    this.getBusinesDepositOptionRate = function (depositOption, currency) {
        var response = $http({
            method: "post",
            url: "/DepositOrder/GetBusinesDepositOptionRate",
            params: {
                depositOption: depositOption,
                currency: currency
            }
        });
        return response;
    };


    this.getDepositActions = function (order) {

        var response = $http({
            method: "post",
            url: "DepositOrder/GetDepositActions",
            data: JSON.stringify(order),
        });
        return response;

    };


}]);