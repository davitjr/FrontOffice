app.service("loanEquipmentsService", ['$http', function ($http) {


    this.getSearchedLoanEquipments = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/LoanEquipments/GetSearchedLoanEquipments",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });

        return response;
    };
    this.getSumsOfEquipmentPrices = function (searchParams) {
        var response = $http({
            method: "post",
            url: "/LoanEquipments/GetSumsOfEquipmentPrices",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });

        return response;
    };

    this.getEquipmentDetails = function (equipmentID) {
        var response = $http({
            method: "post",
            url: "/LoanEquipments/GetEquipmentDetails",
            params: {
                equipmentID: equipmentID
            }
        });
        return response;
    };

    this.saledEquipmentsReport = function (customerNumber, filialCode, loanFullNumber, equipmentSalePriceFrom, equipmentSalePriceTo, auctionEndDateFrom, auctionEndDateTo, equipmentDescription, equipmentAddress, equipmentQuality, saleStage) {
        var response = $http({
            method: "post",
            url: "/LoanEquipments/SaledEquipmentsReport",
            dataType: "json",
            params: {
                customerNumber: customerNumber,
                filialCode: filialCode,
                loanFullNumber: loanFullNumber,
                equipmentSalePriceFrom: equipmentSalePriceFrom,
                equipmentSalePriceTo: equipmentSalePriceTo,
                auctionEndDateFrom: auctionEndDateFrom,
                auctionEndDateTo: auctionEndDateTo,
                equipmentDescription: equipmentDescription,
                equipmentAddress: equipmentAddress,
                equipmentQuality: equipmentQuality,
                saleStage: saleStage
            }
        });
        return response;
    };
    

    this.getEquipmentClosingReason = function (equipmentID) {
        var response = $http({
            method: "post",
            url: "/LoanEquipments/GetEquipmentClosingReason",
            params: {
                equipmentID: equipmentID
            }
        });
        return response;
    };

    this.closeLoanEquipment = function (equipmentID, closingReason) {
        var response = $http({
            method: "post",
            url: "/LoanEquipments/LoanEquipmentClosing",
            params: {
                equipmentID: equipmentID,
                closingReason: closingReason
            }
        });

        return response;
    };

    this.changeCreditProductMatureRestriction = function (appID, allowMature) {
        var response = $http({
            method: "post",
            url: "/LoanEquipments/ChangeCreditProductMatureRestriction",
            params: {
                appID: appID,
                allowMature: allowMature
            }
        });

        return response;
    };
    

}]);