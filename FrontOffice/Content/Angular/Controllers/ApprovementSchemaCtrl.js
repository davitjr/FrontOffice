app.controller("ApprovementSchemaCtrl", ['$scope', 'ApprovementSchemaService', 'infoService', '$location', 'dialogService', '$uibModal', 'customerService', 'orderService', '$filter', '$http', 'dateFilter', '$confirm', function ($scope, approvementSchemaService, infoService, $location, dialogService, $uibModal, customerService, orderService, $filter, $http, dateFilter, $confirm) {
    if ($scope.schema == undefined) {
        $scope.schema = {};
        $scope.schema.SchemaDetails = {};
      
    }

    $scope.getApprovementSchema = function () {
        var Data = approvementSchemaService.getApprovementSchema();
     
        Data.then(function (rep) {
        
            $scope.schema = rep.data;
        }, function () {
            alert('Error getApprovementSchema');
        });
    };


    //Հասանելիության խմբի ավելացում
    $scope.saveApprovementSchemaDetails = function () {

        if ($http.pendingRequests.length == 0) {
            document.getElementById("approvementSchemaDetailsLoad").classList.remove("hidden");
            var Data = approvementSchemaService.saveApprovementSchemaDetails($scope.schemaDetails, $scope.schema.Id);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("approvementSchemaDetailsLoad").classList.add("hidden");
                    CloseBPDialog('newapprovementschemadetails');
                    showMesageBoxDialog('Հաստատման սխեմայի քայլի ավելացումը կատարված է', $scope, 'information');

                    var refreshScope = angular.element(document.getElementById('ApprovementSchema')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.getApprovementSchema();

                    }
                }
                else {
                    document.getElementById("approvementSchemaDetailsLoad").classList.add("hidden");
                    $scope.dialogId = 'newapprovementschemadetails';
                    $scope.divId = 'ApprovementSchemaDetailsForm';
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("approvementSchemaDetailsLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveApprovementSchemaDetails');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.setClickedRow = function (index, schemaDetails) {
        $scope.selectedRow = index;
        $scope.selectedSchemaDetails = schemaDetails;
    };

    $scope.setXBUserGroup = function (group) {
        $scope.schemaDetails.Group = group;

    }

    $scope.ApprovementSchemaDetailsRemoval = function (schemaDetails) {
        $scope.showError = false;
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ հաստատման սխեմայի քայլը:' })
            .then(function () {

                var Data = approvementSchemaService.removeApprovementSchemaDetails(schemaDetails);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {

                        showMesageBoxDialog('Քայլի հեռացումը կատարված է', $scope, 'information');
                        var refreshScope = angular.element(document.getElementById('ApprovementSchema')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.getApprovementSchema();

                        }
                    }
                    else {
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error ApprovementSchemaDetailsRemoval');
                });
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

}]);