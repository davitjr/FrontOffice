app.controller("CreditLineCtrl", ['$scope', 'creditLineService', '$location', 'loanService', '$confirm', 'dialogService', 'paymentOrderService', 'utilityService', '$http', '$state', 'ReportingApiService', function ($scope, creditLineService, $location, loanService, $confirm, dialogService, paymentOrderService, utilityService, $http, $state, ReportingApiService) {

    $scope.filter = 1;
    try {
        $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.isOnlineAcc = "0";
    }
    $scope.getCreditLines = function () {
        $scope.loading = true;
        var Data = creditLineService.getCreditLines($scope.filter);
        Data.then(function (creditlines) {
            if ($scope.filter == 1) {
                $scope.creditlines = creditlines.data;
                $scope.closingCreditLines = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingCreditLines = creditlines.data;
            }

            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };

    $scope.getCBKursForDate = function (date, currency) {
        var Data = loanService.getCBKursForDate(date, currency);
        Data.then(function (kurs) {
            $scope.kurs = kurs.data;
        }, function () {
            alert('Error getCBKursForDate');
        });
    };


    $scope.getCreditLine = function (productId) {
        if ($scope.creditline == null || $scope.openedCreditLine == true) {
            if ($scope.creditline == null) {
                $scope.loading = true;
            }
            var Data = creditLineService.getCreditLine(productId);
            Data.then(function (lines) {
                $scope.creditline = lines.data;
                $scope.creditline = forTotal($scope.creditline, utilityService);
                $scope.params = { selectedCreditLine: $scope.creditline }
                $scope.getCBKursForDate(
                    new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                    $scope.creditline.Currency);
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error');
            });
        }
        else {
            $scope.getCBKursForDate(new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)), $scope.creditline.Currency);
            $scope.creditline = forTotal($scope.creditline, utilityService);

            $scope.params = { selectedCreditLine: $scope.creditline }
        }

    };

    $scope.getCreditLineGrafik = function () {
        $scope.loading = true;
        var Data = creditLineService.getCreditLineGrafik($scope.selectedCreditLine);
        Data.then(function (crd) {
            $scope.creditlinegrafik = crd.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };

    $scope.getCreditLineGrafikApplication = function () {
        showloading();
        var Data = creditLineService.getCreditLineGrafikApplication($scope.creditline.LoanAccount.AccountNumber, new Date(parseInt($scope.creditline.StartDate.substr(6))));
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 150, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error getCreditLineGrafikApplication');
        });
    };


    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.selectedStartCapital = $scope.creditlines[index].StartCapital;
        $scope.selectedProductId = $scope.creditlines[index].ProductId;
        $scope.params = { selectedProductId: $scope.creditlines[index].ProductId, selectedCreditLine: $scope.creditlines[index] }
        $scope.selectedRowClose = null;
        $scope.selectedCreditLineIsAccessible = $scope.creditlines[index].isAccessible;

    }
    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.ClosedCreditLine = $scope.closingCreditLines[index];
        $scope.selectedProductId = $scope.closingCreditLines[index].ProductId;
        $scope.selectedCreditLineIsAccessible = $scope.closingCreditLines[index].isAccessible;
    }
    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getCreditLines();
    }

    $scope.saveCreditLineTerminationOrder = function (productId) {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Դադարեցնե՞լ տվյալ վարկային գիծը' })
                .then(function () {
                    showloading();
                    var Data = creditLineService.saveCreditLineTerminationOrder(productId);
                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data)) {
                            $scope.path = '#Orders';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            refresh(142);
                            //CloseBPDialog('saveCreditLineTerminationOrder');
                        }
                        else {
                            $scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                            //refresh(142);
                        }

                    }, function () {
                        hideloading();
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error saveCreditLineTerminationOrder');
                    });
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.IsCreditLineActivateOnApiGate = function (orderId) {
        var Data = creditLineService.IsCreditLineActivateOnApiGate(orderId);
        Data.then(function (acc) {
            if (acc.data == "True")
                $scope.isApiGate = 0
            else if (acc.data == "False")
                $scope.isApiGate = 1
        }, function () {
            alert('Error IsCreditLineActivateOnApiGate');
        });
    };

    $scope.getCreditLineTerminationApplication = function () {
        showloading();
        var Data = creditLineService.getCreditLineTerminationApplication($scope.cardnumber);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 12, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error getCreditLineTerminationApplication');
        });
    };

    $scope.getClosedCreditLines = function (cardNumber) {
        var Data = creditLineService.getClosedCreditLines(cardNumber);
        Data.then(function (closedCreditLines) {
            $scope.closedCreditLines = closedCreditLines.data;
        }, function () {
            alert('Error getClosedCreditLines');
        });
    };


    $scope.callbackgetCreditLine = function () {
        $scope.openedCreditLine = true;
        $scope.getCreditLine($scope.productid);
    }

    $scope.callbackgetCreditLines = function () {
        $scope.getCreditLines();
    }

    $scope.callbackgetCreditLineTerminationOrder = function () {
        $scope.getCreditLineTerminationOrder($scope.selectedOrderId);
    };


    $scope.getCreditLineTerminationOrder = function (orderID) {
        var Data = creditLineService.getCreditLineTerminationOrder(orderID);
        Data.then(function (rep) {
            $scope.order = rep.data;
            if (($scope.$root.SessionProperties.IsCalledFromHB != true) || ($scope.$root.SessionProperties.IsCalledFromHB == true && $scope.order.Quality == 30)) {
                $scope.getClosedCreditLine($scope.order.ProductId);
            }
            else {
                $scope.getCreditLineForHB($scope.order.ProductId);
            }

        }, function () {
            alert('Error getCreditLineTerminationOrder');
        });
    };

    $scope.getCreditLineForHB = function (productId) {

        var Data = creditLineService.getCreditLine(productId);
        Data.then(function (lines) {
            $scope.closedCreditLine = lines.data;
            $scope.closedCreditLine = forTotal($scope.closedCreditLine, utilityService);
            $scope.getCBKursForDate(
                new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                $scope.closedCreditLine.Currency);
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };


    $scope.getClosedCreditLine = function (productId) {

        var Data = creditLineService.closedCreditLine(productId);
        Data.then(function (lines) {
            $scope.closedCreditLine = lines.data;
            $scope.closedCreditLine = forTotal($scope.closedCreditLine, utilityService);
            $scope.getCBKursForDate(
                new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                $scope.closedCreditLine.Currency);
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };

    $scope.getDecreaseLoanGrafik = function () {

        var Data = creditLineService.getDecreaseLoanGrafik($scope.selectedCreditLine);
        Data.then(function (rep) {
            $scope.decreaseLoanGrafik = rep.data;
            var sum1 = 0;

            for (var i = 0; i < rep.data.length; i++) {
                sum1 += rep.data[i].TotalRepayment;
            }
            $scope.sum1 = sum1;

        }, function () {
            alert('Error getDecreaseLoanGrafik');
        });
    };

    $scope.openCreditLineDetails = function () {
        $state.go('creditLineDetails', { productId: $scope.selectedProductId, closedCreditLine: $scope.ClosedCreditLine });
    };



    $scope.sendLoanDigitalContract = function (productId) {
        $confirm({ title: 'Հաստատե՞լ', text: 'Հաճախորդի անձնական Էլեկտրոնային հասցեին ուղարկվելու է պայմանագրերի փաթեթ։' })
            .then(function () {
                showloading();
                var Data = creditLineService.sendLoanDigitalContract(productId);
                Data.then(function (res) {
                    hideloading();
                    if (validate($scope, res.data)) {
                        ShowToaster('Ուղարկված է։', 'success');
                    }
                    else {
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }


                }, function (acc) {
                    hideloading();
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                });
            });

    };

    $scope.getLoanRepaymentDelayDetails = function (productId) {

        var Data = loanService.getLoanRepaymentDelayDetails(productId);
        Data.then(function (acc) {
            $scope.loanRepaymentDelayDetails = acc.data;
        }, function () {
            alert('Error getLoanRepaymentDelayDetails');
        });
    };


}]);