app.controller('SMSMessagingCtrl', ['$scope', 'SMSMessagingService', 'casherService', '$filter', 'utilityService', 'dialogService', '$rootScope', 'infoService', '$uibModal', '$confirm', 'ReportingApiService', function ($scope, SMSMessagingService, casherService, $filter, utilityService, dialogService, $rootScope, infoService, $uibModal, $confirm, ReportingApiService) {
    $rootScope.OpenMode = 6;
    $scope.searchParams = {
        RegistrationDate: null,
        UserID: null,
        Status: null,
        Description: null
    };

    if (document.getElementById("readFile") != undefined)
        document.getElementById("readFile").required = true;

    $scope.messagingSession = {

    };

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
    };

    var reader = new FileReader();
    reader.onload = function () {
        $scope.messagingSession.messages = reader.result.replace(/"/g, "'");
        var Data = SMSMessagingService.uploadMessages($scope.messagingSession);
        Data.then(function (res) {
            if (validate($scope, res.data)) {
                scope = angular.element(document.getElementById('smsMessagingForm')).scope();
                scope.searchParams = {
                    RegistrationDate: null,
                    UserID: null,
                    Status: null,
                    Description: null
                };
                scope.getUserID();
                scope.getSMSMessagingSessions();
                CloseBPDialog('addSMSMessagingSession');
                ShowToaster('Գործողությունը կատարված է', 'success');
            }
            else {
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    }

    $scope.uploadMessages = function () {
        reader.readAsText(readFile.files[0]);
    };

    $scope.checkFile = function () {
        if (document.getElementById("readFile") != undefined) {
            return readFile.files[0] == undefined;
        }
    };


    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.searchParams.FillialCode = ref.data;
        }, function () {
            alert('Error getUserFilialCode');
        });
    };

    $scope.GetSMSMessagingStatusTypes = function () {
        var Data = infoService.GetSMSMessagingStatusTypes();
        Data.then(function (statuses) {
            $scope.StatusTypes = statuses.data;
            for (var i = 0; i < $scope.StatusTypes.length; i++) {
                if ($scope.StatusTypes[i].Key == 2) {
                    $scope.StatusTypes[i].Value = $scope.StatusTypes[i + 1].Value;
                }
            }
        }, function () {
            alert('Error getStatusTypes');
        });
    };

    $scope.searchCashiers = function () {
        $scope.searchCashiersModalInstance = $uibModal.open({
            template: '<searchcashier callback="getSearchedCashier(cashier)" close="closeSearchCashiersModal()"></searchcashier>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    }

    $scope.getSearchedCashier = function (cashier) {
        $scope.searchParams.UserID = cashier.setNumber;
        $scope.closeSearchCashiersModal();
    };

    $scope.closeSearchCashiersModal = function () {
        $scope.searchCashiersModalInstance.close();
    };


    //$scope.initSMSMessagingForm = function () {
    //    $scope.searchParams.RegistrationDate = new Date();
    //    var Data = casherService.getUserID();
    //    Data.then(function (user) {
    //        $scope.searchParams.UserID = user.data;
    //    }, function () {
    //        alert('Error');
    //    });
    //}

    $scope.getUserID = function () {
        var Data = casherService.getUserID();
        Data.then(function (user) {
            $scope.searchParams.UserID = user.data;
            $scope.getCurrentOperDay();
        }, function () {
            alert('Error');
        });
    };

    $scope.getCurrentOperDay = function () {
        var Data = utilityService.getCurrentOperDay();
        Data.then(function (opDate) {
            $scope.searchParams.RegistrationDate = $filter('mydate')(opDate.data, "dd/MM/yyyy");
        }, function () {
            alert('Error getRest');
        });
    };


    $scope.getSMSMessagingSessions = function () {
        if ($scope.searchParams.RegistrationDate == undefined) {
            $scope.searchParams.RegistrationDate = new Date();
        }
        var Data = SMSMessagingService.getSMSMessagingSessions($scope.searchParams);
        Data.then(function (smsMessagingSessions) {
            $scope.smsMessagingSessions = smsMessagingSessions.data;
            for (var i = 0; i < $scope.smsMessagingSessions.length; i++) {
                if ($scope.smsMessagingSessions[i].Status == 2) {
                    $scope.smsMessagingSessions[i].StatusDescription = $scope.StatusTypes[2].Value;
                }
            }
        }, function () {
            alert('Error getSMSMessagingSessions');
        });
    };


    $scope.changesmsMessagingStatus = function (smsMessagingSessionID, newStatus, smsMessagingSession) {
        if (smsMessagingSessionID != null && smsMessagingSessionID != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ուղարկել հաղորդագրությունները' })
            .then(function () {
                showloading();
                var Data = SMSMessagingService.changesmsMessagingStatus(smsMessagingSessionID, newStatus);
                Data.then(function (res) {
                    hideloading();
                    if (validate($scope, res.data) && res.data.ResultCode != 5) {
                        smsMessagingSession.Status = newStatus;
                        for (var i = 0; i < $scope.StatusTypes.length; i++) {
                            if ($scope.StatusTypes[i].Key == newStatus) {
                                smsMessagingSession.StatusDescription = $scope.StatusTypes[i].Value;
                            }
                        }
                        ShowToaster('Գործողությունը կատարված է', 'success');
                    }
                    else {
                        $scope.showError = true;
                        showMesageBoxDialog($scope.error[0].Description, 'error');
                    }
                }, function () {
                    hideloading();
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                });
            });
        };
    };


    $scope.deleteMessagingSession = function (smsMessagingSessionID, index) {
        if (smsMessagingSessionID != null && smsMessagingSessionID != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնել հաղորդագրությունները' })
            .then(function () {
                showloading();
                var Data = SMSMessagingService.deleteMessagingSession(smsMessagingSessionID);
                Data.then(function (res) {
                    hideloading();
                    if (validate($scope, res.data) && res.data.ResultCode != 5) {
                        $scope.smsMessagingSessions.splice(index, 1);
                        ShowToaster('Գործողությունը կատարված է', 'success');
                    }
                    else {
                        $scope.showError = true;
                        showMesageBoxDialog($scope.error[0].Description, 'error');
                    }
                }, function () {
                    hideloading();
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                });
            });
        };
    };

    $scope.SMSMessagingReport = function (id) {
        showloading();
        var Data = SMSMessagingService.SMSMessagingReport(id);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 89, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowExcelReport(result, 'SMSMessagingReport');
            });
        }, function () {
            alert('Error SMSMessagingReport');
        });
    };
}]);