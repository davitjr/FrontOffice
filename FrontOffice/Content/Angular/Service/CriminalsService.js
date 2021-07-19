app.service("criminalsService",['$http', function ($http) {

    this.getCriminalCheckResults = function (logId) {
        var response = $http({
            method: "post",
            url: "/Criminals/GetCriminalCheckResults",
            params: {
                logId: logId
            }
        });
        return response;
    };

   

   

  

   


  

}]);