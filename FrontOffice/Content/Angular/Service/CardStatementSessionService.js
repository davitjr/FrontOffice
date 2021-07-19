app.service('cardStatementSessionService', ['$http', function ($http) {
    //this.uploadMessages = function (messagingSession) {
    //    var response = $http({
    //        method: "post",
    //        url: "/SMSMessaging/SaveMessages",
    //        data: JSON.stringify(messagingSession),
    //        dataType: "json"
    //    });

    //    return response;
    //}

    this.getCardStatementSessions = function () {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/GetCardStatementSessions",
            dataType: "json",
        });
        return response;
    };

    this.GetStatementType = function () {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/GetStatementType",
            dataType: "int",
        });
        return response;
    };

    this.createCardStatementSession = function (startDate, endDate, frequency) {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/CreateCardStatementSession",
            dataType: "json",
            params: {
                startDate: startDate,
                endDate: endDate,
                frequency: frequency
            }
        });
        return response;
    };

    this.deleteCardStatementSession = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/DeleteCardStatementSession",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    this.getStatementSessionQualityTypes = function () {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/GetStatementSessionQualityTypes",
            dataType: "json",
        });

        return response;
    }

    this.getCardSessionDetails = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/GetCardSessionDetails",
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
            url: "/CardStatementSession/GetSatementHistory",
            dataType: "json",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    this.startCardStatementSessionSubscription = function (sessionID, startType, schedule) {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/StartCardStatementSessionSubscription",
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
            url: "/CardStatementSession/ChangeStatementSessionStatus",
            dataType: "json",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }

    this.printCardSessionStatements = function (sessionID, statementCreationStatus, statementSendStatus, statementStartDate, statementEndDate, actionType) {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/PrintCardSessionStatements",
            responseType: 'arraybuffer',
            params: {
                sessionID: sessionID,
                statementSendStatus: statementSendStatus,
                statementCreationStatus: statementCreationStatus,
                statementStartDate: statementStartDate,
                statementEndDate: statementEndDate,
                actionType: actionType
                //exportFormat: exportFormat
            }
        });
        return response;
    };

    this.printLoanSessionStatements = function (sessionID, statementCreationStatus, statementSendStatus, startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/PrintLoanSessionStatements",
            responseType: 'arraybuffer',
            params: {
                sessionID: sessionID,
                statementSendStatus: statementSendStatus,
                statementCreationStatus: statementCreationStatus,
                startDate: startDate,
                endDate: endDate
            }
        });
        return response;
    };

    this.deleteCardStatementSessionSchedule = function (sessionID) {
        var response = $http({
            method: "post",
            url: "/CardStatementSession/DeleteCardStatementSessionSchedule",
            params: {
                sessionID: sessionID
            }
        });

        return response;
    }
}]);