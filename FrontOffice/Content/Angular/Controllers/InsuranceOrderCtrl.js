app.controller('InsuranceOrderCtrl', ['$scope', 'infoService', 'paymentOrderService', 'insuranceOrderService', '$http', 'customerService', '$filter', 'orderService', 'ReportingApiService', function ($scope, infoService, paymentOrderService, insuranceOrderService, $http, customerService, $filter, orderService, ReportingApiService) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Insurance = {};


    if ($scope.isLoanInsurance) {
        $scope.order.Insurance.ConectedProductId = $scope.loanProductId;
    }

    $scope.order.Currency = "AMD";
    $scope.order.SubType = 1;


    $scope.setOperationTime = function () {
        $scope.order.OperationDate = new Date();
    };

    $scope.generateNewOrderNumber = function () {
        var Data = orderService.generateNewOrderNumber(10);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    $scope.generateNewOrderNumber();


    $scope.getInsuranceCompanies = function (insuranceType) {
        var Data = infoService.getInsuranceCompaniesByInsuranceType(insuranceType);
        Data.then(function (dep) {
            $scope.insuranceCompanies = dep.data;
        }, function () {
            alert('Error');
        });
    };

    $scope.getInsuranceTypesByProductType = function () {

        var isLoanProduct = false;
        var isSeparatelyProduct = false;
        if ($scope.isLoanInsurance) {
            isLoanProduct = true;
        }
        else {
            isSeparatelyProduct = true;
        }

        var Data = infoService.getInsuranceTypesByProductType(isLoanProduct, isSeparatelyProduct);
        Data.then(function (dep) {
            $scope.insuranceTypes = dep.data;
        }, function () {
            alert('Error');
        });
    };

    /*Hayk Khachatryan ----------------*/

    $scope.getInsuranceTypesByContractType = function (insuranceContractType) {

        if (insuranceContractType == 2) {
            $scope.StartDateTime = '00:00';
            $scope.EndDateTime = '00:00';

            $scope.showStartDateTime = false;
            $scope.showEndDateTime = false;
        }
        else {
            $scope.showStartDateTime = true;
            $scope.showEndDateTime = true;
        }

        var isLoanProduct = false;
        var isSeparatelyProduct = false;
        if ($scope.isLoanInsurance) {
            isLoanProduct = true;
        }
        else {
            isSeparatelyProduct = true;
        }

        if ($scope.isProvision == undefined) {
            $scope.isProvision = false;
        }

        var Data1 = infoService.getInsuranceTypesByContractType(insuranceContractType, isLoanProduct, isSeparatelyProduct, $scope.isProvision);
        Data1.then(function (dep1) {
            $scope.insuranceTypes = dep1.data;
        }, function () {
            alert('Error');
        });
    };



    $scope.getInsuranceContractTypesByProductType = function () {
        var isLoanProduct = false;
        var isSeparatelyProduct = false;
        if ($scope.isLoanInsurance) {
            isLoanProduct = true;
        }
        else {
            isSeparatelyProduct = true;
        }

        if ($scope.isProvision == undefined) {
            $scope.isProvision = false;
        }

        var Data1 = infoService.getInsuranceContractTypesByProductType(isLoanProduct, isSeparatelyProduct, $scope.isProvision);
        Data1.then(function (dep) {
            $scope.insuranceContractTypes = dep.data;
        }, function () {
            alert('Error');
        });
    };

    /* -----------Hayk KHachatryan*/


    $scope.getDebitAccounts = function () {


        var Data = paymentOrderService.getAccountsForOrder(1, 2, 3);
        Data.then(function (acc) {
            $scope.debitAccounts = acc.data;
        }, function () {
            alert('Error getdebitaccounts');
        });

    };


    $scope.saveInsuranceOrder = function () {
        $scope.error = null;
        $scope.order.Insurance.IdPro = $scope.IdPro;

        if ($http.pendingRequests.length == 0) {
            document.getElementById("InsuranceOrderLoad").classList.remove("hidden");
            var Data = insuranceOrderService.saveInsuranceOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("InsuranceOrderLoad").classList.add("hidden");
                    CloseBPDialog('newInsuranceOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("InsuranceOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("InsuranceOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveDeposit');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.setDescription = function () {
        if ($scope.order.Insurance.InsuranceType != undefined && $scope.order.Insurance.Company != undefined) {
            var Data = customerService.getCustomer();
            Data.then(function (cust) {
                $scope.customer = cust.data;

                $scope.order.Description = $scope.insuranceTypes[$scope.order.Insurance.InsuranceType] + ' ' +
                    'ապահովագրավճար ' + $scope.insuranceCompanies[$scope.order.Insurance.Company] + ' ' + (!($scope.customer.OrganisationName) ? $scope.customer.FirstName + ' ' + $scope.customer.LastName : $scope.customer.OrganisationName)
                    + ' (' + $scope.customer.CustomerNumber.toString() + ') ' + ' ' + $scope.customer.FilialCode;


            }, function () {
                alert('Error');
            });
        }
    };


    $scope.$watch('checkForDebitAccount', function (newValue, oldValue) {
        if ($scope.checkForDebitAccount != undefined)
            if ($scope.checkForDebitAccount == 0) {
                $scope.order.Type = 107;
            }
            else if ($scope.checkForDebitAccount == 1) {
                $scope.order.Type = 108;
            }

    });


    $scope.getTimehours = function () {

        $scope.hours = [];
        for (var i = 1; i <= 24; i++) {
            $scope.hours.push({ Key: i, Value: i.toString() });
        }

        //$scope.StartDateHour = $scope.hours[11];
        $scope.EndDateHour = $scope.hours[11];
    };

    $scope.getTimeMinutes = function () {

        $scope.minutes = [];

        $scope.minutes.push({ Key: 0, Value: '00' });
        $scope.minutes.push({ Key: 10, Value: '10' });
        $scope.minutes.push({ Key: 20, Value: '20' });
        $scope.minutes.push({ Key: 30, Value: '30' });
        $scope.minutes.push({ Key: 40, Value: '40' });
        $scope.minutes.push({ Key: 50, Value: '50' });

        $scope.StartDateminute = $scope.minutes[0];
        $scope.EndDateminute = $scope.minutes[0];
    };

    $scope.setFullStartDate = function () {
        if ($scope.StartDateTime != undefined && $scope.StartDateTime != "") {
            $scope.order.Insurance.StartDate.setHours($scope.StartDateTime.substr(0, $scope.StartDateTime.indexOf(":")));
            $scope.order.Insurance.StartDate.setMinutes($scope.StartDateTime.substr($scope.StartDateTime.indexOf(":") + 1));
        }

    };
    $scope.setFullEndDate = function () {
        if ($scope.EndDateTime != undefined && $scope.EndDateTime != "") {
            $scope.order.Insurance.EndDate.setHours($scope.EndDateTime.substr(0, $scope.EndDateTime.indexOf(":")));
            $scope.order.Insurance.EndDate.setMinutes($scope.EndDateTime.substr($scope.EndDateTime.indexOf(":") + 1));
        }

    };




    $scope.getInsuranceOrder = function (orderId) {
        var Data = insuranceOrderService.getInsuranceOrder(orderId);

        Data.then(function (ut) {
            $scope.order = ut.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getaccounts');
        });
    };



    $scope.$watch('StartDateTime', function (val) {
        if (val != undefined && val != "") {

            if (parseInt(val.substr(0, val.indexOf(":"))) >= 24 || parseInt(val.substr(0, val.indexOf(":"))) < 0) {
                $scope.StartDateTimeValid = false;
                return;
            }
            else if (parseInt(val.substr(val.indexOf(":") + 1)) > 60 || parseInt(val.substr(val.indexOf(":") + 1)) < 0) {
                $scope.StartDateTimeValid = false;
                return;
            }

            $scope.StartDateTimeValid = true;
            if ($scope.order.Insurance.StartDate != undefined) {
                $scope.order.Insurance.StartDate.setHours(val.substr(0, val.indexOf(":")));
                $scope.order.Insurance.StartDate.setMinutes(val.substr(val.indexOf(":") + 1));
            }
        }
    });
    $scope.$watch('EndDateTime', function (val) {
        if (val != undefined && val != "") {

            if (parseInt(val.substr(0, val.indexOf(":"))) >= 24 || parseInt(val.substr(0, val.indexOf(":"))) < 0) {
                $scope.EndDateTimeValid = false;
                return;
            }
            else if (parseInt(val.substr(val.indexOf(":") + 1)) > 60 || parseInt(val.substr(val.indexOf(":") + 1)) < 0) {
                $scope.EndDateTimeValid = false;
                return;
            }

            $scope.EndDateTimeValid = true;
            if ($scope.order.Insurance.EndDate != undefined) {
                $scope.order.Insurance.EndDate.setHours(val.substr(0, val.indexOf(":")));
                $scope.order.Insurance.EndDate.setMinutes(val.substr(val.indexOf(":") + 1));
            }
        }
    });



    //ՀՀ տարածքում վճարման հանձնարարականի տպում
    $scope.getPaymentOrderDetails = function () {
        showloading();
        var Data;
        if ($scope.order.Type == 107) {
            Data = insuranceOrderService.getPaymentOrderDetails($scope.order);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 63, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error getPaymentOrderDetails');
            });
        }
        else if ($scope.order.Type == 108) {
            Data = insuranceOrderService.getCashInPaymentOrderDetails($scope.order);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error getCashInPaymentOrderDetails');
            });
        }

    };



    $scope.getInsuranceCompanySystemAccountNumber = function (companyID, insuranceType) {


        if (companyID != undefined && companyID != 0 && insuranceType != undefined && insuranceType != 0) {
            var Data = insuranceOrderService.getInsuranceCompanySystemAccountNumber(companyID, insuranceType);
            Data.then(function (acc) {
                if (acc.data == 0) {
                    ShowMessage('Տվյալ ապահովագրական ընկերության համար տվյալ տեսակի ապահովագրություն նախատեսված չէ:', 'error');
                    $scope.order.Description = '';
                }
                else {
                    $scope.setDescription();
                }
            }, function () {
                alert('Error getdebitaccounts');
            });
        }

    };


}]);