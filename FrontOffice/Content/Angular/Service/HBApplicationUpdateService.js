app.service("hbApplicationUpdateService", ['$http', function ($http) {


    this.saveHBApplicationUpdateOrder = function (order, hbApplicationUpdate) {
        var data = { order: order, users: hbApplicationUpdate.Users, tokens: hbApplicationUpdate.Tokens }
        var response = $http({
            method: "post",
            url: "HBApplicationUpdateOrder/SaveHBApplicationUpdateOrder",
            data: JSON.stringify(data),
            dataType: "json"
        });
        return response;
    };

}]);