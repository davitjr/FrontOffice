app.controller("PeriodicOrderCtrl", ['$scope', 'dialogService', 'infoService', 'periodicOrderService', 'paymentOrderService', '$uibModal', 'utilityPaymentService', 'orderService', '$confirm', '$http',  function ($scope, dialogService, infoService, periodicOrderService, paymentOrderService, $uibModal, utilityPaymentService, orderService, $confirm, $http) {
    if ($scope.periodicorder==undefined) {
    $scope.periodicorder = {};
    }
    
    if ($scope.periodic == 3) {
        if ($scope.periodicorder.UtilityPaymentOrder == undefined)
        {
            $scope.periodicorder.UtilityPaymentOrder = {};
            $scope.periodicorder.Currency = 'AMD';
                var Data = orderService.generateNewOrderNumber(9);
                Data.then(function (nmb) {
                    $scope.periodicorder.OrderNumber = nmb.data;
                }, function () {
                    alert('Error generateNewOrderNumber');
                });
        }
        var date=new Date();
        if (date.getDate() <= 10)
        {
            $scope.periodicorder.FirstTransferDate = new Date(date.getFullYear(), date.getMonth(), 10);
        }
        else
        {
            $scope.periodicorder.FirstTransferDate = new Date(date.getFullYear(), date.getMonth()+1, 10);
        }
    }
    if ($scope.periodic == 1 || $scope.periodic == 2) {
        $scope.periodicorder.PaymentOrder = {};
    }
    if ($scope.periodic == 4) {
        $scope.periodicorder.BudgetPaymentOrder = {};
        $scope.periodicorder.Currency = "AMD";
    }
     $scope.periodicorder.ChargeType = 1;
     $scope.periodicorder.AllDebt = false;

     $scope.periodicorder.StartDate = $scope.$root.SessionProperties.OperationDate;
     if ($scope.periodic != 3) {
         $scope.periodicorder.FirstTransferDate = $scope.$root.SessionProperties.OperationDate;
     }

     if ($scope.periodic ==5) {
         $scope.periodicorder.PeriodicDescription = "SWIFT-ով ուղարկվող քաղվածք";
          var Data = orderService.generateNewOrderNumber(9);
                Data.then(function (nmb) {
                    $scope.periodicorder.OrderNumber = nmb.data;
                }, function () {
                    alert('Error generateNewOrderNumber');
                });
     }

    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.getPeriodicOrderFee = function () {


        $scope.feeType = 0;
        if ($scope.checkOwnerAccount) {
            $scope.feeType = 11;
            $scope.order.Type = 10;
            $scope.order.SubType = 1;
            $scope.order.Amount = $scope.periodicorder.Amount;
            $scope.order.Currency = $scope.order.DebitAccount.Currency;
            if ($scope.periodicorder.ChargeType == 2) {
                $scope.periodicorder.Fee = -1;
                return;
            }


        }
        else if($scope.periodic==2)
        {
            $scope.periodicorder.FeeAccount = null;
            $scope.periodicorder.Fee = 0;
            return;
        }
        else if ($scope.periodic == 1)
        {
            $scope.order.Type = 10;
            $scope.order.SubType = 2;
        }
        else if ($scope.periodic == 4) {
            $scope.order.Type = 10;
            $scope.order.SubType = 5;
        }

        var Data = paymentOrderService.getFee($scope.order, $scope.feeType);
        Data.then(function (acc) {
            $scope.periodicorder.Fee = acc.data;
        }, function () {
            alert('GetPeriodicsSubTypes Error');
        });

    };
    $scope.getAccountsForOrder = function () {
        var Data = paymentOrderService.getAccountsForOrder(15, 1, 1);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error getaccounts');
        });
    };
    $scope.getDebitAccounts = function () {

        var orderSubType = 2;
        if ($scope.periodic == 4)
            orderSubType = 5;
        if ($scope.periodic == 1)
            orderSubType = 2;

        var Data = paymentOrderService.getAccountsForOrder(10, orderSubType, 1);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error getaccounts');
        });
    };

    $scope.getAccountDescription = function (account) {
        if (account.AccountType == 11) {
            return account.AccountDescription + ' ' + account.Currency;
        }
        else {
            return account.AccountNumber + ' '  + account.Currency;
        }
    }


    $scope.getPeriodicsSubTypes = function () {
        var Data = infoService.GetPeriodicsSubTypes();
        Data.then(function (acc) {
            $scope.periodicssubtypes = acc.data;
        }, function () {
            alert('GetPeriodicsSubTypes Error');
        });
    };

    $scope.periodiclyType = function () {
        var Data = infoService.PeriodiclyType();
        Data.then(function (acc) {
            $scope.periodiclyTypes = acc.data;
            $scope.periodicorder.Periodicity = '30';
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.debtType = function () {
        var Data = infoService.DebtType();
        Data.then(function (acc) {
            $scope.debtTypes = acc.data;
            $scope.periodicorder.PayIfNoDebt='0';
        }, function () {
            alert('Currencies Error');
        });

    };


    $scope.$watch('ReceiverBankCode', function (newValue, oldValue) {
        if (newValue < 22000 || newValue >= 22300) {
            $scope.show = true;
        }
        else
            $scope.show = false;
    });



    $scope.$watch('order.DebitAccount', function (newValue, oldValue) {
        if (($scope.periodic == 1 || $scope.periodic == 4) && $scope.order != undefined) {
            $scope.order.Amount = 1;
            $scope.order.Type = 10;
            if ($scope.order.DebitAccount != undefined) {
                $scope.order.Currency = $scope.order.DebitAccount.Currency;
                if($scope.order.IsRAFound==1){
                    $scope.order.Currency = 'AMD';
                }
                var Data = paymentOrderService.getFee($scope.order,0);
                Data.then(function (fee) {
                    $scope.periodicorder.Fee = fee.data;
                }, function () {
                    alert('Error getfee');
                });
                $scope.getPeriodicOrderFee($scope.order);
            }
        }
        if ($scope.periodic == 2) {
            $scope.getPeriodicOrderFee($scope.order);
        }
        
    });

    $scope.submit = function (type)
    {
       
        if (type == 2) {
            $scope.paymentOrderForm.$setSubmitted();
            if ($scope.paymentOrderForm.$valid == true && $scope.order.DebitAccount != undefined && $scope.order.ReceiverAccount != undefined) {
                if (type == 1 && parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) >= 22000 &&
                    parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) < 22300 && $scope.order.IsRAFound!=1)
                {
                    ShowMessage('Ներբանկային պարբերական փոխանցում անհրաժեշտ է կատարել փոխանցում բանկի ներսում բաժնի միջոցով:', 'error');
                    return false;
                }
                return true;
            }
            else {

                return false;
            }
        }
        if (type == 1) {
            $scope.transferArmPaymentOrderForm.$setSubmitted();
            if ($scope.transferArmPaymentOrderForm.$valid == true && $scope.order.DebitAccount != undefined && $scope.order.ReceiverAccount != undefined) {
                if (parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) >= 22000 &&
                    parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5)) < 22300 && $scope.order.IsRAFound != 1) {
                    showMesageBoxDialog('/Error/MsgError', 'Փոխանցում բանկի ներսում', 'error', 'Ներբանկային պարբերական փոխանցում անհրաժեշտ է կատարել փոխանցում բանկի ներսում բաժնի միջոցով:', $scope, dialogService);
                    return false;
                }
                return true;
            }
            else {

                return false;
            }
        }
        if (type == 3) {
            $scope.periodicOrderForm.$setSubmitted();
            $scope.periodicOrderForm.periodicUtilityForm.$setSubmitted();
            if ($scope.periodicOrderForm.$valid == true && $scope.periodicOrderForm.periodicUtilityForm.$valid == true &&
                $scope.periodicorder.UtilityPaymentOrder.DebitAccount != undefined && $scope.periodicorder.UtilityPaymentOrder.DebitAccount.AccountNumber != undefined) {
                return true;
            }
            else {
                return false;
            }
        }
        if (type == 4) {
            $scope.budgetPaymentOrderForm.$setSubmitted();
            if ($scope.budgetPaymentOrderForm.$valid == true && $scope.order.DebitAccount != undefined) {
                return true;
            }
            else {
                return false;
            }

        }
        if (type == 5)
        {
            $scope.periodicSwiftStatementOrderForm.$setSubmitted();
            if ($scope.periodicSwiftStatementOrderForm.$valid == true) {
                return true;
            }
            else {
                return false;
            }
        }
    }


    $scope.savePeriodicOrder = function (type)
    {

        if (type == 2 || type == 1)
        {
            $scope.paymentOrderForm.$setSubmitted();
            
            $scope.periodicorder.PaymentOrder = $scope.order;
            if (type == 1) {

                $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
                if ($scope.order.ReceiverBankCode >= 22000 && $scope.order.ReceiverBankCode < 22300) {

           
                    $scope.periodicorder.PeriodicType = 1;
                    $scope.periodicorder.SubType = 1;
                }
                else
                {
                    $scope.order.Type = 1;
                    $scope.order.SubType = 2;
                    $scope.periodicorder.PeriodicType = 2;
                    $scope.periodicorder.SubType = 1;
                }              
                $scope.periodicorder.PeriodicDescription = $scope.order.Description;
            }
            else
            {
                $scope.periodicorder.PeriodicType = 1;
                if ($scope.forBankTransfers == true)
                {
                    $scope.periodicorder.SubType = 1;
                }
                else
                {
                    $scope.periodicorder.SubType = 3;
                }
                $scope.setOrderType();
            }
            $scope.savePeriodicPaymentOrder();
        }
        if (type == 3)
        {
            $scope.savePeriodicUtilityPaymentOrder();
        }
        if (type == 4) {
            $scope.budgetPaymentOrderForm.$setSubmitted();
            // $scope.order.ReceiverAccount.AccountNumber = '10300' + $scope.budgetPaymentOrderForm.ReceiverAccountNumber.toString();
            $scope.order.SubType = 5;
            $scope.order.Type=1;
            $scope.order.FeeAccount = $scope.periodicorder.FeeAccount;
            $scope.order.ReceiverBankCode = $scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5);
            $scope.periodicorder.BudgetPaymentOrder = $scope.order;
            $scope.periodicorder.PeriodicDescription = $scope.order.Description;
            $scope.savePeriodicBudgetPaymentOrder();
        }
        if (type == 5)
        {
            $scope.savePeriodicSwiftStatementOrder();
        }
    }

    $scope.getFeeAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
        Data.then(function (acc) {
            $scope.feeAccounts = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });
    };

    $scope.confirm = false;

    $scope.savePeriodicPaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("periodicLoad").classList.remove("hidden");
            $scope.periodicorder.Type = 10;
            $scope.periodicorder.OrderNumber = $scope.periodicorder.PaymentOrder.OrderNumber;
            $scope.periodicorder.PaymentOrder.ReceiverBankCode = $scope.periodicorder.PaymentOrder.ReceiverAccount.AccountNumber.toString().substr(0, 5);
            $scope.periodicorder.PaymentOrder.Currency = $scope.periodicorder.Currency;
            $scope.periodicorder.IsRAFound = $scope.periodicorder.PaymentOrder.IsRAFound;
            var Data = periodicOrderService.savePeriodicPaymentOrder($scope.periodicorder, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("periodicLoad").classList.add("hidden");
                    CloseBPDialog('newperiodic');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(10);

                }
                else {
                    $scope.seterror($scope.error);
                    document.getElementById("periodicLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePeriodicPaymentOrder);

                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("periodicLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    };

    $scope.savePeriodicUtilityPaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("periodicLoad").classList.remove("hidden");
            $scope.periodicorder.PeriodicType = 3;
            $scope.periodicorder.Type = 10;
            $scope.periodicorder.SubType = 2;
            if ($scope.periodicorder.ChargeType == 2) {
                $scope.periodicorder.AllDebt = true;
            }
            else {
                $scope.periodicorder.AllDebt = false;
            }
            var Data = periodicOrderService.savePeriodicUtilityPaymentOrder($scope.periodicorder, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("periodicLoad").classList.add("hidden");
                    CloseBPDialog('newperiodic');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(10);

                }
                else {
                    document.getElementById("periodicLoad").classList.add("hidden");

                    $scope.dialogId = 'newperiodic';
                    $scope.divId = 'periodicUtilityForm';

                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePeriodicUtilityPaymentOrder);

                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("periodicLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:','error');
        }
    };



    //Փոխանցման տեսակի և ենթատեսակի որոշում
    $scope.setOrderType = function () {
        if ($scope.periodicorder.PaymentOrder.DebitAccount != undefined && $scope.periodicorder.PaymentOrder.ReceiverAccount != undefined)
        {
            if ($scope.periodicorder.PaymentOrder.DebitAccount.Currency == $scope.periodicorder.PaymentOrder.ReceiverAccount.Currency) {
                $scope.periodicorder.PaymentOrder.Type = 1;//RATransfer
                if ($scope.forBankTransfers == true) {
                    $scope.periodicorder.PaymentOrder.SubType = 1;//սեփական հաշիվների միջև
                }
                else
                {
                    $scope.periodicorder.PaymentOrder.SubType = 3;//սեփական հաշիվների միջև
                } 
            }
            else {
                if ($scope.forBankTransfers == true)
                {
                    $scope.periodicorder.PaymentOrder.Type = 65;
                }
                else
                {
                    $scope.periodicorder.PaymentOrder.Type = 2;
                }
                
                $scope.periodicorder.PaymentOrder.SubType = 0;
            }
        }
    };

      $scope.getUtilityTypeDescription = function (type)
          {
            var Data = utilityPaymentService.getUtilityTypeDescription(type);
            Data.then(function (utility) {
                if ($scope.periodicorder.UtilityPaymentOrder != undefined)
                    {
                    $scope.periodicorder.UtilityPaymentOrder["Description"] = utility.data;
                    }
                $scope.CommunalTypeDescription = utility.data;
            }, function () {
                alert('Error');
            });
         };


    $scope.searchcommunal = function () {
        $scope.searchCommunalModalInstance = $uibModal.open({
            template: '<searchcommunal callback="getCommunalDetails(branch,description, selectedId, abonentType, utilityType,abonentDescription,PrepaidSign)" close="closesearchCommunalModal()" periodic="2"></searchcommunal>', scope: $scope, backdrop: 'static'
            });
    };

    $scope.getCommunalDetails = function (branch, description, selectedId, abonentType, utilityType, abonentDescription, PrepaidSign) {
        $scope.periodicorder.UtilityPaymentOrder["Code"] = selectedId;
        $scope.periodicorder.UtilityPaymentOrder["Branch"] = branch;
        $scope.periodicorder.UtilityPaymentOrder["AbonentType"] = abonentType;
        $scope.periodicorder.UtilityPaymentOrder["CommunalType"] = utilityType;

        $scope.getUtilityTypeDescription(utilityType);
            
        if (abonentDescription != null) {
            $scope.periodicorder.PeriodicDescription = utilityType != 9 ? (abonentDescription.toString().substr(0, abonentDescription.toString().search(/\n/))) : abonentDescription;
            $scope.address= abonentDescription.toString().substr(abonentDescription.toString().search(/\n/), abonentDescription.lenght);
        if (utilityType== 11) {
            $scope.periodicorder.PeriodicDescription = abonentDescription;
        }
        }
        else {
            $scope.periodicorder.PeriodicDescription = abonentDescription;
            $scope.address =null;
        }
        $scope.PrepaidSign = PrepaidSign;
        $scope.closesearchCommunalModal();
    }

    $scope.closesearchCommunalModal = function () {
        $scope.searchCommunalModalInstance.close();
    }

    $scope.savePeriodicBudgetPaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {
        document.getElementById("periodicLoad").classList.remove("hidden");
        $scope.periodicorder.PeriodicType = 2;
        $scope.periodicorder.Type = 10;
        $scope.periodicorder.SubType = 4;
        $scope.periodicorder.Currency = "AMD";
        $scope.periodicorder.OrderNumber = $scope.periodicorder.BudgetPaymentOrder.OrderNumber;
        $scope.periodicorder.BudgetPaymentOrder.Currency = $scope.periodicorder.Currency;
        if ($scope.periodicorder.ChargeType == 2) {
            $scope.periodicorder.AllDebt = true;
        }
        else {
            $scope.periodicorder.AllDebt = false;
        }
        var Data = periodicOrderService.savePeriodicBudgetPaymentOrder($scope.periodicorder, $scope.confirm);
        Data.then(function (res) {
            $scope.confirm = false;
            if (validate($scope, res.data)) {
                document.getElementById("periodicLoad").classList.add("hidden");
                $scope.path = '#Orders';
                CloseBPDialog('newperiodic');
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                refresh(10);

            }
            else {
                $scope.seterror($scope.error);
                document.getElementById("periodicLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePeriodicBudgetPaymentOrder);

            }
        }, function (err) {
            $scope.confirm = false;
            document.getElementById("periodicLoad").classList.add("hidden");
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error in savePayment');
        });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getPeriodicUtilityPaymentOrder = function (orderId) {
        var Data = periodicOrderService.getPeriodicUtilityPaymentOrder(orderId);
        Data.then(function (dep) {
            $scope.order = dep.data;
            $scope.getUtilityTypeDescription($scope.order.UtilityPaymentOrder.CommunalType);
        }, function () {
            alert('Error getPeriodicUtilityPaymentOrder');
        });
    };

    $scope.getPeriodicPaymentOrder = function (orderId, subType) {
        var Data = periodicOrderService.getPeriodicPaymentOrder(orderId, subType);
        Data.then(function (dep) {
            $scope.order = dep.data;
            if (subType == 4)
            {
                $scope.order.PaymentOrder = dep.data.BudgetPaymentOrder;
            }
            $scope.order.DebitAccount = $scope.order.PaymentOrder.DebitAccount;
        }, function () {
            alert('Error getPeriodicUtilityPaymentOrder');
        });
    };

    $scope.getRAFoundAccount = function () {
        var Data = periodicOrderService.getRAFoundAccount();
        Data.then(function (dep) {
            $scope.foundAccount = dep.data;
            $scope.order.ReceiverAccount = $scope.foundAccount;
            $scope.receiverAccountAccountNumber = $scope.foundAccount.AccountNumber;
            $scope.setReceiverBank();
        }, function () {
            alert('Error getRAFoundAccount');
        });
    };


    $scope.$watch('order.IsRAFound',
        function() {
            if ($scope.order != undefined) {
                if ($scope.order.IsRAFound == 1) {
                    $scope.getRAFoundAccount();
                    $scope.periodicorder.CheckDaysCount = 20;
                    //document.getElementById("ReceiverAccount").disabled = true;
                    document.getElementById("ReceiverAccount").disabled = true;
                    var date = new Date();
                    $scope.periodicorder.FirstTransferDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                    $scope.periodicorder.PeriodicDescription = "Նվիրատվություն Հայաստան Հիմնադրամին(" +
                        $scope.customer.FirstName +
                        " " +
                        $scope.customer.LastName +
                        ", " +
                        $scope.customer.CustomerNumber +
                        ")";
                    $scope.order.Currency = 'AMD';
                } else if ($scope.order.IsRAFound == 0) {
                    $scope.order.ReceiverAccount = {};
                    $scope.receiverAccountAccountNumber = undefined;
                    $scope.periodicorder.PeriodicDescription = undefined;
                    $scope.periodicorder.CheckDaysCount = undefined;
                    $scope.periodicorder.FirstTransferDate = undefined;
                    if ($scope.order.DebitAccount != undefined)
                        $scope.order.Currency = $scope.order.DebitAccount.Currency;
                    else
                        $scope.order.Currency = undefined;

                }
                $scope.isLeasingAccount = false;
            }
        });

    $scope.setCheckDaysCount = function ()
    {
        if ($scope.periodicorder.Periodicity == 1) {
            $scope.periodicorder.CheckDaysCount = 1;
        }
        else
            $scope.periodicorder.CheckDaysCount = undefined;

    }
    //Արժույթները
    $scope.GetCurrencies = function () {
        var Data = infoService.getCurrencies();
            Data.then(function (acc) {
                $scope.currencies = acc.data;
            }, function () {
                alert('Currencies Error');
            });
    };
    $scope.$watch('order.DebitAccount.Currency', function (newValue, oldValue) {
        if ($scope.periodic != 2 && newValue!=undefined) {
            $scope.periodicorder.Currency = $scope.order.DebitAccount.Currency;
        }

    });

    $scope.$watch('selectedLeasingLoanDetails', function (newValue, oldValue) {
        if ($scope.periodic!=5 && $scope.selectedLeasingLoanDetails!=undefined &&  $scope.selectedLeasingLoanDetails!="")
        $scope.periodicorder.PeriodicDescription = $scope.selectedLeasingLoanDetails.Description + "  " + $scope.selectedLeasingLoanDetails.AddDescription;

    });



    $scope.callbackgetPeriodicPaymentOrder = function () {
        $scope.getPeriodicPaymentOrder($scope.selectedOrderId);
    };

    $scope.callbackgetPeriodicUtilityPaymentOrder = function () {
        $scope.getPeriodicUtilityPaymentOrder($scope.selectedOrderId);
    };

    $scope.$watch('checkOwnerAccount', function (newValue, oldValue) {
        if (newValue != undefined)
        {
            $scope.getPeriodicOrderFee();
        }

    });

    $scope.savePeriodicSwiftStatementOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("periodicLoad").classList.remove("hidden");
            $scope.periodicorder.PeriodicType = 100;
            $scope.periodicorder.Type = 10;
            $scope.periodicorder.SubType = 5;
            if ($scope.periodicorder.ChargeType == 2) {
                $scope.periodicorder.AllDebt = true;
            }
            else {
                $scope.periodicorder.AllDebt = false;
            }
            var Data = periodicOrderService.savePeriodicSwiftStatementOrder($scope.periodicorder, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("periodicLoad").classList.add("hidden");
                    CloseBPDialog('newperiodic');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(10);

                }
                else {
                    document.getElementById("periodicLoad").classList.add("hidden");

                    $scope.dialogId = 'newperiodic';
                    $scope.divId = 'periodicUtilityForm';

                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.savePeriodicSwiftStatementOrder);

                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("periodicLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };



    $scope.searchSwiftCodes = function () {
        $scope.searchSwiftCodesModalInstance = $uibModal.open({
            template: '<searchswiftcode callback="getSearchedSwiftCode(swiftCode)" close="closeSearchSwiftCodesModal()"></searchswiftcode>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });

        $scope.searchSwiftCodesModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getSearchedSwiftCode = function (swiftCode) {
        $scope.periodicorder.ReceiverBankSwiftCode = swiftCode;
        $scope.closeSearchSwiftCodesModal();
    }

    $scope.closeSearchSwiftCodesModal = function () {
        $scope.searchSwiftCodesModalInstance.close();
    }

    
    $scope.getPeriodicSwiftStatementOrderFee = function () {
        var Data = periodicOrderService.getPeriodicSwiftStatementOrderFee();
        Data.then(function (acc) {
            $scope.periodicorder.Fee = acc.data;
        }, function () {
            alert('Error getPeriodicSwiftStatementOrderFee');
        });
    };


}]);