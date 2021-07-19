app.service("HBDocumentsService", ['$http', function ($http) {

    //Initialization
    this.getCurrentOperDay = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCurrentOperDay"
        });
        return response;
    };


    this.getSourceTypes = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetSourceTypes"
        });
        return response;
    };
    this.getQualityTypes = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetQualityTypes"
        });
        return response;
    };
    this.getFilialList = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetFilialList"
        });
        return response;
    };
    this.getDocumentTypes = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetDocumentTypes"
        });
        return response;
    };
    this.getDocumentSubTypes = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetDocumentSubTypes"
        });
        return response;
    };
    this.getCurrencyTypes = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCurrencyTypes"
        });
        return response;
    };

    this.getHBDocumentsList = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetHBDocumentsList",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });
        return response;
    };

    this.openTransactionErrorView = function () {
        var response = $http({
            method: "Get",
            url: "/HomeBankingDocuments/HBDocumentTransactionError"
        });
        return response;
    };

    //functions
    this.getSearchedHBDocuments = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetSearchedHBDocuments",
            data: searchParams,
            dataType: "json"
        });
        return response;
    };

    this.getCustomerAccountDetails = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCustomerAccountDetails",
            params: { transactionCode: code }
        });
        return response;
    };

    this.getCustomerInfoDetails = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCustomerInfoDetails",
            params: { transactionCode: code }
        });
        return response;
    };

    this.getTransactionErrorDetails = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetTransactionErrorDetails",
            params: { transactionCode: code }
        });
        return response;
    };

    this.setHBDocumentAutomatConfirmation = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/SetHBDocumentAutomatConfirmation",
            data: searchParams,
            dataType: "json"
        });
        return response;
    };
    this.getCardAccountTransactions = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCardAccountTransactions",
            data: searchParams,
            dataType: "json"
        });
        return response;
    };
    this.getOrSetAutomaticExecution = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetOrSetAutomaticExecution",
            data: searchParams,
            dataType: "json"
        });
        return response;
    };

    this.getConfirmationHistoryDetails = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetConfirmationHistoryDetails",
            params: { transactionCode: code }
        });
        return response;
    };

    
    this.getCheckingProductAccordance = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCheckingProductAccordance",
            params: { transactionCode: code }
        });
        return response;
    };

    this.getProductAccordanceDetails = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetProductAccordanceDetails",
            params: { transactionCode: code }
        });
        return response;
    };

    this.getHBArCaBalancePermission = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetHBArCaBalancePermission",
            params: { transactionCode: code }
        });
        return response;
    };

    this.getHBArCaBalanceDetails = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetHBArCaBalanceDetails",
            params: { cardNumber: code }
        });
        return response;
    };
    this.getHBRejectTypes = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetHBRejectTypes"
        });
        return response;
    };
    this.postTransactionRejectConfirmation = function (document) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostTransactionRejectConfirmation",
            data: document,
            dataType: "json"
        });
        return response;
    };

    this.getCheckedTransactionQualityChangability = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCheckedTransactionQualityChangability",
            params: { transactionCode: code }
        });
        return response;
    };

    this.postchangedTransactionQuality = function (code) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostchangedTransactionQuality",
            params: { transactionCode: code }
        });
        return response;
    };

    this.postChangedAutomatedConfirmTime = function (info) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostChangedAutomatedConfirmTime",
            data: info,
            dataType: "json"
        });
        return response;
    };

    this.getAutomatedConfirmTime = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetAutomatedConfirmTime"
        });
        return response;
    };

    this.printHomeBankingDocumentsReport = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PrintHomeBankingDocumentsReport",
            data: searchParams,
            dataType: "json",
            responseType: 'arraybuffer'
        });
        return response;
    };
    
    this.formulateAllHBDocuments = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/FormulateAllHBDocuments",
            data: searchParams,
            dataType: "json"
        });
        return response;
    };

    this.authorizeCustomerForHBConfirm = function (number) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/AuthorizeCustomerForHBConfirm",
            params: { customerNumber: number }
        });
        return response;
    };
    
    this.getTreansactionConfirmationDetails = function (docId, debitAccount) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetTreansactionConfirmationDetails",
            params: {
                docId: docId,
                debitAccount: debitAccount
            }
        });
        return response;
    };
    
    this.confirmReestrTransaction = function (docId, bankCode) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/ConfirmReestrTransaction",
            params: {
                docId: docId,
                bankCode: bankCode
            }
        });
        return response;
    };

    this.getReestrFromHB = function (order) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetReestrFromHB",
            data: order,
            dataType: "json"
        });
        return response;
    };

    this.goToHBDocumentsList = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/Index"
        });
    };


    this.goToTransfersList = function () {
        var response = $http({
            method: "GET",
            url: "/Transfers/Index"
        });
    };

    this.loadHBMessages = function () {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetHBMessages"
        });
        return response;
    };

    this.getSearchedHbMsg = function (searchParams) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetSearchedHBMessages",
            data: searchParams,
            dataType: "json"
        });
        return response;
    };


    this.setMessageAsRead = function (msgId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostMessageAsRead",
            params: {
                msgId: msgId
            }
        });
        return response;
    };

    this.sendMessageToCustomer = function (obj) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostSentMessageToCustomer",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.getMessageUploadedFilesList = function (msgId) {
        var response = $http({
            method: "GET",
            url: "/HomeBankingDocuments/GetMessageUploadedFilesList",
            params: {
                msgId: msgId
            }
        });
        return response;
    };

    this.getCustomerallProductsReport = function (productStatus, customerNumber) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCustomerallProductsReport",
            params: {
                productStatus: productStatus,
                customerNumber: customerNumber
            },
            responseType: 'arraybuffer'
        });
        return response;
    };

    this.getCancelTransactionDetails = function (docId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCancelTransactionDetails",
            params: {
                docId: docId
            }
        });
        return response;
    };

    this.postbyPassSelectedTransaction = function (obj) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostbyPassSelectedTransaction",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.getHBBypassList = function (docId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetHBBypassList",
            params: {
                docId: docId
            }
        });
        return response;
    };

    this.postBypassHistory = function (obj) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostBypassHistory",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.postApproveUnconfirmedOrder = function (docId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/PostApproveUnconfirmedOrder",
            params: {
                docId: docId
            }
        });
        return response;
    };

    this.getReestrTransactionIsChecked = function (docId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetReestrTransactionIsChecked",
            params: {
                docId: docId
            }
        });
        return response;
    };

    this.getcheckedReestrTransferDetails = function (docId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetcheckedReestrTransferDetails",
            params: {
                docId: docId
            }
        });
        return response;
    };

    this.openMsgSelectedFile = function (fileId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/OpenMsgSelectedFile",
            params: {
                fileId: fileId
            }
        });
        return response;
    };

    this.getCustomerAccountAndInfoDetails = function (obj) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetCustomerAccountAndInfoDetails",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.getcheckedArmTransferDetails = function (docId) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetcheckedArmTransferDetails",
            params: {
                docId: docId
            }
        });
        return response;
    };
    this.getDebitAccountCustomerName = function (debitAccount) {
        var response = $http({
            method: "POST",
            url: "/HomeBankingDocuments/GetDebitAccountCustomerName",
            params: {
                debitAccount: debitAccount
            }
        });
        return response;
    };


}]);