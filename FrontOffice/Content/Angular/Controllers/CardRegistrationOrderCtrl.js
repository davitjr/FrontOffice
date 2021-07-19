app.controller("CardRegistrationOrderCtrl", ['$scope', 'cardRegistrationOrderService', 'customerService', 'infoService', 'dialogService', '$uibModal', '$http', '$filter', function ($scope, cardRegistrationOrderService, customerService, infoService, dialogService, $uibModal, $http, $filter) {


    $scope.order = {};
    $scope.order.Type = 103;
    $scope.order.Card = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    
    //Քարտի մուտքագրման պահպանում և հաստատում
    $scope.saveCardRegistrationOrder = function () {
        if ($http.pendingRequests.length == 0) {

            if ($scope.order.Card.ProductId != undefined) {

                $scope.order.CardAccount = $scope.card.account;
                $scope.order.OverdraftAccount = $scope.card.overdraftAccount;
                $scope.order.IsNewAccount = $scope.isNewAccount;
                $scope.order.IsNewOverdraftAccount = $scope.isNewOverdraftAccount;
                $scope.order.Card.SupplementaryType = $scope.card.SupplementaryType;

                document.getElementById("cardRegistrationLoad").classList.remove("hidden");
                var Data = cardRegistrationOrderService.saveCardRegistrationOrder($scope.order);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        document.getElementById("cardRegistrationLoad").classList.add("hidden");
                        CloseBPDialog('cardregistration');
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh($scope.order.Type);
                    }
                    else {
                        document.getElementById("cardRegistrationLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    document.getElementById("cardRegistrationLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveCardRegistration');
                });
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };


    $scope.getCardsForRegistration = function () {
        $scope.loading = true;
        var Data = cardRegistrationOrderService.getCardsForRegistration();

        Data.then(function (card) {
                           
            $scope.cards = card.data;
            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getCards');
        }); 
    };
    $scope.setOrderCardDetails = function () {

        $scope.order.Card.ProductId = $scope.card.ProductId;
        $scope.cardDate = $filter('mydate')($scope.card.ExpiryDate, "dd/MM/yyyy");
        $scope.card.account = null;
        $scope.card.overdraftAccount = null;
        
    };

    $scope.getAccountListForCardRegistration = function () {
        $scope.loading = true;
        var Data = cardRegistrationOrderService.getAccountListForCardRegistration($scope.card.Currency, $scope.card.FilialCode);
        Data.then(function (acc) {
                      
                $scope.card.accounts = acc.data;
            
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getAccountListForCardRegistration');
        });
    };

    $scope.getOverdraftAccountsForCardRegistration = function () {
        $scope.loading = true;
        var Data = cardRegistrationOrderService.getOverdraftAccountsForCardRegistration($scope.card.Currency, $scope.card.FilialCode);
        Data.then(function (acc) {

            $scope.card.overdraftAccounts = acc.data;

            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getAccountListForCardRegistration');
        });
    };

    
    $scope.getCardRegistrationOrder = function (orderId) {
        var Data = cardRegistrationOrderService.getCardRegistrationOrder(orderId);
        Data.then(function (acc) {
            
            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountOrder');
        });
    };

    $scope.getCardRegistrationWarnings = function () {
        var Data = cardRegistrationOrderService.GetCardRegistrationWarnings($scope.card);
        Data.then(function (acc) {
            $scope.warnings = acc.data;
        }, function () {
            alert('Warnings Error');
        });
    };

    $scope.callbackgetCardRegistrationOrder = function () {
        $scope.getCardRegistrationOrder($scope.selectedOrderId);
    };

    //$scope.checkProductId = function () {
    //    if ($scope.order.Card.ProductId != undefined) {

    //    }
    //    else {
    //        return ShowMessage('Առկա են չմուտքագրված դաշտեր։', 'error');
    //    }
    //}

    $scope.checkHeight = function (event) {
        console.log('test')
        var el = event.target;
        setTimeout(function(){
          el.style.cssText = 'height:auto;';
          el.style.cssText = 'height:' + el.scrollHeight + 'px';
        },0);
    };
}]);