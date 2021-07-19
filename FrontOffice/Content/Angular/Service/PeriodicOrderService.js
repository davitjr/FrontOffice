app.service("periodicOrderService",['$http', function ($http) {

    this.savePeriodicPaymentOrder = function (order,confirm) {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/SavePeriodicPaymentOrder",
            data: JSON.stringify(order),
            params: {
                confirm: confirm
            },
            dataType: "json"
        });
        return response;
    };
    this.savePeriodicArmPaymentOrder = function (order, confirm) {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/SavePeriodicPaymentOrder",
            data: JSON.stringify(order),
            params: {
                confirm: confirm
            },
            dataType: "json"
        });
        return response;
    };

    this.savePeriodicUtilityPaymentOrder = function (order, confirm) {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/SavePeriodicUtilityPaymentOrder",
            data: JSON.stringify(order),
            params: {
                confirm: confirm
            },
            dataType: "json"
        });
        return response;
    };

    this.savePeriodicBudgetPaymentOrder = function (order, confirm) {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/SavePeriodicBudgetPaymentOrder",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                confirm: confirm
            },
        });
        return response;
    };

    this.getPeriodicUtilityPaymentOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/GetPeriodicUtilityPaymentOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getPeriodicPaymentOrder = function (orderId, subType) {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/GetPeriodicPaymentOrder",
            params: {
                orderId: orderId,
                subType:subType
            }
        });
        return response;
    };

    this.getRAFoundAccount = function () {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/GetRAFoundAccount"

        });
        return response;
    };


    this.savePeriodicSwiftStatementOrder = function (order, confirm) {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/SavePeriodicSwiftStatementOrder",
            data: JSON.stringify(order),
            params: {
                confirm: confirm
            },
            dataType: "json"
        });
        return response;
    };



    this.getPeriodicSwiftStatementOrderFee = function () {
        var response = $http({
            method: "post",
            url: "/PeriodicOrder/GetPeriodicSwiftStatementOrderFee"
        });
        return response;
    };

}]);