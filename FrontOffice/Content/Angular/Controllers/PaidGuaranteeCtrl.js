app.controller("PaidGuaranteeCtrl", ['$scope', 'paidGuaranteeService', 'loanService', '$state', function ($scope, paidGuaranteeService, loanService, $state) {

    $scope.filter = 1;
    try {
        $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.isOnlineAcc = "0";
    }
    //To Get All Records  
    $scope.getPaidGuarantees = function () {
        $scope.loading = true;
        var Data = paidGuaranteeService.getPaidGuarantees($scope.filter);
        Data.then(function (accr) {
            if ($scope.filter == 1) {
                $scope.paidGuarantees = accr.data;
                $scope.closingPaidGuarantees = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingPaidGuarantees = accr.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getPaidGuarantees');
        });
    }

    $scope.getPaidGuarantee = function (productId) {
        if ($scope.paidGuarantee == null) {
            $scope.loading = true;
                    var Data = paidGuaranteeService.getPaidGuarantee($scope.productId);
                    Data.then(function (accr) {
                        $scope.paidGuarantee = accr.data;

                        if ($scope.paidGuarantee.Currency != 'AMD') {
                            $scope.getCBKursForDate(
                                new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                                $scope.paidGuarantee.Currency);

                        }

                        $scope.loading = false;

                    }, function () {
                        $scope.loading = false;
                        alert('Error getPaidGuarantee');
                    });
        }
        else {
            if ($scope.paidGuarantee.Currency != 'AMD') {
                $scope.getCBKursForDate(
                    new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                    $scope.paidGuarantee.Currency);

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
        $scope.selectedProductId = $scope.paidGuarantees[index].ProductId;
        $scope.params = { selectedPaidGuarantee: $scope.paidGuarantees[index] }; 
        $scope.selectedRowClose = null;
        $scope.selectedPaidGuaranteesIsAccessible = $scope.paidGuarantees[index].isAccessible;
        $scope.selectedPaidGuarantee = $scope.paidGuarantees[index];
        $scope.selectedQuality = $scope.selectedPaidGuarantee.Quality;

    }

    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedClosedPaidGuarantee = $scope.closingPaidGuarantees[index];
        $scope.selectedPaidGuaranteesIsAccessible = $scope.closingPaidGuarantees[index].isAccessible;
    }

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getPaidGuarantees();
    };

    $scope.openPaidGuaranteeDetails = function () {
        $state.go('paidGuaranteeDetails', { productId: $scope.selectedProductId, closedPaidGuarantee: $scope.selectedClosedPaidGuarantee });
    };

    $scope.callbackgetPaidGuarantee = function () {
        $scope.getPaidGuarantee($scope.productId);
    }

    $scope.callbackgetPaidGuarantees = function () {
        $scope.paidGuarantee = null;
        $scope.getPaidGuarantees();
    }
}])