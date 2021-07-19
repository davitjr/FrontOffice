app.controller('LeasingStatementSessionCtrl', ['$scope', 'LeasingStatementSessionService', '$location', 'dialogService', '$confirm', '$uibModal', '$http', '$compile', '$state', '$window', '$filter','$log', '$sce', '$rootScope', 'infoService', 'utilityService', 'ReportingApiService', function ($scope, LeasingStatementSessionService, $location, dialogService, $confirm, $uibModal, $http, $compile, $state, $window, $filter, $log, $sce, $rootScope, infoService, utilityService, ReportingApiService) {
    $rootScope.OpenMode = 10;
    $scope.searchParam = {};
    $scope.statementCreationStatus = 0;
    $scope.statementSendStatus = 0;
    $scope.StartType = 2;
    $scope.statementType = 0;
    var date = new Date(), y = date.getFullYear(), m = date.getMonth(), d = date.getDate(), h = date.getHours(), mm = date.getMinutes();
    $scope.Schedule = new Date(y, m, d, h + 1, mm);

    //$scope.setDates = function () {
    //    var date = new Date(), y = date.getFullYear(), m = date.getMonth();

    //    if (date.getDate() > 15) {
    //        $scope.startDate = new Date(y, m, 1);
    //        $scope.endDate = new Date(y, m, 15);
    //    }
    //    else {
    //        $scope.startDate = new Date(y, m - 1, 1);
    //        $scope.endDate = new Date(y, m, 0);
    //    }
    //};

    $scope.setDates = function () {

        var Data = LeasingStatementSessionService.getLeasingOperDay();
        Data.then(function (opDate) {
            var date = new Date(parseInt(opDate.data.substr(6))), y = date.getFullYear(), m = date.getMonth();

            $scope.startDate = new Date(y, m, 1);
            $scope.endDate = date;

        }, function () {
            alert('Error setDates');
        });

    };

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.currentStatementSession = $scope.LeasingStatementSessions[index];
    };



    $scope.getCurrentOperDay = function () {
        var Data = utilityService.getCurrentOperDay();
        Data.then(function (opDate) {
            $scope.searchParams.RegistrationDate = $filter('mydate')(opDate.data, "dd/MM/yyyy");
        }, function () {
            alert('Error getRest');
        });
    };


    $scope.getLeasingStatementSessions = function () {

        var DataStatementType = LeasingStatementSessionService.GetStatementType();
        DataStatementType.then(function (res) {
            $scope.statementType = res.data;
            if (res.data == 100) {
                $scope.LeasingStatementSessionsText = 'Լիզինգի քաղվածքների սեսիաների պատմություն'
            }
            else {
                $scope.LeasingStatementSessionsText = 'Լիզինգի ապահովագրության վճարի հաշիվների սեսիաների պատմություն'
            }
        }, function () {
            alert('Error GetStatementType');
        });

        var Data = LeasingStatementSessionService.getLeasingStatementSessions();
        Data.then(function (res) {
            $scope.LeasingStatementSessions = res.data;
        }, function () {
            alert('Error getSMSMessagingSessions');
        });
    };


    $scope.getStatementSessionQualityTypes = function () {
        var Data = LeasingStatementSessionService.getStatementSessionQualityTypes();
        Data.then(function (res) {
            $scope.statementSessionQualityTypes = res.data;
        }, function () {
            alert('Error getStatementSessionQualityTypes');
        });
    };

    $scope.getLeasingSessionDetails = function (SessionNumber) {
        showloading();
        var Data = LeasingStatementSessionService.getLeasingSessionDetails(SessionNumber);
        Data.then(function (res) {
            $scope.LeasingStatementSessionDetails = res.data;
            $scope.refreshSessions();
            hideloading();
        }, function () {
            hideloading();
            alert('Error getLeasingSessionDetails');
        });
    };


    $scope.getSatementHistory = function (SessionNumber) {
        var Data = LeasingStatementSessionService.getSatementHistory(SessionNumber);
        Data.then(function (res) {
            $scope.LeasingStatementHystory = res.data;
        }, function () {
            alert('Error getSatementHistory');
        });
    };


    $scope.startLeasingStatementSessionSubscription = function (sessionID) {
        $confirm({ title: 'Սկսե՞լ քաղվածքների ստեղծումը', text: 'Քաղվածքների ստեղծում' })
            .then(function () {
                showloading();
                var Data = LeasingStatementSessionService.startLeasingStatementSessionSubscription(sessionID, $scope.StartType, ($scope.Schedule == undefined) ? Date.now() : $scope.Schedule);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        $scope.refreshSessions();
                        hideloading();
                        CloseBPDialog('startLeasingstatementsession');
                        showMesageBoxDialog('Քաղվածքների ստեղծման պրոցեսը սկսված է։', $scope, 'information');
                    }
                    else {
                        hideloading();
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error startLeasingStatementSessionSubscription');
                });
            });
    };

    $scope.changeStatementSessionStatus = function (sessionID) {
        document.getElementById("LeasingStatementSessionDetailsLoad").classList.remove("hidden");
        var Data = LeasingStatementSessionService.changeStatementSessionStatus(sessionID);
        Data.then(function (res) {
            document.getElementById("LeasingStatementSessionDetailsLoad").classList.add("hidden");
            $scope.LeasingStatementSessionDetails.Quality = res.data;
            $scope.refreshSessions();
        }, function () {
            alert('Error startLeasingStatementSessionSubscription');
        });
    };

    $scope.createLeasingStatementSession = function () {
        showloading();
        var Data = LeasingStatementSessionService.createLeasingStatementSession($scope.startDate, $scope.endDate);
        Data.then(function (res) {

            if (validate($scope, res.data)) {
                hideloading();
                //$scope.path = '#Orders';
                showMesageBoxDialog('Քաղվածքները պատրաստ են ստեղծման', $scope, 'information');
                CloseBPDialog('addLeasingStatementSession');

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

    $scope.deleteLeasingStatementSession = function () {
        $confirm({ title: 'Հեռացնե՞լ սեսիան', text: 'Ստեղծված սեսիայի հեռացում' })
            .then(function () {
                showloading();
                var Data = LeasingStatementSessionService.deleteLeasingStatementSession($scope.currentStatementSession.SessionNumber);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        hideloading();
                        //$scope.path = '#Orders';
                        showMesageBoxDialog('Սեսիան հեռացված է', $scope, 'information');
                        //CloseBPDialog('addLeasingStatementSession');

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

    $scope.printLeasingSessionStatements = function (sessionID, statementStartDate, statementEndDate) {
        showloading();
        statementStartDate = $filter('mydate')(statementStartDate, "dd/MM/yyyy");
        statementEndDate = $filter('mydate')(statementEndDate, "dd/MM/yyyy");

        var Data = LeasingStatementSessionService.printLeasingSessionStatements(sessionID, ($scope.statementCreationStatus == null) ? 0 : $scope.statementCreationStatus, ($scope.statementSendStatus == null) ? 0 : $scope.statementSendStatus, statementStartDate, statementEndDate);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 43, ReportExportFormat: 2 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowExcelReport(result, "LeasingSessionStatements_" + new Date().toString("ddMMyyyy"));
            });
        }, function () {
                alert('Error printLeasingSessionStatements');
        });
    };


    $scope.deleteLeasingStatementSessionSchedule = function () {
        $confirm({ title: 'Հեռացնե՞լ պլանավորումը', text: 'Սեսիայի պլանավորման հեռացում' })
            .then(function () {
                showloading();
                var Data = LeasingStatementSessionService.deleteLeasingStatementSessionSchedule($scope.currentStatementSession.SessionNumber);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        hideloading();
                        //$scope.path = '#Orders';
                        showMesageBoxDialog('Պլանավորունը հեռացված է', $scope, 'information');
                        //CloseBPDialog('addLeasingStatementSession');

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
        var refreshScope = angular.element(document.getElementById('LeasingStatementSessionForm')).scope();
        if (refreshScope != undefined) {
            refreshScope.getLeasingStatementSessions();
        }
    }

    $scope.printCustomersWithoutEmailReport = function () {
        showloading();
        var requestObj = { Parameters: null, ReportName: 44, ReportExportFormat: 2 }
        ReportingApiService.getReport(requestObj, function (result) {
            ShowExcelReport(result, "LeasingCustomersWithoutEmail_" + new Date().toString("ddMMyyyy"));
        }); 
    }

    $scope.printCustomersWithoutEmailForStatementReport = function (sessionId, endDate) {
        showloading();
        var Data = LeasingStatementSessionService.printLeasingCustomersWithoutEmailForStatementReport(sessionId, new Date(parseInt(endDate.substr(6))));
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 45, ReportExportFormat: 2 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowExcelReport(result, "CustomersWithoutEmailForStatement_" + new Date().toString("ddMMyyyy"));
            });
        }, function () {
            alert('Error printLeasingCustomersWithoutEmailForStatementReport');
        });
    }

}]);