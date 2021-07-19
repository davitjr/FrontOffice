app.controller("ReceivedBankMailTransfersCtrl",['$scope', 'receivedBankMailTransfersService', 'infoService',  'customerService',   '$filter',  'dialogService', 'casherService', '$rootScope',function ($scope, receivedBankMailTransfersService, infoService, customerService, $filter, dialogService, casherService, $rootScope) {

    $rootScope.OpenMode = 3;

    $scope.selectedTransfer = null;

    var DataCust = customerService.getAuthorizedCustomerNumber();
    DataCust.then(function(cust) {
        if (cust.data == undefined || cust.data == 0 || cust.data == null)
            $scope.isCustomer = false;
        else
            $scope.isCustomer = true;
    });
 
    $scope.filter = {
        DateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        DateTo: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        Status: "2",
        //Filial: "22000",
    };


    //Արժույթները
    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filials = ref.data;
            $scope.filialList = [];

            $scope.filialList = [
                   { id: '', name: 'Բոլորը' },
                   { id: '99', name: 'Միայն մասնաճյուղերը' }
                   ];
         
            for ( i in $scope.filials) {
                $scope.fil = { id: i, name: i }
                $scope.filialList.push($scope.fil);
            }
 

            var Data = casherService.getUserFilialCode();
            Data.then(function (user) {
                $scope.Filial = user.data;
                $scope.filter.Filial = JSON.stringify($scope.Filial);

            }, function () {
                alert('Currencies Error');
            });
        }, function () {
            alert('Error getFilialList');
        });
    };
    $scope.getTransfers = function () {
        $scope.loading = true;
        $scope.transfers = null;
        $scope.showCount = false;
        $scope.TotalAmount = 0;
        $scope.transfersShow = 0;
        $scope.transfersCount = 0; 
        var Data = receivedBankMailTransfersService.getTransferList($scope.filter);
        Data.then(function (transferList) {
            $scope.transfers = transferList.data;
            $scope.transfersShow = $scope.transfers.length;

            for (var i = 0; i < $scope.transfers.length; i++) {
                $scope.TotalAmount += $scope.transfers[i].Amount;
            }
            if ($scope.transfers.length != 0) {
                $scope.transfersCount = $scope.transfers[0].ListCount;
                if ($scope.transfersShow < $scope.transfersCount)
                    $scope.showCount = true;
            }
            else {
                $scope.transfersCount = 0;
            }
            $scope.loading = false;


        },
        function () {
            $scope.loading = false;
            alert('Error getTransfers');
        });

    };


    $scope.showModalOrder = function () {
        $scope.error = "";

        var temp = '/ReceivedBankMailTransfers/TransferDetails';
        var cont = 'ReceivedBankMailTransfersCtrl';
        var id = 'ReceivedBankMailTransfersDetails';
        var title = 'Փոխանցման մանրամասներ';



        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };

        dialogService.open(id, $scope, title, temp, dialogOptions);
    };


    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;

        $scope.selectedTransferId = $scope.transfers[index].ID;
 
 
            $scope.params = { selectedTransferId: $scope.selectedTransferId };
 
    }

    $scope.getTransfer = function (transferID) {
        var Data = receivedBankMailTransfersService.getTransfer(transferID);
        Data.then(function (acc) {

            $scope.transfer = acc.data;
            $scope.transfer.RegistrationDate = $filter('mydate')($scope.transfer.RegistrationDate, "dd/MM/yyyy"); 
        }, function () {
            alert('Error getFastTransferPaymentOrder');
        });

    };

    $scope.printTransfer = function (transferID) {

        showloading();
        var Data = receivedBankMailTransfersService.printTransfer(transferID);
      ShowPDF(Data);

    };
}]);