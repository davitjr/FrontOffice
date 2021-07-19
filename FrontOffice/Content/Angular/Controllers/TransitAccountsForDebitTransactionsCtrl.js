
app.controller("TransitAccountsForDebitTransactionsCtrl", ['$scope', 'transitAccountsForDebitTransactionsService', '$http', '$confirm', 'infoService', '$state', 'accountService', '$filter',
    function ($scope, transitAccountsForDebitTransactionsService, $http, $confirm, infoService, $state, accountService, $filter) {

        $scope.$root.OpenMode = 8;
        if ($scope.isEditAccount == true) {
            $scope.account = angular.copy($scope.transitAccount);
            $scope.account.Description = $scope.transitAccount.TransitAccount.AccountDescription;
            $scope.account.OpenDate = $filter('mydate')($scope.account.OpenDate, "dd/MM/yyyy");
            if ($scope.account.ForAllBranches != true) {
                $scope.account.FilialCode = $scope.account.FilialCode.toString();
            }
            else {
                $scope.account.FilialCode = undefined;
            }
        }
        else {
            $scope.account = {};
            $scope.account.OpenDate = new Date();
            $scope.account.TransitAccount = {};
        }
        $scope.quality = 1;
        if ($scope.isCustomerTransitAccount) {
            $scope.account.IsCustomerTransitAccount = true;
        }
        $scope.getAllTransitAccountsForDebitTransactions = function () {

            var Data = transitAccountsForDebitTransactionsService.getAllTransitAccountsForDebitTransactions($scope.quality);
            Data.then(function (acc) {
                $scope.transitAccounts = acc.data;
            }, function () {
                alert('Error getAllTransitAccountsForDebitTransactions');
            });
        };

        $scope.confirm = false;
        $scope.saveTransitAccountForDebitTransactions = function () {
            if ($http.pendingRequests.length == 0) {
                $scope.error = null;
                document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.remove("hidden");
                var Data = transitAccountsForDebitTransactionsService.saveTransitAccountForDebitTransactions($scope.account, $scope.confirm);
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {

                        document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.add("hidden");
                        CloseBPDialog('newTransitAccount');
                        if ($scope.account.IsCustomerTransitAccount != true) {
                            var refreshScope = angular.element(document.getElementById('TransitAccountsForDebitTransactions')).scope();
                            if (refreshScope != undefined) {
                                refreshScope.quality = 1;
                                refreshScope.getAllTransitAccountsForDebitTransactions();
                            }
                        } else {
                            var refreshScope = angular.element(document.getElementById('transitAccounts')).scope();
                            if (refreshScope != undefined) {
                                refreshScope.getCustomerTransitAccounts();
                            }
                        }
                    }
                    else {
                        document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveTransitAccountForDebitTransactions);

                    }
                }, function () {
                    document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in saveDepositCaseOrder');
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        };

        $scope.updateTransitAccountForDebitTransactions = function () {
            if ($http.pendingRequests.length == 0) {

                $scope.error = null;
                document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.remove("hidden");
                var Data = transitAccountsForDebitTransactionsService.updateTransitAccountForDebitTransactions($scope.account);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.add("hidden");
                        CloseBPDialog('newTransitAccount');

                        var refreshScope = angular.element(document.getElementById('TransitAccountsForDebitTransactions')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.quality = 1;
                            refreshScope.getAllTransitAccountsForDebitTransactions();
                        }
                    }
                    else {
                        document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    document.getElementById("InputTransitAccountsForDebitTransactionsLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in updateDepositCaseOrder');
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        };


        $scope.getFilialList = function () {

            var Data = infoService.GetFilialList();
            Data.then(function (acc) {
                $scope.filialList = acc.data;
            }, function () {
                alert('Error getFilialList');
            });

        };


        $scope.$watch('account.TransitAccount.AccountNumber', function (val) {
            if (val != undefined && $scope.isCustomerTransitAccount != true && $scope.account.ForAllBranches != true) {
                $scope.account.FilialCode = val.substr(0, 5);
            }
        });



        $scope.closeTransitAccountForDebitTransactions = function (selectdedTransitAccount) {
            if ($http.pendingRequests.length == 0) {
                $confirm({ title: 'Շարունակե՞լ', text: 'Դադարեցնել հաշվի օգտագործումը' })
                    .then(function () {
                        showloading();

                        $scope.closedAccount = angular.copy(selectdedTransitAccount)
                        $scope.closedAccount.ClosingDate = new Date();
                        $scope.error = null;

                        var Data = transitAccountsForDebitTransactionsService.closeTransitAccountForDebitTransactions($scope.closedAccount);
                        Data.then(function (res) {
                            if (validate($scope, res.data)) {
                                hideloading();
                                $scope.getAllTransitAccountsForDebitTransactions();
                            }
                            else {
                                hideloading();
                                $scope.showError = true;
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                            }
                        }, function () {
                            hideloading();
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            alert('Error in saveDepositCaseOrder');
                        });
                    });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

            }
        };
        $scope.getTransitAccountsForDebitTransactions = function () {

            var Data = transitAccountsForDebitTransactionsService.getTransitAccountsForDebitTransactions();
            Data.then(function (acc) {
                $scope.transitAccounts = acc.data;
            }, function () {
                alert('Error getTransitAccountsForDebitTransactions');
            });

        };

        $scope.setClickedRow = function (index, account) {
            $scope.selectedRow = index;
            $scope.selectdedTransitAccount = account;
            $scope.selectedAccountNumber = account.AccountNumber;
            $scope.selectedAccountIsAccessible = account.isAccessible;

        };

        $scope.getCurrencies = function () {
            var Data = infoService.getCurrencies();
            Data.then(function (rep) {
                $scope.currencies = rep.data;
            }, function () {
                alert('Error getSourceDescription');
            });
        };

        $scope.openTransitAccountDetails = function () {
            $state.go('transitAccountDetails', { selectedAccount: $scope.selectedAccountNumber });
        }


        $scope.getAccount = function (accountNumber) {
            $scope.loading = true;
            var Data = accountService.getAccount(accountNumber);
            Data.then(function (acc) {
                $scope.account = acc.data;
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error getAccount');
            });
        };

        $scope.reopenTransitAccountForDebitTransactions = function (selectdedTransitAccount) {
            if ($http.pendingRequests.length == 0) {
                $confirm({ title: 'Շարունակե՞լ', text: 'Վերագրանցե՞լ հաշիվը' })
                    .then(function () {
                        showloading();
                        $scope.reopenAccount = angular.copy(selectdedTransitAccount);
                        $scope.reopenAccount.ClosingDate = null;
                        $scope.error = null;

                        var Data = transitAccountsForDebitTransactionsService.reopenTransitAccountForDebitTransactions($scope.reopenAccount);
                        Data.then(function (res) {
                            if (validate($scope, res.data)) {
                                hideloading();
                                $scope.getAllTransitAccountsForDebitTransactions();
                            }
                            else {
                                hideloading();
                                $scope.showError = true;
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                            }
                        }, function () {
                            hideloading();
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            alert('Error in reopenTransitAccountForDebitTransactions');
                        });
                    });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

            }
        };

    }]);