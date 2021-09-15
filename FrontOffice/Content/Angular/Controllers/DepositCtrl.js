app.controller("DepositCtrl", ['$scope', 'depositService', 'paymentOrderService', '$location', '$confirm', 'dialogService', 'infoService', '$http', '$state', 'ReportingApiService', function ($scope, depositService, paymentOrderService, $location, $confirm, dialogService, infoService, $http, $state, ReportingApiService) {
    $scope.selectedProductId = null;
    $scope.selectedDepositAccount = null;
    $scope.AccountNumber = null;
    $scope.filter = 1;
    $scope.index;
    if ($scope.currentDeposit != undefined)
    {
        $scope.closedDeposit = angular.copy($scope.currentDeposit);
        $scope.closedDeposit.ClosingReasonType = undefined;
    }


    //To Get All Records  
    $scope.getDeposits = function () {

        $scope.loading = true;
        var Data = depositService.getDeposits($scope.filter);
        Data.then(function (dep) {
            //$scope.productAccess պիտի վերագրվի արժեք բոլոր ֆունկ. համար
            //if (dep.data.productAccess=="false")
            //    $scope.productAccess = false;
            //else
            //    $scope.productAccess = true;
         
            if ($scope.filter==1) {
            $scope.deposits = dep.data;
                $scope.closingDeposits = [];
            }
            else if ($scope.filter==2) {
                $scope.closingDeposits = dep.data;
            }
            
            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getDeposits');
        });
    };


    $scope.setClickedRow = function (index,deposit) {
        $scope.selectedRow = index;
        $scope.selectedProductId = deposit.ProductId;
        $scope.selectedDepositAccount = deposit.DepositAccount.AccountNumber;
        $scope.AccountNumber = deposit.DepositAccount.AccountNumber;
        $scope.params = { AccountNumber: deposit.DepositAccount.AccountNumber };
        $scope.selectedDepositAllowAmountAddition = deposit.AllowAmountAddition;
        $scope.selectedRowClose = null;
        $scope.selectedDepositIsAccessible = deposit.isAccessible;
        $scope.selectedAccountCurrency = deposit.DepositAccount.Currency;
        $scope.selectedDepositDepositNumber = deposit.DepositNumber;
        $scope.selectedDepositKeeperOpen = deposit.KeeperOpen;
        $scope.selectedAccountNumber = deposit.DepositAccount.AccountNumber;
    };

    $scope.terminateDeposit = function () {
        if ($http.pendingRequests.length == 0) {
            //$confirm({ title: 'Շարունակե՞լ', text: 'Դադարեցնե՞լ տվյալ ավանդը' })
            //.then(function () {
            showloading();
            var Data = depositService.terminateDeposit($scope.closedDeposit);
            Data.then(function (res) {
                hideloading();
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    CloseBPDialog('terminatedeposit');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(4);
                }
                else {
                    $scope.showError = true;
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error terminateDeposit');
            });
            // });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getDeposit = function (productID) {
        if ($scope.deposit == null || ($scope.deposit!=undefined && $scope.deposit.ClosingDate==null)) {
            
            if ($scope.deposit == null)
            {
                $scope.loading = true;
            }


            var Data = depositService.getDeposit(productID);
            Data.then(function (dep) {
                $scope.account = { AccountNumber: dep.data.DepositAccount.AccountNumber };
                $scope.deposit = dep.data;
                $scope.deposit.InterestRate = ($scope.deposit.InterestRate * 100).toFixed(2);
                $scope.deposit.CancelRate = ($scope.deposit.CancelRate * 100).toFixed(2);

                //$scope.deposit.StartDate=$filter('mydate')($scope.deposit.StartDate, "dd/MM/yyyy");

                if ($scope.deposit.Currency != 'AMD') {
                    $scope.deposit.CurrentRateValue = $scope.deposit.CurrentRateValue.toFixed(2);
                }
                else {
                    $scope.deposit.CurrentRateValue = $scope.deposit.CurrentRateValue.toFixed(1) + '0';
                }
                if ($scope.deposit.RecontractSign == true) {
                    $scope.deposit.RecontractSign = "Այո";
                } else
                    $scope.deposit.RecontractSign = "Ոչ";
                $scope.params = { AccountNumber: dep.data.DepositAccount.AccountNumber, deposit: $scope.deposit };
                $scope.loading = false;
                $scope.confirmationPersonInit($scope.deposit);
            }, function () {
                $scope.loading = false;
                alert('Error getDeposit');
            });
        }
        else {
            $scope.account = { AccountNumber: $scope.deposit.DepositAccount.AccountNumber };
            $scope.deposit.InterestRate = ($scope.deposit.InterestRate * 100).toFixed(2);
            if ($scope.deposit.Currency != 'AMD') {
                $scope.deposit.CurrentRateValue = $scope.deposit.CurrentRateValue.toFixed(2);
            }
            else {
                $scope.deposit.CurrentRateValue = $scope.deposit.CurrentRateValue.toFixed(1) + '0';
            }
            if ($scope.deposit.RecontractSign == true) {
                $scope.deposit.RecontractSign = "Այո";
            } else
                $scope.deposit.RecontractSign = "Ոչ";
            $scope.params = { AccountNumber: $scope.deposit.DepositAccount.AccountNumber, deposit: $scope.deposit };
            $scope.loading = false;
        }
    };


    $scope.getDepositRepayments = function () {
        var Data = depositService.getDepositRepayments($scope.deposit.ProductId);
        Data.then(function (rep) {
            $scope.repayment = rep.data;
            var sum1 = 0;
            var sum2 = 0;
            var sum3 = 0;

            for (var i = 0; i < rep.data.length; i++) {
                sum1 += rep.data[i].RateRepayment;
                sum2 += rep.data[i].CapitalRepayment;
                sum3 += rep.data[i].ProfitTax;
            }
            $scope.sum1 = sum1;
            $scope.sum2 = sum2;
            $scope.sum3 = sum3;
        }, function () {
            alert('Error getDepositRepayments');
        });
    };
 
    $scope.setClickedRowClose = function (index,deposit) {
        $scope.selectedRowClose = index;
        $scope.selectedClosedDeposit = deposit;
        $scope.selectedRow = null;
        $scope.selectedDepositIsAccessible = deposit.isAccessible;
        $scope.accountFlowDetails = undefined;
        $scope.selectedAccountCurrency = deposit.DepositAccount.Currency;
        $scope.selectedDepositAccount = deposit.DepositAccount.AccountNumber;
        $scope.selectedDepositDepositNumber = deposit.DepositNumber;
        $scope.selectedAccountNumber = deposit.DepositAccount.AccountNumber;
    };
    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getDeposits();
    }

    $scope.depositRepaymentsGrafik = function () {
        showloading();
        var Data = depositService.depositRepaymentsGrafik($scope.deposit.ProductId);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 151, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error depositRepaymentsGrafik');
        });
    };


    $scope.depositCloseApplication = function (depositNumber) {
        showloading();
        var Data = depositService.depositCloseApplication(depositNumber);
        ShowPDF(Data);
    };

    $scope.getDepositContract = function (depositNumber, confirmationPerson) {
        showloading();
        var Data = depositService.getDepositContract(depositNumber, confirmationPerson);
        ShowPDF(Data);
    };

    $scope.getDepositSource = function (productID) {
        var Data = depositService.getDepositSource(productID);
        Data.then(function (rep) {
            $scope.source = rep.data;
            $scope.getSourceDescription($scope.source);
        }, function () {
            alert('Error getDepositSource');
        });
    };

    $scope.getSourceDescription = function (source) {
        var Data = infoService.getSourceDescription(source);
        Data.then(function (rep) {
            $scope.SourceDescription = rep.data;
        }, function () {
            alert('Error getSourceDescription');
        });
    };


    $scope.callbackgetDeposit = function () {
        $scope.getDeposit($scope.productId);
    }

    $scope.callbackgetDeposits = function () {
        $scope.getDeposits();
    }


    $scope.getDepositTerminateOrder = function (orderID) {
        var Data = depositService.getDepositTerminationOrder(orderID);
        Data.then(function (rep) {
            $scope.order = rep.data;
            $scope.getDeposit($scope.order.ProductId);
        }, function () {
            alert('Error getTerminateDepositOrder');
        });
    };


    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (rep) {
            $scope.currencies = rep.data;
        }, function () {
            alert('Error getSourceDescription');
        });
    };


    $scope.openDepositDetails = function () {
        $state.go('depositdetails', { productId: $scope.selectedProductId, deposit: $scope.selectedClosedDeposit });
    }


    $scope.getElementPosition = function (index) {
        var top = $('#depositRow_' + index).position().top;
        if (document.getElementById('accountflowdetails') != undefined)
        document.getElementById('accountflowdetails').setAttribute("style", "margin-top:" + (top + 60).toString() + "px; width: 350px !important;");


    };

    $scope.getDepositClosingReasonTypes = function () {
        var Data = infoService.getDepositClosingReasonTypes();
        Data.then(function (rep) {
            $scope.depositClosingReasonTypes = rep.data;
        }, function () {
            alert('Error getDepositClosingReasonTypes');
        });
    };


    $scope.depositRepaymentsDetailedGrafik = function (exportFormat) {
        showloading();
        var Data = depositService.depositRepaymentsDetailedGrafik($scope.deposit.ProductId, exportFormat);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 99, ReportExportFormat: exportFormat }
            ReportingApiService.getReport(requestObj, function (result) {
                if (exportFormat == 1) {
                    ShowPDFReport(result);
                }
                else if (exportFormat == 2) {
                    ShowExcelReport(result, 'DepositRepaymentsDetailedGrafik');
                }
            });
        }, function () {
            alert('Error depositRepaymentsDetailedGrafik');
        });
    };

    $scope.confirmationPersons = function (confirmationPerson) {
        $scope.confirmationPerson = confirmationPerson;
    };

    $scope.confirmationPersonInit = function (deposit, index) {
        if ($scope.index == undefined || $scope.index != index) {
            if ((deposit.StartCapital > 3000000 && deposit.Currency == 'AMD') || (deposit.StartCapital > 5000 && deposit.Currency == 'USD') ||
                (deposit.StartCapital > 5000 && deposit.Currency == 'EUR') || (deposit.StartCapital > 300000 && deposit.Currency == 'RUR') || deposit.IsVariation == 1) {
                $scope.confirmationPersonsFirstValueVisibility = false;
                $scope.confirmationPerson = '2';
            }
            else {
                $scope.confirmationPersonsFirstValueVisibility = true;
                $scope.confirmationPerson = '1';
            }
            $scope.index = index;
        }
    };

}]);