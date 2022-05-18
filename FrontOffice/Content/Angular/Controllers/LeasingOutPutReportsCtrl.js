app.controller("LeasingOutPutReportsCtrl", ['$scope', 'LeasingOutPutReportsService', 'dateFilter', 'infoService', '$uibModal', 'ReportingApiService', function ($scope, LeasingOutPutReportsService, dateFilter, infoService, $uibModal, ReportingApiService) {

    $scope.searchParams = {};
    $scope.searchParams.StartDate = new Date();
    $scope.searchParams.EndDate = new Date();
    $scope.showPDF = false;


    $scope.getPrintReportTypes = function () {
        var Data = infoService.getLeasingReportTypes();
        Data.then(function (ord) {
            $scope.printReportTypes = ord.data;
            delete $scope.printReportTypes[4];
        }, function () {
            alert('Error getPrintReportTypes');
        });
    };


    $scope.showSearchParamByReportType = function (reportType) {
        $scope.showStartDate = false;
        $scope.showEndDate = false;
        $scope.showDate = false;

        if (reportType == 1 || reportType == 2 || reportType == 3) {
            $scope.showStartDate = true;
            $scope.showEndDate = true;
        }
        else {
            $scope.showDate = true;
        }

    };

    $scope.printReport = function (format) {

        switch ($scope.searchParams.ReportType) {
            case "1":
                $scope.economicSectorGroupReport(format);
                break;
            case "2":
                $scope.byGeographicRegionsReport(format);
                break;
            case "3":
                $scope.portfolioByTypeOfEquipmentReport(format);
                break;
            case "4":
                break;
            case "5":
                $scope.byFundsReport(format);
                break;
            case "6":
                $scope.ggfSoutheastReport(format);
                break;
            case "7":
                $scope.efseAggregateReport(format);
                break;
            case "8":
                $scope.portfolioByExpertsReport(format);
                break;
            case "9":
                $scope.reachSurveyTableReport(format);
                break;
            case "10":
                $scope.byKFWReport(format);
                break;
            case "11":
                $scope.averageReport(format);
                break;
            case "12":
                $scope.reviseLeasingsReport(format);
                break;
            case "13":
                $scope.loanRepaymentScheduleReport(format);
                break;
            case "14":
                $scope.bySubsidReport(format);
                break;
        }

    };

  
    $scope.economicSectorGroupReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'dd/MMM/yyyy');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'dd/MMM/yyyy');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data =LeasingOutPutReportsService.getEconomicSectorGroupReport(startDate, endDate);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 7, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'EconomicSectorGroupReport');
                }
            });
        }, function () {
            alert('Error getEconomicSectorGroupReport');
        });
    };

    $scope.portfolioByTypeOfEquipmentReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'dd/MMM/yyyy');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'dd/MMM/yyyy');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data =LeasingOutPutReportsService.getPortfolioByTypeOfEquipmentReport(startDate, endDate);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 8, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'PortfolioByTypeOfEquipmentReport');
                }
            });
        }, function () {
            alert('Error getPortfolioByTypeOfEquipmentReport');
        });
    };

    $scope.byGeographicRegionsReport = function (format) {
        showloading();
        var startDate = null;
        var endDate = null;
        if ($scope.searchParams.StartDate != undefined)
            startDate = dateFilter($scope.searchParams.StartDate, 'dd/MMM/yyyy');
        else {
            showMesageBoxDialog('Սկիզբը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        if ($scope.searchParams.EndDate != undefined)
            endDate = dateFilter($scope.searchParams.EndDate, 'dd/MMM/yyyy');
        else {
            showMesageBoxDialog('Վերջը նշված չէ', $scope, 'error');
            hideloading();
            return;
        }

        var Data =LeasingOutPutReportsService.getByGeographicRegionsReport(startDate, endDate);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 13, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'ByGeographicRegionsReport');
                }
            });
        }, function () {
            alert('Error getByGeographicRegionsReport');
        });
    };

    $scope.portfolioByExpertsReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }
        //if ($scope.searchParams.Date > new Date().Date) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getPortfolioByExpertsReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 1, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'PortfolioByExpertsReport');
                }
            });
        }, function () {
            alert('Error getPortfolioByExpertsReport');
        });
    };

    $scope.averageReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getAverageReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 2, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'AverageReport');
                }
            });
        }, function () {
            alert('Error getAverageReport');
        });
    };

    $scope.byKFWReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getByKFWReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 3, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowLeasingExcelReport(result, 'ByKFWReport');
                }
            });
        }, function () {
            alert('Error getByKFWReport');
        });
    };

    $scope.reachSurveyTableReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getReachSurveyTableReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 4, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowLeasingOldExcelReport(result, 'ReachSurveyTableReport');
                }
            });
        }, function () {
            alert('Error getReachSurveyTableReport');
        });
    };

    $scope.bySubsidReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getBySubsidReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 5, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'BySubsidReport');
                }
            });
        }, function () {
            alert('Error getBySubsidReport');
        });
    };

    $scope.loanRepaymentScheduleReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getLoanRepaymentScheduleReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 6, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'LoanRepaymentScheduleReport');
                }
            });
        }, function () {
            alert('Error getLoanRepaymentScheduleReport');
        });
    };

    $scope.byFundsReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getByFundsReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 9, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'ByFundsReport');
                }
            });
        }, function () {
            alert('Error getByFundsReport');
        });
    };

    $scope.ggfSoutheastReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getGGFSoutheastReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 10, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowLeasingExcelReport(result, 'GGFSoutheastReport');
                }
            });
        }, function () {
            alert('Error getGGFSoutheastReport');
        });
    };

    $scope.reviseLeasingsReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getReviseLeasingsReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 11, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowExcelReport(result, 'ReviseLeasingsReport');
                }
            });
        }, function () {
            alert('Error getReviseLeasingsReport');
        });
    };

    $scope.efseAggregateReport = function (format) {
        showloading();
        var date = null;

        if ($scope.searchParams.Date != undefined) {
            date = dateFilter($scope.searchParams.Date, 'yyyy/MM/dd');
        }

        //if (date > new Date()) {
        //    showMesageBoxDialog('Նշված օրը չպետք է առաջ լինի այս օրվա ամսաթվից ', $scope, 'error');
        //    hideloading();
        //    return
        //}
        //else {
        //    showMesageBoxDialog('Օրը նշված չէ', $scope, 'error');
        //    hideloading();
        //    return;
        //}

        var Data = LeasingOutPutReportsService.getEFSEAggregateReport(date);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 12, ReportExportFormat: format }
            ReportingApiService.getLeasingReport(requestObj, function (result) {
                if (format == 1) {
                    ShowPDFReport(result);
                }
                else if (format == 2) {
                    ShowLeasingExcelReport(result, 'EFSEAggregateReport');
                }
            });
        }, function () {
            alert('Error getEFSEAggregateReport');
        });
    };
}]);
