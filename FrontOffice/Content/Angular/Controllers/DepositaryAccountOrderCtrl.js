app.controller("DepositaryAccountOrderCtrl", ['$scope', 'depositaryAccountOrderService', 'infoService','$http', function ($scope, depositaryAccountOrderService, infoService,$http) {

    $scope.banks = [];
    $scope.order = {};
    $scope.order.AccountNumber = {};
    


    $scope.getBanks = function () {
        var Data = infoService.getBanks();
        Data.then(function (b) {
            $scope.banks = b.data;

            $scope.newArray = [];
            for (var item in $scope.banks) {
                $scope.newArray.push({ code: item, description: $scope.banks[item] });
            }

        }, function () {
            alert('Error getBanks');
        });
    };
   

    $scope.saveDepositaryAccountOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("depositaryAccountOrderSaveLoad").classList.remove("hidden");
            $scope.order.AccountNumber.BankCode = $scope.BankCode.code;
            $scope.order.AccountNumber.Description = $scope.BankCode.description;
            
            var Data = depositaryAccountOrderService.saveDepositaryAccountOrder($scope.order);

            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("depositaryAccountOrderSaveLoad").classList.add("hidden");
                    CloseBPDialog('DepositaryAccountOrder');
                    showMesageBoxDialog('Արժեթղթերի հաշվի կցման հայտը կատարված է', $scope, 'information');
                    refresh(191);
                }
                else {
                    document.getElementById("depositaryAccountOrderSaveLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function (err) {
                document.getElementById("depositaryAccountOrderSaveLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveDepositaryAccountOrder');
            });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.setCustomerNumber = function (CustomerNumber) {
        $scope.order.CustomerNumber = CustomerNumber;
    }

    $scope.getDepositaryAccountOrder = function (id) {
        var Data = depositaryAccountOrderService.getDepositaryAccountOrder(id);
        Data.then(function (acc) {
            $scope.depositaryAccountOrderDetails = acc.data;
        }, function () {
            alert('Error getDepositaryAccountOrder');
        });

    };
   

}]);