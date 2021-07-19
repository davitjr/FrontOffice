app.service("orderService", ['$http', function ($http) {

    this.getOrders = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrders",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });
        return response;
    };
    this.GetOrderTypes = function () {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderTypes",
        });
        return response;
    };
    this.GetOrderQualityTypes = function () {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderQualityTypes",
        });
        return response;
    };

    this.getOrderHistory = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderHistory",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.generateNewOrderNumber = function (orderNumberType) {

        var response = $http({
            method: "post",
            url: "/Orders/GenerateNewOrderNumber",
            params: {
                orderNumberType: orderNumberType
            }
        });
        return response;
    };

    this.getOrderOPPersons = function (accountNumber, orderType) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderOPPersons",
            params: {
                accountNumber: accountNumber,
                orderType: orderType == undefined ? 1 : orderType
            }
        });
        return response;
    };


    this.getOrderRejectHistory = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderRejectHistory",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.setOrderPerson = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Orders/SetOrderPerson",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.getOrderAttachments = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderAttachments",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getOrderAttachment = function (id) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderAttachment",
            responseType: 'arraybuffer',
            params: {
                id: id
            }
        });
        return response;
    }

    this.confirmOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Orders/ConfirmOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getOrderServiceFee = function (type, urgent) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrderServiceFee",
            params: {
                type: type,
                urgent: urgent
            }
        });
        return response;
    };

    this.getCurrentOperDay = function () {
        var response = $http({
            method: "post",
            url: "/Orders/GetCurrentOperDay",
        });
        return response;
    };

    this.generateNextOrderNumber = function (customerNumber) {

        var response = $http({
            method: "post",
            url: "/Orders/GenerateNextOrderNumber",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };


    this.getNotConfirmedOrders = function () {
        var response = $http({
            method: "post",
            url: "/Orders/GetNotConfirmedOrders",
        });
        return response;
    };

    this.getOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Orders/GetOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getUserRejectedMessages = function (filter) {
        var response = $http({
            method: "post",
            url: "/Orders/GetRejectedMessages",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.closeRejectedMessage = function (messageId) {
        var response = $http({
            method: "post",
            url: "/Orders/CloseRejectedMessage",
            params: {
                messageId: messageId
            }
        });
        return response;
    };
    this.getNotConfirmedOrdersWithScroll = function (filter, scrollState, count) {
        var response = $http({
            method: "post",
            url: "/Orders/GetNotConfirmedOrdersWithScroll",
            params: {
                filter: filter,
                scrollState: scrollState,
                count: count
            }
        });
        return response;
    };

    this.geUserRejectedMessagesWithScroll = function (filter, scrollState, count) {
        var response = $http({
            method: "post",
            url: "/Orders/GeUserRejectedMessagesWithScroll",
            params: {
                filter: filter,
                scrollState: scrollState,
                count: count
            }
        });
        return response;
    };


    this.setTotalUserMessages = function () {
        var response = $http({
            method: "post",
            url: "/Orders/SetTotalUserMessages"
        });
        return response;
    };



    this.getCTPaymentOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Orders/GetCTPaymentOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getCTLoanMatureOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/Orders/GetCTLoanMatureOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.postReestrPaymentDetails = function (obj) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostReestrPaymentDetails",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.postDAHKPaymentType = function (orderId, paymentType) {
        var response = $http({
            method: "post",
            url: "/Orders/PostDAHKPaymentType",
            params: {
                orderId: orderId,
                paymentType: paymentType
            }
        });
        return response;
    };
}]);