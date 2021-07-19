app.service("vehicleViolationService",['$http', function ($http) {

    this.getVehicleViolationById = function (violationId) {
        var response = $http({
            method: "post",
            url: "/VehicleViolation/GetVehicleViolationById",
            params: {
                violationId: violationId
            }
        });
        return response;
    };


    this.getVehicleViolationByPsnVehNum = function (psn, vehNum) {
        var response = $http({
            method: "post",
            url: "/VehicleViolation/GetVehicleViolationByPsnVehNum",
            params: {
                psn: psn,
                vehNum: vehNum
            }
        });
        return response;
    };

}]);