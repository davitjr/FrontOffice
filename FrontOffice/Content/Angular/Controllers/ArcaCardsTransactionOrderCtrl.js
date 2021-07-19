app.controller("ArcaCardsTransactionOrderCtrl", ['$scope', 'paymentOrderService', 'arcaCardsTransactionOrderService', '$filter', '$http', function ($scope, paymentOrderService, arcaCardsTransactionOrderService, $filter, $http) {
    $scope.order = {};
    $scope.order.Card = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.UserFilialCode;
    $scope.order.ActionType;
    $scope.isCardDepartment = $scope.$root.SessionProperties.AdvancedOptions["isCardDepartment"];
    $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];

    $scope.SaveArcaCardsTransactionOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("arcaCardsTransactionOrderLoad").classList.remove("hidden");

            $scope.order.RegistrationDate = new Date();
            $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
            $scope.order.CardNumber = $scope.Card.CardNumber;

            var Data = arcaCardsTransactionOrderService.SaveArcaCardsTransactionOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data) && (res.data.ResultCode == 1)) {
                    document.getElementById("arcaCardsTransactionOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Ուշադրություն', $scope, 'information');
                    CloseBPDialog('arcaCardsTransactionOrder');
                }
                else {
                    document.getElementById("arcaCardsTransactionOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function () {
                document.getElementById("arcaCardsTransactionOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error SaveArcaCardsTransactionOrder');
            });
        }
        else {
            ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.GetActionsForCardTransaction = function () {
        var Data = arcaCardsTransactionOrderService.GetActionsForCardTransaction();
        Data.then(function (acc) {
            $scope.ActionTypes = acc.data;
        }, function () {
            alert('Error GetActionsForCardTransaction');
        });
        $scope.GetBlockingReasonForBlockedCard($scope.Card.CardNumber);
    };

    $scope.GetReasonsForCardTransactionAction = function () {
        var Data = arcaCardsTransactionOrderService.GetReasonsForCardTransactionAction();
        Data.then(function (acc) {
            $scope.ReasonsForCardTransactionAction = acc.data;
            let blockingtypes = [15, 16, 17, 18, 19, 20, 21, 22, 23];
            angular.forEach($scope.ReasonsForCardTransactionAction, function (value, key) {
                if ($scope.isCardDepartment=="0" && $scope.isOnlineAcc=="0" && blockingtypes.indexOf(parseInt(key)) >= 0) {
                    delete $scope.ReasonsForCardTransactionAction[key];
                }
            });
        }, function () {
            alert('Error GetReasonsForCardTransactionAction');
        });
    };

    $scope.GetUserFilialCode = function () {
        var Data = arcaCardsTransactionOrderService.GetUserFilialCode();
        Data.then(function (acc) {
            $scope.UserFilialCode = acc.data;
        }, function () {
            alert('Error GetUserFilialCode');
        });
    };

    $scope.GetArcaCardsTransactionOrder = function (selectedOrder) {
        $scope.order = null;
        var Data = arcaCardsTransactionOrderService.GetArcaCardsTransactionOrder(selectedOrder);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error GetArcaCardsTransactionOrder');
        });
    };

    $scope.isCardBlocked;
    $scope.BlockingReasonForBlockedCard;

    $scope.GetBlockingReasonForBlockedCard = function (cardNumber) {
        var Data = arcaCardsTransactionOrderService.GetBlockingReasonForBlockedCard(cardNumber);
        Data.then(function (acc) {
            $scope.BlockingReasonForBlockedCard = acc.data;
            $scope.isCardBlocked = Boolean(acc.data);
            if ($scope.isCardBlocked && $scope.BlockingReasonForBlockedCard != 14) { // 14 = Նոր ՊԻՆ կոդի սահմանում պատճառով բլոկավորման դեպքում հաջորդ հասանելի գործողությունը պետք է լինի բլոկավումը, իսկ նախորդ բլոկավորման պատճառ դաշտը դատարկ:
                $scope.order.ActionReasonId = acc.data;
                if ($scope.order.ActionReasonId == 13) //13 =  այլ - պատճառը կարողն են ընտրել միայն օնլայնից։ Այդ պատճառով ըստ mail-ի, եթե 13 է, ապա փոխում ենք 8 (Քարտապանի ցանկությամբ)
                    $scope.order.ActionReasonId = 8;
            }
        }, function () {
            alert('Error GetBlockingReasonForBlockedCard');
        });
    };

    $scope.previousBlockUnblockOrderComment;

    $scope.GetPreviousBlockUnblockOrderComment = function () {
        var Data = arcaCardsTransactionOrderService.GetPreviousBlockUnblockOrderComment($scope.Card.CardNumber);
        Data.then(function (acc) {
            $scope.previousBlockUnblockOrderComment = acc.data;
        }, function () {
            alert('Error GetPreviousBlockUnblockOrderComment');
        });
    };
    $scope.GetAllReasonsForCardTransactionAction = function () {
        var Data = arcaCardsTransactionOrderService.GetAllReasonsForCardTransactionAction();
        Data.then(function (acc) {
            $scope.AllReasonsForCardTransactionAction = acc.data;
        }, function () {
            alert('Error GetReasonsForCardTransactionAction');
        });
    };
}]);
