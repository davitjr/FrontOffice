app.service("XBUserGroupService", ['$http', function ($http) {
    this.saveXBUserGroup = function (group) {
        var response = $http({
            method: "post",
            url: "XBUserGroup/SaveXBUserGroup",
            data: JSON.stringify(group),
            dataType: "json"
        });
        return response;
    };

    this.getXBUserGroups = function () {
        return $http.get("/XBUserGroup/GetXBUserGroups");
    };

    this.removeXBUserGroup = function (group) {
        var response = $http({
            method: "post",
            url: "XBUserGroup/RemoveXBUserGroup",
            data: JSON.stringify(group),
            dataType: "json"
        });
        return response;
    };


    this.setXBUsers = function (group, xbUsers) {
        var response = $http({
            method: "post",
            url: "XBUserGroup/SetXBUsers",
            data: JSON.stringify({ "group": group, "xbUsers": xbUsers }),
            dataType: "json"
        });
        return response;
    };
}]);