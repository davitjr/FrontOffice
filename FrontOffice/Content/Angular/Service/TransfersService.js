app.service("transfersService", ['$http', function ($http) {

    this.getTransferList = function (filter) {

        var response = $http({
            method: "post",
            url: "/Transfers/GetTransferList",
            data: JSON.stringify(filter),
        });
        return response;
    };


    this.getTransfer = function (transferID) {
        var response = $http({
            method: "post",
            url: "/Transfers/GetTransfer",
            params: {
                transferID: transferID
            }
        });
        return response;
    };

    this.getApprovedTransfer = function (transferID) {
        var response = $http({
            method: "post",
            url: "/Transfers/GetApprovedTransfer",
            params: {
                transferID: transferID
            }
        });
        return response;
    };

    //this.confirmTransfer = function (transfer, confirm) {
    //    var response = $http({
    //        method: "post",
    //        url: "/Transfers/ConfirmTransfer",
    //        params: {
    //            transfer: transfer,
    //            confirm: confirm
    //        }
    //    });
    //    return response;
    //};

    this.confirmTransfer = function (transfer, confirm) {
        var response = $http({
            method: "post",
            url: "/Transfers/ConfirmTransfer",
            data: JSON.stringify(transfer),
            dataType: "json",
            params: {
                confirm: confirm
            }
        });
        return response;
    };

    this.deleteTransfer = function (transferID, description, confirm) {
        var response = $http({
            method: "post",
            url: "/Transfers/DeleteTransfer",
            data: JSON.stringify(transferID, description),
            dataType: "json",
            params: {
                transferID: transferID,
                description: description,
                confirm: confirm
            }
        });
        return response;
    };

    this.approveTransfer = function (transferApproveOrder, confirm) {
        var response = $http({
            method: "post",
            url: "/Transfers/ApproveTransfer",
            data: JSON.stringify(transferApproveOrder),
            dataType: "json",
            params: {
                confirm: confirm
            }
        });
        return response;
    };

    this.getTransferAttachmentInfo = function (transferID) {
        var response = $http({
            method: "post",
            url: "/Transfers/GetTransferAttachmentInfo",
            params: {
                transferID: transferID
            }
        });
        return response;
    };

    this.getTransferAttachment = function (id) {
        var response = $http({
            method: "post",
            url: "/Transfers/GetTransferAttachment",
            responseType: 'arraybuffer',
            params: {
                id: id
            }
        });
        return response;
    };

    this.getTransferCriminalLogId = function (transferID) {
        var response = $http({
            method: "post",
            url: "/Transfers/GetTransferCriminalLogId",
            params: {
                transferID: transferID
            }
        });
        return response;
    };

    this.updateTransferVerifiedStatus = function (transferId, verified) {
        var response = $http({
            method: "post",
            url: "/Transfers/UpdateTransferVerifiedStatus",
            dataType: "json",
            params: {
                transferId: transferId,
                verified: verified
            }

        });
        return response;
    };


    this.getCorrespondentBankAccounts = function (filter) {
        var response = $http({
            method: "post",
            url: "/Transfers/GetCorrespondentBankAccounts",
            data: JSON.stringify(filter),
            dataType: "json"
        });
        return response;
    };


    this.printTransfer = function (transferID) {
        var response = $http({
            method: "post",
            url: "/Transfers/PrintTransfer",
            dataType: "json",
            params: {
                transferID: transferID
            }

        });
        return response;
    };


    this.printPaidTransfers = function (startDate, endDate, transferSystem, filial) {
        var response = $http({
            method: "post",
            url: "/Transfers/PrintPaidTransfers",
            dataType: "json",
            params: {
                startDate: startDate,
                endDate: endDate,
                transferSystem: transferSystem,
                filial: filial
            }

        });
        return response;
    };


    this.printBankMailTransfers = function (startDate, endDate, receiverName, transferGroup, transferType, confirmationSetNumber, session, amount, confirmStatus, mainFilial) {
        var response = $http({
            method: "post",
            url: "/Transfers/PrintBankMailTransfers",
            dataType: "json",
            params: {
                startDate: startDate,
                endDate: endDate,
                transferGroup: transferGroup,
                transferType: transferType,
                confirmationSetNumber: confirmationSetNumber,
                session: session,
                amount: amount,
                receiverName: receiverName,
                confirmStatus: confirmStatus,
                mainFilial: mainFilial
            }
        });
        return response;
    };

    this.responseConfirmForSTAK = function (docID) {
        var response = $http({
            method: "post",
            url: "/STAKResponseConfirm/ResponseConfirmForSTAK",

            dataType: "json",
            params: {
                docID: docID
            }

        });
        return response;
    };

    this.paymentOrderWithStateDutiesMark = function (transferID) {
        var response = $http({
            method: "post",
            url: "/Transfers/PaymentOrderWithStateDutiesMark",
            data: JSON.stringify(transferID),
            dataType: "json",
            params: {
                transferID: transferID
            }

        });
        return response;
    };

    this.paymentOrderWithoutStateDutiesMark = function (transferID) {
        debugger;
        var response = $http({
            method: "post",
            url: "/Transfers/PaymentOrderWithoutStateDutiesMark",
            data: JSON.stringify(transferID),
            dataType: "json",
            params: {
                transferID: transferID
            }

        });
        return response;
    };


}]);