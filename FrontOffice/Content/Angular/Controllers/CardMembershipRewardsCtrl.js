app.controller("CardMembershipRewardsCtrl", ['$scope', '$confirm', 'cardMembershipRewardsService', function ($scope,  $confirm, cardMembershipRewardsService) {

    $scope.startDate = $scope.$root.SessionProperties.OperationDate;
    $scope.endDate = $scope.$root.SessionProperties.OperationDate;
    $scope.mrDataChange = false;
    $scope.changes = {};
    $scope.isEdit = false;

    $scope.getCardMembershipRewards = function (cardNumber) {
        var Data = cardMembershipRewardsService.getCardMembershipRewards(cardNumber);
        Data.then(function (crd) {
            $scope.cardMR = crd.data;
            if ($scope.$root.SessionProperties.AdvancedOptions['MRDataChangeButton'] == '1') {
                $scope.checkMRDataChangeAvailability();
            }
        }, function () {
            alert('Error getCardMembershipRewards');
        });
    };


    $scope.getCardMembershipRewardsStatusHistory = function (cardNumber) {
        var Data = cardMembershipRewardsService.getCardMembershipRewardsStatusHistory(cardNumber);
        Data.then(function (crd) {
            $scope.cardMRHistory = crd.data;
        }, function () {
            alert('Error getCardMembershipRewardsStatusHistory');
        });
    };

    $scope.getCardMembershipRewardsBonusHistory = function (cardNumber) {
        var Data = cardMembershipRewardsService.getCardMembershipRewardsBonusHistory(cardNumber, $scope.startDate, $scope.endDate);
        Data.then(function (crd) {
            $scope.cardMRBonusHistory = crd.data;

            var sumCredit = 0;
            var sumDebit = 0;

            for (var i = 0; i < crd.data.length; i++) {

                if (crd.data[i].DebetCredit == 'c') {
                    sumCredit += crd.data[i].BonusScores;
                }
                else if (crd.data[i].DebetCredit == 'd') {
                    sumDebit += crd.data[i].BonusScores;
                }
            }
            $scope.sumCredit = sumCredit;
            $scope.sumDebit = sumDebit;

        }, function () {
            alert('Error getCardMembershipRewardsBonusHistory');
        });
    };



    $scope.saveCardMembershipRewardsOrder = function (productid, orderType) {
            switch (orderType) {
                                case 174:
                                        $scope.textMessage = 'Գրանցե՞լ MR ծրագիրը:';
                                        break;
                                case 176:
                                        $scope.textMessage = 'Գանձե՞լ MR ծառայության սպասարկման վարձը';
                                        break;
                                case 177:
                                    $scope.textMessage = 'Վերաթողարկե՞լ MR ծառայությունը';
                                    break;
                                case 178:
                                    $scope.textMessage = 'Դադարեցնե՞լ MR ծառայությունը';
                                    break;
                                default:
                                         $scope.textMessage = '';
            }

            $confirm({ title: 'Շարունակե՞լ', text: $scope.textMessage })
            .then(function () {
                showloading();
                $scope.error = null;
                $scope.order = {};
                $scope.order.RegistrationDate = new Date();
                $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
                $scope.order.Type = orderType;
                $scope.order.SubType = 1;
                $scope.order.ProductId = productid;

                var Data = cardMembershipRewardsService.saveCardMembershipRewardsOrder($scope.order);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh($scope.order.Type);
                        hideloading();
                    }
                    else {
                        hideloading();

                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    hideloading();
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error in saveCardMembershipRewardsOrder');
                });
            });

    };

    $scope.getCardMembershipRewardsOrder = function (orderId) {
       
        var Data = cardMembershipRewardsService.getCardMembershipRewardsOrder(orderId);
        Data.then(function (acc) {
            $scope.orderDetails = acc.data;
        }, function () {
            alert('Error getCardMembershipRewardsOrder');
        });
  
    };


    $scope.checkMRDataChangeAvailability = function () {
        var Data = cardMembershipRewardsService.getMRDataChangeAvailability($scope.cardMR.Id);
        Data.then(function (acc) {
            $scope.mrDataChange = acc.data;
        }, function () {
            alert('Error getMRDataChangeAvailability');
        });
    };

    $scope.reloadData = function () {
        $scope.getCardMembershipRewards($scope.cardnumber);
    };
}]); 