
app.service('loginService', ['$http', function ($http) {
    this.getCustomerAuthorizationData = function () {
        var response = $http({
            method: "post",
            url: "/Login/GetCustomerAuthorizationData"
        });
        return response;
    }

    this.logIn = function () {
        var response = $http({
            method: "post",
            url: "/Login/LogIn"
        });
        return response;
    }

    this.setSessionGuid = function()
    {
        var clientDate = new Date();
        var response = $http({
            method: "post",
            url: "/Login/SetSessionGuid",
            params: {
                clientDate: clientDate
            }
        });
        return response;
        
    }

    this.sendAutorizationSMS = function () {
        var response = $http({
            method: "post",
            url: "/Login/SendSMSAuthorizationCode"
        });
        return response;
    }

    this.verifyAutorizationSMS = function (smsCode) {
        var response = $http({
            method: "post",
            url: "/Login/VerifySMSAuthorizationCode",
            params: {
                smsCode: smsCode
            }
        });
        return response;
    }

    this.testServingCustomer = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Login/TestServingCustomer",
            params: {
                customerNumber: customerNumber
            },

        });
        return response;

    }
    this.testServingNonCustomer = function () {
        var response = $http({
            method: "post",
            url: "/Login/TestServingNonCustomer"

        });
        return response;

    }
}]);
