app.service('SMSMessagingService', ['$http', function ($http) {
    this.uploadMessages = function (messagingSession) {
        var response = $http({
            method: "post",
            url: "/SMSMessaging/SaveMessages",
            data: JSON.stringify(messagingSession),
            dataType: "json"
        });

        return response;
    }

    this.getSMSMessagingSessions = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/SMSMessaging/GetSMSMessagingSessions",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });
        return response;
    };

    this.changesmsMessagingStatus = function (id, newStatus) {
        var response = $http({
            method: "post",
            url: "/SMSMessaging/ChangeSMSMessagingSessionStatus",
            params: {
                id: id,
                newStatus: newStatus
            }
        });

        return response;
    }

    this.deleteMessagingSession = function (id) {
        var response = $http({
            method: "post",
            url: "/SMSMessaging/DeleteMessagingSession",
            params: {
                id: id
            }
        });

        return response;
    }

    this.SMSMessagingReport = function (id) {
        var response = $http({
            method: "post",
            url: "/SMSMessaging/SMSMessagingReport",
            responseType: 'arraybuffer',
            params: {
                id: id
            }
        });

        return response;
    }
}]);