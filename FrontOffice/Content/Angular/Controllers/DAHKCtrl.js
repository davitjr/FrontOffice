app.controller("DAHKCtrl", ['$scope', '$uibModal', '$rootScope', 'DAHKService', 'accountService', 'customerService', function ($scope, $uibModal, $rootScope, DAHKService, accountService, customerService, infoService) {

    $scope.showAllBlockages = false;
    $scope.showAllCollections = false;
    $scope.filterClosed = 1;
    $scope.currentDahkInquests = [];
    $scope.accountNumberChoosed = false;
    $scope.dahkProductAccountsDetails = [];
    $scope.inquestDetailsList = [];

    $scope.searchDAHK = function () {
        $scope.searchDAHKModalInstance = $uibModal.open({
            template: '<searchdahk close="closeSearchDAHKModal()"></searchdahk>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });

        $scope.searchDAHKModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getChoosedInquestDetails = function () {
      
        $scope.inquestDetailsList.length = 0;

        for (var i = 0; i < $scope.currentInquestDetails.length; i++) {
            if ($scope.currentInquestDetails[i].Checked) {
               
                $scope.inquestDetailsList.push({
                    RequestDate: new Date(parseInt($scope.currentInquestDetails[i].RequestDate.substr(6))),
                    MessageID: $scope.currentInquestDetails[i].MessageID,
                    InquestID: $scope.currentInquestDetails[i].InquestID,
                    Amount: ($scope.currentInquestDetails[i].BlockedAmount - $scope.currentInquestDetails[i].FreezedAmount)
                });
                
            }
        }
    };


    $scope.blockingAmountFromAvailableAccount = function (accountNumber, blockingAmount) {
        if (blockingAmount != undefined) {
            if (accountNumber != undefined) {
                if (blockingAmount != 0) {

                    $scope.getChoosedInquestDetails();

                    if ($scope.inquestDetailsList.length != 0) {

                            var Data = DAHKService.blockingAmountFromAvailableAccount(accountNumber, blockingAmount, $scope.inquestDetailsList);
                            Data.then(function (m) {
                                if (validate($scope, m.data)) {

                                    $scope.getCurrentInquestDetails($scope.findCustomerNumber);
                                    showMesageBoxDialog('Սառեցումը կատարված է', $scope, 'information');
                                    $scope.blockingAmount = "";
                                }
                                else {
                                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                                }

                            }, function () {
                                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            });

                    }
                    else {
                        showMesageBoxDialog('Վարույթ ընտրված չէ', $scope, 'error');
                    };
                }
                else {
                    showMesageBoxDialog('Սառեցման գումարը 0 է նշված', $scope, 'error');
                }
            } else {
                    showMesageBoxDialog('Հաշիվ ընտրված չէ', $scope, 'error');
                }
        }
        else {
            showMesageBoxDialog('Գումար նշված չէ', $scope, 'error');
        }
    }

    $scope.getFreezeIdList = function () {
        $scope.freezeIdList = [];
        for (var i = 0; i < $scope.accountFreezeDetails.length; i++)
            if ($scope.accountFreezeDetails[i].Checked) {
                $scope.freezeIdList.push($scope.accountFreezeDetails[i].FreezeID)
            }
    }

    $scope.dateFrom = $scope.$root.SessionProperties.OperationDate;
    $scope.dateTo = $scope.$root.SessionProperties.OperationDate;


    $scope.accounts = function (customerNumber) {
        var Data = DAHKService.getAccounts(customerNumber);
        Data.then(function (acc) {
            $scope.allaccounts = acc.data;
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.choosedAccount = function (accountnumber) {
        $scope.accountNumberFromUser = '';
        $scope.accountNumberChoosed = true;

        if (accountnumber != undefined) {
            $scope.getDAHKproductAccounts(accountnumber);
        }
    };

    $scope.searchAccountForMakingAvailable = function (accountNumberFromUser) {
        if (accountNumberFromUser != undefined) {
            var isCoincides = false;
            for (const [key] of Object.entries($scope.accountNumbers)) {
                if (accountNumberFromUser == key) {
                    $scope.accountNumber = accountNumberFromUser;
                    $scope.accountNumberChanged(accountNumberFromUser);
                    isCoincides = true;
                }
            }
            if (isCoincides == false) {
                var transitAccount = 0;

                var Data = DAHKService.getTransitAccountNumberFromCardAccount(accountNumberFromUser);
                Data.then(function (acc) {
                    transitAccount = acc.data;

                    if (transitAccount != 0) {
                        $scope.accountNumber = transitAccount.toString();
                        $scope.accountNumberChanged(transitAccount);
                        isCoincides = true;
                    }
                }, function () {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    });

                if (isCoincides == false) {
                    $scope.accountNumber = '';
                    $scope.accountNumberChoosed = false;
                }
            }

        }
    };

    $scope.searchAccount = function (accountNumberFromUser) {
        if (accountNumberFromUser != undefined) {
            var isCoincides = false;
            for (const [key] of Object.entries($scope.allaccounts)) {
                if (accountNumberFromUser == key) {
                    $scope.accountNumber = accountNumberFromUser;
                    $scope.choosedAccount (accountNumberFromUser);
                    isCoincides = true;
                }               
            }
            if (isCoincides == false) {
                $scope.accountNumber = '';
            }
           
        }
    };

    $scope.getAccountStatement = function (accountnumber) {
        var dahkProductAccountsDetail = [];  
        $scope.dahkProductAccountsDetails.length = 0; 

        var Data = accountService.getAccountStatement(accountnumber, $scope.dateFrom, $scope.dateTo);
        Data.then(function (accStatement) {                    
            $scope.accountStatement = accStatement.data;

            dahkProductAccountsDetail.push(accountnumber, $scope.accountStatement.SyntheticTypeOfAccount, $scope.accountStatement.InitialBalanceString, $scope.accountStatement.TotalDebitAmountString, $scope.accountStatement.TotalCreditAmountString, $scope.accountStatement.FinalBalanceString);
            $scope.dahkProductAccountsDetails.push(dahkProductAccountsDetail);

        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.makeAvailable = function (availableAmount) {
        if (availableAmount != 0 && availableAmount != undefined) {

                $scope.getFreezeIdList();

                //if ($http.pendingRequests.length == 0) {
                var Data = DAHKService.makeAvailable($scope.freezeIdList, availableAmount);
                Data.then(function (m) {
                    if (validate($scope, m.data)) {
                        //CloseBPDialog('amountavailabilitysetting');
                        $scope.accountNumberChanged($scope.accountNumber);
                        $scope.availableAmount = "";
                    }
                    else {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }

                }, function () {                    
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                 
                });

                //}
                //else {
                //    return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Կատարել>> կոճակը:', 'error');
                //    }
            }
            else {
                showMesageBoxDialog('Հասանելի դարձվող գումարը 0 է', $scope, 'information');
            }
        }

    $scope.closeSearchDAHKModal = function () {
        $scope.searchDAHKModalInstance.close();
    };

    $scope.getFreezedAccounts = function (customerNumber) {
        var Data = DAHKService.getFreezedAccounts(customerNumber);
        Data.then(function (acc) {
            $scope.accountNumbers = acc.data;

        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    var checkedAvailableAmount = 0;
    var forCheckBlockingAmount = 0;
    var checkedCurrency = "";
    var checksCount = 0;
    //var inquestChecksCount = 0;

    $scope.ifCheckedInquest = function (isChecked, currency) {
        if (isChecked == true) {
           // inquestChecksCount = inquestChecksCount + 1;

            //if (inquestChecksCount > 1) {
            //    this.attachDetails.Checked = false;
            //    showMesageBoxDialog('Մեկից ավել վարույթ չեք կարող ընտրել', $scope, 'error');
            //    inquestChecksCount = 1;
            //}            

                if (checkedCurrency != "" && checkedCurrency != currency) {
                    this.attachDetails.Checked = false;
                    showMesageBoxDialog('Ընտրված են տարբեր արժույթներ', $scope, 'error');
                }
                else {
                    checkedCurrency = currency;
                    forCheckBlockingAmount += freezedAmount;
                    checksCount = checksCount + 1;
                }
            }
            else {
                checksCount = checksCount - 1;

            if (checksCount == 0) { checkedCurrency = "" };

                forCheckBlockingAmount -= freezedAmount;
            }     

    };

    $scope.ifCheckedFreezedAmount = function (isChecked, freezedAmount, currency) {

        if (isChecked == true) {
            
            if (checkedCurrency != "" && checkedCurrency != currency) {
                this.freezeDetail.Checked = false;
                showMesageBoxDialog('Ընտրված են տարբեր արժույթներով սառեցումներ', $scope, 'error');
            }
            else {
                checkedCurrency = currency;
                checkedAvailableAmount += freezedAmount;
                checksCount = checksCount + 1;
            }
        }
        else {
            checksCount = checksCount - 1;
            if (checksCount == 0) { checkedCurrency =""}
            checkedAvailableAmount -= freezedAmount;
        };

        checkedAvailableAmount = Math.round((checkedAvailableAmount + Number.EPSILON) * 100) / 100;

        $scope.availableAmount = checkedAvailableAmount;

        if ((checkedAvailableAmount == 0) || (checkedAvailableAmount == freezedAmount) || checksCount == 1) {
            document.getElementById("Amount").disabled = false;
        }
        else {
            document.getElementById("Amount").disabled = true;
        }

    };


    $scope.getDahkDetails = function()
    {
        if ($scope.$root.SessionProperties.IsNonCustomerService == false) {
            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (cust) {
                $scope.findCustomerNumber = cust.data;
                $scope.dahkCustomer = $scope.findCustomerNumber;

                $scope.getInquestCodes();
            }, function () {
                alert('Error getDahkDetails');
            });
        }
        else
        {
            $scope.dahkBlockages = [];
            $scope.dahkCollections = [];
            $scope.dahkEmployers = [];
            $scope.dahkAmountTotals = [];   
          
        }
    }

    $scope.getInquestCodes = function () {
        $scope.getDahkBlockages($scope.findCustomerNumber);
    };

    $scope.getCurrentInqestCodes = function () {
        $scope.currentDahkInquests.length = 0;  
        for (i = 0; i < $scope.dahkBlockages.length; i++) {
            if ($scope.dahkBlockages[i].ShowPriority != 0) {
                $scope.currentDahkInquests.push($scope.dahkBlockages[i])              
            }            
        }
    };

    $scope.getDahkBlockages = function (customerNumber) {
        var Data = DAHKService.getDahkBlockages(customerNumber);
        Data.then(function (acc) {           
            $scope.dahkBlockages = acc.data;           
            $scope.getCurrentInqestCodes();
            
        }, function () {
            $scope.loading = false;
                alert('Error getDahkBlockages');
            });
    };

    $scope.getDahkCollections = function (customerNumber) {
        var Data = DAHKService.getDahkCollections(customerNumber);
        Data.then(function (acc) {
            $scope.dahkCollections = acc.data;
        }, function () {
            $scope.loading = false;
            alert('Error getDahkCollections');
        });
    };

    $scope.getCurrentInquestDetails = function (customerNumber) {
        var Data = DAHKService.getCurrentInquestDetails(customerNumber);
        Data.then(function (details) {
            $scope.currentInquestDetails = details.data;
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.getAccountFreezeDetails = function (customerNumber) {
        var Data = DAHKService.getAccountFreezeDetails(customerNumber, $scope.inquestCodeFiltered != undefined ? $scope.inquestCodeFiltered.InquestCode : "", $scope.accountNumber != undefined ? $scope.accountNumber : "");
        Data.then(function (freezeDetails) {
            $scope.accountFreezeDetails = freezeDetails.data;
           
            checkedAvailableAmount = 0;
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.inquestCodeValueChange = function () {
        $scope.getDahkEmployers($scope.findCustomerNumber, $scope.filterClosed);
    }

    $scope.getDAHKproductAccounts = function (accountnumber) {      
        var Data = DAHKService.getDAHKproductAccounts(accountnumber);
        Data.then(function (acc) {
            $scope.dahkProductAccounts = acc.data;

            $scope.dahkProductAccounts.forEach(function (account) {
                $scope.getAccountStatement(account);                 
            });
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };


    $scope.accountNumberChanged = function (accountnumber) {
        if ($scope.accountNumber != undefined) {
            $scope.accountNumberChoosed = true;
            $scope.getDahkDetails();
            $scope.getDAHKproductAccounts(accountnumber);            

        }
        $scope.filter();
    }

    $scope.filter = function () {
        $scope.getAccountFreezeDetails($scope.findCustomerNumber);
    }

    $scope.getDahkEmployers = function (customerNumber, quality) {
        var Data = DAHKService.getDahkEmployers(customerNumber, quality, $scope.inquestCodeFiltered != undefined ? $scope.inquestCodeFiltered.InquestCode : "");
        Data.then(function (acc) {
            $scope.dahkEmployers = acc.data;
        }, function () {
            $scope.loading = false;
            alert('Error getDahkEmployers');
        });
    };

    $scope.getDahkAmountTotals = function (customerNumber) {
        var Data = DAHKService.getDahkAmountTotals(customerNumber);
        Data.then(function (acc) {
            $scope.dahkAmountTotals = acc.data;
        }, function () {
            $scope.loading = false;
            alert('Error getDahkAmountTotals');
        });
    };


    $scope.QualityFilterEmployers = function () {
        $scope.getDahkEmployers($scope.findCustomerNumber, $scope.filterClosed);
    }


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
        $scope.findCustomerNumber = customer.customerNumber;
        $scope.closeSearchCustomersModal();
   };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };


    $scope.getAuthorizedCustomerNumber = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function(user) {
            $scope.findCustomerNumber = user.data;
        });
    };


    $scope.getAllDahkDetails = function () {
        $scope.dahkCustomer = $scope.findCustomerNumber;
    };
    
    $scope.showOnlyActiveBlockages = function () {
        return function (blockage) {
            if (!$scope.showAllBlockages)
            {
                if (blockage.ShowPriority == 1 || blockage.ShowPriority == 2)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return true;
            }
        }
    };

    $scope.showOnlyActiveCollections = function () {
        return function (collection) {
            if (!$scope.showAllCollections) {
                if (collection.ShowPriority == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
    };

}]);