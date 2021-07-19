app.controller("CardRenewOrderCtrl", ['$scope', '$rootScope', '$confirm', 'cardRenewOrderService', 'infoService', 'cardService', 'customerService', '$http', 'limitToFilter', function ($scope, $rootScope, $confirm, cardRenewOrderService, infoService, cardService, customerService, $http, limitToFilter) {
    $scope.operationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.cardRenewOrder = {
        InvolvingSetNumber: $rootScope.SessionProperties.UserId,
        ServingSetNumber: $rootScope.SessionProperties.UserId,
        CardSMSPhone: "",
        RenewWithCardNewType: false,
        CardHolderName: 'name',
        CardHolderLastName: 'lastName'
    };

    $scope.onlyArmCharCode = false;

    $scope.onlyBasicLatin = /^[\u0000-\u007F]+$/i;

    $scope.getCard = function (productId) {
        $scope.loading = true;
        $scope.getPhoneForCardRenew(productId);
        //var Data = cardRenewOrderService.getCard(productId);
        //Data.then(function (card) {
        //    $scope.card = card.data;
            $scope.cardRenewOrder.RelatedOfficeNumber = $scope.card.RelatedOfficeNumber;
            $scope.loading = false;
            if ($scope.card.CreditLine) {
                $scope.cardRenewOrder.WithCreditLineClosing = false;
            } else {
                $scope.cardRenewOrder.WithCreditLineClosing = null;
            }

        //}, function () {
        //    $scope.loading = false;
        //    alert('Error getCard');
        //});
    };

    $scope.onlyArmenianText = function (event) {
        if ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode >= 31 && event.charCode <= 46) || (event.charCode >= 1328 && event.charCode <= 1423)) {
            $scope.onlyArmCharCode = false;
            return true;
        } else {
            $scope.onlyArmCharCode = true;
            event.preventDefault();
            return false;
        }
    }

    $scope.getPhoneForCardRenew = function (productId) {
        var Data = cardRenewOrderService.getPhoneForCardRenew(productId);
        Data.then(function (card) {
            $scope.cardRenewOrder.CardSMSPhone = card.data;
        }, function () {
            alert('Error getPhoneForCardRenew');
        });
    }

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

    $scope.searchRelatedOfficeTypes = function (relatedOfficeSearchParam) {
        return $http.get('/Info/SearchRelatedOfficeTypes', {
            params: {
                searchParam: relatedOfficeSearchParam
            }
        }).then(function (response) {
            return limitToFilter(response.data, 10);
        });
    };

    $scope.GetCardPINCodeReceivingTypes = function () {
        var Data = infoService.GetCardPINCodeReceivingTypes();
        Data.then(function (ref) {
            $scope.CardPINCodeReceivingTypes = ref.data;
            $scope.cardRenewOrder.CardPINCodeReceivingType = "2";
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


    $scope.getOrganisationNameEng = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (customerNumber) {
            var cust = customerService.getCustomer(customerNumber);
            cust.then(function (customer) {
                $scope.cardRenewOrder.OrganisationNameEng = customer.data.OrganisationNameEng;
            }, function () {
                alert('Error getCustomer');
            });
        }, function () {
            alert('Error getOrganisationNameEng');
        });
    };

    $scope.CheckCardRenewOrder = function (cardRenewOrder) {
        $scope.loading = true;
        var Data = cardRenewOrderService.checkCardRenewOrder(cardRenewOrder);
        Data.then(function (confData) {
            if (confData.data.length) {
                let showMessage = '';
                for (let i = 0; i < confData.data.length; i++) {
                    showMessage = showMessage + `${i + 1}.` + confData.data[i] + '\n';
                }
                $confirm({ title: '', text: showMessage + 'Շարունակե՞լ' + '\n' + '\n' })
                    .then(function () { $scope.save() });
            } else {
                $scope.save();
            }

            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error CheckCardRenewOrder');
        });
    }

    $scope.saveCardRenewOrder = function () {
        $scope.card.ValidationDate = moment($scope.card.ValidationDate)._d;
        $scope.cardRenewOrder.Card = $scope.card;
        $scope.CheckCardRenewOrder($scope.cardRenewOrder);
    };

    $scope.save = function () {
        if ($http.pendingRequests.length == 0) {
            // $scope.cardRenewOrder.RegistrationDate = $scope.operationDate;
            document.getElementById("cardRenewOrderLoad").classList.remove("hidden");
            var Data = cardRenewOrderService.saveCardRenewOrder($scope.cardRenewOrder);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("cardRenewOrderLoad").classList.add("hidden");
                    if ($scope.ResultCode) {
                        if ($scope.ResultCode === 5) {
                            ShowMessage('Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ', 'error');
                        } else { ShowMessage(res.data.Errors[0].Description, 'bp-information'); }
                    }
                    CloseBPDialog('cardRenewOrder');
                    $scope.path = '#Orders';
                    refresh($scope.cardRenewOrder.Type);
                } else {
                    document.getElementById("cardRenewOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել:', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("cardRenewOrderLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in save');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.onSelect = function ($item, $model, $label) {
        $scope.cardRenewOrder.RelatedOfficeNumber = $item.Key;
        $scope.relOfficeDescription = $label;
    };

    $scope.getCardRenewOrder = function (orderId) {
        var Data = cardRenewOrderService.getCardRenewOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getCardRenewOrder');
        });
    };

    $scope.GetCardReceivingTypes = function () {
        var Data = infoService.GetCardReceivingTypes();
        Data.then(function (ref) {
            $scope.CardReceivingTypes = ref.data;
            $scope.cardRenewOrder.CardReceivingType = "2";
        }, function () {
            alert('Error GetCardReceivingTypes');
        });
    };

    $scope.getCardSystemTypes = function () {
        var Data = infoService.GetOrderableCardSystemTypes();
        Data.then(function (ref) {
            $scope.cardSystemTypes = ref.data["4"];
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

    $scope.changeCardReceivingType = function () {
        if ($scope.cardRenewOrder.CardPINCodeReceivingType == 1 || $scope.cardRenewOrder.cardApplicationAcceptanceType == 2) {
            $scope.cardRenewOrder.CardReceivingType = "2";
        }
    };
}]);
