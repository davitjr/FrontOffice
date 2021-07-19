app.service("cardDataChangeOrderService", ['$http', function ($http) {
    this.saveCardDataChangeOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/CardDataChangeOrder/SaveCardDataChangeOrder",
            data: JSON.stringify(order),
            datType: "json"
        });

        return response;
    };

    this.getCardDataChangeOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CardDataChangeOrder/GetCardDataChangeOrder",
            params: {
                orderID: orderID
            }
        });

        return response;
    };


    this.checkCardDataChangeOrderFieldTypeIsRequaried = function (fieldType) {
        var response = $http({
            method: "post",
            url: "/CardDataChangeOrder/CheckCardDataChangeOrderFieldTypeIsRequaried",
            params: {
                fieldType: fieldType
            }
        });

        return response;
    };

    this.GetRelatedOfficeNumberChangeHistory = function (productid, fieldType) {
        var response = $http({
            method: "post",
            url: "/CardDataChangeOrder/GetRelatedOfficeNumberChangeHistory",
            params: {
                FieldType: fieldType,
                ProductAppId: productid
            }
        });

        return response;
    }
}]);