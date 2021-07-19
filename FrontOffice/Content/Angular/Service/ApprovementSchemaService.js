app.service("ApprovementSchemaService", ['$http', function ($http) {

    this.getApprovementSchema = function () {
        return $http.get("/ApprovementSchema/GetApprovementSchema");
    };


    this.saveApprovementSchemaDetails = function (schemaDetails, schemaId) {
        var response = $http({
            method: "post",
            url: "ApprovementSchema/SaveApprovementSchemaDetails",
            data: JSON.stringify(schemaDetails),
            dataType: "json",
            params: {
                schemaId: schemaId
            }
        });
        return response;
    };

    this.removeApprovementSchemaDetails = function (schemaDetails) {
        var response = $http({
            method: "post",
            url: "ApprovementSchema/RemoveApprovementSchemaDetails",
            data: JSON.stringify(schemaDetails),
            dataType: "json"
        });
        return response;
    };

}]);