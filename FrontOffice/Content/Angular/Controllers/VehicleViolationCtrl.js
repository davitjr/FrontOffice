app.controller("VehicleViolationCtrl", ['$scope', 'vehicleViolationService', function ($scope, vehicleViolationService) {

    $scope.searchType = 2;
    $scope.vehicleViolations = [];

    $scope.setClickedRow = function (index, violation) {
        $scope.selectedRow = index;
        $scope.selectedViolationId = violation.Id;
        $scope.selectedViolation = violation;
    };

    $scope.getViolations = function (searchType) {
        if (searchType == 1)
        {
            $scope.getVehicleViolationByPsnVehNum($scope.vehiclePassportNumber,$scope.vehicleNumber);
        }
        else
        {
            $scope.getVehicleViolationById($scope.violationNumber);
        }
    };


    $scope.getVehicleViolationById = function (violationId) {
     showloading();
        var Data = vehicleViolationService.getVehicleViolationById(violationId);
        Data.then(function (acc) {
         hideloading();
            $scope.vehicleViolations = acc.data;
        }, function () {
         hideloading();
            $scope.loading = false;
            alert('Error getVehicleViolations');
        });
    };


    $scope.getVehicleViolationByPsnVehNum = function (psn,vehNum) {
    showloading();
        var Data = vehicleViolationService.getVehicleViolationByPsnVehNum(psn, vehNum);
        Data.then(function (acc) {
         hideloading();
            $scope.vehicleViolations = acc.data;
        }, function () {
         hideloading();
            $scope.loading = false;
            alert('Error getVehicleViolations');
        });
    };

}]);
