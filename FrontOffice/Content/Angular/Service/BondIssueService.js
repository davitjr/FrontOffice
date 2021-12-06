app.service("bondIssueService", ['$http', function ($http) {


    this.getBondIssue = function (id) {
        var response = $http({
            method: "post",
            url: "/BondIssue/GetBondIssue",
            params: {
                id: id
            }
        });
        return response;
    };

    this.deleteBondIssue = function (id) {
        var response = $http({
            method: "post",
            url: "/BondIssue/DeleteBondIssue",
            params: {
                id: id
            }
        });
        return response;
    };

    this.approveBondIssue = function (id) {
        var response = $http({
            method: "post",
            url: "/BondIssue/ApproveBondIssue",
            params: {
                id: id
            }
        });
        return response;
    };

    this.saveBondIssue = function (bondissue) {
        var response = $http({
            method: "post",
            url: "/BondIssue/SaveBondIssue",
            data: JSON.stringify(bondissue),
            dataType: "json"
        });
        return response;
    };

    this.getBondIssuesList = function (searchParams, availableForSale) {
        var response = $http({
            method: "post",
            url: "/BondIssue/GetBondIssuesList",          
            data:  JSON.stringify(searchParams),
            dataType: "json",
            params: {
                availableForSale: availableForSale
            }
        });
        return response;
    };

    this.calculateCouponRepaymentSchedule = function (bondIssue) {
        var response = $http({
            method: "post",
            url: "/BondIssue/CalculateCouponRepaymentSchedule",
            data: JSON.stringify(bondIssue),
            dataType: "json"
        });
        return response;
    };

    this.getCouponRepaymentSchedule = function (bondIssue) {
        var response = $http({
            method: "post",
            url: "/BondIssue/GetCouponRepaymentSchedule",
            data: JSON.stringify(bondIssue),
            dataType: "json"
        });
        return response;
    };

    this.getNonDistributedBondsCount = function (bondIssueId) {
        var response = $http({
            method: "post",
            url: "/BondIssue/GetNonDistributedBondsCount",
            params: {
                bondIssueId: bondIssueId
            }
        });
        return response;
    };
    
    this.saveStockIssue = function (stockissue) {
        var response = $http({
            method: "post",
            url: "/BondIssue/SaveStockIssue",
            data: JSON.stringify(stockissue),
            dataType: "json"
        });
        return response;
    };

    this.getUnitPrice = function (bondIssueId) {
        var response = $http({
            method: "post",
            url: "/BondIssue/GetUnitPrice",
            params: {
                bondIssueId: bondIssueId
            }
        });
        return response;
    };

    //this.getCheckedCustomerIsResident = function () {
    //    var response = $http({
    //        method: "post",
    //        url: "/BondIssue/GetCheckedCustomerIsResident"
    //    });
    //    return response;
    //}
    

}]);