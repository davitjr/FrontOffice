app.controller("PaidAccreditiveCtrl", ['$scope', 'paidAccreditiveService', 'loanService', '$state', function ($scope, paidAccreditiveService, loanService, $state) {

    $scope.filter = 1;

    //To Get All Records  
    $scope.getPaidAccreditives = function () {
        $scope.loading = true;
        var Data = paidAccreditiveService.getPaidAccreditives($scope.filter);
        Data.then(function (accr) {
            if ($scope.filter == 1) {
                $scope.paidAccreditives = accr.data;
                $scope.closingPaidAccreditives = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingPaidAccreditives = accr.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getPaidAccreditives');
        });
    }

    $scope.getPaidAccreditive = function (productId) {
        if ($scope.paidAccreditive==null) {
             $scope.loading = true;
                    var Data = paidAccreditiveService.getPaidAccreditive($scope.productId);
                    Data.then(function (accr) {
                        $scope.paidAccreditive = accr.data;

                        

                        $scope.loading = false;

                    }, function () {
                        $scope.loading = false;
                        alert('Error getPaidAccreditive');
                    });
        }
        else {
            if ($scope.paidAccreditive.Currency != 'AMD') {
                $scope.getCBKursForDate(
                    new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                    $scope.paidAccreditive.Currency);
            }
        }
       
    }

    $scope.getCBKursForDate = function (date, currency) {
        var Data = loanService.getCBKursForDate(date, currency);
        Data.then(function (kurs) {
            $scope.kurs = kurs.data;
        }, function () {
            alert('Error getCBKursForDate');
        });
    };

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.selectedProductId = $scope.paidAccreditives[index].ProductId;
       // $scope.params = { selectedPaidAccreditive: $scope.paidAccreditives[index] };
        $scope.selectedRowClose = null;
        $scope.selectedPaidAccreditive = $scope.paidAccreditives[index].isAccessible;
    }

    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedClosedPaidAccreditive = $scope.closingPaidAccreditives[index];
        $scope.selectedPaidAccreditive = $scope.closingPaidAccreditives[index].isAccessible;
    }

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getPaidAccreditives();
    };

    $scope.openPaidAccreditiveDetails = function () {
        $state.go('paidAccreditiveDetails', { productId: $scope.selectedProductId, closedPaidAccreditive: $scope.selectedClosedPaidAccreditive });
    };
    $scope.callbackgetPaidAccreditive = function () {
        $scope.paidAccreditive = null;
        $scope.getPaidAccreditive();
    }

}])