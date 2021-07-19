app.controller('CashBookCtrl', ['$scope', 'dialogService', '$confirm', '$uibModal', 'customerService', 'casherService', 'infoService', 'cashBookService', '$rootScope', 'utilityService', '$filter', 'accountService', '$http', 'orderService', '$q', function ($scope, dialogService, $confirm, $uibModal, customerService, casherService, infoService, cashBookService, $rootScope, utilityService, $filter, accountService, $http, orderService, $q) {

    $scope.partialAmount = 0;
    $scope.isPartially = false;
    $rootScope.OpenMode = 1;
    $scope.report = {};
    $scope.report.nocurrency = false;
    $scope.report.nofilial = false;
    $scope.report.nosetnumber = false;

    if ($scope.linked_cashBook != undefined) {
        $scope.linkedCashBook = angular.copy($scope.linked_cashBook);
    }

    if ($scope.linkedCashBook != undefined && $scope.linkedCashBook.Type != undefined) {
        $scope.linkedCashBookType = angular.copy($scope.linkedCashBook.Type);
    }

    $scope.checkPartially = function (param) {
        $scope.isPartially = param;
    }

    $scope.searchParams = {
        FillialCode: null,
        RegistrationDate: null,
        RegisteredUserID: null,
        Currency: null,
        Type: null,
        Quality: null,
        OperationType: null,
        UserID: null,

    };

    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error getFilialList');
        });
    };

    $scope.getCurrencies = function () {
        var Data = cashBookService.getCurrencies();
        Data.then(function (ref) {
            $scope.currencies = ref.data;
        }, function () {
            alert('Error getCurrencies');
        });
    };

    $scope.initCashBook = function () {
        $scope.RegistrationDate = new Date();
        var Data = casherService.getUserID();
        Data.then(function (user) {
            $scope.RegisteredUserID = user.data;
        }, function () {
            alert('Error');
        });
        //$scope.RowType = {};
        //$scope.OperationType = {};
        $scope.amounts = [];
        $scope.description = '';
        var Data = cashBookService.getCurrencies();
        Data.then(function (ref) {
            $scope.currencies = ref.data;
            for (var i = 0; i < $scope.currencies.length; i++) {
                amount = { currency: $scope.currencies[i], amount: 0 };
                $scope.amounts.push(amount);
            }
            if ($scope.linkedCashBook != undefined) {
                for (var i = 0; i < $scope.amounts.length; i++) {
                    if ($scope.amounts[i].currency == $scope.linkedCashBook.Currency) {
                        $scope.amounts[i].amount = $scope.linkedCashBook.Amount;
                        $scope.RowType = $scope.linkedCashBook.Type + 1;
                        $scope.OperationType = $scope.linkedCashBook.OperationType == 1 ? 2 : 1;
                        $scope.LinkedRowID = $scope.linkedCashBook.ID;
                        $scope.BankVault = true;
                        $scope.CorrespondentSetNumber = 0;
                    }
                }
            }
            else {
                var Data = cashBookService.getCorrespondentSetNumber();
                Data.then(function (user) {
                    $scope.CorrespondentSetNumber = user.data;
                }, function () {
                    alert('Error');
                });
            }
        }, function () {
            alert('Error getCurrencies');
        });



    };

    $scope.getOperationTypes = function (forInput) {
        var Data = cashBookService.getOperationTypes(forInput);
        Data.then(function (ref) {
            $scope.OperationTypes = ref.data;
        }, function () {
            alert('Error getOperationTypes');
        });
    };


    $scope.getCashBooks = function () {
        $scope.loading = true;
        var Data = cashBookService.getCashBooks($scope.searchParams);
        Data.then(function (cashBooks) {
            $scope.cashBooks = cashBooks.data;
            $scope.isAnyUnConfirmedCashBook = false;
            for (var i = 0; i < $scope.cashBooks.length; i++) {
                if (($scope.cashBooks[i].Quality == 0 && $scope.cashBooks[i].CorrespondentSetNumber == $scope.UserID)
                    || ($scope.SessionProperties.AdvancedOptions.canApproveCashBookSurplusDeficit == '1' && $scope.cashBooks[i].Quality == 0 && ($scope.cashBooks[i].Type == 2 || $scope.cashBooks[i].Type == 4))
                ) {
                    $scope.isAnyUnConfirmedCashBook = true;
                    break;
                }
            }
            $scope.loading = false;
            $scope.getTotal();
            $scope.getRest();

            scope = angular.element(document.getElementById('CashBookForm')).scope();
            if (scope != undefined) {
                scope.report.nocurrency = false;
                scope.report.nofilial = false;
                scope.report.nosetnumber = false;
            }
            $scope.isCheckCashBooks = false;
            $scope.isCheckAnyCashBook = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCashBooks');
        });
    };

    $scope.getRowTypes = function (forInput) {
        $scope.loading = true;
        //var Data = undefined;
        //if ($scope.linkedCashBook != undefined) {
        //    Data = cashBookService.getRowTypes(forInput, true);
        //}
        //else {
        //    Data = cashBookService.getRowTypes(forInput, false);
        //}
        Data = cashBookService.getRowTypes();
        Data.then(function (rowTypes) {

            $scope.rowTypes = rowTypes.data;

            if (forInput == true) {
                delete $scope.rowTypes['2'];
                delete $scope.rowTypes['4'];
            }
            else if ($scope.searchParams != undefined) {
                $scope.searchParams.rowType = '0';
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getRowTypes');
        });
    };

    $scope.setRowTypesForOtherFilial = function () {
        if ($scope.searchParams.rowType == '0') {
            $scope.searchParams.FillialCode = $scope.userFilialCode;
        }
    };


    $scope.GetCashBookQualityTypes = function () {
        var Data = infoService.GetCashBookQualityTypes();
        Data.then(function (qualities) {
            $scope.QualityTypes = qualities.data;
        }, function () {
            alert('Error getQualityTypes');
        });
    };


    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
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
        $scope.searchParams.RegisteredUserID = cashier.setNumber;
        $scope.closeSearchCashiersModal();
    };

    $scope.closeSearchCashiersModal = function () {
        $scope.searchCashiersModalInstance.close();
    };

    $scope.getUserID = function () {
        var Data = casherService.getUserID();
        Data.then(function (user) {
            $scope.searchParams.RegisteredUserID = user.data;
            $scope.UserID = $scope.searchParams.RegisteredUserID;
            $scope.getCurrentOperDay();
        }, function () {
            alert('Error');
        });
    };


    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.SaveAndApprove = function () {

        if ($scope.RowType == 1 || $scope.RowType == 3) {
            $scope.order.Type = 139;
        } else {
            $scope.order.Type = 140;
        }

        $scope.order.SubType = 1;

        cashBooks = [];

        for (var i = 0; i < $scope.amounts.length; i++) {
            if ($scope.amounts[i].amount != 0) {
                cashBook = {
                    Currency: $scope.amounts[i].currency,
                    Amount: $scope.amounts[i].amount,
                    Type: $scope.RowType,
                    OperationType: $scope.OperationType,
                    Description: $scope.description,
                    LinkedRowID: $scope.LinkedRowID,
                    CorrespondentSetNumber: $scope.CorrespondentSetNumber
                };
                cashBooks.push(cashBook);
            }
        }

        document.getElementById("inputCashBookLoad").classList.remove("hidden");

        $scope.order.CashBooks = cashBooks;
        var Data = cashBookService.SaveAndApprove($scope.order);

        Data.then(function (res) {
            if (validate($scope, res.data)) {
                document.getElementById("inputCashBookLoad").classList.add("hidden");
                CloseBPDialog('inputCashBook');
                showMesageBoxDialog('Գործողությունը կատարված է', $scope, 'information');
                scope = angular.element(document.getElementById('CashBookForm')).scope();
                scope.getCashBooks();
            }
            else {
                document.getElementById("inputCashBookLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            document.getElementById("inputCashBookLoad").classList.add("hidden");
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };
    //*********************************************************

    $scope.generateNewOrderNumber = function () {
        var orderNumberType = 1;
        var Data = orderService.generateNewOrderNumber(orderNumberType);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    $scope.saveCashBookOrder = function () {

        if ($http.pendingRequests.length == 0) {
            if ($scope.disabled == true) {

                $scope.order.Type = 149;
                $scope.linkedCashBook.Amount = $scope.order.Amount

            }
            else {

                //if ($scope.partialAmount == 0 || $scope.partialAmount == undefined) {
                //	return ShowMessage('Մուտքագրված գումարը չի կարող լինել դատարկ կամ 0 :', 'error');
                //}
                //else if ($scope.partialAmount >= $scope.linkedCashBook.Amount - $scope.MaturedAmount) {
                //	return ShowMessage('Մուտքագրված գումարը չի կարող գերազանցել կամ հավասար լինել ամբողջ գումարին:','error')
                //}

                $scope.order.Type = 200;
                $scope.linkedCashBook.Amount = $scope.partialAmount;

            }
            $scope.order.SubType = 1;
            var cashBooks = [];

            if (($scope.linkedCashBook.Type == 1 || $scope.linkedCashBook.Type == 3) && $scope.$root.SessionProperties.AdvancedOptions.isHeadCashBook == '1') {
                $scope.linkedCashBook.FillialCode = $scope.filialCodeForClose;
            }

            switch ($scope.linkedCashBook.OperationType) {
                case 1:
                    $scope.linkedCashBook.OperationType = 2;
                    break;
                case 2:
                    $scope.linkedCashBook.OperationType = 1;
                    break;
            }

            if ($scope.linkedCashBook.Type == 1) {
                $scope.linkedCashBook.Type = 2;
            }
            else if ($scope.linkedCashBook.Type == 3) {
                $scope.linkedCashBook.Type = 4;
            }

            $scope.order.CorrespondentAccountType = $scope.correspondentAccountType;

            cashBooks.push($scope.linkedCashBook);

            document.getElementById("cashBookOrdertLoad").classList.remove("hidden");

            $scope.order.CashBooks = cashBooks;
            var Data = cashBookService.SaveAndApprove($scope.order);

            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("cashBookOrdertLoad").classList.add("hidden");
                    CloseBPDialog('newCashBookOrder');
                    showMesageBoxDialog('Գործողությունը կատարված է', $scope, 'information');
                    scope = angular.element(document.getElementById('CashBookForm')).scope();
                    scope.getCashBooks();


                }
                else {
                    document.getElementById("cashBookOrdertLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function () {
                document.getElementById("cashBookOrdertLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
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

        if ($scope.linkedCashBookType == 1) {
            $scope.order.CreditAccount = selectedAccount;
        }
        else if ($scope.linkedCashBookType == 3) {
            $scope.order.DebitAccount = selectedAccount;
        }
        $scope.closeSearchAccountsModal();
    }

    $scope.closeSearchAccountsModal = function () {
        if ($scope.searchAccountsModalInstance != undefined)
            $scope.searchAccountsModalInstance.close();
    }


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
        if ($scope.searchCardsModalInstance != undefined) {
            $scope.searchCardsModalInstance.close();
        }
    };

    $scope.getSearchedCard = function (selectedCard) {

        if ($scope.linkedCashBookType == 1) {
            $scope.order.CreditAccount = selectedCard.CardAccount;
            $scope.order.CreditAccount.Description = selectedCard.CardAccount.AccountDescription;
        }
        else if ($scope.linkedCashBookType == 3) {
            $scope.order.DebitAccount = selectedCard.CardAccount;
            $scope.order.DebitAccount.Description = selectedCard.CardAccount.AccountDescription;

        }
        $scope.closeSearchCardsModal();
    }


    $scope.getAccountByAccountNumber = function (receiverAccountAccountNumber) {
        $scope.receiverAccountAccountNumber = receiverAccountAccountNumber;
        if ($scope.receiverAccountAccountNumber != undefined && $scope.receiverAccountAccountNumber != "") {
            if ($scope.receiverAccountAccountNumber.toString().substring(0, 5) >= 22000 && $scope.receiverAccountAccountNumber.toString().substring(0, 5) < 22300) {
                $scope.hasaccount = true;
                $scope.searchParams = {
                    accountNumber: $scope.receiverAccountAccountNumber,
                    customerNumber: "",
                    currency: "",
                    sintAcc: "",
                    sintAccNew: "",
                    filialCode: 0,
                    isCorAcc: false,
                    includeClosedAccounts: false,
                };

                var Data = accountService.getSearchedAccounts($scope.searchParams);
                Data.then(function (acc) {
                    if (acc.data.length > 0) {
                        $scope.getSearchedAccounts(acc.data[0]);
                    }
                    else {
                        $scope.order.ReceiverAccount = undefined;
                        $scope.hasaccount = false;
                    }
                }, function () {
                    alert('Error in getSearchedAccounts');
                });

            }
            else {
                $scope.order.ReceiverAccount = undefined;
                $scope.hasaccount = false;
            }
        }


    };

    $scope.getCurrenciesForOrder = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };






    $scope.getPersonalPaymentOrderDetails = function (isCopy, isInputCashBook) {
        if ($scope.disabled == true) {

            $scope.order.Type = 149;

        }
        else {
            $scope.order.Type = 200;
        }
        if (isInputCashBook != true) {
            $scope.order.SubType = 1;
            $scope.order.CorrespondentAccountType = $scope.correspondentAccountType;
            showloading();
            var Data = casherService.getUserID();
            Data.then(function (user) {


                var userID = $scope.linkedCashBook.RegisteredUserID;
                var dateString = $filter('mydate')($scope.linkedCashBook.RegistrationDate, "dd/MM/yyyy").toString("dd/MM/yyyy");

                if ($scope.linkedCashBookType == 1) {
                    $scope.order.Description =
                        dateString + " -ին, " + userID.toString() + " ՊԿ -ի մոտ հայտնաբերված ավելցուկի գումար";
                }
                else if ($scope.linkedCashBookType == 3) {
                    $scope.order.Description =
                        dateString + " -ին, " + userID.toString() + " ՊԿ -ի մոտ հայտնաբերված պակասորդ գումար";
                }

                if ($scope.linkedCashBookType == 1) {
                    if ($scope.order.Type == 200) {
                        $scope.order.Amount = $scope.partialAmount;
                    }
                    var Data = cashBookService.getCashOutPaymentOrder($scope.order, isCopy);
                    ShowPDF(Data);
                }
                else if ($scope.linkedCashBookType == 3 && $scope.correspondentAccountType == 1) {
                    if ($scope.order.Type == 200) {
                        $scope.order.Amount = $scope.partialAmount;
                    }

                    var Data = cashBookService.getPaymentOrderDetails($scope.order, isCopy);
                    ShowPDF(Data);

                }
                else if ($scope.linkedCashBookType == 3) {
                    if ($scope.order.Type == 200) {
                        $scope.order.Amount = $scope.partialAmount;
                    }

                    var Data = cashBookService.getCashInPaymentOrderDetails($scope.order, isCopy);
                    ShowPDF(Data);

                }
            }, function () {
                hideloading();
                alert('Error');
            });

        }
        else {

            showloading();
            $scope.order.Type = 139;
            $scope.order.SubType = 1;
            var check = false;
            for (var i = 0; i < $scope.currencies.length; i++) {
                if ($scope.amounts[i].currency == $scope.selectedCurrency) {
                    $scope.order.Amount = $scope.amounts[i].amount;
                    $scope.order.Currency = $scope.selectedCurrency;
                }
            }
            var cashBook = {};
            var cashBooks = [];
            var hasAmount = false;
            for (var i = 0; i < $scope.amounts.length; i++) {
                if ($scope.amounts[i].amount != 0) {
                    cashBook = {
                        Currency: $scope.amounts[i].currency,
                        Amount: $scope.amounts[i].amount,
                        Type: $scope.RowType,
                        OperationType: $scope.OperationType,
                        Description: $scope.description,
                        LinkedRowID: $scope.LinkedRowID
                    };
                    hasAmount = true;
                }
            }
            if (!hasAmount) {
                hideloading();
                return ShowMessage('Գումարը մուտքագրված չէ:', 'error');
            }
            cashBooks.push(cashBook);
            $scope.order.CashBooks = cashBooks;

            var Data = cashBookService.getCashBookOpperson();
            Data.then(function (opp) {
                $scope.order.OPPerson = opp.data;


                var Data = casherService.getUserID();
                Data.then(function (user) {

                    var userID = user.data;
                    var date = new Date();
                    var dateString = date.toString("dd/MM/yyyy");


                    if ($scope.RowType == 1) {
                        $scope.order.Description = dateString + " ՊԿ " + userID.toString() + " -ի մոտ հայտնաբերված ավելցուկի մուտքագրում";
                    }
                    else if ($scope.RowType == 3) {
                        $scope.order.Description = dateString + " ՊԿ " + userID.toString() + " -ի մոտ հայտնաբերված պակասորդ մուտքագրում";
                    }

                    if ($scope.RowType == 1) {

                        var Data = cashBookService.getCashInPaymentOrderDetails($scope.order, isCopy);
                        ShowPDF(Data);
                    }
                    else if ($scope.RowType == 3) {
                        var Data = cashBookService.getCashOutPaymentOrder($scope.order, isCopy);
                        ShowPDF(Data);

                    }

                    $scope.order.OPPerson = null;
                    $scope.order.CashBooks = null;

                }, function () {
                    alert('Error');
                });




            }, function () {
                alert('Error getQualityTypes');
            });


        }


    }

    //******************************************************

    $scope.removeCashBook = function (cashBookID) {
        if (cashBookID != null && cashBookID != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                .then(function () {
                    showloading();
                    var Data = cashBookService.removeCashBook(cashBookID);
                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data) && res.data.ResultCode != 5) {
                            $scope.getCashBooks();
                            ShowToaster('Գործողությունը կատարված է', 'success');
                        }
                        else {
                            $scope.showError = true;
                            showMesageBoxDialog($scope.error[0].Description, 'error');
                        }
                    }, function () {
                        hideloading();
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                    });
                });
        };
    };


    $scope.getTotal = function () {
        $scope.TotalDebit = 0;
        $scope.TotalCredit = 0;

        if ($scope.searchParams.Currency != null && $scope.searchParams.Currency != undefined) {
            for (var i = 0; i < $scope.cashBooks.length; i++) {
                if ($scope.cashBooks[i].Quality == 2) {
                    if ($scope.cashBooks[i].OperationType == 1) {
                        $scope.TotalDebit += $scope.cashBooks[i].Amount;
                    }
                    else {
                        $scope.TotalCredit += $scope.cashBooks[i].Amount;
                    }
                }
            }
        }
    };


    $scope.UpdateOperationType = function () {
        switch ($scope.RowType) {
            case 0:
            case '0':
                $scope.OperationType = 1;
                break;
            case 1:
            case '1':
                $scope.OperationType = 1;
                break;
            case 2:
            case '2':
                $scope.OperationType = 2;
                break;
            case 3:
            case '3':
                $scope.OperationType = 2;
                break;
            case 4:
            case '4':
                $scope.OperationType = 1;
                break;
        }
        if ($scope.RowType == 1 || $scope.RowType == 3) {
            //for (var i = 0; i < $scope.currencies.length; i++) {
            //    $scope.amounts[i].amount = 0;
            //}
            $scope.selectedCurrency = undefined;
            $scope.checkSelected();
            $scope.CorrespondentSetNumber = 0;
        }
        else if ($scope.RowType == 0) { $scope.CorrespondentSetNumber = $scope.corSetNumber; }
        if ($scope.SessionProperties.AdvancedOptions.isHeadCashBook == '1') {
            if ($scope.RowType == 1 || $scope.RowType == 3) {
                $scope.CorrespondentSetNumber = 0;
                $("#cashBookSetnumber").prop('disabled', true);
                $("#searchBtn").prop('disabled', true);
                $("#bunkerChk").prop("checked", true);
                $("#bunkerChk").prop("disabled", true);
            }
            if ($scope.RowType == 0) {
                $("#cashBookSetnumber").prop('disabled', false);
                $("#searchBtn").prop('disabled', false);
                $("#bunkerChk").prop("checked", false);
                $("#bunkerChk").prop("disabled", false);
            }
        }
    };

    $scope.getRest = function () {
        $scope.rest = {};

        var Data = cashBookService.getRest($scope.searchParams);
        Data.then(function (rest) {
            $scope.rest = rest.data;
        }, function () {
            alert('Error getRest');
        });
    };

    $scope.GetCashBookSummary = function () {
        showloading();
        scope = angular.element(document.getElementById('CashBookForm')).scope();
        if (scope.searchParams.SearchUserID == undefined || scope.searchParams.SearchUserID == null) {
            scope.searchParams.SearchUserID = 0;
        }
        var Data = cashBookService.GetCashBookSummary(scope.searchParams.RegistrationDate, scope.searchParams.SearchUserID);
        ShowPDF(Data);

    };


    $scope.changeCashBookStatus = function (cashBook, newStatus) {
        if (cashBook.ID != null && cashBook.ID != undefined) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                .then(function () {
                    showloading();
                    $scope.order = {};
                    $scope.order.SubType = 1;
                    $scope.order.CashBooks = [];

                    var newCashBook = angular.copy(cashBook);
                    $scope.order.CashBooks.push(newCashBook);

                    switch (newCashBook.OperationType) {
                        case 1:
                            newCashBook.OperationType = 2;
                            break;
                        case 2:
                            newCashBook.OperationType = 1;
                            break;
                    }
                    //Գործարքը հեռացնում է Գլխավոր հաշվապահը
                    if (newStatus == -3) {
                        if (newCashBook.Quality == 0) {
                            $scope.order.Type = 167;
                            newCashBook.Quality = newStatus;
                        }
                    }
                    else {
                        //Եթե ավելցուկ պակասորդ է հաստատում կամ մերժում է հաշվապահը
                        if (newCashBook.Type == 1 || newCashBook.Type == 3) {
                            if (newStatus == 2) {
                                $scope.order.Type = 144;
                            } else {
                                $scope.order.Type = 147;
                            }
                            if ($scope.order.Type != 147) {
                                newCashBook.Quality = newStatus;
                            }
                            else {
                                newCashBook.Quality = -1;
                            }
                        } if (newCashBook.Type == 0) {
                            if (newCashBook.Quality == 0) {
                                if (newStatus == 2) {
                                    newCashBook.Quality = 1;
                                    $scope.order.Type = 146;
                                } else {
                                    newCashBook.Quality = -2; //-1 ,երբ գլխավոր հաշվապահին էր գնում հաստատման
                                    $scope.order.Type = 147;
                                }
                            }
                            else {
                                if (newStatus == 2) {
                                    $scope.order.Type = 146;
                                } else {
                                    $scope.order.Type = 147;
                                }
                                newCashBook.Quality = newStatus;
                            }
                        } else if (newCashBook.Type == 2 || newCashBook.Type == 4) {

                            $scope.order.Type = 150;
                            newCashBook.Quality = newStatus;
                        }
                    }
                    var Data = cashBookService.SaveAndApprove($scope.order);

                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data) && res.data.ResultCode != 5) {
                            $scope.getCashBooks();
                            ShowToaster('Գործողությունը կատարված է', 'success');
                        }
                        else {
                            $scope.showError = true;
                            showMesageBoxDialog($scope.error[0].Description, 'error');
                        }
                    }, function () {
                        hideloading();
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                    });
                });
        };
    };



    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.searchParams.FillialCode = ref.data.toString();
            $scope.userFilialCode = ref.data.toString();
        }, function () {
            alert('Error Accounts');
        });
    };

    $scope.CashBookAccountStatementReport = function (payerReceiver) {
        scope = angular.element(document.getElementById('CashBookForm')).scope();
        $scope.searchParams = scope.searchParams;
        if ((scope.searchParams.Currency != undefined) && (scope.searchParams.FillialCode != undefined) && (scope.searchParams.FillialCode != undefined)) {
            var Data = cashBookService.CashBookAccountStatementReport($scope.searchParams, payerReceiver);
            ShowPDF(Data);
        } else {

            $scope.report.nocurrency = true;
            $scope.report.nofilial = true;
            $scope.report.nosetnumber = true;
        }
    };

    $scope.getCurrentOperDay = function () {
        var Data = utilityService.getCurrentOperDay();
        Data.then(function (opDate) {
            $scope.searchParams.RegistrationDate = $filter('mydate')(opDate.data, "dd/MM/yyyy");
            $scope.getCashBooks();
        }, function () {
            alert('Error getRest');
        });
    };


    $scope.closeCashBook = function () {
        var Data = utilityService.getCurrentOperDay();
        Data.then(function (opDate) {
            $scope.searchParams.RegistrationDate = $filter('mydate')(opDate.data, "dd/MM/yyyy");
            $scope.getCashBooks();
        }, function () {
            alert('Error getRest');
        });
    };

    $scope.checkSelected = function () {
        $scope.selectedCurrency = undefined;
        if ($scope.RowType == 1 || $scope.RowType == 3) {
            for (var i = 0; i < $scope.currencies.length; i++) {
                if ($scope.amounts[i].amount > 0) {
                    $scope.selectedCurrency = $scope.amounts[i].currency;
                }
            }

            for (var i = 0; i < $scope.currencies.length; i++) {
                if ($scope.amounts[i].currency != $scope.selectedCurrency) {
                    $scope.amounts[i].amount = 0;
                }
            }

        }
    };


    $scope.getCashBookOrder = function (OrderId) {
        var Data = cashBookService.getCashBookOrder(OrderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getCashBookOrder');
        });
    };

    $scope.getCashBooksForApprove = function () {
        $scope.cashBooksForApprove = [];
        for (var i = 0; i < $scope.cashBooks.length; i++) {
            if ($scope.cashBooks[i].isChecked) {
                $scope.cashBooksForApprove.push($scope.cashBooks[i]);
            }
        }
    }
    $scope.approveCashBooks = function () {
        var newStatus = 2;
        $scope.getCashBooksForApprove();
        if ($scope.cashBooksForApprove.length == 0) {
            showMesageBoxDialog('Գոյություն չունի հաստատման ենթակա տողեր', 'errorDialog');
        }
        else if ($scope.cashBooksForApprove.length > 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                .then(function () {
                    showloading();
                    var arr = [];
                    for (var i = 0; i < $scope.cashBooksForApprove.length; i++) {
                        $scope.order = {};
                        $scope.order.SubType = 1;
                        $scope.order.CashBooks = [];
                        var newCashBook = angular.copy($scope.cashBooksForApprove[i]);
                        $scope.order.CashBooks.push(newCashBook);

                        switch (newCashBook.OperationType) {
                            case 1:
                                newCashBook.OperationType = 2;
                                break;
                            case 2:
                                newCashBook.OperationType = 1;
                                break;
                        }
                        if (newCashBook.Type == 1 || newCashBook.Type == 3) {
                            //Եթե ավելցուկ պակասորդ է հաստատում  հաշվապահը
                            $scope.order.Type = 144;
                            newCashBook.Quality = newStatus;
                        }
                        else if (newCashBook.Type == 0) {
                            if (newCashBook.Quality == 0) {
                                newCashBook.Quality = 2; //1, երբ գլխավոր հաշվապահին էր գնում հաստատման
                                $scope.order.Type = 146;
                            }
                            else {
                                $scope.order.Type = 146;
                                newCashBook.Quality = newStatus;
                            }
                        } else if (newCashBook.Type == 2 || newCashBook.Type == 4) {
                            $scope.order.Type = 150;

                            newCashBook.Quality = newStatus;
                        }
                        var Data = cashBookService.SaveAndApprove($scope.order);

                        arr.push(Data);
                    }
                    $q.all(arr).then(function (results) {
                        var countOfUnConfirmedCashBooks = 0;
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].data.ResultCode == 5) {
                                countOfUnConfirmedCashBooks++;
                                console.log(results[i].data.Errors[0].Description);
                            }
                        }
                        $scope.getCashBooks();
                        hideloading();
                        var endText = '';
                        var countOfConfirmedCashBooks = results.length - countOfUnConfirmedCashBooks;
                        if (countOfConfirmedCashBooks < results.length) {
                            endText = "Ուշադրություն հաստատման է ուղղարկվել " + results.length + ' հայտ ' + ',որից  կատարվել է ' + countOfConfirmedCashBooks + ' հայտ։';

                        }
                        else if (countOfConfirmedCashBooks == results.length) {
                            endText = "Բոլոր " + 'հայտերը ' + 'կատարվել են ։';

                        }
                        showMesageBoxDialog(endText, 'endDialog');
                    });
                });
        }
    }


    $scope.checkAllCashBooks = function () {
        for (var i = 0; i < $scope.cashBooks.length; i++) {
            if (($scope.cashBooks[i].Quality == 0 && $scope.cashBooks[i].CorrespondentSetNumber == $scope.UserID) ||
                ($scope.SessionProperties.AdvancedOptions.canApproveCashBookSurplusDeficit == '1' && $scope.cashBooks[i].Quality == 0 && ($scope.cashBooks[i].Type == 2 || $scope.cashBooks[i].Type == 4))
                ) {
                $scope.cashBooks[i].isChecked = $scope.isCheckCashBooks;
            }
        }
    }



    $scope.ckeckCashBook = function () {
        $scope.getCashBooksForApprove();
        if ($scope.cashBooksForApprove.length == 0) {
            $scope.isCheckCashBooks = false;
            $scope.isCheckAnyCashBook = false;
        }
        else {
            $scope.isCheckAnyCashBook = true;
        }
    }


    $scope.getCorSetNumber = function () {
        var Data = cashBookService.getCorrespondentSetNumber();
        Data.then(function (user) {
            $scope.corSetNumber = user.data;
        }, function () {
            alert('Error');
        });
    }


    $scope.getCashierLimits = function (correspondentSetNumber, registeredUserID) {

        var Data = cashBookService.GetCashierLimits(Number(correspondentSetNumber));
        Data.then(function (acc) {
            //var flag;

            $scope.cashierCashLimits = acc.data;
            for (var i = 0; i < $scope.cashierCashLimits.length; i++) {
                $scope.cashierCashLimits[i].ChangeBySetNumber = registeredUserID;
                $scope.cashierCashLimits[i].SetNumber = Number(correspondentSetNumber);
            }

        }, function () {
            alert('Error getCashierLimits');
        });
    };


    $scope.generateCashierCashDefaultLimits = function (registeredUserID, registeredUserID) {
        var Data = cashBookService.GenerateCashierCashDefaultLimits(registeredUserID, registeredUserID);
        Data.then(function (acc) {
            $scope.CashierCashDefaultLimits = acc.data;
            $scope.getCashierLimits(registeredUserID, registeredUserID);

            //var miliseconds = 1700;
            //setTimeout(function ()
            //{
            //    ShowToaster('Պահպանումը կատարված է', 'success');
            //    CloseBPDialog('CashierCashLimit');
            //},
            //miliseconds);
        }
            , function () {
                alert('Error generateCashierCashDefaultLimits');
            });

    };



    $scope.saveCashierCashLimits = function (limit) {

        var Data = cashBookService.SaveCashierCashLimits($scope.cashierCashLimits);
        Data.then(function (acc) {
            $scope.changeCasierCashLimit = acc.data;
            ShowToaster('Պահպանումը կատարված է', 'success');
            CloseBPDialog('CashierCashLimit');
        }, function () {
            alert('Error changeCasierCashLimit');
        });
    };


    $scope.initCashierCashLimit = function () {
        $scope.RegistrationDate = new Date();
        var Data = casherService.getUserID();
        Data.then(function (user) {
            $scope.RegisteredUserID = user.data;
        }, function () {
            alert('Error');
        });
    };




    $scope.getCashierFilialCode = function (setNumber) {

        var filial = 0;
        var Data = cashBookService.GetCashierFilialCode(setNumber);
        Data.then(function (acc) {
            filial = acc.data;
            return filial;
        }, function () {
            alert('Error getCashierFilialCode');
        });


    };

    $scope.checkCashierFilialCode = function (correspondentSetNumber) {

        var Data = cashBookService.CheckCashierFilialCode(correspondentSetNumber);
        Data.then(function (acc) {
            $scope.checkUser = acc.data;
            if ($scope.checkUser == 'True' || $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"] == '1') {
                $scope.getCashierLimits(correspondentSetNumber);
            }
            else {
                $scope.cashierCashLimits = '';
                return ShowMessage('Մուտքագրեք Ձեր մասնաճյուղի ՊԿ:', 'error');
            }

        }, function () {
            alert('Error checkCashierFilialCode');
        });
    };


    $scope.getUserCurrentCashLimits = function () {
        var Data = casherService.getUserID();
        Data.then(function (user) {
            $scope.getCashierLimits(user.data);
        }, function () {
            alert('Error');
        });




    }

    $scope.getCashBookReport = function () {
        var cashBookScope = angular.element(document.getElementById('CashBookForm')).scope()
        if (cashBookScope != undefined) {
            var Data = cashBookService.getCashBookReport(cashBookScope.searchParams.RegistrationDate);
            ShowExcel(Data, 'CashBookReport');
        }
    }

    $scope.getCashBookTotalReport = function () {
        var cashBookScope = angular.element(document.getElementById('CashBookForm')).scope()
        if (cashBookScope != undefined) {
            var Data = cashBookService.getCashBookTotalReport(cashBookScope.searchParams.RegistrationDate);
            ShowExcel(Data, 'CashBookTotalReport');
        }
    }


    $scope.getCashBookAmount = function (cashBookId) {
        var Data = cashBookService.getCashBookAmount(cashBookId);
        Data.then(function (acc) {
            $scope.CashBookAmount = acc.data;
        }, function () {
            alert('Error getCashBookAmount');
        });
    };

    $scope.hasUnconfirmedOrder = function (cashBookId) {
        var Data = cashBookService.hasUnconfirmedOrder(cashBookId);
        Data.then(function (acc) {
            $scope.HasUnconfirmedOrder = acc.data;
        }, function () {
            alert('Error HasUnconfirmedOrder');
        });
    };

    $scope.setOperationType = function () {
        $scope.OperationType = 1;
    };

}]);