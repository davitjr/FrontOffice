app.service('FinancialPlanningService', ['$http', function ($http) {
    this.SaveFinancialPlaning = function (excelDocument) {
        var response = $http({
            method: "post",
            url: "/FinancialPlanning/Save",
            headers: {
                "Content-Type": undefined
            },
            data: excelDocument
        });
        return response;
    }

    this.GetPlanningTypes = function () {
        var response = $http({
            method: "post",
            url: "/FinancialPlanning/GetPlanningTypes",
        });
        return response;
    }

    this.GetFinancialPlanningTypes = function () {
        var response = $http({
            method: "post",
            url: "/FinancialPlanning/GetFinancialPlanningTypes",
        });
        return response;
    }

        this.GetFinancialPlanning = function (document,year,filialCode, setNumber) {
        var response = $http({
            method: "post",
            url: "/FinancialPlanning/GetFinancialPlanning",
            data: JSON.stringify(document),
            dataType: "json",
            params: {
                year: year,
                filialCode: filialCode,
                setNumber:setNumber
            }
        });
        return response;
    };
}]);

