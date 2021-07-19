app.service("TokensDistributionService", ['$http', function ($http) {

    this.getUnusedTokensByFilialAndRange = function (from,to,filial) {
           var response = $http({
               method: "post",
               url: "/TokensDistribution/GetUnusedTokensByFilialAndRange",
               params: {
                   from: from,
                   to: to,
                   filial:filial
               }

           });
           return response;
    }; 

    this.moveUnusedTokens = function (filialToMove, unusedTokens) {
        var response = $http({
            method: "post",
            url: "/TokensDistribution/MoveUnusedTokens",
            params: {
                filialToMove: filialToMove,
                unusedTokens: unusedTokens
            }

        });
        return response;
    }; 
}]);