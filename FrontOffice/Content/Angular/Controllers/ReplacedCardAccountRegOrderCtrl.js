app.controller("ReplacedCardAccountRegOrderCtrl", ['$scope', 'replacedCardAccountRegOrderService', 'customerService', 'infoService', 'dialogService', '$uibModal', '$http', '$filter', 'cardService', function ($scope, replacedCardAccountRegOrderService, customerService, infoService, dialogService, $uibModal, $http, $filter, cardService) {

    $scope.order = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.order.Card = {};
    $scope.replacedCardAccountRegOrder = {
        CardHolderName: 'name',
        CardHolderLastName: 'lastName'
    };

    $scope.saveReplacedCardAccountRegOrder = function () {
        $scope.card.ValidationDate = moment($scope.card.ValidationDate)._d
        $scope.replacedCardAccountRegOrder.Card = $scope.card;
        $scope.replacedCardAccountRegOrder.Card.ProductId = $scope.plasticCard.ProductId;
        if ($http.pendingRequests.length == 0) {

            document.getElementById("replacedCardAccountRegOrderLoad").classList.remove("hidden");

            var Data = replacedCardAccountRegOrderService.saveReplacedCardAccountRegOrder($scope.replacedCardAccountRegOrder);
            Data.then(function (res) {
                $scope.confirm = false;
                if (validate($scope, res.data)) {
                    document.getElementById("replacedCardAccountRegOrderLoad").classList.add("hidden");
                    if ($scope.ResultCode === 8) {
                        ShowMessage('Հայտի մուտքագրումը կատարված է։ Հայտն ուղարկվել է ՓԼ/ԱՖ բաժնի հաստատման։', 'bp-information');
                    }
                    else if ($scope.ResultCode === 9) {
                        ShowMessage('Քարտի փոխարինման հայտը հաստատված է։ Գրանցվել է ' + res.data.Errors[0].Description + ' համարով քարտ, որին կցվել է հին քարտի հաշիվը', 'bp-information');
                    }
                    else if ($scope.ResultCode === 5) {
                        ShowMessage('Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ', 'error');
                    }
                    else if ($scope.ResultCode === 14) {
                        ShowMessage('Քարտի փոխարինման հայտը կատարված է։ Սխալի պատճառով հնարավոր չէ ցուցադրել տվյալ քարտի համարը։', 'bp-information');
                    }
                    CloseBPDialog('replacedCardAccountRegOrder');
                    $scope.path = '#Orders';
                    refresh($scope.order.Type);

                } else {
                    document.getElementById("replacedCardAccountRegOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել:', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("replacedCardAccountRegOrderLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in save');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getCard = function (productId) {
        $scope.loading = true;
        var Data = replacedCardAccountRegOrderService.getCard(productId);
        Data.then(function (card) {
            $scope.card = card.data;
            $scope.plasticCardExpiryDate = $scope.plasticCard.ExpiryDate;
            $scope.cardExpiryDate = $scope.plasticCardExpiryDate.substring(0, 2) + '/' + $scope.plasticCardExpiryDate.substring(2, 6);
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCard');
        });
    }; 

    $scope.getReplacedCardAccountRegOrder = function (orderId) {
        var Data = replacedCardAccountRegOrderService.getReplacedCardAccountRegOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
            $scope.GetCardHolderData($scope.order.Card.ProductId);
        }, function () {
            alert('Error getReplacedCardAccountRegOrder');
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