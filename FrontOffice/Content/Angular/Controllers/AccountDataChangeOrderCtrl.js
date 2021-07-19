app.controller("AccountDataChangeOrderCtrl", ["$rootScope", '$scope', 'accountDataChangeOrderService', 'infoService', 'orderService', '$confirm', 'dialogService', 'accountService', '$http',
                function ($rootScope, $scope, accountDataChangeOrderService, infoService, orderService, $confirm, dialogService, accountService, $http) {

    $scope.order = {};
    $scope.order.AdditionalDetails = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.getDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        if ($scope.account == undefined) {
        $scope.account = ($scope.$parent.account == undefined) ? $scope.Account : $scope.$parent.account;
    };




    $scope.getAccountStatementDeliveryType = function (accountNumber) {
            if (accountNumber == undefined) {
                accountNumber = $scope.account.AccountNumber;
            }
        var Data = accountService.GetAccountStatementDeliveryType(accountNumber);
        Data.then(function (delType) {
            $scope.order.AdditionType = 5;
            $scope.order.AdditionValue = delType.data;
            
        }, function () {
            alert('Error StatementDeliveryType');
        });
    };
       
    
    $scope.editAdditionalData = function (AdditionType, AdditionValue, Account) {

        $scope.order.AdditionType = AdditionType;
        $scope.order.AdditionValue = AdditionValue;
        $scope.Account = Account;
    };

       
    $scope.generateNewOrderNumber = function () {
        var Data = orderService.generateNewOrderNumber();
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };
    
    
    $scope.saveAccountDataChangeOrder = function (inView) {
        $scope.order.Type = 50;
        if ($http.pendingRequests.length == 0) {
          
            if ($scope.order.AdditionValue != null && $scope.order.AdditionValue != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Խմբագրել հաշվի տվյալները' })
            .then(function () {
                showloading();
                    $scope.order.DataChangeAccount = ($scope.account != undefined) ? $scope.account : (($scope.$parent.account == undefined) ? $scope.Account : $scope.$parent.account);
                $scope.order.AdditionalDetails.AdditionType = $scope.order.AdditionType;
                $scope.order.AdditionalDetails.AdditionValue = $scope.order.AdditionValue;
                $scope.order.SubType = 1;
             
                var Data = accountDataChangeOrderService.saveAccountDataChangeOrder($scope.order);
                Data.then(function (res) {
                    hideloading();

                    if (validate($scope, res.data)) {
                        if (res.data.Errors.length == 0) {
                            if ($scope.callback == undefined) {
                            //$scope.$parent.getAccountAdditionalDetails($scope.account.AccountNumber);
                        }
                            else {
                            $scope.callback({ account: $scope.account.AccountNumber });
                            }
                            refresh($scope.order.Type, $scope.order.DataChangeAccount.AccountNumber);
                            ShowToaster('Խմբագրումը կատարված է', 'success');

                            if (inView != true && $scope.$parent.$parent.isEditStatus != undefined) {
                                $scope.$parent.$parent.isEditStatus = false;
                            }
                            else {
                                            if (inView == true) {
                                    CloseBPDialog('accountDataChangeOrder');
                                }
                                $scope.$parent.isEdit = false;
                            }
                            refresh($scope.order.Type, $scope.order.DataChangeAccount);
                        }
                    else {
                            
                            $scope.path = '#Orders';
                            $scope.showError = true;
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        }
                            }
                            else {
                        if ($scope.callback == undefined) {
                            $scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }
                    }
                }, function () {
                    hideloading();
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                    alert('Error saveAccountDataChangeOrder');
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

       
    $scope.getStatementDeliveryTypes = function () {
        var Data = infoService.GetStatementDeliveryTypes();
        Data.then(function (delTypes) {
            $scope.deliveryTypes = delTypes.data;
        }, function () {
            alert('Error StatementDeliveryTypes');
        });
    };


    $scope.getAccountDataChangeOrder = function (orderID) {
        var Data = accountDataChangeOrderService.getAccountDataChangeOrder(orderID);
        Data.then(function (rep) {
            $scope.order = rep.data;
        }, function () {
            alert('Error getAccountDataChangeOrder');
        });
    };

    $scope.getAccountAdditionsTypes = function () {
        var Data = accountDataChangeOrderService.GetAccountAdditionsTypes();
        Data.then(function (addTypes) {
            $scope.additionsTypes = addTypes.data;
                if ($scope.account.AccountType != 116) {
                delete $scope.additionsTypes['16'];
            }

            angular.forEach($scope.additionalDetails, function (value, key) {
                delete $scope.additionsTypes[value.AdditionType];
            });
            if ($scope.AdditionType != undefined) {
                $scope.order.AdditionType = $scope.AdditionType.toString();
            }
            if ($scope.AdditionValue != undefined) {
                $scope.order.AdditionValue = $scope.AdditionValue.toString();
            }
        }, function () {
            alert('Error AccountAdditionsTypes');
        });
    };


    $scope.callbackgetAccountDataChangeOrder = function () {
        $scope.getAccountDataChangeOrder($scope.selectedOrderId);
    };


    $scope.saveAccountAdditionalDataRemovableOrder = function () {
        $scope.order.Type = 124;
        if ($http.pendingRequests.length == 0) {

            if ($scope.order.AdditionValue != null && $scope.order.AdditionValue != undefined) {
                $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնել հաշվի տվյալները' })
                .then(function () {
                    showloading();
                    $scope.order.DataChangeAccount = ($scope.account != undefined) ? $scope.account : (($scope.$parent.account == undefined) ? $scope.Account : $scope.$parent.account);
                    $scope.order.AdditionalDetails.AdditionType = $scope.order.AdditionType;
                    $scope.order.AdditionalDetails.AdditionValue = $scope.order.AdditionValue;
                    $scope.order.SubType = 1;

                    var Data = accountDataChangeOrderService.saveAccountAdditionalDataRemovableOrder($scope.order);
                    Data.then(function (res) {
                        hideloading();

                        if (validate($scope, res.data)) {
                            if (res.data.Errors.length == 0) {
                                if ($scope.callback == undefined) {
                                    //$scope.$parent.getAccountAdditionalDetails($scope.account.AccountNumber);
                                }
                                else {
                                    $scope.callback({ account: $scope.account.AccountNumber });
                                }
                                refresh($scope.order.Type, $scope.order.DataChangeAccount.AccountNumber);
                                ShowToaster('Խմբագրումը կատարված է', 'success');

                                if ($scope.$parent.$parent.isEditStatus != undefined) {
                                    $scope.$parent.$parent.isEditStatus = false;
                                }
                                else {
                                    $scope.$parent.isEdit = false;
                                }
                            }
                            else {
                                if ($scope.callback != undefined) {
                                    $scope.close();
                                }
                                $scope.path = '#Orders';
                                $scope.showError = true;
                                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            }
                        }
                        else {
                            if ($scope.callback == undefined) {
                                $scope.showError = true;
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                            }
                        }
                    }, function () {
                        hideloading();
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                        alert('Error saveAccountDataChangeOrder');
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


}]);