app.service("hbServletOrderService", ['$http', function ($http) {

    this.saveHBServletTokenUnBlockOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBServletTokenUnBlockOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }

    this.saveHBServletUserUnlockOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBServletUserUnlockOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }

    this.saveHBServletTokenActivationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBServletTokenActivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }
    this.saveHBServletTokenDeactivationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBServletTokenDeactivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }
    this.saveHBServletUserDeactivationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBServletUserDeactivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }

    this.saveHBServletShowPINCode = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBServletShowPINCode",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }
    this.saveHBUserPasswordResetManually = function (order) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/SaveHBUserPasswordResetManually",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }

    this.migrateOldUserToCas = function (userId) {
        var response = $http({
            method: "post",
            url: "HBServletRequestOrder/MigrateOldUserToCas",
            params: { userId: userId }
        });
        return response;
    }
    
}]);