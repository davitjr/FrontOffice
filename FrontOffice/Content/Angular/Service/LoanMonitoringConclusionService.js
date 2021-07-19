app.service("loanMonitoringConclusionService", ['$http', function ($http) {

    this.saveLoanMonitoring = function (monitoring) {
        var response = $http({
            method: "post",
            url: "LoanMonitoringConclusion/SaveLoanMonitoringConclusion",
            data: JSON.stringify(monitoring),
            dataType: "json"
        });
        return response;
    };

    this.getLoanMonitorings = function (productId) {
        var response = $http({
            method: "post",
            url: "/LoanMonitoringConclusion/GetLoanMonitorings",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.approveLoanMonitoring = function (monitoring) {
        var response = $http({
            method: "post",
            url: "LoanMonitoringConclusion/ApproveLoanMonitoringConclusion",
            data: JSON.stringify(monitoring),
            dataType: "json"
        });
        return response;
    };

    this.deleteLoanMonitoring = function (monitoring) {
        var response = $http({
            method: "post",
            url: "LoanMonitoringConclusion/DeleteLoanMonitoringConclusion",
            data: JSON.stringify(monitoring),
            dataType: "json"
        });
        return response;
    };

    this.getLinkedLoans = function (productId) {
        var response = $http({
            method: "post",
            url: "/LoanMonitoringConclusion/GetLinkedLoans",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getProvisionCoverCoefficient = function (productId) {
        var response = $http({
            method: "post",
            url: "/LoanMonitoringConclusion/GetProvisionCoverCoefficient",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLoanMonitoringConclusion = function (monitoringId,productId) {
        var response = $http({
            method: "post",
            url: "/LoanMonitoringConclusion/GetLoanMonitoringConclusion",
            params: {
                monitoringId: monitoringId,
                productId: productId
            }
        });
        return response;
    };

    this.getLoanMonitoringType = function () {
        var response = $http({
            method: "post",
            url: "/LoanMonitoringConclusion/GetLoanMonitoringType"
            
        });
        return response;
    };

    this.hasPropertyProvision = function (productId) {
        var response = $http({
            method: "post",
            url: "/LoanMonitoringConclusion/HasPropertyProvision",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.isLawDivision = function () {
        var response = $http({
            method: "post",
            url: "/LoanMonitoringConclusion/IsLawDivision"
            
        });
        return response;
    };



}]);