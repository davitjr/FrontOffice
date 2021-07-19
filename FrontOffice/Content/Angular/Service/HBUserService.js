app.service("HBUserService", ['$http', function ($http) {


    this.getHBUsers = function (hbAppId, filter) {
        var response = $http({
            method: "post",
            url: "/HBUser/GetHBUsers",
            params: {
                hbAppId: hbAppId,
                filter: filter
            }
        });
        return response;
    };
        this.getHBUser = function (hbuserid) {
            var response = $http({
                method: "post",
                url: "/HBUser/GetHBUser",
                params: {
                    hbuserid: hbuserid
                }
            });
            return response;
        };


        this.saveHBUserOrder = function (order) {
            var response = $http({
                method: "post",
                url: "HBUser/SaveHBUserOrder",
                data: JSON.stringify(order),
                dataType: "json"
            });
            return response;
        };

        this.getHBUserOrder = function (orderId) {
            var response = $http({
                method: "post",
                url: "/HBUser/GetHBUserOrder",
                params: {
                    orderId: orderId
                }
            });
            return response;
        };

        this.checkHBUserNameAvailability = function (order) {
            var response = $http({
                method: "post",
                url: "/HBUser/CheckHBUserNameAvailability",
                data: JSON.stringify(order),
                dataType: "json"
            
            });
            return response;
        };
        
        this.cancelTokenNumberReservation = function (token ) {
            var response = $http({
                method: "post",
                url: "/HBToken/CancelTokenNumberReservation",
                data: JSON.stringify(token),
                dataType: "json"

            });
            return response;
        };

        this.getHBAssigneeCustomers = function (customerNumber) {
            var response = $http({
                method: "post",
                url: "HBUser/GetHBAssigneeCustomers",
                params: {
                    customerNumber: customerNumber
                }
            });
            return response;
        };


        this.printOnlinePartialDeactivateRequestLegal = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlinePartialDeactivateRequestLegal",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineAddTokenRequestLegal = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineAddTokenRequestLegal",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineLostTokenRequestLegal = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineLostTokenRequestLegal",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineDamagedTokenRequestLegal = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineDamagedTokenRequestLegal",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineChangeRightsRequestLegal = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineChangeRightsRequestLegal",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineChangeTokenRequestLegal = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineChangeTokenRequestLegal",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineLostTokenRequestPhysical = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineLostTokenRequestPhysical",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineDamagedTokenRequestPhysical = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineDamagedTokenRequestPhysical",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineChangeRightsRequestPhysical = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineChangeRightsRequestPhysical",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineChangeTokenRequestPhysical = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineChangeTokenRequestPhysical",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlinePartialDeactivateRequestPhysical = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlinePartialDeactivateRequestPhysical",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.printOnlineAddTokenRequestPhysical = function (tokenSerial) {
            var response = $http({
                method: "post",
                url: "/HBUser/PrintOnlineAddTokenRequestPhysical",
                responseType: 'arraybuffer',
                params: {
                    tokenSerial: tokenSerial
                }

            });
            return response;
        };

        this.getHBUserLog = function (userName) {
            var response = $http({
                method: "post",
                url: "/HBUser/GetHBUserLog",
                params: {
                    userName: userName
                }

            });
            return response;
        };

}]);