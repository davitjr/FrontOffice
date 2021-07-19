app.controller("TransferCallsCtrl", ['$scope', 'transferCallsService', 'infoService', 'utilityService', 'receivedFastTransferPaymentOrderService', 'customerService', 'casherService', '$location', '$confirm', '$uibModal', 'dialogService', '$rootScope', '$http', function ($scope, transferCallsService, infoService, utilityService, receivedFastTransferPaymentOrderService,customerService, casherService, $location, $confirm, $uibModal, dialogService, $rootScope, $http) {

    $rootScope.OpenMode = 2;

    $scope.selectedTransfer = null;
    //try {
    //    $scope.isCallCenter = $scope.$root.SessionProperties.AdvancedOptions["isCallCenter"];
    //    if ($scope.isCallCenter == "1")
    //        $scope.filter.registeredBy = "1";
    //}
    //catch (ex) {
    //    $scope.isCallCenter = "0";
    //}
    $scope.$watch('$root.SessionProperties.AdvancedOptions["isCallCenter"];', function (newVal, oldVal) {
 
            try {
                $scope.isCallCenter = angular.copy($scope.$root.SessionProperties.AdvancedOptions["isCallCenter"]);
                if ($scope.isCallCenter == "1")
                    $scope.filter.registeredBy = "1";
            }
            catch (ex) {
                $scope.isCallCenter = "0";
            }
      
    });


    $scope.getUserFilial = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (user) {
            $scope.UserFilial = user.data;
        }, function () {
            alert('Currencies Error');
        });

    };
        $scope.filter = {
            quality: "0",
            currency: undefined,
            customerNumber: "",
            cardNumber: "",
            transferSystem: undefined,
            Amount: "",
            startDate: new Date(),
            endDate: new Date(),
            setNumber: "",
            registeredBy: $rootScope.FromReceived!=undefined? "2": "1",
        };
    

        var DataCust = customerService.getAuthorizedCustomerNumber();
    DataCust.then(function(cust) {
        if (cust.data == undefined || cust.data == 0 || cust.data == null)
            $scope.isCustomer = false;
        else {
            $scope.isCustomer = true;
            if ($scope.isCallCenter != "1")
                $scope.filter.registeredBy = "2";
            $scope.getTransferCalls();


        }
    });
    $scope.transferCall = {
        callTime: new Date(),
        rateBuy: 0,
        rateSell: 0,
        contract: [],
        customerNumber: ""
    };

    $scope.transferContracts = [];

    $scope.getTransferCalls = function () {
        $scope.loading = true;
        //sessionStorage.setItem('TransferByCallFormParams', JSON.stringify($scope.filter));
        if ($scope.filter.quality == null) {
            $scope.filter.quality = "-1";
        }

        var Data = transferCallsService.getTransferList($scope.filter);
        Data.then(function (transferList) {
            $scope.transfers = transferList.data.TransferList;
            $scope.transfersCount = transferList.data.TransferCount;
            $scope.loading = false;
        },
        function () {
            $scope.loading = false;
            alert('Error getTransferCalls');
        });
    };

    $scope.getTransferDetails = function (selectedTransferId) {

        $scope.loading = true;
        var Data = transferCallsService.getTransferDetails(selectedTransferId);
        Data.then(function (transferDetails) {

            $scope.transferDetails = transferDetails.data;

            if ($scope.transferDetails.AccountCurrency != $scope.transferDetails.Currency) {
                if ($scope.transferDetails.AccountCurrency == "AMD") {
                    $scope.clientTransferAmount = Math.round($scope.transferDetails.Amount * $scope.transferDetails.RateBuy * 100) / 100;
                }
                else {
                    if ($scope.transferDetails.Currency == "AMD") {
                        $scope.clientTransferAmount = Math.round($scope.transferDetails.Amount / $scope.transferDetails.RateSell * 100) / 100;
                    }
                    else {
                        $scope.clientTransferAmount = Math.round($scope.transferDetails.Amount * $scope.transferDetails.RateBuy / $scope.transferDetails.RateSell * 100) / 100;
                    }
                }
                $scope.clientTransferAmount = utilityService.formatNumber($scope.clientTransferAmount, 2);
            }

            var Data = customerService.getCasherDescription($scope.transferDetails.RegistrationSetNumber);
            Data.then(function (descr) {
                $scope.registrationSetDescription = descr.data;

            }, function () {
                alert('Error getRegistrationSetNumberDescription');
            });

            if ($scope.transferDetails.ConfirmationSetNumber != 0) {
                var Data = customerService.getCasherDescription($scope.transferDetails.ConfirmationSetNumber);
                Data.then(function (descr) {
                    $scope.confirmationSetDescription = descr.data;

                }, function () {
                    alert('Error getConfirmationSetNumberDescription');
                });
            }

            if ($scope.transferDetails.ConfirmationSetNumber != 0) {
                var Data = customerService.getCasherDescription($scope.transferDetails.ConfirmationSetNumber2);
                Data.then(function (descr) {
                    $scope.confirmationSet2Description = descr.data;

                }, function () {
                    alert('Error getConfirmationSetNumber2Description');
                });
            }

            $scope.loading = false;
        },
        function () {
            $scope.loading = false;
            alert('Error in getTransferDetails');
        });
    };


    $scope.EditTransfer = function () {
        $scope.error = "";

        var temp = '/ReceivedFastTransferPaymentOrder/ReceivedFastTransferPaymentOrder';
        var cont = 'ReceivedFastTransferPaymentOrderCtrl';
        var id = 'ReceivedFastTransferPaymentOrder';
        var title = 'Հեռախոսազանգով փոխանցում';



        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };


        dialogService.open(id, $scope, title, temp, dialogOptions);
    };
    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error getCustomerDocumentWarnings');
        });

    };
    $scope.setClickedRow = function (index) {
        $scope.currentTransfer = undefined;
        $scope.CanPay = false;
        $scope.selectedTransfer = $scope.transfers[index].Id;
        $scope.params = { selectedTransfer: $scope.transfers[index].Id };
        var Data = transferCallsService.getTransferDetails($scope.selectedTransfer);
        Data.then(function (transferDetails) {
            $scope.currentTransfer = transferDetails.data;
            $scope.currentTransferID = $scope.transfers[index].Id;
            if ($scope.isCustomer == true && $scope.currentTransfer.Quality == 0 && $scope.currentTransfer.RegisteredBy != 1 && $scope.currentTransfer.ContractFilialCode == $scope.UserFilial)
                $scope.CanPay = true;
            else
                $scope.CanPay = false;
        },
                function () {
                    $scope.loading = false;
                    alert('Error in getTransferDetails');
                });
    }

    $scope.SendForPay = function () {
        if ($scope.currentTransferID != null && $scope.currentTransferID != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'ՈՒղարկե՞լ վճարման' })
            .then(function () {
                showloading();
                var Data = transferCallsService.sendTransfeerCallForPay($scope.currentTransferID);
                Data.then(function (res) {
                    hideloading();
                    $scope.path = 'TransfersByCall';
          
                        $scope.getTransferCalls();
                 
                    if (validate($scope, res.data) && res.data.ResultCode != 5) {
                        ShowToaster('Փոխանցումն ուղարկված է վճարման', 'success');
                            }
                    else {
                        $scope.showError = true;
                        ShowToaster($scope.error[0].Description, 'error');
                    }
                }, function () {
                    hideloading();
                    ShowToaster('Տեղի ունեցավ սխալ', 'error');
                    alert('Error confirmOrder');
                });
            });
            
        };
    };

    $scope.SendForPayOrDelete = function (SubType) {
 
        document.getElementById("loadMain").classList.remove("hidden");

                //$scope.order.Type = 3;
        //$scope.order.SubType = 1;
                $scope.order = {};
                $scope.order.OrderNumber = " ";
                $scope.order.RegistrationDate = new Date();
                $scope.order.Type = 145;
                $scope.order.SubType = SubType;
                $scope.order.CustomerNumber = $scope.currentTransfer.CustomerNumber;
                $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.Description = SubType == 2 ? "Փոխանցման հեռացում" : "Փոխանցման վճարման ուղարկում";
                $scope.order.ReceiverAccount = undefined;
                $scope.order.ReceivedFastTransfer = {};
 
        $scope.order.ReceivedFastTransfer.Source = 2;

                $scope.order.ReceivedFastTransfer.TransferByCallID = $scope.currentTransfer.Id;
        $scope.order.ReceivedFastTransfer.ContractId = $scope.currentTransfer.ContractID;
                $scope.order.ReceivedFastTransfer.CustomerNumber = $scope.order.CustomerNumber;
                var Data = transferCallsService.saveCallTransferChangeOrder($scope.order);
                
              
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        document.getElementById("loadMain").classList.add("hidden");
 
                            //$scope.path = '#transfersByCall';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        $scope.getTransferCalls();
                            //window.location = '#transfersByCall';
                            //$rootScope.FromReceived = true;
                            //refresh($scope.order.Type, 1);
                   
                    }
                    else {
                        if (res.data.ResultCode == 6) {
                            $scope.showError = true;
                            $scope.error = res.data.Errors;
                            $scope.validateWarnings = res.data.Errors;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.confirmTransfer);
                        }
                        else if (res.data.ResultCode == 4) {
                            $scope.showError = true;
                            $scope.error = res.data.Errors;
                            ShowMessage($scope.error[0].Description, 'error', $scope.path);
                        }
                        else {
                            document.getElementById("loadMain").classList.add("hidden");
                            showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveReceivedFastTransferPayment);
                        }
                    }
                }, function () {
                    $scope.confirm = false;
                    document.getElementById("loadMain").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in FastTransferPaymentOrder');
                });
 
 
    }
    $scope.confirm = false;
    $scope.saveTransferCall = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("load").classList.remove("hidden");
            $scope.order = {};
            $scope.order.OrderNumber = " ";
            $scope.order.RegistrationDate = new Date();
            $scope.order.Type = 79;
            $scope.order.SubType = $scope.transferCall.transferSystem;
            $scope.order.CustomerNumber = $scope.transferCall.customerNumber;
            $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
            $scope.order.ReceiverPhone = $scope.transferCall.contactPhone;
            $scope.order.Description = 'Non-commercial transfer for personal needs';
            $scope.order.ReceiverAccount = undefined;
            $scope.order.ContractId = $scope.transferCall.contractID;
            $scope.order.Code = $scope.transferCall.code;
            $scope.order.Amount = $scope.transferCall.amount;
            $scope.order.Currency = $scope.transferCall.currency;
            $scope.order.ConvertationRate = $scope.transferCall.rateBuy;
            $scope.order.ConvertationRate1 = $scope.transferCall.rateSell;
            $scope.order.Receiver = $scope.Receiver;
            $scope.order.ReceiverPassport = $scope.ReceiverPassport;
            var Data = receivedFastTransferPaymentOrderService.saveReceivedFastTransferPaymentOrder($scope.order, $scope.confirm, 1);
            //var Data = transferCallsService.saveTransferCall($scope.transferCall);
            Data.then(function (res) {
                $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        document.getElementById("load").classList.add("hidden");
                        CloseBPDialog('newtransfercall');
                       // $scope.path = 'TransfersByCall';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                       // $scope.getTransferCalls();
                        refresh($scope.order.Type, 1);
                    }
                    else {
                        document.getElementById("load").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveTransferCall);
                    }
                }, function () {
                    document.getElementById("load").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in saveTransferCall');
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };


    $scope.getTransferCallQuality = function () {

        var Data = transferCallsService.getTransferCallQuality();

        Data.then(function (transferQuality) {
            $scope.transferQuality = transferQuality.data;
        },
        function () {
            alert('Error getTransferCallQuality');
        });
    };

    $scope.getTransferTypes = function (isActive) {

        var Data = transferCallsService.getTransferTypes(isActive);

        Data.then(function (transferTypes) {
            $scope.transferTypes = transferTypes.data;
        },
        function () {
            alert('Error getTransferCallTypes');
        });
    };

    $scope.getCurrencies = function () {

        var Data = infoService.getCurrencies();
        Data.then(function (currency) {
            $scope.currencies = currency.data;
        }, function () {
            alert('Error getCurrencies');
        });
    };

    $scope.getTransferSystemCurrency = function () {

        $scope.transferCall.currency = undefined;
        var Data = transferCallsService.getTransferSystemCurrency($scope.transferCall.transferSystem);

        Data.then(function (transferSystemCurrency) {

            $scope.currencies = transferSystemCurrency.data;
        },
        function () {
            alert('Error getTransferSystemCurrency');
        });
    };

    $scope.getContractsForTransfersCall = function (findParamNumber) {
        var customerNumber = $scope.transferCall.customerNumber;
        var accountNumber = $scope.transferCall.accountNumber;
        var cardNumber = $scope.transferCall.cardNumber;
        $scope.transferCall.contract.ContractPassword = "";
        $scope.transferCall.contract.CreditLineQuality = "";
        $scope.transferCall.contract.Currency = "";
        $scope.transferCall.contract.MotherName = "";
        $scope.transferCall.contract.CardValidationDateString = "";
        $scope.customerDahk = "";
        $scope.transferCall.contactPhone = "";

        if (findParamNumber == 1) {
            $scope.transferCall.cardNumber = "";
            $scope.transferCall.accountNumber = "";

            if ($scope.transferCall.customerNumber == undefined) {
                return $scope.transferContracts = "";
            }

            if ($scope.transferCall.customerNumber.length < 4) {
                return $scope.transferContracts = "";
            }
            accountNumber = 0;
            cardNumber = "";
        }

        if (findParamNumber == 2) {
            $scope.transferCall.cardNumber = "";
            $scope.transferCall.customerNumber = "";

            if (accountNumber == null) {
                return $scope.transferContracts = "";
            }
            customerNumber = "";
            cardNumber = "";
        }

        if (findParamNumber == 3) {
            $scope.transferCall.customerNumber = "";
            $scope.transferCall.accountNumber = "";

            if ($scope.transferCall.cardNumber.length < 4) {
                return $scope.transferContracts = "";
            }

            customerNumber = "";
            accountNumber = 0;
        }


        var Data = transferCallsService.getContractsForTransfersCall(customerNumber, accountNumber, cardNumber);

        Data.then(function (ContractsForTransfersCall) {
            $scope.transferContracts = ContractsForTransfersCall.data;
            if ($scope.transferContracts.length == 1) {
                $scope.transferCall.cardNumber = $scope.transferContracts[0].CardNumber;
                $scope.transferCall.accountNumber = $scope.transferContracts[0].AccountNumber;
                $scope.transferCall.customerNumber = $scope.transferContracts[0].CustomerNumber.toString();
                $scope.getCustomer($scope.transferCall.customerNumber);
                $scope.transferCall.contract = $scope.transferContracts[0];
                $scope.transferCall.contactPhone = $scope.transferContracts[0].CardPhone;
                $scope.transferCall.contractID = $scope.transferContracts[0].ContractId;
                $scope.transferCall.contractFilialCode = $scope.transferContracts[0].ContractFilialCode;
                $scope.getClientTransferAmount();

                var Data = customerService.GetCustomerDebts($scope.transferContracts[0].CustomerNumber);
                Data.then(function (debts) {

                    for (var i = 0; i < debts.data.length; i++) {
                        if ($scope.customerDahk != "")
                            $scope.customerDahk += ",\n";

                        if (debts.data[i].DebtType == 9) {
                            $scope.customerDahk += debts.data[i].DebtDescription + ' - ';
                            if (debts.data[i].Amount != null)
                                $scope.customerDahk += utilityService.formatNumber(parseFloat(debts.data[i].Amount), 2) + ' ' + debts.data[i].Currency;
                            else
                                $scope.customerDahk += debts.data[i].AmountDescription;
                        }
                    };
                }, function () {
                    alert('Error getCustomerDebts');
                });
            }
        },
        function () {
            alert('Error getContractsForTransfersCall');
        });
    };

    $scope.getCustomer = function (customerNumber) {

        var Data = customerService.getCustomer(customerNumber);
        Data.then(function (cust) {
            $scope.customer = cust.data;
            $scope.getCustomerDocumentWarnings(customerNumber);

            $scope.Receiver = cust.data.FirstNameEng + ' ' + cust.data.LastNameEng;

            if ($scope.customer.DocumentNumber != null && $scope.customer.DocumentNumber != "")
                $scope.ReceiverPassport = $scope.customer.DocumentNumber +
                    ', ' +
                    $scope.customer.DocumentGivenBy +
                    ', ' +
                    $scope.customer.DocumentGivenDate;


        }, function () {
            alert('Error');
        });

    };

    $scope.getContractDetails = function () {

        $scope.customerDahk = "";
        $scope.transferCall.customerNumber = $scope.transferCall.contract.CustomerNumber.toString();
        $scope.getCustomer($scope.transferCall.customerNumber);
        $scope.transferCall.accountNumber = $scope.transferCall.contract.AccountNumber;
        $scope.transferCall.cardNumber = $scope.transferCall.contract.CardNumber;
        $scope.transferCall.contractID = $scope.transferCall.contract.ContractId;
        $scope.transferCall.contractFilialCode = $scope.transferCall.contract.ContractFilialCode;
        $scope.transferCall.contactPhone = $scope.transferCall.contract.CardPhone;        

        var Data = customerService.GetCustomerDebts($scope.transferCall.contract.CustomerNumber);
        Data.then(function (debts) {

            for (var i = 0; i < debts.data.length; i++) {
                if ($scope.customerDahk != "")
                    $scope.customerDahk += ",\n";

                if (debts.data[i].DebtType == 9) {
                    $scope.customerDahk += debts.data[i].DebtDescription + ' - ';
                    if (debts.data[i].Amount != null)
                        $scope.customerDahk += utilityService.formatNumber(parseFloat(debts.data[i].Amount), 2) + ' ' + debts.data[i].Currency;
                    else
                        $scope.customerDahk += debts.data[i].AmountDescription;
                }
            };

        }, function () {
            alert('Error getCustomerDebts');
        });
    };

    $scope.getClientTransferAmount = function () {
        $scope.disableCurrency = true;
        if ($scope.transferCall.currency == "" || $scope.transferCall.currency == undefined || $scope.transferCall.contract.Currency == "" || $scope.transferCall.contract.Currency == undefined || $scope.transferCall.amount == "" || $scope.transferCall.amount == undefined)
        {
            $scope.disableCurrency = false;
            return;
        }

        if ($scope.transferCall.contract.Currency != $scope.transferCall.currency) {
            if ($scope.transferCall.contract.Currency == "AMD") {
                var Data = utilityService.getLastRates($scope.transferCall.currency, 6, 2); //Transfer Buy Rate

                Data.then(function (result) {
                    $scope.transferCall.rateSell = 0;
                    $scope.transferCall.rateBuy = utilityService.formatNumber(result.data, 2);
                    $scope.transferCall.clientTransferAmount = utilityService.formatNumber(Math.round($scope.transferCall.amount * $scope.transferCall.rateBuy * 100) / 100, 2);
                    $scope.disableCurrency = false;
                },
                function () {
                    $scope.disableCurrency = false;
                    alert('Error getLastRates Buy');
                });
            }
            else {
                if ($scope.transferCall.currency == "AMD") {
                    var Data = utilityService.getLastRates($scope.transferCall.contract.Currency, 6, 1); //Transfer Sell Rate

                    Data.then(function (result) {
                        $scope.transferCall.rateBuy = 0;
                        $scope.transferCall.rateSell = utilityService.formatNumber(result.data, 2);
                        $scope.transferCall.clientTransferAmount = utilityService.formatNumber(Math.round($scope.transferCall.amount / $scope.transferCall.rateSell * 100) / 100, 2);
                        $scope.disableCurrency = false;
                    },
                    function () {
                        alert('Error getLastRates Sell');
                        $scope.disableCurrency = false;
                    });
                }
                else {
                    var Data = utilityService.getLastRates($scope.transferCall.contract.Currency, 5, 1); //Cross Sell Rate

                    Data.then(function (result) {
                        $scope.transferCall.rateSell = utilityService.formatNumber(result.data, 2);

                        var Data1 = utilityService.getLastRates($scope.transferCall.currency, 5, 2); //Cross Buy Rate

                        Data1.then(function (result1) {
                            $scope.transferCall.rateBuy = utilityService.formatNumber(result1.data, 2);
                            $scope.transferCall.clientTransferAmount = utilityService.formatNumber(Math.round($scope.transferCall.amount * $scope.transferCall.rateBuy / $scope.transferCall.rateSell * 100) / 100, 2);
                            $scope.disableCurrency = false;
                        },
                        function () {
                            alert('Error getLastRates Cross Buy');
                            $scope.disableCurrency = false;
                        });
                    },
                    function () {
                        alert('Error getLastRates Cross Sell');
                        $scope.disableCurrency = false;
                    });
                }
            }
        }
        else {
            $scope.transferCall.clientTransferAmount = utilityService.formatNumber($scope.transferCall.amount, 2);
            $scope.transferCall.rateBuy = 0;
            $scope.transferCall.rateSell = 0;
            $scope.disableCurrency = false;
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
                                                            backdrop: 'static', });

        $scope.searchCustomersModalInstance.result.then(function (selectedItem)
        {
            $scope.selected = selectedItem;
        }, function () {
           
        });
    };
    
    $scope.getSearchedCustomer = function (customer) {
        $scope.transferCall.customerNumber = customer.customerNumber;
        $scope.getCustomer($scope.transferCall.customerNumber);
        $scope.getContractsForTransfersCall(1);
        $scope.closeSearchCustomersModal();
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };


    $scope.searchCards = function () {
        $scope.searchCardsModalInstance = $uibModal.open({
            template: '<searchcard callback="getSearchedCard(card)" close="closeSearchCardsModal()"></searchcard>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });

        $scope.searchCardsModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.closeSearchCardsModal = function () {
        $scope.searchCardsModalInstance.close();
    };


    $scope.getSearchedCard = function (selectedCard) {
        $scope.transferCall.cardNumber = selectedCard.CardNumber;
        $scope.getContractsForTransfersCall(3);
        $scope.closeSearchCardsModal();
    };

   

    $scope.searchAccounts = function () {
        $scope.searchAccountsModalInstance = $uibModal.open({
            template: '<searchaccount callback="getSearchedAccounts(selectedAccount)" close="closeSearchAccountsModal()"></searchaccount>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });

        $scope.searchAccountsModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getSearchedAccounts = function (selectedAccount) {
        $scope.transferCall.accountNumber = selectedAccount.accountNumber;
        $scope.getContractsForTransfersCall(2);
        $scope.closeSearchAccountsModal();
    };

    $scope.closeSearchAccountsModal = function () {
        $scope.searchAccountsModalInstance.close();
    };
    $scope.getAccount = function (accountNumber) {
        $scope.loading = true;
        var Data = accountService.getAccount(accountNumber);
        Data.then(function (acc) {
            $scope.account = acc.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getAccount');
        });
    };


}]);