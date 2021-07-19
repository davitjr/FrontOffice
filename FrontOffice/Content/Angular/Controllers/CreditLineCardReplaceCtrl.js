app.controller("CreditLineCardReplaceCtrl", ['$scope', '$rootScope', '$confirm', 'creditLineCardReplaceService', 'infoService', 'cardService', 'customerService', '$http', 'limitToFilter', 'dialogService', function ($scope, $rootScope, $confirm, creditLineCardReplaceService, infoService,  cardService,  customerService, $http, limitToFilter, dialogService) {
    $scope.order = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.creditLineCardReplaceOrder = {
        involvingSetNumber: $rootScope.SessionProperties.UserId,
        servingSetNumber: $rootScope.SessionProperties.UserId,
        cardHolderCustomerNumber: 0,
        cardSMSPhone: "",
        reportReceivingEmail: "",
        CardHolderName: 'name',
        CardHolderLastName: 'lastName'
    };

    $scope.cardSMSPhones = [];

    $scope.onlyBasicLatin = /^[\u0000-\u007F]+$/i;

    $scope.maxDate = new Date();

    $scope.getCard = function (productId) {
        $scope.loading = true;
        var Data = creditLineCardReplaceService.getCard(productId);
        Data.then(function (card) {
            $scope.card = card.data;
            $scope.creditLineCardReplaceOrder.RelatedOfficeNumber = $scope.card.RelatedOfficeNumber;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCard');
        });
    };

    $scope.GetCustomerEngData = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (customerNumber) {
            var cust = customerService.getCustomer(customerNumber);
            cust.then(function (customer) {
                $scope.FirstNameEng = customer.data.FirstNameEng;
                $scope.LastNameEng = customer.data.LastNameEng;
            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error GetCustomerEngData');
        });
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

    $scope.GetCardReportReceivingTypes = function () {
        var Data = infoService.GetCardReportReceivingTypes();
        Data.then(function (ref) {
            $scope.cardReportReceivingTypes = ref.data;
        }, function () {
            alert('Error GetCardReportReceivingTypes');
        });
    };

    $scope.GetCustomerEmails = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (customerNumber) {
            var cust = customerService.getCustomer(customerNumber);
            cust.then(function (customer) {
                if (customer.data.EmailList) {
                    $scope.reportReceivingEmails = customer.data.EmailList;
                    $scope.reportReceivingEmails.splice(0, 0, "");
                }
                else {
                    $scope.reportReceivingEmails = {};
                }
            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error GetCustomerEmails');
        });
    }

    $scope.GetCardPINCodeReceivingTypes = function () {
        var Data = infoService.GetCardPINCodeReceivingTypes();
        Data.then(function (ref) {
            $scope.cardPINCodeReceivingTypes = ref.data;
            $scope.creditLineCardReplaceOrder.cardPINCodeReceivingType = "2";
        }, function () {
            alert('Error CardPINCodeReceivingTypes');
        });
    };

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    $scope.GetCustomerPhones = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (customerNumber) {
            var cust = customerService.getCustomer(customerNumber);
            cust.then(function (customer) {
                if (customer.data.PhoneList) {
                    customer.data.PhoneList.forEach(function (phone) {
                        if (phone.phoneType.key === 1) {
                            $scope.cardSMSPhones.push({ id: phone.phone.id, phone: ((phone.phone.countryCode.slice(1) == "374") ? "" : "00") + phone.phone.countryCode.slice(1) + phone.phone.areaCode + phone.phone.phoneNumber });
                        }
                    });
                    $scope.cardSMSPhones.splice(0, 0, { id: 0, phone: "" });
                }
            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error GetCustomerPhones');
        });
    }

    $scope.getOrganisationNameEng = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (customerNumber) {
            var cust = customerService.getCustomer(customerNumber);
            cust.then(function (customer) {
                $scope.creditLineCardReplaceOrder.organisationNameEng = customer.data.OrganisationNameEng;
            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error getOrganisationNameEng');
        });
    };

    $scope.saveCreditLineCardReplaceOrder = function () {
        $scope.creditLineCardReplaceOrder.Card = $scope.card;
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: ' ', text: 'Խնդրում ենք ստուգել քարտի աշխ․ ծրագիրը։ Հայտը պահպանելուց հետո աշխ․ ծրագիրը հնարավոր չէ փոփոխել: Շարունակե՞լ:' })
                .then(function () { $scope.save() });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.save = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.creditLineCardReplaceOrder.RegistrationDate = $scope.order.OperationDate;
            document.getElementById("creditLineCardReplaceOrderLoad").classList.remove("hidden");
            var Data = creditLineCardReplaceService.saveCreditLineCardReplaceOrder($scope.creditLineCardReplaceOrder);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("creditLineCardReplaceOrderLoad").classList.add("hidden");
                    if ($scope.ResultCode === 8) {
                        ShowMessage('Հայտի մուտքագրումը կատարված է։ Հայտն ուղարկվել է ՓԼ/ԱՖ բաժնի հաստատման։', 'bp-information');
                    } else if ($scope.ResultCode === 5) {
                        ShowMessage('Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ', 'error');
                    } else if ($scope.ResultCode === 9) {
                        ShowMessage('Քարտի փոխարինման հայտը հաստատվել է։ Գրանցվել է ' + res.data.Errors[0].Description + ' համարով քարտ։ Վ. գ. երկարաձգումից հետո անհրաժեշտ է իրականացնել հաշվի կցում <<Փոխարինված քարտի հաշվի կցում>> հայտով:', 'bp-information');
                    } else if ($scope.ResultCode === 14) {
                        ShowMessage('Քարտի փոխարինման հայտը հաստատվել է։ Սխալի պատճառով հնարավոր չէ ցուցադրել տվյալ քարտի համարը։ Վ. գ. երկարաձգումից հետո անհրաժեշտ է իրականացնել հաշվի կցում <<Փոխարինված քարտի հաշվի կցում>> հայտով:', 'bp-information');
                    }
                    CloseBPDialog('creditLineCardReplaceOrder');
                } else {
                    document.getElementById("creditLineCardReplaceOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել:', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("creditLineCardReplaceOrderLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in save');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.AssignRelOfficeNumber = function (mainCards, curdNumber) {
        var card = mainCards.find(m => { return m.CardNumber == curdNumber });
        $scope.creditLineCardReplaceOrder.Card.RelatedOfficeNumber = card.RelatedOfficeNumber;
    };

    $scope.onSelect = function ($item, $model, $label) {
        $scope.creditLineCardReplaceOrder.RelatedOfficeNumber = $item.Key;
        $scope.relOfficeDescription = $label;
    };

    $scope.getCreditLineCardReplaceOrder = function (orderId) {
        var Data = creditLineCardReplaceService.getCreditLineCardReplaceOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getCreditLineCardReplaceOrder');
        });
    };

    $scope.GetCardReceivingTypes = function () {
        var Data = infoService.GetCardReceivingTypes();
        Data.then(function (ref) {
            $scope.cardReceivingTypes = ref.data;
            $scope.creditLineCardReplaceOrder.cardReceivingType = "2";
        }, function () {
            alert('Error GetCardReceivingTypes');
        });
    };

    $scope.changeCardReceivingType = function () {
        if ($scope.creditLineCardReplaceOrder.cardPINCodeReceivingType == 1 || $scope.creditLineCardReplaceOrder.cardApplicationAcceptanceType == 2) {
            $scope.creditLineCardReplaceOrder.cardReceivingType = "2";
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

    $scope.GetCardHolderData = function (productId, dataType) {
        var Data = cardService.getCardHolderData(productId, dataType);
        Data.then(function (cardHolderData) {
            if (dataType === 'name') {
                $scope.name = cardHolderData.data;
            } else if (dataType === 'lastName') {
                $scope.lastName = cardHolderData.data;
            } else if (dataType === undefined) {
                $scope.cardHolderData = cardHolderData.data;
            }
        }, function () {
            $scope.loading = false;
            alert('Error GetCardHolderData');
        });
    };

}]);