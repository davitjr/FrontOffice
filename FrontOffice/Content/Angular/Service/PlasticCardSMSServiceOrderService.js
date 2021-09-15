app.service("PlasticCardSMSServiceOrderService", ['$http', function ($http) {
    this.saveAndApprovePlasticCardSMSServiceOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/SaveAndApprovePlasticCardSMSServiceOrder",
            data: JSON.stringify(order),
            datType: "json"
        });
        return response;
    };

    this.GetAllTypesOfPlasticCardsSMS = function () {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/GetAllTypesOfPlasticCardsSMS"
        });
        return response;
    };



    this.getCardMobilePhone = function (customerNumber, cardNumber) {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/GetCardMobilePhone",
            params: {
                customerNumber: customerNumber,
                cardNumber: cardNumber
            }
        });
        return response;
    };


    this.GetCurrentPhone = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/GetCurrentPhone",
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };



    this.getPlasticCardSMSServiceOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/getPlasticCardSMSServiceOrder",
            params: {
                orderID: orderID
            }
        });

        return response;
    };

    this.getPlasticCardSMSServiceHistory = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/GetPlasticCardSMSServiceHistory",
            params: {
                cardNumber: cardNumber,
            }
        });
        return response;
    };



    this.GetPlasticCardSmsServiceActions = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/GetPlasticCardSmsServiceActions",
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };


    this.SMSTypeAndValue = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/PlasticCardSMSServiceOrder/SMSTypeAndValue",
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };

}]);