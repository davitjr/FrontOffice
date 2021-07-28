app.controller("DepositCaseOrderCtrl", ['$scope', 'depositCaseOrderService', '$http', 'infoService', '$uibModal', 'dateFilter', '$filter', 'customerService', 'paymentOrderService', 'orderService', 'ReportingApiService', function ($scope, depositCaseOrderService, $http, infoService, $uibModal, dateFilter, $filter, customerService, paymentOrderService, orderService, ReportingApiService) {
    $scope.order = {};
    $scope.contractTypes = [];
    $scope.contractTypes[1] = 'Միաժամանակյա';
    $scope.contractTypes[2] = 'Ոչ միաժամանակյա';
    $scope.order.Type = $scope.orderType;
    $scope.order.SubType = 1;
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    var Data = customerService.getAuthorizedCustomerNumber();
    Data.then(function (descr) {
        $scope.order.CustomerNumber = descr.data;
        var Data = orderService.generateNextOrderNumber($scope.order.CustomerNumber);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
       });

    });

   
    $scope.order.DepositCase = {};
    if ($scope.orderType == 98)
    {
        $scope.order.RegistrationDate = new Date();
        $scope.order.DepositCase.JointCustomers = [];
        $scope.order.DepositCase.StartDate = $scope.$root.SessionProperties.OperationDate;
        
    }
    else
        if ($scope.orderType == 99 || $scope.orderType == 101) {
            $scope.order.DepositCase = angular.copy($scope.DepositCase);

        $scope.order.DepositCase.StartDate = new Date(parseInt($scope.order.DepositCase.StartDate.substr(6)));
        $scope.order.DepositCase.EndDate = new Date(parseInt($scope.order.DepositCase.EndDate.substr(6)));
        $scope.order.DepositCase.ContractType = $scope.order.DepositCase.ContractType.toString();
        $scope.order.DepositCase.ContractDuration = $scope.order.DepositCase.ContractDuration.toString();
        var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function(descr) {
                $scope.customerNumber = descr.data;
                for (var i = 0; i < $scope.order.DepositCase.JointCustomers.length; i++) {
                    if ($scope.order.DepositCase.JointCustomers[i].key == $scope.customerNumber) {
                        $scope.order.DepositCase.JointCustomers.splice(i, 1);
                    }
                }
            });


        }

    

    if ($scope.userFilialCode == 22041)
    {
        if ($scope.caseSide==1)
            $scope.maxHeight = 620;
        else
            $scope.maxHeight = 820;
    }


    $scope.getDepositCaseContractDays = function () {
        var Data = infoService.getDepositCaseContractDays();
        Data.then(function (acc) {
            $scope.caseContractDays = acc.data;
        }, function () {
            alert('Error');
        });

    };


    $scope.saveDepositCaseOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.error = null;

            if ($scope.orderType == 99)
            {
                $scope.order.Fees = [];
               
                    if ($scope.cashType == 23) {
                        $scope.order.FeeAccount = {};
                        $scope.order.FeeAccount.AccountNumber = 0;
                    }


                $scope.order.Fees = [
                    {
                        Amount: $scope.order.Amount,
                        Type: $scope.cashType,
                        Account: $scope.order.FeeAccount,
                        Currency: 'AMD'
                    }
                ];
            }


            document.getElementById("depositCaseOrderLoad").classList.remove("hidden");
            var Data = depositCaseOrderService.saveDepositCaseOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    document.getElementById("depositCaseOrderLoad").classList.add("hidden");

                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('newDepositCaseOrder');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("depositCaseOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("depositCaseOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveDepositCaseOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.addCustomer = function (customerNumber) {
        $scope.alert = "";
        if (customerNumber == undefined) {
            return ShowMessage('Կատարեք հաճախորդի որոնում', 'error');
        }
        else if (customerNumber.length != 12) {
            return ShowMessage('Հաճախորդի համարը պետք է լինի 12 նիշ', 'error');
        }
        else if ($scope.order.DepositCase.JointCustomers.length >= 1) {
            return ShowMessage('Թույլատրվում է մուտքագրել 1 հաճախորդ', 'error');
        }

        $scope.ThirdPerson = { key: customerNumber, Value: "" };
        $scope.order.DepositCase.JointCustomers.push($scope.ThirdPerson);

    };

    $scope.delete = function (index) {
        $scope.order.DepositCase.JointCustomers.splice(index, 1);
        $scope.customerNumber = '';
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
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };

    $scope.setContractEndDate = function () {

        if ($scope.order.DepositCase.StartDate != "" && $scope.order.DepositCase.StartDate instanceof Date) {
            var startDate = dateFilter($scope.order.DepositCase.StartDate, 'yyyy/MM/dd');
            var Data = depositCaseOrderService.getDepositCaseContractEndDate(startDate, $scope.order.DepositCase.ContractDuration);
            Data.then(function (acc) {
                $scope.order.DepositCase.EndDate = new Date(parseInt(acc.data.substr(6)));
            }, function () {
                alert('Error');
            });

        }

    };

    $scope.getDepositCaseOrderContractNumber = function () {
        var Data = depositCaseOrderService.getDepositCaseOrderContractNumber();
        Data.then(function (acc) {
            $scope.order.DepositCase.ContractNumber = acc.data;
        }, function () {
            alert('Error');
        });

    };

    $scope.isSunDay = function () {


        var weekday;
        if ($scope.order.DepositCase.StartDate != "" && $scope.order.DepositCase.StartDate instanceof Date) {
            weekday = dateFilter($scope.order.DepositCase.StartDate, 'yyyy/MM/dd');
        }
        else {
            return;
        }
        var Data = infoService.IsWorkingDay(weekday);
        Data.then(function (day) {

            if (day.data == false) {
                return ShowMessage('Պայմանագրի սկիզբում նշված է ոչ աշխատանքային օր:', 'error');
            } else
                $scope.setContractEndDate();


        }, function () {
            alert('Error');
        });
    };


    $scope.getDepositCaseMap = function (caseSide) {
        var Data = depositCaseOrderService.getDepositCaseMap(caseSide);
        Data.then(function (acc) {
            $scope.depositCaseMap = acc.data;

            var column = 1;
            var height = 0;
            for (var i = 0; i < $scope.depositCaseMap.length; i++)
            {
                if (height < $scope.maxHeight || $scope.maxHeight==undefined) {
                    $scope.depositCaseMap[i]["Column"] = column;
                    switch ($scope.depositCaseMap[i].CaseType) {
                        case 1:
                        case 6:
                            $scope.depositCaseMap[i]["Height"] = '20px';
                            height = height + 20;
                            break;
                        case 2:
                        case 8:
                            $scope.depositCaseMap[i]["Height"] = '30px';
                            height = height + 30;
                            break;
                        case 3:
                        case 7:
                            $scope.depositCaseMap[i]["Height"] = '50px';
                            height = height + 50;
                            break;
                        case 4:
                            $scope.depositCaseMap[i]["Height"] = '70px';
                            height = height + 70;
                            break;
                        case 5:
                            $scope.depositCaseMap[i]["Height"] = '120px';
                            height = height + 120;
                            break;
                        default:
                            break;
                    }
                    
                }
                else {
                    height = 0;
                    i--;
                    column++;
                }

            }

        }, function () {
            alert('Error');
        });

    };

    $scope.min = function (arr)
    {
        return $filter('min')
          ($filter('map')(arr, 'Column'));
    }



    $scope.getAccounts = function () {

        var Data = paymentOrderService.getAccountsForOrder(99, 1, 1);
        Data.then(function (acc) {
            $scope.connectAccounts = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });

    };


    $scope.getFeeAccounts = function () {
        var Data = paymentOrderService.getAccountsForOrder(1, 2, 3);
        Data.then(function (acc) {
            $scope.feeAccounts = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });
    };


    $scope.getDepositCasePrice = function () {

        var Data = depositCaseOrderService.getDepositCasePrice($scope.order.DepositCase.CaseNumber, $scope.order.DepositCase.ContractDuration);
        Data.then(function (acc) {
            $scope.order.Amount = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });

    };


    $scope.getDepositCaseOrder = function (orderId) {

        var Data = depositCaseOrderService.getDepositCaseOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getDepositCaseOrder');
        });

    };

    $scope.getDepositCaseContract = function (productId)
    {
        showloading();
        var Data = depositCaseOrderService.getDepositCaseContract(productId);
        ShowPDF(Data);
    };


    
    $scope.getDepositCaseCloseContract = function (productId)
    {
        showloading();
        var Data = depositCaseOrderService.getDepositCaseCloseContract(productId);
        ShowPDF(Data);
    };


    $scope.setCaseNumber = function (caseNumber) {
        var scope = angular.element(document.getElementById('DepositCaseOrderOrderForm')).scope();
        scope.order.DepositCase.CaseNumber =caseNumber;
        CloseBPDialog('depositCaseMap');
    }

    $scope.printOrder = function () {

        if ($scope.order.OrderNumber == undefined || $scope.order.OrderNumber == "") {
            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (descr) {
                $scope.order.CustomerNumber = descr.data;
                var Data = orderService.generateNextOrderNumber($scope.order.CustomerNumber);
                Data.then(function (nmb) {
                    $scope.order.OrderNumber = nmb.data;
                    showloading();
                    var Data = depositCaseOrderService.printOrder($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 81, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error printOrder');
                    });
                });

            });
        }
        else {
            showloading();
            var Data = depositCaseOrderService.printOrder($scope.order);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 81, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error printOrder');
            });
        }
    }
}]);