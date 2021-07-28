app.controller("LoanCtrl", ['$scope', 'loanService', 'customerService', 'utilityService', 'infoService', '$state', '$confirm', 'ReportingApiService', function ($scope, loanService, customerService, utilityService, infoService, $state, $confirm, ReportingApiService) {
    //var Data = customerService.getCustomerType();
    //Data.then(function (type) {
    //    $scope.customerType = type.data;
    //})
    $scope.order = {};
    $scope.order.ConfirmationSetNumber = $scope.$root.SessionProperties.UserId;
    $scope.order.AppId = $scope.productId;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Source = 2;

    $scope.filter = 1;
    try {
        $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.isOnlineAcc = "0";
    }
    //To Get All Records  
    $scope.getLoans = function () {
        $scope.loading = true;
        var Data = loanService.getLoans($scope.filter);
        Data.then(function (loans) {
            //if (loans.data.productAccess == "false")
            //    $scope.productAccess = false;

            if ($scope.filter == 1) {
                $scope.loans = loans.data;
                $scope.closingLoans = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingLoans = loans.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getLoans');
        });
    }

    $scope.getLoan = function (productId) {

        if ($scope.loan == null || $scope.openedLoan == true) {

            if ($scope.loan == null) {
                $scope.loading = true;
            }

            var Data = loanService.getLoan(productId);
            Data.then(function (loan) {
                $scope.loan = loan.data;
                if ($scope.loan) {
                    $scope.loan = forTotal($scope.loan, utilityService);
                    $scope.setloanAdditionalDetails($scope.loan);
                };
                $scope.params = { selectedLoan: $scope.loan };
                if ($scope.loan.LoanType == 14 || $scope.loan.LoanType == 15) {
                    $scope.isLoanInsurance = true;
                }
                if ($scope.loan.LoanType == 49) {
                    $scope.isPaidInsurance = true;
                }

                if ($scope.loan.LoanType == 7 || $scope.loan.LoanType == 38 || $scope.loan.Sale == 8 || $scope.loan.Sale == 9 || $scope.loan.Sale == 10 || $scope.loan.LoanProgram == 25) {
                    $scope.GoodsDeatilsShow = true;

                    if ($scope.loan.LoanType != 38)
                        $scope.isTransferToShop = true;
                }


                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error getLoan');
            });
        }
        else {
            $scope.params = { selectedLoan: $scope.loan };
            if ($scope.loan) {
                $scope.loan = forTotal($scope.loan, utilityService);
            };

            $scope.isClosed = true;
            $scope.loading = false;
        }

        $scope.showResetEarlyRepaymentFeeButton();

    };

    $scope.getCBKursForDate = function (date, currency) {
        var Data = utilityService.getCBKursForDate(date, currency);
        Data.then(function (kurs) {
            $scope.kurs = kurs.data;
        }, function () {
            alert('Error getCBKursForDate');
        });
    };



    $scope.setClickedRow = function (index, loan) {
        $scope.selectedRow = index;
        $scope.selectedProductId = loan.ProductId;
        $scope.params = { selectedLoan: loan };
        $scope.contractLoan = loan;
        $scope.selectedQuality = loan.Quality;
        $scope.selectedRowClose = null;
        $scope.selectedLoanIsAccessible = loan.isAccessible;
        $scope.selectedLoanType = loan.LoanType;
    }

    $scope.setClickedRowClose = function (index, loan) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedLoan = loan;
        $scope.selectedLoanIsAccessible = loan.isAccessible;
    };

    $scope.getLoanGrafik = function () {

        var Data = loanService.getLoanGrafik($scope.selectedLoan);
        Data.then(function (rep) {
            $scope.loanGrafik = rep.data;
            var sum1 = 0;
            var sum2 = 0;
            var sum3 = 0;
            var sum4 = 0;
            var sum5 = 0;
            var sum6 = 0;
            var sum7 = 0;

            $scope.checkRescheduledAmount = false;

            for (var i = 0; i < rep.data.length; i++) {
                if (rep.data[i].RescheduledAmount > 0 && $scope.checkRescheduledAmount == false) {
                    $scope.checkRescheduledAmount = true;
                }

                sum1 += rep.data[i].RateRepayment;
                sum2 += rep.data[i].CapitalRepayment;
                sum3 += rep.data[i].TotalRepayment;
                sum4 += rep.data[i].FeeRepayment;
                if (rep.data[i].FeeRepayment == 0) {
                    rep.data[i].FeeRepayment = "";
                }
                sum5 += rep.data[i].SubsidiaRateRepayment;
                sum6 += rep.data[i].NonSubsidiaRateRepayment;
                sum7 += rep.data[i].RescheduledAmount;

            }

            $scope.sum1 = sum1;
            $scope.sum2 = sum2;
            $scope.sum3 = sum3;
            $scope.sum4 = sum4;
            $scope.sum5 = sum5;
            $scope.sum6 = sum6;
            $scope.sum7 = sum7;
            if ($scope.checkRescheduledAmount) {
                $scope.tableColspanCount = 6;
            } else {
                $scope.tableColspanCount = 5;
            }

            if ($scope.sum5 != 0)
                $scope.tableColspanCount = $scope.tableColspanCount + 1;
            if ($scope.sum6 != 0)
                $scope.tableColspanCount = $scope.tableColspanCount + 1;


        }, function () {
            alert('Error getLoanGrafik');
        });
    };

    $scope.getLoanInceptiveGrafik = function () {

        var Data = loanService.getLoanInceptiveGrafik($scope.selectedLoan);
        Data.then(function (rep) {
            $scope.loanGrafik = rep.data;
            $scope.checkRescheduledAmount = false;
            var inceptiveSum1 = 0;
            var inceptiveSum2 = 0;
            var inceptiveSum3 = 0;
            var inceptiveSum4 = 0;
            var inceptiveSum5 = 0;
            for (var i = 0; i < rep.data.length; i++) {
                if (rep.data[i].RescheduledAmount > 0 && $scope.checkRescheduledAmount == false) {
                    $scope.checkRescheduledAmount = true;
                }

                inceptiveSum1 += rep.data[i].RateRepayment;
                inceptiveSum2 += rep.data[i].CapitalRepayment;
                inceptiveSum3 += rep.data[i].FeeRepayment;
                inceptiveSum4 += rep.data[i].TotalRepayment;
                inceptiveSum5 += rep.data[i].RescheduledAmount;
                if (rep.data[i].FeeRepayment == 0) {
                    rep.data[i].FeeRepayment = "";
                }
            }

            $scope.inceptiveSum1 = inceptiveSum1;
            $scope.inceptiveSum2 = inceptiveSum2;
            $scope.inceptiveSum3 = inceptiveSum3;
            $scope.inceptiveSum4 = inceptiveSum4;
            $scope.inceptiveSum5 = inceptiveSum5;

            if ($scope.checkRescheduledAmount) {
                $scope.tableColspanCount = 5;
            } else {
                $scope.tableColspanCount = 4;
            }

        }, function () {
            alert('Error getLoanInceptiveGrafik');
        });
    };
    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getLoans();
    }

    $scope.getLoanGrafikApplication = function () {
        showloading();
        var Data = loanService.getLoanGrafikApplication($scope.loan.LoanAccount.AccountNumber, new Date(parseInt($scope.loan.StartDate.substr(6))));
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 62, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error getLoanGrafikApplication');
        });
    };

    $scope.getLoanProductProlongations = function (productId) {
        var Data = loanService.getLoanProductProlongations(productId);
        Data.then(function (acc) {
            $scope.productProlongations = acc.data;
        }, function () {
            alert('Error getLoanMainContract');
        });
    };




    $scope.callbackgetLoan = function () {
        $scope.openedLoan = true;
        $scope.getLoan($scope.productId);
    }

    $scope.callbackgetLoans = function () {
        $scope.getLoans();
    }

    $scope.setloanAdditionalDetails = function (loan) {

        var Data = customerService.isDAHKAvailability();
        Data.then(function (dahk) {

            $scope.dahkAvailability = dahk.data;
            $scope.ConnectAccountAvailableBalance = 0;
            if ($scope.dahkAvailability == false || loan.LoanType == 38)
                $scope.ConnectAccountAvailableBalance = loan.ConnectAccount.AvailableBalance;

            $scope.AdditionalDetails1 = loan.CurrentCapital + loan.OutCapital +
                utilityService.formatRound(loan.CurrentRateValue, 0) + utilityService.formatRound(loan.PenaltyRate, 0)
                + utilityService.formatRound(loan.JudgmentRate, 0) + utilityService.formatRound(loan.CurrentFee, 0);

            $scope.AdditionalDetails2 = $scope.AdditionalDetails1 - $scope.ConnectAccountAvailableBalance;
            $scope.AdditionalDetails4 = utilityService.formatRound(loan.PenaltyRate, 0) + loan.OverdueCapital + utilityService.formatRound(loan.InpaiedRestOfRate, 0) +
                utilityService.formatRound(loan.JudgmentRate, 0) + (loan.OverdueCapital + loan.InpaiedRestOfRate + loan.PenaltyRate + loan.JudgmentRate != 0 ? utilityService.formatRound(loan.CurrentFee, 0) : 0) - ($scope.ConnectAccountAvailableBalance < 0 ? 0 : $scope.ConnectAccountAvailableBalance);

            var Data = utilityService.getCBKursForDate(new Date(new Date(parseInt(loan.DayOfRateCalculation.substr(6))).getFullYear(), new Date(parseInt(loan.DayOfRateCalculation.substr(6))).getMonth(), new Date(parseInt(loan.DayOfRateCalculation.substr(6))).getDate() - 1), loan.Currency);
            Data.then(function (kurs) {
                $scope.cbkurs = kurs.data;
                $scope.percent = utilityService.formatRound(utilityService.formatRound(loan.InpaiedRestOfRate, 0) * $scope.cbkurs, 1);

                $scope.percent = utilityService.formatRound(($scope.percent + (utilityService.formatRound(loan.CurrentRateValue, 0) - utilityService.formatRound(loan.InpaiedRestOfRate, 0)) * $scope.cbkurs), 1);

                $scope.percent = utilityService.formatRound($scope.percent + (utilityService.formatRound(loan.PenaltyAdd, 0) * $scope.cbkurs), 1);
                $scope.percent = utilityService.formatRound(($scope.percent + ((loan.PenaltyRate - loan.PenaltyAdd) * $scope.cbkurs)), 1);
                $scope.percent = utilityService.formatRound(($scope.percent + utilityService.formatRound(loan.CurrentFee, 0) * $scope.cbkurs), 1);
                $scope.AdditionalDetails3 = $scope.percent;
            }, function () {
                alert('Error getCBKursForDate');
            });
        }, function () {
            alert('Error isDAHKAvailability');
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


    $scope.openLoanDetails = function () {
        $state.go('loanDetails', { productId: $scope.selectedProductId, closedLoan: $scope.selectedLoan });
    };

    $scope.getLoanInterestRateChangeHistoryDetails = function (productID) {
        var Data = loanService.getLoanInterestRateChangeHistoryDetails(productID);
        Data.then(function (d) {
            $scope.loanInterestRateChangeHistoryDetails = d.data;

        }, function () {
            alert('Error getLoanInterestRateChangeHistoryDetails');
        });
    };
    $scope.getLoanNextRepayment = function () {
        var Data = loanService.getLoanNextRepayment($scope.loan);
        Data.then(function (rep) {
            $scope.loanNextRepayment = rep.data;
        }, function () {
            alert('Error getLoanGrafik');
        });
    };


    $scope.getGoodsDetails = function (productId) {
        var Data = loanService.getGoodsDetails(productId);
        Data.then(function (acc) {
            $scope.goodsDetails = acc.data;
        }, function () {
            alert('Error getGoodsDetails');
        });
    };

    $scope.printNotMaturedLoans = function () {
        showloading();
        var Data = loanService.printNotMaturedLoans();
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 100, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error printNotMaturedLoans');
        });
    };

    $scope.getProductAccountFromCreditCodeForAMD = function (creditCode, productType, accountType) {

        var Data = loanService.getProductAccountFromCreditCode(creditCode, productType, accountType);
        Data.then(function (acc) {
            $scope.accountAMD = acc.data;
        }, function () {
            alert('Error getProductAccountFromCreditCodeForAMD');
        });
    }

    $scope.getProductAccountFromCreditCodeForCurrency = function (creditCode, productType, accountType) {

        var Data = loanService.getProductAccountFromCreditCode(creditCode, productType, accountType);
        Data.then(function (acc) {
            $scope.accountCurrency = acc.data;
        }, function () {
            alert('Error getProductAccountFromCreditCodeForCurrency');
        });

    }


    $scope.loadLoanTabScript = function () {
        $("#loandetails div.bhoechie-tab-menu>div.list-group>div").click(function (e) {
            e.preventDefault();
            $(this).siblings('#loandetails div.active').removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $("#loandetails div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("#loandetails div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
        });


        $("#loanDetailsContainer").mCustomScrollbar({
            theme: "rounded-dark",
            scrollButtons: {
                scrollAmount: 200,
                enable: true
            },
            mouseWheel: {
                scrollAmount: 200
            }
        });
    }

    $scope.loanDetailsForCurrentCustomer = function (productId, productType) {
        var Data = loanService.loanDetailsForCurrentCustomer(productId, productType);
        Data.then(function (acc) {

        }, function () {
            alert('Error loanDetailsForCurrentCustomer');
        });
    };

    $scope.saveResetEarlyRepaymentFee = function () {
        var Data = loanService.postResetEarlyRepaymentFee($scope.loanProductId, $scope.resetDescription, $scope.recovery);
        Data.then(function (acc) {
            ShowToaster('Վաղաժամկետ մարման վճարը զրոյացված է։', 'success');
            CloseBPDialog("resetEarlyRepaymentFee");
            refresh(172);

        }, function () {
            alert('Error postResetEarlyRepaymentFee');
        });

    };

    $scope.showResetEarlyRepaymentFeeButton = function () {
        var Data = loanService.getResetEarlyRepaymentFeePermission($scope.productId);
        Data.then(function (acc) {
            if (acc.data == 'True') {
                $scope.showRecovery = true;
            }
            else {
                $scope.showRecovery = false;
            }
        }, function () {
            alert('Error getResetEarlyRepaymentFeePermission');
        });
    };

    $scope.sendLoanDigitalContract = function (productId) {
        $confirm({ title: 'Հաստատե՞լ', text: 'Հաճախորդի անձնական Էլեկտրոնային հասցեին ուղարկվելու է պայմանագրերի փաթեթ։' })
            .then(function () {
                showloading();
                var Data = loanService.sendLoanDigitalContract(productId);
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

    $scope.getLoanInterestRateConcessionDetails = function (productId) {

        var Data = loanService.getLoanInterestRateConcessionDetails(productId);
        Data.then(function (acc) {
            $scope.loanInterestRateConcessionDetails = acc.data;
        }, function () {
            alert('Error getLoanInterestRateConcessionDetails');
        });
    };

    $scope.getTypeOfLoanDelete = function () {
        var Data = loanService.getTypeOfLoanDelete();
        Data.then(function (result) {
            $scope.TypeOfReasons = result.data;
        }, function () {
            alert('Error GetTypeOfLoanDelete');
        });
    };


    $scope.saveLoanDeleteReason = function () {
        var Data = loanService.saveLoanDeleteReason($scope.order);
        Data.then(function (response) {
            if (response.data.Errors.length == 0) {
                ShowMessage('Վարկը հեռացված է։');
                CloseBPDialog("DeleteReason");
                var url = location.origin.toString();
                window.location.href = url + '#!/allProducts';
            }
            else {
                var error = response.data.Errors[0].Description;
                showMesageBoxDialog(error, $scope, 'error');
            }
        }, function () {
            alert('Error saveLoanDeleteReason');
        });
    };

    $scope.getLoanDeleteOrderDetails = function (orderId) {
        var Data = loanService.getLoanDeleteOrderDetails(orderId);
        Data.then(function (acc) {
            $scope.orderDetails = acc.data;
        }, function () {
            alert('Error getBondOrder');
        });

    };

}]);