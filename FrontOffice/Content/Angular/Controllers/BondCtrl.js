app.controller("BondCtrl", ['$scope', '$confirm', 'bondService', 'infoService', '$filter', '$http', '$rootScope', '$state', 'bondIssueService', function ($scope, $confirm, bondService, infoService, $filter, $http, $rootScope, $state, bondIssueService) {

    $scope.filter = {
        Quality: 0,
        CustomerNumber: "",
        ISIN: ""
    };


    if ($rootScope.OpenMode != 13)  //13 - Դիլինգի պատուհան
    {
        $scope.OpenType = 1;  //Բացվել է հաճախորդի պրոդուկտների միջից
    }
    else {
        $scope.OpenType = 2; //Բացվել է Դիլինգի պատուհանից
    }

    $scope.QualityFilter = '100';


	$scope.setClickedRow = function (index, oneBond) {
		$scope.selectedRow = index;
		$scope.currentBond = oneBond;// $scope.bondsList[index];
    };



    $scope.getBondByID = function (id) {
        var Data = bondService.getBondByID(id);
        Data.then(function (bond) {
            $scope.bond = bond.data;
        }, function () {
            alert('Error getBondByID');
        });
    };

    $scope.getBonds = function () {
        $scope.loading = true;
        var Data = bondService.getBonds($scope.filter);
        Data.then(function (bonds) {

            $scope.bondsList = bonds.data;


            $scope.loading = false;
        },
            function () {
                $scope.loading = false;
                alert('Error getBonds');
            });
    };

    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (currency) {
            $scope.currencies = currency.data;
        }, function () {
            alert('Error getCurrencies');
        });
    };

	$scope.openBondDetails = function () {
		
        $state.go('BondDetails', { ProductId: $scope.currentBond.ID });
    };


    $scope.getBondsForDealing = function (filter) {

        $scope.loading = true;
        var Data = bondService.getBondsForDealing(filter, $scope.bondFilterType);
        Data.then(function (bondsDealingList) {
            $scope.bondsDealingList = bondsDealingList.data;
        },
        function () {
            $scope.loading = false;
            alert('Error getBondsForDealing');
        });
    };



    $scope.initBondFilterForDealing = function () {
        $scope.filter.StartDate = new Date();
        $scope.filter.EndDate = new Date();
    };


    $scope.setClickedRowDealing = function (index) {
        $scope.selectedRow = index;
        $scope.currentBondDealing = $scope.bondsDealingList[index];
    };

    $scope.getBondQualityTypes = function () {
        var Data = infoService.getBondQualityTypes();
        Data.then(function (types) {
            $scope.qualities = types.data;
        }, function () {
            alert('Error getBondQualityTypes');
        });
    };

   

}]);