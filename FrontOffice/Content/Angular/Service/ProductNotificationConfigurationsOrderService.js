app.service("productNotificationConfigurationsOrderService", ['$http', function ($http) {
    this.saveProductNotificationsConfigurationsOrder = function (order) {
        var response = $http({
            method: "post",
            url: "ProductNotificationConfigurationsOrder/SaveProductNotificationConfigurationsOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };
    this.getProductNotificationConfigurations = function (productid) {
        var response = $http({
            method: "post",
            url: "/ProductNotificationConfigurationsOrder/GetProductNotificationConfigurations",
            params: {
                productid: productid
            }
        });
        return response;
    };

    this.printProductNotificationContract = function (productNotificationConfiguration) {
        var response = $http({
            method: "post",
            url: "/ProductNotificationConfigurationsOrder/PrintProductNotificationContract",
            responseType: 'arraybuffer',
            data: JSON.stringify(productNotificationConfiguration),
            dataType: "json",
        });
        return response;
    };


    this.getProductNotificationConfigurationOrder = function (orderID) {

        var response = $http({
            method: "post",
            url: "/ProductNotificationConfigurationsOrder/GetProductNotificationConfigurationOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };




}]);
