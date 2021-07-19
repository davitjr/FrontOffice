app.controller("SwiftMessagesCtrl", ['$scope', 'swiftMessagesService', 'infoService', 'accountService', '$rootScope', 'dialogService', '$uibModal', '$controller', '$confirm', 'casherService', '$http', function ($scope, swiftMessagesService, infoService, accountService, $rootScope, dialogService, $uibModal, $controller, $confirm,casherService, $http) {

    $scope.$root.OpenMode = 12;
    $scope.disableSearchParamFilialCode = true;

    $scope.getSearchedSwiftMessages = function () {

        if ($scope.searchParams.RegistartionDate == undefined && $scope.dateFilterType==1)
        {
            ShowMessage('Գրանցման ա/թ-ն լրացված չէ։', 'error');
            return;
        } else if (($scope.searchParams.DateFrom == undefined || $scope.searchParams.DateTo == undefined) && $scope.dateFilterType == 2) {
            ShowMessage('ա/թ-երի միջակայքը լրացված չէ։', 'error');
            return;
        }

        showloading();
        var Data = swiftMessagesService.getSearchedSwiftMessages($scope.searchParams);
        Data.then(function (acc) {
            $scope.swiftMessages = acc.data;
            hideloading();
        }, function () {
            hideloading();
            alert('Error getSearchedSwiftMessages');
        });
    };

    $scope.getUserFilialCode = function (isSearch) {
        var Data = casherService.getUserFilialCode();
        Data.then(function (acc) {
            $scope.userFilialCode = acc.data;
            if ($scope.userFilialCode == 22000) {
                $scope.disableSearchParamFilialCode = false;
            }
            else {
                $scope.searchParams.FilialCode = $scope.userFilialCode.toString();
            }
            if (isSearch) {
                $scope.getSearchedSwiftMessages();
            }
            
        }, function () {
            alert('Error getSwiftMessage');
        });
    };



    $scope.getSwiftMessage = function (messageUnicNumber) {
        var Data = swiftMessagesService.getSwiftMessage(messageUnicNumber);
        Data.then(function (acc) {
            $scope.swiftMessageDetails = acc.data;
        }, function () {
            alert('Error getSwiftMessage');
        });
    };

    $scope.initSwiftMessagesSearchParams = function () {
        $scope.searchParams = {};
        $scope.searchParams.Account = {};
        $scope.searchParams.RegistartionDate = $scope.$root.SessionProperties.OperationDate;
        $scope.searchParams.InputOutput = '0';
        $scope.searchParams.MessageType = '2';
        $scope.getUserFilialCode(true);
    }

    $scope.setClickedRow = function (swiftMessage) {
        $scope.selectedSwiftMessage = undefined;
        $scope.canConfirm = false;
        $scope.canConfirmSwift = false;
 
        var Data = swiftMessagesService.getSwiftMessage(swiftMessage.ID);
        Data.then(function (acc) {
          
            $scope.selectedSwiftMessage = acc.data;
            $scope.selectedSwiftMessageId = $scope.selectedSwiftMessage.ID;
            if ($scope.selectedSwiftMessage.MtCode == '202' && $scope.userFilialCode == $scope.selectedSwiftMessage.FilialCode && ($scope.selectedSwiftMessage.ConfirmationDate == undefined || $scope.selectedSwiftMessage.ConfirmationDate == null) && !$scope.selectedSwiftMessage.IsDeleted && !$scope.selectedSwiftMessage.IsRejected) {
                $scope.canConfirm = true;
            }

            if ($scope.selectedSwiftMessage.InputOutput==1 && ($scope.selectedSwiftMessage.MtCode == '900' || $scope.selectedSwiftMessage.MtCode == '910') && ($scope.selectedSwiftMessage.ConfirmationDate == undefined || $scope.selectedSwiftMessage.ConfirmationDate == null) && !$scope.selectedSwiftMessage.IsDeleted) {
                $scope.canConfirmSwift = true;
            }
 
        }, function () { 
            alert('Error getSwiftMessage');
        });

    }


    $scope.confirm202SwiftMessage = function () {
        if ($scope.selectedSwiftMessage.Currency != $scope.selectedSwiftMessage.Account.Currency)
        {
            ShowMessage('Դեբետ հաշվի արժույթը չի համապատասխանում հաղորդագրության արժույթին', 'error');
            return;
        }
        //$scope.DebitAccount = {};
        //$scope.DebitAccount.AccountNumber = $scope.selectedSwiftMessage.Account;
        $scope.selectedSwiftMessage.CustomerNumber = 0;
        var Data = infoService.getAccountCustomerNumber($scope.selectedSwiftMessage.Account);
        Data.then(function (cust) {
            $scope.selectedSwiftMessage.CustomerNumber = cust.data;
            if ($scope.selectedSwiftMessage.ReceiverAccount.substring(0, 3) == '220') {
                var DataAcc = accountService.getAccountInfo($scope.selectedSwiftMessage.ReceiverAccount);
                DataAcc.then(function (acc) {
                    $scope.selectedSwiftMessage.CreditAccount = acc.data;

                    if ($scope.selectedSwiftMessage.CreditAccount != undefined)// փոխանցում բանկի ներսում կամ փոխարկում
                    {
                        if ($scope.selectedSwiftMessage.CreditAccount.Currency == $scope.selectedSwiftMessage.Currency) {
                            $controller('PopUpCtrl', { $scope: $scope });
                            $scope.params = { forBankTransfers: true, checkForDebitAccount: 0, checkForReciverAccount: 0, orderType: 1, swiftMessage: $scope.selectedSwiftMessage };
                            //$scope.openWindow('/CardTariffContract/CardTariffs', 'Աշխատավարձային ծրագրի սակագներ', 'CardTariffContract');
                            $scope.openWindowWithTemplate('paymentorder',
                                'Փոխանցում Բանկի այլ հաշվեհամարին',
                                'paymentorder');
                        }

                        else {
                            ShowMessage('Արժույթները տարբեր են', 'error');
                        }

                        //}
                        //else
                        //{

                        //    $controller('PopUpCtrl', { $scope: $scope });
                        //    $scope.params = { checkForDebitAccount: 0, checkForReciverAccount: 1, forBankTransfers: true, orderType: 65, swiftMessage: $scope.selectedSwiftMessage };
                        //    //$scope.openWindow('/CardTariffContract/CardTariffs', 'Աշխատավարձային ծրագրի սակագներ', 'CardTariffContract');
                        //    $scope.openWindow('CurrencyExchangeOrder/PersonalCurrencyExchangeOrder', 'Փոխարկում', 'exchangeorder')
                        //}
                    }
                }, function () {

                    alert('Error getAccount');
                });
            }
            else if ($scope.selectedSwiftMessage.Currency == 'AMD' && $scope.selectedSwiftMessage.ReceiverAccount.substring(0, 3) != '217') {
                $controller('PopUpCtrl', { $scope: $scope });
                $scope.params = { checkForDebitAccountTransferArmPayment: 0, checkForFeeAccount: 0, orderType: 1, swiftMessage: $scope.selectedSwiftMessage };
                //$scope.openWindow('/CardTariffContract/CardTariffs', 'Աշխատավարձային ծրագրի սակագներ', 'CardTariffContract');
                $scope.openWindowWithTemplate('transferarmpaymentorder',
                    'Փոխանցում ՀՀ տարածքում',
                    'transferarmpaymentorder');
            }
            else if ($scope.selectedSwiftMessage.ReceiverAccount.substring(0, 3) != '217') {
                $confirm({ title: 'Շարունակե՞լ', text: 'Կատարե՞լ SWIFT փոխանցում' })
                    .then(function () {
                        $controller('PopUpCtrl', { $scope: $scope });
                        $scope.params = { checkForDebitAccountInternationalPayment: 0, checkForFeeAccount: 0, swiftMessage: $scope.selectedSwiftMessage };
                        //$scope.openWindow('/CardTariffContract/CardTariffs', 'Աշխատավարձային ծրագրի սակագներ', 'CardTariffContract');
                        $scope.openWindowWithTemplate('internationalorder',
                            'Միջազգային փոխանցում',
                            'internationalpaymentorder');
                    }, function () {
                        $controller('PopUpCtrl', { $scope: $scope });
                        $scope.params = { checkForDebitAccountTransferArmPayment: 0, checkForFeeAccount: 0, orderType: 1, swiftMessage: $scope.selectedSwiftMessage };
                        //$scope.openWindow('/CardTariffContract/CardTariffs', 'Աշխատավարձային ծրագրի սակագներ', 'CardTariffContract');
                        $scope.openWindowWithTemplate('transferarmpaymentorder',
                            'Փոխանցում ՀՀ տարածքում',
                            'transferarmpaymentorder');
                    })
                    ;
            }
            else
            {
                $controller('PopUpCtrl', { $scope: $scope });
                $scope.params = { checkForDebitAccountInternationalPayment: 0, checkForFeeAccount: 0, swiftMessage: $scope.selectedSwiftMessage };
                //$scope.openWindow('/CardTariffContract/CardTariffs', 'Աշխատավարձային ծրագրի սակագներ', 'CardTariffContract');
                $scope.openWindowWithTemplate('internationalorder',
                    'Միջազգային փոխանցում',
                    'internationalpaymentorder');
            }

         
        
                //else { ShowMessage('Սխալ հաղորդագրություն', 'error'); }
 

        //ShowMessage('Confirm:', 'a');
        }, function () {
            alert('Error');
        });
       
    }


    $scope.getSwiftMessageTypes = function () {
        var Data = infoService.getSwiftMessageTypes();
        Data.then(function (acc) {
            $scope.swiftMessageTypes = acc.data;
        }, function () {
            alert('Error');
        });

    };

    $scope.getSwiftMessageSystemTypes = function () {
        var Data = infoService.getSwiftMessageSystemTypes();
        Data.then(function (acc) {
            $scope.swiftMessageSystemTypes = acc.data;
        }, function () {
            alert('Error');
        });

    };

    $scope.getSwiftMessagMtCodes = function () {
        var Data = infoService.getSwiftMessagMtCodes();
        Data.then(function (acc) {
            $scope.swiftMessagMtCodes = acc.data;
        }, function () {
            alert('Error');
        });

    };

    $scope.getSwiftMessageAttachmentExistenceTypes = function () {
        var Data = infoService.getSwiftMessageAttachmentExistenceTypes();
        Data.then(function (acc) {
            $scope.swiftMessageAttachmentExistenceTypes = acc.data;
        }, function () {
            alert('Error');
        });

    };


    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error getFilialList');
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
        $scope.searchParams.CustomerNumber = customer.customerNumber;
        $scope.closeSearchCustomersModal();
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
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

        $scope.searchParams.Account.AccountNumber = selectedAccount.AccountNumber;
        
        $scope.closeSearchAccountsModal();
    }

    $scope.closeSearchAccountsModal = function () {
        if ($scope.searchAccountsModalInstance != undefined)
            $scope.searchAccountsModalInstance.close();
    }

    $scope.dateFilterTypeChanged = function (type) {
        if (type == 1) {
            $scope.searchParams.RegistartionDate = $scope.$root.SessionProperties.OperationDate;
            $scope.searchParams.DateFrom = null;
            $scope.searchParams.DateTo = null;
        }
        else {
            $scope.searchParams.RegistartionDate = null;
            $scope.searchParams.DateFrom = $scope.$root.SessionProperties.OperationDate;;
            $scope.searchParams.DateTo = $scope.$root.SessionProperties.OperationDate;;
        }
    }

    $scope.initSwiftMessagesContentScroll = function () {
        $(document).ready(function () {

            $("#swiftMessagesContent").mCustomScrollbar({
                theme: "rounded-dark",
                scrollButtons: {
                    scrollAmount: 95,
                    enable: true
                },
                mouseWheel: {
                    scrollAmount: 150
                }
            });

        });
    }

    $scope.saveTransactionSwiftConfirmOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.order = {};
            $scope.order.SwiftMessageId = $scope.selectedSwiftMessageId;
            $scope.order.CustomerNumber = $scope.selectedSwiftMessage.CustomerNumber;
            $scope.order.Type = 183;
            $scope.order.SubType = 1
            showloading();
            var Data = swiftMessagesService.saveTransactionSwiftConfirmOrder($scope.order);
            Data.then(function (res) {
                hideloading();
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    $scope.getSearchedSwiftMessages();
                }
                else {
                    $scope.showError = true;
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveFactoringTerminationOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.reject = function () {

        if ($rootScope.SwiftMessageRejectOrder.Description != '' && $rootScope.SwiftMessageRejectOrder.Description != undefined) {
            //$scope.order = {};
            
            showloading();
            var Data = swiftMessagesService.saveSwiftMessageRejectOrder($rootScope.SwiftMessageRejectOrder);
            Data.then(function (res) {
                hideloading();
                if (validate($scope, res.data)) {
             
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('SwiftMessageReject');
                    $scope.getSearchedSwiftMessages();
                }
                else {
                    $scope.showError = true;
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                hideloading();
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveFactoringTerminationOrder');
            });
        }
        else {
            return ShowMessage('Լրացրեք մերժման պատճառը', 'error');

        }
    };

    $scope.showReject = function () {
        showloading();

        var Data = infoService.getAccountCustomerNumber($scope.selectedSwiftMessage.Account);
        Data.then(function (cust) {
            $scope.error = "";
            $rootScope.SwiftMessageRejectOrder = {};
            $rootScope.SwiftMessageRejectOrder.CustomerNumber = cust.data;
            $rootScope.SwiftMessageRejectOrder.SwiftMessageId = $scope.selectedSwiftMessageId;
            $rootScope.SwiftMessageRejectOrder.Type = 187;
            $rootScope.SwiftMessageRejectOrder.SubType = 1;

            var temp = '/SwiftMessages/Reject';
            var cont = 'SwiftMessagesCtrl';
            var id = 'SwiftMessageReject';
            var title = 'Swift հաղորդագրության մերժում';

          

        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };
        hideloading();
        dialogService.open(id, $scope, title, temp, dialogOptions);
        }, function () {
            hideloading();
            showMesageBoxDialog('Սխալ դեբետային հաշիվ', $scope, 'error');
            
        });
    };

    $scope.getTransactionSwiftConfirmOrder = function (orderId) {
        
        var Data = swiftMessagesService.getTransactionSwiftConfirmOrder(orderId);
        Data.then(function (acc) {

            $scope.order = acc.data;
        }, function () {
            alert('Error getTransactionSwiftConfirmOrder');
        });
    };




}]);