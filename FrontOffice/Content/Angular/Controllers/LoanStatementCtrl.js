app.controller("LoanStatementCtrl", ['$scope', 'loanService', function ($scope, loanService) {
    $scope.dateFrom = $scope.$root.SessionProperties.OperationDate;
    $scope.dateTo = $scope.$root.SessionProperties.OperationDate;

    $scope.printLoanStatement = function (accountnumber) {     
        if ($scope.dateFrom <= $scope.dateTo)
        {
            
            showloading();
            var Data = loanService.printLoanStatement(accountnumber, $scope.dateFrom, $scope.dateTo);
            ShowPDF(Data);
        }
       
    };

    $scope.printLoanStatementNew = function (accountnumber, appid,lang, exportFormat) {
        if ($scope.dateFrom <= $scope.dateTo) {

            showloading();
            var Data = loanService.printLoanStatementNew(accountnumber, $scope.dateFrom, $scope.dateTo, appid, lang, exportFormat);
            if (exportFormat == 'xls') {
                ShowExcel(Data, 'LoanStatement');
            }
            else {
                ShowPDF(Data);
            }
        }

    };

}]);