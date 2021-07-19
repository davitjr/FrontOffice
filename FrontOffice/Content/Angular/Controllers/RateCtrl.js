app.controller("RateCtrl", ['$scope', '$interval', 'rateService', 'infoService', 'casherService', function ($scope, $interval, rateService, infoService, casherService) {

    $scope.searchParams = {};
    $scope.searchParams.StartDate = new Date().addDays(-10);
    $scope.getExchangeRates = function () {
        if (!$scope.cond || $scope.cond == undefined) {
            $scope.loading = true;
        }

        var Data = rateService.getExchangeRates();
        Data.then(function (descr) {
            $scope.loading = false;
            $scope.exchangeRates = descr.data;

        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };

    $scope.getFilialList = function () {


        var Data = casherService.getUserFilialCode();
        Data.then(function (filial) {

            $scope.userFilial = filial.data;
            Data = infoService.GetFilialList();
            Data.then(function (ref) {
                $scope.filialList = ref.data;
                $scope.searchParams.FilialCode = JSON.stringify($scope.userFilial);
                $scope.GetExchangeRatesHistory();
            }, function () {
                alert('Error getFilialList');
            });

        }, function () {
            alert('Error Get Filial');
        });

       
    };
    

    $scope.GetExchangeRatesHistory = function () {

        if (cbrate.checked == true) {
            $scope.GetCBExchangeRatesHistory();
            return;
        }

        if ($scope.searchParams.StartDate==undefined)
             return ShowMessage('Որոնման ա/թ-ն նշված չէ:', 'error');

        var Data = rateService.GetExchangeRatesHistory($scope.searchParams.FilialCode, $scope.searchParams.Currency, $scope.searchParams.StartDate);
        Data.then(function (exc) {
            $scope.exchangeRatesHistory = exc.data;
        }, function () {
            alert('Error');
        });
    };

    $scope.GetCBExchangeRatesHistory = function () {

        if (cbrate.checked == false)
        {
            $scope.GetExchangeRatesHistory();
            return;
        }
        if ($scope.searchParams.StartDate == undefined)
            return ShowMessage('Որոնման ա/թ-ն նշված չէ:', 'error');

        var Data = rateService.GetCBExchangeRatesHistory($scope.searchParams.Currency, $scope.searchParams.StartDate);
        Data.then(function (exc) {
            $scope.cbExchangeRatesHistory = exc.data;
        }, function () {
            alert('Error');
        });
    };

    $scope.GetCrossExchangeRatesHistory = function () {

    if($scope.searchParams.StartDate==undefined)
             return ShowMessage('Որոնման ա/թ-ն նշված չէ:', 'error');

        var Data = rateService.GetCrossExchangeRatesHistory($scope.searchParams.StartDate);
        Data.then(function (exc) {
            $scope.crossExchangeRatesHistory = exc.data;
        }, function () {
            alert('Error');
        });
    };

}]);
