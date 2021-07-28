app.controller("LoanStatementCtrl", ['$scope', 'loanService', 'ReportingApiService', function ($scope, loanService, ReportingApiService) {
    $scope.dateFrom = $scope.$root.SessionProperties.OperationDate;
    $scope.dateTo = $scope.$root.SessionProperties.OperationDate;

    $scope.printLoanStatement = function (accountnumber) {     
        if ($scope.dateFrom <= $scope.dateTo)
        {
            
            showloading();
            var Data = loanService.printLoanStatement(accountnumber, $scope.dateFrom, $scope.dateTo);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 66, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error printLoanStatement');
            });
        }
       
    };

    $scope.printLoanStatementNew = function (accountnumber, appid,lang, exportFormat) {
        if ($scope.dateFrom <= $scope.dateTo) {

            showloading();
            var Data = loanService.printLoanStatementNew(accountnumber, $scope.dateFrom, $scope.dateTo, appid, lang, exportFormat);
            Data.then(function (response) {
                var format = 0;
                if (exportFormat == "pdf") {
                    format = 1;
                }
                else {
                    format = 2;
                }
                var requestObj = { Parameters: response.data, ReportName: 67, ReportExportFormat: format }
                ReportingApiService.getReport(requestObj, function (result) {
                    if (exportFormat == 'xls') {
                        ShowExcelReport(result, 'LoanStatement');
                    }
                    else {
                        ShowPDFReport(result);
                    }
                });
            }, function () {
                alert('Error printLoanStatementNew');
            });
        }

    };

}]);