app.service("casherService",['$http', function ($http) {

    this.getUserDescription = function () {
        var response = $http({
            method: "post",
            url: "/Home/GetUserDescription"
        });
        return response;
    };

    this.getUserID = function () {
        var response = $http({
            method: "post",
            url: "/Home/GetUserID"
        });
        return response;
    };

    this.getCasherDepartment = function () {
        var response = $http({
            method: "post",
            url: "/Home/GetCasherDepartment"
        });
        return response;
    };

    this.getCasherDescription = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/Home/GetCasherDescription",
            params: {
                setNumber: setNumber
            }
        });
        return response;

    };

    this.getCurrentUserPicture = function () {
        var response = $http({
            method: "post",
            url: "/Home/GetCurrentUserPicture",
            responseType: 'arraybuffer',

        });
        return response;

    };

    this.getUserFilialCode = function (reference) {
        var response = $http({
            method: "post",
            url: "/Home/GetUserFilialCode",
        });
        return response;
    };

    this.getUserPicture = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/Home/GetUserPicture",
            responseType: 'arraybuffer',
            params: {
                setNumber: setNumber
            }

        });
        return response;

    };


    this.getCashier = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/Home/GetCashier",
            params: {
                setNumber: setNumber
            }
        });
        return response;
    };



    this.isUserManager = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/Home/IsUserManager",
            params: {
                setNumber: setNumber
            }
        });
        return response;

    };



    this.getCasherDepartmentId = function () {
        var response = $http({
            method: "post",
            url: "/Home/GetCasherDepartmentId"
        });
        return response;
    };
}]);
