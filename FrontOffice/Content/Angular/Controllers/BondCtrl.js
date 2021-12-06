app.controller("BondCtrl", ['$scope', '$confirm', 'bondService', 'bondOrderService', 'infoService', '$filter', '$http', '$rootScope', '$state', 'bondIssueService', '$uibModal', function ($scope, $confirm, bondService, bondOrderService, infoService, $filter, $http, $rootScope, $state, bondIssueService, $uibModal) {

    $scope.filter = {
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

	$scope.setClickedRow = function (index, oneBond) {
		$scope.selectedRow = index;
        $scope.currentBond = oneBond;// $scope.bondsList[index];
        $scope.selectedAccountIsAccessible = oneBond.AccountForBond.isAccessible;
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
            $scope.bondQualities = types.data;
        }, function () {
            alert('Error getBondQualityTypes');
        });
    };

    $scope.printStockPurchaseApplication = function () {
        showloading();
        var Data = bondOrderService.getStockPurchaseApplication($scope.bond.ID, $scope.bond.CustomerNumber);
        ShowPDF(Data);
    };

    $scope.confirmStockOrder = function () {
        showloading();
        $scope.error = null;
        var Data = bondService.confirmStockOrder($scope.bond.ID);
        Data.then(function (res) {
            if (validate($scope, res.data)) {
                hideloading();
                showMesageBoxDialog('Բաժնետոմսը հաստատված է։', $scope, 'information');
                CloseBPDialog('oneBondDetails');

                var refreshScope = angular.element(document.getElementById('BondDealing')).scope()
                if (refreshScope != undefined) {
                    refreshScope.getBondsForDealing(refreshScope.filter);
                }

            }
            else {
                hideloading();
                $scope.showError = true;
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            alert('Error confirmStockOrder');
        });
    };

    $scope.searchCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
        if ($scope.filter.CustomerNumber != undefined) {
            $scope.mod = false;
        }

    };

    $scope.getSearchedCustomer = function (customer) {
        $scope.filter.CustomerNumber = parseInt(customer.customerNumber);

        $scope.closeSearchCustomersModal();
    };


}]);