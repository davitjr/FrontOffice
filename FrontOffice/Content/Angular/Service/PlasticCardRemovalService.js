app.service("plasticCardRemovalService", ['$http', function ($http) {

    this.savePlasticCardRemovalOrder = function (cardOrder) {
        var response = $http({
            method: "post",
            url: "/PlasticCardRemovalOrder/SavePlasticCardRemovalOrder",
            data: JSON.stringify(cardOrder),
            dataType: "json"
        });
        return response;
    };

    this.CheckIfPlasticCardCanBeCanceled = function (orderID) {

        var response = $http({
            method: "post",
            url: "/PlasticCardOrder/CheckIfPlasticCardCanBeCanceled",
            dataType: "bool",
            params: {
                orderID: orderID,
            }
        });
        return response;
    };

    this.getPlasticCardRemovalOrder = function (orderID) {

        var response = $http({
            method: "post",
            url: "/PlasticCardRemovalOrder/GetPlasticCardRemovalOrder",
            dataType: "json",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getCardRemovalReasons = function () {
        var response = $http({
            method: "post",
            url: "/PlasticCardRemovalOrder/GetCardRemovalReasons",
            dataType: "json"
        });
        return response;
    };

    this.getCustomerPlasticCards = function () {
        var response = $http({
            method: "post",
            url: "/PlasticCardRemovalOrder/GetCustomerPlasticCards",
            dataType: "json"
        });
        return response;
    };

    this.checkPlasticCardRemovalOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/PlasticCardRemovalOrder/CheckPlasticCardRemovalOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

}]);