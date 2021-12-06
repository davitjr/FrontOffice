app.controller("DepositaryAccountCtrl", ['$scope', '$confirm', 'depositaryAccountService','bondService','customerService', 'infoService', '$filter', '$http', '$rootScope', '$state', function ($scope, $confirm, depositaryAccountService,bondService,customerService, infoService, $filter, $http, $rootScope, $state) {


    $scope.getDepositaryAccountById = function (id) {
        var Data = depositaryAccountService.getDepositaryAccountById(id);
        Data.then(function (depoAccount) {
            $scope.depositaryAccount = depoAccount.data;
        }, function () {
            alert('Error getDepositaryAccountById');
        });
    };



    $scope.getCustomerDepositaryAccount = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (res) {
            $scope.customerNumber = res.data;
            var Data = bondService.getCustomerDepositaryAccount($scope.customerNumber);
            Data.then(function (acc) {
                $scope.depoAccount = acc.data;
        });
        }, function () {
            alert('Error getCustomerDepositaryAccount');
        });
    };

    $scope.getCustomerDepositaryAccounts = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (res) {
            $scope.customerNumber = res.data;
            var Data = bondService.getCustomerDepositaryAccounts($scope.customerNumber);
            Data.then(function (acc) {
                $scope.depoAccounts = acc.data;
            });
        }, function () {
            alert('Error getCustomerDepositaryAccounts');
        });
    };

    $scope.setClickedRow = function (index) {
        
        $scope.selectedRow = index;
        $scope.currentDepositaryAccount = $scope.depoAccounts[index];
    };



    $scope.openDepositaryAccountDetails = function () {
        $state.go('depositaryAccountDetails', { ProductId: $scope.currentDepositaryAccount.ID });

    };

}]);
