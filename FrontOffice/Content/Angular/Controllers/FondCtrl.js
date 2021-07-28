app.controller('FondCtrl', ['$scope', 'fondService', 'ReportingApiService', function ($scope, fondService, ReportingApiService) {
    $scope.filter = 1;
    $scope.$root.OpenMode = 14;

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.currentFond = $scope.fonds[index];
    };

    $scope.getFondByID = function (id) {
        var Data = fondService.getFondByID(id);
        Data.then(function (fond) {
            $scope.fond = fond.data;
        }, function () {
            alert('Error getFondByID');
        });
    };

    $scope.getFonds = function () {
        $scope.loading = true;
        var Data = fondService.getFonds($scope.filter);
        Data.then(function (fonds) {
            
            //if ($scope.filter == 1) {
                $scope.fonds = fonds.data;
            //    $scope.closedFonds = [];
            //}
            //else if ($scope.filter == 2) {
            //    $scope.closedFonds = fonds.data;
            //}

            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getFonds');
        });
    };


    $scope.printFondAccountsList = function () {
        //showloading();
        var requestObj = { Parameters: null, ReportName: 127, ReportExportFormat: 2 }
        ReportingApiService.getReport(requestObj, function (result) {
            ShowExcelReport(result, 'FondAccountsList');
        });

    };

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.getFonds();
    };

}]);