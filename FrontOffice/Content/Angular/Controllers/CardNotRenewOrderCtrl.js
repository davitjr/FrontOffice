app.controller("CardNotRenewOrderCtrl", ['$scope', 'cardNotRenewOrderService', 'infoService', 'cardService', 'customerService', '$http', function ($scope, cardNotRenewOrderService, infoService, cardService, customerService, $http) {
    $scope.order = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.cardNotRenewOrder = {
        CardHolderName: 'name',
        CardHolderLastName: 'lastName'
    };
    $scope.getCard = function (productId) {
        $scope.loading = true;
        var Data = cardService.getPlasticCard(productId, true);
        Data.then(function (card) {
            $scope.card = card.data;
            $scope.relOfficeDescription = $scope.getCardRelatedOfficeName($scope.card.RelatedOfficeNumber);
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
    };

    $scope.getCardRelatedOfficeName = function (relatedOfficeNumber) {
        var Data = infoService.getCardRelatedOfficeName(relatedOfficeNumber);
        Data.then(function (acc) {
            $scope.relOfficeDescription = acc.data;
        }, function () {
            alert('Error getCardRelatedOfficeName');
        });
    };

    $scope.GetCardNotRenewReasons = function () {
        var Data = infoService.GetCardNotRenewReasons();
        Data.then(function (ref) {
            $scope.cardNotRenewReasons = ref.data;
        }, function () {
            alert('Error GetCardNotRenewReasons');
        });
    };

    $scope.saveCardNotRenewOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.cardNotRenewOrder.PlasticCard = $scope.card;
            document.getElementById("cardNotRenewOrderLoad").classList.remove("hidden");
            var Data = cardNotRenewOrderService.saveCardNotRenewOrder($scope.cardNotRenewOrder);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("cardNotRenewOrderLoad").classList.add("hidden");
                    if ($scope.ResultCode === 1) {
                        ShowMessage('Հայտը կատարված է։', 'bp-information');
                    }
                    CloseBPDialog('cardnotreneworder');
                } else {
                    document.getElementById("cardNotRenewOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել:', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("cardNotRenewOrderLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in saveCardNotRenewOrder');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getCardNotRenewOrder = function (orderId) {
        var Data = cardNotRenewOrderService.getCardNotRenewOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getPINRegOrder');
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