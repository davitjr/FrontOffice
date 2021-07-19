app.service("servicePaymentOrderService", ['$http', function ($http) {

this.saveServicePaymentOrder = function (order) {
    var response = $http({
        method: "post",
        url: "/ServicePaymentOrder/SaveServicePaymentOrder",
        data: JSON.stringify(order),
        dataType: "json"
    });
    return response;
};


this.initDebitAccount = function (order) {
    var response = $http({
        method: "post",
        url: "/ServicePaymentOrder/initDebitAccount",
        data: JSON.stringify(order),
        dataType: "json",
        
    });
    return response;
};
}]);