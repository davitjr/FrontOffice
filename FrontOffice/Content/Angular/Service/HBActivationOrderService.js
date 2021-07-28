app.service("HBActivationOrderService",['$http', function ($http) {


    this.saveHBActivationOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBActivationOrder/SaveHBActivationOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };


   

    this.getHBRequests = function () {
        var response = $http({
            method: "post",
            url: "/HBActivationOrder/GetHBRequests",
            dataType: "json"
        });
        return response;
    };

    this.GetHBActivationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/HBActivationOrder/GetHBActivationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getFeeForNewTokenOrderDetails = function (order) {
        var response = $http({
            method: "post",
            url: "/HBActivationOrder/PrintOrder",
            data: JSON.stringify(order),
            dataType: "json",
            
        });
        return response;
    };

    this.saveHBActivationRejectionOrder = function (order) {
        var response = $http({
            method: "post",
            url: "HBActivationOrder/SaveHBActivationRejectionOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.getPhoneBankingRequests = function () {
        var response = $http({
            method: "post",
            url: "/HBActivationOrder/GetPhoneBankingRequests",
            dataType: "json"
        });
        return response;
    };
}]);