app.service("SafekeepingItemService", ['$http', function ($http) {
    this.getSafekeepingItems = function (filter) {
        var response = $http({
            method: "post",
            url: "/SafekeepingItem/GetSafekeepingItems",
            params: {
                filter: filter
            }
        });
        return response;
    };
    
    this.getSafekeepingItem = function () {
        var response = $http({
            method: "post",
            url: "/SafekeepingItem/GetSafekeepingItem"
        });
        return response;
    };
    
    this.getSafekeepingItem = function (productId) {
        var response = $http({
            method: "post",
            url: "/SafekeepingItem/GetSafekeepingItem",
            params: {
                productId: productId
            }
        });
        return response;
    };

    this.getSafekeepingItemDescription = function (setPerson) {
        var response = $http({
            method: "post",
            url: "/SafekeepingItem/GetSafekeepingItemDescription",
            params: {
                setPerson: setPerson
            }
        });
        return response;
    };
}]);