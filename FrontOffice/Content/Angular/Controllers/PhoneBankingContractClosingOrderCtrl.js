app.controller("PhoneBankingContractClosingOrderCtrl", ['$scope', 'dialogService', '$filter', "customerService", '$http', '$q', '$uibModal', 'infoService', 'phoneBankingContractService', function ($scope, dialogService, $filter, customerService, $http, $q, $uibModal, infoService, phoneBankingContractService) {

$scope.setPhoneBankingContractClosingOrder = function () {
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();      

};


$scope.PhoneBankingContractClosing = function (contract) {
    $scope.showError = false;

    if ($http.pendingRequests.length == 0) {

        $scope.order.Type = 128;
        $scope.order.PhoneBankingContractId = contract.Id;
        var Data = phoneBankingContractService.savePhoneBankingContractClosingOrder($scope.order);

        Data.then(function (result) {

            if (validate($scope, result.data)) {
                document.getElementById("phoneBankingContractClosingOrderLoad").classList.add("hidden");
                CloseBPDialog('newphonebankingcontractclosingorder');

                window.location.href = location.origin.toString() + '#/Orders';
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
            }
            else {
                document.getElementById("phoneBankingContractClosingOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            document.getElementById("phoneBankingContractClosingOrderLoad").classList.add("hidden");
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error savePhoneBankingContractClosingOrder');
        });

    }
    else {
        return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

    }
};


$scope.getPhoneBankingContractClosingOrder = function (orderId) {
    var Data = phoneBankingContractService.getPhoneBankingContractClosingOrder(orderId);
    Data.then(function (result) {
        $scope.order = result.data;

        $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
        $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
    }, function () {
        alert('Error getPhoneBankingContractClosingOrder');
    });
};

}]);