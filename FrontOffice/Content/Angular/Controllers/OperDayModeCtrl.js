app.controller("OperDayModeCtrl", ['$scope', '$confirm', 'infoService', '$filter', '$http', '$rootScope', '$state', 'operDayModeService',
    function ($scope, $confirm, infoService, $filter, $http, $rootScope, $state, operDayModeService) {

        $rootScope.OpenMode = 15;
        $scope.mode24_7History = [];
        $scope.getModeType = [];

        $scope.filter = {
            StartDate: new Date(),
            EndDate: new Date(),
            SetNumber: "",
            Option: 99
        };


        $scope.getOperDayModeHistory = function () {
            $scope.loading = true;
            if ($scope.filter.Option == null || $scope.filter.Option == undefined) {
                $scope.filter.Option = 99;
            }
            var Data = operDayModeService.getOperDayModeHistory($scope.filter);
            Data.then(function (operDayModes) {
                if ($scope.filter.Option == 99 || $scope.filter.Option == undefined) {
                    $scope.filter.Option = null
                }
                $scope.mode24_7History = operDayModes.data;
                $scope.operDayModeDate = operDayModes.operDayModeDate;
            },
                function () {
                    $scope.loading = false;
                    alert('Error getOperDayModeHistory');
                });
        };

        $scope.getCurrentOperDay24_7_Mode = function () {
            var Data = operDayModeService.getCurrentOperDay24_7_Mode();
            Data.then(function (operDayModes) {
                var a = operDayModes.data;
                $scope.mode24_7 = a.value;
                $scope.mode24_7key = a.key;
                $scope.filter.SaveModeType = a;
            },
                function () {
                    alert('Error getCurrentOperDay24_7_Mode');
                });
        };

        $scope.getTypeOf24_7Modes = function () {
            var Data = infoService.getTypeOf24_7Modes();
            Data.then(function (options) {
                $scope.operDayModes = options.data;
                $scope.filter.Option = null;
                $scope.getCurrentOperDay24_7_Mode();
            }, function () {
                alert('Error GetTypeOf24_7Modes');
            });
        };

        $scope.saveOperDayMode = function () {
            $scope.filter.Option = $scope.mode24_7key;
            var Data = operDayModeService.saveOperDayMode($scope.filter);

            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("operDayModeSaveLoad").classList.add("hidden");
                    showMesageBoxDialog('Պահպանումը կատարված է', $scope, 'information');
                    CloseBPDialog('newOperDayMode');
                    ShowToaster('Պահպանումը կատարված է', 'success');
                    $scope.getOperDayModeHistory();
                    $scope.getTypeOf24_7Modes();
                }
                else {
                    document.getElementById("operDayModeSaveLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function (err) {
                document.getElementById("operDayModeSaveLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveBondIssue');
            });
        };

        $scope.getOperDayModeList = function () {
            $scope.loading = true;
            var Data = operDayOptionsService.saveOperDayMode($scope.filter);
            Data.then(function (getOperDayModeList) {
                $scope.getOperDayModeList = getOperDayModeList.data;
            },
                function () {
                    $scope.loading = false;
                    alert('Error getOperDayModeList');
                });
        };

    }]);