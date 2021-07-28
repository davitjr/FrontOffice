app.service("cardMembershipRewardsService", ['$http', function ($http) {

    this.getCardMembershipRewards = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/CardMembershipRewards/GetCardMembershipRewards",
            params: {
                cardNumber: cardNumber,
            }
        });
        return response;
    };

    this.getCardMembershipRewardsStatusHistory = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/CardMembershipRewards/GetCardMembershipRewardsStatusHistory",
            params: {
                cardNumber: cardNumber,
            }
        });
        return response;
    };

    this.getCardMembershipRewardsBonusHistory = function (cardNumber, startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/CardMembershipRewards/GetCardMembershipRewardsBonusHistory",
            params: {
                cardNumber: cardNumber,
                startDate: startDate,
                endDate: endDate
            }
        });
        return response;
    };

   

    this.saveCardMembershipRewardsOrder = function (cardMembershipRewardsOrder) {
        var response = $http({
            method: "post",
            url: "CardMembershipRewards/SaveCardMembershipRewardsOrder",
            data: JSON.stringify(cardMembershipRewardsOrder),
            dataType: "json"
        });
        return response;
    };

    this.getCardMembershipRewardsOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/CardMembershipRewards/GetCardMembershipRewardsOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getMRDataChangeAvailability = function (mrID) {
        var response = $http({
            method: "post",
            url: "/CardMembershipRewards/GetMRDataChangeAvailability",
            params: {
                mrID: mrID
            }
        });
        return response;
    };
}]);