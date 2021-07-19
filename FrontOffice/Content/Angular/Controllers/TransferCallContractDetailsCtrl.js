app.controller("TransferCallContractDetailsCtrl", ['$scope', 'transferCallContractDetailsService',  function ($scope, transferCallContractDetailsService) {

    $scope.check = 1;

    $scope.getTransferCallContracts = function () {
        var Data = transferCallContractDetailsService.getTransferCallContracts();
        Data.then(function (call) {
            $scope.transferCallContracts = call.data;
        }, function () {
            alert('Error getTransferCallContracts');
        });
    };

    $scope.setClickedRow = function (index, transferCallContract) {
        $scope.selectedRow = index;
        $scope.transferCallContract = transferCallContract;

    };

   

    $scope.accountNoticeForm = function (accountNumber) {
        showloading();
        accountNumber = '( ' + accountNumber + ' )';
        var Data = pensionApplicationService.accountNoticeForm(accountNumber);
        ShowPDF(Data);
    };





}]);