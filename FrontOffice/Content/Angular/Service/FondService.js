app.service("fondService", ['$http', function ($http) {
    this.getFondByID = function (id) {
        var response = $http({
            method: "post",
            url: "/Fond/GetFondByID",
            params: {
                ID: id
            }
        });
        return response;
    };

    this.getFonds = function (filter)
    {
        var response = $http({
            method: "post",
            url: "/Fond/GetFonds",
            params: {
                filter: filter
            }

        });
        return response;
    };

    this.printFondAccountsList = function (fond) {
        var response = $http({
            method: "post",
            url: "/Fond/PrintFondAccountsList",
            responseType: 'arraybuffer',
            data: JSON.stringify(fond)
        });
        return response;
    };

}]);