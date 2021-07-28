﻿app.controller("CredentialCtrl", ['$scope', 'credentialService', 'credentialOrderService', '$location', '$confirm', 'dialogService', 'infoService', '$http', '$filter', 'paymentOrderService', 'feeForServiceProvidedOrderService', '$uibModal', 'customerService', 'casherService', 'ReportingApiService', function ($scope, credentialService, credentialOrderService, $location, $confirm, dialogService, infoService, $http, $filter, paymentOrderService, feeForServiceProvidedOrderService, $uibModal, customerService, casherService, ReportingApiService) {
    $scope.filter = 1;
  
    $scope.QualityFilter = function () {

        //$scope.selectedRow = null;
        //$scope.selectedRowClose = null;
        //$scope.selectedAccountNumber = null;
        $scope.getCredentials();
    }

    $scope.printCustomerCredentialApplication = function (myindex) {       
        if ($scope.credentials != null && $scope.credentials[myindex].AssigneeList != null)
        {
            showloading();
            var Data = credentialService.printCustomerCredentialApplication($scope.credentials[myindex].AssigneeList[0].CustomerNumber, $scope.credentials[myindex].Id);
            ShowPDF(Data);
        }        
    };

    $scope.saveCredentialTerminationOrder = function (myindex) {
        if ($http.pendingRequests.length == 0) {
                 if ($scope.credential != null) {
                     showloading();
                     var Data = credentialOrderService.saveCredentialTerminationOrder($scope.credential);
                 }
                 Data.then(function (res) {
                     hideloading();
                     if (validate($scope, res.data)) {
                         $scope.path = '#Orders';
                         CloseBPDialog('credentialTermination');
                         showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                         refresh(130);
                     }
                     else {
                         $scope.showError = true;
                         showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                         refresh(130);
                     }

                 }, function () {
                     hideloading();
                     showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                     alert('Error saveCredentialTerminationOrder');
                 });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.saveCredentialDeleteOrder = function (credential) {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ տվյալ լիազորագիրը' })
             .then(function () {
            if (credential != null) {
                showloading();
                var Data = credentialOrderService.saveCredentialDeleteOrder(credential);
            }
            Data.then(function (res) {
                hideloading();
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(130);
                }
                else {
                    $scope.showError = true;
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    refresh(130);
                }

            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveCredentialTerminationOrder');
            });
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getCredentialClosingWarnings = function () {
        var Data = credentialOrderService.GetCredentialClosingWarnings($scope.credential.Id);
        Data.then(function (war) {
            $scope.warnings = war.data;
        }, function () {
            alert('Warnings Error');
        });
    };

    //Լիազորագրի փակման պատճառները
    $scope.getCredentialClosingReasons = function () {
        var Data = infoService.GetCredentialClosingReasons();
        Data.then(function (acc) {
            $scope.credentialClosingReasons = acc.data;
        }, function () {
            alert('getCredentialClosingReasons Error');
        });
    };
    
    //To Get All Records  
    $scope.getCredentials = function () {        
        $scope.loading = true;
        var Data = credentialService.getCredentials($scope.filter);
        Data.then(function (cred) {
            if ($scope.filter == 1) {
                $scope.credentials = cred.data;
                if ($scope.credentials != null)
                {
                    for (j = 0; j < $scope.credentials.length; j++) {
                        if ($scope.credentials[j].AssigneeList != null) {
                            for (i = 0; i < $scope.credentials[j].AssigneeList.length; i++) {
                                $scope.credentials[j].EndDateView = $scope.credentials[j].EndDate;
                                $scope.credentials[j].EndDate = $filter('mydate')($scope.credentials[j].EndDate, "dd/MM/yyyy");
                                var opList = $scope.credentials[j].AssigneeList[i].OperationList;
                                var groupList = [];
                                $.each(opList, function (i, el) {    
                                    var isEqual = false;
                                    $.each(groupList, function (k, en) {
                                        if (el.GroupId === en.GroupId) {
                                            isEqual = true;
                                            return false;
                                        }
                                    });
                                    if (isEqual === false)
                                    {
                                        var GroupId = { GroupId: el.GroupId, Description: el.OperationGroupTypeDescription };
                                        groupList.push(GroupId);
                                    }
                                });
                                var result = opList.filter(function (obj) {
                                    return obj.b == 6;
                                });
                                $scope.credentials[j].AssigneeList[i].GroupList = groupList;
                            }
                        }
                    }
                }
                
                $scope.closingCredentials = [];
            }
            else if ($scope.filter == 2) {
                
                $scope.closingCredentials = cred.data;
                
                if ($scope.closingCredentials != null) {
                    for (j = 0; j < $scope.closingCredentials.length; j++) {
                        if ($scope.closingCredentials[j].AssigneeList != null) {
                            for (i = 0; i < $scope.closingCredentials[j].AssigneeList.length; i++) {
                                var opList = $scope.closingCredentials[j].AssigneeList[i].OperationList;
                                var groupList = [];
                                $.each(opList, function (i, el) {
                                    var isEqual = false;
                                    $.each(groupList, function (k, en) {
                                        if (el.GroupId === en.GroupId) {
                                            isEqual = true;
                                            return false;
                                        }
                                    });
                                    if (isEqual === false) {
                                        var GroupId = { GroupId: el.GroupId, Description: el.OperationGroupTypeDescription };
                                        groupList.push(GroupId);
                                    }
                                });
                                var result = opList.filter(function (obj) {
                                    return obj.b == 6;
                                });
                                $scope.closingCredentials[j].AssigneeList[i].GroupList = groupList;
                            }
                        }
                    }
                }
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getCredentials');
        });
    };

    $scope.callbackgetCredentials = function () {
        $scope.getCredentials();
    }


    $scope.initCredentialActivationOrder = function ()
    {
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.Credential = angular.copy($scope.currentCredential);
        $scope.order.Credential.StartDate = $filter('mydate')($scope.order.Credential.StartDate, "dd/MM/yyyy");
        $scope.getFeeAccounts();
        $scope.checkForDebitAccount = 0;
    }

    $scope.getFeeAccounts = function () {
      
            var Data = paymentOrderService.getAccountsForOrder(1, 1, 3);
            Data.then(function (acc) {
                $scope.feeAccounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        
    };


    $scope.getCustomerFilialCode = function () {
        var Data = customerService.getCustomerFilialCode();
        Data.then(function (cust) {
            $scope.customerFilialCode = cust.data;
        }, function () {
            alert('Error getCustomerFilialCode');
        });
    };

    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (cust) {
            $scope.userFilialCode = cust.data;
        }, function () {
            alert('Error getUserFilialCode');
        });
    };

    $scope.getFee = function () {
        if ($scope.order.Credential.GivenByBank == true) {
            var orderType = 72;
            if ($scope.checkForDebitAccount == 0) {
                orderType = 71;
            }
            var Data = feeForServiceProvidedOrderService.getFee(orderType, 215);
            Data.then(function (fee) {
                $scope.order.Amount = fee.data;
            }, function () {
                alert('Error getfee');
            });
        }
        else
        {
            $scope.order.Amount = 0;
        }
    };

    $scope.$watch('checkForDebitAccount', function (newValue, oldValue) {

        if (newValue != undefined) {
            $scope.getFee();
        }

    });


    $scope.initAssigneeIdentificationOrder = function () {
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.Credential = angular.copy($scope.currentCredential);
    }


    $scope.saveAssigneeIdentificationOrder = function (myindex) {
        if ($http.pendingRequests.length == 0) {
            if ($scope.order != null) {
                showloading();
                $scope.order.Type = 170;
                $scope.order.SubType = 1;
                var Data = credentialOrderService.saveAssigneeIdentificationOrder($scope.order);
            }
            Data.then(function (res) {
                hideloading();
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    CloseBPDialog('assigneeIdentificationOrder');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh(130);
                }
                else {
                    $scope.showError = true;
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    refresh(130);
                }

            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAssigneeIdentificationOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.searchCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });

        $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getSearchedCustomer = function (customer) {
        $scope.order.Credential.AssigneeList[0].CustomerNumber = customer.customerNumber;
        $scope.customerNumber = customer.customerNumber;
        $scope.closeSearchCustomersModal();
    };

    $scope.addCustomer = function (customerNumber) {
        $scope.alert = "";
        $scope.order.Credential.AssigneeList = $scope.order.Credential.AssigneeList || [];
        if (customerNumber == undefined) {
            return $scope.alert = "Կատարեք հաճախորդի որոնում";
        }
        else if (customerNumber.length != 12) {
            return ShowMessage('Հաճախորդի համարը պետք է լինի 12 նիշ', 'error');
        }

        var Data = customerService.getCustomerType(customerNumber);
        var custType = Data.data;
        Data.then(function (cust) {
            custType = cust.data;
            if (custType != 6) {
                return $scope.alert = "Կարող եք ավելացնել միայն ֆիզիկական անձ տեսակով հաճախորդ";
            }

           
            $scope.order.Credential.AssigneeList[0].CustomerNumber = customerNumber;
            $scope.getCustomer(customerNumber);
         

        }, function () {
            return $scope.alert = "Հաճախորդը գտնված չէ";
        });




    };



    $scope.getCustomer = function (customerNumber) {
        var Data = customerService.getCustomer(customerNumber);
        Data.then(function (cust) {
            $scope.FirstName = cust.data.FirstName;
            $scope.LastName = cust.data.LastName;
            $scope.Passport = cust.data.PassportNumber + ',' + cust.data.PassportGivenBy + ',' + cust.data.PassportGivenDate;
        }, function () {
            alert('Error');
        });
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };

    

    $scope.getCredentialActivationOrder = function (orderId) {
        var Data = credentialService.getCredentialActivationOrder(orderId);
        Data.then(function (dep) {
            $scope.order = dep.data;
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getDepositDataChangeOrder');
        });
    };


    $scope.saveCredentialActivationOrder = function () {
        if ($scope.checkForDebitAccount == 1) {
            $scope.order.Type = 169;
        }
        else
        {
            $scope.order.Type = 168;
        }
        $scope.order.SubType = 1;

        if ($http.pendingRequests.length == 0) {
            document.getElementById("credentialActivationOrderLoad").classList.remove("hidden");
            var Data = credentialService.saveCredentialActivationOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("credentialActivationOrderLoad").classList.add("hidden");
                    CloseBPDialog('credentialActivationOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("credentialActivationOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("credentialActivationOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveCredentialActivationOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }


    //Վճարման հանձնարարականի տպում
    $scope.getFeeForCredentialActivationOrderDetails = function (isCopy) {
        showloading();
        $scope.order.Currency = $scope.order.DebitAccount.Currency;
        if (isCopy == undefined)
            isCopy = false;

        var Data = credentialService.getFeeForCredentialActivationOrderDetails($scope.order, isCopy);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
            alert('Error getFeeForCredentialActivationOrderDetails');
        });

    };


}]);