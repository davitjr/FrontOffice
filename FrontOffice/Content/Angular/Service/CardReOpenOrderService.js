app.service("CardReOpenOrderService", ['$http', function ($http) {

    this.saveCardReOpenOrder = function (CardReOpenOrder) {
        var response = $http({
            method: "post",
            url: "/CardReOpenOrder/SaveCardReOpenOrder",
            data: JSON.stringify(CardReOpenOrder),
            dataType: "json"
        });
        return response;
    };

    this.GetCardReOpenReason = function () {
        var response = $http({
            method: "post",
            url: "/CardReOpenOrder/GetCardReOpenReason"
        });        
        return response;
    };
    

    this.IsCardOpen = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/CardReOpenOrder/IsCardOpen",
            params: {
                cardNumber: cardNumber
            }
        });
        return response;
    };



    this.getCardReOpenOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CardReOpenOrder/GetCardReOpenOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

   
}]);