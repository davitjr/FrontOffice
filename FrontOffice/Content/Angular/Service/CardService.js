app.service("cardService", ['$http', function ($http) {

    this.getCards = function (filter) {
        var response = $http({
            method: "post",
            url: "/Card/GetCards",
            params: {
                filter: filter
            }
        });
        return response;
    };

    this.getCard = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCard",
            params: {
                productId: productId
            }
        });
        return response;
    };
    this.getCardStatement = function (card, dateFrom, dateTo) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardStatement",
            data: JSON.stringify(card),
            params: {
                dateFrom: dateFrom,
                dateTo: dateTo
            }
        });
        return response;
    };
    this.getCreditLineGrafik = function (card) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardCreditLineGrafik",
            data: JSON.stringify(card),
            dataType: "json"
        });
        return response;
    };

    this.getArCaBalance = function (card) {
        var response = $http({
            method: "post",
            url: "/Card/GetArCaBalance",
            data: JSON.stringify(card),
            dataType: "json"
        });
        return response;
    };

    this.getArCaBalanceResponseData = function (card) {
        var response = $http({
            method: "post",
            url: "/Card/GetArCaBalanceResponseData",
            data: JSON.stringify(card),
            dataType: "json"
        });
        return response;
    };

    ///////////////////////////////////////////////////

    this.getCardApplicationDetails = function (applicationID, cardNumber) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardApplicationDetails",
            params: {
                applicationID: applicationID,
                cardNumber: cardNumber
            }
        });
        return response;
    };

    ///////////////////////////////////////////////////
    this.printCardStatement = function (card, dateFrom, dateTo, lang, exportFormat) {
        var response = $http({
            method: "post",
            url: "/Card/PrintCardStatement",
            data: JSON.stringify(card),
            params: {
                dateFrom: dateFrom,
                dateTo: dateTo,
                lang: lang,
                exportFormat: exportFormat
            }
        });
        return response;
    };




    this.getCardServiceFee = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardServiceFee",
            params: {
                productId: productId,
            }
        });
        return response;
    };




    this.getCardApplicationTypes = function () {
        var response = $http({
            method: "post",
            url: "/Card/GetCardApplicationTypes"
        });
        return response;
    };
    this.getCardServiceFeeGrafik = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardServiceFeeGrafik",
            params: {
                productId: productId,
            }
        });
        return response;
    };


    this.getCardTariff = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardTariff",
            params: {
                productId: productId,
            }
        });
        return response;
    };

    this.getCardStatus = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardStatus",
            params: {
                productId: productId,
            }
        });
        return response;
    };

    this.ValidateRenewedOtherTypeCardApplicationForPrint = function (cardNumber, confirm) {
        var response = $http({
            method: "post",
            url: "Card/ValidateRenewedOtherTypeCardApplicationForPrint",
            dataType: "json",
            params: {
                cardNumber: cardNumber,
                confirm: confirm
            }
        });
        return response;
    };

    this.getCardContractDetails = function (productId, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardContractDetails",
            responseType: 'arraybuffer',
            params: {
                productId: productId,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.getCardContractDetailsForBusinessCards = function (productId, confirmationPerson) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardContractDetailsForBusinessCards",
            responseType: 'arraybuffer',
            params: {
                productId: productId,
                confirmationPerson: confirmationPerson
            }
        });
        return response;
    };

    this.getCardTransactionsLimitApplication = function (customerNumber, cardType, cardCurrency, cardNumber, cardAccount) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardTransactionsLimitApplication",
            responseType: 'arraybuffer',
            params: {
                customerNumber: customerNumber,
                cardType: cardType,
                cardCurrency: cardCurrency,
                cardNumber: cardNumber,
                cardAccount: cardAccount
            }
        });
        return response;
    };


    this.setNewCardServiceFeeGrafik = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/SetNewCardServiceFeeGrafik",
            params: {
                productId: productId,
            }
        });
        return response;
    };

    this.getCardDAHKDetails = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardDAHKDetails",
            params: {
                cardNumber: cardNumber,
            }
        });
        return response;
    };

    this.getPlasticCard = function (productId, productIdType) {
        var response = $http({
            method: "post",
            url: "/Card/GetPlasticCard",
            params: {
                productId: productId,
                productIdType: productIdType
            }
        });
        return response;
    };

    this.getCardCashbackAccount = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardCashbackAccount",
            params: {
                productId: productId,
            }
        });
        return response;
    };

    this.getCardMotherName = function (productId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardMotherName",
            params: {
                productId: productId,
            }
        });
        return response;
    };



    this.getCardActivationInArCa = function (cardNumber, startDate, endDate) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardActivationInArCa",
            params: {
                cardNumber: cardNumber,
                startDate: startDate,
                endDate: endDate
            }
        });
        return response;
    };


    this.getLastSendedPaymentFileDate = function () {
        var response = $http({
            method: "post",
            url: "/Card/GetLastSendedPaymentFileDate",
        });
        return response;
    };

    this.getCardActivationInArCaApigateDetail = function (Id) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardActivationInArCaApigateDetail",
            params: {
                Id: Id,
            }
        });
        return response;
    };

    this.getCardUSSDService = function (productID) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardUSSDService",
            params: {
                productID: productID,
            }
        });
        return response;
    };

    this.getCardUSSDServiceTariff = function (productID) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardUSSDServiceTariff",
            params: {
                productID: productID,
            }
        });
        return response;
    };
    this.getCard3DSecureService = function (productID) {
        var response = $http({
            method: "post",
            url: "/Card/GetCard3DSecureService",
            params: {
                productID: productID,
            }
        });
        return response;
    };

    this.getCardArCaStatus = function (productID) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardArCaStatus",
            params: {
                productID: productID,
            }
        });
        return response;
    };

    this.getCardToOtherCardOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardToOtherCardOrder",
            params: {
                orderId: orderId,
            }
        });
        return response;
    };

    this.getCardTechnology = function (productId) {

        var response = $http({
            method: "post",
            url: "/Card/GetCardTechnology",
            params: {
                productId: productId,
            }
        });
        return response;
    };

    this.getCardHolderData = function (productId, dataType = 'fullName') {
        var response = $http({
            method: "post",
            url: "/Card/GetCardHolderData",
            params: {
                productId: productId,
                dataType: dataType
            }
        });
        return response;
    };

    this.getCardRetainHistory = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "/Card/GetCardRetainHistory",
            params: {
                cardNumber: cardNumber,
            }
        });
        return response;
    };

    this.validateSMSApplicationForPrint = function () {
        var response = $http({
            method: "post",
            url: "Card/ValidateSMSApplicationForPrint",
            dataType: "json"
        });
        return response;
    };

 
    this.Validate3DSecureEmailForPrint = function (cardNumber) {
        var response = $http({
            method: "post",
            url: "Card/Validate3DSecureEmailForPrint",
            dataType: "json",
            params: {
                cardNumber: cardNumber

            }

        });
        return response;
    };


    this.getUserFilialCode = function () {
        var response = $http({
            method: "post",
            url: "/Home/GetUserFilialCode",
        });
        return response;
    };

    this.getVisaAliasHistory = function (CardNumber) {
        var response = $http({
            method: "post",
            url: "/Card/GetVisaAliasHistory",
            params: {
                CardNumber: CardNumber,
            }
        });
        return response;
    };

    this.saveVisaAliasDataChange = function (changeAction, cardNumber, alias, addInfo) {
        var response = $http({
            method: "post",
            url: "/VisaAliasOrder/SaveVisaAliasDataChange",
            params: {
                changeAction: changeAction,
                CardNumber: cardNumber,
                alias: alias,
                addInfo: addInfo,
            }
        });
        return response;
    };

    this.saveVisaAliasOrder = function (order) {
        var response = $http({
            method: "post",
            url: "/VisaAliasOrder/SaveAndApproveVisaAliasOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;

    };

    this.getVisaAliasOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/Card/GetVisaAliasOrderDetails",
            params: {
                orderId: orderId,
            }
        });
        return response;
    };
}]);