app.service("customersNotesService", ['$http', function ($http) {
    this.savePersonNote = function (personNote, customerNumber) {

        var response = $http({
            method: "post",
            url: "/CustomersNotes/SavePersonNote",
            data: JSON.stringify(personNote),
            dataType: "json",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;

    };
    this.getPersonNotesHistory = function (quality) {

        var response = $http({
            method: "post",
            url: "/CustomersNotes/GetPersonNotesHistory",
            params: {
                quality: quality
            }
        });
        return response;
    };

    this.getPersonNoteHistory = function (noteId) {

        var response = $http({
            method: "post",
            url: "/CustomersNotes/GetPersonNoteHistory",
            params: {
                noteId: noteId
            }
        });
        return response;
    };


    this.getSearchedPersonNotes = function (searchParams) {

        var response = $http({
            method: "post",
            url: "/CustomersNotes/GetSearchedPersonNotes",
            data: JSON.stringify(searchParams),
            dataType: "json"
        });
        return response;
    };

    

    this.changePersonNoteReadingStatus = function (noteId) {

        var response = $http({
            method: "post",
            url: "/CustomersNotes/ChangePersonNoteReadingStatus",
            params: {
                noteId: noteId
            }
        });
        return response;
    };

    this.getCustomerHasArrests = function () {
        var response = $http({
            method: "post",
            url: "/CustomersNotes/GetCustomerHasArrests"
        });
        return response;
    };

}]);