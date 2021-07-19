app.controller('MatureOrderCtrl', ['$scope', 'MatureOrderService', 'loanService', 'creditLineService', 'paymentOrderService', 'dialogService', 'orderService', 'accountService', 'utilityService', '$http', 'customerService', 'infoService', function ($scope, MatureOrderService, loanService, creditLineService, paymentOrderService, dialogService, orderService, accountService, utilityService, $http, customerService, infoService) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.matureTypes = [];
    //$scope.SubsidiaInterestRate = null;
    $scope.matureTypes[1] = 'Տոկոսի մարում';
    $scope.matureTypes[2] = 'Մասնակի մարում';
    $scope.matureTypes[4] = 'Լրիվ մարում';
    $scope.matureTypes[5] = 'Պետ. տուրքի մարում';
    $scope.matureTypes[9] = 'Մասնակի մարում համաձայն գրաֆիկի';

    if ($scope.ClaimRepayment == true) {
        delete $scope.matureTypes[1];
        delete $scope.matureTypes[2];
        delete $scope.matureTypes[4];
        delete $scope.matureTypes[9];
        $scope.order.MatureType = '5';
    }
    else
    {
       delete $scope.matureTypes[5];
    }
    $scope.order.IsProblematic = 'false';
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.error = null;


    $scope.generateNewOrderNumber = function () {
        $scope.getOrderNumberType();
        var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
    });
};

    $scope.getOrderNumberType = function () {
        if ($scope.periodic != undefined)
            $scope.orderNumberType = 9;
        else if ($scope.order.Type == 1 || $scope.order.Type == 56)
            $scope.orderNumberType = 6;
};


    $scope.calculateLoanRest = function (product) {
        if ($scope.order.Type == 5 && $scope.ClaimRepayment != true) {
            if (product.Quality == 5 || product.Quality == 11) {
                var penaltyOfBank = utilityService.formatRound(product.PenaltyAdd, 0);
                var penalty = utilityService.formatRound(((product.PenaltyRate * -1) + penaltyOfBank), 0);
                var rateRepayment = utilityService.formatRound(product.InpaiedRestOfRate, 0) + penaltyOfBank + penalty;
                $scope.loanCalculatedRest = product.ConnectAccount.AvailableBalance - product.OverdueCapital - rateRepayment;
                if ($scope.loanCalculatedRest < 0) {
                    $scope.loanCalculatedRest = 0;
                }

                var Data = accountService.getAccountBalance(product.ConnectAccount.AccountNumber);
                Data.then(function(acc) {
                        $scope.order.Amount = acc.data - $scope.loanCalculatedRest;
                    }
                );
            };

        }
   };


    if ($scope.selectedLoan != undefined) {
        $scope.Product = angular.copy($scope.selectedLoan);
        if ($scope.ClaimRepayment == true) {
            $scope.Product.Currency = "AMD";
            $scope.order.Amount = $scope.taxAmount;
        }

        $scope.Product = forTotal($scope.Product, utilityService);
        $scope.order.Type = 5;
        $scope.order.ProductAccount = $scope.selectedLoan.LoanAccount;
        $scope.order.Account = {};

        //Վճարած ֆակտորինգի որոշում
        if($scope.Product.LoanType==33)
        {
            $scope.order.ProductType = 54;
        }
        $scope.calculateLoanRest($scope.Product);
        }
        else if ($scope.selectedCreditLine != undefined) {
            $scope.Product = $scope.selectedCreditLine;
        if ($scope.Product.Type == 25 || $scope.Product.Type == 18 || $scope.Product.Type == 60  || $scope.Product.Type == 46 || $scope.Product.Type == 36) {

                $scope.order.Type = 8;
        }
        else {
            $scope.order.Type = 78;
            }

        $scope.order.MatureType = 2;
        $scope.order.ProductAccount = $scope.selectedCreditLine.LoanAccount;
    }


    if ($scope.Product != undefined) {
        $scope.order.DayOfProductRateCalculation = new Date(parseInt($scope.Product.DayOfRateCalculation.substr(6)));

        if ($scope.ClaimRepayment)
        {
            $scope.order.ProductId = $scope.TaxProductId;
            $scope.order.ProductCurrency = "AMD";
        }
        else
        {
                $scope.order.ProductId = $scope.Product.ProductId;
                $scope.order.ProductCurrency = $scope.Product.Currency;
        }
    }



    $scope.SaveMatureOrder = function () {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("matureLoad").classList.remove("hidden");
            $scope.order.Description = $scope.matureTypes[$scope.order.MatureType];
            var Data = MatureOrderService.SaveMatureOrder($scope.order);
            Data.then(function (ref) {
                if (validate($scope, ref.data)) {
                    document.getElementById("matureLoad").classList.add("hidden");
                    CloseBPDialog('newMature');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type, $scope.order.MatureType);
                }
                else {
                    document.getElementById("matureLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
            }, function (err) {
                document.getElementById("matureLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveMature');
        });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

    }
};
    $scope.getMatureOrder = function (OrderId) {
        var Data = MatureOrderService.GetMatureOrder(OrderId);
        Data.then(function (or) {
            $scope.order = or.data;
            if ($scope.order.Type == 8 || $scope.order.Type == 78) {
                var Product = creditLineService.getCreditLine($scope.order.ProductId);
                Product.then(function(pr) {
                        $scope.Product = pr.data;
                    },
                    function() {
                        alert('Error CreditLine');
                    });
            }
            else {
                var Product = loanService.getLoan($scope.order.ProductId);
                //$scope.SubsidiaInterestRate = Product.SubsidiaInterestRate;
                Product.then(function(pr) {
                        $scope.Product = pr.data;
                    },
                    function() {
                        alert('Error Loan');
                    });
            }

        }, function () {
            alert('Error Order');
    });
};


    $scope.getPercentAccounts = function () {
        var Data = paymentOrderService.getAccountsForOrder($scope.order.Type, 1, 3);
        Data.then(function (acc) {
            $scope.percentAccounts = acc.data;
            $scope.getCBKursForDate();
        }, function () {
            alert('Error getfeeaccounts');
    });
}
    $scope.getAccountsForCurrency = function () {
        var Data = accountService.getAccountsForCurrency($scope.Product.Currency);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;

            var existsConnect = false;

            if ($scope.Product.ProductType != 2) //ոչ վարկային գծերի համար
            {
                for (var i = 0; i < $scope.debitAccounts.length; i++) {
                    if ($scope.debitAccounts[i].AccountNumber == $scope.Product.ConnectAccount.AccountNumber) {
                        existsConnect = true;
                        break;
                }
            }

                if ((existsConnect == false && $scope.ClaimRepayment != true) || (existsConnect == false && $scope.ClaimRepayment == true && $scope.Product.ConnectAccount.Currency=="AMD"))
                {
                    $scope.debitAccounts.push($scope.Product.ConnectAccount);
                }
            }
            else if ($scope.Product.ProductType == 2) {
                var check =false;
                for (var i = 0; i < $scope.debitAccounts.length; i++)
                {
                    if($scope.debitAccounts[i].AccountNumber==$scope.Product.ConnectAccount.AccountNumber)
                        {
                            check =true;
                        }
                }
                if (!check)
                    {
                        $scope.debitAccounts.push($scope.Product.ConnectAccount);
                    }
                }

            for (var i = 0; i < $scope.debitAccounts.length; i++) {
                if ($scope.debitAccounts[i].AccountNumber == $scope.Product.ConnectAccount.AccountNumber) {
                    $scope.order.Account = $scope.debitAccounts[i];
                    $scope.order.Account.AvailableBalance = 0;
                    $scope.orderAccountNumber = $scope.order.Account.AccountNumber;
            }
        }

            if ($scope.Product.Quality != 5 && $scope.Product.Quality != 11 && $scope.ClaimRepayment!=true) {
                $scope.accountChange(); $scope.getLoanMatureCapitalPenalty();// $scope.getLoanCalculatedRest();
        }



        }, function () {
            alert('Error');
    });

};

    $scope.getCBKursForDate = function () {
        var Data = loanService.getCBKursForDate(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()-1), $scope.Product.Currency);
        Data.then(function (kurs) {
            $scope.kurs = kurs.data;
        }, function () {
            alert('Error getCBKursForDate');
    });
};
    $scope.accountChange = function () {
        if ($scope.order.Account == null || $scope.order.Account == undefined)
        {
            $scope.order.Amount = '';
        }
        else
        {
            var Data = customerService.isDAHKAvailability();
            Data.then(function(dahk) {

                $scope.dahkAvailability = dahk.data;
                if (($scope.Product != undefined && $scope.Product.LoanType == 38) || $scope.dahkAvailability != true) {
                    var Data = accountService.getAccountBalance($scope.order.Account.AccountNumber);
                    Data.then(function(acc) {

                        $scope.order.Account.Balance = acc.data;
                    });
                } else
                    $scope.order.Account.Balance = 0;
            });


        }
        if ($scope.order.PercentAccount == null || $scope.order.PercentAccount == undefined)
        {
            $scope.order.PercentAmount = '';
        }


}
    $scope.getMatureApplication = function () {
        showloading();
        if ($scope.order.Account == null || $scope.order.Account == undefined) {
            $scope.Account = $scope.Product.ConnectAccount;
            $scope.Amount = 0;
        }
        else {
            $scope.Account = $scope.order.Account;
            $scope.Amount = $scope.order.Amount;
        }

        switch ($scope.order.MatureType) {
            case "1":
                $scope.MatureType = 2;
                break;
            case "2":
                $scope.MatureType = 2;
                break;
            case "4":
                $scope.MatureType = 1;
                break;
            case "9":
                $scope.MatureType = 2;
                break;
            case 1:
                $scope.MatureType = 2;
                break;
            case 2:
                $scope.MatureType = 2;
                break;
            case 4:
                $scope.MatureType = 1;
                break;
            case 9:
                $scope.MatureType = 2;
                break;
            default:
                break;

    }

        var Data = MatureOrderService.getMatureApplication($scope.Account, $scope.MatureType, $scope.Product.CurrentRateValue.toFixed(0), $scope.Product.ContractNumber, $scope.Amount);
        ShowPDF(Data);
};

    $scope.getThreeMonthLoanRate = function () {
        var Data = MatureOrderService.getThreeMonthLoanRate($scope.Product.ProductId);
        Data.then(function (acc) {
            $scope.rate = acc.data;
        }, function () {
            alert('Error getThreeMonthLoanRate');
    });
};

    $scope.getLoanMatureCapitalPenalty = function () {
        if ($scope.order.MatureType > 0) {
            var Data = MatureOrderService.getLoanMatureCapitalPenalty($scope.order);
            Data.then(function (acc) {
                $scope.capitalPenalty = acc.data;
            }, function () {
                alert('Error getLoanMatureCapitalPenalty');
        });
    }
};

    $scope.getLoanCalculatedRest = function () {
        $scope.disableAmount = true;

        if ($scope.order.Type == 5 && $scope.order.Account != undefined && $scope.order.Account.AccountNumber != undefined) {
            var Data = customerService.isDAHKAvailability();
            Data.then(function(dahk) {

                $scope.dahkAvailability = dahk.data;
                if (($scope.Product != undefined && $scope.Product.LoanType == 38) || $scope.dahkAvailability != true) {
                    var Data = accountService.getAccountBalance($scope.order.Account.AccountNumber);
                    Data.then(function(acc) {

                        $scope.order.Account.Balance = acc.data;
                    });
                } else
                    $scope.order.Account.Balance = 0;
            });

            var Data = MatureOrderService.getLoanCalculatedRest($scope.Product, $scope.order);
            Data.then(function(acc) {
                $scope.disableAmount = false;
                if ($scope.order.ProductCurrency == "AMD") {
                    $scope.loanCalculatedRest = utilityService.formatRound(acc.data, 1);
                } else {
                    $scope.loanCalculatedRest = utilityService.formatRound(acc.data, 2);
                }

                if ($scope.order.Account != null) {
                    if ($scope.order.ProductCurrency == "AMD") {
                        $scope.order.Amount = utilityService.formatRound($scope.order.Account.Balance - acc.data, 1);
                    } else {
                        $scope.order.Amount = utilityService.formatRound($scope.order.Account.Balance - acc.data, 2);
                    }

                    $scope.loanCalculatedRestChanged();
                }
            });
        }
        else {
            $scope.disableAmount = false;
        }
        

};

    $scope.loanCalculatedRestChanged = function () {

        if ($scope.loanCalculatedRest < 0)
            $scope.loanCalculatedRest = 0;
        if ($scope.order.Account != null) {

            if ($scope.order.MatureType == 4 && $scope.changeamount !=true) {
                $scope.calculateloanFullRepayment();
            }
            else {
                if ($scope.loanCalculatedRest > $scope.order.Account.Balance)
                $scope.loanCalculatedRest = $scope.order.Account.Balance;
                    if ($scope.order.ProductCurrency == "AMD") {
                        $scope.order.Amount = utilityService.formatRound($scope.order.Account.Balance -$scope.loanCalculatedRest, 1);
                    }
                    else {
                        $scope.order.Amount = utilityService.formatRound($scope.order.Account.Balance -$scope.loanCalculatedRest, 2);
            }
        }
    }
};

    $scope.calculateloanFullRepayment = function () {
        if ($scope.order.Account != null && $scope.order.MatureType == 4) {

            if ($scope.Product.LoanType == 33)
            {
                $scope.order.Amount = utilityService.formatRound($scope.Product.TotalDebt + $scope.Product.AmountNotPaid - utilityService.formatRound($scope.Product.CurrentRateValue,0), 2);
                $scope.loanCalculatedRest = utilityService.formatRound($scope.order.Account.Balance -
                    $scope.Product.TotalDebt -
                    $scope.Product.AmountNotPaid +
                    utilityService.formatRound($scope.Product.CurrentRateValue, 0),
                    2);
            }
            else
            {
                $scope.order.Amount = utilityService.formatRound($scope.Product.TotalDebt, 2);
                $scope.loanCalculatedRest =
                    utilityService.formatRound($scope.order.Account.Balance - $scope.Product.TotalDebt, 2);
            }
            if ($scope.loanCalculatedRest < 0)
                $scope.loanCalculatedRest = 0;
        }

        else if ($scope.order.MatureType == 9) {   

            $scope.loanCalculatedRest = 0;
            $scope.order.Amount = 0;
        }

        else {
                  $scope.getLoanCalculatedRest();
    }

};



