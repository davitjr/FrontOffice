app.controller("CardCtrl", ['$scope', 'cardService', '$location', 'loanService', 'dialogService', 'customerService', '$confirm', 'infoService', '$state', 'accountService', 'dateFilter', 'cardTariffContractService', 'cardStatusChangeOrderService', 'casherService', 'ReportingApiService', '$http', function ($scope, cardService, $location, loanService, dialogService, customerService, $confirm, infoService, $state, accountService, dateFilter, cardTariffContractService, cardStatusChangeOrderService, casherService, ReportingApiService, $http) {
    $scope.accessToChangeCardBranchOrders = $scope.$root.SessionProperties.AdvancedOptions["accessToChangeCardBranchOrders"];
    $scope.accessToCardReOpenOrder = $scope.$root.SessionProperties.AdvancedOptions["accessToCardReOpenOrder"];
    $scope.filter = 1;
    $scope.selectedCardNumber = null;
    $scope.selectedProductId = null;
    $scope.AccountNumber = null;
    $scope.dateFrom = $scope.$root.SessionProperties.OperationDate;
    $scope.dateTo = $scope.$root.SessionProperties.OperationDate;
    $scope.isCardDepartment = $scope.$root.SessionProperties.AdvancedOptions["isCardDepartment"];
    $scope.confirmationPerson = '1';
    $scope.myFilter = function (MainCardNumber) {
        return MainCardNumber !== '';
    };

    $scope.OperDay = new Date();
    $scope.getCardDAHKDetails = function (cardNumber) {
        var Data = cardService.getCardDAHKDetails(cardNumber);
        Data.then(function (result) {
            $scope.cardDahkDetail = result.data;
        }, function () {
            alert('Error getCardDAHKDetails');
        });
    };

    //To Get All Records  
    $scope.getCards = function () {
        $scope.loading = true;
        var Data = cardService.getCards($scope.filter);

        Data.then(function (card) {
            if ($scope.filter == 1) {
                $scope.cards = card.data;
                $scope.closingCards = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingCards = card.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getCards');
        });
    };

    $scope.getCard = function (productId) {

        $scope.update = true;

        if ($scope.card == null || ($scope.card != undefined && $scope.card.ClosingDate == null)) {

            if ($scope.card == null) {
                $scope.loading = true;
            }
            var Data = cardService.getCard(productId);
            Data.then(function (crd) {
                $scope.card = crd.data;
                $scope.getCardDAHKDetails($scope.card.CardNumber);
                $scope.update = false;
                $scope.selectedCard = $scope.card;
                $scope.selectedCardCurrency = $scope.card.Currency;
                $scope.params = { AccountNumber: $scope.card.CardAccount.AccountNumber, card: $scope.card, CardNumber: $scope.card.CardNumber };
                $scope.getCBKursForDate(new Date(new Date().getFullYear(),
                    new Date().getMonth(),
                    (new Date().getDay() - 1)),
                    $scope.card.Currency);

                $scope.showMature = false;

                if ($scope.card.CreditLine != null) {
                    if ($scope.card.CreditLine.Quality != 40 && ($scope.card.CreditLine.Type != 9 || ($scope.card.CreditLine.Type == 9 && $scope.card.CreditLine == null)) && $scope.card.CreditLine.Quality != 10) {
                        $scope.showMature = true;
                    }

                }
                else if ($scope.card.Overdraft != null) {
                    if ($scope.card.Overdraft.Quality != 40 && ($scope.card.Overdraft.Type != 9 || ($scope.card.Overdraft.Type == 9 && $scope.card.CreditLine == null)) && $scope.card.Overdraft.Quality != 10) {
                        $scope.showMature = true;
                    }
                }

                if ($scope.$root.SessionProperties.CustomerType != 2 && $scope.$root.SessionProperties.CustomerType != 6) {
                    $scope.confirmationPersonsFirstValueVisibility = false;
                    $scope.confirmationPerson = '2';
                }
                else {
                    $scope.confirmationPersonsFirstValueVisibility = true;
                    $scope.confirmationPerson = '1';
                }

                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error getCard');
            });
        }
        else {
            $scope.params = { AccountNumber: $scope.card.CardAccount.AccountNumber, card: $scope.card, CardNumber: $scope.card.CardNumber, productId: $scope.card.ProductId };
            $scope.getCBKursForDate(
                new Date(new Date().getFullYear(), new Date().getMonth(), (new Date().getDay() - 1)),
                $scope.card.Currency);
            $scope.getCardDAHKDetails($scope.card.CardNumber);
        }

    };

    $scope.getCBKursForDate = function (date, currency) {
        var Data = loanService.getCBKursForDate(date, currency);
        Data.then(function (kurs) {
            $scope.kurs = kurs.data;
        }, function () {
            alert('Error getCBKursForDate');
        });
    };



    $scope.getcardStatement = function (card) {
        showloading();
        var Data = cardService.getCardStatement(card, $scope.dateFrom, $scope.dateTo);
        Data.then(function (cdStatement) {
            hideloading();
            $scope.cardStatement = cdStatement.data;
        }, function () {
            hideloading();
            alert('Error getcardStatement');
        });
    };

    $scope.getCreditLineGrafik = function () {
        $scope.loading = true;
        var Data = cardService.getCreditLineGrafik($scope.card);
        Data.then(function (crd) {
            $scope.cardcreditlinerepayment = crd.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCreditLineGrafik');
        });
    };

    $scope.getArCaBalance = function (card) {
        var Data = cardService.getArCaBalance(card);
        Data.then(function (crd) {
            $scope.text = crd.data;
        }, function () {
            alert('Error getArCaBalance');
        });
    };

    $scope.getArCaBalanceResponseData = function (card) {
        $scope.getCardArCaStatus(card.ProductId);
        var Data = cardService.getArCaBalanceResponseData(card);
        Data.then(function (crd) {
            $scope.arcaBalanceResponse = crd.data;
        }, function () {
            alert('Error getArCaBalanceResponseData');
        });
    };



    $scope.setClickedRow = function (index, card) {

        $scope.selectedRow = index;
        $scope.selectedCard = card;
        $scope.selectedCardNumber = card.CardNumber;
        $scope.selectedProductId = card.ProductId;
        $scope.selectedCardSystem = card.CardSystem;
        $scope.selectedCardAccount = card.CardAccount.AccountNumber;
        $scope.selectedAccountNumber = card.CardAccount.AccountNumber;
        $scope.AccountNumber = card.CardAccount.AccountNumber;
        $scope.selectedCardCurrency = card.CardAccount.Currency;
        $scope.selectedAccountCurrency = $scope.selectedCardCurrency;
        $scope.cardNumber = card.CardNumber;
        $scope.selectedRowClose = null;
        $scope.params = { AccountNumber: card.CardAccount.AccountNumber };
        $scope.selectedCardIsAccessible = card.isAccessible;
        $scope.accountFlowDetails = undefined;
        $scope.RelatedOfficeNumber = card.RelatedOfficeNumber;
        $scope.selectedCardTypeCode = card.Type;
        if (!$scope.selectedCardIsAccessible) {
            $scope.card = $scope.selectedCard;
            $scope.getPlasticCard($scope.selectedProductId);
            $scope.getCardStatus($scope.selectedProductId);
            $scope.getCardUSSDService($scope.selectedProductId);
            $scope.getCardApplicationTypes();
        }

    };

    $scope.confirm = false;

    $scope.getCardApplicationDetails = function (applicationID, cardNumber) {
        $scope.applicationID = applicationID;
        $scope.cardNumberForPrint = cardNumber;
        $scope.checkCardApplicationDetails();

    };

    $scope.checkCardApplicationDetails = function () {
        if ($scope.applicationID == 17) {
            var Data = cardService.ValidateRenewedOtherTypeCardApplicationForPrint($scope.cardNumberForPrint, $scope.confirm);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    $scope.printCardApplicationDetails();
                }
                else {
                    $scope.showError = true;
                    showMesageBoxDialog('Արտատպել հնարավոր չէ:', $scope, 'error', $confirm, $scope.checkCardApplicationDetails);
                }
            }, function () {
                $scope.confirm = false;
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in printApplication');
            });
        }
        else 
            if ($scope.applicationID == 18) {
                var Data = cardService.Validate3DSecureEmailForPrint($scope.card.CardNumber);
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        $scope.printCardApplicationDetails();
                    }
                    else {
                        $scope.showError = true;
                        showMesageBoxDialog('Արտատպել հնարավոր չէ:', $scope, 'error', $confirm, $scope.checkCardApplicationDetails);
                    }
                }, function () {
                    $scope.confirm = false;
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in printApplication');
                });
            }
        else if ($scope.applicationID == 11 && $scope.card.SupplementaryType != '2') { //Կից քարտերի դեպքում ստուգում չենք կատարում
            var Data = cardService.validateSMSApplicationForPrint();
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    $scope.printCardApplicationDetails();
                }
                else {
                    $scope.showError = true;
                    showMesageBoxDialog('', $scope, 'error', $confirm, $scope.checkCardApplicationDetails);
                }
            }, function () {
                $scope.confirm = false;
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in printApplication');
            });
        }
        else {
            $scope.printCardApplicationDetails();
        }
    };

    $scope.printCardApplicationDetails = function () {
        showloading();
        var Data = cardService.getCardApplicationDetails($scope.applicationID, $scope.cardNumberForPrint);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: $scope.applicationID, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result);
            });
        }, function () {
                alert('Error getCardApplicationDetails');
        });
    };


    $scope.printCardStatement = function (card, lang, exportFormat) {
        showloading();
        var Data = cardService.printCardStatement(card, $scope.dateFrom, $scope.dateTo, lang, exportFormat);
        Data.then(function (response) {
            var reportId = 0;
            var format = 0;
            if (lang == 1) {
                reportId = 56;
            }
            else {
                reportId = 57;
            }

            if (exportFormat == "pdf") {
                format = 1;
            }
            else {
                format = 2;
            }

            var requestObj = { Parameters: response.data, ReportName: reportId, ReportExportFormat: format }
            ReportingApiService.getReport(requestObj, function (result) {
                if (exportFormat == 'xls') {
                    ShowExcelReport(result, 'CardStatement');
                }
                else {
                    ShowPDFReport(result);
                }
            });
        }, function () {
            alert('Error printCardStatement');
        });
    };

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedProductId = null;
        $scope.getCards();
    };
    $scope.setClickedRowClose = function (index, card) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedCard = card;
        $scope.selectedProductId = card.ProductId;
        $scope.selectedCardIsAccessible = card.isAccessible;
        $scope.accountFlowDetails = undefined;
        $scope.selectedAccountCurrency = card.Currency;
        $scope.selectedCardAccount = card.CardAccount.AccountNumber;
        $scope.selectedAccountNumber = card.CardAccount.AccountNumber;
    };


    $scope.getCardServiceFee = function (productId) {
        var Data = cardService.getCardServiceFee(productId);
        Data.then(function (fee) {
            $scope.cardServiceFee = fee.data;
        }, function () {
            alert('Error getCardServiceFee');
        });
    };


    $scope.getCardApplicationTypes = function () {
        var Data = cardService.getCardApplicationTypes();
        Data.then(function (result) {
            $scope.CardApplicationTypes = result.data;
        }, function () {
            alert("error GetCardApplicationTypes");
        });
    };



    $scope.callbackgetCard = function () {
        $scope.getCard($scope.productId);
    };

    $scope.callbackgetCards = function () {
        $scope.getCards();
    };
    $scope.callBackGetReNewCard = function () {
        if ($scope.newProductId != null)
            $state.go('cardDetails', { productId: $scope.newProductId, closedCard: null });
        //$scope.getCard($scope.newProductId);

    };

    $scope.getCardServiceFeeGrafik = function () {
        var Data = cardService.getCardServiceFeeGrafik($scope.productid);
        Data.then(function (crdGrafik) {
            $scope.cardServiceFeeGrafik = crdGrafik.data;
            if ($scope.cardServiceFeeGrafik.length > 0) {
                $scope.hascardServiceFeeGrafik = true;
            }
            else {
                $scope.hascardServiceFeeGrafik = false;
            }
        }, function () {
            alert('Error getCardGrafik');
        });
    };


    $scope.setNewCardServiceFeeGrafik = function () {
        var Data = cardService.setNewCardServiceFeeGrafik($scope.productid);
        Data.then(function (crdGrafik) {
            $scope.cardServiceFeeGrafik = crdGrafik.data;
        }, function () {
            alert('Error setNewCardServiceFeeGrafik');
        });
    };


    $scope.getCardTariffContract = function () {
        //changed
        var Data = cardTariffContractService.getCardTariffContract($scope.card.RelatedOfficeNumber);
        Data.then(function (result) {
            $scope.CardTariffContract = result.data;
        }, function () {
            alert("Error getCardTariffContract");
        });
    };

    $scope.getCardTariff = function (productId) {
        var Data = cardService.getCardTariff(productId);
        Data.then(function (crd) {
            $scope.cardTariffs = crd.data;
        }, function () {
            alert('Error getCardTariffs');
        });
    };

    $scope.getCardStatus = function (productId) {

        if ($scope.card != null) {
            productId = $scope.card.ProductId;
        }
        var Data = cardService.getCardStatus(productId);

        Data.then(function (result) {
            $scope.cardStatus = result.data;
        }, function () {
            alert('Error getCardStatus');
        });
    };

    $scope.getCurrencies = function () {
        var Data = infoService.getCurrencies();
        Data.then(function (rep) {
            $scope.currencies = rep.data;
        }, function () {
            alert('Error getSourceDescription');
        });
    };

    $scope.openCardDetails = function () {
        $state.go('cardDetails', { productId: $scope.selectedProductId, closedCard: $scope.selectedCard });
    };




    $scope.getElementPosition = function (index) {
        var top = $('#cardRow_' + index).position().top;
        if (document.getElementById('accountflowdetails') != undefined)
            document.getElementById('accountflowdetails').setAttribute("style", "margin-top:" + (top + 60).toString() + "px; width: 350px !important;");


    };

    $scope.getCardContractDetails = function () {
        showloading();
        var Data = cardService.getCardContractDetails($scope.card.ProductId, $scope.confirmationPerson);
        ShowPDF(Data);
    };

    $scope.getCardContractDetailsForBusinessCards = function () {
        showloading();
        var Data = cardService.getCardContractDetailsForBusinessCards($scope.card.ProductId, $scope.confirmationPerson);
        ShowPDF(Data);
    };

    $scope.getReNewCardProductId = function (productId) {
        if ($scope.card != null) {
            productId = $scope.card.ProductId;
        }
        var Data = cardService.getReNewCardProductId(productId);
        Data.then(function (res) {
            $scope.newProductId = res.data;
            //if ($scope.newProductId != null && $scope.newProductId != '') {

            //}
            //else {
            //    //showMesageBoxDialog('Քարտը վերաթողարկման ենթակա չէ', $scope, 'error');
            //    return false;
            //}
        }, function () {
            alert('Error IsCardReNewable');
        });
    };


    $scope.getPlasticCard = function (productId) {
        var Data = cardService.getPlasticCard(productId, false);
        Data.then(function (res) {
            $scope.plasticCard = res.data;
            //$scope.getCard($scope.productId);
        },
            function () {
                alert('Error getPlasticCard');
            });
    }

    $scope.getCardCashbackAccount = function (productId) {
        var Data = cardService.getCardCashbackAccount(productId);
        Data.then(function (res) {
            $scope.cashbackAccount = res.data;
        },
            function () {
                alert('Error getCardCashbackAccount');
            });
    }

    $scope.getCardMotherName = function (productId) {
        var Data = cardService.getCardMotherName(productId);
        Data.then(function (res) {
            $scope.cardMotherName = res.data;
        },
            function () {
                alert('Error getCardMotherName');
            });
    }

    $scope.saveCardStatusChangeOrder = function (productid) {



        $confirm({ title: 'Շարունակե՞լ', text: 'Նշե՞լ որպես չտրամադրված:' })
            .then(function () {
                showloading();
                $scope.error = null;
                $scope.order = {};
                $scope.order.RegistrationDate = new Date();
                $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
                $scope.order.Type = 136;
                $scope.order.SubType = 1;
                $scope.order.CardStatus = {};
                $scope.order.CardStatus.Status = 3;
                $scope.order.ProductId = productid;


                var Data = cardStatusChangeOrderService.saveCardStatusChangeOrder($scope.order);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh($scope.order.Type);
                        hideloading();

                    }
                    else {
                        hideloading();

                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                    }
                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in saveCardStatusChangeOrder');
                });
            });

    };



    $scope.getCardActivationInArCa = function (cardNumber, startDate, endDate) {
        showloading();
        var Data = cardService.getCardActivationInArCa(cardNumber, startDate, endDate);
        Data.then(function (result) {
            hideloading();
            $scope.cardActivationInArCaList = result.data;
        }, function () {
            hideloading();
            alert('Error getCardActivationInArCa');
        });
    };

    $scope.getLastSendedPaymentFileDate = function () {
        var Data = cardService.getLastSendedPaymentFileDate();
        Data.then(function (result) {
            $scope.lastSendedPaymentFileDate = result.data;
        }, function () {
            alert('Error getLastSendedPaymentFileDate');
        });
    };


    $scope.getCardActivationInArCaApigateDetail = function (Id) {
        var Data = cardService.getCardActivationInArCaApigateDetail(Id);
        Data.then(function (result) {
            $scope.apigateDetails = result.data;
        }, function () {
            alert('Error getLastSendedPaymentFileDate');
        });
    };

    $scope.selectedCardActivationInArCaId = function (cardActivationInArCa) {
        $scope.selectdedApigateId = cardActivationInArCa.Id;
    }

    $scope.getCardTariffAdditionalInformation = function (officeID, cardType) {
        $scope.loading = true;
        var Data = infoService.getCardTariffAdditionalInformation(officeID, cardType);
        Data.then(function (card) {
            $scope.cardTariffAdditionalInformation = card.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCardTariffAdditionalInformation');
        });
    };

    $scope.getCardUSSDService = function (productID) {
        var Data = cardService.getCardUSSDService(productID);
        Data.then(function (result) {
            $scope.USSDService = result.data;
        }, function () {
            alert('Error getCardUSSDService');
        });
    };

    $scope.getCardUSSDServiceTariff = function (productID) {
        var Data = cardService.getCardUSSDServiceTariff(productID);
        Data.then(function (result) {
            $scope.USSDFee = result.data[0];
            $scope.USSDFeeFromClient = result.data[1];
            $scope.USSDFeeFromBank = result.data[2];
        }, function () {
            alert('Error getCardUSSDServiceTariff');
        });
    };

    $scope.getCard3DSecureService = function (productID) {
        var Data = cardService.getCard3DSecureService(productID);
        Data.then(function (result) {
            $scope.card3DSecureService = result.data;
        }, function () {
            alert('Error getCard3DSecureService');
        });
    };
    
    $scope.getCardTransactionsLimitApplication = function () {
        showloading();
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (res) {
            $scope.customerNumber = res.data;
            var Data = cardService.getCardTransactionsLimitApplication($scope.customerNumber, $scope.card.CardType, $scope.card.Currency, $scope.card.CardNumber, $scope.card.CardAccount.AccountNumber);
            ShowPDF(Data);
        });
	};

    $scope.getCardToOtherCardOrder = function (orderId) {
		var Data = cardService.getCardToOtherCardOrder(orderId);
		Data.then(function (result) {
			$scope.order = result.data;
		}, function () {
			
			alert('Error getCard3DSecureService');
		});
	};


	$scope.setClickedRowVirtualCard = function (virtual) {
		$scope.selectedVirtualcard = virtual;
	};

	$scope.getCasherDescription = function (setNumber) {
		
		if (setNumber == undefined) {
			$scope.CasherDescription = undefined;
			return;
		}
		var Data = casherService.getCasherDescription(setNumber);
		Data.then(function (dep) {
			$scope.CasherDescription = dep.data;
			
		}, function () {
			alert('Error');
			});
		return $scope.CasherDescription;
    };

    $scope.getCardArCaStatus = function (productID) {
        var Data = cardService.getCardArCaStatus(productID);
        Data.then(function (crd) {
            $scope.cardArCaStatus = crd.data;
        }, function () {
            alert('Error getCardArCaStatus');
        });
    };

    $scope.getCardTechnology = function (productId) {
        var Data = cardService.getCardTechnology(productId);
        Data.then(function (res) {
            $scope.cardTechnology = res.data;
        },
            function () {
                alert('Error getCardTechnology');
            });
    };

    $scope.getCardRetainHistory = function (cardNumber) {
        var Data = cardService.getCardRetainHistory(cardNumber);
        Data.then(function (res) {
            $scope.cardRetainHistoryList = res.data;
        }, function () {
            alert('Error getCardRetainHistory');
        });
    };

    $scope.getUserFilialCode = function () {
        var Data = cardService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.UserFilialCode = ref.data.toString();
        }, function () {
            alert('Error GetUserFilialCode');
        });
    };

    $scope.confirmationPersons = function (confirmationPerson) {
        $scope.confirmationPerson = confirmationPerson;
    };

    $scope.saveVisaAliasOrder = function (alias, cardNumber, ActionName, addInfo) {
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.Alias = alias;
        $scope.order.ReasonTypeDescription = addInfo;
        $scope.order.RecipientPrimaryAccountNumber = cardNumber;
        $scope.order.Type = 250;
        if (ActionName == 0) {
            $scope.order.SubType = 1;
        }
        else if (ActionName == 1) {
            $scope.order.SubType = 2;
        }
        else if (ActionName == 2) {
            $scope.order.SubType = 3;
        }
        $scope.order.ReasonTypeDescription = addInfo;
        cardService.saveVisaAliasOrder($scope.order);
    };

    $scope.getVisaAliasOrder = function (orderId) {
        var Data = cardService.getVisaAliasOrder(orderId);
        Data.then(function (result) {
            $scope.order = result.data;
        }, function () {

            alert('Error getVisaAliasOrder');
        });
    };
    $scope.getCardRetainHistory = function (cardNumber) {
        var Data = cardService.getCardRetainHistory(cardNumber);
        Data.then(function (res) {
            $scope.cardRetainHistoryList = res.data;
        }, function () {
            alert('Error getCardRetainHistory');
        });
    };



    $scope.GetVisaAliasHistory = function (CardNumber) {
        var Data = cardService.getVisaAliasHistory(CardNumber);
        Data.then(function (res) {
            $scope.aliasHistory = res.data;
        },
            function () {
                alert('Error getVisaAliasHistory');
            });
    };

    $scope.SaveVisaAliasDataChange = function (ActionName, cardNumber, alias, addInfo) {
        if ($http.pendingRequests.length == 0) {
            var Data = cardService.saveVisaAliasDataChange(ActionName, cardNumber, alias, addInfo);
            Data.then(function (res) {
                $scope.aliasInfo = res.data;

                if ((ActionName == 0 || ActionName == 1 || ActionName == 2) && $scope.aliasInfo == '200') {
                    $scope.saveVisaAliasOrder(alias, cardNumber, ActionName, addInfo);
                }

                if ((ActionName == 0 || ActionName == 1 || ActionName == 2) && $scope.aliasInfo != undefined) {
                    CloseBPDialog('VisaAliasDataChange');
                    if ($scope.aliasInfo == '200') {
                        ShowToaster('Փոփոխությունը կատարված է', 'success');
                    }
                    else {
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                    }
                }
                refresh('isAlias');
            },
                function () {
                    alert('Error saveVisaAliasDataChange');
                });

        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

}]); 