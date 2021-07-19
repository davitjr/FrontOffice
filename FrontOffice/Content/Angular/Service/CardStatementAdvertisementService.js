app.service('cardStatementAdvertisementService', ['$http', function ($http) {

    this.getOneCardAdvertisements = function (cardType) {
        var response = $http({
            method: "post",
            url: "/CardStatementAdvertisement/GetOneCardAdvertisements",
            dataType: "json",
            params: {
                cardType: cardType
            }
        });
        return response;
    };

    this.getAllCardsAdvertisements = function () {
        var response = $http({
            method: "post",
            url: "/CardStatementAdvertisement/GetAllCardsAdvertisements",
            dataType: "json"            
        });
        return response;
    };

    this.getAdvertisementFiles = function (advertisementID) {
        var response = $http({
            method: "post",
            url: "/CardStatementAdvertisement/GetAdvertisementFiles",
            dataType: "json",
            params: {
                advertisementID: advertisementID
            }
        });
        return response;
    };

    this.getAdvertisementFileByID = function (ID) {
        var response = $http({
            method: "post",
            url: "/CardStatementAdvertisement/GetAdvertisementFileByID",
            params: {
                ID: ID
            }
        });
        return response;
    }

    this.insertAdvertisement = function (statementAdvertisements) {
        var response = $http({
            method: "post",
            url: "/CardStatementAdvertisement/InsertAdvertisement",
            dataType: "json",
            data: JSON.stringify(statementAdvertisements),
        });
        return response;
    }

    this.updateAdvertisementWithNewFile = function (advertisement) {
        var response = $http({
            method: "post",
            url: "/CardStatementAdvertisement/UpdateAdvertisementWithNewFile",
            dataType: "json",
            params: {
                advertisement: advertisement
            }
        });
        return response;
    }

    this.deactivateAdvertisement = function (advertisementID) {
        var response = $http({
            method: "post",
            url: "/CardStatementAdvertisement/DeactivateAdvertisement",
            dataType: "json",
            params: {
                advertisementID: advertisementID
            }
        });
        return response;
    }
    
}]);