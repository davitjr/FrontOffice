app.service("utilityOptionsService", ['$http', function ($http) {


    this.getUtilityOptions = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/UtilityOptions/GetUtilityOptions",
            data: JSON.stringify(searchParams),
            dataType: "json",

        });
        return response;
    };


    this.getUtiltyForChange = function () {
        var response = $http({
            method: "post",
            url: "/UtilityOptions/GetUtiltyForChange",
            data: JSON.stringify(),
            dataType: "json",

        });
        return response;
    };

    this.saveUtilityOptions = function (list) {

        var response = $http({
            method: "post",
            url: "/UtilityOptions/SaveUtilityOptions",
            data: JSON.stringify(list),
            dataType: "json",

        });
        return response;
    };


    this.saveAllUtilityConfigurationsAndHistory = function (list, a) {

        var response = $http({
            method: "post",
            url: "/UtilityOptions/SaveAllUtilityConfigurationsAndHistory",

            data: JSON.stringify(list),
            dataType: "json",
            params: {
                a: a
            }
        });
        return response;
    };





    this.getExistsNotSentAndSettledRows = function (list) {
        var response = $http({
            method: "post",
            url: "/UtilityOptions/GetExistsNotSentAndSettledRows",
            data: JSON.stringify(list),
            dataType: "json",
        });
        return response;
    };




}]);
