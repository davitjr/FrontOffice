app.service("utilityPaymentService",['$http', function ($http) {

    this.getUtilityTypeDescription = function (utilityType) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetUtilityTypeDescription",
            params: {
                utilityType: utilityType
            }
        });
        return response;
    }

    this.getUtilitySearchDescription = function (utilityType) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetUtilitySearchDescription",
            params: {
                utilityType: utilityType
            }
        });
        return response;
    }

    this.findUtilityPayments = function (searchCommunal) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/FindUtilityPayments",
            data: JSON.stringify(searchCommunal),
            dataType: "json"
        });
        return response;
    };



    

    this.getUtilityPaymentDetails = function (utilityType, abonentNumber, checkType, branchCode,abonentType) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetUtilityPaymentDetails",
            params: {
                communalType: utilityType,
                abonentNumber: abonentNumber,
                checkType: checkType,
                branchCode: branchCode,
                abonentType: abonentType
            }
        });
        return response;
    };

    this.savePaymentOrder = function (paymentOrder) {

        var response = $http({
            method: "post",
            url: "/UtilityPayment/SavePaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;


    };
    this.GetUtilityPaymentOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetUtilityPaymentOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    }

    this.getUtilityPaymentOrderDetails = function (paymentOrder,isCopy) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetUtilityPaymentReport",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params:{
                isCopy:isCopy
            }
        });
        return response;
    };

    this.getUtilityPaymentDescription = function (paymentOrder) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetUtilityPaymentDescription",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;
    }

    this.getCommunalsByPhoneNumber = function (searchCommunal) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetCommunalsByPhoneNumber",
            data: JSON.stringify(searchCommunal),
            dataType: "json"
        });
        return response;
    };

    this.getPhonePayments = function (searchCommunal) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetPhonePayments",
            data: JSON.stringify(searchCommunal),
            dataType: "json"
        });
        return response;
    };


    this.getWaterCoDetails = function () {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetWaterCoDetails",
        });
        return response;
    }

    this.getWaterCoDebtDates = function (code) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetWaterCoDebtDates",
            params: {
                code: code
            }
        });
        return response;
    }

    this.getWaterCoBranches = function (filialCode) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetWaterCoBranches",
            params: {
                filialCode: filialCode
            }
        });
        return response;
    }

    this.getReestrWaterCoBranches = function (filialCode) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetReestrWaterCoBranches",
            params: {
                filialCode: filialCode
            }
        });
        return response;
    }

    this.getWaterCoCitys = function (code) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetWaterCoCitys",
            params: {
                code: code
            }
        });
        return response;
    }


    this.getCOWaterOrderAmount = function (abonentNumber, branchCode, paymentType) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetCOWaterOrderAmount",
            params: {
                abonentNumber: abonentNumber,
                branchCode: branchCode,
                paymentType: paymentType
            }
        });
        return response;
    };


    this.saveReestrUtilityPaymentOrder = function (paymentOrder) {

        var response = $http({
            method: "post",
            url: "/UtilityPayment/SaveReestrUtilityPaymentOrder",
            data: JSON.stringify(paymentOrder),
            dataType: "json"
        });
        return response;


    };

    this.getReestrUtilityPaymentOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetReestrUtilityPaymentOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    }

    this.convertReestrDataToUnicode = function (reestrDetails) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/ConvertReestrDataToUnicode",
            data: JSON.stringify(reestrDetails),
            dataType: "json"
        });
        return response;
    };

    this.saveCustomerCommunalCard = function (customerCommunalCard) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/SaveCustomerCommunalCard",
            data: JSON.stringify(customerCommunalCard),
            dataType: "json"
        });
        return response;
    };

    this.changeCustomerCommunalCardQuality = function (customerCommunalCard) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/ChangeCustomerCommunalCardQuality",
            data: JSON.stringify(customerCommunalCard),
            dataType: "json"
        });
        return response;
    };


    this.getCommunalsByCustomerCommunalCards = function () {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetCommunalsByCustomerCommunalCards",
        });
        return response;
    };


    this.getComunalAmountPaidThisMonth = function (code, comunalType, abonentType, DebtListDate, texCode,waterCoPaymentType) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetComunalAmountPaidThisMonth",
            params: {
                code: code,
                comunalType: comunalType,
                abonentType: abonentType,
                DebtListDate: DebtListDate,
                texCode: texCode,
                waterCoPaymentType:waterCoPaymentType
            }
        });
        return response;
    }

    this.printWaterCoPaymentReportREESTR_4Copies = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/PrintWaterCoPaymentReportREESTR_4Copies",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.printWaterCoPaymentReport_2Copies = function (paymentOrder, isCopy) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/PrintWaterCoPaymentReport_2Copies",
            data: JSON.stringify(paymentOrder),
            dataType: "json",
            params: {
                isCopy: isCopy
            }
        });
        return response;
    };

    this.getENAPayments = function (abonentNumber,branch) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetENAPayments",
            params: {
                abonentNumber: abonentNumber,
                branch: branch,
            }
        });
        return response;
    }
    
    this.getENAPaymentDates = function (abonentNumber,branch) {
        var response = $http({
            method: "post",
            url: "/UtilityPayment/GetENAPaymentDates",
            params: {
                abonentNumber: abonentNumber,
                branch: branch,
            }
        });
        return response;
    }

}]);