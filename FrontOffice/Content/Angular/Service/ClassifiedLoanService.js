app.service("classifiedLoanService", ['$http', function ($http) {

    this.getSearchedClassifiedLoans = function (searchParams) {

        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/GetSearchedClassifiedLoans",
            data: JSON.stringify(searchParams),
            dataType: "json" 
        });
        return response;
    };

    this.saveClassifiedLoanActionPreOrder = function (order) {

        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/SaveClassifiedLoanActionPreOrder",
            data: JSON.stringify(order),
            dataType: "json"
        });
        return response;
    };

    this.approveClassifiedLoanActionPreOrder = function (preOrderID, preOrderType) {

        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/ApproveClassifiedLoanActionPreOrder",
            params: {
                preOrderID: preOrderID,
                preOrderType: preOrderType
            }
        });
        return response;
    };
  
    this.getClassifiedLoanOrder = function (orderId) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/GetClassifiedLoanOrder",
            params: {
                orderId: orderId
            }
        });
        return response;
    };
    this.saveLoanProductMakeOutOrder = function (order, includingSurcharge) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoanActionOrder/SaveLoanProductMakeOutOrder",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                includingSurcharge: includingSurcharge
            }
        });
        return response;
    };
    this.saveLoanProductClassificationRemoveOrder = function (order, includingSurcharge) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoanActionOrder/SaveLoanProductClassificationRemoveOrder",
            data: JSON.stringify(order),
            params: {
                includingSurcharge: includingSurcharge
            },
            dataType: "json"
        });
        return response;
    };

    this.customersClassification = function () {

        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/CustomersClassification"
        });
        return response;
    };
    this.storedCreditProductsByCustReport = function (filialCode,type) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/StoredCreditProductsByCustReport",
            dataType: "json",
            params: {
                filialCode: filialCode,
                type: type
            }
        });
        return response;
    };
    this.storedCreditProductReport = function (filialCode,type) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/StoredCreditProductReport",
            dataType: "json",
            params: {
                filialCode: filialCode,
                type: type
            }
        });
        return response;
    };
    this.reportOfLoansToOutBalance = function (filialCode) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/ReportOfLoansToOutBalance",
            dataType: "json",
            params: {
                filialCode: filialCode
            }
        });
        return response;
    };
    this.reportOfLoansReturningToOutBalance = function (filialCode) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoan/ReportOfLoansReturningToOutBalance",
            dataType: "json",
            params: {
                filialCode: filialCode
            }
        });
        return response;
    };

    this.saveLoanProductMakeOutBalanceOrder = function (order, includingSurcharge) {
        var response = $http({
            method: "post",
            url: "/ClassifiedLoanActionOrder/SaveLoanProductMakeOutBalanceOrder",
            data: JSON.stringify(order),
            dataType: "json",
            params: {
                includingSurcharge: includingSurcharge
            }
        });
        return response;
    };
}]);