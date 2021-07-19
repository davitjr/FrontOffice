app.controller("UtilityOptionsCtrl", ['$scope', 'utilityOptionsService', 'infoService', 'utilityService', '$filter', '$http', '$rootScope', '$state', '$confirm', function ($scope, utilityOptionsService, infoService, utilityService, $filter, $http, $rootScope, $state, $confirm) {
    $rootScope.OpenMode = 15;

    $scope.filter = {
        StartDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        EndDate: new Date(),
        NumberOfSet: null,

    };

    $scope.getUtilityOptions = function () {
        $scope.loading = true;
        var Data = utilityOptionsService.getUtilityOptions($scope.filter);
        Data.then(function (list) {
            $scope.utiltyOptionsList = list.data;
        },
            function () {
                $scope.loading = false;
                alert('Error getUtilityOptions');
            });
    };

    $scope.getUtiltyForChange = function () {
        var Data = utilityOptionsService.getUtiltyForChange();
        Data.then(function (list) {
            $scope.utilityForChangeList = list.data;
        },
            function () {
                alert('Error getUtiltyForChange');
            });
    };

    $scope.getTypeOfCommunals = function () {
        var Data = infoService.getTypeOfCommunals();
        Data.then(function (types) {
            $scope.typeOfCommunals = types.data;
        }, function () {
            alert('Error getTypeOfCommunals');
        });
    };

    $scope.refreshUtilityOptions = function () {
        var refreshScope = angular.element(document.getElementById('UtilityOptions')).scope()
        if (refreshScope != undefined) {
            refreshScope.getUtilityOptions();
        }
    };



    $scope.saveUtilityOptions = function () {

        var Data = utilityOptionsService.getExistsNotSentAndSettledRows($scope.utilityForChangeList);
        Data.then(function (acc) {
            $scope.list = acc.data;
            if ($scope.list.length > 0) {

                $confirm({ title: 'Ուշադրություն!!!', text: 'Առկա են ' + $scope.list + ' ձևակերպված բայց բիլինգային համակարգ չուղարկված տողեր: Շարունակե՞լ' })
                    .then(function () {
                        var Data = utilityOptionsService.saveUtilityOptions($scope.utilityForChangeList);
                        Data.then(function (acc) {
                            ShowToaster('Պահպանումը կատարված է', 'success');
                            $scope.refreshUtilityOptions();
                            CloseBPDialog('newUtilityOptions');
                        }, function () {
                            alert('Error saveUtilityOptions');
                        });
                    });
            }
            else {
                var Data = utilityOptionsService.saveUtilityOptions($scope.utilityForChangeList);
                Data.then(function (acc) {
                    ShowToaster('Պահպանումը կատարված է', 'success');
                    $scope.refreshUtilityOptions();
                    CloseBPDialog('newUtilityOptions');
                }, function () {
                    alert('Error saveUtilityOptions');
                });

            }
        }, function () {
            alert('Error getExistsNotSentAndSettledRows');
        });




    };

    $scope.saveAllUtilityConfigurationsAndHistory = function (listq, a) {


        if (a == 0) {
            $scope.newList = [];
            for (var i = 0; i < $scope.utilityForChangeList.length; i++) {
                $scope.newList.push({
                    IsEnabled: false,
                    TypeID: $scope.utilityForChangeList[i].TypeID,
                });
            }

        }
        else {
            $scope.newList = [];
            $scope.newList = $scope.utilityForChangeList;
        }


        var Data = utilityOptionsService.getExistsNotSentAndSettledRows($scope.newList);
        Data.then(function (acc) {
            $scope.list = acc.data;

            if ($scope.list.length > 0) {
                $confirm({ title: 'Ուշադրություն!!!', text: 'Առկա են ' + $scope.list + ' ձևակերպված բայց բիլինգային համակարգ չուղարկված տողեր: Շարունակե՞լ' })
                    .then(function () {
                        var Data = utilityOptionsService.saveAllUtilityConfigurationsAndHistory(listq, a);
                        Data.then(function (acc) {
                            $scope.utilityOp = acc.data;
                            ShowToaster('Պահպանումը կատարված է', 'success');
                            CloseBPDialog('newUtilityOptions');
                            $scope.refreshUtilityOptions();
                        }, function () {
                            alert('Error saveAllUtilityConfigurations');
                        });

                    });
            }
            else {
                $confirm({ title: 'Ուշադրություն', text: 'Փոփոխել  բոլորը կարգավորումները:Շարունակե՞լ' })
                    .then(function () {
                        var Data = utilityOptionsService.saveAllUtilityConfigurationsAndHistory(listq, a);
                        Data.then(function (acc) {
                            $scope.utilityOp = acc.data;
                            ShowToaster('Պահպանումը կատարված է', 'success');
                            CloseBPDialog('newUtilityOptions');
                            $scope.refreshUtilityOptions();
                        }, function () {
                            alert('Error saveAllUtilityConfigurations');
                        });
                    });
            };


        });
    };




}]); 