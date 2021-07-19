app.controller("OverdueCtrl",['$scope','$confirm', 'overdueService', function ($scope, $confirm,overdueService) {
    $scope.loading = true;
    $scope.getOverdueDetails = function () {
        var Data = overdueService.getOverdueDetails();
        Data.then(function (overdue) {
            $scope.overduedetails = overdue.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getOverdueDetails');
        });
    }

    $scope.getCurrentProductOverdueDetails = function (productId) {
        var Data = overdueService.getCurrentProductOverdueDetails(productId);
        Data.then(function (overdue) {
            $scope.overduedetails = overdue.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getOverdueDetails');
        });
    }


    $scope.setClickedRowLoan = function (overdue, index) {
        $scope.selectedRow = index
        $scope.productId = overdue.Productid;
        $scope.startDate = overdue.StartDateToString;
    }

    $scope.GenerateLoanOverdueUpdate = function () {
        $confirm({ title: 'Ուշադրություն', text: 'Ուղղե՞լ վարկային պատմությունը ' })
            .then(function () {
                showloading();
                var Data = overdueService.GenerateLoanOverdueUpdate($scope.productId, $scope.startDate, $scope.endDate, $scope.updateReason);
                Data.then(function (overdue) {
                    hideloading();
                    ShowMessage("Ուղղումը կատարվել է:", 'information');
                    CloseBPDialog('loanOverdueUpdate');
                    var refreshScope = angular.element(document.getElementById('overdueData')).scope();
                    refreshScope.getOverdueDetails();
                }, function () {
                    hideloading();
                    ShowMessage('Տեղի ունեցավ սխալ', 'error');
                });
            },
            )
    }
}]);
