app.controller("LoanProductOrderCtrl", ['$scope', 'loanProductOrderService', 'paymentOrderService', 'loanService', 'orderService', 'cardService', '$confirm', 'customerService', '$http', 'infoService', 'utilityService', 
    function ($scope, loanProductOrderService, paymentOrderService, loanService, orderService, cardService, $confirm, customerService, $http, infoService, utilityService) {


        $scope.getDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        $scope.order = {};
        $scope.order.Type = $scope.orderType;
        $scope.order.ProductAccount = {};
        $scope.selectedCard = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.StartDate = $scope.$root.SessionProperties.OperationDate;
        $scope.rateDisableStatus = true;
        $scope.order.SubType = 1;
        $scope.order.ProductType = $scope.productType;
        $scope.order.ProductId = $scope.cardProductId;


        if ($scope.order.Type != 159)
            try {
                $scope.canChangeDepositLoanRate = $scope.$root.SessionProperties.AdvancedOptions["canChangeDepositLoanRate"];
            }
            catch (ex) {
                $scope.canChangeDepositLoanRate = 0;
            }

        if ($scope.order.Type == 13) {
            $scope.order.Currency = 'AMD';
        }
        else if ($scope.order.Type == 14) {
            $scope.order.Currency = $scope.order.ProductAccount.Currency;
        }
        else if ($scope.order.Type == 159) {
            $scope.order.Currency = $scope.fastOverdraftCard.Currency;
            $scope.order.ProductId = $scope.cardProductId;
        }

        $scope.confirm = false;
        //Հաշվի բացման պահպանում և հաստատում
        $scope.saveLoanProductOrder = function () {
            if ($http.pendingRequests.length == 0) {

                $scope.order.InterestRate = $scope.interestRateShow / 100;
                document.getElementById("loanProductLoad").classList.remove("hidden");
                var Data = loanProductOrderService.saveLoanProductOrder($scope.order, $scope.confirm);
                Data.then(function (res) {
                    if (res.data.actionAccess != "false") {
                        $scope.confirm = false;
                        if (validate($scope, res.data)) {
                            document.getElementById("loanProductLoad").classList.add("hidden");

                            if ($scope.order.Type != 159) {
                                CloseBPDialog('newloan');
                                refresh($scope.order.Type);
                            }
                            else {
                                $scope.loanApplicationDocId = res.data.Id;
                                $scope.showLoanApplication = true;
                            }
                            $scope.path = '#Orders';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');

                        }
                        else {
                            document.getElementById("loanProductLoad").classList.add("hidden");
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveLoanProductOrder);
                        }
                    }
                    else {
                        document.getElementById("loanProductLoad").classList.add("hidden");
                        ShowMessage('Գործողությունը հասանելի չէ տվյալ օգտագործողի համար', 'information');
                    }

                }, function (err) {
                    $scope.confirm = false;
                    $scope.ResultCode = undefined;
                    document.getElementById("loanProductLoad").classList.add("hidden");
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

        $scope.getLoanOrder = function (orderId) {
            var Data = loanProductOrderService.GetLoanOrder(orderId);
            Data.then(function (acc) {

                $scope.order = acc.data;
                $scope.getRegions();
                $scope.getCountries();
                $scope.getArmenianPlaces();
            }, function () {
                alert('Error GetAccountOrder');
            });
        };

        $scope.getCreditLineOrder = function (orderId) {
            var Data = loanProductOrderService.GetCreditLineOrder(orderId);
            Data.then(function (acc) {

                $scope.order = acc.data;
                $scope.getRegions();
                $scope.getCountries();
                $scope.getArmenianPlaces();
            }, function () {
                alert('Error GetAccountOrder');
            });
        };


        $scope.getFeeAccounts = function () {
            var Data = paymentOrderService.getAccountsForOrder(13, 1, 3);
            Data.then(function (acc) {
                $scope.feeAccounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        };
        $scope.getAccounts = function () {
            var Data = paymentOrderService.getAccountsForOrder(13, 1, 1);
            Data.then(function (ref) {
                $scope.accounts = ref.data;
            }, function () {
                alert('Error Accounts');
            });
        };
        $scope.filter = 1;
        $scope.GetCards = function () {
            var Data = cardService.getCards($scope.filter);
            Data.then(function (ref) {
                $scope.cards = [];
                for (var i = 0; i < ref.data.length; i++) {
                    if (ref.data[i].CreditLine == null && ref.data[i].MainCardNumber == '') {
                        $scope.cards.push(ref.data[i]);

                    }
                }

                if ($scope.cardProductId != undefined && $scope.cards.length > 0 && $scope.orderType == 14) {

                    for (var i = 0; i < $scope.cards.length; i++) {
                        if ($scope.cardProductId == $scope.cards[i].ProductId) {
                            $scope.selectedCard = $scope.cards[i];

                            $scope.ForCreditLine();
                            $scope.getProvisionAmount();
                            $scope.getCreditLineProvisionAmount();
                            $scope.ForCreditLineSpecificType();
                        }
                    }

                }

            }, function () {
                alert('Error Accounts');
            });
        };

        $scope.getFastOverdraftApplicationAccounts = function () {
            $scope.fastOverdraftApplicationAccounts = [];
            $scope.order.ProductAccount = $scope.fastOverdraftCard;
            $scope.fastOverdraftApplicationAccounts.push($scope.fastOverdraftCard);
        }


        $scope.getAvailableAmount = function () {
            var Data = loanProductOrderService.GetAvailableAmount($scope.order.ProvisionAccount.Currency);
            Data.then(function (acc) {

                $scope.availableAmount = acc.data;
                $scope.availableCurrency = $scope.order.ProvisionAccount.Currency;
            }, function () {
                alert('Error GetAccountOrder');
            });
        };
        $scope.getProvisionAmount = function () {
            if ($scope.order.Amount != undefined) {
                var Data = loanProductOrderService.GetProvisionAmount($scope.order.Amount, $scope.order.Currency, $scope.order.ProvisionAccount.Currency);
                Data.then(function (acc) {

                    $scope.order.ProvisionAmount = acc.data;
                    $scope.order.ProvisionCurrency = $scope.order.ProvisionAccount.Currency;
                }, function () {
                    alert('Error GetAccountOrder');
                });
            }

        };

        $scope.getInterestRate = function () {

            if ($scope.order.type == 13) {
                if ($scope.order.StartDate == null ) {
                    showMesageBoxDialog('Սկզբի ամսաթվի արժեքը սխալ է։', $scope, 'error');
                    return;
                }
                else if ($scope.order.EndDate == null) {
                    showMesageBoxDialog('Վերջ ամսաթվի արժեքը սխալ է։', $scope, 'error');
                    return;
                }
            }

            var Data = loanProductOrderService.GetInterestRate($scope.order, $scope.selectedCard.CardNumber);
            Data.then(function (acc) {
                $scope.order.InterestRate = acc.data;
                $scope.interestRateShow = parseFloat($scope.order.InterestRate * 100).toFixed(2);

            }, function () {
                alert('Error GetAccountOrder');
            });
        };

        $scope.getDisputeResolutions = function () {
            var Data = loanProductOrderService.GetDisputeResolutions();
            Data.then(function (acc) {
                $scope.disputes = acc.data;
            }, function () {
                alert('Error GetAccountOrder');
            });
        };

        $scope.getCommunicationTypes = function () {
            var Data = loanProductOrderService.GetCommunicationTypes();
            Data.then(function (acc) {
                $scope.commTypes = acc.data;
            }, function () {
                alert('Error GetAccountOrder');
            });
        };

        $scope.ForCreditLine = function () {
            $scope.getInterestRate();
            $scope.order.Currency = $scope.selectedCard.Currency;
            $scope.order.ProductAccount = $scope.selectedCard.CardAccount;
            //if ($scope.selectedCard.Type == 36 || $scope.selectedCard.Type == 37) {
            //    $scope.order.EndDate = new Date($scope.order.StartDate.getFullYear(), $scope.order.StartDate.getMonth(), 14);
            //    $scope.order.EndDate.add({ years: 3, months: 1 });
            //    if ($scope.order.EndDate.getDay() == 0) {
            //        $scope.order.EndDate.add(1, 'days');
            //    }
            //    else if ($scope.order.EndDate.getDay() == 6)
            //        $scope.order.EndDate.add(2, 'days');
            //    $scope.order.EndDate = new Date($scope.order.EndDate);
            //}
            //else
                $scope.order.EndDate = new Date(parseInt($scope.selectedCard.EndDate.substr(6)));

        }

              $scope.getServiceFee = function () {
            var Data = loanProductOrderService.GetServiceFee($scope.order.Amount, $scope.order.Currency);
            Data.then(function (aa) {
                $scope.order.FeeAmount = aa.data;;
            }, function () {
                alert('Error');
            });
        };

        $scope.callbackgetCreditLineOrder = function () {
            $scope.getCreditLineOrder($scope.selectedOrderId);
        };

        $scope.callbackgetLoanOrder = function () {
            $scope.getLoanOrder($scope.selectedOrderId);
        };

        $scope.getRegions = function () {
            var Data = infoService.getRegions($scope.order.LoanUseCountry);
            Data.then(function (acc) {
                $scope.regions = acc.data;
                $scope.Places = null;
                $scope.places = null;
                if ($scope.order.LoanUseRegion != 0) {
                    $scope.order.LoanUseRegionDescription = $scope.regions[$scope.order.LoanUseRegion];
                }
            }, function () {
                alert('Error getRegions');
            });
        };

        $scope.getArmenianPlaces = function () {
            var Data = infoService.getArmenianPlaces($scope.order.LoanUseRegion);
            Data.then(function (acc) {
                $scope.Places = acc.data;
                $scope.places = FillCombo(acc.data);
                if ($scope.order.LoanUseLocality != 0) {
                    $scope.order.LoanUseLocalityDescription = $scope.Places[$scope.order.LoanUseLocality];
                }
            }, function () {
                alert('Error getArmenianPlaces');
            });
        };

        $scope.getCountries = function () {
            var Data = infoService.getCountries();
            Data.then(function (acc) {
                $scope.Countries = acc.data;
                $scope.countries = FillCombo(acc.data);
                if ($scope.order.LoanUseCountry != 0) {
                    $scope.order.LoanUseCountryDescription = $scope.Countries[$scope.order.LoanUseCountry];
                }
            }, function () {
                alert('Error getCountries');
            });
        };

        $scope.ChangeDisableInterestRateStatus = function () {
            if ($scope.rateDisableStatus == true) {
                $scope.rateDisableStatus = false;
            }
            else {
                $scope.rateDisableStatus = true;
            }
        };


        $scope.getFastOverdraftApplicationEndDate = function () {
            var Data = loanProductOrderService.getFastOverdraftApplicationEndDate($scope.order);
            Data.then(function (aa) {
                $scope.order.EndDate = new Date(parseInt(aa.data.substr(6)));
            }, function () {
                alert('Error');
            });
        };


        $scope.getListOfLoanApplicationAmounts = function () {
            var Data = infoService.getListOfLoanApplicationAmounts();
            Data.then(function (acc) {
                $scope.loanApplicationAmounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        };


        $scope.setOrderAmountForFastOverdraftApplication = function (amount) {
            if ($scope.order.Currency == "AMD") {
                $scope.order.Amount = amount;
            }
            else {

                var Data = utilityService.getCBKursForDate($scope.order.StartDate, $scope.order.Currency);
                Data.then(function (aa) {
                    $scope.kurs = aa.data;
                    $scope.order.Amount = parseInt(amount / $scope.kurs);
                }, function () {
                    alert('Error');
                });
            }


            var Data = infoService.getFastOverdraftFeeAmount(amount);
            Data.then(function (aa) {
                $scope.feeAmount = aa.data;
            }, function () {
                alert('Error');
            });
        };

        $scope.fastOverdraftValidations = function (cardNumber) {
            var Data = loanProductOrderService.fastOverdraftValidations(cardNumber);
            Data.then(function (acc) {
                $scope.error = acc.data;
            }, function () {
                alert('Error fastOverdraftValidations');
            });
        };


        $scope.getCreditLineProvisionAmount = function () {
            if ($scope.order.Amount != undefined) {
                var Data = loanProductOrderService.getCreditLineProvisionAmount($scope.order.Amount, $scope.order.Currency, $scope.order.ProvisionAccount.Currency, $scope.order.MandatoryPayment, $scope.order.ProductType);
                Data.then(function (acc) {

                    $scope.order.ProvisionAmount = acc.data;
                    $scope.order.ProvisionCurrency = $scope.order.ProvisionAccount.Currency;

                }, function () {
                    alert('Error GetAccountOrder');
                });
            }

        };

        $scope.CurencyDifference = function () {
                        
            if ($scope.selectedCard.Currency != $scope.order.ProvisionAccount.Currency ) {
                $scope.order.MandatoryPayment = 'true';
            }

            else { $scope.order.MandatoryPayment = '-1'; }
        }

     

        $scope.getStatementFixedReceivingType = function (cardNumber) {
            var Data = loanProductOrderService.getStatementFixedReceivingType(cardNumber);
            Data.then(function (acc) {
            if( acc.data!=0)
                $scope.order.CommunicationType = acc.data.toString();
            }, function () {
                alert('Error fastOverdraftValidations');
            });
        };

        $scope.CreditLinesSpecificTypes = function () {
            if ($scope.order.ProductType == 50 || $scope.order.ProductType == 51) {
                $scope.order.MandatoryPayment = 'true';
            }
        }

          $scope.ForCreditLineSpecificType = function () {
            $scope.getInterestRate();
            $scope.order.Currency = $scope.selectedCard.Currency;
            $scope.order.ProductAccount = $scope.selectedCard.CardAccount;
            $scope.order.ValidationDate = new Date(parseInt($scope.selectedCard.ValidationDate.substr(6)));

        }
    }])