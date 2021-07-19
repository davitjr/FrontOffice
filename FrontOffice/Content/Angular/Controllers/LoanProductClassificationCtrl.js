app.controller("LoanProductClassificationCtrl", ['$scope', 'loanProductClassificationService', function ($scope, loanProductClassificationService) {
    $scope.dateFrom = new Date(new Date().addMonths(-3).setDate(1));

    $scope.getLoanProductClassifications = function () {
        var Data = loanProductClassificationService.getLoanProductClassifications($scope.products, $scope.dateFrom);
        Data.then(function (acc) {
            $scope.classifications = acc.data;
        }, function () {
            $scope.loading = false;
            alert('Error getLoanProductClassifications');
        });
    };
}]);