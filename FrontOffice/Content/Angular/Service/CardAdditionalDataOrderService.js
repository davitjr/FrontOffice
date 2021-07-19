app.service("CardAdditionalDataOrderService", ['$http', function ($http) {

    this.GetCustomerPlasticCardsForAdditionalData = function (IsClosed) {
        var response = $http({
            method: "post",
            url: "/CardAdditionalDataOrder/GetCustomerPlasticCardsForAdditionalData",
            data: {
                IsClosed: IsClosed
            }
        });
        return response;
    };

    this.GetCardAdditionalDatas = function (CardNumber, ExpiryDate) {
        var response = $http({
            method: "post",
            url: "/CardAdditionalDataOrder/GetCardAdditionalDatas",
            params: {
                CardNumber: CardNumber,
                ExpiryDate: ExpiryDate
            }
        });
        return response;
    };

    this.saveCardAdditionalDataOrder = function (CardAdditionalDataOrder) {
        var response = $http({
            method: "post",
            url: "/CardAdditionalDataOrder/SaveCardAdditionalDataOrder",
            data: JSON.stringify(CardAdditionalDataOrder),
            dataType: "json"
        });
        return response;
    }

    this.getCardAdditionalDataOrderDetails = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CardAdditionalDataOrder/GetCardAdditionalDataOrderDetails",
            dataType: "json",
            params: {
                orderID: orderID
            }
        });
        return response;
    }

}]);