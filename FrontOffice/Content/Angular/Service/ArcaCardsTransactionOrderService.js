app.service("arcaCardsTransactionOrderService", ['$http', function ($http) {

    this.SaveArcaCardsTransactionOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/SaveArcaCardsTransactionOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    }

    this.GetActionsForCardTransaction = function () {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/GetActionsForCardTransaction",
            dataType: "json"
        });
        return response;
    }

    this.GetReasonsForCardTransactionAction = function () {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/GetReasonsForCardTransactionAction",
            dataType: "json"
        });
        return response;
    }

    this.GetUserFilialCode = function () {
        var response = $http({
            method: "post",
            url: "/Home/GetUserFilialCode",
            dataType: "json"
        });
        return response;
    }

    this.GetArcaCardsTransactionOrder = function (selectedOrder) {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/GetArcaCardsTransactionOrder",
            params: {
                selectedOrder: selectedOrder,
            },
        });
        return response;
    }

    this.GetBlockingReasonForBlockedCard = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/GetBlockingReasonForBlockedCard",
            params: {
                cardNumber: cardNumber,
            },
        });
        return response;
    }

    this.GetArcaCardsTransactionOrdersReport = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/GetArcaCardsTransactionOrdersReport",
            data: JSON.stringify(searchParams)
        });
        return response;
    };

    this.GetPreviousBlockUnblockOrderComment = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/GetPreviousBlockUnblockOrderComment",
            params: {
                cardNumber: cardNumber,
            },
        });
        return response;
    };

    this.GetAllReasonsForCardTransactionAction = function () {
        var response = $http({
            method: "post",
            url: "/ArcaCardsTransactionOrder/GetAllReasonsForCardTransactionAction",
            dataType: "json"
        });
        return response;
    }
    
}]);