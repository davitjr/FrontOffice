app.controller("CardDeliveryOrderCtrl", ['$scope', 'cardDeliveryOrderService', function ($scope, cardDeliveryOrderService, ) {

    var dateNow = new Date();

    $scope.searchParams = {
        DateTo: dateNow,
        DateFrom: dateNow
    };

    $scope.DownloadOrderXMLs = function () {
        showloading();
        if ($scope.searchParams.DateFrom > $scope.searchParams.DateTo) {
            showMesageBoxDialog('Ժամկետի սկիզբը պետք է փոքր լինի վերջից', $scope, 'information');
            hideloading();
            return;
        }
        if ($scope.searchParams.DateFrom == null || $scope.searchParams.DateTo == null) {
            showMesageBoxDialog('Պահանջվող դաշտերը լրացված չեն ամբողջովին', $scope, 'information');
            hideloading();
            return;
        }
        else {
            var Data = cardDeliveryOrderService.DownloadCardDeliveryXMLs($scope.searchParams.DateFrom, $scope.searchParams.DateTo);
            Data.then(function (acc) {
                $scope.DownloadOrderXMLs = acc.data;
                hideloading();
                if ($scope.DownloadOrderXMLs.ResultCode == 4) {
                    var ErrorDescription = $scope.DownloadCardDeliveryXMLs.Errors[0].Description;
                    showMesageBoxDialog(ErrorDescription, $scope, 'information');
                } else {
                    showMesageBoxDialog('XML-ները բեռնված են', $scope, 'information');

                }
            }, function () {
                alert('Error DownloadCardDeliveryXMLs');
            })
        }
    };
}]);