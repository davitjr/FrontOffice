app.service("accountDataChangeOrderService", ['$http', function ($http) {

    this.saveAccountDataChangeOrder = function (dataChangeOrder) {
        var response = $http({
            method: "post",
            url: "AccountDataChangeOrder/SaveAccountDataChangeOrder",
            data: JSON.stringify(dataChangeOrder),
            dataType: "json"
        });
        return response;
    };

    this.getAccountDataChangeOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/AccountDataChangeOrder/GetAccountDataChangeOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };


    this.GetAccountAdditionsTypes = function () {
        var response = $http({
            method: "post",
            url: "/AccountDataChangeOrder/GetAccountAdditionsTypes",
            
        });
        return response;
    };

    this.saveAccountAdditionalDataRemovableOrder = function (order) {
        var response = $http({
            method: "post",
            url: "AccountDataChangeOrder/SaveAccountAdditionalDataRemovableOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
  
}]);