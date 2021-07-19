﻿app.service("depositaryAccountOrderService",['$http', function ($http) {



    this.saveDepositaryAccountOrder = function (depositaryAccountOrder) {
        var response = $http({
            method: "post",
            url: "/DepositaryAccountOrder/SaveDepositaryAccountOrder",
             data: JSON.stringify(depositaryAccountOrder),
            dataType: "json"
        });
        return response;
    };


    this.getDepositaryAccountOrder = function (id) {
        var response = $http({
            method: "post",
            url: "/DepositaryAccountOrder/GetDepositaryAccountOrder",
            params: {
                id: id
            }
        });
        return response;
    };




}]);