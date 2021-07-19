app.controller("AccountFreezeCtrl", ['$scope', 'accountFreezeService', 'infoService', 'dialogService', '$uibModal', '$confirm', '$http', function ($scope, accountFreezeService, infoService, dialogService, $uibModal, $confirm, $http) {

    $scope.getDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $scope.order = {};
    $scope.order.FreezeAccount = {};
    $scope.order.FreezedAccount = {};
    $scope.order.RegistrationDate = new Date();
    $scope.removeTypes = [];
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.currentOperDay = $scope.$root.SessionProperties.OperationDate;


    //$scope.setRemoveTypes = function (calledFrom) {
    //    if (calledFrom == "Freeze") {
    //        if ($scope.accounttype != 13) {
    //            $scope.removeTypes = ['1', '11', '13', '14', '17', '18'];
    //        }
    //        else {
    //            $scope.removeTypes = ['1', '11', '14', '4', '5', '6', '7', '8', '12', '13', '15', '16', '17', '18'];
    //        }
    //    }
    //    else if (calledFrom == "Unfreeze") {
    //        $scope.removeTypes = ['14'];
    //    }
    //};

    $scope.getAccountFreezeReasonsTypes = function (calledFrom) {
        if (calledFrom == "Freeze") {
            var Data = infoService.GetAccountFreezeReasonsTypesForOrder();
            Data.then(function (freezeTypes) {
                $scope.freezeReasonsTypes = freezeTypes.data;
                //angular.forEach($scope.removeTypes, function (value) {
                //    delete $scope.freezeReasonsTypes[value];
                //});
            }, function () {
                alert('Error FreezeReasonsTypes');
            });
        }
        else if (calledFrom == "Unfreeze") {
            var Data = infoService.GetUnFreezeReasonTypesForOrder($scope.selectedFreezeReasonId);
            Data.then(function (freezeTypes) {
                $scope.freezeReasonsTypes = freezeTypes.data;             
            }, function () {
                alert('Error FreezeReasonsTypes');
            });
        }
        else if (calledFrom == "forHistory") {
            var Data = infoService.GetAccountFreezeReasonsTypesForOrder();
            Data.then(function (freezeTypes) {
                $scope.freezeReasonsTypes = freezeTypes.data;
            }, function () {
                alert('Error FreezeReasonsTypes');
            });
        }
        
      
    };

    $scope.getAccountFreezeStatuses = function () {
        var Data = infoService.GetAccountFreezeStatuses();
        Data.then(function (freezeStatuse) {
            $scope.freezeStatuses = freezeStatuse.data;
            $scope.FreezeStatus = "1";
        }, function () {
            alert('Error FreezeStatuses');
        });
    };

    $scope.getAccountFreezeHistory = function (accountNumber) {
        $scope.accountNumber = (accountNumber == "" || accountNumber == undefined) ? 0 : accountNumber;
        $scope.freezeStatus = ($scope.FreezeStatus == undefined) ? 1 : $scope.FreezeStatus;
        $scope.reasonId = ($scope.FreezeType == undefined) ? 0 : $scope.FreezeType;
        var Data = accountFreezeService.GetAccountFreezeHistory($scope.accountNumber,
            $scope.freezeStatus,
            $scope.reasonId);
        Data.then(function (freezeHistory) {
            $scope.freezeHistory = freezeHistory.data;
        }, function () {
            alert('Error FreezeHistory');
        });
    };

    $scope.getAccountFreezeDetails = function (freezeId) {
        $scope.selectedFreezeId = (freezeId == "" || freezeId == undefined) ? 0 : freezeId;
        var Data = accountFreezeService.GetAccountFreezeDetails($scope.selectedFreezeId);
        Data.then(function (freezeDetails) {
            $scope.freezeDetails = freezeDetails.data;
        }, function () {
            alert('Error FreezeDetails');
        });
    };

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.selectedFreezeId = $scope.freezeHistory[index].Id;
        $scope.selectedUnfreezeDate = $scope.freezeHistory[index].UnfreezeDate;
        $scope.selectedFreezeReasonId = $scope.freezeHistory[index].ReasonId;
    };




    $scope.setAccountFreezeDate = function () {
        if (AccountFreezeOrderForm.ForDate.checked == true) {
            $scope.order.FreezeDate = $scope.currentOperDay;
        }
        else {
            $scope.order.FreezeDate = null;
        }
    };

    $scope.setAmountFreezeDate = function () {
        if ($scope.order.FreezeAmount != undefined && $scope.order.FreezeAmount != 0) {
            $scope.order.AmountFreezeDate = $scope.currentOperDay;
        }
        else {
            $scope.order.AmountFreezeDate = null;
        }
    };

    $scope.saveAccountFreezeOrder = function () {
        if ($http.pendingRequests.length == 0) {


            if ($scope.order.FreezeReason != null && $scope.order.FreezeReason != undefined) {
                $confirm({ title: 'Շարունակե՞լ', text: 'Սառեցնել հաշիվը' })
                    .then(function () {

                        document.getElementById("accountFreezeeLoad").classList.remove("hidden");
                        $scope.order.FreezeAccount.AccountNumber = $scope.accountnumber;

                        var Data = accountFreezeService.saveAccountFreezeOrder($scope.order);
                        Data.then(function (res) {
                            hideloading();

                            if (validate($scope, res.data)) {
                                if (res.data.Errors.length == 0) {
                                    refresh(66, $scope.accountnumber);
                                    ShowToaster('Սառեցումը կատարված է', 'success');
                                    CloseBPDialog('accountfreezeorder');
                                }
                                else {
                                    document.getElementById("accountFreezeeLoad").classList.add("hidden");
                                    $scope.path = '#Orders';
                                    $scope.showError = true;
                                    $scope.close();
                                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                                }
                            }
                            else {
                                document.getElementById("accountFreezeeLoad").classList.add("hidden");
                                $scope.showError = true;
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                            }
                        }, function () {
                            document.getElementById("accountFreezeeLoad").classList.add("hidden");
                            hideloading();
                            ShowToaster('Տեղի ունեցավ սխալ', 'error');
                            alert('Error saveAccountFreezeOrder');
                        });
                    });
            }
            else {
                ShowToaster('Մուտքագրվող տվյալները սխալ են կամ թերի', 'error');
            }
            ;
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getAccountFreezeOrder = function (orderId) {
        var Data = accountFreezeService.GetAccountFreezeOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountFreezeOrder');
        });
    };

    $scope.getAccountUnfreezeOrder = function (orderId) {
        var Data = accountFreezeService.GetAccountUnfreezeOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;
        }, function () {
            alert('Error getAccountUnfreezeOrder');
        });
    };

    $scope.saveAccountUnfreezeOrder = function () {

        if ($scope.order.UnfreezeReason != null && $scope.order.UnfreezeReason != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ապասառեցնել հաշիվը' })
                .then(function () {

                    document.getElementById("accountUnfreezeeLoad").classList.remove("hidden");
                    $scope.order.FreezedAccount.AccountNumber = $scope.accountnumber;
                    $scope.order.FreezeId = $scope.selectedFreezeId;
                    var Data = accountFreezeService.saveAccountUnfreezeOrder($scope.order);
                    Data.then(function (res) {
                        hideloading();

                        if (validate($scope, res.data)) {
                            if (res.data.Errors.length == 0) {
                                refresh(66, $scope.accountnumber);
                                ShowToaster('Ապաառեցումը կատարված է', 'success');
                                CloseBPDialog('accountunfreezeorder');
                            }
                            else {
                                document.getElementById("accountUnfreezeeLoad").classList.add("hidden");
                                $scope.path = '#Orders';
                                $scope.showError = true;
                                $scope.close();
                                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            }
                        }
                        else {
                            document.getElementById("accountUnfreezeeLoad").classList.add("hidden");
                            $scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }
                    }, function () {
                        document.getElementById("accountUnfreezeeLoad").classList.add("hidden");
                        hideloading();
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                        alert('Error saveAccountUnfreezeOrder');
                    });
                });
        }
        else {
            ShowToaster('Մուտքագրվող տվյալները սխալ են կամ թերի', 'error');
        }
        ;

    };

    $scope.closeEditDataModalInstance = function () {
        $scope.editDataModalInstance.close();
    };


    $scope.callbackgetAccountFreezeOrder = function () {
        $scope.getAccountFreezeOrder($scope.selectedOrderId);
    };

    $scope.callbackgetAccountUnfreezeOrder = function () {
        $scope.getAccountUnfreezeOrder($scope.selectedOrderId);
    };


}]);