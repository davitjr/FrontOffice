app.controller("TransferCallContractOrderCtrl", ['$scope', 'transferCallContractOrderService', 'infoService', 'dateFilter', 'paymentOrderService', '$http', '$filter', function ($scope, transferCallContractOrderService, infoService, dateFilter, paymentOrderService, $http, $filter) {


    $scope.order = {};
    $scope.order.Type = $scope.orderType;
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    if ($scope.orderType == 96) {
        $scope.order.TransferCallContractDetails = {};
        $scope.order.TransferCallContractDetails.ContractDate = $scope.order.OperationDate;
    }
    else if ($scope.orderType == 97) {
        $scope.order.TransferCallContractDetails = {};
        $scope.order.TransferCallContractDetails = angular.copy($scope.transferCallContract);
        $scope.order.TransferCallContractDetails.ContractDate =
            $filter('mydate')($scope.order.TransferCallContractDetails.ContractDate, "dd/MM/yyyy");
        $scope.order.TransferCallContractDetails.ClosingDate = $scope.$root.SessionProperties.OperationDate;
    }
    

    $scope.saveTransferCallContractOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.order.SubType = 1;
            document.getElementById("transferCallContractLoad").classList.remove("hidden");
            var Data = transferCallContractOrderService.saveTransferCallContractOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("transferCallContractLoad").classList.add("hidden");
                    CloseBPDialog('newTransferCallContractOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("transferCallContractLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("transferCallContractLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAccount');
            });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.getTransferCallContractOrder = function (orderID) {
        var Data = transferCallContractOrderService.getTransferCallContractOrder(orderID);
        Data.then(function (acc) {
            $scope.order = acc.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getRemovalOrder');
        });
    };



    $scope.saveTransferCallContractTerminationOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.order.SubType = 1;
            document.getElementById("transferCallContractTerminationLoad").classList.remove("hidden");
            var Data = transferCallContractOrderService.saveTransferCallContractTerminationOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("transferCallContractTerminationLoad").classList.add("hidden");
                    CloseBPDialog('newTransferCallContractTerminationOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("transferCallContractTerminationLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("transferCallContractTerminationLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAccount');
            });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.getTransferCallContractTerminationOrder = function (orderID) {
        var Data = transferCallContractOrderService.getTransferCallContractTerminationOrder(orderID);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getRemovalOrder');
        });
    };



    $scope.getAccountsForOrder = function () {
        var Data = paymentOrderService.getAccountsForOrder(96, 1, 1);
        Data.then(function (acc) {
            $scope.accounts = acc.data;
        }, function () {
            alert('Error getaccounts');
        });
    };

    $scope.getLastKeyNumber = function () {
        var Data = infoService.getLastKeyNumber(51);
        Data.then(function(key) {
                $scope.lastKeyNumber = key.data;
                $scope.order.TransferCallContractDetails.ContractNumber = $scope.lastKeyNumber;
            },
            function() {
                alert('error keynumber');
            });
    }
    if ($scope.orderType == 96) {
        $scope.getLastKeyNumber();
    }

    $scope.transferCallContractPrint = function (transferCallContract) {
        showloading();
        var Data = transferCallContractOrderService.transferCallContract(transferCallContract);
        ShowPDF(Data);

    };


}]);