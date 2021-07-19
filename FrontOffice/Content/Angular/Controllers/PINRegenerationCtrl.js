app.controller("PINRegenerationCtrl", ['$scope', '$rootScope', '$confirm', 'pinRegenerationService', 'cardService', '$http', 'limitToFilter', 'dialogService', function ($scope, $rootScope, $confirm, pinRegenerationService, cardService , $http, limitToFilter, dialogService) {
    $scope.order = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.PINRegenerationOrder = {
        CardHolderName: 'name',
        CardHolderLastName: 'lastName'
    };

    //$scope.PINRegenerationOrder.Card = {};

    $scope.getCard = function (productId) {
        $scope.loading = true;
        var Data = pinRegenerationService.getCard(productId);
        Data.then(function (card) {
            $scope.card = card.data;
            $scope.card.ValidationDate = moment($scope.card.ValidationDate)._d
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCard');
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

    $scope.getPINRegOrder = function (orderId) {
        var Data = pinRegenerationService.getPINRegOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getPINRegOrder');
        });
    };

    $scope.savePINRegOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.card.ValidationDate = moment($scope.card.ValidationDate)._d
            $scope.PINRegenerationOrder.Card = $scope.card;
            document.getElementById("pinRegOrderLoad").classList.remove("hidden");
            var Data = pinRegenerationService.SavePINRegOrder($scope.PINRegenerationOrder);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("pinRegOrderLoad").classList.add("hidden");
                    if ($scope.ResultCode === 1) {
                        ShowMessage('Հայտը կատարված է։', 'bp-information');
                    }
                    CloseBPDialog('pinreg');
                } else {
                    document.getElementById("pinRegOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել:', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("pinRegOrderLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in savePINRegOrder');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
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