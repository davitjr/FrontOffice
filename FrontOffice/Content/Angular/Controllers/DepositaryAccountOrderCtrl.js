app.controller("DepositaryAccountOrderCtrl", ['$scope', 'depositaryAccountOrderService', 'infoService','$http', function ($scope, depositaryAccountOrderService, infoService,$http) {

    $scope.banks = [];
    $scope.depositoryAccountOperators = [];
    $scope.order = {};
    $scope.order.AccountNumber = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.hasDepoAccount = undefined;

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


        $scope.getDepositoryAccountOperators = function () {
            var Data = infoService.getDepositoryAccountOperators();
            Data.then(function (b) {
                $scope.depositoryAccountOperators = b.data;

                //$scope.newArray = [];
                //for (var item in $scope.depositoryAccountOperators) {
                //    $scope.newArray.push({ code: item, description: $scope.depositoryAccountOperators[item] });
                //}

            }, function () {
                alert('Error depositoryAccountOperators');
            });
    };


    $scope.saveDepositaryAccountOrder = function (IsOpeningAccInDepo) {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("depositaryAccountOrderSaveLoad").classList.remove("hidden");
            debugger;
            if (IsOpeningAccInDepo === false) {
                $scope.order.AccountNumber.BankCode = $scope.BankCode;
                $scope.order.AccountNumber.Description = $scope.depositoryAccountOperators[$scope.BankCode];
            }
            else {
                $scope.order.AccountNumber.BankCode = "22000";
                $scope.order.AccountNumber.Description = "«ԱԿԲԱ ԲԱՆԿ» ԲԲԸ";            
            }
            $scope.order.AccountNumber.IsOpeningAccInDepo = IsOpeningAccInDepo;


            var Data = depositaryAccountOrderService.saveDepositaryAccountOrder($scope.order);

            Data.then(function (res) {
                
                if (validate($scope, res.data)) {
                    document.getElementById("depositaryAccountOrderSaveLoad").classList.add("hidden");
                    if (IsOpeningAccInDepo === false) {
                        CloseBPDialog('DepositaryAccountOrder');
                    }
                    else {
                        CloseBPDialog('DepositaryNewAccountOrder');
                    }
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

        $scope.checkAndGetDepositaryAccount = function () {
            showloading();
            var Data = depositaryAccountOrderService.checkAndGetDepositaryAccount();
            Data.then(function (acc) {

                if (acc.data != undefined) {
                    var account = acc.data;
                    if (account.AccountNumber != 0) {
                        $scope.saveDepositaryAccountOrder(true);
                        $scope.hasDepoAccount = true;
                    }
                    else {
                        showMesageBoxDialog('Արժեթղթերի հաշիվը գտնված չէ', $scope, 'information');
                        $scope.hasDepoAccount = false;
                    }
                }
                hideloading();
            }, function () {
                hideloading();
                alert('Error checkAndGetDepositaryAccount');
            });
        };
}]);