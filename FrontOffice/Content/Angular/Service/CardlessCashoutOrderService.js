app.service("cardlessCashOutOrderService", ['$http', function ($http) {
   
    this.getCardLessCashOutOrder = function (id) {
        var response = $http({
            method: "post",
            url: "/CardlessCashoutOrder/GetCardLessCashOutOrder",
            params: {
                id: id
            }
        });
        return response;
    };

}]);