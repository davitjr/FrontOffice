app.controller("TransfersCtrl", ['$scope', 'transfersService', 'infoService', 'utilityService', 'customerService', '$uibModal', '$filter', '$confirm', 'dialogService', 'casherService', '$rootScope', '$http', 'dateFilter', 'fastTransferPaymentOrderService', 'ReportingApiService', function ($scope, transfersService, infoService, utilityService, customerService, $uibModal, $filter, $confirm, dialogService, casherService, $rootScope, $http, dateFilter, fastTransferPaymentOrderService, ReportingApiService) {

    $rootScope.OpenMode = 3;
    $scope.transferApproveOrder = {};
    $scope.selectedTransfer = null;
    $scope.SwiftCodeType = 0;
    var DataCust = customerService.getAuthorizedCustomerNumber();
    DataCust.then(function (cust) {
        if (cust.data == undefined || cust.data == 0 || cust.data == null)
            $scope.isCustomer = false;
        else
            $scope.isCustomer = true;
    });


    var Data = infoService.GetOperationsList();
    Data.then(function (list) {
        $scope.operations = [];
        for (var key in list.data) {
            $scope.operations.push(list.data[key]);
        }
    }, function () {
        alert('error');
    });


    $scope.filter = {
        DateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        DateTo: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        SendOrReceived: $rootScope.FromReceived != undefined ? "0" : "1",
        IsCallTranasfer: '99',
        Status: "2",
        IsHBTransfer: "0",
        TransferGroup: $rootScope.FromReceived != undefined ? "3" : "0",
        TransferType: '0',
        TransferSource: "0"

        //Filial: "22000",
    };

    $scope.getTransferSource = function () {
        $scope.transferSource = [
            { id: '0', name: 'Բոլորը' },
            { id: '1', name: 'Պետ.տուրք.' }
        ];
    }


    $scope.getUserFilial = function () {

        var Data = casherService.getUserFilialCode();
        Data.then(function (user) {
            $scope.Filial = user.data;
            $scope.isCallCenter = angular.copy($scope.$root.SessionProperties.AdvancedOptions["isCallCenter"]);
            if ($scope.isCallCenter != "1")
                $scope.filter.Filial = JSON.stringify($scope.Filial);
            $scope.getTransfers();
        }, function () {
            alert('Currencies Error');
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


        $scope.searchCashiersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
    $scope.getSearchedCashier = function (cashier) {
        $scope.filter.RegisteredUserID = cashier.setNumber;
        $scope.closeSearchCashiersModal();
    }

    $scope.closeSearchCashiersModal = function () {
        $scope.searchCashiersModalInstance.close();
    }
    $scope.getTransfers = function () {

        if ($scope.filter.Quality == undefined) {
            $scope.filter.Quality = 99;
        }

        $scope.loading = true;
        $scope.transfers = null;
        $scope.showCount = false;
        $scope.TotalAmount = 0;
        $scope.transfersShow = 0;
        $scope.transfersCount = 0;
        $rootScope.FromReceived = undefined;
        var Data = transfersService.getTransferList($scope.filter);
        Data.then(function (transferList) {
            $scope.transfers = transferList.data;
            $scope.transfersShow = $scope.transfers.length;
            for (var i = 0; i < $scope.transfers.length; i++) {
                $scope.TotalAmount += $scope.transfers[i].Amount;
            }
            if ($scope.transfers.length != 0) {
                $scope.transfersCount = $scope.transfers[0].ListCount;
                if ($scope.transfersShow < $scope.transfersCount)
                    $scope.showCount = true;
            }
            else {
                $scope.transfersCount = 0;
            }
            $scope.loading = false;

            if ($scope.filter.Quality == 99) {
                $scope.filter.Quality = undefined;
            }

        },
            function (xhr) {
                $scope.loading = false;
                showMesageBoxDialog('Տեղի ունեցավ սխալ:', $scope, 'error');
                alert('Error getTransfers');
            });

    };

    $scope.getCorrespondentBankAccounts = function (transferID) {

        var Data = transfersService.getTransfer(transferID);
        Data.then(function (acc) {

            $scope.corAcc = {}
            $scope.transfer = acc.data;
            $scope.cooAccFilter = {
                TransferSystem: $scope.transfer.TransferSystem,
                Currency: $scope.transfer.Currency,
                AcbaTransfer: $scope.transfer.AcbaTransfer

            }
            var DataAcc = transfersService.getCorrespondentBankAccounts($scope.cooAccFilter);
            DataAcc.then(function (accList) {
                $scope.correspondentBankAccounts = accList.data;

                for (var i = 0; i < $scope.correspondentBankAccounts.length; i++) {
                    if ($scope.correspondentBankAccounts[i].Account == $scope.transfer.CreditAccount.AccountNumber) {
                        $scope.corAcc = $scope.correspondentBankAccounts[i];

                    }
                }
                $scope.corAcc.Account = $scope.transfer.CreditAccount.AccountNumber;
                $scope.transfer.VOCode = "02020"
            }, function () {
                alert('Error getFastTransferPaymentOrder');
            });





        },
            function () {
                $scope.loading = false;
                alert('Error getTransfers');
            });
    };
    $scope.getSendOrReceived = function () {
        $scope.sendOrReceived = [
            { id: '99', name: 'Բոլորը' },
            { id: '0', name: 'Ստացված' }
            //{ id: '1', name: 'Ուղարկված' },
            //{ id: '2', name: 'Վճարված/Չեղարկված' },
            //{ id: '3', name: 'Ուղարկված/Վերադարձված' }
        ];
    };

    $scope.getRegisterBy = function () {
        $scope.registerBy = [
            { id: '99', name: 'Բոլորը' },
            { id: '0', name: 'Ոչ Call Center' },
            { id: '1', name: 'Call Center' }];
    };
    $scope.getStatuses = function () {
        $scope.statuses = [
            { id: '0', name: 'Բոլորը' },
            { id: '1', name: 'Ձևակերպված' },
            { id: '2', name: 'Չձևակերպված' }];
    };

    $scope.getSourceTypes = function () {
        $scope.sourceTypes = [
            { id: '99', name: 'Բոլորը' },
            { id: '0', name: 'Փ/Թ' },
            { id: '2', name: 'ՀԲ' }];
    };

    $scope.getTransferTypes = function () {
        $scope.transferTypes = [
            { id: '0', name: 'Բոլորը' },
            { id: '1', name: 'Bank_Mail' },
            { id: '3', name: 'Միջազգային' },
            { id: '4', name: 'Միջ. առանց հաշվի բացման' },
            { id: '5', name: 'SberBank' }];
    };

    $scope.getTransferSystems = function () {

        var Data = infoService.getAllTransferTypes();

        Data.then(function (transferSystems) {
            $scope.transferSystems = transferSystems.data;

        },
            function () {
                alert('Error getTransferCallTypes');
            });
    };


    $scope.getTransferSessions = function () {

        if ($scope.filter.DateFrom != undefined && $scope.filter.DateTo != undefined && $scope.filter.TransferGroup != undefined) {
            var Data = infoService.getTransferSessions($scope.filter.DateFrom, $scope.filter.DateTo, $scope.filter.TransferGroup);

            Data.then(function (transferSession) {
                $scope.sessions = transferSession.data;

            },
                function () {
                    alert('Error getTransferCallTypes');
                });
        }
    };

    //Արժույթները
    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };

    $scope.getCountries = function () {

        var Data = infoService.getCountries();
        Data.then(function (country) {
            $scope.countries = country.data;
        }, function () {
            alert('countries Error');
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

    $scope.getTransferRejectReasonTypes = function () {
        var Data = infoService.getTransferRejectReasonTypes();
        Data.then(function (ref) {
            $scope.transferRejectReasonTypes = ref.data;
            $scope.transfer = $rootScope.transfer;
        }, function () {
            alert('Error getTransferRejectReasonTypes');
        });
    };

    $scope.getTransferRequestStepTypes = function () {
        var Data = infoService.getTransferRequestStepTypes();
        Data.then(function (ref) {
            $scope.transferRequestStepTypes = ref.data;
        }, function () {
            alert('Error getTransferRequestStepTypes');
        });
    };

    $scope.getTransferRequestStatusTypes = function () {
        var Data = infoService.getTransferRequestStatusTypes();
        Data.then(function (ref) {
            $scope.transferRequestStatusTypes = ref.data;
        }, function () {
            alert('Error RequestStatusTypes');
        });
    };


    $scope.rejectReasonTypeChange = function () {
        $scope.transferApproveOrder.Description = $scope.transferRejectReasonTypes[$scope.TransferRejectReasonType];
    };


    $scope.setClickedRow = function (index) {
        $scope.selectedTransfer = null;
        $scope.CanPayCash = false;
        $scope.CanPay = false;
        $scope.selectedRow = index;
        $scope.ShowTransfer = false;
        $scope.selectedTransferId = $scope.transfers[index].Id;
        var Data = transfersService.getTransfer($scope.selectedTransferId);
        Data.then(function (acc) {
            $scope.selectedTransfer = acc.data;
            $scope.ShowTransfer = true;
            if (((($scope.selectedTransfer.InstantMoneyTransfer == 1 && $scope.selectedTransfer.FilialCode == $scope.Filial && $scope.selectedTransfer.SendOrReceived == 0) || ($scope.selectedTransfer.TransferGroup == 4 && $scope.selectedTransfer.ConfirmationDate != null))
                && $scope.selectedTransfer.Quality == 0 && $scope.selectedTransfer.CashOperationDate == null && $scope.selectedTransfer.IsCallCenter != 1 && $scope.selectedTransfer.Deleted != 1 && $scope.isCallCenter != 1)
                || ($scope.selectedTransfer.IsCallCenter == 1 && $scope.isCallCenter == 1 && $scope.selectedTransfer.Quality == 0 && $scope.selectedTransfer.CashOperationDate == null && $scope.selectedTransfer.Deleted != 1)) {
                $scope.CanPay = true;
                if ($scope.selectedTransfer.AddTableName == "Tbl_transfers_by_call")
                    $scope.CanPayCash = false;
                else
                    $scope.CanPayCash = true;
            }
            else
                $scope.CanPay = false;
            $scope.params = { selectedTransferId: $scope.selectedTransferId, isCallCenter: $scope.selectedTransfer.IsCallCenter };
            $scope.TransferSystem = $scope.selectedTransfer.TransferSystem;
            $scope.AddTableName = $scope.selectedTransfer.AddTableName;
            $scope.AddTableUnicNumber = $scope.selectedTransfer.AddTableUnicNumber;
            $scope.SendOrReceived = $scope.selectedTransfer.SendOrReceived;
        }, function () {
            alert('Error getFastTransferPaymentOrder');
        });
    }


    $scope.getTransfer = function (transferID) {
        var Data = transfersService.getTransfer(transferID);
        Data.then(function (acc) {

            $scope.transfer = acc.data;
            $scope.transfer.RegistrationDate = $filter('mydate')($scope.transfer.RegistrationDate, "dd/MM/yyyy");
            $scope.transfer.SenderDateOfBirth = $filter('mydate')($scope.transfer.SenderDateOfBirth, "dd/MM/yyyy");
        }, function () {
            alert('Error getFastTransferPaymentOrder');
        });

    };






    //Միջազգային հանձնարարականի տպում
    $scope.printTransfer = function () {

        showloading();

        if ($scope.TransferSystem == 23 && $scope.SendOrReceived == 1) {     // STAK
            if ($scope.AddTableName != undefined && $scope.AddTableName != '' && $scope.AddTableUnicNumber != undefined && $scope.AddTableUnicNumber != '') {
                if ($scope.AddTableName == "Tbl_HB_documents") {

                    var DataTransfer = fastTransferPaymentOrderService.getFastTransferPaymentOrder($scope.AddTableUnicNumber);
                    DataTransfer.then(function (acc) {
                        $scope.fastTransferOrderDetails = acc.data;

                        $scope.fastTransferOrderDetails.RegistrationDate = $filter('mydate')($scope.fastTransferOrderDetails.RegistrationDate, "dd/MM/yyyy");
                        $scope.fastTransferOrderDetails.OperationDate = $filter('mydate')($scope.fastTransferOrderDetails.OperationDate, "dd/MM/yyyy");
                        $scope.fastTransferOrderDetails.SenderDateOfBirth = $filter('mydate')($scope.fastTransferOrderDetails.SenderDateOfBirth, "dd/MM/yyyy");

                        var Data = fastTransferPaymentOrderService.printSTAKSendMoneyPaymentOrder($scope.fastTransferOrderDetails);
                        Data.then(function (response) {
                            var requestObj = { Parameters: response.data, ReportName: 157, ReportExportFormat: 1 }
                            ReportingApiService.getReport(requestObj, function (result) {
                                ShowPDFReport(result);
                            });
                        }, function () {
                            alert('Error printFastTransferPaymentOrder');
                        });

                    }, function () {
                        alert('Error printTransfer');
                    });

                }
            }
        }
        else {
            var Data = transfersService.printTransfer($scope.selectedTransferId);
            Data.then(function (response) {
                var reportId = 0;
                var result = angular.fromJson(response.data.result);
                var transfer = angular.fromJson(response.data.transfer);
                if (transfer.TransferGroup == 3 && transfer.SendOrReceived == 1) {

                    reportId = 76;
                }
                else {
                    if (transfer.TransferGroup == 1 || transfer.TransferGroup == 4) {
                        reportId = 63;
                    }
                    else {
                        if (transfer.TransferGroup == 3 || transfer.TransferSystem == 1) {
                            reportId = 109;
                        }
                    }
                }
                var requestObj = { Parameters: result, ReportName: reportId, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error printTransfer');
            });
        }

    };



    $scope.confirm = false;
    $scope.confirmTransfer = function () {
        if ($http.pendingRequests.length == 0) {
            var Data1 = transfersService.getTransfer($scope.selectedTransferId);
            showloading();
            Data1.then(function (transfer) {
                var Data = transfersService.confirmTransfer(transfer.data, $scope.confirm);
                Data.then(function (res) {
                    hideloading();
                    $scope.confirm = false;
                    $scope.ResultCode = res.data.ResultCode;
                    if (res.data.ResultCode == 6) {
                        $scope.showError = true;
                        $scope.error = res.data.Errors;
                        $scope.validateWarnings = res.data.Errors;
                        //showMesageBoxDialog('aaaa', $scope, 'information');
                        //ShowMessage($scope.error[0].Description, 'error', $scope.path);
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.confirmTransfer);
                    }
                    else if (res.data.ResultCode == 4) {
                        $scope.showError = true;
                        $scope.error = res.data.Errors;
                        ShowMessage($scope.error[0].Description, 'error', $scope.path);
                    }
                    else if (res.data.ResultCode == 7) { /*STAK համակարգի դեպքում հաջող ավարտ*/
                        $scope.showError = true;
                        $scope.error = res.data.Errors;
                        ShowMessage($scope.error[0].Description, 'information', $scope.path);
                    }
                    else {
                        //  document.getElementById("interLoad").classList.add("hidden");
                        $scope.getTransfers();
                        //CloseBPDialog('internationalpaymentorder');
                        //$scope.path = '#Orders';
                        //showMesageBoxDialog(°'Ձևակերպված է', $scope, 'information');
                        //refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                    }

                }, function () {
                    //$scope.confirm = false;
                    //document.getElementById("interLoad").classList.add("hidden");
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in confirmTransfer');
                });
            }, function () {
                hideloading();
                alert('Error confirmTransfer');
            });

        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Ձևակերպել>> կոճակը:', 'error');
        }


    };

    $scope.getApprovedTransfer = function (transferID) {
        var Data = transfersService.getApprovedTransfer(transferID);
        Data.then(function (acc) {

            $scope.approvedTransfer = acc.data;

        }, function () {
            alert('Error getApprovedTransfer');
        });

    };
    $scope.deleteTransfer = function () {
        var Data1 = transfersService.getTransfer($scope.selectedTransferId);
        Data1.then(function (transfer) {
            var Data = transfersService.deleteTransfer(transfer.data.Id, $scope.deleteDescription, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                $scope.ResultCode = res.data.ResultCode;
                if (res.data.ResultCode == 6) {
                    $scope.showError = true;
                    $scope.error = res.data.Errors;
                    $scope.validateWarnings = res.data.Errors;
                    //showMesageBoxDialog('aaaa', $scope, 'information');
                    //ShowMessage($scope.error[0].Description, 'error', $scope.path);
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.deleteTransfer);
                }
                else if (res.data.ResultCode == 4) {
                    $scope.showError = true;
                    $scope.error = res.data.Errors;
                    ShowMessage($scope.error[0].Description, 'error', $scope.path);
                }
                else {
                    //  document.getElementById("interLoad").classList.add("hidden");
                    if ($scope.isCallCenter == 1)
                        CloseBPDialog('TransferDelete');
                    $scope.getTransfers();
                    //CloseBPDialog('internationalpaymentorder');
                    //$scope.path = '#Orders';
                    //showMesageBoxDialog(°'Ձևակերպված է', $scope, 'information');
                    //refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                }

            }, function () {
                //$scope.confirm = false;
                //document.getElementById("interLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in deleteTransfer');
            });
        }, function () {
            alert('Error deleteTransfer');
        });




    };

    $scope.setCurrentDate = function () {
        $scope.ValueDate = new Date();
    }

    $scope.checkSwitcher = function () {
        if (($scope.TransactionType26 != undefined && $scope.TransactionType26.length == 3) || $scope.TransactionType26 == undefined) {
            $scope.switch = true;
        }
        else {
            $scope.switch = false;
        }
    }

    $scope.approveTransfer = function () {

        if ($http.pendingRequests.length == 0) {

            $scope.transferApproveOrder.Type = 134;
            //$scope.transferApproveOrder.SubType = subType;
            if ($scope.transferApproveOrder.SubType == 1)
                if ($scope.corAcc.Account != $scope.transfer.CreditAccount.AccountNumber) {
                    $scope.transfer.CreditAccount = {};
                    $scope.transfer.CreditAccount.AccountNumber = $scope.corAcc.Account;
                }
            $scope.transferApproveOrder.transfer = $scope.transfer;
            if ($scope.transferApproveOrder.transfer.MT == 202 || $scope.transferApproveOrder.transfer.MT == 103) {

                if ($scope.ValueDate == undefined)
                    $scope.ValueDate = new Date();

                $scope.transferApproveOrder.ValueDate = $scope.ValueDate;
            }
            if ($scope.transferApproveOrder.transfer.MT == 103 && $scope.transferApproveOrder.transfer.Currency == 'RUR') {
                $scope.transferApproveOrder.TransactionType26 = $scope.TransactionType26;
                $scope.transferApproveOrder.AccountAbility77B = $scope.AccountAbility77B;
            }
            var Data = transfersService.approveTransfer($scope.transferApproveOrder, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                $scope.ResultCode = res.data.ResultCode;
                if (res.data.ResultCode == 6) {
                    $scope.showError = true;
                    $scope.error = res.data.Errors;
                    $scope.validateWarnings = res.data.Errors;
                    //showMesageBoxDialog('aaaa', $scope, 'information');
                    //ShowMessage($scope.error[0].Description, 'error', $scope.path);
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.approveTransfer);
                }
                else if (res.data.ResultCode == 4) {
                    $scope.showError = true;
                    $scope.error = res.data.Errors;
                    ShowMessage($scope.error[0].Description, 'error', $scope.path);
                }
                else {
                    //  document.getElementById("interLoad").classList.add("hidden");
                    CloseBPDialog('TransferApprove');
                    $scope.getTransfers();
                    //CloseBPDialog('internationalpaymentorder');
                    //$scope.path = '#Orders';
                    //showMesageBoxDialog(°'Ձևակերպված է', $scope, 'information');
                    //refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                }

            }, function () {
                //$scope.confirm = false;
                //document.getElementById("interLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in deleteTransfer');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }




    };


    $scope.searchSwiftCodes = function (swiftCodeType) {
        $scope.SwiftCodeType = swiftCodeType;
        $scope.searchSwiftCodesModalInstance = $uibModal.open({
            template: '<searchswiftcode callback="getSearchedSwiftCode(swiftCode)" close="closeSearchSwiftCodesModal()"></searchswiftcode>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });

        $scope.searchSwiftCodesModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getSearchedSwiftCode = function (swiftCode) {
        if ($scope.SwiftCodeType == 2) {
            $scope.transfer.ReceiverBankSwift = swiftCode;
            $scope.ReceiverBankSwiftChange();
        }
        else if ($scope.SwiftCodeType == 1) {
            $scope.transfer.IntermediaryBankSwift = swiftCode;
            $scope.intermediaryBankSwiftChange();
        }
        else if ($scope.SwiftCodeType == 3) {
            $scope.transfer.ReceiverSwift = swiftCode;

        }
        $scope.closeSearchSwiftCodesModal();
        $scope.receiverSwiftChange();
    }

    $scope.closeSearchSwiftCodesModal = function () {
        $scope.searchSwiftCodesModalInstance.close();
    }



    $scope.ReceiverBankSwiftChange = function () {
        if ($scope.transfer.ReceiverBankSwift != undefined) {
            if ($scope.transfer.ReceiverBankSwift.length == 8)
                $scope.transfer.ReceiverBankSwift = $scope.transfer.ReceiverBankSwift + "XXX";

            var Data = infoService.getInfoFromSwiftCode($scope.transfer.ReceiverBankSwift, 1);

            Data.then(function (result) {
                $scope.transfer.ReceiverBank = result.data;

            }, function () {
                alert('Error in ReceiverBankSwiftChange');
            });
        }
    }


    $scope.intermediaryBankSwiftChange = function () {
        if ($scope.transfer.IntermediaryBankSwift != undefined) {
            if ($scope.transfer.IntermediaryBankSwift.length == 8)
                $scope.transfer.IntermediaryBankSwift = $scope.transfer.IntermediaryBankSwift + "XXX";
            var Data = infoService.getInfoFromSwiftCode($scope.transfer.IntermediaryBankSwift, 1);

            Data.then(function (result) {
                $scope.transfer.IntermediaryBank = result.data;

            }, function () {
                alert('Error in intermediaryBankSwiftChange');
            });
        }

    }

    $scope.receiverSwiftChange = function () {
        if ($scope.transfer.ReceiverSwift != undefined) {
            if ($scope.transfer.ReceiverSwift.length == 8)
                $scope.transfer.ReceiverSwift = $scope.transfer.ReceiverSwift + "XXX";
            var Data = infoService.getInfoFromSwiftCode($scope.transfer.ReceiverSwift, 1);

            Data.then(function (result) {
                $scope.transfer.Receiver = result.data;

            }, function () {
                alert('Error in receiverSwiftChange');
            });
        }

    }
    $scope.showModalOrder = function () {
        $scope.error = "";

        var temp = '/Transfers/TransferDetails';
        var cont = 'TransfersCtrl';
        var id = 'TransferDetails';
        var title = 'Փոխանցման մանրամասներ';



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

    $scope.showApproveTransfer = function () {
        $scope.error = "";

        var temp = '/Transfers/TransferApprove';
        var cont = 'TransfersCtrl';
        var id = 'TransferApprove';
        var title = 'Փոխանցման հաստատում';



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

    $scope.showRejectTransfer = function () {
        $scope.error = "";

        var temp = '/Transfers/TransferReject';
        var cont = 'TransfersCtrl';
        var id = 'TransferReject';
        var title = 'Փոխանցման չեղարկում';



        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };
        $rootScope.transfer = $scope.transfer;
        dialogService.open(id, $scope, title, temp, dialogOptions);
    };
    //$scope.payWithConvertation = function () {
    //    $scope.error = "";

    //    var temp = '/CurrencyExchangeOrder/PersonalCurrencyExchangeOrder';
    //    var cont = 'CurrencyExchangeOrderCtrl';
    //    var id = 'exchangeOrderForm';
    //    var title = 'Փոխանցման մանրամասներ'



    //    var dialogOptions = {
    //        callback: function () {
    //            if (dialogOptions.result !== undefined) {
    //                cust.mncId = dialogOptions.result.whateverYouWant;
    //            }
    //        },
    //        result: {}
    //    };

    //    dialogService.open(id, $scope, title, temp, dialogOptions)
    //};

    $scope.getTransferAttachmentInfo = function (transferID) {
        var Data = transfersService.getTransferAttachmentInfo(transferID);
        Data.then(function (ord) {
            $scope.attachment = ord.data;
        }, function () {
            alert('Error TransferAttachments');
        });
    };

    $scope.getTransferAttachment = function (id, extension) {

        var Data = transfersService.getTransferAttachment(id);

        Data.then(function (dep) {
            if (extension != 'pdf') {
                var file = new Blob([dep.data], { type: 'image/jpeg' });
            }
            else {
                var file = new Blob([dep.data], { type: 'application/pdf' });
            }

            var fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        }, function () {

            alert('Error ');
        });
    };

    $scope.showTransferCriminalCheckResults = function (transfer) {
        var Data = transfersService.getTransferCriminalLogId(transfer.Id);
        Data.then(function (acc) {
            $scope.params = { criminalLogId: acc.data, transfer: transfer };

            $scope.error = "";

            var temp = '/Criminals/CriminalCheckResults';
            var cont = 'CriminalsCtrl';
            var id = 'CriminalsList';
            var title = 'Տվյալների համընկնում կասկածելի անձանց ցուցակի հետ';



            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.open(id, $scope, title, temp, dialogOptions);

        }, function () {
            alert('Error showTransferCriminalCheckResults');
        });
    };



    //Վճարված փոխանցումների տպում
    $scope.printPaidTransfers = function () {
        var startDate, endDate, transferSystem = 0, filial;
        if ($scope.filter.TransferSystem != undefined && $scope.filter.TransferSystem != '') {
            transferSystem = $scope.filter.TransferSystem;
        }
        if ($scope.filter.DateFrom != undefined)
            startDate = dateFilter($scope.filter.DateFrom, 'yyyy/MM/dd');
        if ($scope.filter.DateFrom != undefined)
            endDate = dateFilter($scope.filter.DateTo, 'yyyy/MM/dd');
        if ($scope.filter.Filial != undefined)
            filial = $scope.filter.Filial;

        showloading();
        var Data = transfersService.printPaidTransfers(startDate, endDate, transferSystem, filial);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 113, ReportExportFormat: 2 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowExcelReport(result, 'SwiftTransferMessage');
            });
        }, function () {
            alert('Error printPaidTransfers');
        });

    };


    //Վճարման հանձնարարագրերի ամփոփ հաշվետվություն
    $scope.printBankMailTransfers = function () {
        var startDate, endDate,
            receiverName = $scope.filter.Receiver,
            transferGroup = $scope.filter.TransferGroup,
            transferType = $scope.filter.TransferSystem,
            confirmationSetNumber = $scope.filter.RegisteredUserID,
            session = $scope.filter.Session,
            amount = $scope.filter.Amount,
            confirmStatus = $scope.filter.TransferRequestStatus,
            mainFilial = $scope.filter.Filial;

        if (receiverName == undefined) receiverName = '';
        if (transferGroup == '' || transferGroup == undefined) transferGroup = "0";
        if (transferType == '' || transferType == undefined) transferType = "0";
        if (confirmationSetNumber == undefined) confirmationSetNumber = 0;
        if (session == undefined) session = 0;
        if (amount == undefined) amount = 0;
        if (confirmStatus == undefined) confirmStatus = 0;
        if (mainFilial == undefined || mainFilial == '') mainFilial = 0;

        if ($scope.filter.DateFrom != undefined)
            startDate = dateFilter($scope.filter.DateFrom, 'yyyy/MM/dd');
        if ($scope.filter.DateFrom != undefined)
            endDate = dateFilter($scope.filter.DateTo, 'yyyy/MM/dd');

        showloading();
        var Data = transfersService.printBankMailTransfers(startDate, endDate, receiverName, transferGroup, transferType, confirmationSetNumber, session, amount, confirmStatus, mainFilial);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 114, ReportExportFormat: 2 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowExcelReport(result, 'BankMailTransfers');
            });
        }, function () {
            alert('Error printBankMailTransfers');
        });

    };


    $scope.TransferDeleteReason = function () {
        if ($http.pendingRequests.length == 0) {

            $scope.error = "";

            var temp = '/Transfers/TransferDelete';
            var cont = 'TransferDeleteCtrl';
            var id = 'TransferDelete';
            var title = 'Փոխանցման հեռացում';



            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };
            $scope.transferDeleteOrder = [];
            $scope.transferDeleteOrder.transferID = $scope.selectedTransferId;
            $scope.transferDeleteOrder.isCallCenter = $scope.isCallCenter;

            dialogService.open(id, $scope, title, temp, dialogOptions);
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Հեռացնել>> կոճակը:', 'error');

        }
    };

    $scope.getQualities = function () {
        $scope.qualities = [
            { id: '4', name: 'Վճարված/Չեղարկված' },
            { id: '3', name: 'Ուղարկված/Վերադարձված' }];
    };

    $scope.sendSTAKResponseConfirm = function (docID) {

        if (docID != null && docID != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ուղարկել SMS ծանուցում' })
                .then(function () {
                    var Data = transfersService.responseConfirmForSTAK(docID);
                    Data.then(function (res) {
                        if (validate($scope, res.data)) {
                            ShowMessage('SMS ծանուցումն ուղարկված է', 'information', $scope.path);
                        }
                        else {
                            document.getElementById("sendSTAKResponseConfirmLoad").classList.add("hidden");
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        }
                    },
                        function () {
                            document.getElementById("sendSTAKResponseConfirmLoad").classList.add("hidden");
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            alert('Error sendSTAKResponseConfirm');
                        });
                });
        };
    };
    //պետ տուրք
    $scope.paymentOrderWithStateDutiesMark = function () {
        debugger;
        showloading();
        var Data = transfersService.paymentOrderWithStateDutiesMark($scope.selectedTransferId);
        Data.then(function (response) {
            var result = angular.fromJson(response.data.result);
            var requestObj = { Parameters: result, ReportName: 162, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
            hideloading();
        }, function () {
            alert('Error paymentOrderWithoutStateDutiesMark');
        });

    };

    $scope.paymentOrderWithoutStateDutiesMark = function () {
        debugger;
        showloading();

        var Data = transfersService.paymentOrderWithoutStateDutiesMark($scope.selectedTransferId);
        Data.then(function (response) {

            var result = angular.fromJson(response.data.result);

            var requestObj = { Parameters: result, ReportName: 162, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
            hideloading();
        }, function () {
            alert('Error paymentOrderWithoutStateDutiesMark');
        });

    };

}]);