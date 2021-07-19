app.controller('PreOrderCtrl', ['$scope', 'preOrderService', function ($scope, preOrderService) {


    $scope.$watch('currentPage', function (newValue, oldValue) {
        if (newValue != oldValue) {
            $scope.searchParams.StartRow = (newValue - 1) * $scope.numPerPage + 1;
            $scope.searchParams.EndRow = newValue * $scope.numPerPage;
            $scope.getSearchedPreOrderDetails();
        }
    });
    $scope.getSearchedPreOrderDetails = function () {
        var Data = preOrderService.getSearchedPreOrderDetails($scope.searchParams);
        Data.then(function (acc) {
            $scope.preOrderDetails = acc.data;

            if ($scope.preOrderDetails.length > 0)
                $scope.totalRows = $scope.preOrderDetails[0].RowCount;
            else
                $scope.totalRows = 0;
             
            if ($scope.totalRows / $scope.numPerPage > 5) {
                $scope.maxSize = 5;
            }
            else {
                $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
            }
            

        }, function () {
            alert('Error getSearchedPreOrderDetails');
        });
    };
    $scope.setSearchParameters = function () {
        
        $scope.dateFrom = new Date();
        $scope.dateTo = new Date();
        $scope.searchParams = {
            DateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            DateTo: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            StartRow: 0,
            EndRow: 30,
            Quality: 0,
            Type: $scope.preordertype

        };
        $scope.searchParams.Quality = 0;
        $scope.currentPage = 0;
        $scope.numPerPage = 30;
        $scope.maxSize = 1;
        $scope.totalRows = 0;  
    }
}]);
