app.controller("UtilityPaymentSearchCtrl", ['$scope', 'utilityPaymentService', 'paymentOrderService', '$location', '$uibModal', 'dialogService', 'infoService', 'orderService', 'customerService', '$filter', '$http', 'dateFilter', '$confirm', 'utilityService', 'ReportingApiService', function ($scope, utilityPaymentService, paymentOrderService, $location, $uibModal, dialogService, infoService, orderService, customerService, $filter, $http, dateFilter, $confirm, utilityService, ReportingApiService) {
    $scope.order = {};
    $scope.abonentType = '1';
    $scope.orderId = 0;
    $scope.searchCommunal = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    var Data = customerService.getAuthorizedCustomerNumber();
    Data.then(function (descr) {
        $scope.order.CustomerNumber = descr.data;
        if ($scope.order.CustomerNumber != 0) {
            $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);
        }


    });


    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

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
        else if ($scope.ordertype == 15 || $scope.ordertype == 117)
            $scope.orderNumberType = 3;
        else if ($scope.ordertype == 60 || $scope.ordertype == 118)
            $scope.orderNumberType = 1;
    };



    //searchType 1 By abonent number , 2 By phone Number
    $scope.utilityPayments = null;

    $scope.getUtilityTypeDescription = function (type) {
        if (type != undefined) {
            $scope.utilityType = type;
        }
        if ($scope.utilityType != undefined) {
            var Data = utilityPaymentService.getUtilityTypeDescription($scope.utilityType);

            Data.then(function (utility) {

                $scope.utilityTypeDescription = utility.data;
            }, function () {
                alert('Error');
            });
        }
    };

    $scope.getUtilitySearchBranches = function () {

        if ($scope.utilityType != undefined) {

            if ($scope.utilityType == 3 || $scope.utilityType == 4 || $scope.utilityType == 5 || $scope.utilityType == 6 || $scope.utilityType == 9) {
                var Data = infoService.getUtilitySearchBranches($scope.utilityType);
                Data.then(function (acc) {
                    $scope.utilityBranches = acc.data;
                }, function () {
                    alert('getUtilitySearchBranches Error');
                });
            }
        }

    };

    $scope.getPeriodicUtilityTypes = function () {
        var Data = infoService.GetPeriodicUtilityTypes();
        Data.then(function (acc) {
            $scope.utilitytypes = acc.data;
        }, function () {
            alert('GetPeriodicUtilityTypes Error');
        });

    };

    $scope.getUtilitySearchDescription = function () {
        if ($scope.utilityType != undefined) {
            var Data = utilityPaymentService.getUtilitySearchDescription($scope.utilityType);
            Data.then(function (utility) {
                $scope.utilitySearchDescription = utility.data;
            }, function () {
                alert('Error');
            });
        }
    };

    $scope.getAccountsForOrder = function () {
        if ($scope.checkForDebitAccount == 0) {
            var Data = paymentOrderService.getAccountsForOrder(15, 1, 1);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;
            }, function () {
                alert('Error getaccounts');
            });
        }
    };

    $scope.getAccountDescription = function (account) {
        if (account.AccountType == 11) {
            return account.AccountDescription + ' ' + account.Currency;
        }
        else {
            return account.AccountNumber + ' ' + account.Currency;
        }
    }

    $scope.getUtilityPaymentOrder = function (orderId) {
        var Data = utilityPaymentService.GetUtilityPaymentOrder(orderId);

        Data.then(function (ut) {
            $scope.order = ut.data;
            $scope.orderId = $scope.order.OrderId;
            $scope.utilityType = ut.data.CommunalType;
            $scope.getUtilityTypeDescription();
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
            $scope.order.PaymentTime = $filter('mydate')($scope.order.PaymentTime, "dd/MM/yyyy");
        }, function () {
            alert('Error getaccounts');
        });
    };

    $scope.getReestrUtilityPaymentOrder = function (orderId) {
        var Data = utilityPaymentService.getReestrUtilityPaymentOrder(orderId);

        Data.then(function (ut) {
            $scope.order = ut.data;
            $scope.orderId = $scope.order.OrderId;
            $scope.utilityType = ut.data.CommunalType;
            $scope.getUtilityTypeDescription();
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
            $scope.order.PaymentTime = $filter('mydate')($scope.order.PaymentTime, "dd/MM/yyyy");
        }, function () {
            alert('Error getaccounts');
        });
    };


    $scope.utilityPayments = JSON.parse(sessionStorage.getItem('utilityPayment'));
    if ($scope.utilityType == 14) {

        var debtListDate = JSON.parse(sessionStorage.getItem('debtListDate'));
        if (debtListDate != undefined) {

            $scope.COWaterdates = [];
            $scope.COWaterdates.push(debtListDate);
            $scope.DebtListDate = $scope.COWaterdates[0];
        }


        // $scope.DebtListDate = JSON.parse(sessionStorage.getItem('debtListDate'))

    }



    $scope.clearLocalStorage = function () {
        sessionStorage.removeItem('utilityPayment');
        sessionStorage.removeItem('debtListDate');
        sessionStorage.removeItem('COWaterdetail');
        $scope.utilityPayments = undefined;
    };

    $scope.findUtilityPayments = function (searchType) {
        showloading();
        

        if ($scope.searchCommunal.Branch == undefined && $scope.searchCommunal.AbonentNumber == undefined && $scope.searchCommunal.PhoneNumber == undefined &&
            $scope.searchCommunal.LastName == undefined && $scope.searchCommunal.Name == undefined && $scope.searchCommunal.Street == undefined &&
            $scope.searchCommunal.House == undefined && $scope.searchCommunal.Home == undefined && $scope.abonentType == 1) {
            showMesageBoxDialog('Անհրաժեշտ է լրացնել առնվազն մեկ դաշտ!', $scope, 'error');
            hideloading();
            return;
        }

        $scope.searchedAbonentType = $scope.abonentType;
        $scope.searchCommunal.CommunalType = $scope.utilityType;
        $scope.searchCommunal.AbonentType = $scope.abonentType;

        if ($scope.utilityType == 7 || $scope.utilityType == 8 || $scope.utilityType == 10) {
            $scope.searchCommunal.AbonentNumber = $scope.searchCommunal.PhoneNumber;
        }

        if ($scope.utilityType == 14) {

            if ($scope.DebtListDate != undefined && $scope.DebtListDate != '') {
                $scope.searchCommunal.DebtListDate = $filter('mydate')($scope.DebtListDate, "dd/MM/yyyy");
            }

            if ($scope.searchCommunal.DebtListDate != "" && $scope.searchCommunal.DebtListDate instanceof Date) {
                $scope.searchCommunal.DebtListDate = dateFilter($scope.searchCommunal.DebtListDate, 'yyyy/MM/dd');
            }
        }

        var Data = utilityPaymentService.findUtilityPayments($scope.searchCommunal);
        Data.then(function (utility) {
            hideloading();


            if (validate($scope, utility.data)) {
                $scope.utilityPayments = utility.data;
                sessionStorage.setItem('utilityPayment', JSON.stringify(utility.data));
                if ($scope.utilityType == 14) {
                    sessionStorage.setItem('debtListDate', JSON.stringify($scope.DebtListDate));
                    sessionStorage.setItem('COWaterdetail', JSON.stringify($scope.COWaterdetail));
                }


            }
            else {
                $scope.utilityPayments = null;
            }
        }, function () {
            hideloading();
            showMesageBoxDialog('Կոմունալի որոնման ժամանակ տեղի ունեցավ սխալ', $scope, 'error');

        });
    };

    $scope.chooseUtilityPayment = function (abonentNumber, debt) {
        $scope.order.CommunalType = $scope.utilityType;
        $scope.abonentNumber = abonentNumber;
        $scope.debt = debt;
        $scope.order.Code = abonentNumber;
        $scope.utilityType = $scope.utilityType;
        $scope.order.Branch = $scope.branch;
        $scope.order.AbonentType = $scope.selectedAbonentType;

        if ($scope.branch == undefined)
            $scope.branch = $scope.selectedBranch;
    };



    $scope.getUtilityPaymentDetails = function (checkType) {
        $scope.disableAmountButton = true;

        if ($scope.ordertype == 117 || $scope.ordertype == 118) {
            return;
        }

        $scope.loading = true;

        $scope.abonentNumber = $scope.selectedId;

        $scope.debt = $scope.selectedDebt;

        $scope.branch = $scope.selectedBranch;
        $scope.abonentType = $scope.selectedAbonentType;

        $scope.params = { selectedId: $scope.selectedId, selectedBranch: $scope.selectedBranch, utilityType: $scope.utilityType, selectedAbonentType: $scope.abonentType, abonentFilialCode: $scope.abonentFilialCode };

        var Data = utilityPaymentService.getUtilityPaymentDetails($scope.utilityType, $scope.abonentNumber, checkType, $scope.utilityType == 14 ? $scope.abonentFilialCode : $scope.branch, $scope.abonentType);
        Data.then(function (utility) {
            $scope.utilityPaymentDetails = utility.data;

            for (var i = 0; i < utility.data.length; i++) {

                if (utility.data[i].Id == 37 || utility.data[i].Id == 22 || utility.data[i].Id == 67 || utility.data[i].Id == 70 || utility.data[i].Id == 72 || utility.data[i].Id == 79 || utility.data[i].Id == 41 || utility.data[i].Id == 84) {
                    $scope.PaidInThisMonth = 0;
                    $scope.PaidInThisMonthService = 0;
                    var PaymentType;
                    var debtListDate;
                    $scope.waterCoPaymentType = $scope.order.PaymentType;

                    if ($scope.waterCoPaymentType == null)
                        PaymentType = -1;
                    else
                        PaymentType = $scope.waterCoPaymentType - 1;

                    if ($scope.debtListDate != null) {
                        if ($scope.utilityType == 3 && $scope.abonentType != 1)
                            debtListDate = new Date($scope.debtListDate.substring(3, 5) + '/' + $scope.debtListDate.substring(0, 2) + '/' + $scope.debtListDate.substring(6, 8));
                        else if ($scope.utilityType == 14)
                            debtListDate = $filter('mydate')(debtListDate, "dd/MM/yyyy");
                    }
                    var k, t;
                    if (utility.data[i].Id != 41)
                        k = i;
                    if (utility.data[i].Id == 41)
                        t = i;

                    var Data = utilityPaymentService.getComunalAmountPaidThisMonth($scope.abonentNumber, $scope.utilityType, $scope.abonentType, (debtListDate == null) ? Date.now() : debtListDate, $scope.branch, PaymentType);
                    Data.then(function (pay) {
                        $scope.PaidInThisMonth = pay.data[0];
                        $scope.PaidInThisMonthService = pay.data[1];
                        if ($scope.utilityType == 4 && $scope.abonentType == 1) {
                            if (utility.data[k].Value < 0) {
                                $scope.order.Amount = utility.data[k].Value * -1;
                            } else {
                                $scope.order.Amount = 0;
                            }
                        }
                        else {
                            $scope.order.Amount = utilityService.formatRound((parseFloat(utility.data[k].Value) + (($scope.PaidInThisMonth == null) ? 0 : $scope.PaidInThisMonth)) * -1, 1) < 0 ? 0 : utilityService.formatRound((parseFloat(utility.data[k].Value) + $scope.PaidInThisMonth) * -1, 1);
                        }
                        if (t != null) {
                            if ($scope.utilityType == 4 && $scope.abonentType == 1) {
                                if (utility.data[t].Value < 0) {
                                    $scope.order.ServiceAmount = utility.data[t].Value * -1;
                                } else {
                                    $scope.order.ServiceAmount = 0;
                                }
                            }
                            $scope.order.ServiceAmount = utilityService.formatRound((parseFloat(utility.data[t].Value) + (($scope.PaidInThisMonthService == null) ? 0 : $scope.PaidInThisMonthService)) * -1, 1) < 0 ? 0 : utilityService.formatRound((parseFloat(utility.data[t].Value) + $scope.PaidInThisMonthService) * -1, 1);
                            if ($scope.order.ServiceAmount > 0) {
                                $scope.IsServiceAmountActive = true;
                            }
                        }
                        $scope.disableAmountButton = false;

                    }, function () {
                        $scope.disableAmountButton = false;
                        alert('getComunalAmountPaidThisMonth error');
                    });

                }
                else if (utility.data[i].Id == 55) {
                    $scope.order.Amount = parseFloat(utility.data[i].Value * -1) > 0 ? 0 : parseFloat(utility.data[i].Value);
                    $scope.disableAmountButton = false;
                }

            }
            $scope.loading = false;
        }, function () {
            $scope.disableAmountButton = false;
            alert('Error');
        });
    };
    //Հայտի պահպանում

    $scope.savePayment = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("utilityLoad").classList.remove("hidden");
            $scope.order.Type = $scope.ordertype;
            $scope.order.CommunalType = $scope.utilityType;
            $scope.order.Code = $scope.abonentNumber;
            $scope.order.Branch = $scope.branch;

            $scope.order.Debt = $scope.debt;



            $scope.order.PrepaidSign = ($scope.PrepaidSign == 2) ? 1 : 0;


            var Data = utilityPaymentService.savePaymentOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("utilityLoad").classList.add("hidden");
                    CloseBPDialog('utilitypaymentorder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.DebitAccount);
                }
                else {
                    document.getElementById("utilityLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                document.getElementById("utilityLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }
    $scope.setClickedRow = function (index, utilityType) {
        $scope.selectedRow = index;
        $scope.selectedId = $scope.utilityPayments[index].AbonentNumber;
        $scope.selectedDebt = $scope.utilityPayments[index].Debt;


        $scope.selectedBranch = $scope.utilityPayments[index].BranchCode;
        $scope.selectedAbonentFilialCode = $scope.utilityPayments[index].AbonentFilialCode;
        $scope.abonentDescription = $scope.utilityPayments[index].Description;
        $scope.ComunalType = $scope.utilityPayments[index].ComunalType;
        $scope.PrepaidSign = $scope.utilityPayments[index].PrepaidSign;
        if (utilityType == 16) {
            $scope.abonentType = $scope.utilityPayments[index].CommunalAbonentType;
        }

        $scope.params = { selectedId: $scope.selectedId, selectedBranch: $scope.selectedBranch, utilityType: $scope.ComunalType, selectedAbonentType: $scope.abonentType, PrepaidSign: $scope.PrepaidSign, abonentFilialCode: $scope.selectedAbonentFilialCode }

    }

    $scope.getUtilityPaymentOrderDetails = function (isCopy, twoCopy) {

        $scope.order.OrderId = $scope.selectedOrderId;
        if ($http.pendingRequests.length == 0) {


            if (!isCopy) {
                $scope.order.CommunalType = $scope.utilityType;
                $scope.order.Code = $scope.abonentNumber;
                $scope.order.Branch = $scope.branch;
                $scope.order.Type = $scope.ordertype;
            }

            if ($scope.ordertype == 117 || $scope.ordertype == 118) {

                if (twoCopy) {
                    if (!isCopy)
                        $scope.order.Branch = $scope.branch;
                    showloading();
                    var Data = utilityPaymentService.printWaterCoPaymentReport_2Copies($scope.order, isCopy);
                    Data.then(function (pay) {
                        showloading();
                        var requestObj = { Parameters: pay.data, ReportName: 37, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('error printWaterCoPaymentReport_2Copies');
                    });
                }
                else {
                    if (!isCopy)
                        $scope.order.Branch = $scope.branch;
                    showloading();
                    var Data = utilityPaymentService.printWaterCoPaymentReportREESTR_4Copies($scope.order, isCopy);
                    Data.then(function (pay) {
                        showloading();
                        var requestObj = { Parameters: pay.data, ReportName: 38, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('error printWaterCoPaymentReportREESTR_4Copies');
                    });
                }
            }
            else {
                if (!isCopy) {
                    $scope.order.Debt = $scope.debt;

                }
                showloading();
                var Data = utilityPaymentService.getUtilityPaymentOrderDetails($scope.order, isCopy);
                Data.then(function (pay) {
                    showloading();
                    var reportId = $scope.getUtilityTypeReport($scope.order.CommunalType, $scope.order.Type);
                    var requestObj = { Parameters: pay.data, ReportName: reportId, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('error getUtilityPaymentOrderDetails');
                });
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Հանձնարական>> կոճակը:', 'error');
        }
    };

    $scope.getUtilityTypeReport = function (typeId, cashType) {
        var reportId = 0;
        switch (typeId) {
            case 3:
                if (cashType == 60) {
                    reportId = 36;
                }
                else {
                    reportId = 35;
                }
                break;
            case 4:
                if (cashType == 60) {
                    reportId = 28;
                }
                else {
                    reportId = 27;
                }
                break;
            case 5:
                if (cashType == 60) {
                    reportId = 34;
                }
                else {
                    reportId = 33;
                }
                break;
            case 6:
                if (cashType == 60) {
                    reportId = 32;
                }
                else {
                    reportId = 31;
                }
                break;
            case 7:
                if (cashType == 60) {
                    reportId = 24;
                }
                else {
                    reportId = 23;
                }
                break;
            case 8:
                if (cashType == 60) {
                    reportId = 22;
                }
                else {
                    reportId = 21;
                }
                break;
            case 9:
                if (cashType == 60) {
                    reportId = 40;
                }
                else {
                    reportId = 39;
                }
                break;
            case 10:
                if (cashType == 60) {
                    reportId = 26;
                }
                else {
                    reportId = 25;
                }
                break;
            case 11:
                if (cashType == 60) {
                    reportId = 30;
                }
                else {
                    reportId = 29;
                }
                break;
            case 14:
                reportId = 37;
                break;
            case 17:
                if (cashType == 60) {
                    reportId = 24;
                }
                else {
                    reportId = 23;
                }
                break;
        }

        return reportId;
    };

    $scope.getUtilityPaymentDescription = function () {
        $scope.order.CommunalType = $scope.utilityType;
        $scope.order.Code = $scope.abonentNumber;
        $scope.order.Branch = $scope.branch;
        $scope.order.AbonentType = $scope.abonentType;
        $scope.order.AbonentFilialCode = $scope.abonentFilialCode;
        
        var Data = utilityPaymentService.getUtilityPaymentDescription($scope.order);
        Data.then(function (pay) {
            $scope.order.Description = pay.data;
        }, function () {
            alert('error');
        });
    };


    $scope.callbackgetUtilityPaymentOrder = function () {
        $scope.getUtilityPaymentOrder($scope.selectedOrderId);
    };

    $scope.forPepaidSign = function () {
        if (paymentOrderForm.prepaidCheck.checked == true) {
            paymentOrderForm.amount.disabled = false;

        }
        else {
            paymentOrderForm.amount.disabled = true;
            $scope.order.Amount = null;
        }

    };

    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error CashTypes');
        });

    };


    $scope.getCommunalsByPhoneNumber = function () {
        showloading();
        $scope.searchedAbonentType = $scope.abonentType;
        $scope.searchCommunal.AbonentType = $scope.abonentType;
        $scope.searchCommunal.CommunalType = 3;
        var Data = utilityPaymentService.getCommunalsByPhoneNumber($scope.searchCommunal);
        Data.then(function (utility) {
            hideloading();
            if (validate($scope, utility.data)) {
                $scope.utilityPayments = utility.data;
                sessionStorage.setItem('utilityPayment', JSON.stringify(utility.data));
            }
            else {
                $scope.communals = null;
            }
        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');

        });
    };

    $scope.getPhonePayments = function () {
        showloading();
        $scope.searchCommunal.AbonentNumber = $scope.searchCommunal.PhoneNumber;
        $scope.searchedAbonentType = $scope.abonentType;
        $scope.searchCommunal.AbonentType = $scope.abonentType;
        $scope.searchCommunal.CommunalType = 8;
        var Data = utilityPaymentService.getPhonePayments($scope.searchCommunal);
        Data.then(function (utility) {
            hideloading();
            if (validate($scope, utility.data)) {
                $scope.utilityPayments = utility.data;
                sessionStorage.setItem('utilityPayment', JSON.stringify(utility.data));
            }
            else {
                $scope.communals = null;
            }
        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');

        });
    };



    $scope.getCommunalDate = function (cmnlType, abonentType) {
        var Data = infoService.getCommunalDate(cmnlType, abonentType);
        Data.then(function (acc) {
            $scope.cmnldate = acc.data;
        }, function () {
            alert('GetPeriodicUtilityTypes Error');
        });

    };

    $scope.getWaterCoDetails = function () {
        var Data = utilityPaymentService.getWaterCoDetails();
        Data.then(function (acc) {
            $scope.COWaterdetails = acc.data;

            var COWaterdetail = JSON.parse(sessionStorage.getItem('COWaterdetail'));
            if (COWaterdetail != undefined) {
                for (var i = 0; i < $scope.COWaterdetails.length; i++) {

                    if (COWaterdetail.Code == $scope.COWaterdetails[i].Code && COWaterdetail.CustomerNumber == $scope.COWaterdetails[i].CustomerNumber && COWaterdetail.FilialCode == $scope.COWaterdetails[i].FilialCode) {
                        $scope.COWaterdetail = $scope.COWaterdetails[i];
                        break;
                    }
                }
                $scope.searchCommunal.Branch = $scope.COWaterdetail.Code; $scope.searchCommunal.FilialCode = $scope.COWaterdetail.FilialCode;
                $scope.getWaterCoDebtDates($scope.searchCommunal.Branch);
                $scope.getWaterCoBranches($scope.searchCommunal.FilialCode);
                $scope.getWaterCoCitys($scope.searchCommunal.Branch);
            }


        }, function () {
            alert('GetPeriodicUtilityTypes Error');
        });

    };

    $scope.getWaterCoDebtDates = function (code) {
        var Data = utilityPaymentService.getWaterCoDebtDates(code);
        Data.then(function (acc) {
            $scope.COWaterdates = acc.data;
            $scope.DebtListDate = acc.data['0'];
        }, function () {
            alert('GetPeriodicUtilityTypes Error');
        });

    };

    $scope.getWaterCoBranches = function (filialCode) {

        if ($scope.isreestr == 'true') {
            var Data = utilityPaymentService.getReestrWaterCoBranches(filialCode);
        }
        else {
            var Data = utilityPaymentService.getWaterCoBranches(filialCode);
        }
        Data.then(function (acc) {
            $scope.COWaterBranches = acc.data;
        }, function () {
            alert('GetPeriodicUtilityTypes Error');
        });

    };

    $scope.getWaterCoCitys = function (code) {
        var Data = utilityPaymentService.getWaterCoCitys(code);
        Data.then(function (acc) {
            $scope.COWaterCitys = acc.data;
        }, function () {
            alert('GetPeriodicUtilityTypes Error');
        });

    };


    $scope.getCOWaterOrderAmount = function (paymentType) {

        if ($scope.ordertype != 117 && $scope.ordertype != 118) {
            $scope.disableAmountButton = true;
            $scope.getUtilityPaymentDescription();
            var Data = utilityPaymentService.getCOWaterOrderAmount($scope.abonentNumber, $scope.abonentFilialCode, paymentType);
            Data.then(function (pay) {
                var debtListDate;
                $scope.PaidInThisMonth = 0;
                $scope.PaidInThisMonthService = 0;


                if (paymentType == null)
                    paymentType = -1;
                else
                    paymentType = paymentType - 1;

                if ($scope.debtListDate != null) {
                    if ($scope.utilityType == 3 && $scope.abonentType != 1)
                        debtListDate = new Date($scope.debtListDate.substring(3, 5) + '/' + $scope.debtListDate.substring(0, 2) + '/' + $scope.debtListDate.substring(6, 8));
                    else if ($scope.utilityType == 14)
                        debtListDate = $filter('mydate')($scope.debtListDate, "dd/MM/yyyy");
                }
                var Data = utilityPaymentService.getComunalAmountPaidThisMonth($scope.abonentNumber, $scope.utilityType, $scope.abonentType, (debtListDate == null) ? Date.now() : debtListDate, $scope.branch, paymentType);
                Data.then(function (res) {
                    $scope.PaidInThisMonth = res.data[0];
                    $scope.PaidInThisMonthService = res.data[1];
                    $scope.order.Amount = pay.data - (($scope.PaidInThisMonth == null) ? 0 : $scope.PaidInThisMonth);
                    $scope.disableAmountButton = false;
                }, function () {
                    $scope.disableAmountButton = false;
                    alert('getComunalAmountPaidThisMonth error');
                });


            }, function () {
                $scope.disableAmountButton = false;
                alert('error');
            });
        }
    };


    $scope.validateReestrButtonClick = function () {

        $scope.reestrButtonValid = false;
        if ($scope.searchCommunal.Branch != undefined && $scope.searchCommunal.CoWaterBranch != undefined) {
            $scope.reestrButtonValid = true;
            return;
        }
        if ($scope.searchCommunal.Branch == undefined) {
            showMesageBoxDialog('Ընտրեք մասնաճյուղը', $scope, 'error');
        }
        else if ($scope.searchCommunal.CoWaterBranch == undefined) {

            showMesageBoxDialog('Ընտրեք ՋՕԸ մասնաճյուղը', $scope, 'error');
        }

    }


    $scope.saveReestrUtilityPaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("utilityLoad").classList.remove("hidden");
            $scope.order.Type = $scope.ordertype;
            $scope.order.SubType = 1;
            $scope.order.CommunalType = $scope.utilityType;
            $scope.order.Branch = $scope.branch;
            $scope.order.AbonentFilialCode = $scope.abonentFilialCode;


            document.getElementById("utilityLoad").classList.remove("hidden");
            var Data = utilityPaymentService.saveReestrUtilityPaymentOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("utilityLoad").classList.add("hidden");
                    CloseBPDialog('utilitypaymentorder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.DebitAccount);
                }
                else {
                    document.getElementById("utilityLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                document.getElementById("utilityLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }




    if ($scope.ordertype == 117 || $scope.ordertype == 118) {
        var BreakException = {};
        var fileName = '';


        $scope.order.COWaterReestrDetails = [];
        var secretEmptyKey = '[$empty$]';
        $scope.stateComparator = function (state, viewValue) {
            return viewValue === secretEmptyKey || ('' + state).toLowerCase().indexOf(('' + viewValue).toLowerCase()) > -1;
        };

        $scope.onFocus = function (e) {
            $timeout(function () {
                $(e.target).trigger('input');
            });
        };


        $scope.sumOrderAmount = function () {
            var amount = 0;
            for (var i = 0; i < $scope.order.COWaterReestrDetails.length; i++) {
                amount = parseFloat(amount) + parseFloat($scope.order.COWaterReestrDetails[i].MembershipFee) + parseFloat($scope.order.COWaterReestrDetails[i].WaterPayment);
            }
            $scope.order.Amount = amount;
            $scope.$apply();
        }

        $scope.readExcell = function (obj, valid, fileName) {
            try {
                if (obj.length > 0) {


                    try {
                        for (var i = 13; i < obj.length - 1; i++) {
                            var index = Object.keys(obj[12]);
                            var COWaterReestrDetails = { OrderNumber: parseInt(obj[i][index[1]]), AbonentNumber: obj[i][index[2]], City: obj[i][index[3]], FullName: obj[i][index[4]], TotalCharge: convertToDouble(obj[i][index[5]]), WaterPayment: convertToDouble(obj[i][index[6]]), MembershipFee: convertToDouble(obj[i][index[7]]), FileName: fileName };
                            $scope.order.COWaterReestrDetails.push(COWaterReestrDetails);

                        }
                    }
                    catch (ex) {
                        $scope.order.COWaterReestrDetails = [];
                        $scope.sumOrderAmount();
                        return ShowMessage('Տեղի ունեցավ սխալ N "' + (i + 1) + '" տողի վրա:', 'error');
                    }

                    var Data = utilityPaymentService.convertReestrDataToUnicode($scope.order.COWaterReestrDetails);
                    Data.then(function (acc) {
                        $scope.order.COWaterReestrDetails = acc.data;
                        //$scope.$apply();
                        $scope.sumOrderAmount();

                        if ($scope.order.COWaterReestrDetails.length > 300) {
                            ShowMessage('Մուտքագրվել է "' + $scope.order.COWaterReestrDetails.length + '" փոխանցում:Առավելագույն փոխանցումերի քանակ 300', 'error');
                        }
                        else {
                            ShowMessage('Մուտքագրվել է "' + $scope.order.COWaterReestrDetails.length + '" փոխանցում', 'ok');
                        }


                    },
                        function () {
                            alert('Error convertReestrDataToUnicode');
                        });



                }
                else if (obj.length == 0) {
                    ShowMessage('Excel-ի ֆայլը դատարկ է', 'error');
                }
            }
            catch (err) {
                ShowMessage('Հնարավոր չէ կարդալ Excel-ի ֆայլը', 'error');
                $("#utilitypaymentorder_my_file_input").val('');
                return;
            }
        }

        oFileIn = document.getElementById('utilitypaymentorder_my_file_input');
        if (oFileIn != undefined && oFileIn.addEventListener) {
            oFileIn.addEventListener('change', filePicked, false);

        }


        function filePicked(oEvent) {
            // Get The File From The Input
            var oFile = oEvent.target.files[0];
            // var sFilename = oFile.name;
            // Create A File Reader HTML5
            var reader = new FileReader();
            fileName = oFile.name;
            // Ready The Event For When A File Gets Selected
            reader.onload = function (e) {

                try {

                    var data = e.target.result;

                    var cfb = XLS.CFB.read(data, { type: 'binary' });

                    var wb = XLS.parse_xlscfb(cfb);
                }
                catch (err) {
                    ShowMessage('Հնարավոր չէ կարդալ Excel-ի ֆայլը', 'error');
                    $("#utilitypaymentorder_my_file_input").val('');
                    return;
                }
                // Loop Over Each Sheet

                $scope.valid = true;
                var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[wb.SheetNames[0]], { header: 1 });
                $scope.readExcell(oJS, $scope.valid, fileName);

                $("#utilitypaymentorder_my_file_input").val('');
                if (!$scope.valid) {
                    throw BreakException;
                }

            };
            // Tell JS To Start Reading The File.. You could delay this if desired
            reader.readAsBinaryString(oFile);

        }


    }

    $scope.saveCustomerCommunalCard = function () {
        if ($http.pendingRequests.length == 0) {


            $confirm({ title: 'Շարունակե՞լ', text: 'Ավելացնել կոմունալի քարտին' })
                .then(function () {


                    $scope.customerCommunalCard = {};
                    $scope.customerCommunalCard.CommunalType = $scope.params.utilityType;
                    $scope.customerCommunalCard.AbonentType = $scope.params.selectedAbonentType;
                    $scope.customerCommunalCard.AbonentNumber = $scope.params.selectedId;
                    $scope.customerCommunalCard.BranchCode = $scope.params.selectedBranch;
                    var Data = utilityPaymentService.saveCustomerCommunalCard($scope.customerCommunalCard);
                    Data.then(function (res) {

                        if (validate($scope, res.data)) {
                            ShowMessage('Մուտքագրումը կատարված է', 'information', $scope.path);
                        }
                        else {
                            //$scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }
                    }, function (err) {
                        if (err.status != 420) {
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        }
                        alert('Error in savePayment');
                    });
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };


    $scope.getCommunalsByCustomerCommunalCards = function () {
        showloading();
        var Data = utilityPaymentService.getCommunalsByCustomerCommunalCards();
        Data.then(function (ut) {
            $scope.utilityPayments = ut.data;
            hideloading();
        }, function () {
            hideloading();
            alert('error');
        });
    };



    $scope.getComunalAmountPaidThisMonth = function (abonentNumber, comunalType, abonentType, debtListDate, branch, waterCoPaymentType) {
        if (comunalType == 14) {
            return;
        }


        $scope.PaidInThisMonth = 0;
        $scope.PaidInThisMonthService = 0;
        if (waterCoPaymentType == null)
            waterCoPaymentType = -1;
        else
            waterCoPaymentType = waterCoPaymentType - 1;

        if (debtListDate != null) {
            if (comunalType == 3 && abonentType != 1)
                debtListDate = new Date(debtListDate.substring(3, 5) + '/' + debtListDate.substring(0, 2) + '/' + debtListDate.substring(6, 8));
            else if (comunalType == 14)
                debtListDate = $filter('mydate')(debtListDate, "dd/MM/yyyy");
        }
        var Data = utilityPaymentService.getComunalAmountPaidThisMonth(abonentNumber, comunalType, abonentType, (debtListDate == null) ? Date.now() : debtListDate, branch, waterCoPaymentType);
        Data.then(function (pay) {
            $scope.PaidInThisMonth = pay.data[0];
            $scope.PaidInThisMonthService = pay.data[1];
        }, function () {
            alert('getComunalAmountPaidThisMonth error');
        });
    };


    $scope.changeCustomerCommunalCardQuality = function () {



        if ($http.pendingRequests.length == 0) {

            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնել' })
                .then(function () {


                    $scope.customerCommunalCard = {};
                    $scope.customerCommunalCard.CommunalType = $scope.params.utilityType;
                    $scope.customerCommunalCard.AbonentType = $scope.params.selectedAbonentType;
                    $scope.customerCommunalCard.AbonentNumber = $scope.params.selectedId;
                    $scope.customerCommunalCard.BranchCode = $scope.params.selectedBranch;
                    var Data = utilityPaymentService.changeCustomerCommunalCardQuality($scope.customerCommunalCard);
                    Data.then(function (res) {

                        if (validate($scope, res.data)) {
                            ShowMessage('Հեռացումը կատարված է', 'information', $scope.path);
                            $scope.getCommunalsByCustomerCommunalCards();
                        }
                        else {
                            //$scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }
                    }, function (err) {
                        if (err.status != 420) {
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        }
                        alert('Error in savePayment');
                    });
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }

    }



    $scope.getENAPayments = function (abonentNumber, branch) {
        showloading();
        var Data = utilityPaymentService.getENAPayments(abonentNumber, branch);
        Data.then(function (ut) {
            $scope.ENAPayments = ut.data;
            //for (var i = 0; i < $scope.ENAPayments.length; i++) {
            //    $scope.ENAPayments[i].PaymentDate = $filter('mydate')($scope.ENAPayments[i].PaymentDate, "dd/MM/yyyy");
            //}
            hideloading();
        }, function () {
            hideloading();
            alert('error');
        });
    };

    $scope.getFilialList = function () {
        showloading();
        var Data = infoService.GetFilialList();
        Data.then(function (ut) {
            $scope.FilialList = ut.data;
            hideloading();
        }, function () {
            hideloading();
            alert('error');
        });
    }

    $scope.getENAPaymentDates = function (abonentNumber, branch) {
        showloading();
        var Data = utilityPaymentService.getENAPaymentDates(abonentNumber, branch);
        Data.then(function (ut) {
            $scope.ENAPaymentDates = ut.data;
            hideloading();
        }, function () {
            hideloading();
            alert('error');
        });
    };

    $scope.calculateENAPaymentTotal = function (filteredArray) {
        var total = 0;
        angular.forEach(filteredArray, function (item) {
            total += item.PaidAmount;
        });
        return total.toFixed(2);
    };

    $scope.firstSymbol = function (e) {
            if (e.indexOf(0) == '0') {
                $scope.searchCommunal.PhoneNumber = e.substring(1, e.length);
            }       
    };
}]);