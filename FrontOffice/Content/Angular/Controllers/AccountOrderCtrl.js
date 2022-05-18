app.controller("AccountOrderCtrl", ['$scope', 'accountOrderService', 'customerService', 'infoService', 'dialogService', '$uibModal', '$http','$confirm', function ($scope, accountOrderService, customerService, infoService, dialogService, $uibModal, $http,$confirm) {

    $scope.order = {};
    $scope.order.JointCustomers = [];
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.SubType = 1;

    $scope.confirm = false;
    //Հաշվի բացման պահպանում և հաստատում
    $scope.saveAccountOrder = function () {
        if ($http.pendingRequests.length == 0) {

            if ((($scope.order.JointCustomers.length != 0 && ($scope.order.AccountType == 2 || $scope.order.AccountType == 3)) || $scope.order.AccountType == 1)
            && !($scope.order.RestrictionGroup == 1 && $scope.order.BankruptcyManager == undefined)) {
                if ($scope.order.StatementDeliveryType == undefined) {
                    $scope.order.StatementDeliveryType = -1;
                }

                if ($scope.customertype == 6) {
                    $scope.order.AccountStatus = "0";
                }

                if ($scope.order.AccountType == 1) {
                    $scope.order.Type = 7;
                }
                else if ($scope.order.AccountType == 2) {
                    $scope.order.Type = 28;
                }
                else {
                    $scope.order.Type = 17;
                }

                
                document.getElementById("accountLoad").classList.remove("hidden");
                var Data = accountOrderService.saveAccountOrder($scope.order, $scope.confirm);
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        document.getElementById("accountLoad").classList.add("hidden");
                        CloseBPDialog('newaccount');
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh(7);
                    }
                    else {
                        document.getElementById("accountLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել',
                            $scope,
                            'error',
                            $confirm,
                            $scope.saveAccountOrder);
                    }

                }, function (err) {
                    document.getElementById("accountLoad").classList.add("hidden");
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error saveAccount');
                });
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };
    $scope.getAccountOrder = function (orderId) {
        var Data = accountOrderService.GetAccountOrder(orderId);
        Data.then(function (acc) {
            if (acc.data.AccountType == 2) {
                $scope.AccountType = "Համատեղ";
            }
            else if (acc.data.AccountType == 3) {
                $scope.AccountType = "Հօգուտ երրորդ անձի";
            }
            else
                $scope.AccountType = "Անհատական";            
            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountOrder');
        });
    };
    //Արժույթները
    $scope.getCurrentAccountCurrencies = function () {
        var Data = infoService.getCurrentAccountCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.searchCustomers = function (isBankrupt) {
        $scope.searchCustomersModalInstance = $uibModal.open({ template: '<searchcustomer callback="getSearchedCustomer('+(isBankrupt==true?'true,':'false,')+'customer)" close="closeSearchCustomersModal()"></searchcustomer>',
                                                            scope: $scope,
                                                            backdrop: true,
                                                            backdropClick: true,
                                                            dialogFade: false,
                                                            keyboard: false,
                                                            backdrop: 'static', });

        $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getSearchedCustomer = function (isBankrupt, customer) {
        if (isBankrupt) {
            $scope.bankruptcyCustomerNumber = customer.customerNumber;
        }
        $scope.order.jointCustomerNumber = customer.customerNumber;
        $scope.closeSearchCustomersModal();        
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };


    $scope.inputBankruptcyManager = function (bankruptcyCustomerNumber){
        var Data = customerService.GetIdentityId(bankruptcyCustomerNumber);
        Data.then(function (IdentityId) {
            $scope.identityId = IdentityId.data;
         
            $scope.addBankruptcyManager(bankruptcyCustomerNumber);
            if (bankruptcyCustomerNumber.length == 12 && $scope.identityId != 0) {
                $scope.disable = true;
            }
        }, function () {
            alert('Error');
        });
    };

    $scope.addBankruptcyManager = function (bankruptcyCustomerNumber)
    {
        $scope.alert = "";
        if (bankruptcyCustomerNumber == null ) {
            return $scope.alert = "Կատարեք հաճախորդի որոնում";
        }
        else if (bankruptcyCustomerNumber.length != 12) {
            return $scope.alert = "Հաճախորդի համարը պետք է լինի 12 նիշ";
        }
        else if ($scope.identityId == 0 && $scope.order.RestrictionGroup == 1) {
            return $scope.alert = "Հաճախորդը գտնված չէ";
        }
     
        $scope.order.BankruptcyManager = bankruptcyCustomerNumber;
    };

    $scope.deleteBankruptcyManager = function () {
        $scope.order.BankruptcyManager = undefined;
        $scope.disable = false;
    };



    $scope.inputJointCustomer = function (jointCustomerNumber) {        
        var Data = customerService.GetIdentityId(jointCustomerNumber);
        Data.then(function (IdentityId) {
            $scope.identityId = IdentityId.data;
            $scope.addJointCustomer(jointCustomerNumber);
        }, function () {
            alert('Error');
        });        
    };

    $scope.addJointCustomer = function (jointCustomerNumber) {
        $scope.alert = "";
        if (jointCustomerNumber == undefined) {
            return $scope.alert = "Կատարեք հաճախորդի որոնում";
        }
        else if (jointCustomerNumber.length != 12) {
            return $scope.alert = "Հաճախորդի համարը պետք է լինի 12 նիշ";
        }
        else if ($scope.order.JointCustomers.length >= 2 && $scope.order.AccountType == 2) {
            return $scope.alert = "3 և ավելի հաճախորդների համար համատեղ հաշվի բացում նախատեսված չէ";
        }
        else if ($scope.order.JointCustomers.length >= 1 && $scope.order.AccountType == 3) {
            return $scope.alert = "2 և ավելի ավելի հաճախորդների համար հօգուտ երրորդ անձի հաշվի բացում նախատեսված չէ";
        }
        else if ($scope.identityId == 0 && $scope.order.AccountType == 2) {
            return $scope.alert = "Համատեղ հաճախորդը գտնված չէ";
        }
        else if ($scope.identityId == 0 && $scope.order.AccountType == 3) {
            return $scope.alert = "Հօգուտ երրորդ անձի հաճախորդը գտնված չէ";
        }
        else {
            for (var i = 0; i < $scope.order.JointCustomers.length; i++) {
                if ($scope.order.JointCustomers[i].Key == jointCustomerNumber) {
                    return $scope.alert = "Տվյալ հաճախորդը արդեն ներառված է";
                }
            }
        }        
        var jointCustomer = {};
        jointCustomer.Key = jointCustomerNumber;
        jointCustomer.Value = "";
        $scope.order.JointCustomers.push(jointCustomer);
        $scope.order.jointCustomerNumber = undefined;
    };

    $scope.deleteClickedColumn = function (index) {
        $scope.order.JointCustomers.splice(index, 1);
    };

    //$scope.getStatementDeliveryTypes = function () {
    //    var Data = infoService.GetStatementDeliveryTypes();
    //    Data.then(function (delTypes) {
    //        $scope.deliveryTypes = delTypes.data;
    //    }, function () {
    //        alert('Error StatementDeliveryTypes');
    //    });
    //};

    $scope.getAccountOpenWarnings = function () {
        var Data = accountOrderService.GetAccountOpenWarnings();
        Data.then(function (acc) {
            $scope.warnings = acc.data;
        }, function () {
            alert('Warnings Error');
        });
    };

    $scope.getCustomerType = function () {        
        var Data = customerService.getCustomerType();
        Data.then(function (cust) {           
            $scope.customertype = cust.data;
            if ($scope.customertype != 6) {
                $scope.order.AccountType = '1';
                $scope.order.AccountStatus = "1";
            }
            else if ($scope.order.AccountType==3)
            {
                $scope.order.AccountStatus = "0";
                if ($scope.order.JointCustomers.length >= 2) $scope.order.JointCustomers = [];
            }
        }, function () {
            alert('Error');
        });
    };

    $scope.GetAccountStatuses = function () {
        var Data = infoService.GetAccountStatuses();
        Data.then(function (accStatuses) {
            $scope.accountStatuses = accStatuses.data;
        }, function () {
            alert('Error AccountStatuses');
        });
    };

    $scope.callbackgetAccountOrder = function () {
        $scope.getAccountOrder($scope.selectedOrderId);
    };


    //$scope.hasBankruptCustomers = function () {
    //    var Data = accountOrderService.hasBankruptCustomers();
    //    var  flag = false  ;
    //    Data.then(function (bankrupt) {
    //        if (bankrupt.data== 'true' ) {
    //            flag =  true;
    //        }
    //        return flag;
       
    //    }, function () {
    //        alert('Error hasBankruptCustomers');
    //    });
    //}
    $scope.changeDropdown = function () {
        $scope.order.AccountType = '1';
        $scope.order.JointCustomers = [];

        if ($scope.customertype != 6 && $scope.order.RestrictionGroup == 1 || ($scope.order.RestrictionGroup == 4)) {
            $scope.order.AccountStatus = '0';
        }
        else if ($scope.order.RestrictionGroup == 0 && $scope.customertype != 6) {
            $scope.order.AccountStatus = '1';
        }

        if ($scope.order.RestrictionGroup == 3) {
            $scope.order.AccountType = '1';
            $scope.order.Currency = 'AMD';
        }
    }

        $scope.getAccountRestrictionGroups = function () {  
            var Data = infoService.getAccountRestrictionGroups();
            Data.then(function (acc) {
                $scope.accountRestrictionGroups = acc.data;
                $scope.order.RestrictionGroup = '0';
            }, function () {
                alert('Error AccountRestrictionGroups');
            });
    };

 
}]);