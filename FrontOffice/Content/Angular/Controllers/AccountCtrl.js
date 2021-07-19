app.controller("AccountCtrl", ['$scope', 'accountService', 'infoService', '$confirm', 'customerService', '$uibModal', '$http', 'printDocumentsService', '$state', 
    function ($scope, accountService, infoService, $confirm, customerService, $uibModal, $http, printDocumentsService, $state) {
        $scope.filter = 1;
        $scope.selectedAccountNumber = null;
        $scope.AccountNumber = null;
        $scope.isEdit = false;

        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.accountOpendate = new Date();
        $scope.currentOperDay = $scope.$root.SessionProperties.OperationDate.toString('dd/MM/yyyy');

        $scope.getCurrentAccounts = function () {
            $scope.loading = true;

            var Data = accountService.GetCurrentAccounts($scope.filter);
            Data.then(function (acc) {

                if ($scope.filter == 1)
                {
                    $scope.accounts = acc.data;
                    $scope.closedAccounts = [];
                }
                else if ($scope.filter == 2)
                {
                    $scope.closedAccounts = acc.data;
                }
                $scope.setCurrnetAccountsScroll();
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error getCurrentAccounts');
                });
        };

        $scope.getCustomerTransitAccounts = function () {
                $scope.loading = true;
                var Data = accountService.GetCustomerTransitAccounts($scope.filter);
                var CreditData = accountService.GetCreditCodesTransitAccounts($scope.filter);
                Data.then(function (acc) {

                    if ($scope.filter == 1) {
                        $scope.accounts = acc.data;
                        $scope.closedAccounts = [];
                        var accountsQty = $scope.accounts.length;
                        CreditData.then(function (acc) {
                            $scope.tempAccounts = acc.data;
                            for (var i = 0; i < $scope.tempAccounts.length; i++) {
                                $scope.accounts.push($scope.tempAccounts[i]);
                            }
                        });

                    }
                    else if ($scope.filter == 2) {
                        $scope.closedAccounts = acc.data;
                    }
                    $scope.setTransitAccountsScroll()
                    $scope.loading = false;
                }, function () {
                    $scope.loading = false;
                    alert('Error getCustomerTransitAccounts');
                });
        };


        $scope.getAccount = function (accountNumber) {
            $scope.loading = true;
            var Data = accountService.getAccount(accountNumber);
            Data.then(function (acc) {

                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error getAccount');
            });
        };

        $scope.getCurrentAccount = function (accountNumber) {
            if ($scope.account == null || ($scope.account != undefined && $scope.account.ClosingDate == null) || $scope.afterReopen==true) {
                if ($scope.account == null)
                {
                    $scope.loading = true;
                }
                $scope.JointPerson = "";
                var Data = accountService.getCurrentAccount(accountNumber);
                Data.then(function (acc) {
                    $scope.account = acc.data;
                    $scope.AccountNumber = acc.data.AccountNumber;
                    $scope.params = { AccountNumber: acc.data.AccountNumber, account: acc.data };
                    $scope.loading = false;
                }, function () {
                    $scope.loading = false;
                    alert('Error getCurrentAccount');
                });
            }
            else {
                $scope.isClosed = true;
                $scope.params = { AccountNumber: $scope.account.AccountNumber, account: $scope.account };
            }

        };

        $scope.QualityFilter = function () {

            $scope.reOpeningAccounts = [];
            $scope.closingAccounts = [];

            $scope.selectedRow = null;
            $scope.selectedRowClose = null;
            $scope.selectedAccountNumber = null;
            if ($scope.forTransitAccounts) {
                $scope.getCustomerTransitAccounts();
            } else {
                $scope.getCurrentAccounts();
            }
            $scope.isCheckSelectedAccounts = false;
        };

        $scope.setClickedRow = function (index,account) {
            $scope.selectedRow = index;
            $scope.selectedaccount = account;
            $scope.selectedAccountNumber = account.AccountNumber;
            $scope.AccountNumber = account.AccountNumber;
            $scope.selectedRowClose = null;
            $scope.AccountType = account.AccountType;
            $scope.selectedAccountIsAccessible = account.isAccessible;
            $scope.params = { AccountNumber: account.AccountNumber };
            $scope.selectedAccountCurrency = $scope.selectedaccount.Currency;
            $scope.accountFlowDetails = undefined;
            $scope.TypeOfAccount = account.TypeOfAccount;
        };
        $scope.setClickedRowClose = function (index, account) {
            $scope.selectedRowClose = index;
            $scope.selectedAccountNumber = account.AccountNumber;
            $scope.AccountNumber = account.AccountNumber;
            $scope.closedAccount = account;
            $scope.selectedAccountIsAccessible = account.isAccessible;
            $scope.selectedRow = null;
            $scope.accountFlowDetails = undefined;
            $scope.selectedAccountCurrency = account.Currency;
            $scope.TypeOfAccount = account.TypeOfAccount;
        };



        $scope.getAccountJointCustomers = function (accountNumber) {

            var Data = accountService.getAccountJointCustomers(accountNumber);
            Data.then(function (acc) {
                $scope.JointPersons = acc.data;
            }, function () {

                alert('Error getCurrentAccount');
            });
        };

        $scope.getAccountOpenContract = function (accountNumber) {

            var accountNumbers = "";
            if (accountNumber != undefined) {
                accountNumbers = accountNumber;
            }
            else {
                if ($scope.closingAccounts.length == 0) {
                    $scope.noAccountSelected();
                    return;
                }
                for (var i = 0; i < $scope.closingAccounts.length; i++) {
                    if ($scope.closingAccounts[i].AccountType == 54 || $scope.closingAccounts[i].AccountType == 58)
                    { 
                        continue;
                    }
                    accountNumbers += $scope.closingAccounts[i].AccountNumber + ',';
                }
                accountNumbers = accountNumbers.slice(0, -1);
            }
            if ($scope.isAccountsDifferentTypes($scope.closingAccounts))
            {
                showMesageBoxDialog('Հաշիվները տարբեր տեսակի են', $scope, 'information');
                return;
            }
            else if ($scope.isAccountsJointPersonsDifferent($scope.closingAccounts)){
                    if ($scope.closingAccounts[0].JointType == 1)
                    {
                        showMesageBoxDialog('Նշված համատեղ հաշիվների հաճախորդները չեն համընկնում', $scope, 'information');
                    }
                    else if ($scope.closingAccounts[0].JointType == 2) {
                        showMesageBoxDialog('Նշված հօգուտ 3-րդ անձանց հաշիվների հաճախորդները չեն համընկնում', $scope, 'information');
                    }
                    return;
            }
            showloading();
            var Data = accountService.getAccountOpenContract(accountNumbers);
            ShowPDF(Data);
        };

        $scope.getAccountAdditionalDetails = function (accountNumber) {
            var Data = accountService.getAccountAdditionalDetails(accountNumber);
            Data.then(function (acc) {
                $scope.additionalDetails = acc.data;
                $scope.hasStatementDeliveryType = false;
                for (var i = 0; i < $scope.additionalDetails.length; i++) {
                    if ($scope.additionalDetails[i].AdditionType == 5 && $scope.additionalDetails[i].Id != 0)
                    {
                        $scope.hasStatementDeliveryType = true;
                    }
                }
            }, function () {
                alert('Error getAccount');
            });
        };

        $scope.printDetailsForTransfer = function (accountNumber, currency) {
            showloading();
            var Data = accountService.printDetailsForTransfer(accountNumber, currency);
            ShowPDF(Data);
        };

        $scope.printStatementDeliveryApplication = function (accountNumber) {
            showloading();
            var Data = accountService.printStatementDeliveryApplication(accountNumber);
            ShowPDF(Data);
        };

        $scope.getCustomerType = function () {
            var Data = customerService.getCustomerType();
            Data.then(function (cust) {
                $scope.customertype = cust.data;
            }, function () {
                alert('Error');
            });
        };
        $scope.printAccountOpenApplication = function (accountNumber) {            
            var accountNumbers = "";
            if (accountNumber != undefined) {
                accountNumbers = accountNumber;
            }
            else {
                if ($scope.closingAccounts.length == 0) {
                    $scope.noAccountSelected();
                    return;
                }
                for (var i = 0; i < $scope.closingAccounts.length; i++) {
                    accountNumbers += $scope.closingAccounts[i].AccountNumber + ',';                    
                }
                accountNumbers = accountNumbers.slice(0, -1);
            }
            showloading();
            var Data = accountService.printAccountOpenApplication(accountNumbers);
            ShowPDF(Data);
        };

        $scope.getCurrentAccountServiceFee = function (accountNumber) {
            var accountNumbers = "";
            if (accountNumber != undefined) {
                accountNumbers = accountNumber;
            }
            else {
                if ($scope.closingAccounts.length == 0) {
                    $scope.noAccountSelected();
                    return;
                }
                for (var i = 0; i < $scope.closingAccounts.length; i++) {
                    accountNumbers += $scope.closingAccounts[i].AccountNumber + ',';
                }
                accountNumbers = accountNumbers.slice(0, -1);
            }
            if ($scope.isAccountsDifferentTypes($scope.closingAccounts)) {
                showMesageBoxDialog('Հաշիվները տարբեր տեսակի են', $scope, 'information');
                return;
            }
            else if ($scope.isAccountsJointPersonsDifferent($scope.closingAccounts)) {
                    if ($scope.closingAccounts[0].JointType == 1) {
                        showMesageBoxDialog('Նշված համատեղ հաշիվների հաճախորդները չեն համընկնում', $scope, 'information');
                    }
                    else if ($scope.closingAccounts[0].JointType == 2) {
                        showMesageBoxDialog('Նշված հօգուտ 3-րդ անձանց հաշիվների հաճախորդները չեն համընկնում', $scope, 'information');
                    }
                    return;
            }
            showloading();
            var Data = accountService.getCurrentAccountServiceFee(accountNumbers);
            ShowPDF(Data);
        };

        $scope.addAdditionalData = function (AdditionType, AdditionValue, Account) {

            $scope.AdditionType = AdditionType;
            $scope.AdditionValue = AdditionValue;
            $scope.Account = Account;

            $scope.editDataModalInstance = $uibModal.open({
                template: '<accdatachangeorder callback="getAccountAdditionalDetails(account);closeEditDataModalInstance();" close="closeEditDataModalInstance();" ></accdatachangeorder>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });

            $scope.editDataModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

        $scope.closeEditDataModalInstance = function () {
            $scope.editDataModalInstance.close();
        };



        $scope.callbackgetCurrentAccount = function () {

            $scope.getCurrentAccount($scope.selectedAccount);
        };

        $scope.callbackgetCurrentAccounts = function () {
            $scope.getCurrentAccounts();
        };
        $scope.callbackgetCustomerTransitAccounts = function () {
            
             $scope.getCustomerTransitAccounts();
        };

        $scope.hasAccountPensionApplication = function (accountNumber) {
            var Data = accountService.hasAccountPensionApplication(accountNumber);
            Data.then(function (acc) {
                $scope.PensionApplicationSign = acc.data;
            }, function () {
                alert('Error hasAccountPensionApplication');
            });
        };

        $scope.callbackgetCurrentAccountAfterReopenAccount = function () {
            $scope.afterReopen = true;
            $scope.getCurrentAccount($scope.selectedAccount);
            $scope.getAccountAdditionalDetails($scope.selectedAccount);
        };

        $scope.getAccountSource = function (accountNumber) {
            var Data = accountService.getAccountSource(accountNumber);
            Data.then(function (rep) {
                $scope.source = rep.data;
                $scope.getSourceDescription($scope.source);
            }, function () {
                alert('Error getAccountSource');
            });
        };

        $scope.getSourceDescription = function (source) {
            var Data = infoService.getSourceDescription(source);
            Data.then(function (rep) {
                $scope.SourceDescription = rep.data;
            }, function () {
                alert('Error getSourceDescription');
            });
        };

        $scope.printAllContract = function (account) {
            $scope.getAccountOpenContract(account.AccountNumber);

            if ($scope.$root.SessionProperties.CustomerType == 6) {
                $scope.getCurrentAccountServiceFee(account.AccountNumber);
            }
            else {
                $scope.printAccountOpenApplication(account.AccountNumber);
            }
            $scope.getCustomerDocuments();

            if ($root.SessionProperties.CustomerType != '6') {
                $scope.getCustomerSignature();
            }
        };

        $scope.getCustomerDocuments = function () {
            showloading();
            var Data = printDocumentsService.getCustomerDocuments();
            ShowPDF(Data);
        };


        $scope.getCustomerSignature = function () {
            showloading();
            var Data = printDocumentsService.getCustomerSignature();
            ShowPDF(Data);
        };

        $scope.getCurrencies = function () {
            var Data = infoService.getCurrencies();
            Data.then(function (rep) {
                $scope.currencies = rep.data;
            }, function () {
                alert('Error getSourceDescription');
            });
        };

        $scope.openAccountDetails = function () {
            $state.go('accountdetails', { selectedAccount: $scope.selectedAccountNumber, account: $scope.closedAccount });
        };


        $scope.getAccountClosinghistory = function () {

            var Data = accountService.getAccountClosinghistory();
            Data.then(function (acc) {
                $scope.histories = acc.data;

            }, function () {

                alert('Error getAccountClosinghistory');
            });
        };


        $scope.closingAccounts = [];
        $scope.addDeleteClosingAccounts = function (account)
        {
            if (account.isClosingAccount) {
                $scope.closingAccounts.push(account);
            }
            else {
                var index = $scope.closingAccounts.indexOf(account);
                $scope.closingAccounts.splice(index, 1);
                $scope.isCheckSelectedAccounts = false;
            }


        };
        $scope.checkSelectedAccounts = function (isCheckSelectedAccounts) {
            $scope.closingAccounts = [];
            $scope.reOpeningAccounts = [];
            if ($scope.filter == 1) {
                if (isCheckSelectedAccounts) {
                    for (var i = 0; i < $scope.accounts.length; i++) {
                        $scope.accounts[i].isClosingAccount = true;
                        $scope.closingAccounts.push($scope.accounts[i]);
                    }
                }
                else {
                    for (var i = 0; i < $scope.accounts.length; i++) {
                        $scope.accounts[i].isClosingAccount = false;

                    }
                    $scope.closingAccounts = [];
                }
            }
            else {
                if (isCheckSelectedAccounts) {

                    for (var i = 0; i < $scope.closedAccounts.length; i++) {
                        $scope.closedAccounts[i].isReOpeningAccount = true;
                        $scope.reOpeningAccounts.push($scope.closedAccounts[i]);
                    }
                }
                else {
                    for (var i = 0; i < $scope.closedAccounts.length; i++) {
                        $scope.closedAccounts[i].isReOpeningAccount = false;
                    }
                }
            }
        };
        $scope.reOpeningAccounts = [];
        $scope.addDeleteReOpeningAccounts = function (account) {
            if (account.isReOpeningAccount) {
                $scope.reOpeningAccounts.push(account);
            }
            else {
                var index = $scope.reOpeningAccounts.indexOf(account);
                $scope.reOpeningAccounts.splice(index, 1);
                $scope.isCheckSelectedAccounts = false;
            }
        };

        $scope.noAccountSelected = function () {
            console.log("no account selected for processing");
        };

        $scope.getElementPosition = function (index) {
            var top = $('#accountRow_' + index).position().top;
            if (document.getElementById('accountflowdetails') != undefined)
                document.getElementById('accountflowdetails').setAttribute("style", "margin-top:" + (top + 60).toString() + "px; width: 350px !important;");
        };


        $scope.getDemandDepositRate = function (account) {
            if ($scope.$root.SessionProperties.CustomerType!=6) {
                var Data = accountService.getDemandDepositRate(account.AccountNumber);
                Data.then(function (acc) {
                    $scope.demandDepositRate = acc.data;
                    $scope.canShowDemandDepositRateButton();
                }, function () {
                    alert('Error getDemandDepositRate');
                });
            }
            else {
                $scope.demandDepositRates = null;
            }
        };
        $scope.canShowDemandDepositRateButton = function () {
            if ($scope.demandDepositRate != undefined) {
                if ($scope.demandDepositRate.TariffGroup == 2) {
                    if ($scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"] == '1' &&
                        $scope.$root.SessionProperties.AdvancedOptions["canChangeDemandDepositRate"] == '1') {
                        $scope.showDemandDepositRateButton = true;
                    }
                }
                else {
                    if ($scope.$root.SessionProperties.AdvancedOptions["canChangeDemandDepositRate"] == '1') {
                        $scope.showDemandDepositRateButton = true;
                    }
                }
            }
        }

        $scope.getDemandDepositRateTariffs = function () {
            var Data = infoService.getDemandDepositRateTariffs();
            Data.then(function (rep) {
                $scope.demandDepositRateTariffs = rep.data;
            }, function () {
                alert('Error getSourceDescription');
            });
        };




        $scope.getAccountOpeningClosingDetails = function (accountNumber) {
            var Data = accountService.getAccountOpeningClosingDetails(accountNumber);
            Data.then(function (val) {
                $scope.accountOpeningClosingDetails= val.data;
            }, function () {
                alert('Error getAccountOpeningClosingDetails');
            });
        };

        $scope.getAccountOpeningDetail = function (accountNumber) {
            var Data = accountService.getAccountOpeningDetail(accountNumber);
            Data.then(function (val) {
                $scope.accountOpeningDetail= val.data;
            }, function () {
                alert('Error getAccountOpeningDetail');
            });
        };


        $scope.getBankruptcyManager = function(accountNumber){
            var Data = accountService.getBankruptcyManager(accountNumber);
            Data.then(function (result) {
                $scope.bankruptcyManagerCustNumber = result.data;
            }, function () {
                alert('Error getBankruptcyManager');
            });
        };


        $scope.inputBankruptcyManager = function (bankruptcyCustomerNumber) {
            if (bankruptcyCustomerNumber == undefined) {
                $scope.alert = "Հաճախորդի համարը պետք է լինի 12 նիշ";
                return;
            }

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

        $scope.addBankruptcyManager = function (bankruptcyCustomerNumber) {
            $scope.alert = "";
            if (bankruptcyCustomerNumber == null) {
                return $scope.alert = "Կատարեք հաճախորդի որոնում";
            }
            else if (bankruptcyCustomerNumber.length != 12) {
                return $scope.alert = "Հաճախորդի համարը պետք է լինի 12 նիշ";
            }
            else if ($scope.identityId == 0) {
                return $scope.alert = "Հաճախորդը գտնված չէ";
            }

            $scope.order.BankruptcyManager = bankruptcyCustomerNumber;
        };

        $scope.deleteBankruptcyManager = function () {
            $scope.order.BankruptcyManager = undefined;
            $scope.disable = false;
        };


        $scope.searchCustomers = function (isBankrupt) {
            $scope.searchCustomersModalInstance = $uibModal.open({
                template: '<searchcustomer callback="getSearchedCustomer(' + (isBankrupt == true ? 'true,' : 'false,') + 'customer)" close="closeSearchCustomersModal()"></searchcustomer>',
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

        $scope.getSearchedCustomer = function (isBankrupt, customer) {
            if (isBankrupt) {
                $scope.bankruptcyCustomerNumber = customer.customerNumber;
            }
        };

        $scope.closeSearchCustomersModal = function () {
            $scope.searchCustomersModalInstance.close();
        };

        $scope.isAccountsDifferentTypes = function (accounts) {
            for (var i = 0; i < accounts.length; i++) {
                for (var j = 0; j < accounts.length; j++) {
                    if (accounts[i].JointType != accounts[j].JointType) {
                        return true;
                    }
                }
            }
            return false;

        }

        $scope.isAccountsJointPersonsDifferent = function (accounts) {
            var jointPersonsCustomerNumbers = [];
            for (var i = 0; i < accounts.length; i++) {

                jointPersonsCustomerNumbers.push($.map(accounts[i].JointPerson, function (jp) { return Number(jp.CustomerNumber) }));

            }
            for (var i = 0; i < jointPersonsCustomerNumbers.length; i++) {
                for (var j = i + 1; j < jointPersonsCustomerNumbers.length; j++) {
                    if (!(jointPersonsCustomerNumbers[i].equals(jointPersonsCustomerNumbers[j]))) {
                        return true;
                    }
                }

            }
            return false;
        };

        $scope.setCurrnetAccountsScroll = function () {
            $("#accountsContent").mCustomScrollbar({
                theme: "rounded-dark",
                scrollButtons: {
                    scrollAmount: 200,
                    enable: true
                },
                mouseWheel: {
                    scrollAmount: 200
                }
            });
        };

        $scope.setTransitAccountsScroll = function () {
            $("#transitaccountsContent").mCustomScrollbar({
                theme: "rounded-dark",
                scrollButtons: {
                    scrollAmount: 200,
                    enable: true
                },
                mouseWheel: {
                    scrollAmount: 200
                }
            });
        };

        $scope.saveAccountRemovingOrder = function (accountNumber) {
            $scope.order.RemovingAccount = {};
            $scope.order.RemovingAccount.AccountNumber = accountNumber;
            $scope.order.RemovingAccount.Currency = $scope.account.Currency;
            $scope.order.Type = 249;

            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ հաշիվը' })
                .then(function () {
                    showloading();
                    var Data = accountService.postAccountRemovingOrder($scope.order);
                    Data.then(function (res) {
                        if (validate($scope, res.data)) {
                            hideloading();
                            showMesageBoxDialog('Հաշիվը հեռացված է', $scope, 'information');
                            $state.go('currentAccounts');
                        }
                        else {
                            hideloading();
                            showMesageBoxDialog(res.data.Errors[0].Description, $scope, 'error');
                        }
                    }, function () {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error postAccountRemovingOrder');
                        hideloading();
                    });
                });

        };

    }]);