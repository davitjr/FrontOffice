app.controller("ARUSReceivedFastTransferOrderCtrl", ['$scope', 'receivedFastTransferPaymentOrderService', 'utilityService', 'accountService', 'customerService', 'infoService', 'dialogService', 'paymentOrderService', 'orderService', 'fastTransferPaymentOrderService', 'transferCallsService', 'internationalPaymentOrderService', '$confirm', '$filter', '$uibModal', '$http', '$rootScope', '$state', function ($scope, receivedFastTransferPaymentOrderService, utilityService, accountService, customerService, infoService, dialogService, paymentOrderService, orderService, fastTransferPaymentOrderService, transferCallsService, internationalPaymentOrderService, $confirm, $filter, $uibModal, $http, $rootScope, $state) {
  

    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };
    $scope.transfer = {
        Contract: []
    };
    $scope.NewOrEditFromCallCenter = 0;
    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error getCustomerDocumentWarnings');
        });

    };

    $scope.getCustomerDebts = function (customerNumber) {
        $scope.customerDahk = "";
        var Data = customerService.GetCustomerDebts(customerNumber);
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

    if ($scope.order == undefined) {
        $scope.order = {};
        $scope.order.OrderNumber = " ";
        $scope.order.SubType = 23;
        $scope.order.RegistrationDate = new Date();
        $scope.selectedCountry = "";
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        try {
            $scope.isCallCenter = $scope.$root.SessionProperties.AdvancedOptions["isCallCenter"];
        }
        catch (ex) {
            $scope.isCallCenter = "0";
        }

        if ($scope.transferByCall == undefined) {
            $scope.order.Type = 79;
            $scope.order.DescriptionForPayment = 'Non-commercial transfer for personal needs';

            $scope.order.ConvertationRate = 0;
            $scope.order.ConvertationRate1 = 0;
            $scope.order.ClientTransferAmount = 0;
            $scope.transferContracts = [];
            if ($scope.isCallCenter == "1")
                $scope.NewOrEditFromCallCenter = 1;
            else
                $scope.NewOrEditFromCallCenter = 0;

            if ($scope.isCustomer == true) {

                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function (descr) {
                    $scope.order.CustomerNumber = descr.data;
                    $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);
                    if ($scope.isCallTransfer == 1) {
                        var Data = transferCallsService.getContractsForTransfersCall($scope.order.CustomerNumber, "0", "");

                        Data.then(function (ContractsForTransfersCall) {
                            $scope.transferContracts = ContractsForTransfersCall.data;

                        },
                            function () {
                                alert('Error getContractsForTransfersCall');
                            });

                    }
                });
            }
            else {
                $scope.transferByCall = {};
            }

        }
        else {
            $scope.changeOrder = {};
            $scope.changeOrder.OrderNumber = " ";
            $scope.changeOrder.RegistrationDate = new Date();

            $scope.changeOrder.OperationDate = $scope.$root.SessionProperties.OperationDate;

            $scope.changeOrder.Type = 145;
            if ($scope.isCallCenter == "1")
                $scope.NewOrEditFromCallCenter = 2;
            else
                $scope.NewOrEditFromCallCenter = 0;

            $scope.changeOrder.ReceivedFastTransfer = {};
            $scope.order.SubType = $scope.transferByCall.TransferSystem;
            $scope.order.ConvertationRate = $scope.transferByCall.RateBuy;
            $scope.order.ConvertationRate1 = $scope.transferByCall.RateSell;
            $scope.order.Amount = $scope.transferByCall.Amount;
            $scope.selectedCountry = $scope.transferByCall.Country;
            $scope.order.Country = $scope.transferByCall.Country;
            $scope.order.CustomerNumber = $scope.transferByCall.CustomerNumber;
            $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);
            $scope.getCustomerDebts($scope.order.CustomerNumber);
            $scope.order.Sender = $scope.transferByCall.Sender;
            $scope.order.NATSender = $scope.transferByCall.NATSenderLastName + " " + $scope.transferByCall.NATSenderFirstName;
            $scope.order.Code = $scope.transferByCall.Code;
            $scope.order.TransferByCallID = $scope.transferByCall.Id;
            $scope.order.CustomerAmount = $scope.transferByCall.Amount;

            var Data = transferCallsService.getContractsForTransfersCall($scope.order.CustomerNumber, "0", "");

            Data.then(function (ContractsForTransfersCall) {
                $scope.transferContracts = ContractsForTransfersCall.data;
                for (var i = 0; i < $scope.transferContracts.length; i++) {
                    if ($scope.transferContracts[i].ContractId == $scope.transferByCall.ContractID) {
                        $scope.transfer.Contract = $scope.transferContracts[i];
                    }
                }

            },
                function () {
                    alert('Error getContractsForTransfersCall');
                });
            // $scope.getClientTransferAmount(); 
            $scope.transferContracts = [];
        }


    }


    $scope.FromTamplate = false;
    $scope.ForSetFee = false;
    $scope.getCreditAccounts = function (orderType, orderSubType) {
        var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 2);
        Data.then(function (acc) {
            $scope.creditAccounts = acc.data;
        }, function () {
            alert('Error getcreditaccounts');
        });

    };
    $scope.getCustomer = function () {
        if ($scope.order.CustomerNumber != undefined) {
            var Data = customerService.getCustomer($scope.order.CustomerNumber);
        }
        else {
            var Data = customerService.getCustomer();
        }

      
        Data.then(function (cust) {
            $scope.customer = cust.data;

            $scope.order.CustomerType = cust.data.CustomerType;
            $scope.order.Receiver = cust.data.FirstNameEng + ' ' + cust.data.LastNameEng;

            if ($scope.customer.DocumentNumber != null && $scope.customer.DocumentNumber != "")
                $scope.order.ReceiverPassport = $scope.customer.DocumentNumber +
                    ', ' +
                    $scope.customer.DocumentGivenBy +
                    ', ' +
                    $scope.customer.DocumentGivenDate;


        }, function () {
            alert('Error');
        });

    };



    $scope.getBeneficiaryData = function () {

        if ($scope.order.CustomerNumber != undefined) {
            var Data = customerService.getCustomer($scope.order.CustomerNumber);
        }
        else {
            var Data = customerService.getCustomer();
        }
        Data.then(function (cust) {
            $scope.Beneficiary = cust.data;

            //Անուն, ազգանուն, հայրանուն, հասցե, փոստային կոդ
            $scope.order.BeneficiaryFirstName = $scope.Beneficiary.FirstNameEng;
            $scope.order.BeneficiaryLastName = $scope.Beneficiary.LastNameEng;
            //$scope.order.BeneficiaryMiddleName = $scope.Beneficiary.MiddleName;
            $scope.order.NATBeneficiaryFirstName = $scope.Beneficiary.FirstName;
            $scope.order.NATBeneficiaryLastName = $scope.Beneficiary.LastName;
            //$scope.order.NATBeneficiaryMiddleName = $scope.Beneficiary.LastName;
            $scope.order.BeneficiaryAddressName = $scope.Beneficiary.Address;
            $scope.order.BeneficiaryOccupationName = $scope.Beneficiary.Occupation;
            $scope.order.BeneficiaryBirthPlaceName = $scope.Beneficiary.BirthPlaceName;
            $scope.order.BeneficiaryZipCode = $scope.Beneficiary.PostCode;

            //Փաստաթուղթ
            $scope.order.BeneficiaryIssueIDNo = $scope.Beneficiary.DocumentNumber;
            $scope.order.BeneficiaryIssueDate = $scope.Beneficiary.DocumentGivenDate;
            $scope.order.BeneficiaryExpirationDate = $scope.Beneficiary.DocumentExpirationDate;
            if ($scope.Beneficiary.DocumentCountry != undefined) {
                $scope.order.BeneficiaryIssueCountryCode = $scope.countriesA3[$scope.Beneficiary.DocumentCountry.key];
            }

            if ($scope.Beneficiary.DocumentType != undefined) {
                $scope.getARUSDocumentTypeCode($scope.Beneficiary.DocumentType.key);
            }
           

            //Ծննդյան ամսաթիվ
            if ($scope.Beneficiary.BirthDate != null && $scope.Beneficiary.BirthDate != undefined) {
                var birthDate = $scope.Beneficiary.BirthDate;
                var dateTmp = moment(birthDate);
                var sec = dateTmp._d.setHours(dateTmp._d.getHours() - dateTmp._d.getTimezoneOffset() / 60);
                $scope.order.BeneficiaryBirthDate = new Date(sec);
            }


            //Էլեկտրոնային հասցե
            if (cust.data.EmailList != null) {
                if (cust.data.EmailList.length > 0) {
                    $scope.order.BeneficiaryEMailName = $scope.Beneficiary.EmailList[0];
                }
            }

          
            //Հեռախոսահամարներ
            if ($scope.Beneficiary.PhoneList != undefined) {         
                var mobile = $scope.Beneficiary.PhoneList.find(e => e.phoneType.key == 1);
                var nonMobile = $scope.Beneficiary.PhoneList.find(e => e.phoneType.key != 1);

                //Բջջային                            
                if (mobile != undefined) {
                    $scope.order.BeneficiaryMobileNo = mobile.phone.countryCode + mobile.phone.areaCode + mobile.phone.phoneNumber;
                }         

                //Ոչ բջջային                             
                if (nonMobile != undefined ) {
                    $scope.order.ReceiverPhone = nonMobile.phone.countryCode + nonMobile.phone.areaCode + nonMobile.phone.phoneNumber;
                }
            }
         
         
            //Ռեզիդենտություն
            if ($scope.Beneficiary.Residence == 1) {
                $scope.order.BeneficiaryResidencyCode = "1";
            }
            else if ($scope.Beneficiary.Residence == 2) {
                $scope.order.BeneficiaryResidencyCode = "0";
            }

            //Սեռ
            if ($scope.Beneficiary.Gender == 1) {
                $scope.order.BeneficiarySexCode = "M";
            }
            else if ($scope.Beneficiary.Gender == 2) {
                $scope.order.BeneficiarySexCode = "F";
            }

        }, function () {
            alert('Error');
        });

    };




    $scope.getClientTransferAmount = function () {
        $scope.disableCurrency = true;
        if ($scope.order.Currency == "" || $scope.order.Currency == undefined || $scope.transfer.Contract.Currency == "" || $scope.transfer.Contract.Currency == undefined || $scope.order.Amount == "" || $scope.order.Amount == undefined) {
            $scope.disableCurrency = false;
            return;
        }
        if ($scope.transfer.Contract.Currency != $scope.order.Currency) {
            if ($scope.transfer.Contract.Currency == "AMD") {
                var Data = utilityService.getLastRates($scope.order.Currency, 6, 2); //Transfer Buy Rate

                Data.then(function (result) {
                    $scope.order.ConvertationRate1 = 0;
                    if ($scope.transferByCall == undefined)
                        $scope.order.ConvertationRate = utilityService.formatNumber(result.data, 2);
                    else
                        $scope.order.ConvertationRate = $scope.transferByCall.RateBuy;
                    $scope.ClientTransferAmount = utilityService.formatNumber(Math.round($scope.order.Amount * $scope.order.ConvertationRate * 100) / 100, 2);
                    $scope.disableCurrency = false;
                },
                    function () {
                        $scope.disableCurrency = false;
                        alert('Error getLastRates Buy');
                    });
            }
            else {
                if ($scope.order.Currency == "AMD") {
                    var Data = utilityService.getLastRates($scope.transfer.Contract.Currency, 6, 1); //Transfer Sell Rate

                    Data.then(function (result) {
                        $scope.order.ConvertationRate = 0;
                        if ($scope.transferByCall == undefined)
                            $scope.order.ConvertationRate1 = utilityService.formatNumber(result.data, 2);
                        else
                            $scope.order.ConvertationRate1 = $scope.transferByCall.RateSell;
                        $scope.ClientTransferAmount = utilityService.formatNumber(Math.round($scope.order.Amount / $scope.order.ConvertationRate1 * 100) / 100, 2);
                        $scope.disableCurrency = false;
                    },
                        function () {
                            $scope.disableCurrency = false;
                            alert('Error getLastRates Sell');
                        });
                }
                else {
                    var Data = utilityService.getLastRates($scope.transfer.Contract.Currency, 5, 1); //Cross Sell Rate

                    Data.then(function (result) {
                        if ($scope.transferByCall == undefined)
                            $scope.order.ConvertationRate1 = utilityService.formatNumber(result.data, 2);
                        else
                            $scope.order.ConvertationRate1 = $scope.transferByCall.RateSell;

                        var Data1 = utilityService.getLastRates($scope.order.Currency, 5, 2); //Cross Buy Rate

                        Data1.then(function (result1) {
                            if ($scope.transferByCall == undefined)
                                $scope.order.ConvertationRate = utilityService.formatNumber(result1.data, 2);
                            else
                                $scope.order.ConvertationRate = $scope.transferByCall.RateBuy;
                            $scope.ClientTransferAmount = utilityService.formatNumber(Math.round($scope.order.Amount * $scope.order.ConvertationRate / $scope.order.ConvertationRate1 * 100) / 100, 2);
                            $scope.disableCurrency = false;
                        },
                            function () {
                                $scope.disableCurrency = false;
                                alert('Error getLastRates Cross Buy');
                            });
                    },
                        function () {
                            $scope.disableCurrency = false;
                            alert('Error getLastRates Cross Sell');
                        });
                }
            }
        }
        else {
            $scope.ClientTransferAmount = utilityService.formatNumber($scope.order.Amount, 2);
            $scope.order.ConvertationRate = 0;
            $scope.order.ConvertationRate1 = 0;
            $scope.disableCurrency = false;
        }
    };


    //Նշվում է արժույթի/ների կուրսերը և փոխարկման տեսակը
    $scope.setConvertationRates = function () {

        if ($scope.order.Currency == "" || $scope.order.Currency == undefined || $scope.transfer.Contract.Currency == "" || $scope.transfer.Contract.Currency == undefined || $scope.order.Amount == "" || $scope.order.Amount == undefined)
            return;

        if ($scope.transfer.Contract.Currency != $scope.order.Currency) {

            var dCur = $scope.order.Currency;
            var cCur = $scope.transfer.Contract.Currency;

            if (dCur == "AMD") {
                $scope.getLastRates(cCur, 2, 1);
            }
            else {
                $scope.calculateCrossRate(dCur, cCur);
            }
        }
        else {
            $scope.order.Rate = 1;
            $scope.order.ConvertationRate = 0;
            $scope.order.ConvertationRate1 = 0;
            $scope.ClientTransferAmount = utilityService.formatNumber($scope.order.Amount, 2);

        }

    }

    //Հաշվարկում է գործող կուրսը և թարմացվում գումարը
    $scope.getLastRates = function (currency, rateType, direction) {
        var Data = utilityService.getLastRates(currency, rateType, direction);

        Data.then(function (result) {
            $scope.order.Rate = Math.round(result.data * 100) / 100;
            $scope.order.ConvertationRate = Math.round(result.data * 100) / 100;

            $scope.order.ConvertationType = direction;

            $scope.calculateConvertationAmount();


        }, function () {
            alert('Error in getLastRates');
        });

    }



    $scope.calculateCrossRate = function (dCur, cCur) {
        var dRate;
        var cRate;


        var Data = internationalPaymentOrderService.getCrossConvertationVariant(dCur, cCur);
        Data.then(function (acc) {
            $scope.crossVariant = acc.data;
            if ($scope.crossVariant == 0) {
                $scope.order.Currency = undefined;
                $scope.order.Rate = 1;
                $scope.order.AmountConvertation = undefined;
                return ShowMessage('Տվյալ զույգ արժույթների համար փոխարկում չի նախատեսված:', 'error');
            }
            var dData = utilityService.getLastRates(dCur, 5, 2);// Cross Buy
            dData.then(function (dResult) {

                dRate = dResult.data;
                $scope.order.ConvertationRate = Math.round(dResult.data * 100) / 100;

                var cData = utilityService.getLastRates(cCur, 5, 1);// Cross Sell
                cData.then(function (cResult) {

                    cRate = cResult.data;
                    $scope.order.ConvertationRate1 = Math.round(cResult.data * 100) / 100;

                    if ($scope.crossVariant == 1) {
                        $scope.order.Rate = dRate / cRate;
                    }
                    else {
                        $scope.order.Rate = cRate / dRate;
                    }

                    $scope.order.Rate = Math.round(($scope.order.Rate) * 10000000) / 10000000;

                    $scope.order.ConvertationType = 3;

                    $scope.calculateConvertationAmount();

                }, function () {
                    alert('Error1 in calculateCrossRate');
                });
            }, function () {
                alert('Error2 in calculateCrossRate');
            });
        }, function () {
            alert('Error getCrossConvertationVariant');
        });

    }

    //Հաշվարկվում է փոխարկվող գումարը կրեդիտագրվող հաշվի արժույթով
    $scope.calculateConvertationAmount = function () {
        if ($scope.order.ConvertationType != 3) $scope.order.ConvertationRate = $scope.order.Rate;
        if ($scope.order.Amount && $scope.order.Rate && $scope.order.DebitAccount.Currency != $scope.order.Currency) {
            if ($scope.order.ConvertationType == 3)//"Կրկնակի փոխարկում"
                $scope.ClientTransferAmount = Math.round(($scope.order.Amount * ($scope.order.ConvertationRate1 / $scope.order.ConvertationRate)) * 1000000) / 1000000;

            $scope.ClientTransferAmount = Math.round(($scope.order.Amount * $scope.order.Rate) * 100) / 100;

            $scope.ClientTransferAmount = utilityService.formatNumber($scope.ClientTransferAmount, 2);
        }
        $scope.getCardFee();
    }


    $scope.confirm = false;
    $scope.saveReceivedFastTransferPayment = function () {
        if (($scope.isCallTransfer == 1 || $scope.isCallCenter == "1") && $scope.transfer.Contract.ContractId == undefined && $scope.transferByCall.Source != 1 && $scope.transferByCall.Source != 5) {
            showMesageBoxDialog('Համաձայնագիրն ընտրված չէ', $scope, 'information');
        }
        else {
            if ($http.pendingRequests.length == 0) {


                document.getElementById("receivedFastTransferLoad").classList.remove("hidden");

                //$scope.order.Type = 3;
                //$scope.order.SubType = 1;
                $scope.order.Attachments = [];

                $scope.order.Description = $scope.description;

                $scope.order.ContractId = $scope.transfer.Contract.ContractId;

                //if ($scope.cashType == 2)
                $scope.order.ReceiverAccount = undefined;
                if ($scope.changeOrder == undefined)
                    var Data = receivedFastTransferPaymentOrderService.saveReceivedFastTransferPaymentOrder($scope.order, $scope.confirm, $scope.NewOrEditFromCallCenter);
                else {
                    if ($scope.NewOrEditFromCallCenter == 2 && $scope.FromTamplate == false && ($scope.order.SubType == 16 || $scope.order.SubType == 17 || $scope.order.SubType == 12 || $scope.order.SubType == 22 || $scope.order.SubType == 15 || $scope.order.SubType == 21)) {
                        showMesageBoxDialog('Ընտրեք շաբլոնից', $scope, 'information');
                        document.getElementById("receivedFastTransferLoad").classList.add("hidden");
                    }
                    else {
                        $scope.changeOrder.ReceivedFastTransfer = $scope.order;
                        $scope.changeOrder.ReceivedFastTransfer.Type = 79;
                        var Data = transferCallsService.saveCallTransferChangeOrder($scope.changeOrder);
                    }
                }
                Data.then(function (res) {
                    $scope.confirm = false;
                    if (validate($scope, res.data)) {
                        document.getElementById("receivedFastTransferLoad").classList.add("hidden");
                        CloseBPDialog('receivedfasttransferarusorder');
                        if (($scope.order.ContractId == undefined || $scope.order.ContractId == 0 || $scope.order.ContractId == null) && $scope.NewOrEditFromCallCenter != 2) {
                            $scope.path = '#transfers';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            $state.go('transfers');
                            $rootScope.FromReceived = true;
                            refresh($scope.order.Type);
                        }
                        else if ($scope.NewOrEditFromCallCenter != 2) {
                            $scope.path = '#transfersByCall';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            $state.go('transfersByCall');
                            $rootScope.FromReceived = true;
                            refresh($scope.order.Type, 1);
                        }
                        else {
                            $scope.path = '#transfersByCall';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            window.location = '#transfersByCall';
                            refresh(145, 1);
                        }
                    }
                    else {
                        document.getElementById("receivedFastTransferLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveReceivedFastTransferPayment);

                    }
                }, function () {
                    $scope.confirm = false;
                    document.getElementById("receivedFastTransferLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in FastTransferPaymentOrder');
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        }
    }

    $scope.RejectReceivedFastTransfer = function () {

        if ($http.pendingRequests.length == 0) {

            document.getElementById("receivedFastTransferLoad").classList.remove("hidden");
            $rootScope.changeOrder.SubType = 3;
            // $rootScope.changeOrder.ReceivedFastTransfer = $scope.order;
            var Data = transferCallsService.saveCallTransferChangeOrder($rootScope.changeOrder);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("receivedFastTransferLoad").classList.add("hidden");
                    CloseBPDialog('ReceivedFastTransferReject');
                    CloseBPDialog('receivedfasttransferarusorder');
                    $scope.path = '#transfersByCall';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    window.location = '#transfersByCall';
                    refresh($scope.order.Type, 1);

                }
                else {
                    document.getElementById("receivedFastTransferLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("receivedFastTransferLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in FastTransferPaymentOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }


    $scope.$watch('order.Country', function (newValue, oldValue) {
        if ($scope.order.Country != undefined && $scope.ForSetFee == false) {
            $scope.setFee();
        }
        $scope.ForSetFee = false;
    });



    $scope.setDescription = function () {
        $scope.description = "Փոխանցում STAK համակարգով (" + $scope.MTOList[$scope.order.MTOAgentCode] + ")";
    };




    $scope.getSendingCurrencies = function () {

        $scope.order.Currency = undefined;

        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '') {
            var Data = infoService.getARUSSendingCurrencies($scope.order.MTOAgentCode);
            Data.then(function (c) {
                $scope.currencies = c.data;

                //if ($scope.transferByCall != undefined) {                                  //Հնարավոր է անհրաժեշտ լինի Acba Online-ի համար
                //    $scope.order.Currency = $scope.transferByCall.Currency;
                //}
            },
                function () {
                    alert('Error getSendingCurrencies');
                });
        }
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
        $scope.transferByCall.cardNumber = selectedCard.CardNumber;
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
        $scope.transferByCall.accountNumber = selectedAccount.AccountNumber;
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

    $scope.getReceiverAccountWarnings = function (accountNumber) {
        if (accountNumber != undefined) {
            var bankCode = parseInt($scope.order.ReceiverAccount.AccountNumber.toString().substr(0, 5));
        }

        if (bankCode >= 22000 && bankCode < 22300) {
            var Data = paymentOrderService.getReceiverAccountWarnings(accountNumber);
            Data.then(function (acc) {
                $scope.warnings = acc.data;

            }, function () {
                alert('Error getPaymentOrder');
            });
        }

    };



    ////Ստացողի Բանկի որոշում` ըստ ելքագրվող հաշվի
    //$scope.setReceiverBank = function () {
    //    if ($scope.order.ReceiverAccount != null && $scope.order.ReceiverAccount.AccountNumber != 0) {
    //        var receiver_account = $scope.order.ReceiverAccount.AccountNumber;
    //    }

    //    if (receiver_account != "" && receiver_account != undefined) {
    //        // //if (receiver_account.toString().length == 12) {
    //        var Data = paymentOrderService.getBank(receiver_account.toString().substr(0, 5));
    //        Data.then(function (result) {
    //            $scope.ReceiverBank = result.data;
    //            if ($scope.ReceiverBank == "") {
    //                $scope.ReceiverBank = "Ստացողի բանկը գտնված չէ";
    //            }
    //        }, function () {
    //            alert('Error in receiverAccountChanged');
    //        });
    //        $scope.ReceiverBankCode = receiver_account.toString().substr(0, 5);

    //        // //}
    //    }
    //    else {
    //        $scope.ReceiverBank = "";
    //    }

    //}



    //$scope.closeSearchAccountsModal = function () {
    //    $scope.searchAccountsModalInstance.close();
    //};

    $scope.getReceivedFastTransferPaymentOrder = function (orderID) {
        var Data = receivedFastTransferPaymentOrderService.getReceivedFastTransferPaymentOrder(orderID);
        Data.then(function (acc) {

            $scope.orderDetails = acc.data;
            $scope.orderDetails.RegistrationDate = $filter('mydate')($scope.orderDetails.RegistrationDate, "dd/MM/yyyy");
            $scope.orderDetails.OperationDate = $filter('mydate')($scope.orderDetails.OperationDate, "dd/MM/yyyy");
            $scope.orderDetails.SenderDateOfBirth = $filter('mydate')($scope.orderDetails.SenderDateOfBirth, "dd/MM/yyyy");
        }, function () {
            alert('Error getFastTransferPaymentOrder');
        });

    };


    //$scope.getAccountByAccountNumber = function (receiverAccountAccountNumber) {
    //    $scope.receiverAccountAccountNumber = receiverAccountAccountNumber;
    //    if ($scope.receiverAccountAccountNumber != undefined && $scope.receiverAccountAccountNumber != "") {
    //        if ($scope.receiverAccountAccountNumber.toString().substring(0, 5) >= 22000 && $scope.receiverAccountAccountNumber.toString().substring(0, 5) < 22300) {
    //            $scope.hasaccount = true;
    //            $scope.searchParams = {
    //                accountNumber: $scope.receiverAccountAccountNumber,
    //                customerNumber: "",
    //                currency: "",
    //                sintAcc: "",
    //                sintAccNew: "",
    //                filialCode: 0,
    //                isCorAcc: false,
    //                includeClosedAccounts: false,
    //            };

    //            var Data = accountService.getSearchedAccounts($scope.searchParams);
    //            Data.then(function (acc) {
    //                if (acc.data.length > 0) {
    //                    $scope.getSearchedAccounts(acc.data[0])
    //                }
    //                else {
    //                    $scope.order.ReceiverAccount = undefined;
    //                    $scope.hasaccount = false;
    //                }
    //            }, function () {
    //                alert('Error in getSearchedAccounts');
    //            });

    //        }
    //        else {
    //            $scope.order.ReceiverAccount = undefined;
    //            $scope.hasaccount = false;
    //        }
    //    }


    //};

    //$scope.$watch('order.DescriptionForPayment', function (newValue, oldValue) {
    //    if ($scope.order.DescriptionForPayment != undefined ) {

    //        $scope.description = $scope.order.DescriptionForPayment;
    //    }
    //});


    //Փոխանցման լրացուցիչ տվյալներ 
    $scope.order.TransferAdditionalData = {};
    $scope.openTransferAdditionalDetailsModal = function () {
        $scope.isAddDataFormOpening = true;
        if ($scope.order.Amount == "" || $scope.order.Amount == undefined) {
            return;
        }
        $scope.transferAdditionalDetailsModal = $uibModal.open({
            template: '<transferadditionaldataform dataformtype="2" transferamount="order.Amount" cashtransferdata="transferAdditionalData" callback="getTransferAdditionalData(transferAdditionalData)" close="closeTransferAdditionalDetailsModal()"></transferadditionaldataform>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    }

    $scope.closeTransferAdditionalDetailsModal = function () {
        $scope.transferAdditionalDetailsModal.close();
    }

    $scope.getTransferAdditionalData = function (transferAdditionalData) {

        $scope.transferAdditionalData = transferAdditionalData;
        $scope.order.TransferAdditionalData = transferAdditionalData;
        if (transferAdditionalData.dataformtype == 2) {
            var temp = transferAdditionalData.receiverLivingPlace;
            transferAdditionalData.receiverLivingPlace = transferAdditionalData.senderLivingPlace;
            transferAdditionalData.senderLivingPlace = temp;
        }
        $scope.isHasAdditionalData = true;
        $scope.setReceiverLivingPlaceDesc();
        $scope.setSenderLivingPlaceDesc();
        $scope.setTransferAmountPurposeDesc();

        $scope.transferAdditionalData.dataformtype = transferAdditionalData.dataformtype;
        $scope.closeTransferAdditionalDetailsModal();
    }

    $scope.setReceiverLivingPlaceDesc = function () {

        var Data = infoService.getTransferReceiverLivingPlaceTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].key == $scope.transferAdditionalData.receiverLivingPlace) {
                    $scope.receiverLivingPlaceDesc = result.data[i].value;
                    break;
                }
            }
        }, function () {

        });
    }
    $scope.setSenderLivingPlaceDesc = function () {
        var Data = infoService.getTransferSenderLivingPlaceTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].key == $scope.transferAdditionalData.senderLivingPlace) {
                    $scope.senderLivingPlaceDesc = result.data[i].value;
                    break;
                }
            }
        }, function () {

        });
    }
    $scope.setTransferAmountPurposeDesc = function () {

        var Data = infoService.getTransferAmountTypes();
        Data.then(function (result) {
            for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].key == $scope.transferAdditionalData.transferAmountType) {
                    $scope.transferAmountPurposeDesc = result.data[i].value;
                    break;
                }
            }
        }, function () {

        });
    }
    $scope.deleteAdditionalData = function () {
        $scope.order.TransferAdditionalData = "";
        $scope.isHasAdditionalData = false;
        $scope.transferAdditionalData = undefined;
    }

    $scope.searchReceivedTransfers = function () {

        if ($scope.order.SubType == undefined || $scope.order.SubType == 0 || $scope.order.SubType == null)
            showMesageBoxDialog('Ընտրեք փոխանցման տեսակը', $scope, 'information');
        else {
            $scope.transfertype = $scope.order.SubType;
            $scope.openSearchReceivedTransfersModal();

            $scope.searchReceivedTransfersModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        }
    };



    $scope.openSearchReceivedTransfersModal = function () {
        $scope.searchReceivedTransfersModalInstance = $uibModal.open({

            template: '<searchreceivedtransfer callback="getSearchedReceivedTransfer(receivedTransfer)" close="closeSearchReceivedTransfersModal()" transfertype="' + $scope.transfertype + '" ></searchreceivedtransfer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    }

    $scope.getSearchedReceivedTransfer = function (receivedTransfer) {
        if (($scope.NewOrEditFromCallCenter == 2 || $scope.transferByCall != undefined) && ($scope.order.Currency != receivedTransfer.Currency || ($scope.order.Code != receivedTransfer.Code && $scope.order.SubType != 21))) {
            $scope.closeSearchReceivedTransfersModal();
            showMesageBoxDialog('Փոխանցման կոդը կամ արժույթը սխալ է:', $scope, 'information');
        }
        else {
            $scope.FromTamplate = true;
            $scope.ForSetFee = true;
            $scope.order.Code = receivedTransfer.Code;
            $scope.order.Sender = receivedTransfer.SenderName;
            $scope.order.NATSender = receivedTransfer.NATSenderLastName + " " + receivedTransfer.NATSenderFirstName;
            $scope.order.Amount = receivedTransfer.TotalAmount;
            $scope.order.Currency = receivedTransfer.Currency;
            if ($scope.order.Currency == 'AMD')
                $scope.order.Amount = Number(($scope.order.Amount).toFixed(1));
            $scope.order.Country = receivedTransfer.CountryCode;
            $scope.getClientTransferAmount();
            
           $scope.order.FeeAcba = receivedTransfer.AcbaFee;

            $scope.closeSearchReceivedTransfersModal();
        }

    }

    $scope.closeSearchReceivedTransfersModal = function () {
        $scope.searchReceivedTransfersModalInstance.close();
    }

    $scope.showRejectTransfer = function () {
        if ($http.pendingRequests.length == 0) {

            $scope.error = "";

            var temp = '/ReceivedFastTransferPaymentOrder/ReceivedFastTransferReject';
            var cont = 'ReceivedFastTransferPaymentOrderCtrl';
            var id = 'ReceivedFastTransferReject';
            var title = 'Փոխանցման չեղարկում';



            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };
            $scope.order.ContractId = $scope.transfer.Contract.ContractId;
            $scope.changeOrder.ReceivedFastTransfer = $scope.order;
            $rootScope.changeOrder = $scope.changeOrder;
            dialogService.open(id, $scope, title, temp, dialogOptions);
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Մերժել>> կոճակը:', 'error');

        }
    };




    $scope.openRemittanceSearchModal = function () {
        $scope.searchRemittanceModalInstance = $uibModal.open({

            template: '<searchremittance callback="getRemittanceDetails(remittanceDetails)" close="closeRemittanceDetailsModal()"></searchremittance>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    };

    $scope.getRemittanceDetails = function (remittanceDetails) {
        if (($scope.NewOrEditFromCallCenter == 2 || $scope.transferByCall != undefined) && ($scope.order.Currency != remittanceDetails.CurrencyCode || $scope.order.Code != remittanceDetails.URN) && ($scope.order.SourceType == 1 || $scope.order.SourceType == 5)) {
            $scope.closeRemittanceDetailsModal();
            showMesageBoxDialog('Փոխանցման կոդը կամ արժույթը սխալ է:', $scope, 'information');
        }
        else {
            $scope.FromTamplate = true;
            $scope.ForSetFee = true;
            $scope.order.Code = remittanceDetails.URN;
            $scope.order.Sender = remittanceDetails.SenderFirstName + ' ' + remittanceDetails.SenderLastName;
            $scope.order.Amount = remittanceDetails.PrincipalAmount;
            $scope.order.NATSender = remittanceDetails.NATSenderLastName + " " + remittanceDetails.NATSenderFirstName;
            $scope.order.SenderPhone = remittanceDetails.SenderMobileNo;
            $scope.order.SenderAgentName = remittanceDetails.SendAgentName;            
            //if ($scope.order.Currency == 'AMD')
            //    $scope.order.Amount = Number(($scope.order.Amount).toFixed(1));
            $scope.order.Country = remittanceDetails.SenderCountryCode;
            //$scope.getClientTransferAmount();

            $scope.order.FeeAcba = remittanceDetails.BeneficiaryFee;

            $scope.order.MTOAgentCode = remittanceDetails.MTOAgentCode;
     

            $scope.order.BeneficiaryFiscalCode = remittanceDetails.BeneficiaryFiscalCode;

            $scope.getCountries();
            $scope.getCitiesByCountry(remittanceDetails.BeneficiaryCountryCode, '1');
            $scope.getStates(remittanceDetails.BeneficiaryCountryCode);
            $scope.getSendingCurrencies();
            $scope.getDocumentTypes();
            $scope.getCitiesByCountry($scope.order.BeneficiaryIssueCountryCode, '2');

            $scope.order.Currency = remittanceDetails.CurrencyCode;


            $scope.order.BeneficiaryCountryCode = remittanceDetails.BeneficiaryCountryCode;
            $scope.order.BeneficiaryCityCode = remittanceDetails.BeneficiaryCityCode;
            $scope.order.BeneficiaryStateCode = remittanceDetails.BeneficiaryStateCode;
            $scope.setDescription();
            $scope.closeRemittanceDetailsModal();
        }

    };

    $scope.closeRemittanceDetailsModal = function () {
        $scope.searchRemittanceModalInstance.close();
    };

    $scope.getSexes = function () {
        var Data = infoService.getARUSSexes();
        Data.then(function (s) {
            $scope.sexes = s.data;
        },
            function () {
                alert('Error getSexes');
            });
    };

    $scope.getYesNo = function () {
        var Data = infoService.getARUSYesNo();
        Data.then(function (yesNo) {
            $scope.YesNoList = yesNo.data;
        },
            function () {
                alert('Error getYesNo');
            });
    };

    $scope.getCountries = function () {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '') {
            var Data = infoService.getARUSCountriesByMTO($scope.order.MTOAgentCode);
            Data.then(function (c) {
                $scope.countries = c.data;        
                $scope.documentCountries = c.data;
                $scope.senderCountries = c.data;
            },
                function () {
                    alert('Error getCountries');
                });
        }

    };

   

    $scope.getStates = function (countryCode) {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '' && countryCode != undefined && countryCode != '') {
            var Data = infoService.getARUSStates($scope.order.MTOAgentCode, countryCode);
            Data.then(function (c) {
                $scope.states = c.data;
            },
                function () {
                    alert('Error getStates');
                });
        }
    };

    $scope.getCitiesByCountry = function (countryCode, citiesType) {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '' && countryCode != undefined && countryCode != '') {
            var Data = infoService.getARUSCitiesByCountry($scope.order.MTOAgentCode, countryCode);
            Data.then(function (c) {
                if (citiesType == '1') {   //Ստացողի քաղաքներ
                    $scope.cities = c.data;
                }
                else if (citiesType == '2') {   //Ստացողի փաստաթղթի թողարկման քաղաքներ
                    $scope.documentCities = c.data;
                }
               
               
            },
                function () {
                    alert('Error getCitiesByCountry');
                });
        }
    };

    $scope.getCitiesByState = function (countryCode, stateCode) {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '' && countryCode != undefined && countryCode != '' && stateCode != undefined && stateCode != '') {
            var Data = infoService.getARUSCitiesByState($scope.order.MTOAgentCode, countryCode, stateCode);
            Data.then(function (c) {
                $scope.cities = c.data;
            },
                function () {
                    alert('Error getCitiesByState');
                });
        }
    };

    $scope.getMTOList = function () {        
        var Data = infoService.getARUSMTOList();
        Data.then(function (c) {
            $scope.MTOList = c.data;
        },
            function () {
                alert('Error getMTOList');
            });
        
    };

    $scope.getDocumentTypes = function () {
        if ($scope.order.MTOAgentCode != undefined && $scope.order.MTOAgentCode != '') {
            var Data = infoService.getARUSDocumentTypes($scope.order.MTOAgentCode);
            Data.then(function (types) {
                $scope.documentTypes = types.data;
            },
                function () {
                    alert('getDocumentTypes');
                });
        }
    };

    $scope.getCountriesWithA3 = function () {       
        var Data = infoService.getCountriesWithA3();
        Data.then(function (c) {
            $scope.countriesA3 = c.data;
        },
            function () {
                alert('getCountriesWithA3');
            });       
    };

    $scope.getARUSDocumentTypeCode = function (ACBADocumentTypeCode) {
        var Data = infoService.getARUSDocumentTypeCode(ACBADocumentTypeCode);
        Data.then(function (d) {
            $scope.order.BeneficiaryDocumentTypeCode = d.data;
        },
            function () {
                alert('getARUSDocumentTypeCode');
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
        $scope.order.CustomerNumber = customer.customerNumber;
        $scope.getCustomer();
        $scope.getBeneficiaryData();
        //$scope.getContractsForTransfersCall(1);

        var Data = transferCallsService.getContractsForTransfersCall($scope.order.CustomerNumber, "0", "");

        Data.then(function (ContractsForTransfersCall) {
            $scope.transferContracts = ContractsForTransfersCall.data;

        },
            function () {
                alert('Error getContractsForTransfersCall');
            });
        $scope.closeSearchCustomersModal();
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };


    $scope.getContractsForTransfersCall = function (findParamNumber) {
        var customerNumber = $scope.order.CustomerNumber;
        var accountNumber = $scope.transferByCall.accountNumber;
        var cardNumber = $scope.transferByCall.cardNumber;

        if ($scope.transfer.contract != undefined) {

            $scope.transfer.Contract.ContractPassword = "";
            $scope.transfer.Contract.CreditLineQuality = "";
            $scope.transfer.Contract.Currency = "";
            $scope.transfer.Contract.MotherName = "";
            $scope.transfer.Contract.CardValidationDateString = "";
        }

        $scope.customerDahk = "";
        $scope.transfer.contactPhone = "";

        if (findParamNumber == 1) {
            $scope.transferByCall.cardNumber = "";
            $scope.transferByCall.accountNumber = "";

            if ($scope.order.CustomerNumber == undefined) {
                return $scope.transferContracts = "";
            }

            if ($scope.order.CustomerNumber.length < 4) {
                return $scope.transferContracts = "";
            }
            accountNumber = 0;
            cardNumber = "";
        }

        if (findParamNumber == 2) {
            $scope.transferByCall.cardNumber = "";
            $scope.order.CustomerNumber = "";

            if (accountNumber == null) {
                return $scope.transferContracts = "";
            }
            customerNumber = "";
            cardNumber = "";
        }

        if (findParamNumber == 3) {
            $scope.order.CustomerNumber = "";
            $scope.transferByCall.accountNumber = "";

            if ($scope.transferByCall.cardNumber.length < 4) {
                return $scope.transferContracts = "";
            }

            customerNumber = "";
            accountNumber = 0;
        }


        var Data = transferCallsService.getContractsForTransfersCall(customerNumber, accountNumber, cardNumber);

        Data.then(function (ContractsForTransfersCall) {
            $scope.transferContracts = ContractsForTransfersCall.data;
            if ($scope.transferContracts.length == 1) {
                $scope.transferByCall.cardNumber = $scope.transferContracts[0].CardNumber;
                $scope.transferByCall.accountNumber = $scope.transferContracts[0].AccountNumber;
                $scope.order.CustomerNumber = $scope.transferContracts[0].CustomerNumber.toString();
                $scope.getCustomer($scope.order.CustomerNumber);
                $scope.getBeneficiaryData();
                $scope.transfer.Contract = $scope.transferContracts[0];
                $scope.transfer.contactPhone = $scope.transferContracts[0].CardPhone;
                $scope.transfer.contractID = $scope.transferContracts[0].ContractId;
                $scope.transfer.contractFilialCode = $scope.transferContracts[0].ContractFilialCode;

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

    $scope.getContractDetails = function () {

        $scope.customerDahk = "";
        $scope.getCustomer($scope.order.customerNumber);

        $scope.transferByCall.accountNumber = $scope.transfer.Contract.AccountNumber;
        $scope.transferByCall.cardNumber = $scope.transfer.Contract.CardNumber;
       

        var Data = customerService.GetCustomerDebts($scope.order.CustomerNumber);
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

    

}]);