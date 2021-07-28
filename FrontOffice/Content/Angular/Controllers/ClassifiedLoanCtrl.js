app.controller("ClassifiedLoanCtrl", ['$scope', 'infoService', 'classifiedLoanService','ReportingApiService',
    function ($scope, infoService, classifiedLoanService, ReportingApiService) {

        $scope.searchParams = {};
        $scope.today = Date();
        $scope.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        $scope.searchParams.DateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()); 
        $scope.searchParams.ListType = "1"; 
        $scope.searchParams.FilialCode = 0; 
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

        $scope.currentPage = 0;
        $scope.numPerPage = 500;
        $scope.maxSize = 1;
        $scope.totalRows = 0;
        $scope.totalsByCurrency = [];

        $scope.$watch('currentPage', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.searchParams.StartRow = (newValue - 1) * $scope.numPerPage + 1;
                $scope.searchParams.EndRow = newValue * $scope.numPerPage;
                $scope.getSearchedClassifiedLoans();
            }
        });
        $scope.getSearchedClassifiedLoans = function () {
            $scope.classifiedLoans = undefined;
            $scope.searchParams.DateTo = $scope.searchParams.DateFrom;
            var Data = classifiedLoanService.getSearchedClassifiedLoans($scope.searchParams);

            Data.then(function (acc) {
                $scope.classifiedLoans = acc.data;
                $scope.setTotalsByCurrency();
                if ($scope.classifiedLoans.length>0)
                    $scope.totalRows = $scope.classifiedLoans[0].RowCount;
                else
                    $scope.totalRows = 0;
                if ($scope.totalRows / $scope.numPerPage > 5) {
                    $scope.maxSize = 5;
                }
                else {
                    $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                }


            }, function () {
                $scope.classifiedLoans = [];
                return ShowMessage('Հնարավոր չէ բեռնել դասակարգված վարկերը:', 'error');
            });
        };

        $scope.setSearchParameters = function ()
        {
            $scope.searchParams = {};
            $scope.searchParams.DateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            $scope.searchParams.DateTo = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            $scope.searchParams.ListType = "1"; 
            $scope.searchParams.StartRow = 1;
            $scope.searchParams.EndRow = 1500; 
            //$scope.searchParams.CustomerNumber = 0;
            $scope.searchParams.AppID = 0;
            $scope.searchParams.Currency = 0;
            
            $scope.getSearchedClassifiedLoans();
        }

        $scope.setClickedRow = function (credit) {

            $scope.selectedClassifiedLoan = credit;

        };

        $scope.checkSelectedCredits = function (isCheckedAllCredits) {
            if ($scope.classifiedLoans != undefined) {
                for (var i = 0; i < $scope.classifiedLoans.length; i++) {
                    if (isCheckedAllCredits == true) {
                        $scope.classifiedLoans[i].isChecked = true;
                    }
                    else {
                        $scope.classifiedLoans[i].isChecked = false;
                    }
                }
            }

        }

        $scope.setCurrentClassifiedLoans = function () {
            $scope.currentClassifiedLoan = [];
            if ($scope.classifiedLoans != undefined) {
                for (var i = 0; i < $scope.classifiedLoans.length; i++) {
                    if ($scope.classifiedLoans[i].isChecked == true) {
                        $scope.currentClassifiedLoan.push($scope.classifiedLoans[i]);
                    }
                }
            }

            $scope.params = { loans: $scope.currentClassifiedLoan }
            return true;

        }

        $scope.getFilialList = function () {
            var Data = infoService.GetFilialList();
            Data.then(function (ref) {
                $scope.filials = ref.data;
                $scope.filialList = [];

                $scope.filialList = [
                    { id: '', name: 'Բոլորը' }
                ];
                for (i in $scope.filials) {
                    $scope.fil = { id: i, name: $scope.filials[i] }
                    $scope.filialList.push($scope.fil);
                }
                $scope.searchParams.FilialCode = '';
            }, function () {
                alert('Error getFilialList');
            });
        };

        $scope.getCurrencies = function () { 
            var Data = infoService.getCurrenciesKeyValueType();
            Data.then(function (acc) {
                $scope.currencies = acc.data;
                $scope.cur = [];
                $scope.cur = [{ Key: '0', Value: 'Բոլորը' }];
                for (i in $scope.currencies) {                    
                    $scope.c = { Key: $scope.currencies[i].Key, Value: $scope.currencies[i].Value }
                    if ($scope.c.Key != undefined)
                        $scope.cur.push($scope.c);
                }
                $scope.searchParams.Currency = '0';
            }, function () {
                alert('Currencies Error');
                });
        }

        $scope.getClassifiedLoanOrder = function (orderId) {
            var Data = classifiedLoanService.getClassifiedLoanOrder(orderId);
            Data.then(function (dep) {
                $scope.order = dep.data;
                $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
            }, function () {
                alert('Error getClassifiedLoanOrder');
            });
        };


        $scope.customersClassification = function () {
            $scope.classifiedLoans = undefined;
            var Data = classifiedLoanService.customersClassification();
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    switch ($scope.ResultCode) {
                        case 0:
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                            break;
                        case 1:
                            $scope.getSearchedClassifiedLoans();
                            break;
                    }
                    $scope.storedCreditProductsByCustReport(1);
                    $scope.storedCreditProductsByCustReport(2);
                    $scope.storedCreditProductReport(1);
                    $scope.storedCreditProductReport(2);
                    $scope.reportOfLoansToOutBalance();
                    $scope.reportOfLoansReturningToOutBalance();
                }
            });      
        }

        $scope.setTotalsByCurrency = function () {
            $scope.totalsByCurrency = []; 
            var classifiedLoansGroupByCurrency = groupBy($scope.classifiedLoans, 'Currency');
            for (var i = 0; i < classifiedLoansGroupByCurrency.length; i++) {
                var sumAmount = 0;
                var sumAmountCurrent = 0;
                var currency = classifiedLoansGroupByCurrency[i][0].Currency;
                for (var j = 0; j < classifiedLoansGroupByCurrency[i].length; j++) {
                    sumAmount += Number(classifiedLoansGroupByCurrency[i][j].StartCapital);
                    sumAmountCurrent += Number(classifiedLoansGroupByCurrency[i][j].CurrentCapital);
                }
                $scope.totalsByCurrency.push({ 'Currency': currency, 'Total': sumAmount, 'TotalCurrent': sumAmountCurrent}); 
            }
        }

        $scope.storedCreditProductsByCustReport = function (type) {
            var filialcode
            if ($scope.searchParams.FilialCode == "")
                filialcode = -1
            else
                filialcode = $scope.searchParams.FilialCode
            var Data = classifiedLoanService.storedCreditProductsByCustReport(filialcode,type);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 121, ReportExportFormat: 2 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowExcelReport(result, 'StoredCreditProductsByCustReport');
                });
            }, function () {
                alert('Error storedCreditProductsByCustReport');
            });
        } 
        $scope.storedCreditProductReport = function (type) {
            var filialcode
            if ($scope.searchParams.FilialCode == "")
                filialcode = -1
            else
                filialcode = $scope.searchParams.FilialCode
            var Data = classifiedLoanService.storedCreditProductReport(filialcode,type);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 122, ReportExportFormat: 2 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowExcelReport(result, 'StoredCreditProductReport');
                });
            }, function () {
                alert('Error storedCreditProductReport');
            });
        } 
        $scope.reportOfLoansToOutBalance = function () {
            var filialcode
            if ($scope.searchParams.FilialCode == "")
                filialcode = -1
            else
                filialcode = $scope.searchParams.FilialCode
            var Data = classifiedLoanService.reportOfLoansToOutBalance(filialcode);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 123, ReportExportFormat: 2 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowExcelReport(result, 'ReportOfLoansToOutBalance');
                });
            }, function () {
                alert('Error reportOfLoansToOutBalance');
            });
        } 
        $scope.reportOfLoansReturningToOutBalance = function () {
            var filialcode
            if ($scope.searchParams.FilialCode == "")
                filialcode = -1
            else
                filialcode = $scope.searchParams.FilialCode
            var Data = classifiedLoanService.reportOfLoansReturningToOutBalance(filialcode);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 124, ReportExportFormat: 2 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowExcelReport(result, 'ReportOfLoansReturningToOutBalance');
                });
            }, function () {
                alert('Error reportOfLoansReturningToOutBalance');
            });
        } 
    }]);