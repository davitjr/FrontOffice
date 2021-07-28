app.controller("InternationalPaymentOrderCtrl", ['$scope', 'internationalPaymentOrderService', 'utilityService', 'accountService', 'customerService', 'infoService', 'dialogService', 'paymentOrderService', 'orderService', '$confirm', '$filter', '$uibModal', '$http', 'ReportingApiService', function ($scope, internationalPaymentOrderService, utilityService, accountService, customerService, infoService, dialogService, paymentOrderService, orderService, $confirm, $filter, $uibModal, $http, ReportingApiService) {

    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

    $scope.generateNewOrderNumber = function () {
        $scope.getOrderNumberType();
        var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
        Data.then(function (nmb) {
            $scope.order.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };

    $scope.intermediaryBankSwiftChange = function () {
        if ($scope.order.IntermediaryBankSwift != undefined) {
            if ($scope.order.IntermediaryBankSwift.length == 8)
                $scope.order.IntermediaryBankSwift = $scope.order.IntermediaryBankSwift + "XXX";
            var Data = infoService.getInfoFromSwiftCode($scope.order.IntermediaryBankSwift, 1);

            Data.then(function (result) {
                $scope.order.IntermediaryBank = result.data;
            }, function () {
                alert('Error in intermediaryBankSwiftChange');
            });
        }

    }

    $scope.ReceiverSwiftChange = function () {
        if ($scope.order.ReceiverSwift != undefined) {
            if ($scope.order.ReceiverSwift.length == 8)
                $scope.order.ReceiverSwift = $scope.order.ReceiverSwift + "XXX";
            var Data = infoService.getInfoFromSwiftCode($scope.order.ReceiverSwift, 2);

            Data.then(function (result) {
                $scope.order.Country = result.data;

            }, function () {
                alert('Error in ReceiverSwiftChange');
            });
        }

    }
    $scope.ReceiverBankSwiftChange = function () {
        if ($scope.order.ReceiverBankSwift != undefined) {
            if ($scope.order.ReceiverBankSwift.length == 8)
                $scope.order.ReceiverBankSwift = $scope.order.ReceiverBankSwift + "XXX";

            var Data = infoService.getInfoFromSwiftCode($scope.order.ReceiverBankSwift, 1);

            Data.then(function (result) {
                if (result.data != undefined && result.data != "") {
                    $scope.order.ReceiverBank = result.data;
                }
                else {
                    $scope.order.ReceiverBank = "";
                    $scope.order.Country = 0;
                }

            }, function () {
                alert('Error in ReceiverBankSwiftChange');
            });
            var Data = infoService.getInfoFromSwiftCode($scope.order.ReceiverBankSwift, 2);

            Data.then(function (result) {
                if (result.data != "") {
                    $scope.order.Country = result.data;

                    //$scope.getFee()
                }

            }, function () {
                alert('Error in ReceiverBankSwiftChange');
            });
        }
    }

    if ($scope.order == undefined) {
        $scope.order = {};
        $scope.order.OrderNumber = " ";
        $scope.order.Type = 3;
        $scope.orderAttachment = {};
        $scope.order.SwiftCodeType = 0;
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        if ($scope.swiftMessage != undefined) {
            $scope.disableDebitAccount = true;
            //var Data = accountService.getAccountInfo($scope.swiftMessage.ReceiverAccount);
            //Data.then(function (acc) {
            //    $scope.order.ReceiverAccount = acc.data;
            //}, function () {

            //    alert('Error getAccount');
            //});
            $scope.order.ReceiverAccount = {};
            $scope.order.ReceiverAccount.AccountNumber = $scope.swiftMessage.ReceiverAccount;

            $scope.order.Receiver = $scope.swiftMessage.Receiver;



            $scope.order.SwiftMessageID = $scope.swiftMessage.ID;
            $scope.order.CustomerNumber = $scope.swiftMessage.CustomerNumber;
            $scope.order.Amount = $scope.swiftMessage.Amount;
            $scope.order.Currency = $scope.swiftMessage.Currency;
            $scope.description = $scope.swiftMessage.Description;
            $scope.order.DescriptionForPayment = $scope.swiftMessage.Description;
            $scope.order.ReceiverSwift = $scope.swiftMessage.ReceiverSwift;

            $scope.order.ReceiverBankSwift = $scope.swiftMessage.ReceiverBankSwift;
            $scope.ReceiverBankSwiftChange();
            $scope.order.IntermediaryBankSwift = $scope.swiftMessage.IntermediaryBankSwift;
            $scope.intermediaryBankSwiftChange();
            $scope.order.MT = '202'
            var DataOPPerson = orderService.setOrderPerson($scope.swiftMessage.CustomerNumber);
            DataOPPerson.then(function (ord) {
                $scope.order.OPPerson = ord.data;
                $scope.order.OPPerson.PersonBirth = new Date(parseInt(ord.data.PersonBirth.substr(6)));
            }, function () {
                alert('Error CashTypes');
            });

        }
        else {
            $scope.order.MT = '103'
            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (descr) {
                $scope.order.CustomerNumber = descr.data;
                $scope.getCustomerDocumentWarnings($scope.order.CustomerNumber);

            });
        }
    }



    $scope.getOrderNumberType = function () {
        if ($scope.order.Type == 3 || $scope.order.Type == 64)
            $scope.orderNumberType = 4;
    };

    $scope.getCustomer = function () {

        if ($scope.swiftMessage != undefined)
            var Data = customerService.getCustomer($scope.swiftMessage.CustomerNumber);
        else
            var Data = customerService.getCustomer();
        Data.then(function (cust) {
            $scope.customer = cust.data;

            $scope.order.SenderType = cust.data.CustomerType;
            $scope.order.Password = cust.data.SecurityCode;
            $scope.SenderCountry = cust.data.Country;
            $scope.SenderName = '';
            if ($scope.order.SenderType == 6) {
                $scope.order.SenderNameDescription = 'Անուն ազգանուն';

                $scope.order.Sender = cust.data.FirstNameEng + ' ' + cust.data.LastNameEng;
                if ($scope.order.Currency == 'RUR') {
                    $scope.order.Sender = '';
                }
                $scope.SenderName = $scope.order.Sender;
                if ($scope.customer.DocumentNumber != null && $scope.customer.DocumentNumber != "");
                $scope.order.SenderPassport = $scope.customer.DocumentNumber +
                    ', ' +
                    $scope.customer.DocumentGivenBy +
                    ', ' +
                    $scope.customer.DocumentGivenDate;
                if ($scope.customer.BirthDate != null && $scope.customer.BirthDate != undefined) {
                    var birthDate = $scope.customer.BirthDate;
                    var dateTmp = moment(birthDate);
                    var sec = dateTmp._d.setHours(dateTmp._d.getHours() - dateTmp._d.getTimezoneOffset() / 60);

                    $scope.order.SenderDateOfBirth = new Date(sec);
                }

            }
            else {
                $scope.order.SenderNameDescription = 'Անվանում';

                $scope.order.Sender = cust.data.OrganisationNameEng.replace(/'/g, " ").replace(/"/g, " ")
                    .replace(/§/g, "").replace(/¦/g, " ");
                $scope.SenderName = $scope.order.Sender;
                if ($scope.order.Currency == 'RUR') {
                    $scope.order.Sender = '';
                }
                $scope.order.SenderCodeOfTax = cust.data.TaxCode;
            }


            if (cust.data.EmailList != null) {
                if (cust.data.EmailList.length > 0) {
                    $scope.order.SenderEmail = cust.data.EmailList[0];
                }
            }

        }, function () {
            alert('Error');
        });

    };



    $scope.countries = [];
    //Երկրների ցուցակ
    $scope.GetCountries = function () {
        $scope.countries = null;
        var Data = infoService.getCountries();
        Data.then(function (acc) {
            $scope.countries = FillCombo(acc.data);
            $scope.countries.sort();
        }, function () {
            alert('Countries Error');
        });

    };


    $scope.GetReceiverType = function () {
        $scope.receiverTypes = [
            { id: '1', name: 'Ֆիզիկական անձ' },
            { id: '2', name: 'Իրավաբանական անձ' },
            { id: '3', name: 'Անհատ ձեռնարկատեր' }];
    };

    $scope.GetDescriptionForPaymentRUR1 = function () {
        $scope.DescriptionForPaymentRUR1 = [
            { name: 'Материальная помощь' },
            { name: 'Оплата за' },
            { name: 'Предоплата за' },
            { name: 'Другое' }];
    };

    $scope.GetDescriptionForPaymentRUR5 = function () {
        $scope.DescriptionForPaymentRUR5 = [
            { name: 'без НДС' },
            { name: 'с НДС' }];
    };

    $scope.GetDetailsOfCharges = function () {
        $scope.detailsOfCharges = [
            { name: 'OUR' },
            { name: 'BEN' },
            { name: 'OUROUR' }];
    };

    $scope.GetMTList = function () {
        $scope.MTList = [
            { name: '103' },
            { name: '202' }];
    };
    $scope.getDebitAccounts = function (orderType, orderSubType) {
        if ($scope.swiftMessage != undefined) {
            var Data = paymentOrderService.getCustomerAccountsForOrder($scope.swiftMessage.CustomerNumber, orderType, orderSubType, 2);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;

                $scope.DebitAccount = $.grep($scope.debitAccounts, function (v) { return v.AccountNumber === $scope.swiftMessage.Account.AccountNumber.toString(); })[0]
                $scope.DebitAccountNumber = $scope.DebitAccount.AccountNumber;
                $scope.checkForDebitAccount = 0;
                $scope.order.DebitAccount = $scope.DebitAccount


            }, function () {
                alert('Error getcreditaccounts');
            });

        }
        else {
            var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 1);
            Data.then(function (acc) {
                $scope.debitAccounts = acc.data;
            }, function () {
                alert('Error getdebitaccounts');
            });
        }
    };


    $scope.getFeeAccounts = function (orderType, orderSubType) {
        if ($scope.swiftMessage != undefined) {
            var Data = paymentOrderService.getCustomerAccountsForOrder($scope.swiftMessage.CustomerNumber, orderType, orderSubType, 3);
            Data.then(function (acc) {
                $scope.feeAccounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        }
        else {
            var Data = paymentOrderService.getAccountsForOrder(orderType, orderSubType, 3);
            Data.then(function (acc) {
                $scope.feeAccounts = acc.data;
            }, function () {
                alert('Error getfeeaccounts');
            });
        }
    };


    $scope.getFee = function () {
        if ($scope.order.Currency != null && $scope.order.Amount != null && $scope.order.Amount > 0) {
            var Data = internationalPaymentOrderService.getFee($scope.order);

            Data.then(function (fee) {
                $scope.order.TransferFee = fee.data;
                if (fee.data == -1) {
                    $scope.order.Fees = undefined;
                    return ShowMessage('Սակագին նախատեսված չէ:Ստուգեք փոխանցման տվյալները:', 'error');
                }
                if ($scope.order.TransferFee == 0) {
                    $scope.order.TransferFee = null;
                    //  $scope.order.FeeAccount = ""
                }
            }, function () {
                alert('Error getfee');
            });

        }
        else {
            $scope.order.TransferFee = null;
            //$scope.order.FeeAccount = ""
        }

    };

    $scope.getCardFee = function () {
        if ($scope.order.DebitAccount != undefined && $scope.order.Currency != undefined) {
            if ($scope.order.DebitAccount.AccountType == 11 && $scope.order.DebitAccount.Currency != null && $scope.order.Amount != null && $scope.order.Amount > 0) {

                var Data = paymentOrderService.getCardFee($scope.order);

                Data.then(function (fee) {
                    $scope.order.CardFee = fee.data;
                    $scope.CardFeeCurrency = $scope.order.DebitAccount.Currency;


                }, function () {
                    alert('Error getcardfee');
                });

            }
            else {
                $scope.order.CardFee = null;
                $scope.order.CardFeeCurrency = "";
            }
        }
    };


    $scope.getAccountDescription = function (account) {
        if (account.AccountType == 11) {
            return account.AccountDescription + ' ' + account.Currency;
        }
        else {
            return account.AccountNumber + ' ' + account.Currency;
        }
    }


    $scope.confirm = false;
    $scope.saveInternationalPayment = function () {

    
        if ($scope.order.SwiftPurposeCode != '999') {
                $scope.order.PurposeCodeOther = $scope.order.SwiftPurposeCode;
            }




        if ($http.pendingRequests.length == 0) {

            if ( $scope.order.MT == '103' && $scope.order.ReceiverBankSwift != undefined && $scope.order.Currency != 'RUR') {
                if ($scope.order.ReceiverBankSwift.slice(4, 6) == 'AE' && ($scope.order.PurposeCodeOther == null || $scope.order.PurposeCodeOther == '' || $scope.order.PurposeCodeOther == undefined)) {
                    ShowMessage('Առանց <<Փոխանցման նպատակի կոդ>> /  Purpose code  դաշտի լրացման փոխանցումը Բանկի կողմից կընդունվի կատարման, սակայն հետագա պատասխանատվություն այլևս չի կրի գումարից հետագա գանձումների կամ հետ վերադարձի համար', 'error');

                }
            }

            document.getElementById("interLoad").classList.remove("hidden");

            //$scope.order.Type = 3;
            //$scope.order.SubType = 1;
            $scope.order.Attachments = [];
            if ($scope.orderAttachment.attachmentArrayBuffer != undefined && $scope.orderAttachment.attachmentArrayBuffer != null) {
                var oneAttachment = {};
                oneAttachment.Attachment = $scope.orderAttachment.attachmentArrayBuffer;
                oneAttachment.FileName = $scope.orderAttachment.attachmentFile.name;
                oneAttachment.FileExtension = $scope.orderAttachment.attachmentFile.getExtension();

                $scope.order.Attachments.push(oneAttachment);
            }
            $scope.order.Description = $scope.description;
            var Data = internationalPaymentOrderService.saveInternationalPaymentOrder($scope.order, $scope.confirm);

            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("interLoad").classList.add("hidden");
                    CloseBPDialog('internationalpaymentorder');
                    if ($scope.swiftMessage != undefined)
                        $scope.path = '';
                    else
                        $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    refresh($scope.order.Type, $scope.order.DebitAccount, $scope.order.ReceiverAccount);
                }
                else {
                    document.getElementById("interLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveInternationalPayment);

                }
            }, function () {
                $scope.confirm = false;
                document.getElementById("interLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in InternationalPaymentOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    //Նշվում է արժույթի/ների կուրսերը և փոխարկման տեսակը
    $scope.setConvertationRates = function () {

        if ($scope.order.DebitAccount != undefined && $scope.order.Currency != undefined && $scope.order.DebitAccount.Currency != $scope.order.Currency) {

            var dCur = $scope.order.DebitAccount.Currency;
            var cCur = $scope.order.Currency;

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
            $scope.getCardFee();

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


    $scope.checkTransferFeeForTransitPaymentOrder = function () {
        if ($scope.order.TransferFee > 0) {
            $scope.params = {
                paymentOrder: $scope.order, forFee: 1
            };
            return true;
        }
        else {
            showMesageBoxDialog('Միջնորդավճարը սխալ է', $scope, 'information');
            return false;

        }
    }


    $scope.currencies = [];
    //Արժույթները
    $scope.GetCurrencies = function () {
        var Data = infoService.GetInternationalPaymentCurrencies();
        Data.then(function (acc) {
            $scope.currencies = acc.data;
        }, function () {
            alert('Currencies Error');
        });

    };
    //Հաշվարկվում է փոխարկվող գումարը կրեդիտագրվող հաշվի արժույթով
    $scope.calculateConvertationAmount = function () {
        if ($scope.order.ConvertationType != 3) $scope.order.ConvertationRate = $scope.order.Rate;
        if ($scope.order.Amount && $scope.order.Rate && $scope.order.DebitAccount.Currency != $scope.order.Currency) {
            if ($scope.order.ConvertationType == 3)//"Կրկնակի փոխարկում"
                $scope.order.AmountConvertation = Math.round(($scope.order.Amount * ($scope.order.ConvertationRate1 / $scope.order.ConvertationRate)) * 1000000) / 1000000;
            else
                $scope.order.AmountConvertation = Math.round(($scope.order.Amount * $scope.order.Rate) * 100) / 100;

            $scope.order.AmountConvertation = utilityService.formatNumber($scope.order.AmountConvertation, 2);
        }
        $scope.getCardFee();
    }



    $scope.rateChanged = function () {
        if ($scope.order.ConvertationType == 3) {
            var dRate = 0;
            if ($scope.order.DebitAccount != undefined) {
                var dCur = $scope.order.DebitAccount.Currency;
            }
            if ($scope.order.Currency != undefined) {
                var cCur = $scope.order.Currency;
            }
            var Data = internationalPaymentOrderService.getCrossConvertationVariant(dCur, cCur);
            Data.then(function (acc) {
                $scope.crossVariant = acc.data;
                if ($scope.crossVariant == 0) {
                    return ShowMessage('Տվյալ զույգ արժույթների համար փոխարկում չի նախատեսված:', 'error');
                }
                if ($scope.crossVariant == 1) {
                    var dData = utilityService.getLastRates(dCur, 5, 2);// Cross Buy
                    dData.then(function (dResult) {
                        dRate = dResult.data;
                        $scope.order.ConvertationRate1 = (dRate / $scope.order.Rate).toFixed(3);
                        $scope.calculateConvertationAmount();
                    }, function () {
                        alert('Error in rateChanged');
                    });
                }
                if ($scope.crossVariant == 2) {
                    var dData = utilityService.getLastRates(dCur, 5, 2);// Cross Buy
                    dData.then(function (dResult) {
                        dRate = dResult.data;
                        $scope.order.ConvertationRate1 = (dRate * $scope.order.Rate).toFixed(3);
                        $scope.calculateConvertationAmount();

                    }, function () {
                        alert('Error in rateChanged');
                    });
                }



            }, function () {
                alert('Error in rateChanged');
            });
        }
        else {
            if ($scope.rateChangingAccess) { $scope.order.ConvertationRate = $scope.order.Rate }
        }
        $scope.calculateConvertationAmount();
    }






    $scope.$watch('order.Country', function (newValue, oldValue) {

        if ($scope.order.Country != undefined) {
            if ($scope.order.Country != 0 && $scope.order.ReceiverBank != '' && $scope.order.ReceiverBank != undefined && $scope.order.IntermediaryBankSwift != undefined && $scope.order.IntermediaryBankSwift != '') {
                $scope.isdisable = 1;
            }
            else {
                $scope.isdisable = 0;
            }
            $scope.getFee();
        }
        else {
            $scope.isdisable = 0;
        }
    });


    //Միջազգային հանձնարարականի տպում
    $scope.printInternationalPaymentOrder = function (isNewOrder) {

        if ($http.pendingRequests.length == 0) {

            showloading();
            if (isNewOrder != 1) {
                var Data = internationalPaymentOrderService.printInternationalPaymentOrder($scope.orderDetails);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 76, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error printInternationalPaymentOrder');
                });

            }
            else {
                var Data = internationalPaymentOrderService.printInternationalPaymentOrder($scope.order);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 76, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error printInternationalPaymentOrder');
                });

            }

        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }

    };

    $scope.setCountyRiskQuality = function () {
        if ($scope.order.Country != undefined) {
            var Data = infoService.getCountyRiskQuality($scope.order.Country);

            Data.then(function (result) {
                $scope.CountyRiskQuality = result.data;

            }, function () {
                alert('Error in GetCountyRiskQuality');
            });
        }
        else {
            $scope.CountyRiskQuality = '';
        }
    }

    $scope.getInternationalPaymentOrder = function (orderID) {

        document.getElementById("interDetailsLoad").classList.remove("hidden");



        var Data = internationalPaymentOrderService.getInternationalPaymentOrder(orderID);
        Data.then(function (acc) {

            $scope.orderDetails = acc.data;
            $scope.orderDetails.RegistrationDate = $filter('mydate')($scope.orderDetails.RegistrationDate, "dd/MM/yyyy");
            $scope.orderDetails.OperationDate = $filter('mydate')($scope.orderDetails.OperationDate, "dd/MM/yyyy");
            $scope.orderDetails.SenderDateOfBirth = $filter('mydate')($scope.orderDetails.SenderDateOfBirth, "dd/MM/yyyy");
            document.getElementById("interDetailsLoad").classList.add("hidden");
        }, function () {
            document.getElementById("interDetailsLoad").classList.add("hidden");
            alert('Error getInternationalPaymentOrder');
        });

    };

    $scope.setUrgentSign = function () {
        if ($scope.order.Amount != null && !((($scope.order.Currency == 'USD' || $scope.order.Currency == 'EUR') && $scope.order.Amount < 500000) || ($scope.order.Currency == 'RUR' && $scope.order.Amount < 10000000))) {
            $scope.order.UrgentSign = false;
        }

    };


    $scope.$watch('order.Currency', function (newValue, oldValue) {
        if ($scope.order.Currency != undefined) {
            if ($scope.order.Currency == 'RUR') {
                $scope.order.Sender = '';
            }
            else {
                $scope.order.Sender = $scope.SenderName;
            }

        }
    });
    $scope.$watch('order.DebitAccount', function (newValue, oldValue) {
        if ($scope.order.DebitAccount != undefined) {

            if (($scope.order.Type == 64 || ($scope.order.Type == 3 && $scope.order.Currency == undefined && $scope.swiftMessage == undefined)) && $scope.order.DebitAccount.Currency in $scope.currencies) {
                $scope.order.Currency = $scope.order.DebitAccount.Currency;
            }
            else if ($scope.order.Type == 64 && !($scope.order.DebitAccount.Currency in $scope.currencies)) {
                $scope.order.Currency = undefined;
            }

            $scope.setConvertationRates();
        }
    });


    $scope.$watch('order.DescriptionForPayment', function (newValue, oldValue) {
        if ($scope.order.DescriptionForPayment != undefined) {

            $scope.description = $scope.order.DescriptionForPayment;
        }
    });


    $scope.searchSwiftCodes = function () {
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
        if ($scope.order.SwiftCodeType == 2) {
            $scope.order.ReceiverBankSwift = swiftCode;
            $scope.ReceiverBankSwiftChange();
        }
        else if ($scope.order.SwiftCodeType == 1) {
            $scope.order.IntermediaryBankSwift = swiftCode;
            $scope.intermediaryBankSwiftChange();
        }
        $scope.closeSearchSwiftCodesModal();
    }

    $scope.closeSearchSwiftCodesModal = function () {
        $scope.searchSwiftCodesModalInstance.close();
    }



    $scope.searchInternationalTransfers = function () {

        if ($scope.order.DebitAccount != undefined) {
            if ($scope.order.Type == 64) {

                var Data = utilityService.getOperationSystemAccount($scope.order, 2, $scope.order.DebitAccount.Currency);
                Data.then(function (acc) {
                    $scope.accNumber = acc.data.AccountNumber;
                    $scope.openSearchInternationalTransfersModal();
                },
                    function () {
                        alert('Error getOperationSystemAccount');
                    });

            }
            else {
                $scope.accNumber = $scope.order.DebitAccount.AccountNumber;
                $scope.openSearchInternationalTransfersModal();
            }
        }
        else {
            $scope.accNumber = null;
            $scope.openSearchInternationalTransfersModal();
        }
        $scope.searchInternationalTransfersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };



    $scope.openSearchInternationalTransfersModal = function () {
        $scope.searchInternationalTransfersModalInstance = $uibModal.open({

            template: '<searchinternationaltransfer callback="getSearchedInternationalTransfer(internationalTransfer)" close="closeSearchInternationalTransfersModal()" accnumber="' + $scope.accNumber + '"></searchinternationaltransfer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });
    }

    $scope.getSearchedInternationalTransfer = function (internationalTransfer) {
        $scope.order.SenderPhone = internationalTransfer.SenderPhone;
        $scope.order.SenderAddress = internationalTransfer.SenderAddress;
        $scope.order.SenderOtherBankAccount = internationalTransfer.SenderOtherBankAccount;
        $scope.order.ReceiverBankSwift = internationalTransfer.ReceiverBankSwift;
        $scope.order.ReceiverBank = internationalTransfer.ReceiverBank;
        $scope.order.IntermediaryBankSwift = internationalTransfer.IntermediaryBankSwift;
        $scope.order.IntermediaryBank = internationalTransfer.IntermediaryBank;
        $scope.order.ReceiverBankAddInf = internationalTransfer.ReceiverBankAddInf;
        $scope.order.BIK = internationalTransfer.BIK;
        $scope.order.KPP = internationalTransfer.KPP;
        $scope.order.ReceiverAccount = { AccountNumber: internationalTransfer.ReceiverAccount };
        $scope.order.Receiver = internationalTransfer.ReceiverName;
        $scope.order.ReceiverAddInf = internationalTransfer.ReceiverAddInf;
        $scope.order.INN = internationalTransfer.INN;
        $scope.order.CorrAccount = internationalTransfer.CorrAccount;
        $scope.order.ReceiverType = internationalTransfer.ReceiverType;
        if ($scope.order.Currency != 'RUR') {
            $scope.order.DescriptionForPayment = internationalTransfer.DescriptionForPayment;
        }
        $scope.order.DescriptionForPaymentRUR1 = internationalTransfer.DescriptionForPaymentRUR1;
        $scope.order.DescriptionForPaymentRUR2 = internationalTransfer.DescriptionForPaymentRUR2;
        $scope.order.DescriptionForPaymentRUR3 = internationalTransfer.DescriptionForPaymentRUR3;
        $scope.order.DescriptionForPaymentRUR4 = internationalTransfer.DescriptionForPaymentRUR4;
        $scope.order.DescriptionForPaymentRUR5 = internationalTransfer.DescriptionForPaymentRUR5;
        $scope.order.DescriptionForPaymentRUR6 = internationalTransfer.DescriptionForPaymentRUR6;
        $scope.order.Country = internationalTransfer.Country;
        $scope.closeSearchInternationalTransfersModal();
    }

    $scope.closeSearchInternationalTransfersModal = function () {
        $scope.searchInternationalTransfersModalInstance.close();
    }

    $scope.getCustomerDocumentWarnings = function (customerNumber) {
        var Data = customerService.getCustomerDocumentWarnings(customerNumber);
        Data.then(function (ord) {
            $scope.customerDocumentWarnings = ord.data;
        }, function () {
            alert('Error CashTypes');
        });

    };

    $scope.tooltipClass = function () {
        $("[data-toggle=tooltip]").tooltip({ container: 'body' });
        $(".tip").tooltip({ placement: 'top', container: 'body' });
        $(".tipR").tooltip({ placement: 'right', container: 'body' });
        $(".tipB").tooltip({ placement: 'bottom', container: 'body' });
        $(".tipL").tooltip({ placement: 'left', container: 'body' });
    }



    $scope.order.TransferAdditionalData = {};
    $scope.openTransferAdditionalDetailsModal = function () {
        $scope.isAddDataFormOpening = true;
        if ($scope.order.Amount == "" || $scope.order.Amount == undefined) {
            return;
        }
        $scope.transferAdditionalDetailsModal = $uibModal.open({
            template: '<transferadditionaldataform dataformtype="1" transferamount="order.Amount" cashtransferdata="transferAdditionalData" callback="getTransferAdditionalData(transferAdditionalData)" close="closeTransferAdditionalDetailsModal()"></transferadditionaldataform>',
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

        $scope.setReceiverLivingPlaceDesc();
        $scope.setSenderLivingPlaceDesc();
        $scope.setTransferAmountPurposeDesc();
        $scope.isHasAdditionalData = true;
        $scope.transferAdditionalData.dataformtype = transferAdditionalData.dataformtype;
        $scope.closeTransferAdditionalDetailsModal();
    }

    $scope.deleteAdditionalData = function () {
        $scope.order.TransferAdditionalData = "";
        $scope.isHasAdditionalData = false;
        $scope.transferAdditionalData = undefined;
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
    };

    $scope.isUrgentTime = function () {
        $scope.isUrgentTime = false;

        var Data = internationalPaymentOrderService.isUrgentTime();
        Data.then(function (acc) {
            $scope.isUrgentTime = acc.data;
        }, function () {
            alert('Error isUrgentTime');
        });

    };

    $scope.GetSwiftPurposeCode = function () {

        var Data = infoService.GetSwiftPurposeCode();
        Data.then(function (acc) {

            $scope.purposeCode = acc.data;
        }, function () {
            alert('Error getCreditorStatuses');
        });

    };


    $scope.getOrderInfo = function () {
        var DataSessionProp = internationalPaymentOrderService.getSessionProperties();
        DataSessionProp.then(function (bond) {
            if (bond.data.IsCalledFromHB) {
                var Data = internationalPaymentOrderService.getInternationalPaymentOrder($scope.selectedOrderId);
                Data.then(function (acc) {
                    $scope.order = acc.data;
                }, function () {
                    alert('Error getOrderInfo');
                });

            }
        }, function () {
            alert('Error getCreditorStatuses');
        });
    };


    $scope.saveInternationalPaymentAddresses = function () {

        var Data = internationalPaymentOrderService.postInternationalPaymentAddresses($scope.orderDetails);
        Data.then(function (acc) {
            if (acc.data == "True") {
                showMesageBoxDialog('Պահպանված Է', $scope, 'information');
            }
            else {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
        }, function () {
            alert('Error getOrderInfo');
        });
    };


}]);