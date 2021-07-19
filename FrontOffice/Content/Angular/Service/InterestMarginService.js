app.service("InterestMarginService", ['$http', function ($http) {

    this.saveInterestMarginChangeOrder = function (InterestMarginOrder) {
        var response = $http({
            method: "post",
            url: "/InterestMarginOrder/SaveInterestMarginChangeOrder",
            data: JSON.stringify(InterestMarginOrder),
            dataType: "json"
        });
        return response;
    };

    this.getInterestMarginDetails = function (marginType) {
        var response = $http({
            method: "post",
            url: "/InterestMarginOrder/GetInterestMarginDetails",
            params: {
                marginType: marginType
            }
        });
        return response;
    };

    this.getInterestMarginDetailsByDate = function (marginType, marginDate) {
        var response = $http({
            method: "post",
            url: "/InterestMarginOrder/GetInterestMarginDetailsByDate",
            params: {
                marginType: marginType,
                marginDate: marginDate
            }
        });
        return response;
    };

    this.getInterestMarginOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/InterestMarginOrder/GetInterestMarginOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


}]);