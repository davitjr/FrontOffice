app.service("LeasingService", ['$http', function ($http) {

    app.factory('LeasingService', [function () {
        var goals = {};
        return {
            getGoals: function () {
                return goals;
            },

            setGoals: function (op) {
                goals = op;
            },
        }
    }])
        .controller('NLGoalsCtrl', [function ($scope, myService) {
            $scope.goals_selected = {};
            //Update goals_selected
            myService.setGoals($scope.goals_selected);
        }])
        .controller('NLSessionsCtrl', [function ($scope, myService) {
            //Fetch
            $scope.goals_selected = myService.getGoals();
        }]);


    this.getDetailedInformationObject = function (loanFullNumber, dateOfBeginning) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasingDetailedInformation",
            params: {
                loanFullNumber: loanFullNumber,
                dateOfBeginning: dateOfBeginning
            }
        });
        return response;
    }
    this.getInsuranceInformationObject = function (loanFullNumber, dateOfBeginning) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasingInsuranceInformation",
            params: {
                loanFullNumber: loanFullNumber,
                dateOfBeginning: dateOfBeginning
            }
        });
        return response;
    }
    this.printLeasingScheduleSubsid = function (loanFullNumber, dateOfBeginning, exportFormat) {
        //debugger;
        var response = $http({
            method: "post",
            url: "/Leasing/PrintLeasingSchedulesSubsid",
            params: {
                loanFullNumber: loanFullNumber,
                dateOfBeginning: dateOfBeginning,
                exportFormat: exportFormat
            },
            dataType: "json"
        });
        return response;
    }
    this.printLeasingSchedule = function (loanFullNumber, dateOfBeginning, exportFormat) {
      //  debugger;
        var response = $http({
            method: "post",
            url: "/Leasing/PrintLeasingSchedules",
            params: {
                loanFullNumber: loanFullNumber,
                dateOfBeginning: dateOfBeginning,
                exportFormat: exportFormat
            },
            dataType: "json"
        });
        return response;
    }

    this.getPartlyMatureDebts = function (generalNumber) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetPartlyMatureAmount",
            params: {
                contractNumber: generalNumber
            }
        });
        return response;
    }

    this.getLeasingOperDay = function () {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasingOperDay"
        });
        return response;
    }

    this.getPartlyMatureDebts = function (generalNumber) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetPartlyMatureAmount",
            params: {
                contractNumber: generalNumber
            }
        });
        return response;
    }
        
    this.getLeasings = function () {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasings"
         
        });
        return response;
    }

    this.getLeasing = function (productId) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasing",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getLeasingGrafikApplication = function (loanFullNumber, startDate) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasingGrafikApplication",
            params: {
                loanFullNumber: loanFullNumber,
                startDate: startDate
            }
        });
        return response;
    };

    this.getLeasingGrafik = function (productId, firstReschedule) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasingGrafik",
            params: {
                productId: productId,
                firstReschedule: firstReschedule
            }
        });
        return response;
    };

    this.getLeasingOverdueDetails = function (productId) {
        return $http.get("/Leasing/GetLeasingOverdueDetails", {
            params: {
                productId: productId
            }
        });
    };

    this.getManagerCustomerNumber = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetManagerCustomerNumber",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };
    

    this.getLeasings = function () {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasings"

        });
        return response;
    }
    this.getLeasing = function (productId) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasing",
            params: {
                productId: productId
            }
        });
        return response;
    };
    this.getLeasingGrafikApplication = function (loanFullNumber, startDate) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasingGrafikApplication",
            params: {
                loanFullNumber: loanFullNumber,
                startDate: startDate
            }
        });
        return response;
    };
    this.getLeasingGrafik = function (productId, firstReschedule) {
        var response = $http({
            method: "post",
            url: "/Leasing/GetLeasingGrafik",
            params: {
                productId: productId,
                firstReschedule: firstReschedule
            }
        });
        return response;
    };


}]);
