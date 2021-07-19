app.service("cardRegistrationOrderService",['$http', function ($http) {
        
    this.saveCardRegistrationOrder = function (cardRegistrationOrder) {
        var response = $http({
            method: "post",
            url: "CardRegistrationOrder/SaveCardRegistrationOrder",
            data: JSON.stringify(cardRegistrationOrder),
            dataType: "json"
        });
        return response;
    };

    this.getCardsForRegistration = function (filter) {
        var response = $http({
            method: "post",
            url: "/CardRegistrationOrder/GetCardsForRegistration"
        });
        return response;
    };

    this.getAccountListForCardRegistration = function (cardCurrency,cardFilial) {
        var response = $http({
            method: "post",
            url: "/CardRegistrationOrder/GetAccountListForCardRegistration",
            params: {
                cardCurrency: cardCurrency,
                cardFilial: cardFilial
            }
        });
        return response;
    };

    this.getOverdraftAccountsForCardRegistration = function (cardCurrency, cardFilial) {
        var response = $http({
            method: "post",
            url: "/CardRegistrationOrder/GetOverdraftAccountsForCardRegistration",
            params: {
                cardCurrency: cardCurrency,
                cardFilial: cardFilial
            }
        });
        return response;
    };

    
    this.getCardRegistrationOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CardRegistrationOrder/GetCardRegistrationOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.GetCardRegistrationWarnings = function (plasticCard) {
        var response = $http({
            method: "post",
            url: "/CardRegistrationOrder/GetCardRegistrationWarnings",
            data: JSON.stringify(plasticCard),
            dataType: "json"
        });
        return response;
    };
}]);