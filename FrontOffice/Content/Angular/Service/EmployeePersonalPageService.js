app.service("employeePersonalPageService", ['$http', function ($http) {
    this.saveBranchDocumentSignatureSetting = function (setting) {
        var response = $http({
            method: "post",
            url: "/EmployeePersonalPage/SaveBranchDocumentSignatureSetting",
            data: JSON.stringify(setting),
            dataType: "json",

        });
        return response;
    };


    this.getBranchDocumentSignatureSetting = function () {
        var response = $http({
            method: "post",
            url: "/EmployeePersonalPage/GetBranchDocumentSignatureSetting",
        });
        return response;
    };


}]);