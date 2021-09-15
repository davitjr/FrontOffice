app.service("ReportingApiService", ['$http', function ($http) {
    this.getReport = function (requestObj, callback) {
        $.ajax({
            url: appConfig.reportingApiURL,
            type: 'POST',
            headers: { 'Content-Encoding': 'gzip' },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            responseType: 'arraybuffer',
            cache: false,
            data: JSON.stringify(requestObj),
            xhrFields: {
                withCredentials: false
            },
            success: function (response) {
                callback(response);
            },
            error: function (xhr) {
                alert('Տեղի ունեցավ սխալ');
            },
            timeout: 200000
        });
    };  
   
}]);
