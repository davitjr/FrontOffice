app.controller('InsuranceCtrl', ['$scope', 'insuranceService', '$state', function ($scope, insuranceService, $state) {
    $scope.filter = 1;

    $scope.showDelete = false;

    $scope.getInsurances = function () {
        $scope.loading = true;
        var Data = insuranceService.getInsurances($scope.filter);
        Data.then(function (dep) {
            if ($scope.filter == 1) {
                $scope.insurances = dep.data;
            }
            else if ($scope.filter == 2) {
                $scope.closedInsurances = dep.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getInsurances');
        });
    };



    $scope.$watch('isPaidInsurance', function (val) {
        if (val)
            $scope.getPaidInsurance($scope.productId);
    });

    $scope.getPaidInsurance = function (loanProductId) {
        $scope.loading = true;
        var Data = insuranceService.getPaidInsurance(loanProductId);
        Data.then(function (dep) {
            $scope.insurances = dep.data;
            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getPaidInsurance');
        });
    };


    $scope.getInsurance = function (productId) {
        $scope.loading = true;
        var Data = insuranceService.getInsurance(productId);
        Data.then(function (dep) {
            $scope.insurance = dep.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };

    $scope.HasPermissionForDelete = function () {
        var Data = insuranceService.HasPermissionForDelete();
        Data.then(function (dep) {
            $scope.showDelete = dep.data;
            if ($scope.showDelete == "True") {
                $scope.showDelete = true;
            }
            else {
                $scope.showDelete = false;
            }
        }, function () {
            alert('Error');
        });
    }


    $scope.setClickedRow = function (index, insurances) {
        $scope.selectedRow = index;
        $scope.selectedProductId = insurances.ProductId;
        $scope.selectedRowClose = null;
    }


    $scope.setClickedRowClose = function (index, insurances) {
        $scope.selectedRow = index;
        $scope.selectedProductId = insurances.ProductId;
        $scope.setClickedRow = null;
    }


    $scope.openInsuranceDetails = function () {
        $state.go('insuranceDetails', {
            productId: $scope.selectedProductId
        });
    };


    $scope.QualityFilter = function () {
        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.getInsurances();
    };

    $scope.Remove = function (insuranceid) {
        insuranceid = $scope.insurance.ProductId;
        var Data = insuranceService.deleteInsurance(insuranceid);
        Data.then(function (dep) {
            alert('Removed');
            $state.go("allProducts");
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };


}]);