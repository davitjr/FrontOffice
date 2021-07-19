app.service('LeasingStatementSessionService', ['$http', function ($http) {

    this.getLeasingStatementSessions = function () {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/GetLeasingStatementSessions",
            dataType: "json",
        });
        return response;
    };

    this.GetStatementType = function () {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/GetStatementType",
            dataType: "int",
        });
        return response;
    };

    this.createLeasingStatementSession = function (startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/CreateLeasingStatementSession",
            dataType: "json",
            params: {
                startDate: startDate,
                endDate: endDate
            }
        });
        return response;
    };

    this.deleteLeasingStatementSession = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/DeleteLeasingStatementSession",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    this.getStatementSessionQualityTypes = function () {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/GetStatementSessionQualityTypes",
            dataType: "json",
        });

        return response;
    }

    this.getLeasingSessionDetails = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/GetLeasingSessionDetails",
            dataType: "json",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    this.getSatementHistory = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/GetSatementHistory",
            dataType: "json",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    this.startLeasingStatementSessionSubscription = function (sessionID, startType, schedule) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/StartLeasingStatementSessionSubscription",
            dataType: "json",
            params: {
                sessionID: sessionID,
                startType: startType,
                schedule: schedule
            }
        });

        return response;
    }

    this.changeStatementSessionStatus = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/ChangeStatementSessionStatus",
            dataType: "json",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    this.printLeasingSessionStatements = function (sessionID, statementCreationStatus, statementSendStatus, statementStartDate, statementEndDate) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/PrintLeasingSessionStatements",
            params: {
                sessionID: sessionID,
                statementSendStatus: statementSendStatus,
                statementCreationStatus: statementCreationStatus,
                statementStartDate: statementStartDate,
                statementEndDate: statementEndDate
                //exportFormat: exportFormat
            }
        });
        return response;
    };

    this.deleteLeasingStatementSessionSchedule = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/DeleteLeasingStatementSessionSchedule",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    //procedura-ն կանչվում է job-ից
    this.runStatementSessionSubscription = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/RunStatementSessionSubscription",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    };


    this.getLeasingOperDay = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/GetLeasingOperDay"
        });

        return response;
    };

    this.printLeasingCustomersWithoutEmailReport = function () {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/PrintLeasingCustomersWithoutEmailReport",
            responseType: 'arraybuffer'
        });
        return response;
    };

    this.printLeasingCustomersWithoutEmailForStatementReport = function (sessionID, statementEndDate) {
        var response = $http({
            method: "post",
            url: "/LeasingStatementSession/PrintLeasingCustomersWithoutEmailForStatementReport",
            params: {
                sessionID: sessionID,
                statementEndDate: statementEndDate
            }
        });
        return response;
    };

}]);