app.service("LeasingOutPutReportsService", ['$http', function ($http) {
    
    this.getPortfolioByExpertsReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetPortfolioByExpertsReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getAverageReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetAverageReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getByKFWReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetByKFWReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getReachSurveyTableReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetReachSurveyTableReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getBySubsidReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetBySubsidReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getLoanRepaymentScheduleReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetLoanRepaymentScheduleReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getByFundsReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetByFundsReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getGGFSoutheastReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetGGFSoutheastReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getReviseLeasingsReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetReviseLeasingsReport",
            params: {
                date: date
            }
        });
        return response;
    };

    this.getEFSEAggregateReport = function (date) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetEFSEAggregateReport",
            params: {
                date: date
            }
        });
        return response;
    };


    this.getEconomicSectorGroupReport = function (startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetEconomicSectorGroupReport",
            params: {
                startDate: startDate,
                endDate: endDate
            }

        });
        return response;
    };

    this.getPortfolioByTypeOfEquipmentReport = function (startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetPortfolioByTypeOfEquipmentReport",
            params: {
                startDate: startDate,
                endDate: endDate
            }

        });
        return response;
    };

    this.getByGeographicRegionsReport = function (startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/LeasingOutPutReports/GetByGeographicRegionsReport",
            params: {
                startDate: startDate,
                endDate: endDate
            }

        });
        return response;
    };
}]);