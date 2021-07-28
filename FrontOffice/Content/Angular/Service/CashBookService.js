app.service("cashBookService", ['$http', function ($http) {

    this.SaveAndApprove = function (order) {
        var response = $http({
            method: "post",
            url: "/CashBook/SaveAndApprove",
            data: JSON.stringify(order),
            datType: "json"
        });
        return response;
    };

    this.getCashBooks = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashBooks",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });
        return response;
    };
    this.getRowTypes = function () {
        var response = $http({
            method: "post",
            url: "/CashBook/GetRowTypes",
            
        });
        return response;
    };
    this.getOperationTypes = function (forInput) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetOperationTypes",
            params: {
                forInput: forInput
            }
        });
        return response;
    };

    this.GetCashBookQualityTypes = function () {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashBookQualityTypes",
        });
        return response;
    };

    this.getCurrencies = function () {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCurrencies",
        });
        return response;
    };

    this.getCorrespondentSetNumber = function () {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCorrespondentSetNumber",
        });
        return response;
    }

    this.removeCashBook = function (cashBookID) {
        var response = $http({
            method: "post",
            url: "/CashBook/RemoveCashBook",
            params: {
                cashBookID: cashBookID
            }
        });
        return response;
    };

    this.getRest = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetRest",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });
        return response;
    };

    this.GetCashBookSummary = function (date, userId) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashBookSummary",
            responseType: 'arraybuffer',
            params: {
                date: date,
                userId: userId
            }
        });
        return response;
    };

    this.changeCashBookStatus = function (cashBookID, newStatus) {
        var response = $http({
            method: "post",
            url: "/CashBook/ChangeCashBookStatus",
            params: {
                cashBookID: cashBookID,
                newStatus: newStatus,
            }
        });
        return response;
    };

    this.CashBookAccountStatementReport = function (cashBook,payerReciever) {
        var response = $http({
            method: "post",
            url: "/CashBook/CashBookAccountStatementReport",
            data: JSON.stringify(cashBook),
            dataType: "json",
            params: {
                payerReciever: payerReciever
            }
        });
        return response;
    };

    
    this.getCashOutPaymentOrder = function (order, isCopy) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashOutPaymentOrderDetails",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getCashInPaymentOrderDetails = function (order, isCopy) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashInPaymentOrderDetails",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getCashBookOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashBookOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };

    this.getPaymentOrderDetails = function (order, isCopy) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetPaymentOrderDetails",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };


    this.getCashBookOpperson = function () {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashBookOpperson",
        });
        return response;
    };




    this.GetCashierLimits = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashierLimits",
            params: {
                setNumber: setNumber
            }
        });
        return response;
    };

    this.GenerateCashierCashDefaultLimits = function (setNumber,changeSetNumber) {
        var response = $http({
            method: "post",
            url: "/CashBook/GenerateCashierCashDefaultLimits",
            params: {
                setNumber: setNumber,
                changeSetNumber: changeSetNumber
            }
        });
        return response;
    };


    this.GenerateCashierCashDefaultLimits = function (setNumber, changeSetNumber) {
        var response = $http({
            method: "post",
            url: "/CashBook/GenerateCashierCashDefaultLimits",
            params: {
                setNumber: setNumber,
                changeSetNumber: changeSetNumber
            }
        });
        return response;
    };



    this.SaveCashierCashLimits = function (limit) {
        var response = $http({
            method: "post",
            url: "/CashBook/SaveCashierCashLimits",
            data: JSON.stringify(limit),
            datType: "json"
        });
        return response;
    };




    this.GetCashierFilialCode = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashierFilialCode",
            params: {
                setNumber: setNumber
            }
        });
        return response;
    };


    this.CheckCashierFilialCode = function (setNumber) {
        var response = $http({
            method: "post",
            url: "/CashBook/CheckCashierFilialCode",
            params: {
                setNumber: setNumber
            }
        });
        return response;
    };


    this.getCashBookReport = function (date) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashBookReport",
            dataType: "json",
            params: {
                date: date
            }
        });
        return response;
    };
    this.getCashBookTotalReport = function (date) {
        var response = $http({
            method: "post",
            url: "/CashBook/GetCashBookTotalReport",
            dataType: "json",
            params: {
                date: date
            }
        });
        return response;
	};


	this.getCashBookAmount = function (cashBookId) {

		var response = $http({
			method: "post",
			url: "/CashBook/GetCashBookAmount",
			params: {
				cashBookId: cashBookId
			}
		});
		return response;
	};


	this.hasUnconfirmedOrder = function (cashBookId) {

		var response = $http({
			method: "post",
			url: "/CashBook/HasUnconfirmedOrder",
			params: {
				cashBookId: cashBookId
			}
		});
		return response;
	};

}]);