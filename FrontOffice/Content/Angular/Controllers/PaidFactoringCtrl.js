app.controller("PaidFactoringCtrl", ['$scope', 'paidFactoringService', 'loanService', '$state', function ($scope, paidFactoringService, loanService, $state) {

    $scope.filter = 1;
    try {
        $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.isOnlineAcc = "0";
    }

    //To Get All Records  
    $scope.getPaidFactorings = function () {
        $scope.loading = true;
        var Data = paidFactoringService.getPaidFactorings($scope.filter);
        Data.then(function (fact) {
            if ($scope.filter == 1) {
                $scope.paidFactorings = fact.data;
                $scope.closingPaidFactorings = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingPaidFactorings = fact.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getFactorings');
        });
    }

    $scope.getPaidFactoring = function (productId) {
        if ($scope.paidFactoring == null) {
            $scope.loading = true;
            var Data = paidFactoringService.getPaidFactoring($scope.productId);
            Data.then(function (fact) {
                $scope.paidFactoring = fact.data;
                if ($scope.paidFactoring.Currency != 'AMD') {
                    $scope.getCBKursForDate(
                        new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                        $scope.paidFactoring.Currency);

                }
                $scope.params = { selectedLoan: $scope.paidFactoring };
                $scope.loading = false;

            }, function () {
                $scope.loading = false;
                alert('Error getFactoring');
            });
        }
        else {
            if ($scope.paidFactoring.Currency != 'AMD') {
                $scope.getCBKursForDate(
                    new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                    $scope.paidFactoring.Currency);
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
        $scope.selectedProductId = $scope.paidFactorings[index].ProductId;
        $scope.selectedRowClose = null;
        $scope.selectedPaidFactoringIsAccessible = $scope.paidFactorings[index].isAccessible;
    }

    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedClosedPaidFactoring = $scope.closingPaidFactorings[index];
        $scope.selectedPaidFactoringIsAccessible = $scope.closingPaidFactorings[index].isAccessible;
    }

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;

        $scope.getPaidFactorings();
    };

    $scope.openPaidFactoringDetails = function () {
        $state.go('paidFactoringDetails', { productId: $scope.selectedProductId, closedPaidFactoring: $scope.selectedClosedPaidFactoring });
    };

}])