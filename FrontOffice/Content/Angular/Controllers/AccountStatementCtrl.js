app.controller("AccountStatementCtrl", ['$scope', 'accountService', '$location', '$filter', 'depositService', function ($scope, accountService, $location, $filter, depositService) {

    $scope.averageRest = 1;//տպելիս ներառել նաև միջին մնացորդը 1-չներառել, 2-ներառել
    $scope.currencyRegulation = 1;//տպելիս ներառել նաև կարգավորումները 1-չներառել, 2-ներառել 
    $scope.payerData = 2;//մուծողի տվյալները 1-չտպել, 2-տպել
    $scope.additionalInformationByCB = 1;//լրացուցիչ տվյալներ ըստ ԿԲ-ի 1-չտպել, 2-տպել
    $scope.memorial = 0;//Մեմորիալ օրդեր 0-չտպել, 1-տպել

    $scope.dateFrom = $scope.$root.SessionProperties.OperationDate;
    $scope.dateTo = $scope.$root.SessionProperties.OperationDate;
    $scope.includingExchangeRate = 1;//ներառել նաև փոխարժեքը


    $scope.getAccountStatement = function (accountNumber) {
        if ($scope.withoutstatement == true)
        {
            return;
        }
        showloading();
        var Data = accountService.getAccountStatement(accountNumber, $scope.dateFrom, $scope.dateTo);
        Data.then(function (accStatement) {
            hideloading();
            $scope.accountStatement = accStatement.data;

        }, function () {
            hideloading();
            alert('Error getAccountStatement');
        });
    };

    $scope.printStatement = function (accountNumber, lang, exportFormat) {
        showloading();

        $scope.printAccountStatement(accountNumber, lang, exportFormat);
        if ($scope.memorial == 1)
        {
            $scope.printMemorial(accountNumber, 0);
            $scope.printMemorial(accountNumber, 1);

        }
    };

    $scope.printAccountStatement = function (accountNumber, lang, exportFormat) {
         
        var Data = accountService.printAccountStatement(accountNumber, lang, $scope.dateFrom, $scope.dateTo, $scope.averageRest, $scope.currencyRegulation, $scope.payerData, $scope.additionalInformationByCB, exportFormat);

        if (exportFormat == 'xls') {
            ShowExcel(Data, 'AccountStatement');
        }
        else {
            ShowPDF(Data);
        }

        
    };

    $scope.printStatementNew = function (accountNumber, lang, exportFormat) {
        showloading();

        $scope.printAccountStatementNew(accountNumber, lang, exportFormat);
        if ($scope.memorial == 1) {
            $scope.printMemorial(accountNumber, 0);
            $scope.printMemorial(accountNumber, 1);

        }
    };

    $scope.printAccountStatementNew = function (accountNumber, lang, exportFormat) {

        var Data = accountService.printAccountStatementNew(accountNumber, lang, $scope.dateFrom, $scope.dateTo, $scope.averageRest, $scope.currencyRegulation, $scope.payerData, $scope.additionalInformationByCB, exportFormat, $scope.includingExchangeRate);

        if (exportFormat == 'xls') {
            ShowExcel(Data, 'AccountStatement');
        }
        else {
            ShowPDF(Data);
        }


    };

     $scope.printDepositStatement = function (appid,accountNumber, lang, exportFormat) {
         showloading();
         var Data = depositService.printDepositStatement(appid, accountNumber, lang, $scope.dateFrom, $scope.dateTo, $scope.averageRest, $scope.currencyRegulation, $scope.payerData, $scope.additionalInformationByCB, exportFormat, $scope.includingExchangeRate);

        if (exportFormat == 'xls') {
            ShowExcel(Data, 'DepositStatement');
        }
        else {
            ShowPDF(Data);
        }
        
    };

    

    $scope.printMemorial = function (accountNumber, correct_mo) {
        
        var Data = accountService.printMemorial(accountNumber, $scope.dateFrom, $scope.dateTo, correct_mo);
        ShowPDF(Data);
    };
}]);