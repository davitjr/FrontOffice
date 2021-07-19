app.controller("PeriodicTransferCtrl", ['$scope', 'periodicTransferService', 'dialogService', '$http', 'infoService', '$state', function ($scope, periodicTransferService, dialogService, $http, infoService, $state) {

    $scope.filter = 1;
    //To Get All Records  

    $scope.GetPeriodicTransfers = function () {
        $scope.loading = true;
        var Data = periodicTransferService.getPeriodicTransfers($scope.filter);
        Data.then(function (periodictransfer) {
            if ($scope.filter==1) {
                $scope.periodictransfers = periodictransfer.data;
                $scope.closingPeriodicTransfers = [];
            }
            else if ($scope.filter==2) {
                $scope.closingPeriodicTransfers = periodictransfer.data;
            }
            
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error GetPeriodicTransfers');
        });
    };

    $scope.setClickedRow = function (index, transfer) {
        $scope.selectedRow = index;
        $scope.selectedProductId = transfer.ProductId;
        $scope.selectedRowClose = null;
    };

    $scope.setClickedRowClose = function (index, transfer) {
        $scope.selectedRowClose = index;
        $scope.selectedProductId = transfer.ProductId;
        $scope.selectedRow = null;
        $scope.selectedPeriodic = transfer;
    };

    $scope.getPeriodicTransfer = function (productID) {
        $scope.dateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        $scope.dateTo = new Date();
        if ($scope.periodic==null) {
            var Data = periodicTransferService.getPeriodicTransfer(productID);
                    Data.then(function (acc) {
                        $scope.periodic = acc.data;
                        $scope.params = { periodic: $scope.periodic };
                    }, function () {
                        alert('Error getPeriodicTransfer');
                    });
        }
        else
            $scope.isClosed = true;
        
    };
    $scope.getTransfersHistory = function (productID) {
        showloading();
        var Data = periodicTransferService.GetTransfersHistory(productID, $scope.dateFrom, $scope.dateTo);
        Data.then(function (his) {

            $scope.transfersHistory = his.data;
            hideloading();
        }, function () {
            hideloading();
            alert('Error getTransfersHistory');
        });
    };
    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.GetPeriodicTransfers();
    }

    $scope.getPeriodicTransferDetails = function (productId) {
        showloading();
        var Data = periodicTransferService.getPeriodicTransferDetails(productId);
        ShowPDF(Data);
    };

    $scope.getPeriodicTransferClosingDetails = function (productId) {
        showloading();
        var Data = periodicTransferService.getPeriodicTransferClosingDetails(productId);
        ShowPDF(Data);
    };

    $scope.getPeriodicSWIFTStatementTransferDetails = function (productId) {
        showloading();
        var Data = periodicTransferService.getPeriodicSWIFTStatementTransferDetails(productId);
        ShowPDF(Data);
    };


    $scope.savePeriodicTerminationOrder = function () {
        if ($http.pendingRequests.length == 0) {


            showloading();
            var Data = periodicTransferService.savePeriodicTerminationOrder($scope.periodic);
            Data.then(function (res) {
                hideloading();
                if (validate($scope, res.data)) {
                    CloseBPDialog('periodicTermination');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(11);
                }
                else {
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել',$scope, 'error');
                }

            }, function () {
                hideloading();
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error terminateDeposit');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getPeriodicTerminationOrder = function (orderId) {
        var Data = periodicTransferService.getPeriodicTerminationOrder(orderId);
            Data.then(function (acc) {
                $scope.order = acc.data;
                var PeriodicData = periodicTransferService.getPeriodicTransfer($scope.order.ProductId);
                PeriodicData.then(function (cr) {
                    $scope.periodic = cr.data;

                }, function () { alert('error') });
            }, function () {
                alert('Error getPeriodicTransfer');
            });
        
    };

    $scope.callbackGetPeriodicTransfers = function () {
        $scope.GetPeriodicTransfers();
    }
    $scope.callbackgetPeriodicTransfer = function () {
        $scope.getPeriodicTransfer($scope.productId);
    }

    $scope.callbackgetPeriodicTerminationOrder = function () {
        $scope.getPeriodicTerminationOrder($scope.selectedOrderId);
    };

    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (rep) {
            $scope.currencies = rep.data;
        }, function () {
            alert('Error getSourceDescription');
        });
    };

    $scope.openPeriodicTransferDetails = function () {
        $state.go('periodicdetails', { productId: $scope.selectedProductId, closedPeriodic: $scope.selectedPeriodic });
    };
    
}]);
