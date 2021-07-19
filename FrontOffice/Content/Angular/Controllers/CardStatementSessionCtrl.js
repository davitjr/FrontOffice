app.controller('CardStatementSessionCtrl', ['$scope', 'cardStatementSessionService', 'casherService', '$filter', 'dialogService', '$rootScope', 'infoService', '$uibModal', 'utilityService', '$confirm', function ($scope, cardStatementSessionService, casherService, $filter, dialogService, $rootScope, infoService, $uibModal, utilityService, $confirm) {
    $rootScope.OpenMode = 10;
    $scope.searchParam = {};
    $scope.statementCreationStatus = 0;
    $scope.statementSendStatus = 0;
    $scope.statement = {};
    $scope.StartType = 2;
    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate(), h = date.getHours(), mm = date.getMinutes();
    $scope.Schedule = new Date(y, m, d, h + 1, mm);

    $scope.setDates = function () {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

        if ($scope.statement.Frequency !== undefined) {
            switch ($scope.statement.Frequency) {
                case "1":
                    $scope.startDate = new Date(y, m, d);
                    $scope.endDate = new Date(y, m, d);
                    break;
                case "2":
                    $scope.startDate = getMonday(date);
                    $scope.endDate = new Date(y, m, d);
                    break;
                case "3":
                    $scope.startDate = new Date(y, m, 1);
                    $scope.endDate = new Date(y, m, d);
                    break;
            }

        }
        else {
            if (date.getDate() > 15) {
                $scope.startDate = new Date(y, m, 1);
                $scope.endDate = new Date(y, m, 15);
            }
            else {
                $scope.startDate = new Date(y, m - 1, 1);
                $scope.endDate = new Date(y, m, 0);
            }
        }
    };

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.currentStatementSession = $scope.cardStatementSessions[index];
    };



    $scope.getCurrentOperDay = function () {
        var Data = utilityService.getCurrentOperDay();
        Data.then(function (opDate) {
            $scope.searchParams.RegistrationDate = $filter('mydate')(opDate.data, "dd/MM/yyyy");
        }, function () {
            alert('Error getRest');
        });
    };

    $scope.getCardStatementSessions = function () {

        var DataStatementType = cardStatementSessionService.GetStatementType();
        DataStatementType.then(function (res) {

            if (res.data == 1) {
                $scope.cardStatementSessionsText = 'Քաղվածքների սեսիաների պատմություն'
                $rootScope.OpenMode = 10;
                $scope.actionType = 1;
            }
            else if (res.data == 2) {
                $scope.cardStatementSessionsText = 'Վարկային քաղվածքների սեսիաների պատմություն'
                $rootScope.OpenMode = 0;
                $scope.actionType = 2;
            }
            else if (res.data == 3) {
                $scope.cardStatementSessionsText = 'Ընթացիկ հաշվի քաղվածքների սեսիաների պատմություն'
                $rootScope.OpenMode = 0;
                $scope.actionType = 3;
            }
        }, function () {
            alert('Error GetStatementType');
        });

        var Data = cardStatementSessionService.getCardStatementSessions();
        Data.then(function (res) {
            $scope.cardStatementSessions = res.data;
        }, function () {
            alert('Error getSMSMessagingSessions');
        });
    };


    $scope.getStatementSessionQualityTypes = function () {
        var Data = cardStatementSessionService.getStatementSessionQualityTypes();
        Data.then(function (res) {
            $scope.statementSessionQualityTypes = res.data;
        }, function () {
            alert('Error getStatementSessionQualityTypes');
        });
    };

    $scope.getCardSessionDetails = function (SessionNumber) {
        showloading();
        var Data = cardStatementSessionService.getCardSessionDetails(SessionNumber);
        Data.then(function (res) {
            $scope.cardStatementSessionDetails = res.data;
            $scope.refreshSessions();
            hideloading();
        }, function () {
            hideloading();
            alert('Error getCardSessionDetails');
        });
    };


    $scope.getSatementHistory = function (SessionNumber) {
        var Data = cardStatementSessionService.getSatementHistory(SessionNumber);
        Data.then(function (res) {
            $scope.cardStatementHystory = res.data;
        }, function () {
            alert('Error getSatementHistory');
        });
    };


    $scope.startCardStatementSessionSubscription = function (sessionID) {
        $confirm({ title: 'Սկսե՞լ քաղվածքների ստեղծումը', text: 'Քաղվածքների ստեղծում' })
            .then(function () {
                showloading();
                var Data = cardStatementSessionService.startCardStatementSessionSubscription(sessionID, $scope.StartType, ($scope.Schedule == undefined) ? Date.now() : $scope.Schedule);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        $scope.refreshSessions();
                        hideloading();
                        CloseBPDialog('startcardstatementsession');
                        showMesageBoxDialog('Քաղվածքների ստեղծման պրոցեսը սկսված է։', $scope, 'information');
                    }
                    else {
                        hideloading();
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error startCardStatementSessionSubscription');
                });
            });
    };

    $scope.changeStatementSessionStatus = function (sessionID) {
        document.getElementById("cardStatementSessionDetailsLoad").classList.remove("hidden");
        var Data = cardStatementSessionService.changeStatementSessionStatus(sessionID);
        Data.then(function (res) {
            document.getElementById("cardStatementSessionDetailsLoad").classList.add("hidden");
            $scope.cardStatementSessionDetails.Quality = res.data;
            $scope.refreshSessions();
        }, function () {
            alert('Error startCardStatementSessionSubscription');
        });
    };

    $scope.createCardStatementSession = function () {
        showloading();
        if ($scope.statement.Frequency == undefined)
            $scope.statement.Frequency = 0;
        var Data = cardStatementSessionService.createCardStatementSession($scope.startDate, $scope.endDate, $scope.statement.Frequency);
        Data.then(function (res) {

            if (validate($scope, res.data)) {
                hideloading();
                //$scope.path = '#Orders';
                showMesageBoxDialog('Քաղվածքները պատրաստ են ստեղծման', $scope, 'information');
                CloseBPDialog('addCardStatementSession');

                $scope.refreshSessions();

            }
            else {
                hideloading();
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            alert('Error saveClosingAccount');
        });

    };

    $scope.deleteCardStatementSession = function () {
        $confirm({ title: 'Հեռացնե՞լ սեսիան', text: 'Ստեղծված սեսիայի հեռացում' })
            .then(function () {
                showloading();
                var Data = cardStatementSessionService.deleteCardStatementSession($scope.currentStatementSession.SessionNumber);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        hideloading();
                        //$scope.path = '#Orders';
                        showMesageBoxDialog('Սեսիան հեռացված է', $scope, 'information');
                        //CloseBPDialog('addCardStatementSession');

                        $scope.refreshSessions();

                    }
                    else {
                        hideloading();
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveClosingAccount');
                });
            });
    };

    $scope.printCardSessionStatements = function (sessionID, statementStartDate, statementEndDate, actionType) {
        showloading();
        statementStartDate = $filter('mydate')(statementStartDate, "dd/MM/yyyy");
        statementEndDate = $filter('mydate')(statementEndDate, "dd/MM/yyyy");
        var Data = cardStatementSessionService.printCardSessionStatements(sessionID, ($scope.statementCreationStatus == null) ? 0 : $scope.statementCreationStatus, ($scope.statementSendStatus == null) ? 0 : $scope.statementSendStatus, statementStartDate, statementEndDate, actionType);
        ShowExcel(Data, actionType == 1 ? "CardStatementSession" : "AccountStatementSession");

    };

    $scope.printLoanSessionStatements = function (sessionID, startDate, endDate) {
        var Data = cardStatementSessionService.printLoanSessionStatements(($scope.sessionID == null) ? 0 : sessionID, ($scope.statementCreationStatus == null) ? 0 : $scope.statementCreationStatus, ($scope.statementSendStatus == null) ? 0 : $scope.statementSendStatus, $scope.statement.StartDate, $scope.statement.EndDate);
        ShowExcel(Data, "LoanStatementSession");
    }

    $scope.deleteCardStatementSessionSchedule = function () {
        $confirm({ title: 'Հեռացնե՞լ պլանավորումը', text: 'Սեսիայի պլանավորման հեռացում' })
            .then(function () {
                showloading();
                var Data = cardStatementSessionService.deleteCardStatementSessionSchedule($scope.currentStatementSession.SessionNumber);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        hideloading();
                        //$scope.path = '#Orders';
                        showMesageBoxDialog('Պլանավորունը հեռացված է', $scope, 'information');
                        //CloseBPDialog('addCardStatementSession');

                        $scope.refreshSessions();

                    }
                    else {
                        hideloading();
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveClosingAccount');
                });
            });
    };

    $scope.refreshSessions = function () {
        var refreshScope = angular.element(document.getElementById('CardStatementSessionForm')).scope();
        if (refreshScope != undefined) {
            refreshScope.getCardStatementSessions();
        }
    }

    function getMonday(d) {
        d = new Date(d);
        var day = d.getDay(),
            diff = d.getDate() - day + (day == 0 ? -6 : 1); 
        return new Date(d.setDate(diff));
    }

    $scope.initStatement = function () {
        var mainScope = angular.element(document.getElementById('CardStatementSessionForm')).scope();
        if (mainScope.actionType == 3)
            $scope.statement.Frequency = "1";
        $scope.setDates();

    };

}]);