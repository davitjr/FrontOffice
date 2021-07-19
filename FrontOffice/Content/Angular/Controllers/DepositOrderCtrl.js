app.controller("DepositOrderCtrl", ['$scope', 'depositOrderService', 'infoService', '$location', 'dialogService', '$uibModal', 'customerService', 'orderService', '$filter', '$http', 'dateFilter', function ($scope, depositOrderService, infoService, $location, dialogService, $uibModal, customerService, orderService, $filter, $http, dateFilter) {

    $scope.date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $scope.order = {};
    $scope.order.Deposit = {};
    $scope.order.Deposit.DepositAccount = { isAccessible: false };
    $scope.order.DepositType = undefined,
        $scope.order.Deposit.StatmentDeliveryType = -1;
    $scope.order.OrderNumber = "";
    $scope.order.ThirdPersonCustomerNumbers = [];
    $scope.order.OrderNumber = '';
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Deposit.StartDate = $scope.$root.SessionProperties.OperationDate;
    $scope.disableInterestRate = true;
    $scope.order.Deposit.DepositOption = [];

    try {
        $scope.canChangeDepositRate = $scope.$root.SessionProperties.AdvancedOptions["canChangeDepositRate"];
    }
    catch (ex) {
        $scope.canChangeDepositRate = "0";
    }


    //վերադարձնում է միայն դրամային հաշիվները
    $scope.getAccountsForPercentAccount = function () {
        var Data = depositOrderService.getAccountsForPercentAccount($scope.order);
        Data.then(function (acc) {
            $scope.percentAccounts = acc.data;
        }, function () {
            alert('Error');
        });

    };

    //վերադարձնում է միայն դրամային հաշիվները
    $scope.getClosedDepositAccountList = function () {
        var Data = depositOrderService.GetClosedDepositAccountList($scope.order);
        Data.then(function (acc) {
            $scope.closedDepositAccounts = acc.data;
        }, function () {
            alert('Error');
        });

    };


    //վերադարձնում է հաշիվները կախված ավանդի արժույթից
    $scope.GetAccountsForNewDeposit = function (ifDelete) {
        if (ifDelete != true) {
            if ($scope.order.AccountType == 1) {
                if ($scope.order.ThirdPersonCustomerNumbers.length == 0) {
                    $scope.order.Deposit.Currency = undefined;
                    return ShowMessage('Ընտրված է 1 հաճախորդ համատեղ հաշվի բացման համար', 'error');
                }

            }
            if ($scope.order.AccountType == 2) {
                if ($scope.order.ThirdPersonCustomerNumbers.length == 0) {
                    $scope.order.Deposit.Currency = undefined;
                    return ShowMessage('Ընտրված է 1 հաճախորդ հօգուտ 3-րդ անձի հաշվի բացման համար', 'error');
                }

            }
        }
        $scope.order.Currency = $scope.order.Deposit.Currency;
        var Data = depositOrderService.GetAccountsForNewDeposit($scope.order);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error');
        });
    };


    $scope.resetFields = function () {
        $scope.order.ThirdPersonCustomerNumber = '';
    }
    //Երրորդ անձանց ցուցակ
    $scope.GetThirdPersons = function () {
        var Data = depositOrderService.GetThirdPersons();
        Data.then(function (acc) {
            $scope.persons = acc.data;
        }, function () {
            alert('Persons Error');
        });

    };


    //Երրորդ անձի ծննդյան օրը
    $scope.GetThirdPersonsBirthDate = function (customerNumber) {
        var Data = depositOrderService.GetThirdPersonsBirthDate(customerNumber);
        Data.then(function (acc) {
            $scope.EndDate = acc.data;
            var date = new Date(parseInt(acc.data.substr(6)));
            var displayDate = $.datepicker.formatDate("mm/dd/yy", date);
            $scope.order.Deposit.EndDate = date;
            $scope.GetDepositCondition();
        }, function () {
            alert('Persons GetThirdPersonsBirthDate');
        });

    };


    //Արժույթները
    $scope.GetCurrencies = function () {
        $scope.currencies = null;
        if ($scope.order.DepositType != 0 && $scope.order.DepositType != undefined) {
            var Data = depositOrderService.getDepositTypeCurrency($scope.order.DepositType);
            Data.then(function (acc) {
                $scope.currencies = acc.data;
            }, function () {
                alert('Currencies Error');
            });
        }
        else {
            $scope.currencies = null;
        }
    };
    //Ավանդի տեսակները
    $scope.getActiveDepositTypesForNewDepositOrder = function () {
        var Data = infoService.getActiveDepositTypesForNewDepositOrder($scope.order.AccountType, $scope.customertype);
        Data.then(function (acc) {
            $scope.depositypes = acc.data;
            if ($scope.order.AccountType == 2) {
                $scope.order.DepositType = '4';
                $scope.order.RecontractPossibility = '1';
                $scope.GetCurrencies();
                $scope.GetDepositCondition();
            }

        }, function () {
            alert('DepositTypes Error');
        });

    };

    //Հաշվի տեսակները
    $scope.getJointTypes = function () {
        var Data = infoService.GetJointTypes();
        Data.then(function (acc) {
            $scope.jointTypes = acc.data;
            $scope.getCustomerType();
        }, function () {
            alert('DepositTypes Error');
        });

    };


    //Ավանդի հայտի պահպանում և հաստատում
    $scope.saveDepositOrder = function () {
        $scope.order.Type = 9;

        if ($scope.order.DepositType != 15) {
            $scope.order.Deposit.DepositOption = [];
        }

        if ($http.pendingRequests.length == 0) {
            document.getElementById("depositLoad").classList.remove("hidden");
            var Data = depositOrderService.saveDepositOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("depositLoad").classList.add("hidden");
                    CloseBPDialog('newdeposit');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("depositLoad").classList.add("hidden");
                    $scope.dialogId = 'newdeposit';
                    $scope.divId = 'DepositOrderForm';
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("depositLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveDeposit');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }
    $scope.getDepositOrder = function (orderId) {
        var Data = depositOrderService.GetDepositOrder(orderId);
        Data.then(function (dep) {
            if (dep.data.RecontractPossibility == 2) {
                $scope.RecontractPossibility = "Այո";
            }
            else
                $scope.RecontractPossibility = "Ոչ";
            $scope.order = dep.data;
        }, function () {
            alert('Error GetDepositOrder');
        });
    };
    //Վերադարձնում է ավանդի տոկոսադրույքը,մինիմալ և մաքսիմալ տևողությունը,մինիմալ գումար
    $scope.GetDepositCondition = function () {
        $scope.showbusinesDepositOptionRate = false;
        var date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        if ($scope.order.DepositType == '4' &&  $scope.order.Deposit.EndDate <= date)
        {
            $scope.alert = "Ավանդի ձևակերպումը հնարավոր չէ իրականացնել: Երեխայի տարիքը գերազանցում է թույլատրելի տարիքը:";
            $scope.depositInterestRate = undefined;
            $scope.order.InterestRateChanged = false;
            $scope.disableInterestRate = true;
            $scope.percent = "";
            $scope.order.Deposit.InterestRate = "";
            $scope.amountText = "";
            $scope.minDate = "";
            $scope.maxDate = "";
            $scope.selectedBusinesDepositOptionFunctionCall = false;
            return;
        }
        else if ($scope.order.Deposit.EndDate <= date) {
            $scope.alert = "Ավանդի վերջնաժամկետը սխալ է նշված:";
            $scope.depositInterestRate = undefined;
            $scope.order.InterestRateChanged = false;
            $scope.disableInterestRate = true;
            $scope.percent = "";
            $scope.order.Deposit.InterestRate = "";
            $scope.amountText = "";
            $scope.minDate = "";
            $scope.maxDate = "";
            $scope.selectedBusinesDepositOptionFunctionCall = false;
            return;
        }
        if ($scope.order.Deposit.Currency != "" && $scope.order.DepositType != 0 && $scope.order.DepositType != undefined && $scope.order.Deposit.EndDate > date) {
            var Data = depositOrderService.GetDepositCondition($scope.order);
            Data.then(function (acc) {
                if (acc.data.Percent != undefined) {

                    if (acc.data.DepositOption != null && acc.data.DepositOption.length > 0) {
                        for (let i = 0; i < acc.data.DepositOption.length; i++) {
                            for (let j = 0; j < $scope.businesDepositOptions.length; j++) {
                                if (acc.data.DepositOption[i].Type == $scope.businesDepositOptions[j].Type) {
                                    $scope.businesDepositOptions[j].Rate = acc.data.DepositOption[i].Rate;
                                }
                            }
                        }
                        $scope.showbusinesDepositOptionRate = true;
                    }

                    $scope.order.InterestRateChanged = false;
                    $scope.disableInterestRate = true;
                    $scope.alert = "";
                    $scope.percent = parseFloat(acc.data.Percent).toFixed(2);
                    $scope.order.Deposit.InterestRate = parseFloat(acc.data.Percent * 100).toFixed(2);

                    $scope.minAmount = acc.data.MinAmount;
                    $scope.amountText = "Անհրաժեշտ նվազագույն գումար" + " " + acc.data.MinAmount.toFixed(2);
                    $scope.minDate = "Ավանդի վերջը նվազագույնը կարող է լինել" + " " + $.datepicker.formatDate("dd/mm/yy", new Date(parseInt(acc.data.MinDate.substr(6))));
                    $scope.maxDate = "Ավանդի վերջը առավելագույնը կարող է լինել" + " " + $.datepicker.formatDate("dd/mm/yy", new Date(parseInt((acc.data.MaxDate.substr(6)))));

                    if ($scope.order.Amount > 0) {
                        if ($scope.order.Amount < $scope.minAmount) {
                            return ShowMessage('Տվյալ տեսակի ավանդի մինիմալ գումարը կազմում է ' + $scope.minAmount + ' ' + $scope.order.Deposit.Currency + ' :', 'error');
                        }
                    }


                    if ($scope.order.DepositType != 15) {
                        $scope.order.Deposit.DepositOption = [];
                    }
                    $scope.selectedBusinesDepositOptionFunctionCall = false;
                    $scope.depositOptionRate = (acc.data.InterestRateVariationFromOption * 100).toFixed(2);
                    $scope.depositInterestRate = parseFloat(acc.data.NominalRate * 100).toFixed(2);
                    if ($scope.order.Deposit.DepositOption.length == 0) {
                        $scope.depositOptionRate = undefined;
                    }


                }
                else {
                    $scope.order.InterestRateChanged = false;
                    $scope.disableInterestRate = true;
                    $scope.percent = "";
                    $scope.order.Deposit.InterestRate = "";
                    $scope.amountText = "";
                    $scope.minDate = "";
                    $scope.maxDate = "";
                    $scope.alert = acc.data;
                    $scope.selectedBusinesDepositOptionFunctionCall = false;
                }
            });
        }
        else {
            $scope.selectedBusinesDepositOptionFunctionCall = false;
        }
    }, function () {
        alert('Error GetDepositCondition');

    }




    $scope.searchCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });

        $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getSearchedCustomer = function (customer) {
        $scope.customerNumber = customer.customerNumber;
        $scope.closeSearchCustomersModal();
    }

    $scope.addCustomer = function (customerNumber) {
        $scope.alert = "";
        if (customerNumber == undefined) {
            return $scope.alert = "Կատարեք հաճախորդի որոնում";
        }
        else if (customerNumber.length != 12) {
            return ShowMessage('Հաճախորդի համարը պետք է լինի 12 նիշ', 'error');
        }
        else if ($scope.order.ThirdPersonCustomerNumbers.length >= 1 && $scope.order.AccountType == 2) {
            return ShowMessage('Հօգուտ երրորդ անձի ավանդ ձևակերպելիս թույլատրվում է մուտքագրել 2 հաճախորդ', 'error');
        }
        else if (($scope.order.ThirdPersonCustomerNumbers.length >= 2 && $scope.order.AccountType == 1)) {
            return ShowMessage('3 և ավելի  հաճախորդների համար համատեղ ավանդի ձևակերպում նախատեսված չէ', 'error');
        }
        else {
            for (var i = 0; i < $scope.order.ThirdPersonCustomerNumbers.length; i++) {
                if ($scope.order.ThirdPersonCustomerNumbers[i].Key == customerNumber) {
                    return $scope.alert = "Տվյալ հաճախորդը արդեն ներառված է";
                }
            }
        }
        if ($scope.order.AccountType == 2) {
            $scope.GetThirdPersonsBirthDate(customerNumber);
        }
        $scope.ThirdPerson = { Key: customerNumber, Value: "" };
        $scope.order.ThirdPersonCustomerNumbers.push($scope.ThirdPerson);
        $scope.GetAccountsForNewDeposit();
        $scope.getClosedDepositAccountList();
        $scope.getAccountsForPercentAccount();
        $scope.GetDepositCondition();
    }




    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    }

    $scope.delete = function (index) {
        $scope.alert = "";
        $scope.order.ThirdPersonCustomerNumbers.splice(index, 1);
        $scope.customerNumber = '';
        $scope.GetAccountsForNewDeposit(true);
        $scope.getClosedDepositAccountList();
        $scope.getAccountsForPercentAccount();
        $scope.GetDepositCondition();
    }

    //Ավանդի տեսակները
    $scope.GetDepositStatmentDeliveryTypes = function () {
        var Data = infoService.GetStatementDeliveryTypes();
        Data.then(function (acc) {
            $scope.depositStatmentDeliveryTypes = acc.data;
        }, function () {
            alert('DepositTypes Error');
        });

    };

    $scope.getCustomerType = function () {
        var Data = customerService.getCustomerType();
        Data.then(function (cust) {
            $scope.customertype = cust.data;
            if ($scope.customertype != 6) {
                $scope.order.AccountType = "0";
                $scope.getActiveDepositTypesForNewDepositOrder();
            }
        }, function () {
            alert('Error');
        });
    };


    $scope.isSunDay = function () {

        if (new Date(dateFilter($scope.order.Deposit.StartDate, 'yyyy/MM/dd')).getTime() == new Date(dateFilter($scope.order.Deposit.EndDate, 'yyyy/MM/dd')).getTime()) {
            return ShowMessage('Ավանդի վերջը և սկիզբը նույն օրն է:', 'error');
        }

        if (new Date(dateFilter($scope.order.Deposit.StartDate, 'yyyy/MM/dd')) > new Date(dateFilter($scope.order.Deposit.EndDate, 'yyyy/MM/dd'))) {
            return ShowMessage('Ավանդի սկիզբը մեծ է վերջից:', 'error');
        }


        var weekday;
        if ($scope.order.Deposit.EndDate != "" && $scope.order.Deposit.EndDate instanceof Date) {
            weekday = dateFilter($scope.order.Deposit.EndDate, 'yyyy/MM/dd');
        }
        else {
            return;
        }

        //if ($scope.order.Deposit.EndDate.getDay() == 0 || $scope.order.Deposit.EndDate.getDay() == 6) {
        //    return ShowMessage('Ավանդի վերջում նշված է ոչ աշխատանքային օր:', 'error');
        //}


        var Data = infoService.IsWorkingDay(weekday);
        Data.then(function (day) {

            if (day.data == false) {
                return ShowMessage('Ավանդի վերջում նշված է ոչ աշխատանքային օր:', 'error');
            }


        }, function () {
            alert('Error');
        });
    };

    $scope.checkAmount = function () {
        if (($scope.alert == undefined || $scope.alert.length == 0) && $scope.order.Amount < $scope.minAmount) {
            return ShowMessage('Տվյալ տեսակի ավանդի մինիմալ գումարը կազմում է ' + $scope.minAmount + ' ' + $scope.order.Deposit.Currency + ' :', 'error');
        }

    };

    $scope.callbackgetDepositOrder = function () {
        $scope.getDepositOrder($scope.selectedOrderId);
    }

    $scope.ChangeDisableInterestRateStatus = function () {
        if ($scope.disableInterestRate == true || $scope.disableInterestRate == undefined) {
            $scope.disableInterestRate = false;
        }
        else {
            $scope.disableInterestRate = true;
        }

    }


    $scope.getBusinesDepositOptions = function () {
        var Data = infoService.getBusinesDepositOptions();
        Data.then(function (acc) {
            $scope.businesDepositOptions = acc.data;
        }, function () {
            alert('getBusinesDepositOptions Error');
        });

    };


    $scope.getDepositActions = function () {
        var Data = depositOrderService.getDepositActions($scope.order);
        Data.then(function (acc) {
            $scope.actions = acc.data;


        }, function () {
            alert('Error');
        });

    };


    $scope.setAction = function (action) {
        if (action.ActionId == 0) {
            $scope.order.IsActionDeposit = false;
            $scope.order.Deposit.InterestRate = undefined;
            $scope.order.Deposit.EndDate = undefined;
            $scope.order.Deposit.Currency = undefined;
            $scope.order.DepositType = undefined;
            $scope.currencies = null;
            $scope.order.DepositAction = null;
            //$scope.GetDepositCondition()
        }
        else {

            //$scope.percent = parseFloat(action.Percent).toFixed(2);
            //$scope.order.Deposit.InterestRate = parseFloat(action.Percent * 100).toFixed(2);

            $scope.order.IsActionDeposit = true;
            $scope.order.DepositAction = action;
            $scope.order.Deposit.EndDate = new Date(parseInt(action.EndDate.substr(6)));
            $scope.order.DepositType = action.DepositType.toString();
            var Data = depositOrderService.getDepositTypeCurrency($scope.order.DepositType);
            Data.then(function (acc) {
                $scope.currencies = acc.data;
                $scope.order.Deposit.Currency = $scope.currencies[action.Currency];
                $scope.GetAccountsForNewDeposit();
                $scope.getAccountsForPercentAccount();
                $scope.getClosedDepositAccountList();
                $scope.GetDepositCondition();
            }, function () {
                alert('Currencies Error');
            });





        }
    };


    $scope.selectedBusinesDepositOption = function (depositOption, isSelect) {
        $scope.selectedBusinesDepositOptionFunctionCall = true;
        for (var i = 0; i < $scope.businesDepositOptions.length; i++) {
            if ($scope.businesDepositOptions[i].OptionGroup == 1) {
                $scope.businesDepositOptions[i].disabled = false;
            }
        }
        for (var i = 0; i < $scope.order.Deposit.DepositOption.length; i++) {
            if ($scope.order.Deposit.DepositOption[i].OptionGroup == 1) {
                $scope.order.Deposit.DepositOption.splice(i, 1);
                i--;
            }
        }
        var checked1 = false;
        var checked2 = false;
        var checked3 = false;
        for (var i = 0; i < $scope.businesDepositOptions.length; i++) {
            if ($scope.businesDepositOptions[i].OptionGroup == 1) {
                if ($scope.businesDepositOptions[i].checkedOption == true && $scope.businesDepositOptions[i].Type == 1) {
                    checked1 = true;
                }
                if ($scope.businesDepositOptions[i].checkedOption == true && $scope.businesDepositOptions[i].Type == 2) {
                    checked2 = true;
                }
                if ($scope.businesDepositOptions[i].checkedOption == true && $scope.businesDepositOptions[i].Type == 3) {
                    checked3 = true;
                }
            }
        }
        if (checked3) {
            for (var i = 0; i < $scope.businesDepositOptions.length; i++) {
                if ($scope.businesDepositOptions[i].OptionGroup == 1) {
                    if ($scope.businesDepositOptions[i].Type == 1) {
                        $scope.businesDepositOptions[i].checkedOption = false;
                        $scope.businesDepositOptions[i].disabled = true;
                    }
                    if ($scope.businesDepositOptions[i].Type == 2) {
                        $scope.businesDepositOptions[i].checkedOption = false;
                        $scope.businesDepositOptions[i].disabled = true;
                    }
                }
            }
        }

        if (checked1 && checked2) {
            for (var i = 0; i < $scope.businesDepositOptions.length; i++) {
                if ($scope.businesDepositOptions[i].OptionGroup == 1) {
                    if ($scope.businesDepositOptions[i].Type == 1) {
                        $scope.businesDepositOptions[i].checkedOption = false;
                        $scope.businesDepositOptions[i].disabled = true;
                    }
                    if ($scope.businesDepositOptions[i].Type == 2) {
                        $scope.businesDepositOptions[i].checkedOption = false;
                        $scope.businesDepositOptions[i].disabled = true;
                    }
                    if ($scope.businesDepositOptions[i].Type == 3) {
                        $scope.businesDepositOptions[i].checkedOption = true;
                        $scope.businesDepositOptions[i].disabled = false;
                    }
                }
            }
        }



        for (var i = 0; i < $scope.businesDepositOptions.length; i++) {
            if ($scope.businesDepositOptions[i].OptionGroup == 1) {
                if ($scope.businesDepositOptions[i].checkedOption == true) {
                    $scope.order.Deposit.DepositOption.push($scope.businesDepositOptions[i]);
                }
            }

        }

        if (isSelect) {
            for (var i = 0; i < $scope.order.Deposit.DepositOption.length; i++) {
                if ($scope.order.Deposit.DepositOption[i].OptionGroup == 2) {
                    $scope.order.Deposit.DepositOption.splice(i, 1);
                    i--;
                }
            }
            $scope.order.Deposit.DepositOption.push(depositOption);

        }

        $scope.GetDepositCondition();
    };

}]);
