app.service("employeeWorksService", ['$http', '$templateCache', function ($http) {
    this.saveEmployeeWork = function (work) {
        var response = $http({
            method: "post",
            url: "/EmployeeWorks/SaveEmployeeWork",
            data: JSON.stringify(work),
            dataType: "json",
           
        });
        return response;
    };
    

    this.getTypeOfEmployeeWorks = function () {
        var response = $http({
            method: "post",
            url: "/EmployeeWorks/GetTypeOfEmployeeWorks",
        });
        return response;
    };

    this.getTypeOfEmployeeWorkImportances = function () {
        var response = $http({
            method: "post",
            url: "/EmployeeWorks/GetTypeOfEmployeeWorkImportances",
        });
        return response;
    };

    this.getTypeOfEmployeeWorkQualities = function () {
        var response = $http({
            method: "post",
            url: "/EmployeeWorks/GetTypeOfEmployeeWorkQualities",
        });
        return response;
    };

    this.getTypeOfEmployeeWorkDescriptions = function () {
        var response = $http({
            method: "post",
            url: "/EmployeeWorks/GetTypeOfEmployeeWorkDescriptions",
        });
        return response;
    };

    this.searchEmployeesWorks = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/EmployeeWorks/SearchEmployeesWorks",
            data: JSON.stringify(searchParams),
            dataType: "json",

        });
        return response;
    };

    this.getEmployeeWork = function (id) {
        var response = $http({
            method: "post",
            url: "/EmployeeWorks/GetEmployeeWork",
            params: {
                id: id
            }
        });
        return response;

    };



}]);