app.controller("EmployeePersonalPageCtrl", ['$scope', 'employeePersonalPageService',function ($scope,  employeePersonalPageService) {
        $scope.documentSignatureSetting = {};
        $scope.documentSignatureSetting.RegistartionDate = new Date();


        $scope.saveBranchDocumentSignatureSetting = function () {
            showloading();
            $scope.error = null;
            var Data = employeePersonalPageService.saveBranchDocumentSignatureSetting($scope.documentSignatureSetting);
            Data.then(function (res) {
                    hideloading();
                if (validate($scope, res.data)) {
                    CloseBPDialog('documentSignatureSetting');
                }
                else {
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }
                , function () {
                    hideloading();
                    alert('Error in saveBranchDocumentSignatureSetting');
                });
        }

        $scope.getBranchDocumentSignatureSetting = function () {
            var Data = employeePersonalPageService.getBranchDocumentSignatureSetting();
            Data.then(function (acc) {
                $scope.documentSignatureSetting = acc.data;
                $scope.documentSignatureSetting.RegistartionDate = new Date();
                //$scope.documentSignatureSetting.SignatureType = $scope.documentSignatureSetting.SignatureType.toString();
            });
        };



    }]);