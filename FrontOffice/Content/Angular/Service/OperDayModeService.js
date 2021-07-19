app.service("operDayModeService", ['$http', function ($http) {

    this.saveOperDayMode = function (operDayMode) {
        var response = $http({
            method: "post",
            url: "/OperDayMode/SaveOperDayMode",
            data: JSON.stringify(operDayMode),
            dataType: "json"
        });
        return response;
    };

    this.getTypeOf24_7Modes = function () {
        var response = $http({
            method: "post",
            url: "/OperDayMode/GetTypeOf24_7Modes"
        });
        return response;
    };

    this.getOperDayModeHistory = function (operDayMode) {
        var response = $http({
            method: "post",
            url: "/OperDayMode/GetOperDayModeHistory",
            data: JSON.stringify(operDayMode),
            dataType: "json"
        });
        return response;
    };

    this.getCurrentOperDay24_7_Mode = function () {
        var response = $http({
            method: "post",
            url: "/OperDayMode/GetCurrentOperDay24_7_Mode",
            data: JSON.stringify(),
            dataType: "json"
        });
        return response;
    };
    
}]);