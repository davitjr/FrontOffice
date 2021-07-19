app.controller("DepositDataChangeOrderCtrl", ['$scope', '$http', 'depositDataChangeOrderService', 'infoService', 'depositOrderService', 'accountService', 'customerService', function ($scope, $http, depositDataChangeOrderService, infoService, depositOrderService, accountService, customerService) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    
    if ($scope.deposit != undefined) {
        $scope.order.Deposit =angular.copy($scope.deposit);
    }

    $scope.getDepositDataChangeOrder = function (orderId) {
        var Data = depositDataChangeOrderService.getDepositDataChangeOrder(orderId);
        Data.then(function (dep) {
            $scope.order = dep.data;
        }, function () {
            alert('Error getDepositDataChangeOrder');
        });
    };


    $scope.saveDepositDataChangeOrder = function () {
        $scope.order.Type = 148;
        $scope.order.SubType = 1;
        
        $scope.order.FieldType = $scope.fieldType;
        if ($http.pendingRequests.length == 0) {
            document.getElementById("depositDataChangeOrderLoad").classList.remove("hidden");
            var Data = depositDataChangeOrderService.saveDepositDataChangeOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("depositDataChangeOrderLoad").classList.add("hidden");
                    CloseBPDialog('depositDataChangeOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("depositDataChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("depositDataChangeOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveDepositDataChangeOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }


    $scope.getDepositDataChangeFieldTypeDescription = function (type) {
        var Data = infoService.getDepositDataChangeFieldTypeDescription(type);
        Data.then(function (dep) {
            $scope.depositDataChangeFieldTypeDescription = dep.data;
        }, function () {
            alert('Error getDepositDataChangeOrder');
        });
    };


    $scope.getAccountsForPercentAccount = function () {
        $scope.depositOrder = {};
        $scope.depositOrder.Deposit = {};
        $scope.depositOrder.Currency = $scope.order.Deposit.Currency;
        if ($scope.deposit.JointType == 1 || $scope.deposit.JointType == 2) {
            $scope.depositOrder.ThirdPersonCustomerNumbers = [];
            $scope.depositOrder.AccountType = $scope.deposit.JointType;
            var Data = accountService.getAccountJointCustomers($scope.deposit.DepositAccount.AccountNumber);
            Data.then(function (acc) {
                $scope.jointPersons = acc.data;
                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function(user) {
                    $scope.customerNumber = user.data;
                    for (var i = 0; i < $scope.jointPersons.length; i++) {
                        if ($scope.jointPersons[i].CustomerNumber != $scope.customerNumber) {
                            $scope.ThirdPerson = { Key: $scope.jointPersons[i].CustomerNumber, Value: "" };
                            $scope.depositOrder.ThirdPersonCustomerNumbers.push($scope.ThirdPerson);
                        }

                    }
                    var Data = depositOrderService.getAccountsForPercentAccount($scope.depositOrder);
                    Data.then(function(acc) {
                            $scope.percentAccounts = acc.data;
                        },
                        function() {
                            alert('Error');
                        });

                });
            }, function () {

                alert('Error getCurrentAccount');
            });

        }
        else {
            var Data = depositOrderService.getAccountsForPercentAccount($scope.depositOrder);
            Data.then(function (acc) {
                $scope.percentAccounts = acc.data;
            }, function () {
                alert('Error');
            });

        }

    };


    $scope.GetAccountsForNewDeposit = function () {
        $scope.depositOrder = {};
        $scope.depositOrder.Deposit = {};
        $scope.depositOrder.Currency = $scope.deposit.Currency;
        if ($scope.deposit.JointType == 1 || $scope.deposit.JointType == 2) {
            $scope.depositOrder.ThirdPersonCustomerNumbers = [];
            $scope.depositOrder.AccountType = $scope.deposit.JointType;
            var Data = accountService.getAccountJointCustomers($scope.deposit.DepositAccount.AccountNumber);
            Data.then(function (acc) {
                $scope.jointPersons = acc.data;

                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function(user) {

                    $scope.customerNumber = user.data;

                    for (var i = 0; i < $scope.jointPersons.length; i++) {
                        if ($scope.jointPersons[i].CustomerNumber != $scope.customerNumber) {
                            $scope.ThirdPerson = { Key: $scope.jointPersons[i].CustomerNumber, Value: "" };
                            $scope.depositOrder.ThirdPersonCustomerNumbers.push($scope.ThirdPerson);
                        }

                    }

                    var Data = depositOrderService.GetAccountsForNewDeposit($scope.depositOrder);
                    Data.then(function(acc) {
                            $scope.debitAccounts = acc.data;
                        },
                        function() {
                            alert('Error');
                        });

                });
            }, function () {

                alert('Error getCurrentAccount');
            });

        }
        else {
            var Data = depositOrderService.GetAccountsForNewDeposit($scope.depositOrder);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;
            }, function () {
                alert('Error');
            });

        }

    };


}]);