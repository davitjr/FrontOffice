app.service("overdueService",['$http', function ($http) {

    this.getOverdueDetails = function () {
        return $http.get("/Overdue/GetOverdueDetails");
    };

    this.getCurrentProductOverdueDetails = function (productId) {
        return $http.get("/Overdue/GetCurrentProductOverdueDetails",{
            params: {
                productId: productId
            }
        });
    };

    this.GenerateLoanOverdueUpdate = function (productId, startDate, endDate, updateReason) {
        var response = $http({
            method: "post",
            url: "/Overdue/GenerateLoanOverdueUpdate",
            params: {
                productId: productId,
                startDateStr: startDate,
                endDate: endDate,
                updateReason: updateReason
            }
        });
        return response;
    };


}]);