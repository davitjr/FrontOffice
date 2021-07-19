app.controller("LoanProductActivationOrderCtrl", ['$scope', 'loanProductActivationOrderService', 'paymentOrderService', 'loanService', '$location', 'dialogService', '$uibModal', 'creditLineService', '$confirm', 'orderService', '$http', 'guaranteeService', 'accreditiveService', 'factoringService', 'paidGuaranteeService', 'paidFactoringService', 'utilityService', function ($scope, loanProductActivationOrderService, paymentOrderService, loanService, $location, dialogService, $uibModal, creditLineService, $confirm, orderService, $http, guaranteeService, accreditiveService, factoringService, paidGuaranteeService, paidFactoringService, utilityService) {

    $scope.getDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $scope.order = {};
    $scope.order.Type = $scope.orderType;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    if ($scope.product != undefined && ($scope.product.Type == 54 || $scope.product.Type == 51)) {
        $scope.order.FeeAccount = $scope.product.ConnectAccount;
    }


    $scope.confirm = false;
    $scope.saveLoanProductActivationOrder = function () {
        if ($scope.order.Type == 109 || $scope.order.Type == 110 || $scope.order.Type == 111) {
            $scope.order.SubType = 1;
        }
        if ($http.pendingRequests.length == 0) {
            
			document.getElementById("loanProductActivLoad").classList.remove("hidden");
			$scope.order.ProductId = $scope.product.ProductId;
			if ($scope.order.Type == 152) {
				$scope.order.FeeAccount = {};
				$scope.order.FactoringCustomerAccount = $scope.CardAndCurrencyAccount.AccountNumber;
				$scope.order.FeeAccount.AccountNumber = $scope.FeeCardAndCurrencyAccount.AccountNumber;
			}
            var Data = loanProductActivationOrderService.saveLoanProductActivationOrder($scope.order, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("loanProductActivLoad").classList.add("hidden");
                    CloseBPDialog('newLoanProductActivation');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'infromation');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("loanProductActivLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope,'error', $confirm, $scope.saveLoanProductActivationOrder);
                }

            }, function (err) {
                $scope.confirm = false;
                document.getElementById("loanProductActivLoad").classList.add("hidden");

                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveAccount');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    }

    $scope.getLoanProductActivationOrder = function (orderId) {
        var Data = loanProductActivationOrderService.GetLoanProductActivationOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;

            if ($scope.order.Type==73) {
                var Data = loanService.getLoan($scope.order.ProductId);
            }
            if ($scope.order.Type==74) {
                var Data = creditLineService.getCreditLine($scope.order.ProductId);
            }

            if ($scope.order.Type == 109) {
                var Data = guaranteeService.getGuarantee($scope.order.ProductId);
            }

            if ($scope.order.Type == 110) {
                var Data = accreditiveService.getAccreditive($scope.order.ProductId);
            }

            if ($scope.order.Type == 111) {
                var Data = factoringService.getFactoring($scope.order.ProductId);
            }

            if ($scope.order.Type == 141) {
                var Data = paidGuaranteeService.getPaidGuarantee($scope.order.ProductId);
            }
            if ($scope.order.Type == 152) {
                var Data = paidFactoringService.getPaidFactoring($scope.order.ProductId);
            }


            if (Data != undefined) {
                Data.then(function (pr) {
                    $scope.product = pr.data;
                });
            }

        }, function () {
            alert('Error GetAccountOrder');
        });
    };

    $scope.IsCreditLineActivateOnApiGate = function (orderId) {
        var Data = loanProductActivationOrderService.IsCreditLineActivateOnApiGate(orderId);
        Data.then(function (acc) {
            if (acc.data == "True")
                $scope.isApiGate = 0
            else if (acc.data == "False")
                $scope.isApiGate = 1
        }, function () {
            alert('Error IsCreditLineActivateOnApiGate');
        });
    };

    $scope.getFeeAccounts = function () {
        var Data = paymentOrderService.getAccountsForOrder(13, 1, 3);
        Data.then(function (acc) {
            $scope.feeAccounts = [];
            if ($scope.ProductType == 1) {
                for (var i = 0; i < acc.data.length; i++) {
                    if (acc.data[i].AccountType == 10) {
                        $scope.feeAccounts.push(acc.data[i]);

                    }
                }
            }
            else
                $scope.feeAccounts = acc.data;
            if ($scope.order.Type == 109 || $scope.order.Type == 110) 
            {
                return;
            }
            var existsConnect = false;
            if ($scope.product.ProductType != 2) //ոչ վարկային գծերի համար
            {
                for (var i = 0; i < $scope.feeAccounts.length; i++) {
                    if ($scope.feeAccounts[i].AccountNumber == $scope.product.ConnectAccount.AccountNumber) {
                        existsConnect = true;
                        break;
                    }
                }

                if (existsConnect == false && $scope.product.ConnectAccount.Currency=="AMD") {
                    $scope.feeAccounts.push($scope.product.ConnectAccount);
                }
            }

        }, function () {
            alert('Error getfeeaccounts');
        });
    };




    $scope.getServiceFee = function () {
        var Data = loanProductActivationOrderService.GetServiceFee($scope.product.ProductId,0);
        Data.then(function (aa) {
            $scope.order.FeeAmount = aa.data;
            if (($scope.product.Type == 51 || $scope.product.Type == 54) && $scope.product.Currency!="AMD")
            {

                var Data = utilityService.getCBKursForDate(new Date(), $scope.product.Currency);
                Data.then(function (aa) {
                    $scope.kurs = aa.data;

                var Data = utilityService.formatRountByDecimals(parseFloat($scope.order.FeeAmount), 2, 2, $scope.kurs);
                Data.then(function (aa) {
                    $scope.amountInCurrency = aa.data;
                }, function () {
                    alert('Error');
                });
                }, function () {
                    alert('Error');
                });

            }


            if ($scope.product.ProductType == 1) {

                if ($scope.product.LoanType == 4) {
                    if ($scope.product.Fond == 8 || $scope.product.Fond == 9) {
                        ShowMessage('Հիշեցնում ենք Ձեզ, որ տվյալ ֆոնդի վարկը չի կարելի թողնել ընթացիկ հաշվի վրա՝ ամբողջ գումարը պետք է կանխիկ վճարվի', 'information');
                    }
                }
                if ($scope.product.LoanType == 13 && $scope.product.LoanProgram == 4) {
                    ShowMessage('Տվյալ վարկատեսակի համար, վարկի տրամադրումից հետո, անհրաժեշտ է տալ մասնակի մարում: Համաձայն համագործակցության պայմանագրի, տվյալ վարկի միջնորդավճարը չի գանձվում հաճախորդից:', 'information');
                }
            }
            if ($scope.order.Type == 74 || $scope.order.Type == 109 || $scope.order.Type == 110) {
                Data = loanProductActivationOrderService.GetServiceFee($scope.product.ProductId,1);
                Data.then(function (fee) {
                    $scope.order.FeeAmountWithTax = fee.data;
                });
            }


        }, function () {
            alert('Error');
        });


    };

    $scope.getDepositConsumeLoanContract = function (productId) {
        showloading();
        var Data = loanProductActivationOrderService.getConsumeLoanContract(productId);
        ShowPDF(Data);
    };

    $scope.getDepositLoanGrafik = function (productId) {
        showloading();
        var Data = loanProductActivationOrderService.getDepositLoanGrafik(productId);
        ShowPDF(Data);
    };

    $scope.getDepositLoanProvisionDetails = function (productId,filialCode) {
        showloading();
        var Data = loanProductActivationOrderService.getDepositLoanProvisionDetails(productId, filialCode);
        ShowPDF(Data);
    };

    $scope.getLoanTerms = function (productId) {
        showloading();
        var Data = loanProductActivationOrderService.getLoanTerms(productId);
        ShowPDF(Data);
    };

    $scope.getDepositCardCreditLineContract = function (productId, cardType) {

        if (cardType == 20 || cardType == 41) {
            ShowMessage('American Express Gold <br /> քարտի համար անհրաժեշտ է կիրառել պայմանագրի թղթային տարբերակը:', 'error');
        }
        else {
            showloading();
            var Data = loanProductActivationOrderService.getDepositCardCreditLineContract(productId, cardType);
            ShowPDF(Data);
        }
    };

    $scope.getCreditLineTerms = function (productId) {
        showloading();
        var Data = loanProductActivationOrderService.getCreditLineTerms(productId);
        ShowPDF(Data);
    };


    $scope.callbackgetLoanProductActivationOrder = function () {
        $scope.getLoanProductActivationOrder($scope.selectedOrderId);
    }

    $scope.getLoanProductActivationWarnings = function () {
        if ($scope.order.Type == 73) {
            var Data = loanProductActivationOrderService.getLoanProductActivationWarnings($scope.product.ProductId, $scope.product.ProductType);
            Data.then(function (aa) {
                $scope.warnings = aa.data;
            }, function () {
                alert('Error');
            });
        }

    };
    $scope.getLoanProductActivationWarnings();

    $scope.getLoanTotalInsuranceAmount = function (productId) {
            var Data = loanProductActivationOrderService.getLoanTotalInsuranceAmount(productId);
            Data.then(function (aa) {
                $scope.order.TotalInsuranceAmount = aa.data;
            }, function () {
                alert('Error');
            });
    };
	
	$scope.GetFactoringCustomerCardAndCurrencyAccounts = function () {

		var Data = paymentOrderService.GetFactoringCustomerCardAndCurrencyAccounts($scope.product.ProductId, $scope.product.ConnectAccount.Currency);
		Data.then(function (acc) {
			$scope.CardAndCurrencyAccounts = acc.data;
		}, function () {
			alert('Error GetFactoringCustomerCardAndCurrencyAccounts');
		});
	};
	$scope.GetFactoringCustomerFeeCardAndCurrencyAccounts = function () {

		var Data = paymentOrderService.GetFactoringCustomerFeeCardAndCurrencyAccounts($scope.product.ProductId);
		Data.then(function (acc) {
			$scope.FeeCardAndCurrencyAccounts = acc.data;
		}, function () {
			alert('Error GetFactoringCustomerFeeCardAndCurrencyAccounts');
		});
	};
	

}])