app.service("paymentOrderService",['$http', function ($http) {

    this.getAccountsForOrder = function (orderType, orderSubType, accountType) {

        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetAccountsForOrder",
            params: {
                orderType: orderType,
                orderSubType: orderSubType,
                accountType: accountType
            },
            async:true
        });
        return response;
    };

    this.getCustomerAccountsForOrder = function (customerNumber,orderType, orderSubType, accountType) {

        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCustomerAccountsForOrder",
            params: {
                orderType: orderType,
                orderSubType: orderSubType,
                accountType: accountType,
                customerNumber: customerNumber
            }
        });
        return response;
    };

    this.savePaymentOrder = function (paymentOrder, confirm) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/SavePaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                confirm: confirm
            }
            
        });
        return response;
    };

    this.saveBudgetPaymentOrder = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/SaveBudgetPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;
    };

    this.getBank = function (bankCode) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetBank",
            params: {
                code: bankCode
            }
        });
        return response;
    };

    this.getFee = function (paymentOrder, feeType) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetFee",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                feeType: feeType,
            }
        });
        return response;
    };

    this.getCardFee = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCardFee",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;
    };

    this.getPaymentOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetPaymentOrder",
            params: {
                orderID: orderID,
            }
        });
        return response;
    };

    this.getCurrencyExchangeOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCurrencyExchangeOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };

    this.getBudgetPaymentOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetBudgetPaymentOrder",
            params: {
                orderID: orderID
            }
        });
        return response;
    };


    this.manuallyRateChangingAccess = function (amount, currency, currencyConvertation, sourceType) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/ManuallyRateChangingAccess",
            params: {
                amount: amount,
                currency: currency,
                currencyConvertation: currencyConvertation,
                sourceType: sourceType
            }
        });
        return response;
    };

    this.getSyntheticStatuses = function () {

        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetSyntheticStatuses",

        });
        return response;
    };

    this.getPaymentOrderDetails = function (paymentOrder,isCopy) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getBudgetPaymentOrderDetails = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetBudgetPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }

        });
        return response;
    };

   

   

    this.getReceiverAccountWarnings = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetReceiverAccountWarnings",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };
    this.getCashInPaymentOrder = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCashInPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };
    this.getCashOutPaymentOrder = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCashOutPaymentOrderDetails",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };


    /// 20,000,000 և ավել գումարի դեպքում տպվող փաստաթղթի ստուգում--- 
    this.isCashBigAmount = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/IsBigAmountForPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };
    ///---կանչ
    this.printCashBigAmountReport = function (paymentOrder, inOunt) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/PrintCashBigAmountReport",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                inOut: inOunt
            }

        });
        return response;
    };
    this.getPaymentOrderDescription = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetPaymentOrderDescription",
            data: JSON.stringify(paymentOrder),
            dataType: "json",

        });
        return response;
    };
    
    this.getOperationSystemAccountForFee = function (orderForFee,feeType) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetOperationSystemAccountForFee",
            data: JSON.stringify(orderForFee),
            dataType: "json",
            params: {
                feeType: feeType
            }
        });
        return response;
    };

    this.isTransferFromBusinessmanToOwnerAccount = function (debitAccountNumber, creditAccountNumber) {

        var response = $http({
            method: "post",
            url: "/PaymentOrder/IsTransferFromBusinessmanToOwnerAccount",
            params: {
                debitAccountNumber: debitAccountNumber,
                creditAccountNumber: creditAccountNumber
            }
        });
        return response;
    };

    this.getSpecialPriceWarnings = function (accountNumber,additionID) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetSpesialPriceMessage",
            params: {
                accountNumber: accountNumber,
                additionID: additionID
            }
        });
        return response;
    };

    this.saveReestrTransferOrder = function (order, confirm) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/SaveReestrTransferOrder",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                confirm: confirm
            }

        });
        return response;
    };
  
    this.getReestrTransferOrder = function (orderID) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetReestrTransferOrder",
            params: {
                orderID: orderID,
            }
        });
        return response;
    };


    this.getCashInByReestrAmounts = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCashInByReestrAmounts",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getCashInByReestr = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCashInByReestr",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getCashInByReestrNote = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCashInByReestrNote",
            responseType: 'arraybuffer',
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };


    this.convertReestrDataToUnicode = function (reestrDetails) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/ConvertReestrDataToUnicode",
            data: JSON.stringify(reestrDetails),
            dataType: "json",
        });
        return response;
    };

    this.getPoliceResponseDetailsIDWithoutRequest = function (violationID, violationDate) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetPoliceResponseDetailsIDWithoutRequest",
            params: {
                violationID: violationID,
                violationDate: violationDate
            }
        });
        return response;
    };


    this.checkReestrTransferAdditionalDetails = function (details) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/CheckReestrTransferAdditionalDetails",
            data: JSON.stringify(details),
            dataType: "json"
        });
        return response;
    };


    this.getCardWithOutBallance = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetCardWithOutBallance",
            params: {
                accountNumber: accountNumber,
                       }
        });
        return response;
    };

	this.GetFactoringCustomerCardAndCurrencyAccounts = function (ProductId, currency) {
		var response = $http({
			method: "post",
			url: "/Factoring/GetFactoringCustomerCardAndCurrencyAccounts",
			params: {
				ProductId: ProductId,
				currency: currency,
			}
		});
		return response;
	};

	this.GetFactoringCustomerFeeCardAndCurrencyAccounts = function(ProductId) {
		var response = $http({
			method: "post",
			url: "/Factoring/GetFactoringCustomerFeeCardAndCurrencyAccounts",
			params: {
				ProductId: ProductId,
			}
		});
		return response;
    };

    this.isUrgentTime = function () {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/IsUrgentTime",
           
        });
        return response;
    };

    this.getTransactionIsChecked = function (ordeId, details) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetTransactionIsChecked",
            params: {
                orderId: ordeId
            },
            data: JSON.stringify(details),
            dataType: "json"
        });
        return response;
    };
    
    this.checkHBReestrTransferAdditionalDetails = function (orderId, details) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/CheckHBReestrTransferAdditionalDetails",
            params: {
                orderId: orderId,
            },
            data: JSON.stringify(details),
            dataType: "json"
        });
        return response;
    };


    this.getSessionProperties = function () {
        var response = $http({
            method: "post",
            url: "/Customer/GetSessionProperties"

        });
        return response;
    };

    this.getDebetCreditSintAccounts = function (accountNumber) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/GetSintAccounts",
            params: {
                accountNumber: accountNumber
            }
        });
        return response;
    };

    this.isDebetExportAndImportCreditLine = function (debAccountNumber) {
        var response = $http({
            method: "post",
            url: "/PaymentOrder/IsDebetExportAndImportCreditLine",
            params: {
                debAccountNumber: debAccountNumber
            }
        });
        return response;
    };

}]);