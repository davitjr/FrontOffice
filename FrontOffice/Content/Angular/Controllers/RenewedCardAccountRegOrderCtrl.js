app.controller("RenewedCardAccountRegOrderCtrl", ['$scope', '$confirm', 'renewedCardAccountRegOrderService', 'infoService', '$uibModal', '$http', '$filter', 'cardService', function ($scope, $confirm, renewedCardAccountRegOrderService, infoService, $uibModal, $http, $filter, cardService) {

    $scope.order = {};
    $scope.order.Card = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.renewedCardAccountRegOrder = {
        CardHolderName: 'name',
        CardHolderLastName: 'lastName'
    };

    $scope.saveRenewedCardAccountRegOrder = function () {
        $scope.renewedCardAccountRegOrder.Card = $scope.plasticCard;
        if ($scope.card.CreditLine != null) {
            $scope.renewedCardAccountRegOrder.CreditLineProductId = $scope.card.CreditLine.ProductId;
        }
        $scope.CheckCreditLineForRenewedCardAccountRegOrder($scope.renewedCardAccountRegOrder);
    };

    $scope.CheckCreditLineForRenewedCardAccountRegOrder = function (renewedCardAccountRegOrder) {
        $scope.loading = true;
        if ($http.pendingRequests.length == 0) {
            var Data = renewedCardAccountRegOrderService.checkCreditLineForRenewedCardAccountRegOrder(renewedCardAccountRegOrder);
            Data.then(function (confData) {
                if (confData.data.length) {
                    $confirm({ title: '', text: confData.data + '\n' + '\n' })
                        .then(function () { $scope.save() });
                } else {
                    $scope.save();
                }
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error CheckCardRenewOrder');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.save = function () {
        $scope.renewedCardAccountRegOrder.RegistrationDate = $scope.operationDate;
        $scope.renewedCardAccountRegOrder.CardAccount = $scope.card.CardAccount;
        $scope.renewedCardAccountRegOrder.OverdraftAccount = $scope.card.OverdraftAccount;
        document.getElementById("renewedCardAccountRegOrderLoad").classList.remove("hidden");
        var Data = renewedCardAccountRegOrderService.saveRenewedCardAccountRegOrder($scope.renewedCardAccountRegOrder);
        Data.then(function (res) {
            $scope.confirm = false;
            if (validate($scope, res.data)) {
                document.getElementById("renewedCardAccountRegOrderLoad").classList.add("hidden");
                if ($scope.ResultCode) {
                    if ($scope.ResultCode === 5) {
                        ShowMessage('Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ', 'error');
                    } else { ShowMessage(res.data.Errors[0].Description, 'bp-information'); }
                }
                CloseBPDialog('renewedCardAccountRegOrder');
                $scope.path = '#Orders';
                refresh($scope.order.Type);
            } else {
                document.getElementById("renewedCardAccountRegOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել:', $scope, 'error');
            }
        }, function (err) {
            $scope.confirm = false;
            document.getElementById("renewedCardAccountRegOrderLoad").classList.add("hidden");
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error in save');
        });
    };

    $scope.getCard = function (productId) {
        var Data = cardService.getCard(productId);
        Data.then(function (crd) {
            $scope.card = crd.data;
            $scope.plasticCardExpiryDate = $scope.plasticCard.ExpiryDate;
            $scope.getRenewedCardAccountRegWarnings();
            $scope.cardExpiryDate = $scope.plasticCardExpiryDate.substring(0, 2) + '/' + $scope.plasticCardExpiryDate.substring(2, 6);
        },
            function () {
                $scope.loading = false;
                alert('Error getCard');
            });
    };

    $scope.getCardRelatedOfficeName = function (relatedOfficeNumber) {
        var Data = infoService.getCardRelatedOfficeName(relatedOfficeNumber);
        Data.then(function (acc) {
            $scope.relOfficeDescription = acc.data;
        }, function () {
            alert('Error getCardRelatedOfficeName');
        });
    };

    $scope.getRenewedCardAccountRegOrder = function (orderId) {
        var Data = renewedCardAccountRegOrderService.getRenewedCardAccountRegOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
            $scope.GetCardHolderData($scope.order.Card.ProductId);
        }, function () {
            alert('Error getRenewedCardAccountRegOrder');
        });
    };

    $scope.callbackgetCardReNewRePlaceOrder = function () {
        $scope.getCardReNewRePlaceOrder($scope.selectedOrderId);
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

    $scope.getRenewedCardAccountRegWarnings = function () {
        var Data = renewedCardAccountRegOrderService.getRenewedCardAccountRegWarnings($scope.card);
        Data.then(function (acc) {
            $scope.warnings = acc.data;
        }, function () {
            alert('Warnings Error');
        });
    };

}]);
