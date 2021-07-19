app.controller("ErrorCtrl",['$scope', function ($scope) {

    $scope.exeptions = {
        368: 'DateTo', 370: 'DateTo', 369: 'DateFrom', 227: 'FeeAccount', 422: 'amount', 423: 'amount',
        424: 'CashDate', 425: 'CashDate', 426: 'CashDate', 427: 'CashDate', 436: 'CashDate', 435: 'CashDate', 428: 'CashDate', 447: 'MainEmail', 446: 'MainEmail', 450: 'SecondaryEmail', 448: 'Accounts', 449: 'Frequency',
        300: 'FeeAccount', 228: 'FeeAccount', 227: 'FeeAccount', 458: 'ContractNumber', 254: 'Currency', 431: 'SubType', 430: 'CashFillial', 20: 'amount', 366: 'DateFrom', 364: 'DateTo', 369: 'DateFrom',
        373: 'ReferenceEmbassy', 376: 'ReferenceFor', 374: 'ReferenceLanguage', 375: 'ReferenceFilial', 451: 'RegistrationDate', 397: 'Accounts', 499: 'FeeAccount', 391: 'ThirdPerson', 218: 'Deposit.EndDate',
        232: 'Deposit.EndDate', 235: 'Deposit.EndDate', 234: 'Deposit.EndDate', 240: 'DepositCurrency', 215: 'DepositType', 480: 'ThirdPerson', 20: 'Amount', 223: 'Amount', 15: 'debitAccount', 228: 'debitAccount',
        227: 'debitAccount', 479: 'debitAccount', 230: 'percentAccount', 229: 'percentAccount', 478: 'percentAccount'

    };
    $scope.setFocusToTextBox = function (code) {


        var textbox = document.getElementById($scope.exeptions[code]);
        textbox.focus();
        //textbox.scrollIntoView();
    };

    $scope.scrollToDiv = function (dialogId, divId) {
       
        CloseBPDialog('error');
        if (dialogId != undefined && divId != undefined) {
            $('#' + dialogId).scrollTo('#' + divId);
        }
    }



}]);