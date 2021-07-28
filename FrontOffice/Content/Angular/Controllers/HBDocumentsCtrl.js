app.controller('HBDocumentsCtrl', ['$scope', '$rootScope', 'HBDocumentsService', 'orderService', '$location', 'customerService', 'casherService', 'dialogService', '$confirm', '$uibModal', '$http', '$compile', '$state', '$window', '$filter','$log', '$sce', 'ReportingApiService', function ($scope, $rootScope, HBDocumentsService, orderService, $location, customerService, casherService, dialogService, $confirm, $uibModal, $http, $compile, $state, $window, $filter, $log, $sce, ReportingApiService) {
    // $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    $scope.searchParams = {};
    $scope.currentOperDay;
    $scope.bankCode = 22000;
    $scope.HB_transactions_permission = 1;
    change = 0;
    $scope.rowCount = 50;
    $scope.msgRowCount = 30;
    $scope.DocType = 0;
    $scope.DocSubType = 0;
    $scope.DocSubTypeDescription = "";
    $scope.CustomerNumber = 0;
    $scope.debitAccountCustomerNumber = 0;
    $scope.debitAccountNumber = 0;
    $scope.selectedMsg = {};
    $scope.operationType2 = false;
    $scope.operationType3 = false;
    $scope.messageSearch = {};
    $scope.msgInfo = {};
    $scope.message = {};
    $scope.transactionError = {};
    $scope.msgAllCount = 0;
    $scope.msgPageCount = 0;
    $scope.IsDisableFilial = false;

    //var date = new Date();
    //var y = date.getFullYear();
    //var m = date.getMonth();

    var change = 0;

    //Initialization
    $scope.initOperDay = function () {
        var Data = HBDocumentsService.getCurrentOperDay();
        Data.then(function (bond) {
            $scope.currentOperDay = new Date(parseInt(bond.data.substr(6)));
        }, function () {
        });

    };

    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.userFilialCode = ref.data.toString();            
            $scope.getFilialList()
        }, function () {
                alert('Error getUserFilialCode');
        });
    };



    $scope.initSearchParamsDefaultValues = function () {

        //var today = new Date();
        //var d = today.getDate().toString() + '/' + (today.getMonth() + 1).toString() + '/' + today.getFullYear().toString();
        //var time = today.getHours().toString() + ":" + today.getMinutes().toString(); // + ":" + today.getSeconds().toString();
        ////var ampm = today.getHours() >= 12 ? 'PM' : 'AM';
        //$scope.currentDateTime = d + ' ' + time;

        if ($scope.searchParams !== undefined) {
            //$scope.searchParams.StartDate = ($scope.searchParams.StartDate !== undefined ? $scope.searchParams.StartDate : new Date(y, m, 1));
            //$scope.searchParams.EndDate = ($scope.searchParams.EndDate !== undefined ? $scope.searchParams.EndDate : date);
            $scope.searchParams.PageNumber = ($scope.searchParams.PageNumber !== undefined ? $scope.searchParams.PageNumber : 1);
        }

        $scope.searchParams.TransactionCode = null;
        $scope.searchParams.StartDate = null;
        $scope.searchParams.EndDate = null;
        $scope.searchParams.OperationType = "2";
        $scope.searchParams.SourceType = null;
        $scope.searchParams.QualityType = "3";
        $scope.searchParams.CustomerNumber = null;
        $scope.searchParams.DebitAccount = null;
        $scope.searchParams.OnlySelectedCustomer = false;
        $scope.searchParams.FilialCode = null;
        $scope.searchParams.DocumentType = null;
        $scope.searchParams.DocumentSubType = null;
        $scope.searchParams.Amount = null;
        $scope.searchParams.CurrencyType = null;
        $scope.searchParams.Description = null;
        $scope.searchParams.OnlyACBA = "0";

        $scope.pageCount = 0;
    };


    $scope.setClickedRow = function (document, index) {

        $scope.selectedRequest = document;

        $scope.params = {
            selectedOrderId: document.TransactionCode, type: document.DocumentType, subType: document.DocumentSubtype, selectedQualityDescription: null,
            selectedSourceDescription: null, customerNumber: document.CustomerNumber, showPaymentType: true, debitAccount: document.DebitAccount,
            order: document, quality: document.TransactionQuality, bankCode: document.FilialCode,
            checkForDebitAccountTransferArmPayment: 0, checkForFeeAccount: 0, orderType: 1,
            DebitAccountNumber: document.DebitAccount, periodic: false, interBankTransfer: false, isOrderDetails: false, sourceTypes: document.TransactionSource, rowIndesx: index
        };

        $scope.debitAccountNumber = $scope.params.debitAccount;

        sessionStorage.setItem("selectedDocument", angular.toJson(document));

        sessionStorage.setItem("rowIndex", index);

    };

    $scope.getSourceTypes = function () {
        var Data = HBDocumentsService.getSourceTypes();
        Data.then(function (bond) {
            //$scope.sourceTypes = angular.fromJson(bond.data);
            $scope.sourceTypes = bond.data;
        }, function () {
        });
    };

    $scope.getQualityTypes = function () {
        var Data = HBDocumentsService.getQualityTypes();
        Data.then(function (bond) {
            $scope.qualityTypes = bond.data;
        }, function () {
        });
    };

    $scope.getFilialList = function () {
        var Data = HBDocumentsService.getFilialList();
        Data.then(function (bond) {
            $scope.filialsList = bond.data;
            if ($scope.userFilialCode != 22000) {
                // $scope.filialsList = $scope.filialsList[$scope.userFilialCode];
                $scope.searchParams.FilialCode = $scope.userFilialCode;
                $scope.IsDisableFilial = true;
            }
            $scope.initTableInfo();

        }, function () {
        });
    };

    $scope.getDocumentTypes = function () {
        var Data = HBDocumentsService.getDocumentTypes();
        Data.then(function (bond) {
            $scope.documentTypes = bond.data;
        }, function () {
        });
    };

    $scope.getDocumentSubTypes = function () {
        var Data = HBDocumentsService.getDocumentSubTypes();
        Data.then(function (bond) {
            $scope.documentSubtypes = bond.data;
        }, function () {
        });
    };

    $scope.getCurrencyTypes = function () {
        var Data = HBDocumentsService.getCurrencyTypes();
        Data.then(function (bond) {
            $scope.currencyTypes = bond.data;
        }, function () {
        });
    };

    $scope.initTableInfo = function () {

        $scope.searchParams.TransactionCode = null;
        $scope.searchParams.StartDate = null;
        $scope.searchParams.EndDate = null;
        $scope.searchParams.OperationType = "2";
        $scope.searchParams.SourceType = null;
        $scope.searchParams.QualityType = "3";
        $scope.searchParams.CustomerNumber = null;
        $scope.searchParams.DebitAccount = null;
        $scope.searchParams.OnlySelectedCustomer = false;
        //$scope.searchParams.FilialCode = null;
        $scope.searchParams.DocumentType = null;
        $scope.searchParams.DocumentSubType = null;
        $scope.searchParams.Amount = null;
        $scope.searchParams.CurrencyType = null;
        $scope.searchParams.Description = null;
        $scope.searchParams.OnlyACBA = "0";
        $scope.searchParams.firstRow = 0;
        $scope.searchParams.LastGetRowCount = 50;
        if ($scope.userFilialCode == 22000)
            $scope.searchParams.FilialCode = null
        else
            $scope.searchParams.FilialCode = $scope.userFilialCode;

        localStorage.setItem("searchParams", angular.toJson($scope.searchParams));

        showloading();

        var Data = HBDocumentsService.getHBDocumentsList($scope.searchParams);
        Data.then(function (req) {
            $scope.searchParams.PageNumber = 1;
            //sessionStorage.clear();
            if (req.data.length != 0) {
                $scope.hbDocuments = {};
                $scope.hbDocuments = req.data;

                if ($scope.hbDocuments.length != 0) {

                    if ($scope.hbDocuments[0].CustomerDetails.ObjectEmpty == true) {
                        $scope.customerInfoDetails = null;
                    }
                    else {
                        $scope.customerInfoDetails = $scope.hbDocuments[0].CustomerDetails;
                    }
                    //$scope.customerInfoDetails = $scope.hbDocuments[0].CustomerDetails;
                    $scope.accountFlowDetails = $scope.hbDocuments[0].AccountDetails;
                    $scope.totalAmount = $scope.hbDocuments[0].TotalAmount;
                    $scope.totalQuantity = $scope.hbDocuments[0].TotalQuantity;

                    $scope.selectRow($scope.hbDocuments[0]);

                    if ($scope.hbDocuments[0].DocumentType == 5) {
                        $scope.showCreditAccount = true;
                        $scope.CreditAccount = $scope.hbDocuments[0].CreditAccount;
                    }
                    else {
                        $scope.showCreditAccount = false;
                    }

                    sessionStorage.setItem("selectedDocument", angular.toJson($scope.hbDocuments[0]));
                    sessionStorage.setItem("searchResult", angular.toJson($scope.hbDocuments));

                    $scope.allCount = $scope.totalQuantity;
                    $scope.pageCount = Math.ceil($scope.totalQuantity / $scope.rowCount);

                    var docs = $scope.hbDocuments;
                    $scope.hbDocuments = docs.splice(0, $scope.rowCount - 1);

                    $scope.setClickedRow($scope.hbDocuments[0]);
                }

            }
            else {
                $scope.hbDocuments = null;
                $scope.customerInfoDetails = null;
                $scope.accountFlowDetails = null;
                $scope.totalAmount = 0;
                $scope.totalQuantity = 0;
                $scope.selectedRow = null;

                $scope.searchParams.PageNumber = 0;

                $scope.allCount = $scope.totalQuantity;
                $scope.pageCount = Math.ceil($scope.totalQuantity / $scope.rowCount);
            }


            document.getElementById("tableBody").scrollTo(0, 0);

            //$scope.firstColumn = ($scope.allCount === 0 ? 0 : 10 * $scope.searchParams.PageNumber - 9);
            //$scope.lastColumn = (10 * $scope.searchParams.PageNumber < $scope.totalQuantity ? 10 * $scope.searchParams.PageNumber : $scope.totalQuantity);

            hideloading();

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    //Form functions
    $scope.changeTime = function () {
        var obj = [];
        obj.push($scope.changeableTime);
        var Data = HBDocumentsService.postChangedAutomatedConfirmTime(obj);
        Data.then(function (req) {
            var str = req.data;
            $scope.currentDateTime = str;
            var time = str.substr(11);
            document.getElementById('changeableTime').value = time;
        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.printHomeBankingReport = function () {
        showloading();
        var obj = angular.fromJson(localStorage.getItem("searchParams"));
        var Data = HBDocumentsService.printHomeBankingDocumentsReport(obj);
        Data.then(function (options) {
            var requestObj = { Parameters: options.data, ReportName: 134, ReportExportFormat: 2 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowExcelReport(result, 'ՀԲ համակարգով կատարված գործարքների ցուցակ');
            });
        }, function () {
            alert('Error printHomeBankingDocumentsReport');
        });

    };

    $scope.resetFilters = function () {
        $scope.searchParams.TransactionCode = null;
        $scope.searchParams.StartDate = null;
        $scope.searchParams.EndDate = null;
        $scope.searchParams.OperationType = "0";
        $scope.searchParams.SourceType = null;
        $scope.searchParams.QualityType = null;
        $scope.searchParams.CustomerNumber = null;
        $scope.searchParams.DebitAccount = null;
        if (!$scope.IsDisableFilial)
            $scope.searchParams.FilialCode = null;
        $scope.searchParams.DocumentType = null;
        $scope.searchParams.DocumentSubType = null;
        $scope.searchParams.Amount = null;
        $scope.searchParams.CurrencyType = null;
        $scope.searchParams.Description = null;
        $scope.searchParams.OnlySelectedCustomer = false;
        $scope.searchParams.OnlyACBA = "0";
        $scope.searchParams.firstRow = 0;
        $scope.searchParams.LastGetRowCount = 50;

        $scope.showCreditAccount = false;
        change = 1;
    };
    $scope.refreshInfos = function () {

        if ($scope.searchParams !== {}) {


            $scope.searchParams = angular.fromJson(localStorage.getItem("searchParams"));


            var Data = HBDocumentsService.getSearchedHBDocuments($scope.searchParams);
            Data.then(function (req) {
                if ($scope.searchParams.firstRow == 0) {
                    $scope.searchParams.PageNumber = 1;
                }
                //sessionStorage.clear();
                if (req.data.length != 0) {
                    $scope.hbDocuments = [];
                    $scope.hbDocuments = req.data;
                    if ($scope.hbDocuments.length > 0) {
                        if ($scope.hbDocuments[0].CustomerDetails != null) {
                            if ($scope.hbDocuments[0].CustomerDetails.ObjectEmpty == true) {
                                $scope.customerInfoDetails = null;
                            }
                            else {
                                $scope.customerInfoDetails = $scope.hbDocuments[0].CustomerDetails;
                            }
                        }
                        else {
                            $scope.customerInfoDetails = null;
                        }

                        $scope.accountFlowDetails = $scope.hbDocuments[0].AccountDetails;
                        $scope.totalAmount = $scope.hbDocuments[0].TotalAmount;
                        $scope.totalQuantity = $scope.hbDocuments[0].TotalQuantity;

                        if ($scope.hbDocuments[0].DocumentType == 5) {
                            $scope.showCreditAccount = true;
                            $scope.CreditAccount = $scope.hbDocuments[0].CreditAccount;
                        }
                        else {
                            $scope.showCreditAccount = false;
                        }

                        //$scope.selectedRow = $scope.hbDocuments[0];
                        $scope.selectRow($scope.hbDocuments[0]);
                        sessionStorage.setItem("selectedDocument", angular.toJson($scope.hbDocuments[0]));
                        sessionStorage.setItem("searchResult", angular.toJson($scope.hbDocuments));

                        $scope.allCount = $scope.totalQuantity;
                        $scope.pageCount = Math.ceil($scope.totalQuantity / $scope.rowCount);

                        var docs = $scope.hbDocuments;
                        $scope.hbDocuments = docs.splice(0, $scope.rowCount - 1);

                        // $scope.firstColumn = ($scope.allCount === 0 ? 0 : 10 * $scope.searchParams.PageNumber - 9);
                        //$scope.lastColumn = (10 * $scope.searchParams.PageNumber < $scope.totalQuantity ? 10 * $scope.searchParams.PageNumber : $scope.totalQuantity);
                        change = 0;

                        $scope.setClickedRow($scope.hbDocuments[0]);
                    }
                }
                else {
                    $scope.hbDocuments = null;
                    $scope.hbDocuments = [];
                    $scope.customerInfoDetails = null;
                    $scope.accountFlowDetails = null;
                    $scope.totalAmount = 0;
                    $scope.totalQuantity = 0;
                    $scope.selectedRow = null;

                    $scope.searchParams.PageNumber = 0;

                    $scope.allCount = $scope.totalQuantity;
                    $scope.pageCount = Math.ceil($scope.totalQuantity / $scope.rowCount);
                }

                hideloading();

            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            });
        }
    };

    $scope.getSearchedHBDocuments = function () {


        if ($scope.searchParams !== {}) {

            if ($scope.searchParams.StartDate != null && $scope.searchParams.EndDate != null && $scope.searchParams.TransactionCode == null
                && $scope.searchParams.QualityType == null && $scope.searchParams.CustomerNumber == null) {

                var date1 = new Date($scope.searchParams.StartDate);
                var date2 = new Date($scope.searchParams.EndDate);

                // To calculate the time difference of two dates 
                var Difference_In_Time = date2.getTime() - date1.getTime();

                // To calculate the no. of days between two dates 
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

                if (Difference_In_Days < 0) {
                    showMesageBoxDialog('Ժամկետի վերջը պետք է մեծ լինի սկզբից', $scope, 'error');
                    $scope.messageSearch.EndDate = null;
                    return;
                }
                // To calculate the time difference of two dates 
                Difference_In_Time = date1.getTime() - date2.getTime();

                // To calculate the no. of days between two dates 
                Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

                if (Difference_In_Days > 0) {
                    showMesageBoxDialog('Ժամկետի սկիզբը պետք է փոքր լինի վերջից', $scope, 'error');
                    $scope.searchParams.StartDate = null;
                    return;
                }
            }

            if ($scope.searchParams.TransactionCode == null && $scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null && $scope.searchParams.OperationType == null &&
                $scope.searchParams.SourceType == null && $scope.searchParams.QualityType == null && $scope.searchParams.CustomerNumber == null && $scope.searchParams.DebitAccount == null &&
                $scope.searchParams.FilialCode == null && $scope.searchParams.DocumentType == null && $scope.searchParams.DocumentSubType == null && $scope.searchParams.Amount == null &&
                $scope.searchParams.CurrencyType == null && $scope.searchParams.Description == null && $scope.searchParams.OnlySelectedCustomer == false && $scope.searchParams.OnlyACBA == "0" &&
                $scope.searchParams.firstRow == 0) {
                showMesageBoxDialog('Ընտրեք ֆիլտրերից որևիցե մեկը։', $scope, 'error');
                return;
            }

            if (($scope.searchParams.QualityType == undefined || $scope.searchParams.QualityType == null) && ($scope.searchParams.TransactionCode == 0 || $scope.searchParams.TransactionCode == null)
                && ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null) && ($scope.searchParams.CustomerNumber == undefined || $scope.searchParams.CustomerNumber == null)) {
                showMesageBoxDialog('Մուտքագրեք ամսաթիվը ', $scope, 'error');
                return;
            }
            else if (($scope.searchParams.QualityType == undefined || $scope.searchParams.QualityType == null) && ($scope.searchParams.TransactionCode == 0 || $scope.searchParams.TransactionCode == null)
                && ($scope.searchParams.CustomerNumber == undefined || $scope.searchParams.CustomerNumber == null)) {
                var date1 = new Date($scope.searchParams.StartDate);
                var date2 = new Date($scope.searchParams.EndDate);

                // To calculate the time difference of two dates 
                var Difference_In_Time = date2.getTime() - date1.getTime();

                // To calculate the no. of days between two dates 
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

                if (Difference_In_Days > 31) {
                    showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 30 օր:', $scope, 'error');
                    return;
                }
            }

            //$scope.searchParams.PageNumber = 1;
            //$scope.searchParams.firstRow = 0;
            //$scope.searchParams.LastGetRowCount = 50;


            if ($scope.searchParams.QualityType == 30 || $scope.searchParams.QualityType == 31 || $scope.searchParams.QualityType == 32 || $scope.searchParams.QualityType == 41) {
                if ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null && ($scope.searchParams.TransactionCode == null || $scope.searchParams.TransactionCode == undefined) && ($scope.searchParams.CustomerNumber == null || $scope.searchParams.CustomerNumber == undefined)) {
                    showMesageBoxDialog('Մուտքագրեք ամսաթիվը ', $scope, 'error');
                    return;
                }
                if ($scope.searchParams.StartDate != null && $scope.searchParams.EndDate != null && ($scope.searchParams.TransactionCode == null || $scope.searchParams.TransactionCode == undefined) && ($scope.searchParams.CustomerNumber == null || $scope.searchParams.CustomerNumber == undefined)) {
                    var date1 = new Date($scope.searchParams.StartDate);
                    var date2 = new Date($scope.searchParams.EndDate);

                    // To calculate the time difference of two dates 
                    var Difference_In_Time = date2.getTime() - date1.getTime();

                    // To calculate the no. of days between two dates 
                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                    //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

                    if (Difference_In_Days > 31) {
                        showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 30 օր:', $scope, 'error');
                        return;
                    }
                }
            }

            if ($scope.searchParams.TransactionCode == null && $scope.searchParams.StartDate != null && $scope.searchParams.EndDate != null && $scope.searchParams.OperationType == null &&
                $scope.searchParams.SourceType == null && $scope.searchParams.QualityType == null && $scope.searchParams.CustomerNumber == null && $scope.searchParams.DebitAccount == null &&
                $scope.searchParams.FilialCode == null && $scope.searchParams.DocumentType == null && $scope.searchParams.DocumentSubType == null && $scope.searchParams.Amount == null &&
                $scope.searchParams.CurrencyType == null && $scope.searchParams.Description == null && $scope.searchParams.OnlySelectedCustomer == false && $scope.searchParams.OnlyACBA == "0" &&
                $scope.searchParams.firstRow == 0) {

                var date1 = new Date($scope.searchParams.StartDate);
                var date2 = new Date($scope.searchParams.EndDate);

                // To calculate the time difference of two dates 
                var Difference_In_Time = date2.getTime() - date1.getTime();

                // To calculate the no. of days between two dates 
                var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

                if (Difference_In_Days > 31) {
                    showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 30 օր:', $scope, 'error');
                    return;
                }
            }

            if ($scope.searchParams.StartDate != null && $scope.searchParams.EndDate == null) {
                showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 30 օր:', $scope, 'error');
                return;
            }
            else if ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate != null) {
                showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 30 օր:', $scope, 'error');
                return;
            }

            localStorage.setItem("searchParams", angular.toJson($scope.searchParams));

            showloading();

            var Data = HBDocumentsService.getSearchedHBDocuments($scope.searchParams);
            Data.then(function (req) {
                if ($scope.searchParams.firstRow == 0) {
                    $scope.searchParams.PageNumber = 1;
                }
                //sessionStorage.clear();
                if (req.data.length != 0) {
                    $scope.hbDocuments = [];
                    $scope.hbDocuments = req.data;
                    if ($scope.hbDocuments.length > 0) {
                        if ($scope.hbDocuments[0].CustomerDetails != null) {
                            if ($scope.hbDocuments[0].CustomerDetails.ObjectEmpty == true) {
                                $scope.customerInfoDetails = null;
                            }
                            else {
                                $scope.customerInfoDetails = $scope.hbDocuments[0].CustomerDetails;
                            }
                        }
                        else {
                            $scope.customerInfoDetails = null;
                        }

                        $scope.accountFlowDetails = $scope.hbDocuments[0].AccountDetails;
                        $scope.totalAmount = $scope.hbDocuments[0].TotalAmount;
                        $scope.totalQuantity = $scope.hbDocuments[0].TotalQuantity;

                        if ($scope.hbDocuments[0].DocumentType == 5) {
                            $scope.showCreditAccount = true;
                            $scope.CreditAccount = $scope.hbDocuments[0].CreditAccount;
                        }
                        else {
                            $scope.showCreditAccount = false;
                        }

                        //$scope.selectedRow = $scope.hbDocuments[0];
                        $scope.selectRow($scope.hbDocuments[0]);
                        sessionStorage.setItem("selectedDocument", angular.toJson($scope.hbDocuments[0]));
                        sessionStorage.setItem("searchResult", angular.toJson($scope.hbDocuments));

                        $scope.allCount = $scope.totalQuantity;
                        $scope.pageCount = Math.ceil($scope.totalQuantity / $scope.rowCount);

                        var docs = $scope.hbDocuments;
                        $scope.hbDocuments = docs.splice(0, $scope.rowCount - 1);

                        // $scope.firstColumn = ($scope.allCount === 0 ? 0 : 10 * $scope.searchParams.PageNumber - 9);
                        //$scope.lastColumn = (10 * $scope.searchParams.PageNumber < $scope.totalQuantity ? 10 * $scope.searchParams.PageNumber : $scope.totalQuantity);
                        change = 0;

                        $scope.setClickedRow($scope.hbDocuments[0]);
                    }
                }
                else {
                    $scope.hbDocuments = null;
                    $scope.hbDocuments = [];
                    $scope.customerInfoDetails = null;
                    $scope.accountFlowDetails = null;
                    $scope.totalAmount = 0;
                    $scope.totalQuantity = 0;
                    $scope.selectedRow = null;

                    $scope.searchParams.PageNumber = 0;

                    $scope.allCount = $scope.totalQuantity;
                    $scope.pageCount = Math.ceil($scope.totalQuantity / $scope.rowCount);
                }
                //$scope.loanRequests = req.data;
                //var countLoan = Object.keys($scope.loanRequests);
                //var loanData = Object.values($scope.loanRequests);
                //$scope.allCount = countLoan[0];
                //var loans = loanData[0];

                //$scope.loanRequests = loans;
                //$scope.pageCount = Math.ceil(countLoan[0] / 20);

                //$scope.firstColumn = ($scope.allCount === 0 ? 0 : 10 * $scope.loanRequestFilter.PageNumber - 9);
                //$scope.lastColumn = (10 * $scope.loanRequestFilter.PageNumber < countLoan[0] ? 10 * $scope.loanRequestFilter.PageNumber : countLoan[0]);
                //change = 0;
                hideloading();

            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            });
        }
    };

    $scope.getSearchedHBDocumentsList = function () {
        $scope.searchParams.firstRow = ($scope.searchParams.PageNumber - 1) * $scope.rowCount;
        $scope.searchParams.LastGetRowCount = $scope.searchParams.PageNumber * $scope.rowCount;

        $scope.getSearchedHBDocuments($scope.searchParams);
    };

    $scope.backToFirstPage = function () {

        $scope.searchParams.firstRow = 0;
        $scope.searchParams.LastGetRowCount = $scope.rowCount - 1;

        $scope.getSearchedHBDocuments($scope.searchParams);
        //var docs = angular.fromJson(sessionStorage.getItem("searchResult"));

        //$scope.hbDocuments = docs.splice(0, $scope.rowCount - 1);
    };
    $scope.backOnePage = function () {

        $scope.searchParams.firstRow = ($scope.searchParams.PageNumber - 1) * $scope.rowCount;
        $scope.searchParams.LastGetRowCount = $scope.searchParams.PageNumber * $scope.rowCount;

        $scope.getSearchedHBDocuments($scope.searchParams);
        //var docs = angular.fromJson(sessionStorage.getItem("searchResult"));

        //$scope.hbDocuments = docs.splice(($scope.searchParams.PageNumber - 1) * $scope.rowCount, $scope.rowCount - 1);
    };
    $scope.moveForwardOnePage = function () {

        $scope.searchParams.firstRow = ($scope.searchParams.PageNumber - 1) * $scope.rowCount;
        $scope.searchParams.LastGetRowCount = $scope.searchParams.PageNumber * $scope.rowCount;

        $scope.getSearchedHBDocuments($scope.searchParams);
        //var docs = angular.fromJson(sessionStorage.getItem("searchResult"));


        //$scope.hbDocuments = docs.splice(($scope.searchParams.PageNumber - 1) * $scope.rowCount, $scope.rowCount - 1);
    };
    $scope.goToLastPage = function () {

        $scope.searchParams.firstRow = ($scope.searchParams.PageNumber - 1) * $scope.rowCount;
        $scope.searchParams.LastGetRowCount = $scope.searchParams.PageNumber * $scope.rowCount;

        $scope.getSearchedHBDocuments($scope.searchParams);

        //var docs = angular.fromJson(sessionStorage.getItem("searchResult"));

        //$scope.hbDocuments = docs.splice(($scope.pageCount - 1) * $scope.rowCount, $scope.rowCount - 1);
    };


    $scope.field = {};
    $scope.field.left = 1200;


    $scope.updateOnlySelectedCustomerField = function () {

        if ($scope.searchParams.OnlySelectedCustomer == false) {
            $scope.searchParams.CustomerNumber = null;
        }
        else {
            $scope.searchParams.CustomerNumber = $scope.selectedRow.CustomerNumber;
        }

        //if ($scope.selectedRow != undefined) {

        //}

        //if ((($scope.searchParams.QualityType == undefined && $scope.searchParams.QualityType == null) || $scope.searchParams.QualityType != 3 || $scope.searchParams.QualityType != 20)
        //    && ($scope.searchParams.TransactionCode == 0 && $scope.searchParams.TransactionCode == null) && ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null)) {
        //    $scope.searchParams.StartDate = new Date($scope.currentOperDay);
        //    $scope.searchParams.EndDate = new Date($scope.currentOperDay);
        //}

    };

    $scope.updateOnlyACBAField = function () {
        if ($scope.searchParams.OnlyACBA == "1") {
            $scope.searchParams.OperationType = "1";
            $scope.searchParams.DocumentSubType = null;
        }
    };

    $scope.updateSourceTypeField = function () {
        //if ((($scope.searchParams.QualityType == undefined && $scope.searchParams.QualityType == null) || $scope.searchParams.QualityType != 3 || $scope.searchParams.QualityType != 20)
        //    && ($scope.searchParams.TransactionCode == 0 && $scope.searchParams.TransactionCode == null) && ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null)) {
        //    $scope.searchParams.StartDate = new Date($scope.currentOperDay);
        //    $scope.searchParams.EndDate = new Date($scope.currentOperDay);
        //}
        //else {
        //    $scope.searchParams.StartDate = null;
        //    $scope.searchParams.EndDate = null;
        //}
    };

    $scope.updateQualityTypeField = function () {
        if (($scope.searchParams.QualityType == 30 || $scope.searchParams.QualityType == 31 || $scope.searchParams.QualityType == 32 || $scope.searchParams.QualityType == 41 || $scope.searchParams.QualityType == 0) &&
            ($scope.searchParams.CustomerNumber == null || $scope.searchParams.CustomerNumber == undefined) && ($scope.searchParams.TransactionCode == null || $scope.searchParams.TransactionCode == undefined)) {
            if (($scope.searchParams.StartDate == null || $scope.searchParams.StartDate == undefined) && ($scope.searchParams.EndDate == null || $scope.searchParams.EndDate == undefined)) {
                $scope.searchParams.StartDate = new Date($scope.currentOperDay);
                $scope.searchParams.EndDate = new Date($scope.currentOperDay);
            }
        }

        if ($scope.searchParams.QualityType == "") {
            $scope.searchParams.QualityType = null;
        }
        //else {
        //    $scope.searchParams.StartDate = null;
        //    $scope.searchParams.EndDate = null;
        //}
    };

    $scope.updateDocumentSubTypeField = function () {
        if ($scope.searchParams.DocumentSubType != null && $scope.searchParams.DocumentSubType != "" && $scope.searchParams.DocumentSubType != undefined) {
            $scope.searchParams.OnlyACBA = "0";
            $scope.searchParams.DocumentType = null;
            $scope.searchParams.OperationType = "2";
        }

        //if ((($scope.searchParams.QualityType == undefined && $scope.searchParams.QualityType == null) || $scope.searchParams.QualityType != 3 || $scope.searchParams.QualityType != 20)
        //    && ($scope.searchParams.TransactionCode == 0 && $scope.searchParams.TransactionCode == null) && ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null)) {
        //    $scope.searchParams.StartDate = new Date($scope.currentOperDay);
        //    $scope.searchParams.EndDate = new Date($scope.currentOperDay);
        //}
    };

    $scope.closeAccountDetails = function () {
        $scope.selectedCardIsAccessible = false;
    };

    $scope.updateFiledForCustomer = function () {
        if ($scope.searchParams.CustomerNumber != "" && $scope.searchParams.CustomerNumber != undefined && $scope.searchParams.CustomerNumber != null) {
            $scope.searchParams.OnlySelectedCustomer = true;
        }
        else {
            $scope.searchParams.OnlySelectedCustomer = false;
        }

        //if ((($scope.searchParams.QualityType == undefined && $scope.searchParams.QualityType == null) || $scope.searchParams.QualityType != 3 || $scope.searchParams.QualityType != 20)
        //    && ($scope.searchParams.TransactionCode == 0 && $scope.searchParams.TransactionCode == null) && ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null)) {
        //    $scope.searchParams.StartDate = new Date($scope.currentOperDay);
        //    $scope.searchParams.EndDate = new Date($scope.currentOperDay);
        //}
        //else {
        //    $scope.searchParams.StartDate = null;
        //    $scope.searchParams.EndDate = null;
        //}
    };


    //$scope.setTransactionCodeChange = function () {
    //    var regex = "/^\d+$/";
    //    var a = $scope.searchParams.TransactionCode;
    //    if (a.match(regex)) {
    //        showMesageBoxDialog('Միայն թիվ մուտքագրել', $scope, 'error');
    //        return;
    //    }
    //};

    $scope.selectRow = function (document) {

        $scope.selectedRow = document;
        sessionStorage.setItem("selectedDocument", angular.toJson(document));

        if ($scope.searchParams.OnlySelectedCustomer == true) {
            $scope.searchParams.CustomerNumber = $scope.selectedRow.CustomerNumber;
        }
        else {
            $scope.searchParams.CustomerNumber = null;
        }
    };

    $scope.openTransactionErrorWindow = function () {
        if ($scope.selectedRow == undefined && $scope.selectedRow.TransactionCode == 0) {
            showMesageBoxDialog('Գործարքն ընտրված չէ։', $scope, 'error');
        }
        else {
            var Data = HBDocumentsService.openTransactionErrorView();
            //Data.then(function (req) {

            //    var obj = angular.fromJson(req.data);

            //    $scope.errorDate = obj.RegistrationDate;
            //    $scope.errorDescription = obj.ErrorDescription;

            //    $scope.showTransactionErrorWindow = true;

            //}, function () {
            //    hideloading();
            //    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            //});
            //var Data = HBDocumentsService.getTransactionErrorDetails($scope.selectedRow.TransactionCode);
            //Data.then(function (req) {

            //    var obj = angular.fromJson(req.data);

            //    $scope.errorDate = obj.RegistrationDate;
            //    $scope.errorDescription = obj.ErrorDescription;

            //    $scope.showTransactionErrorWindow = true;

            //}, function () {
            //    hideloading();
            //    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            //});
        }
    };

    $scope.selectOrRemoveFromAutomaticExecution = function (transactionChecked, docID) {
        if ($scope.selectedRow.TransactionQuality != 3 && $scope.selectedRow.TransactionQuality != 20) {
            showMesageBoxDialog('Ենթակա չէ ավտոմատ կատարման', $scope, 'error');
            return;
        }
        if ($scope.selectedRow == undefined && $scope.selectedRow.TransactionCode == 0) {
            showMesageBoxDialog('Տողը ընտրված չէ', $scope, 'error');
            return;
        }
        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));

        $scope.searchParams.DocumentTransactionCode = docID;

        $scope.searchParams.TransactionChecked = transactionChecked;


        var Data = HBDocumentsService.getOrSetAutomaticExecution($scope.searchParams);
        Data.then(function (req) {

            if (req.data == "True") {

                refresh(6);
            }
            else {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });

    };

    $scope.initErrorFields = function () {

        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        var Data = HBDocumentsService.getTransactionErrorDetails(document.TransactionCode);
        Data.then(function (req) {
            var obj = req.data;

            $scope.errorDate = obj.RegistrationDate;
            $scope.errorDescription = obj.ErrorDescription;

            $scope.showTransactionErrorWindow = true;

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.setHBDocumentAutomatConfirmationSign = function () {
        //$scope.searchParams
        var Data = HBDocumentsService.setHBDocumentAutomatConfirmation($scope.searchParams);
        Data.then(function (req) {

            if (req.data == "True") {

                refresh(6);
                $scope.transactionChecked = true;
            }
            else {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }

        }, function () {
            //hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.excludeCardAccountTransactions = function () {
        //$scope.searchParams
        showloading();
        var Data = HBDocumentsService.getCardAccountTransactions($scope.searchParams);
        Data.then(function (req) {

            if (req.data == "True") {

                refresh(6);
            }
            else {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }

            hideloading();

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.initConfirmationHistoryFields = function () {

        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        var Data = HBDocumentsService.getConfirmationHistoryDetails(document.TransactionCode);
        Data.then(function (req) {
            $scope.histories = req.data;

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.productAccordanceClick = function () {
        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        var Data = HBDocumentsService.getCheckingProductAccordance(document.TransactionCode);
        Data.then(function (req) {
            $scope.checkResult = req.data;

            if ($scope.checkResult != "") {
                showMesageBoxDialog($scope.checkResult, $scope, 'error');
            }
            else {
                $scope.openWindow('/HomeBankingDocuments/HBDocumentProductAccordance', 'Կապը ձևակերպված պրոդուկտի հետ', 'HBDocumentProductAccordanceForm');
            }

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.openWindow = function (url, title, id, callbackFunction) {
        $scope.disabelButton = true;
        if (!document.getElementById(id)) {
            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.open(id, $scope, title, url, dialogOptions, undefined, undefined, callbackFunction);
        }
        else {
            $scope.disabelButton = true;
        }

    };

    $scope.initProductAccordanceFields = function () {
        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        var Data = HBDocumentsService.getProductAccordanceDetails(document.TransactionCode);
        Data.then(function (req) {

            $scope.details = req.data;

            if ($scope.params.type == 1) {
                $scope.showLblTransfer = true;
                $scope.showLblConvertation = false;
            } else if ($scope.params.type == 2) {
                $scope.showLblTransfer = false;
                $scope.showLblConvertation = true;
            }
            //$scope.setnumber = $scope.details.SetNumber;

            ///$scope.details.TransactionDate = new Date($scope.details.TransactionDate);
        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.checkArCaBalance = function () {
        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        var Data = HBDocumentsService.getHBArCaBalancePermission(document.TransactionCode);
        Data.then(function (req) {

            if (req.data == "") {
                $scope.openWindow('/HomeBankingDocuments/HBDocumentArCaBalance', 'Մնացորդ ArCa-ում', 'HBDocumentArCaBalanceForm');
            } else {
                hideloading();
                showMesageBoxDialog(req.data, $scope, 'error');
            }

            ///$scope.details.TransactionDate = new Date($scope.details.TransactionDate);
        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.initHBArCaBalance = function () {
        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        var Data = HBDocumentsService.getHBArCaBalanceDetails(document.AccountDetails.CardNumber);
        Data.then(function (req) {

            $scope.details = req.data;
            var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
            $scope.details.TransactionCode = document.TransactionCode;
            $scope.details.TransactionCurrency = document.TransactionCurrency;
            $scope.CardNumber = document.AccountDetails.CardNumber;
            ///$scope.details.TransactionDate = new Date($scope.details.TransactionDate);
        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.rejectTransactionClick = function () {
        var document = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        if ($scope.selectedRow == undefined && $scope.selectedRow.TransactionCode == 0) {
            showMesageBoxDialog('Ընտրեք տողը', $scope, 'error');
            return;
        }
        if (document.TransactionQuality != 2 && document.TransactionQuality != 3) {
            var text = "";
            for (var i = 0; i < $scope.qualityTypes.length; i++) {
                if (document.TransactionQuality == $scope.qualityTypes[i].ID) {
                    text = $scope.qualityTypes[i].Description;
                }
            }
            showMesageBoxDialog('Տվյալ փաստաթուղթը §' + text + "¦", $scope, 'error');
            return;
        }

        if (document.FilialCode != $scope.bankCode && $scope.HB_transactions_permission == 0) {
            text = "";
            for (i = 0; i < $scope.filialsList.length; i++) {
                if (document.TransactionQuality == $scope.filialsList[i].ID) {
                    text = $scope.filialsList[i].ID + ' ' + $scope.qualityTypes[i].Description;
                }
            }
            showMesageBoxDialog('Տվյալ փաստաթուղթը ' + text + ' մասնաճյուղի գործարք է', $scope, 'error');
            return;
        }


        $scope.openWindow('/HomeBankingDocuments/HBDocumentTransactionReject', 'Գործարքի մերժում', 'HBDocumentTransactionRejectForm');


    };

    $scope.initTransactionRejectFields = function () {
        var Data = HBDocumentsService.getHBRejectTypes();
        Data.then(function (req) {

            $scope.rejectTypes = angular.fromJson(req.data);

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.confirmRejectClick = function () {

        if ($scope.rejectReason == undefined && $scope.rejectReason == null) {

            showMesageBoxDialog('Մուտքագրեք մերժման պատճառը', $scope, 'error');
            return;
        }

        $confirm({ title: 'Գործարքի մերժում', text: 'Մերժե՞լ գործարքը' })
            .then(function () {
                showloading();

                var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));

                doc.SelectedRejectReason = $scope.rejectReason;

                var Data = HBDocumentsService.postTransactionRejectConfirmation(doc);
                Data.then(function (req) {

                    if (req.data == "") {
                        CloseBPDialog("HBDocumentTransactionRejectForm");
                        refresh(6);

                    }
                    else {
                        hideloading();
                        showMesageBoxDialog(req.data, $scope, 'error');

                    }

                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                });

            });
    };

    $scope.changeTransactionQualityClick = function () {

        if ($scope.selectedRow == undefined && $scope.selectedRow.TransactionCode == 0) {
            showMesageBoxDialog('Ընտրեք տողը', $scope, 'error');
            return;
        }

        $confirm({ title: 'Գործարքի կարգավիճակի փոփոխում', text: 'Փոխե`լ նշնած գործարքի կարգավիճակը' })
            .then(function () {
                showloading();
                var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));
                var Data = HBDocumentsService.getCheckedTransactionQualityChangability(doc.TransactionCode);
                Data.then(function (req) {

                    if (req.data == "") {
                        hideloading();
                        showMesageBoxDialog('OK', $scope, 'information');

                        refresh(6);
                    }
                    else {
                        hideloading();
                        showMesageBoxDialog(req.data, $scope, 'error');
                    }
                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                });
            });

    };

    $scope.confirmInsertClick = function () {

        var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));
        var Data = HBDocumentsService.postchangedTransactionQuality(doc.TransactionCode);
        Data.then(function (req) {

            if (req.data == "True") {
                //$scope.getSearchedHBDocuments();
                hideloading();
                showMesageBoxDialog('OK', $scope, 'information');
                CloseBPDialog('HBDocumentTransactionQualityChangingForm');
            }
            else {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                CloseBPDialog('HBDocumentTransactionQualityChangingForm');
            }

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            CloseBPDialog('HBDocumentTransactionQualityChangingForm');
        });
    };

    $scope.initAutomatedConfirmTime = function () {

        var Data = HBDocumentsService.getAutomatedConfirmTime();
        Data.then(function (bond) {
            var str = bond.data;
            $scope.currentDateTime = str;
            var time = str.substr(11);
            document.getElementById('changeableTime').value = time;
        }, function () {
        });


    };

    $scope.showDocumentTypeDescription = function (event, documentSubtype) {

        var count = Object.keys($scope.documentTypes).length;
        var keys = Object.keys($scope.documentTypes);
        var values = Object.values($scope.documentTypes);
        for (var i = 0; i < count; i++) {
            if (keys[i] == documentSubtype) {
                $scope.elementDescription = values[i].replace(/\d+/g, '');
                break;
            }
            else {
                $scope.elementDescription = '';
            }
        }

        if ($scope.elementDescription != '') {
            document.getElementById("showElementDescription").style.display = "block";
            document.getElementById("showElementDescription").style.left = event.pageX + 'px';
            document.getElementById("showElementDescription").style.top = event.pageY + 'px';
        }

    };

    $scope.showDebitAccountDescription = function (event, debitAccount) {
        var Data = HBDocumentsService.getDebitAccountCutomerName(debitAccount);
        Data.then(function (bond) {
            var obj = angular.fromJson(bond.data);
            $scope.elementDescription = obj.Description;

            document.getElementById("showElementDescription").style.display = "block";
            document.getElementById("showElementDescription").style.left = event.pageX + 'px';
            document.getElementById("showElementDescription").style.top = event.pageY + 'px';
        }, function () {
        });


    };

    $scope.closeDebitAccountDescription = function () {
        document.getElementById("showElementDescription").style.display = "none";
    };

    $scope.closeDocumentTypeDescription = function () {
        document.getElementById("showElementDescription").style.display = "none";
    };

    $scope.showTransactionSourceDescription = function (event, transactionSource) {
        var count = Object.keys($scope.sourceTypes).length;
        var keys = Object.keys($scope.sourceTypes);
        var values = Object.values($scope.sourceTypes);
        for (var i = 0; i < count; i++) {
            if (keys[i] == transactionSource) {
                $scope.elementDescription = values[i].replace(/\d+/g, '');
                break;
            }
            else {
                $scope.elementDescription = '';
            }
        }
        if ($scope.elementDescription != '') {
            document.getElementById("showElementDescription").style.display = "block";
            document.getElementById("showElementDescription").style.left = event.pageX + 'px';
            document.getElementById("showElementDescription").style.top = event.pageY + 'px';
        }
    };

    $scope.closeTransactionSourceDescription = function () {
        document.getElementById("showElementDescription").style.display = "none";
    };

    $scope.showTransactionQualityDescription = function (event, transactionQuality) {
        var count = Object.keys($scope.qualityTypes).length;
        var keys = Object.keys($scope.qualityTypes);
        var values = Object.values($scope.qualityTypes);
        for (var i = 0; i < count; i++) {
            if (keys[i] == transactionQuality) {
                $scope.elementDescription = values[i].replace(/\d+/g, '');
                break;
            }
            else {
                $scope.elementDescription = '';
            }

        }
        if ($scope.elementDescription != '') {
            document.getElementById("showElementDescription").style.display = "block";
            document.getElementById("showElementDescription").style.left = event.pageX + 'px';
            document.getElementById("showElementDescription").style.top = event.pageY + 'px';
        }
    };

    $scope.closeTransactionQualityDescription = function () {
        document.getElementById("showElementDescription").style.display = "none";
    };

    $scope.setDebitAccountCustomerNumber = function (number) {
        var Data = HBDocumentsService.getDebitAccountCustomerName(number);
        Data.then(function (bond) {
            $scope.debitAccountCustomerNumber = bond.data;

            params = { customerNumber: $scope.debitAccountCustomerNumber };

            $scope.openWindow('/Customer/CustomerDetails', 'Հաճախորդի տվյալներ', 'customerdetails');

        }, function () {
        });
    };

    $scope.getRowTypesInfo = function () {
        var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));

        $scope.CustomerNumber = doc.CustomerNumber;
        $scope.DocType = doc.DocumentType;
        $scope.DocSubType = doc.DocumentSubtype;

        //for (var i = 0; i < $scope.documentTypes.length; i++) {
        //    if ($scope.documentTypes[i].ID == $scope.DocType) {
        //        $scope.Description = $scope.documentTypes[i].Description;
        //        break;
        //    }
        //}


        var count = Object.keys($scope.documentTypes).length;
        var keys = Object.keys($scope.documentTypes);
        var values = Object.values($scope.documentTypes);
        for (var i = 0; i < count; i++) {
            if (keys[i] == $scope.DocType) {
                $scope.Description = values[i].substr(values[i].indexOf(' ') + 1);
                break;
            }
        }

    };

    $scope.authorizeCustomer = function () {

        var Data = HBDocumentsService.authorizeCustomerForHBConfirm($scope.params.customerNumber);
    };

    $scope.formulateAll = function () {
        $confirm({ title: 'Ձևակերպել բոլորը', text: 'Ձևակերպել բոլորը' })
            .then(function () {
                showloading();
                var Data = HBDocumentsService.formulateAllHBDocuments($scope.searchParams);
                Data.then(function (res) {

                    if (res.data == "True") {

                        refresh(6);
                    }
                    else {
                        hideloading();
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }

                    hideloading();

                }, function () {
                    hideloading();
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                    alert('Error confirmOrder');
                });
            });
    };

    $scope.showMenuList = function (event) {
        if (document.getElementById("contextHBActions").style.display == 'block') {
            document.getElementById("contextHBActions").style.display = 'none';
        }
        else {
            document.getElementById("contextHBActions").style.display = "block";
            document.getElementById("contextHBActions").style.left = (event.pageX - 300) + 'px';
            document.getElementById("contextHBActions").style.top = (event.pageY - 30) + 'px';
        }
    };

    $scope.showDescriptionFullText = function (event, desc) {
        if (desc.length > 30) {
            $scope.elementDescription = desc;

            document.getElementById("showElementDescription").style.display = "block";
            document.getElementById("showElementDescription").style.left = event.pageX + 'px';
            document.getElementById("showElementDescription").style.top = event.pageY + 'px';
        }
    };

    $scope.hideDescriptionFullText = function () {
        document.getElementById("showElementDescription").style.display = "none";
    };

    $scope.initReestrFromHB = function () {

        var Data = HBDocumentsService.getReestrFromHB($scope.params.order);
        Data.then(function (res) {

        }, function () {
            hideloading();
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
            alert('Error getReestrFromHB');
        });
    };

    $scope.reestrTransactionTerminationConfirmation = function (id, quality, debitAccount, filial, type) {

        var orderId = 0;
        var orderQuality = 0;
        var orderDebitAccount = 0;
        var orderFilial = 0;
        var orderType = 0;

        if (id != 0 && id != undefined) {
            orderId = id;
        }
        else {
            orderId = $scope.params.selectedOrderId;
        }

        if (quality != 0 && quality != undefined) {
            orderQuality = quality;
        }
        else {
            orderQuality = $scope.params.quality;
        }

        if (filial == undefined || filial == 0) {
            orderFilial = 22000;
        }
        else if (filial != 0) {
            orderFilial = filial;
        }
        else {
            orderFilial = $scope.params.bankCode;
        }

        if (type != 0 && type != undefined) {
            orderType = type;
        }
        else {
            orderType = $scope.params.type;
        }

        if (orderType == 4) {

            if (debitAccount == undefined) {
                orderDebitAccount = 0;
            }
            else if (debitAccount != "0") {
                orderDebitAccount = debitAccount;
            }
            else {
                orderDebitAccount = $scope.params.debitAccount;
            }
        }
        else {

            if (debitAccount == undefined || debitAccount == "0") {
                orderDebitAccount = 0;
            }
            else if (debitAccount != "0") {
                orderDebitAccount = debitAccount;
            }
            else {
                orderDebitAccount = $scope.params.debitAccount;
            }
        }

        var setNumber = 0;

        if (orderQuality != 3) {
            var qualityDesc = '';
            var count = Object.keys($scope.qualityTypes).length;
            var keys = Object.keys($scope.qualityTypes);
            var values = Object.values($scope.qualityTypes);
            for (var i = 0; i < count; i++) {
                if (keys[i] == $scope.params.quality) {
                    qualityDesc = values[i].replace(/\d+/g, '');
                    break;
                }
            }

            showMesageBoxDialog('Տվյալ փաստաթուղթը «' + qualityDesc + '»', $scope, 'error');
            return;
        }

        //if ($scope.params.bankCode != $scope.bankCode) {
        //    var filialsDesc = '';
        //    //var count = Object.keys($scope.filialsList).length;
        //    //var keys = Object.keys($scope.filialsList);
        //    //var values = Object.values($scope.filialsList);
        //    for (var i = 0; i < $scope.filialsList.length; i++) {
        //        if ($scope.filialsList[i].ID == $scope.params.bankCode) {
        //            filialsDesc = $scope.filialsList[i].ID + " "+ $scope.filialsList[i].Description;
        //            break;
        //        }
        //    }

        //    showMesageBoxDialog('Տվյալ փաստաթուղթը ' + filialsDesc + ' մասնաճյուղի գործարք է։', $scope, 'error');
        //    return;
        //}

        if (orderType == 4) {
            var Data = HBDocumentsService.getTreansactionConfirmationDetails(orderId, orderDebitAccount);
            Data.then(function (bond1) {
                var obj = bond1.data;
                var dt = $scope.currentOperDay.toString("dd/MM/yyyy");
                if (obj[0] == dt) {
                    $confirm({ title: 'Գործարքի հաստատում', text: 'Հաստատե՞լ գարծարքը' })
                        .then(function () {
                            var Data = HBDocumentsService.confirmReestrTransaction(orderId, orderFilial);
                            Data.then(function (res) {

                                if (res.data == "") {

                                    refresh(6);
                                }
                                else {
                                    hideloading();
                                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                                }

                                hideloading();

                            }, function () {
                                hideloading();
                                ShowToaster('Տեղի ունեցավ սխալ', 'error');
                                alert('Error confirmOrder');
                            });

                        });
                }
                else {
                    hideloading();
                    showMesageBoxDialog('Տվյալ կոճակով հաստավում են միայն ռեեստրով փոխանցումները կամ տվյալ օրով ձևակերպված ավանդների դադարեցումները։', $scope, 'error');
                    return;
                }
            }, function () {
                hideloading();
            });
        }
        else {

            if (orderType == 18 || orderType == 19) {
                $confirm({ title: 'Գործարքի հաստատում', text: 'Հաստատե՞լ գարծարքը' })
                    .then(function () {
                        if (orderType == 18) {
                            var Data = HBDocumentsService.getCancelTransactionDetails(orderId);
                            Data.then(function (bond2) {
                                if (bond2.data == 30) {
                                    $confirm({ title: 'Գործարքի հաստատում', text: 'Գործարքը ունի «Կատարված է» կարգավիճակ։ Շարունակե՞լ' })
                                        .then(function () {
                                            showloading();
                                            var Data = HBDocumentsService.confirmReestrTransaction(orderId, orderFilial, setNumber);
                                            Data.then(function (res) {

                                                if (res.data == "") {
                                                    // $scope.refreshInfos();
                                                    refresh(6);
                                                }
                                                else {
                                                    hideloading();
                                                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                                                }

                                                hideloading();

                                            }, function () {
                                                hideloading();
                                                ShowToaster('Տեղի ունեցավ սխալ', 'error');
                                                alert('Error confirmOrder');
                                            });
                                        });
                                }
                                else {
                                    showloading();
                                    var Data = HBDocumentsService.confirmReestrTransaction(orderId, orderFilial, setNumber);
                                    Data.then(function (res) {

                                        if (res.data == "") {

                                            refresh(6);
                                        }
                                        else {
                                            hideloading();
                                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                                        }

                                        hideloading();

                                    }, function () {
                                        hideloading();
                                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                                        alert('Error confirmOrder');
                                    });
                                }
                            }, function () {
                                hideloading();
                                ShowToaster('Տեղի ունեցավ սխալ', 'error');
                                alert('Error confirmOrder');
                            });
                        }
                        else {
                            var Data = HBDocumentsService.confirmReestrTransaction(orderId, orderFilial, setNumber);
                            Data.then(function (res) {

                                if (res.data == "") {

                                    refresh(6);
                                }
                                else {
                                    hideloading();
                                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                                }

                                hideloading();

                            }, function () {
                                hideloading();
                                ShowToaster('Տեղի ունեցավ սխալ', 'error');
                                alert('Error confirmOrder');
                            });
                        }


                    });
            }
            else {
                hideloading();
                showMesageBoxDialog('Տվյալ կոճակով հաստավում են միայն ռեեստրով փոխանցումները կամ տվյալ օրով ձևակերպված ավանդների դադարեցումները։', $scope, 'error');
                return;
            }
        }

    };

    $scope.showTransferDetailsForSpesialTypes = function (type) {
        if (type == 1) {
            var Data = HBDocumentsService.authorizeCustomerForHBConfirm($scope.params.customerNumber);
            Data.then(function (bond) {
                if (bond.data == 'True') {
                    $scope.openWindowWithTemplate('transferarmpaymentorder', 'Փոխանցում ՀՀ տարածքում', 'transferarmpaymentorder');
                }
                else {
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                }
            }, function () {
                ShowToaster('Տեղի ունեցավ սխալ', 'error');
            });

        }
        else if (type == 3) {
            var Data1 = HBDocumentsService.authorizeCustomerForHBConfirm($scope.params.customerNumber);
            Data1.then(function (bond) {
                if (bond.data == 'True') {
                    $scope.openWindowWithTemplate('internationalorder', 'Միջազգային փոխանցում', 'internationalpaymentorder');
                }
                else {
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                }
            }, function () {
                ShowToaster('Տեղի ունեցավ սխալ', 'error');
            });

        }
    };

    $scope.ShowCustomerInSearch = function (customerNumber) {
        $scope.searchParams.CustomerNumber = customerNumber;
        if ($scope.selectedRow != undefined) {
            $scope.searchParams.CustomerNumber = $scope.selectedRow.CustomerNumber;
            $scope.searchParams.OnlySelectedCustomer = true;
        }

    };

    $scope.goToHBDocuments = function () {
        //var Data = HBDocumentsService.goToHBDocumentsList();
        $state.go('hbDocuments');
    };


    $scope.getBankCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.bankCode = ref.data.toString();  
            $scope.loadMessages();
        }, function () {
                alert('Error getBankCode');
        });
    };


    $scope.loadMessages = function () {
        showloading();

        if ($scope.bankCode != 22000) {
            $scope.sendMsgToAll = false;
        }


        //$scope.messageSearch.PageNumber = 1;

        var Data = HBDocumentsService.getCurrentOperDay();
        Data.then(function (bond) {
            $scope.currentOperDay = new Date(parseInt(bond.data.substr(6)));

            $scope.messageSearch.CustomerNumber = null;
            $scope.messageSearch.ReadOrUnReadMsg = "1";
            $scope.messageSearch.StartDate = $scope.currentOperDay;
            $scope.messageSearch.EndDate = $scope.currentOperDay;
            $scope.messageSearch.ReceivedOrSentMsg = "1";
            $scope.messageSearch.SetNumber = null;
            $scope.messageSearch.firstRow = 0;
            $scope.messageSearch.LastGetRowCount = 30;

            $scope.messageSearch.PageNumber = ($scope.messageSearch.PageNumber !== undefined ? $scope.messageSearch.PageNumber : 1);

            var Data1 = HBDocumentsService.loadHBMessages();
            Data1.then(function (bond1) {

                $scope.messages = bond1.data;
                if ($scope.messages.length != 0) {
                    $scope.setClickedMsgRowInfo($scope.messages[0]);
                    if ($scope.messages[0].File.length != 0) {
                        $scope.files = $scope.messages[0].File;
                    }

                    $scope.msgAllCount = $scope.messages[0].MessagesCount;
                    $scope.msgPageCount = Math.ceil($scope.msgAllCount / $scope.msgRowCount);

                    //var msg = $scope.messages;
                    //$scope.messages = msg.splice(0, $scope.msgRowCount - 1);
                }
                else {
                    $scope.messageSearch.PageNumber = 0;
                    $scope.messages = [];
                    $scope.files = [];
                    sessionStorage.setItem("selectedMsg", null);
                }
                hideloading();
            }, function () {
                hideloading();
                ShowToaster('Տեղի ունեցավ սխալ', 'error');
            });

        }, function () {
        });

    };

    $scope.getSearchedCustomer = function (customer) {
        if (customer.MiddleName != "") {
            $scope.msgInfo.CustomerFullname = customer.firstName + ' ' + customer.lastName + ' ' + customer.MiddleName;
        }
        else {
            $scope.msgInfo.CustomerFullname = customer.firstName + ' ' + customer.lastName;
        }
        $scope.msgInfo.CustomerNumber = parseInt(customer.customerNumber);

        $scope.closeSearchCustomersModal();
    };

    $scope.getSearchedHBCustomer = function (customer) {

        $scope.searchParams.CustomerNumber = parseInt(customer.customerNumber);

        if ($scope.searchParams.CustomerNumber != "" && $scope.searchParams.CustomerNumber != undefined && $scope.searchParams.CustomerNumber != null) {
            $scope.searchParams.OnlySelectedCustomer = true;
        }


        $scope.closeSearchCustomersModal();
    };

    $scope.searchHBCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedHBCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });
    };

    $scope.searchCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };



    $scope.resetMsgFilters = function () {
        $scope.messageSearch.CustomerNumber = null;
        $scope.messageSearch.ReadOrUnReadMsg = null;
        $scope.messageSearch.StartDate = null;
        $scope.messageSearch.EndDate = null;
        $scope.messageSearch.ReceivedOrSentMsg = null;
        $scope.messageSearch.SetNumber = null;
        $scope.messageSearch.firstRow = 0;
        $scope.messageSearch.LastGetRowCount = 30;

    };

    $scope.setClickedMsgRowInfo = function (msg) {
        $scope.selectedMsg = msg;
        $scope.selectedRowMsg = msg;
        $scope.params = {
            selectedId: msg.ID, sentRecieve: msg.SentRecieve, message: msg
        };

        sessionStorage.setItem("selectedMsg", angular.toJson(msg));
    };

    $scope.markAsRead = function () {
        if ($scope.params.sentRecieve == 2) {
            showMesageBoxDialog('Հաղորդագրության կարգավիճակը պետք է լինի ստացված', $scope, 'error');
            return;
        }

        var Data1 = HBDocumentsService.setMessageAsRead($scope.params.selectedId);
        Data1.then(function (bond) {
            if (bond.data == "") {
                $scope.getSearchedMessages();
                //showMesageBoxDialog('Ok', $scope, 'error');
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }
        }, function () {
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.chooseOperationType = function (id) {
        sessionStorage.setItem("operationType", id);
    };

    $scope.initSendMessageForm = function () {
        $scope.msgOperationType = sessionStorage.getItem("operationType");
        var message = angular.fromJson(sessionStorage.getItem("selectedMsg"));

        switch ($scope.msgOperationType) {
            case "1":
                $scope.operationType2 = false;
                $scope.operationType3 = false;

                if (message.SentRecieve == 2) {
                    $scope.sendMsg = false;
                    $scope.searchCustomerIcon = false;
                }

                $scope.msgInfo.CustomerNumber = message.CustomerNumber;
                $scope.msgInfo.SendDate = message.SendDate;
                $scope.msgInfo.CustomerFullname = message.FullName;
                $scope.msgInfo.CustomerSubject = message.CustomerSubject;
                $scope.msgInfo.CustomerMessage = message.CustomerMessage;



                break;
            case "2":
                $scope.operationType2 = true;
                $scope.sendMsg = true;
                $scope.searchCustomerIcon = true;
                break;
            case "3":
                $scope.operationType2 = true;
                $scope.operationType3 = true;
                $scope.searchCustomerIcon = false;
                $scope.custTpye = true;
                $scope.sendMsg = true;
                $scope.msgInfo.CustomerType = "0";
                $scope.msgText = "Ուշադրություն, տվյալ հաղորդագրությունը ուղարկվելու է բոլոր ընտրված տեսակի HB";
                break;
        }
    };
    $scope.setClickedRowFileInfo = function (file) {
        sessionStorage.setItem("savedFile", angular.toJson(file));
        $scope.selectedRowFile = file;
    };

    $scope.showMsgDescriptionFullText = function (event, desc) {
        if (desc.length > 20) {
            $scope.elementMsgDescription = desc;

            document.getElementById("showElementMsgDescription").style.display = "block";
            document.getElementById("showElementMsgDescription").style.left = (event.pageX - 630) + 'px';
            document.getElementById("showElementMsgDescription").style.top = (event.pageY - 50) + 'px';
        }
    };

    $scope.hideMsgDescriptionFullText = function () {
        document.getElementById("showElementMsgDescription").style.display = "none";
    };

    $scope.showFile = function () {
        var file = angular.fromJson(sessionStorage.getItem("savedFile"));


        if (file.FileType.toLowerCase() == '.pdf') {
            var byteArray = new Uint8Array(file.FileContent);
            var blob = new Blob([byteArray], { type: 'application/pdf' });
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob);
            } else {
                var objectUrl = URL.createObjectURL(blob);
                window.open(objectUrl);
            }
        }
        else {
            if (file.FileType.toLowerCase() == '.doc') {
                var byteArrayRar = new Uint8Array(file.FileContent);
                var blobRar = new Blob([byteArrayRar], { type: 'application/doc' });
                saveAs(blobRar, file.FileName + '.doc');
            }
            else {
                if (file.FileType.toLowerCase() == '.docx') {
                    var byteArrayRar = new Uint8Array(file.FileContent);
                    var blobRar = new Blob([byteArrayRar], { type: 'application/docx' });
                    saveAs(blobRar, file.FileName + '.docx');

                } else {
                    if (file.FileType.toLowerCase() == '.xls') {
                        var byteArrayRar = new Uint8Array(file.FileContent);
                        var blobRar = new Blob([byteArrayRar], { type: 'application/xls' });
                        saveAs(blobRar, file.FileName + '.xls');
                    }
                    else {
                        if (file.FileType.toLowerCase() == '.xlsx') {
                            var byteArrayRar = new Uint8Array(file.FileContent);
                            var blobRar = new Blob([byteArrayRar], { type: 'application/xlsx' });
                            saveAs(blobRar, file.FileName + '.xlsx');
                        }
                        else {
                            var byteArray = new Uint8Array(file.FileContent);
                            var blob = new Blob([byteArray], { type: 'image/jpeg' });
                            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                                window.navigator.msSaveOrOpenBlob(blob);
                            } else {
                                objectUrl = URL.createObjectURL(blob);
                                window.open(objectUrl);
                            }
                        }
                    }
                }
            }
        }
        //var Data = HBDocumentsService.openMsgSelectedFile(file.Id);
        //Data.then(function (bond) {
        //    switch (file.FileType) {
        //        case '.pdf':
        //            ShowPDF(Data);
        //            break;
        //        case '.doc':
        //            ShowWord(Data, file.FileName);
        //            break;
        //        case 'docx':
        //            ShowWord(Data, file.FileName);
        //            break;
        //        case '.xls':
        //            ShowExcel(Data, file.FileName);
        //            break;
        //        case '.xlsx':
        //            ShowExcel(Data, file.FileName);
        //            break;
        //        default:
        //            ShowImage(Data);
        //            break;
        //    }


        //}, function () {
        //    ShowToaster('Տեղի ունեցավ սխալ', 'error');
        //});



    };

    $scope.sendMessage = function () {
        if ($scope.msgInfo.Subject == undefined || $scope.msgInfo.Subject == null || $scope.msgInfo.Subject == "") {
            showMesageBoxDialog("Մուտքագրեք վերնագիրը", $scope, 'error');
            return;
        }

        if ($scope.msgInfo.Message == undefined || $scope.msgInfo.Message == null || $scope.msgInfo.Message == "") {
            showMesageBoxDialog("Մուտքագրեք հաղորդագրությունը", $scope, 'error');
            return;
        }

        var operationType = sessionStorage.getItem("operationType");
        $scope.msgInfo.OperationType = operationType;

        var Data = HBDocumentsService.sendMessageToCustomer($scope.msgInfo);
        Data.then(function (bond) {
            if (bond.data == "") {
                hideloading();
                showMesageBoxDialog('Հաղորդագրությունը ուղարկված է։', $scope, 'information');
                CloseBPDialog("HBDocumentTransactionRejectForm");
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }
        }, function () {
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.getMessageUploadedFiles = function (id) {
        if ($scope.messages.length != 0) {
            var Data = HBDocumentsService.getMessageUploadedFilesList(id);
            Data.then(function (bond) {
                if (bond.data.length != 0) {
                    $scope.files = {};
                    $scope.files = angular.fromJson(bond.data);
                }
                else {
                    $scope.files = {};
                }
            }, function () {
                ShowToaster('Տեղի ունեցավ սխալ', 'error');
            });
        }
    };

    $scope.printCustomerallProducts = function (customerNumber) {
        var productStatus = 1;
        showloading();
        var Data = HBDocumentsService.getCustomerallProductsReport(productStatus, customerNumber);
        ShowPDF(Data);
    };

    $scope.openWindowWithTemplate = function (template, title, id, callbackFunction) {


        template = '<' + template + ' appendscrolltodialog  dialogid=' + id + ' >' + '</' + template + '>';

        if (!document.getElementById(id)) {
            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.openWithTemplate(id,
                $scope,
                title,
                template,
                dialogOptions,
                undefined,
                undefined,
                callbackFunction);
        }
    };

    $scope.checkReestrTransactionIsCheckedAndConfirm = function (orderID) {
        if ($scope.params.type == 6) {
            var Data = HBDocumentsService.getReestrTransactionIsChecked(orderID);
            Data.then(function (bond) {
                if (bond.data != 0) {
                    var checked = sessionStorage.getItem("isCheckedHBReestr");
                    if (checked == false) {
                        hideloading();
                        showMesageBoxDialog('Անհրաժեշտ է կատարել ստուգում։', $scope, 'error');
                    }
                }
                else {
                    $scope.files = {};
                    hideloading();
                    showMesageBoxDialog(bond.data, $scope, 'error');
                }
            }, function () {
                ShowToaster('Տեղի ունեցավ սխալ', 'error');
            });
        }
        else {
            $scope.confirmOrder(orderID);
        }
    };
    $scope.confirmReestr = function (orderID) {
        var checked = sessionStorage.getItem("isCheckedHBReestr");
        if (checked == "false") {
            showMesageBoxDialog('Անհրաժեշտ է կատարել ստուգում։', $scope, 'error');
            return;
        }

        var Data = HBDocumentsService.getcheckedReestrTransferDetails(orderID);
        Data.then(function (bond) {
            if (bond.data == "") {
                $scope.confirmOrder(orderID);
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }
        }, function () {
            hideloading();
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.confirmOrder = function (orderID) {

        if (orderID != null && orderID != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                .then(function () {
                    showloading();
                    var Data = orderService.confirmOrder(orderID);
                    Data.then(function (res) {
                        hideloading();

                        if (validate($scope, res.data) && res.data.ResultCode != 5) {
                            if ($scope.$root.SessionProperties.IsCalledFromHB == true) {

                                // $scope.refreshInfos();
                                refresh(6);
                            }

                        }
                        else {
                            $scope.showError = true;
                            ShowToaster($scope.error[0].Description, 'error');
                        }
                    }, function () {
                        hideloading();
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                        alert('Error confirmOrder');
                    });
                });
        };
    };

    $scope.changeReceivedOrSentMsg = function () {
        if ($scope.messageSearch.ReceivedOrSentMsg == "2") {
            $scope.messageSearch.ReadOrUnReadMsg = null;
        }
        else {
            $scope.messageSearch.ReadOrUnReadMsg = "1";
        }
    };

    $scope.changeReadOrUnReadMsg = function () {
        if ($scope.messageSearch.ReceivedOrSentMsg == "2") {
            $scope.messageSearch.ReadOrUnReadMsg = null;
        }
    };

    $scope.initBypassList = function () {
        var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));

        var Data = HBDocumentsService.getHBBypassList(doc.TransactionCode);
        Data.then(function (bond) {
            if (bond.data.length != 0) {
                $scope.bypassList = [];
                $scope.bypassList = bond.data.HBBypass;
                $scope.allowApprove = bond.data.AllowApprove;
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }
        }, function () {
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });

    };

    $scope.byPassSelectedTransaction = function () {

        if ($scope.transactionError.CustomerHasExpiredOrWrittenOffProducts == false && $scope.transactionError.MadeFromAnotherStation == false) {
            showMesageBoxDialog("Նշել շրջանցման տեսակներից որևիցե մեկը։", $scope, 'error');
            return;
        }

        var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));

        $scope.transactionError.DocID = doc.TransactionCode;
        $scope.transactionError.DocumentType = doc.DocumentType;
        $scope.transactionError.SourceType = doc.TransactionSource;
        var Data = HBDocumentsService.postbyPassSelectedTransaction($scope.transactionError);
        Data.then(function (bond) {
            if (bond.data.length != 0) {
                hideloading();
                showMesageBoxDialog('Սխալը ուղղվել է։', $scope, 'error');
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }
        }, function () {
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.checkJustOne = function (code) {
        if (code == 0 && $scope.transactionError.CustomerHasExpiredOrWrittenOffProducts == true) {
            $scope.transactionError.MadeFromAnotherStation = false;
            showMesageBoxDialog("Նշել միայն մեկը։", $scope, 'error');
            return;
        }
        else if (code == 1 && $scope.transactionError.MadeFromAnotherStation == true) {
            $scope.transactionError.CustomerHasExpiredOrWrittenOffProducts = false;
            showMesageBoxDialog("Նշել միայն մեկը։", $scope, 'error');
            return;
        }
    };

    $scope.writeBypassHistory = function () {

        var checked = 0;
        for (var i = 0; i < $scope.bypassList.length; i++) {
            if ($scope.bypassList[i].IsChecked == true) {
                checked++;
            }
        }

        if (checked == 0) {
            showMesageBoxDialog("Նշել շրջանցման տեսակներից որևիցե մեկը։", $scope, 'error');
            return;
        }

        var obj = {};
        var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));

        obj.DocID = doc.TransactionCode;
        obj.DocumentType = doc.DocumentType;
        obj.SourceType = doc.TransactionSource;
        obj.HBBypass = $scope.bypassList;


        var Data = HBDocumentsService.postBypassHistory(obj);
        Data.then(function (bond) {
            if (bond.data == "") {
                hideloading();
                showMesageBoxDialog('Պահպանված է։', $scope, 'error');
                $scope.allowApprove = true;
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }
        }, function () {
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.checkBypass = function (id) {
        for (var i = 0; i < $scope.bypassList.length; i++) {
            if (id == $scope.bypassList[i].ID) {
                $scope.bypassList[i].IsChecked = !$scope.bypassList[i].IsChecked;
            }
        }
    };

    $scope.approveUnconfirmedOrder = function () {
        //var checked = 0;
        //for (var i = 0; i < $scope.bypassList.length; i++) {
        //    if ($scope.bypassList[i].IsChecked == true) {
        //        checked++;
        //    }
        //}

        //if (checked == 0) {
        //    showMesageBoxDialog("Նշել որևիցե մեկը։", $scope, 'error');
        //    return;
        //}

        var obj = {};
        var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));

        obj.DocID = doc.TransactionCode;
        obj.DocumentType = doc.DocumentType;
        obj.SourceType = doc.TransactionSource;

        showloading();

        var Data = HBDocumentsService.postApproveUnconfirmedOrder(obj);
        Data.then(function (bond) {
            if (bond.data == "") {

                hideloading();
                $scope.$root.SessionProperties.IsCalledForHBConfirm = true;
                $confirm({ title: 'Գործարքի շրջանցում', text: 'Կատարված է։' })
                    .then(function () {
                        $scope.$root.SessionProperties.IsCalledForHBConfirm = false;
                        CloseBPDialog("HBDocumentsByPassTransaction");

                        refresh(6);
                    });

                //showMesageBoxDialog('Կատարված է։', $scope, 'error');
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }

        }, function () {
            hideloading();
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.changeFilialClick = function () {
        //if ((($scope.searchParams.QualityType == undefined && $scope.searchParams.QualityType == null) || $scope.searchParams.QualityType != 3 || $scope.searchParams.QualityType != 20)
        //    && ($scope.searchParams.TransactionCode == 0 && $scope.searchParams.TransactionCode == null) && ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null)) {
        //    $scope.searchParams.StartDate = new Date($scope.currentOperDay);
        //    $scope.searchParams.EndDate = new Date($scope.currentOperDay);
        //}
        //else if ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null){
        //    $scope.searchParams.StartDate = null;
        //    $scope.searchParams.EndDate = null;
        //}
    };

    $scope.changeDocumentTypeClick = function () {
        //if ((($scope.searchParams.QualityType == undefined && $scope.searchParams.QualityType == null) || $scope.searchParams.QualityType != 3 || $scope.searchParams.QualityType != 20)
        //    && ($scope.searchParams.TransactionCode == 0 && $scope.searchParams.TransactionCode == null) && ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null)) {
        //    $scope.searchParams.StartDate = new Date($scope.currentOperDay);
        //    $scope.searchParams.EndDate = new Date($scope.currentOperDay);
        //}
        //else if ($scope.searchParams.StartDate == null && $scope.searchParams.EndDate == null){
        //    $scope.searchParams.StartDate = null;
        //    $scope.searchParams.EndDate = null;
        //}
    };

    $scope.SortValues = function (sortField) {
        $scope.reverseOrder = ($scope.sortField === sortField) ? !$scope.reverseOrder : false;
        $scope.sortField = sortField;
    };

    $scope.checkStartDate = function () {

        if ($scope.searchParams.StartDate.getFullYear() > 2000 && $scope.searchParams.EndDate != undefined) {
            var date1 = new Date($scope.searchParams.StartDate);
            var date2 = new Date($scope.searchParams.EndDate);

            // To calculate the time difference of two dates 
            var Difference_In_Time = date1.getTime() - date2.getTime();

            // To calculate the no. of days between two dates 
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

            if (Difference_In_Days > 0) {
                showMesageBoxDialog('Ժամկետի սկիզբը պետք է փոքր լինի վերջից', $scope, 'error');
                $scope.searchParams.StartDate = null;
                return;
            }
        }

    };

    $scope.checkEndDate = function () {
        if ($scope.searchParams.EndDate.getFullYear() > 2000 && $scope.searchParams.StartDate != undefined) {
            var date1 = new Date($scope.searchParams.StartDate);
            var date2 = new Date($scope.searchParams.EndDate);

            // To calculate the time difference of two dates 
            var Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates 
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

            if (Difference_In_Days < 0) {
                showMesageBoxDialog('Ժամկետի վերջը պետք է մեծ լինի սկզբից', $scope, 'error');
                $scope.searchParams.EndDate = null;
                return;
            }
        }
    };

    $scope.initCustomerAccountAndInfo = function (document) {
        var Data = HBDocumentsService.getCustomerAccountAndInfoDetails(document);
        Data.then(function (req) {
            if (req.data != "[]") {
                $scope.customerInfoDetails = req.data.CustomerDetails;
                if ($scope.customerInfoDetails != null) {
                    if ($scope.customerInfoDetails.ObjectEmpty == true) {
                        $scope.customerInfoDetails = null;
                    }
                }
                else {
                    $scope.customerInfoDetails = null;
                }

                $scope.accountFlowDetails = {};
                $scope.accountFlowDetails = req.data.AccountDetails;
            }
            else {
                $scope.customerInfoDetails = null;
                $scope.accountFlowDetails = null;

            }

            sessionStorage.setItem("selectedDocument", angular.toJson(req.data));
        }, function () {
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    //msg
    $scope.getSearchedMessages = function () {

        if ($scope.messageSearch.StartDate != null && $scope.messageSearch.EndDate != null) {

            var date1 = new Date($scope.messageSearch.StartDate);
            var date2 = new Date($scope.messageSearch.EndDate);

            // To calculate the time difference of two dates 
            var Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates 
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

            if (Difference_In_Days < 0) {
                showMesageBoxDialog('Ժամկետի վերջը պետք է մեծ լինի սկզբից', $scope, 'error');
                $scope.messageSearch.EndDate = null;
                return;
            }
            // To calculate the time difference of two dates 
            Difference_In_Time = date1.getTime() - date2.getTime();

            // To calculate the no. of days between two dates 
            Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

            if (Difference_In_Days > 0) {
                showMesageBoxDialog('Ժամկետի սկիզբը պետք է փոքր լինի վերջից', $scope, 'error');
                $scope.messageSearch.StartDate = null;
                return;
            }

            if (Difference_In_Days > 31) {
                showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 31 օր:', $scope, 'error');
                return;
            }
        }

        if ($scope.messageSearch.CustomerNumber == null && $scope.messageSearch.ReadOrUnReadMsg == null && $scope.messageSearch.StartDate == null && $scope.messageSearch.EndDate == null &&
            $scope.messageSearch.ReceivedOrSentMsg == null && $scope.messageSearch.SetNumber == null) {
            showMesageBoxDialog('Ընտրեք ֆիլտրերից որևիցե մեկը։', $scope, 'error');
            return;
        }

        if ($scope.messageSearch.StartDate == null && $scope.messageSearch.EndDate == null && $scope.messageSearch.CustomerNumber == null
            && $scope.messageSearch.ReadOrUnReadMsg != "1" && ($scope.messageSearch.ReceivedOrSentMsg == "2" || $scope.messageSearch.ReceivedOrSentMsg == "1")) {
            showMesageBoxDialog('Նշեք ժամանակահատվածը', $scope, 'error');
            return;
        }


        if ($scope.messageSearch.StartDate != null && $scope.messageSearch.EndDate == null) {
            showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 31 օր:', $scope, 'error');
            return;
        }
        else if ($scope.messageSearch.StartDate == null && $scope.messageSearch.EndDate != null) {
            showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 31 օր:', $scope, 'error');
            return;
        }
        else if ($scope.messageSearch.StartDate != null && $scope.messageSearch.EndDate != null &&
            ($scope.messageSearch.CustomerNumber == null && $scope.messageSearch.ReadOrUnReadMsg != "1" &&
                $scope.messageSearch.ReceivedOrSentMsg == "1" && $scope.messageSearch.SetNumber == null)) {
            var date1 = new Date($scope.messageSearch.StartDate);
            var date2 = new Date($scope.messageSearch.EndDate);

            // To calculate the time difference of two dates 
            var Difference_In_Time = date2.getTime() - date1.getTime();

            // To calculate the no. of days between two dates 
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            //var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

            if (Difference_In_Days > 30) {
                showMesageBoxDialog('Ժամանակահատվածը պետք է լինի առավելագույնը 31 օր:', $scope, 'error');
                return;
            }
        }

        showloading();

        $scope.messageSearch.firstRow = 0;
        $scope.messageSearch.LastGetRowCount = 30;

        $scope.messageSearch.PageNumber = 1;
        var Data1 = HBDocumentsService.getSearchedHbMsg($scope.messageSearch);
        Data1.then(function (bond) {
            $scope.messages = bond.data;
            if ($scope.messages.length != 0) {
                $scope.setClickedMsgRowInfo($scope.messages[0]);
                if ($scope.messages[0].File != null) {
                    if ($scope.messages[0].File.length != 0) {
                        $scope.files = $scope.messages[0].File;
                    }
                }

                $scope.msgAllCount = $scope.messages[0].MessagesCount;
                $scope.msgPageCount = Math.ceil($scope.msgAllCount / $scope.msgRowCount);

                //var msg = $scope.messages;
                //$scope.messages = msg.splice(0, $scope.msgRowCount - 1);

            }
            else {
                $scope.messageSearch.PageNumber = 0;
                $scope.messages = [];
                $scope.files = [];
            }
            hideloading();
        }, function () {
            hideloading();
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.getNextSearchedMessages = function () {

        showloading();

        var Data1 = HBDocumentsService.getSearchedHbMsg($scope.messageSearch);
        Data1.then(function (bond) {
            $scope.messages = bond.data;
            if ($scope.messages.length != 0) {
                $scope.setClickedMsgRowInfo($scope.messages[0]);
                if ($scope.messages[0].File != null) {
                    if ($scope.messages[0].File.length != 0) {
                        $scope.files = $scope.messages[0].File;
                    }
                }

                $scope.msgAllCount = $scope.messages[0].MessagesCount;
                $scope.msgPageCount = Math.ceil($scope.msgAllCount / $scope.msgRowCount);

                //var msg = $scope.messages;
                //$scope.messages = msg.splice(0, $scope.msgRowCount - 1);

            }
            else {
                $scope.messageSearch.PageNumber = 0;
                $scope.messages = [];
                $scope.files = [];
            }
            hideloading();
        }, function () {
            hideloading();
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };

    $scope.backToFirstMsgPage = function () {

        $scope.messageSearch.firstRow = 0;
        $scope.messageSearch.LastGetRowCount = $scope.msgRowCount - 1;

        $scope.getNextSearchedMessages($scope.messageSearch);
    };
    $scope.backOneMsgPage = function () {

        $scope.messageSearch.firstRow = ($scope.messageSearch.PageNumber - 1) * $scope.msgRowCount;
        $scope.messageSearch.LastGetRowCount = $scope.messageSearch.PageNumber * $scope.msgRowCount;

        $scope.getNextSearchedMessages($scope.messageSearch);
    };
    $scope.moveForwardOneMsgPage = function () {

        $scope.messageSearch.firstRow = ($scope.messageSearch.PageNumber - 1) * $scope.msgRowCount;
        $scope.messageSearch.LastGetRowCount = $scope.messageSearch.PageNumber * $scope.msgRowCount;

        $scope.getNextSearchedMessages($scope.messageSearch);
    };
    $scope.goToLastMsgPage = function () {

        $scope.messageSearch.firstRow = ($scope.messageSearch.PageNumber - 1) * $scope.msgRowCount;
        $scope.messageSearch.LastGetRowCount = $scope.messageSearch.PageNumber * $scope.msgRowCount;

        $scope.getNextSearchedMessages($scope.messageSearch);
    };

    $scope.checkMsgStartDate = function () {
        if ($scope.messageSearch.StartDate.getFullYear() > 2000 && $scope.messageSearch.EndDate != undefined) {
            var date1 = new Date($scope.messageSearch.StartDate);
            var date2 = new Date($scope.messageSearch.EndDate);

            //To calculate the time difference of two dates 
            var Difference_In_Time = date1.getTime() - date2.getTime();

            //To calculate the no. of days between two dates 
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

            if (Difference_In_Days > 0) {
                document.getElementById("msgStartDate").style.color = 'red';
                //showMesageBoxDialog('Ժամկետի սկիզբը պետք է փոքր լինի վերջից', $scope, 'error');
                //$scope.messageSearch.StartDate = null;
                return;
            }
            else {
                document.getElementById("msgStartDate").style.color = 'black';
                document.getElementById("msgEndDate").style.color = 'black';
            }
        }
    };

    $scope.checkMsgEndDate = function () {
        if ($scope.messageSearch.EndDate.getFullYear() > 2000 && $scope.messageSearch.StartDate != undefined) {
            var date1 = new Date($scope.messageSearch.StartDate);
            var date2 = new Date($scope.messageSearch.EndDate);

            //To calculate the time difference of two dates 
            var Difference_In_Time = date2.getTime() - date1.getTime();

            ///To calculate the no. of days between two dates 
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

            var diff = Math.abs(new Date($scope.searchParams.StartDate) - new Date($scope.searchParams.EndDate));

            if (Difference_In_Days < 0) {
                document.getElementById("msgEndDate").style.color = 'red';
                //showMesageBoxDialog('Ժամկետի վերջը պետք է մեծ լինի սկզբից', $scope, 'error');
                //$scope.messageSearch.EndDate = null;
                return;
            }
            else {
                document.getElementById("msgEndDate").style.color = 'black';
                document.getElementById("msgStartDate").style.color = 'black';
            }
        }
    };

    $scope.getSearchedHBMsgCustomer = function (customer) {

        $scope.messageSearch.CustomerNumber = parseInt(customer.customerNumber);

        $scope.closeSearchCustomersModal();
    };

    $scope.searchHBMsgCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedHBMsgCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });
    };

    $scope.SortMsgValues = function (msgSortField) {
        $scope.msgReverseOrder = ($scope.msgSortField === msgSortField) ? !$scope.msgReverseOrder : false;
        $scope.msgSortField = msgSortField;
    };

    $scope.openHBDocumentSendMessage = function (number) {
        var selectedMsgRow = angular.fromJson(sessionStorage.getItem("selectedMsg"));
        if (selectedMsgRow != null) {
            params = { message: $scope.selectedMsg };

            $scope.openWindow('/HomeBankingDocuments/HBDocumentSendMessage', '«Home Banking» համակարգի հաղորդագրություններ', 'HBDocumentSendMessageForm');
        }
        else {
            showMesageBoxDialog('Ընտրեք հաղորդագրություն', $scope, 'error');
            return;
        }

    };

    $scope.setClickedMsgRowInfo = function (msg) {
        $scope.selectedMsg = msg;
        $scope.selectedRowMsg = msg;
        $scope.params = {
            selectedId: msg.ID, sentRecieve: msg.SentRecieve, message: msg
        };

        sessionStorage.setItem("selectedMsg", angular.toJson(msg));
    };
    $scope.bypassUnconfirmedOrder = function () {
        var doc = angular.fromJson(sessionStorage.getItem("selectedDocument"));

        $confirm({ title: 'Գործարքի շրջանցում', text: 'Շրջանցե՞լ ժամկետանց կամ դուրսգրված պրոդուկտների ստուգումը' })
            .then(function () {
                showloading();

                var Data = HBDocumentsService.postApproveUnconfirmedOrder(doc.TransactionCode);
                Data.then(function (bond) {
                    if (bond.data == "") {


                        refresh(6);
                    }
                    else {
                        hideloading();
                        showMesageBoxDialog(bond.data, $scope, 'error');
                    }
                }, function () {
                    hideloading();
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                });

            });
    };

    
    $scope.confirmArmTransfer = function (orderID) {
        var Data1 = HBDocumentsService.getcheckedArmTransferDetails(orderID);
        Data1.then(function (bond) {
            if (bond.data == "") {
                $scope.confirmOrder(orderID);
            }
            else {
                hideloading();
                showMesageBoxDialog(bond.data, $scope, 'error');
            }
        }, function () {
            hideloading();
            ShowToaster('Տեղի ունեցավ սխալ', 'error');
        });
    };
}]);


function CloseBPDialog(dialogID) {
    var dialog = document.querySelector('#' + dialogID);
    $('#' + dialogID).hide();
    dialog.parentNode.removeChild(dialog);

    if (document.querySelector('.bp-dialog-overlay')) {
        $('.bp-dialog-overlay').css("display", "none");
    }

    return false;
};

//Save file to user's computer
var saveAs = saveAs || function (view) { "use strict"; if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) { return } var doc = view.document, get_URL = function () { return view.URL || view.webkitURL || view }, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"), can_use_save_link = "download" in save_link, click = function (node) { var event = new MouseEvent("click"); node.dispatchEvent(event) }, is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent), webkit_req_fs = view.webkitRequestFileSystem, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem, throw_outside = function (ex) { (view.setImmediate || view.setTimeout)(function () { throw ex }, 0) }, force_saveable_type = "application/octet-stream", fs_min_size = 0, arbitrary_revoke_timeout = 500, revoke = function (file) { var revoker = function () { if (typeof file === "string") { get_URL().revokeObjectURL(file) } else { file.remove() } }; if (view.chrome) { revoker() } else { setTimeout(revoker, arbitrary_revoke_timeout) } }, dispatch = function (filesaver, event_types, event) { event_types = [].concat(event_types); var i = event_types.length; while (i--) { var listener = filesaver["on" + event_types[i]]; if (typeof listener === "function") { try { listener.call(filesaver, event || filesaver) } catch (ex) { throw_outside(ex) } } } }, auto_bom = function (blob) { if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) { return new Blob(["\ufeff", blob], { type: blob.type }) } return blob }, FileSaver = function (blob, name, no_auto_bom) { if (!no_auto_bom) { blob = auto_bom(blob) } var filesaver = this, type = blob.type, blob_changed = false, object_url, target_view, dispatch_all = function () { dispatch(filesaver, "writestart progress write writeend".split(" ")) }, fs_error = function () { if (target_view && is_safari && typeof FileReader !== "undefined") { var reader = new FileReader; reader.onloadend = function () { var base64Data = reader.result; target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/)); filesaver.readyState = filesaver.DONE; dispatch_all() }; reader.readAsDataURL(blob); filesaver.readyState = filesaver.INIT; return } if (blob_changed || !object_url) { object_url = get_URL().createObjectURL(blob) } if (target_view) { target_view.location.href = object_url } else { var new_tab = view.open(object_url, "_blank"); if (new_tab == undefined && is_safari) { view.location.href = object_url } } filesaver.readyState = filesaver.DONE; dispatch_all(); revoke(object_url) }, abortable = function (func) { return function () { if (filesaver.readyState !== filesaver.DONE) { return func.apply(this, arguments) } } }, create_if_not_found = { create: true, exclusive: false }, slice; filesaver.readyState = filesaver.INIT; if (!name) { name = "download" } if (can_use_save_link) { object_url = get_URL().createObjectURL(blob); setTimeout(function () { save_link.href = object_url; save_link.download = name; click(save_link); dispatch_all(); revoke(object_url); filesaver.readyState = filesaver.DONE }); return } if (view.chrome && type && type !== force_saveable_type) { slice = blob.slice || blob.webkitSlice; blob = slice.call(blob, 0, blob.size, force_saveable_type); blob_changed = true } if (webkit_req_fs && name !== "download") { name += ".download" } if (type === force_saveable_type || webkit_req_fs) { target_view = view } if (!req_fs) { fs_error(); return } fs_min_size += blob.size; req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) { fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) { var save = function () { dir.getFile(name, create_if_not_found, abortable(function (file) { file.createWriter(abortable(function (writer) { writer.onwriteend = function (event) { target_view.location.href = file.toURL(); filesaver.readyState = filesaver.DONE; dispatch(filesaver, "writeend", event); revoke(file) }; writer.onerror = function () { var error = writer.error; if (error.code !== error.ABORT_ERR) { fs_error() } }; "writestart progress write abort".split(" ").forEach(function (event) { writer["on" + event] = filesaver["on" + event] }); writer.write(blob); filesaver.abort = function () { writer.abort(); filesaver.readyState = filesaver.DONE }; filesaver.readyState = filesaver.WRITING }), fs_error) }), fs_error) }; dir.getFile(name, { create: false }, abortable(function (file) { file.remove(); save() }), abortable(function (ex) { if (ex.code === ex.NOT_FOUND_ERR) { save() } else { fs_error() } })) }), fs_error) }), fs_error) }, FS_proto = FileSaver.prototype, saveAs = function (blob, name, no_auto_bom) { return new FileSaver(blob, name, no_auto_bom) }; if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) { return function (blob, name, no_auto_bom) { if (!no_auto_bom) { blob = auto_bom(blob) } return navigator.msSaveOrOpenBlob(blob, name || "download") } } FS_proto.abort = function () { var filesaver = this; filesaver.readyState = filesaver.DONE; dispatch(filesaver, "abort") }; FS_proto.readyState = FS_proto.INIT = 0; FS_proto.WRITING = 1; FS_proto.DONE = 2; FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null; return saveAs }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content); if (typeof module !== "undefined" && module.exports) { var exp = module.exports; exp.saveAs = saveAs } else if (typeof define !== "undefined" && define !== null && define.amd != null) { define([], function () { return saveAs }) }


