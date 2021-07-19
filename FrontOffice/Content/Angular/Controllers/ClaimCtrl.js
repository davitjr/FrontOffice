app.controller("ClaimCtrl", ['$scope', 'claimService',  function ($scope, claimService) {

    $scope.getProductClaims = function (productId) {
        var Data = claimService.getProductClaims(productId,$scope.loan.ProductType);
        Data.then(function (acc) {

            $scope.claims = acc.data;

            

        }, function () {
            alert('Error GetAccountOrder');
        });
    };

    $scope.changeProblemLoanTaxQuality = function (taxAppId)    {
        var Data = claimService.changeProblemLoanTaxQuality(taxAppId);
        Data.then(function (changeQuality) { 
            if (validate($scope, changeQuality.data)) {
                $scope.getProductClaims($scope.loan.ProductId);
            }
            else {
                $scope.showError = true;
                showMesageBoxDialog('', $scope, 'error');
            }           
        }, function () {
            alert('Error changeProblemLoanTaxQuality');
        });
    };

    $scope.getClaimEvents = function (claimNumber) {
        var Data = claimService.getClaimEvents(claimNumber);
        Data.then(function (acc) {
            $scope.events = acc.data;
            $scope.claims.push($scope.events);
        }, function () {
            alert('Error events');
        });
    };

    $scope.setClickedRow = function (tax) {
        $scope.selectedtax = tax;
    };


    $scope.getTax = function (claimNumber,eventNumber) {
        var Data = claimService.getTax(claimNumber, eventNumber);
            Data.then(function (aa) {
                $scope.tax = aa.data;
            }, function () {
                alert('Error');
            });

    };

    $scope.toggle = function (scope) {
        scope.toggle();
    };


    $scope.$broadcast('angular-ui-tree:collapse-all');


    $scope.getProblemLoanCalculationsDetail = function (claimNumber, eventNumber) {
        var Data = claimService.getProblemLoanCalculationsDetail(claimNumber, eventNumber);
        Data.then(function (aa) {
            $scope.problemLoanCalculationsDetail = aa.data;
        }, function () {
            alert('Error');
        });

    };


}])