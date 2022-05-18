app.service("cardlessCashoutCancellationOrderCtrlService", ['$http', function ($http) {

    this.SaveAndApproveCardlessCashoutCancellationOrder = function (Order) {
        var response = $http({
            method: "post",
            url: "CardlessCashoutCancellationOrder/SaveAndApproveCardlessCashoutCancellationOrder",
            data: JSON.stringify(Order),
            dataType: "json"
        });
        return response;
    };

    this.GetCardlessCashoutOrder = function (orderid) {
        var response = $http({
            method: "post",
            url: "/CardlessCashoutCancellationOrder/GetCardlessCashoutOrder",
            params: {
                orderid: orderid
            },
        });
        return response;
    };

    this.GetCardlessCashoutCancellationOrderReport = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/CardlessCashoutCancellationOrder/GetCardlessCashoutCancellationOrderReport",
            data: JSON.stringify(searchParams)
        });
        return response;
    }
   
}]);