$scope.amountChanged = function () {
    if ($scope.order.Account != null) {
        if ($scope.order.ProductCurrency == "AMD") {
            var loanCalculatedRest = utilityService.formatRound($scope.order.Account.Balance -$scope.order.Amount, 1);
        }
        else {
    var loanCalculatedRest = utilityService.formatRound($scope.order.Account.Balance -$scope.order.Amount, 2);
    }

if (loanCalculatedRest < 0)
            loanCalculatedRest = 0;
        $scope.loanCalculatedRest = loanCalculatedRest;

        $scope.changeamount =true;
        //$scope.loanCalculatedRestChanged();
        $scope.changeamount = false;
        $scope.getLoanMatureCapitalPenalty();
}

};

$scope.isProblematicChange = function () {
    //if ($scope.order.IsProblematic == 'true' && $scope.order.ProductCurrency == "EUR" && $scope.order.Type == 5) {
    //    showMesageBoxDialog('Տվյալ արժույթով վարկ խնդրահարույց եղանակով հնարավոր չէ մարել:', 'error');
    //    $scope.order.IsProblematic = 'false';
    //}
    if ($scope.ClaimRepayment != true)
    {
        $scope.order.Amount = undefined;
    }
    $scope.order.PercentAmount = undefined;
    $scope.order.Account = undefined;
    $scope.order.PercentAccount = undefined;
}


    $scope.callbackgetMatureOrder = function () {
        $scope.getMatureOrder($scope.selectedOrderId);
};

    $scope.callbackLoanCalculatedRest = function () {
        $scope.getLoanCalculatedRest();
}


    $scope.getOperationSystemAccount = function () {

        if ($scope.order.IsProblematic == 'true') {


            if ($scope.ClaimRepayment) {
                var Data = utilityService.getOperationSystemAccount($scope.order, 1, $scope.order.ProductCurrency);
                Data.then(function (tr) {
                    var Data = accountService.getAccountBalance(tr.data.AccountNumber);
                    Data.then(function (acc) {
                        $scope.TransitAccountAvailableBalance = acc.data;
                    }, function () {
                        alert('Error getAccountBalance');
                    });
                }, function () {
                    alert('Error getOperationSystemAccount');
                });
            }
        else
        {


                var Data = MatureOrderService.getProductAccount($scope.order);
                    Data.then(function (acc) {
                        if(acc.data!=undefined)
                            $scope.TransitAccountAvailableBalance = acc.data.AvailableBalance;
                    }, function () {
                            alert('Error getAccountBalance');
                });
        }
        }
    };



    $scope.getTypeOfLoanRepaymentSource = function () {
       
        var Data = infoService.getTypeOfLoanRepaymentSource();
        Data.then(function (acc) {
            $scope.repaymentSourceTypes = acc.data;
        }, function () {
            alert('Error getTypeOfLoanRepaymentSource');
    });
};



}]);


