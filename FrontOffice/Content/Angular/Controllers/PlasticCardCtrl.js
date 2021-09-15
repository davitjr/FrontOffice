app.controller("PlasticCardCtrl", ['$scope', '$rootScope', 'plasticCardService', 'infoService', 'customerService', '$http', 'limitToFilter', 'dialogService', function ($scope, $rootScope, plasticCardService, infoService, customerService, $http, limitToFilter, dialogService) {


    $scope.plasticCardOrder = {
        //RegistrationDate: new Date(),
        involvingSetNumber: $rootScope.SessionProperties.UserId,
        servingSetNumber: $rootScope.SessionProperties.UserId,
        cardHolderCustomerNumber: 0,
        cardSMSPhone: "",
        reportReceivingEmail: ""

    };

    $scope.plasticCardOrder.plasticCard = {
        SupplementaryType: 1
    };

    //$scope.params = {
    //    dateOfInvestment8268Change: new Date("2020-03-31")
    //};

    $scope.dateOfInvestment8268Change = new Date("2020-03-31");

    $scope.maxDate = new Date();

    $scope.cardSMSPhones = [];

    $scope.AddressEng = "";

    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

    $scope.onlyBasicLatin = /^[\u0000-\u007F]+$/i;

    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error FilialList');
        });
    };


    $scope.getPlasticCardOrder = function (orderID) {

        var Data = plasticCardService.getPlasticCardOrder(orderID);

        Data.then(function (cardDetails) {
            $scope.order = cardDetails.data;
        });
    }

    $scope.openNewPlasticCardWindow = function (mainORattached) {

        var Data = customerService.getAuthorizedCustomerNumber();

        Data.then(function (customerNumber) {

            var cust = customerService.getCustomer(customerNumber);

            cust.then(function (customer) {

                if (customer.data.Quality == 43) {
                    showMesageBoxDialog('Հնարավոր չէ պատվիրել քարտ կրկնակի հաճախորդի համար:', $scope, 'error');
                }
                else if (customer.data.ResidenceCountry.key == "0") {

                    showMesageBoxDialog('Հաճախորդի երկիրը գտնված չէ:', $scope, 'error');
                } else {

                    $scope.disabelButton = true;
                    var dialogOptions = {
                        callback: function () {
                            if (dialogOptions.result !== undefined) {
                                cust.mncId = dialogOptions.result.whateverYouWant;
                            }
                        },
                        result: {}
                    };

                    if (mainORattached === 'Main') {
                        dialogService.open('plasticcardorder', $scope, 'Նոր քարտի հայտ', '/PlasticCardOrder/PlasticCardOrder', dialogOptions, undefined, undefined, undefined);
                    } else if (mainORattached === 'Linked') {

                        $scope.params = {
                            ordertype: 212
                        };
                        dialogService.open('plasticcardorder', $scope, 'Կից քարտի հայտ', '/PlasticCardOrder/LinkedCardOrder', dialogOptions, undefined, undefined, undefined);
                    }

                }
            }, function () {
                alert('Error getCustomer');
            });

        }, function () {
            alert('Error getAuthorizedCustomerNumber');
        });
    }

    $scope.getCardSystemTypes = function () {
        var Data = infoService.GetOrderableCardSystemTypes();
        Data.then(function (ref) {
            $scope.cardSystemTypes = ref.data;
        }, function () {
            alert('Error CardSystemTypes');
        });
    };

    $scope.getCardTypes = function (cardSystem) {
        var Data = infoService.getCardTypes(cardSystem);
        Data.then(function (ref) {
            $scope.cardTypes = ref.data;
        }, function () {
            alert('Error CardTypes');
        });
    };

    $scope.GetCardReportReceivingTypes = function () {
        var Data = infoService.GetCardReportReceivingTypes();
        Data.then(function (ref) {
            $scope.cardReportReceivingTypes = ref.data;
        }, function () {
            alert('Error CardReportReceivingTypes');
        });
    };

    $scope.GetCustomerEmails = function () {
        var Data = customerService.getAuthorizedCustomerNumber();

        Data.then(function (customerNumber) {

            var cust = customerService.getCustomer(customerNumber);

            cust.then(function (customer) {

                if (customer.data.EmailList) {
                    $scope.reportReceivingEmails = customer.data.EmailList;

                    //if ($scope.reportReceivingEmails.length == 1) {
                    //    $scope.plasticCardOrder.reportReceivingEmail = $scope.reportReceivingEmails[0]
                    //}

                    $scope.reportReceivingEmails.splice(0, 0, "");

                }
                else {
                    $scope.reportReceivingEmails = {};
                }

            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error getAuthorizedCustomerNumber');
        });

    }

    $scope.GetCustomerPhones = function () {

        var Data = customerService.getAuthorizedCustomerNumber();

        Data.then(function (customerNumber) {

            var cust = customerService.getCustomer(customerNumber);

            cust.then(function (customer) {

                if (customer.data.PhoneList) {
                    customer.data.PhoneList.forEach(function (phone) {
                        if (phone.phoneType.key === 1) {

                            //var areaCode = (phone.phone.areaCode == "374") ? phone.phone.areaCode : "00" + phone.phone.areaCode;
                            $scope.cardSMSPhones.push({ id: phone.phone.id, phone: ((phone.phone.countryCode.slice(1) == "374") ? "" : "00") + phone.phone.countryCode.slice(1) + phone.phone.areaCode + phone.phone.phoneNumber });
                        }
                    });
                    //if ($scope.cardSMSPhones.length == 1) {
                    //    $scope.plasticCardOrder.cardSMSPhone = $scope.cardSMSPhones[0].phone;
                    //}
                    $scope.cardSMSPhones.splice(0, 0, { id: 0, phone: "" });
                }
            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error getAuthorizedCustomerNumber');
        });
    }

    $scope.GetCardPINCodeReceivingTypes = function () {
        var Data = infoService.GetCardPINCodeReceivingTypes();
        Data.then(function (ref) {

            $scope.cardPINCodeReceivingTypes = ref.data;
            $scope.plasticCardOrder.cardPINCodeReceivingType = "2";
        }, function () {
            alert('Error CardPINCodeReceivingTypes');
        });
    };

    $scope.getOrganisationNameEng = function () {

        var Data = customerService.getAuthorizedCustomerNumber();

        Data.then(function (customerNumber) {

            var cust = customerService.getCustomer(customerNumber);

            cust.then(function (customer) {
                $scope.plasticCardOrder.organisationNameEng = customer.data.OrganisationNameEng;
            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error getAuthorizedCustomerNumber');
        });
    };

    $scope.getMainCards = function () {

        var Data = plasticCardService.GetCustomerMainCards();
        Data.then(function (card) {
            var cards = card.data;
            var mainCards = [];

            for (var i = 0; i < cards.length; i++) {
                mainCards.push(cards[i]);
            }
            $scope.mainCards = mainCards;
        }, function () {
            alert('Error getMainCards');
        });
    };

    $scope.GetCustomerMainCardsForAttachedCardOrder = function () {
        var Data = plasticCardService.GetCustomerMainCardsForAttachedCardOrder();
        Data.then(function (card) {
            var cards = card.data;
            var mainCards = [];

            for (var i = 0; i < cards.length; i++) {
                mainCards.push(cards[i]);
            }
            $scope.mainCards = mainCards;
        }, function () {
            alert('Error getMainCards');
        });
    };


    $scope.AssignRelOfficeNumber = function (mainCards, curdNumber) {

        var card = mainCards.find(m => { return m.CardNumber == curdNumber });
        $scope.plasticCardOrder.plasticCard.RelatedOfficeNumber = card.RelatedOfficeNumber;
        $scope.plasticCardOrder.plasticCard.MainCardType = card.CardType;
    }

    $scope.saveCardOrder = function () {

        if ($http.pendingRequests.length == 0) {

            document.getElementById("plasticCardLoad").classList.remove("hidden");

            var Data = plasticCardService.savePlasticCardOrder($scope.plasticCardOrder);

            Data.then(function (res) {

                $scope.confirm = false;
                if (validate($scope, res.data)) {

                    document.getElementById("plasticCardLoad").classList.add("hidden");

                    if ($scope.ResultCode === 8) {
                        ShowMessage('Հայտի մուտքագրումը կատարված է։ Հայտն ուղարկվել է ՓԼ/ԱՖ բաժնի հաստատման։', 'bp-information');
                    } else if ($scope.ResultCode === 5) {
                        ShowMessage('Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ', 'error');
                    }
                    else if ($scope.ResultCode === 9) {
                        ShowMessage('Քարտի պատվերի հայտը հաստատված է։ Գրանցվել է ' + res.data.Errors[0].Description + ' համարով քարտ ', 'bp-information');
                    }
                    else if ($scope.ResultCode === 14) {
                        ShowMessage('Քարտի պատվերի հայտը կատարված է։ Սխալի պատճառով հնարավոր չէ ցուցադրել տվյալ քարտի համարը։', 'bp-information');
                    }
                    CloseBPDialog('plasticcardorder');
                }
                else {
                    document.getElementById("plasticCardLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("plasticCardLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in saveCardOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }

    }

    $scope.searchRelatedOfficeTypes = function (relatedOfficeSearchParam) {

        return $http.get('/Info/SearchRelatedOfficeTypes', {
            params: {
                searchParam: relatedOfficeSearchParam
            }
        }).then(function (response) {
            return limitToFilter(response.data, 10);
        });
    };


    $scope.onSelect = function ($item, $model, $label) {
        $scope.plasticCardOrder.plasticCard.RelatedOfficeNumber = $item.Key;
        $scope.relOfficeDescription = $label;
    };

    $scope.GetCustomerLastMotherName = function () {

        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        var Data = customerService.getAuthorizedCustomerNumber();

        Data.then(function (customerNumber) {

            var text = plasticCardService.GetCustomerLastMotherName(customerNumber.data);

            text.then(function (lastMotherName) {
                if (lastMotherName.data == "") {
                    for (var i = 0; i < 6; i++)
                        lastMotherName.data += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                $scope.plasticCardOrder.motherName = lastMotherName.data;
            }, function () {
                alert('Error GetCustomerLastMotherName');
            })

        }, function () {
            alert('Error getAuthorizedCustomerNumber');
        });
    }

    $scope.GetCustomerEngData = function () {


        var Data = customerService.getAuthorizedCustomerNumber();

        Data.then(function (customerNumber) {

            var cust = customerService.getCustomer(customerNumber);

            cust.then(function (customer) {

                $scope.FirstNameEng = customer.data.FirstNameEng;
                $scope.LastNameEng = customer.data.LastNameEng;

                var addressEng = plasticCardService.GetCustomerAddressEng(customerNumber.data);

                addressEng.then(function (addressEng) {
                    $scope.plasticCardOrder.adrressEngTranslated = addressEng.data;
                });

            }, function () {
                alert('Error getCustomer');
            });



        }, function () {
            alert('Error getAuthorizedCustomerNumber');
        });
    }

    $scope.changeCardSupplementaryType = function () {

        if ($scope.plasticCard.attachedCard) {
            $scope.plasticCardOrder.plasticCard.SupplementaryType = 3;
        } else {
            $scope.plasticCardOrder.plasticCard.SupplementaryType = 1;
        }
    }


    $scope.OpenPlasticCardRemovalOrder = function (orderID) {

        var Data = plasticCardService.CheckIfPlasticCardCanBeCanceled(orderID);

        Data.then(function (canBeCanceled) {

            if (canBeCanceled.data == "True") {

                var dialogOptions = {
                    callback: function () {
                        if (dialogOptions.result !== undefined) {
                            cust.mncId = dialogOptions.result.whateverYouWant;
                        }
                    },
                    result: {}
                };

                $scope.params = { removableorder: $scope.order };

                dialogService.open('removalOrder', $scope, 'Հեռացման հայտ', '/RemovalOrder/RemovalOrder', dialogOptions, undefined, undefined, undefined);
            }
            else if (canBeCanceled.data == "False") {
                showMesageBoxDialog('Արդեն ուղարկված է ԱրՔա:', $scope, 'error');
            }
            else {
                showMesageBoxDialog('ԱրՔա ուղարկված լինելու(չլինելու) վերաբերյալ տվյալներ հայտնաբերված չեն:', $scope, 'error');
            }

        });
    }
    $scope.GetCardReceivingTypes = function () {
        
        var Data = infoService.GetCardReceivingTypes();
        Data.then(function (ref) {
            $scope.cardReceivingTypes = ref.data;
            $scope.plasticCardOrder.cardReceivingType = "2";
        }, function () {
            alert('Error GetCardReceivingTypes');
        });
    };
    $scope.changeCardReceivingType = function () {
        if ($scope.plasticCardOrder.cardPINCodeReceivingType == 1 || $scope.plasticCardOrder.cardApplicationAcceptanceType == 2) {
            $scope.plasticCardOrder.cardReceivingType = "2";
        }
    };
    $scope.GetCardApplicationAcceptanceTypes = function () {
        var Data = infoService.GetCardApplicationAcceptanceTypes();
        Data.then(function (ref) {
            $scope.cardApplicationAcceptanceTypes = ref.data;
        }, function () {
            alert('Error GetCardApplicationAcceptanceTypes');
        });
    };

    $scope.CardTypeChange = function () {
        if ($scope.plasticCardOrder.plasticCard.cardType == '53')
            $scope.plasticCardOrder.plasticCard.RelatedOfficeNumber = 174
        else $scope.plasticCardOrder.plasticCard.RelatedOfficeNumber = ''

    }, function () {
        alert('Error CardTypeChange');
    };



}]);
