app.controller("CredentialOrderCtrl", ['$scope', 'credentialOrderService', 'infoService', '$location', 'dialogService', '$uibModal', 'customerService', 'orderService', '$filter', '$http', function ($scope, credentialOrderService, infoService, $location, dialogService, $uibModal, customerService, orderService, $filter, $http) {

    $scope.getDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $scope.date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $scope.SignatureTypes = { 1: "I կարգ", 2: "II կարգ" };
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.checkAllOperations;
    $scope.customertype = $scope.$root.SessionProperties.CustomerType;
    $scope.order.Credential = {};
    $scope.order.Credential.StartDate = $scope.$root.SessionProperties.OperationDate;
 
    $scope.order.OrderNumber = '';
    $scope.selectedRow = null;
    
    //Լիազորագրի հայտի պահպանում և հաստատում
    $scope.saveCredentialOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("credentialLoad").classList.remove("hidden");
            var Data = credentialOrderService.saveCredentialOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("credentialLoad").classList.add("hidden");
                    CloseBPDialog('newCredential');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    if ($scope.callback != undefined) {
                        $scope.callback();
                    }
                }
                else {
                    document.getElementById("credentialLoad").classList.add("hidden");
                    $scope.dialogId = 'newCredential';
                    $scope.divId = 'CredentialOrderForm';
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("credentialLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveCredential');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };    

    $scope.credentialTypeChange = function () {
        $scope.order.Credential.AssigneeList = [];
        $scope.checkAllOperations = false;
        if ($scope.order.Credential.CredentialType == 2)
        {
            $scope.order.Credential.StartDate = $scope.$root.SessionProperties.OperationDate;
            $scope.order.Credential.EndDate = $scope.$root.SessionProperties.OperationDate;
        }
        $scope.order.Credential.GivenByBank = false;
    }

    $scope.getCredentialOrder = function (orderId) {
        var Data = credentialOrderService.GetCredentialOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;

            if ($scope.order.Credential != null) {
                if ($scope.order.Credential.AssigneeList != null) {
                    for (i = 0; i < $scope.order.Credential.AssigneeList.length; i++) {
                        var opList = $scope.order.Credential.AssigneeList[i].OperationList;
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
                        $scope.order.Credential.AssigneeList[i].OperationGroupList = groupList;
                    }
                }               
            }

        }, function () {
            alert('Error getCredentialOrder');
        });
    };

    $scope.InitAllOperations = function (orderId) {
        if ($scope.order.Credential.AssigneeList == null || $scope.order.Credential.AssigneeList.length == 0)
        {
            $scope.checkAllOperations = false;
            return $scope.alert = "Լիազորված անձ մուտքագրված չէ";
        }

        var Data = credentialOrderService.GetAllOperations();
        Data.then(function (acc) {
            if ($scope.checkAllOperations == true)
            {
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList = acc.data;
                
                var opList = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList;
                var groupList = [];
                $.each(opList, function (i, el) {
                    var isEqual = false;
                    el.Checked = true;
                    $.each(groupList, function (k, en) {
                        if (el.GroupId === en.GroupId) {
                            isEqual = true;
                            return false;
                        }
                    });
                    if (isEqual === false) {
                        var GroupId = { GroupId: el.GroupId, Description: el.OperationGroupTypeDescription, Checked: true };
                        groupList.push(GroupId);
                    }
                });
                var result = opList.filter(function (obj) {
                    return obj.b == 6;
                });                            
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList = groupList;

                $scope.selectedRowAssigneeOpGroup = 0;
                $scope.selectedGroupId = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList[$scope.selectedRowAssigneeOpGroup].GroupId;
                
            }
            else
            {
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList = [];
                var groupList = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList;
                $.each(groupList, function (k, en) {
                    en.Checked = false;
                });
            }
        }, function () {
            alert('Error GetAllOperations');
        });
    };

    //Լիազորագրի տեսակները
    $scope.getCredentialTypes = function () {
        var Data = infoService.GetCredentialTypes($scope.customertype);
        Data.then(function (acc) {
            $scope.credentialTypes = acc.data;            
        }, function () {
            alert('getCredentialTypes Error');
        });
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
            return ShowMessage('Հաճախորդի համարը պետք է լինի 12 նիշ','error');
        }        
        else {
            for (var i = 0; i < $scope.order.Credential.AssigneeList.length; i++) {
                if ($scope.order.Credential.AssigneeList[i].CustomerNumber == customerNumber) {
                    return $scope.alert = "Տվյալ հաճախորդը արդեն ներառված է";
                }
            }
        }
        
      
        var Data = customerService.getCustomerType(customerNumber);
        var custType = Data.data;
        Data.then(function (cust) {
            custType = cust.data;
            if (custType != 6) {
                return $scope.alert = "Կարող եք ավելացնել միայն ֆիզիկական անձ տեսակով հաճախորդ";
            }

            $scope.Assignee = { CustomerNumber: customerNumber, SignatureType: "", IsEmployee: 0 };
            if ($scope.order.Credential.AssigneeList.length > 0) $scope.order.Credential.AssigneeList = [];
            $scope.checkAllOperations = false;
            $scope.order.Credential.AssigneeList.push($scope.Assignee);

            $scope.selectedRowAssignee = 0;
            if ($scope.order.Credential.Id == null && $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList == null) {
                var Data = credentialOrderService.InitOperationGroupList($scope.customertype, $scope.order.Credential.CredentialType);
                Data.then(function (acc) {
                    $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList = acc.data;

                }, function () {
                    alert('Error InitOperationGroupList');
                });
            }

        }, function () {
            return $scope.alert = "Հաճախորդը գտնված չէ";
        });
        
        
        
        
    };




    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };

    $scope.setClickedRowAssignee = function (index) {
       
        $scope.selectedRowAssignee = index;
    };

    $scope.setClickedRowAssigneeOpGroup = function (index) {
       
        if ($scope.selectedRowAssigneeOpGroup != index)
        {
            $scope.selectedRowAssigneeOperation = -1;
        }
        $scope.selectedRowAssigneeOpGroup = index;
        $scope.selectedGroupId = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList[index].GroupId;

    };

    $scope.setClickedRowAssigneeOperation = function (index) {
       
        $scope.selectedRowAssigneeOperation = index;        
    };
    
    $scope.ChangeOpGroup = function (index) {
       
        if ($scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList[index].Checked == true)
        {
            var Data = credentialOrderService.InitAssigneeOperationTypes($scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList[index].GroupId, $scope.customertype, $scope.order.Credential.CredentialType);
            Data.then(function (acc) {
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList || [];                
                var arr = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList.concat(acc.data);
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList = arr;               
                
            }, function () {
                alert('Error ChangeOpGroup');
            });
        }
        else
        {
            var array = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList;
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i].GroupId === $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationGroupList[index].GroupId) {
                    array.splice(i, 1);
                }
            }
            $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList = array;
        }
    };

    $scope.ChangeOpType = function (index) {
       
        
        if ($scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Checked == true) {
            var opType = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].OperationType;
            if (opType === 16 || opType === 17){
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].AllAccounts = true;
            }
            var Data = credentialOrderService.InitAccounts($scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].OperationType);
            Data.then(function (acc) {
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts || [];
                var arr = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts.concat(acc.data);
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts = arr;

            }, function () {
                alert('Error ChangeOpGroup');
            });
        }
        else {
            $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].AllAccounts = false;
            var array = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts;
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i].OperationType === $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].OperationType) {
                    array.splice(i, 1);
                }
            }
            $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts = array;            
        }
    };

    $scope.ChangeAllAccount = function (index) {
       
        if ($scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].AllAccounts == 0) {
            var Data = credentialOrderService.InitAccounts($scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].OperationType);
            Data.then(function (acc) {
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts || [];
                var arr = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts.concat(acc.data);
                $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts = arr;
            }, function () {
                alert('Error ChangeOpGroup');
            });
        }
        else {
            var array = $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts;
            for (var i = array.length - 1; i >= 0; i--) {
                if (array[i].OperationType === $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].OperationType) {
                    array.splice(i, 1);
                }
            }
            $scope.order.Credential.AssigneeList[$scope.selectedRowAssignee].OperationList[index].Accounts = array;
        }
    };    


    $scope.getNextCredentialDocumentNumber = function () {
        var Data = credentialOrderService.getNextCredentialDocumentNumber($scope.customertype);
        Data.then(function (acc) {
            $scope.order.Credential.CredentialNumber = acc.data;
        }, function () {
            alert('getNextCredentialDocumentNumber Error');
        });
    };

    $scope.getAssigneeIdentificationOrder = function (orderId) {
        var Data = credentialOrderService.GetAssigneeIdentificationOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;
           

        }, function () {
            alert('Error GetAssigneeIdentificationOrder');
        });
    };


}]);
