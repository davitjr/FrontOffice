app.service("accountOrderService",['$http', function ($http) {
        
    this.saveAccountOrder = function (accountOrder,confirm) {
        var response = $http({
            method: "post",
            url: "AccountOrder/SaveAccountOrder",
            data: JSON.stringify(accountOrder),
            params: {
                confirm: confirm
            },
            dataType: "json"
        });
        return response;
    };
    
    this.GetAccountOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/AccountOrder/GetAccountOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetAccountOpenWarnings = function () {
        var response = $http({
            method: "post",
            url: "/AccountOrder/GetAccountOpenWarnings"            
        });
        return response;
    };

}]);