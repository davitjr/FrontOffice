app.controller("XBUserGroupCtrl", ['$scope', 'XBUserGroupService', 'infoService', '$location', 'dialogService', '$uibModal', 'customerService', 'orderService', '$filter', '$http', 'dateFilter', '$confirm', function ($scope, xBUserGroupService, infoService, $location, dialogService, $uibModal, customerService, orderService, $filter, $http, dateFilter, $confirm) {
    if ($scope.group == undefined) {
        $scope.group = {};
    }

    //Հասանելիության խմբի ավելացում
    $scope.saveXBUserGroup = function () {
       
        if ($http.pendingRequests.length == 0) {
            document.getElementById("xbUserGroupLoad").classList.remove("hidden");

           

            $scope.ApprovementSchema.SchemaDetails.push($scope.schemaDetails);
            sessionStorage.setItem("hbApprovementSchema", JSON.stringify($scope.ApprovementSchema));


            document.getElementById("xbUserGroupLoad").classList.add("hidden");
            CloseBPDialog('newxbusergroup');


            var refreshScope = angular.element(document.getElementById('XBUserGroups')).scope();
            if (refreshScope != undefined) {
                refreshScope.getXBUserGroups();

            }

            var refreshScope = angular.element(document.getElementById('hbApplicationdetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.isHBApplicationUpdated = true;
            }
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getXBUserGroupsFromDataBase = function () {
        var Data = xBUserGroupService.getXBUserGroups();
     
        Data.then(function (rep) {
            $scope.groups = rep.data;
            

            if ($scope.schemaDetails != undefined && $scope.schemaDetails.Group != undefined)
            {             
                for (var i = 0; i < $scope.groups.length; i++) {
                    if ($scope.groups[i].Id == $scope.schemaDetails.Group.Id) {
                        $scope.schemaDetails.Group = $scope.groups[i];
                    }
                }
            }

        }, function () {
            alert('Error getXBUserGroups');
        });
    };

    $scope.setClickedRow = function (index, group) {
        $scope.selectedRow = index;
        $scope.selectedGroup = group;
    };

    $scope.getXBUserGroups = function () {
       
        $scope.ApprovementSchema = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
    };

    //Հասանելիության խմբում օգտագործողների ավելացում/հեռացում
    $scope.setHBUsers = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("xbUsersSetLoad").classList.remove("hidden");


            var s = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));

            for (var i = 0; i < s.SchemaDetails.length; i++) {
                if (s.SchemaDetails[i].Group.Id == $scope.group.Id) {
                    s.SchemaDetails[i].Group.HBUsers = $scope.ChosenHBUsersList;
                    sessionStorage.setItem("hbApprovementSchema", JSON.stringify(s));
                    break;
                }
            }

            document.getElementById("xbUsersSetLoad").classList.add("hidden");
            CloseBPDialog('xbusersset');



            //$scope.$parent.$parent.isHBApplicationUpdated = true;

            var refreshScope = angular.element(document.getElementById('XBUserGroups')).scope();
            if (refreshScope != undefined) {
                refreshScope.getXBUserGroups();
            }

            var refreshScope = angular.element(document.getElementById('hbApplicationdetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.isHBApplicationUpdated = true;
            }
            
            
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    //Հասանելիության խմբի հեռացում
    $scope.XBUserGroupRemoval = function (group) {
        $scope.showError = false;
        $scope.getXBUserGroups();

        for (var i = 0; i < $scope.ApprovementSchema.SchemaDetails.length; i++) {
            if ($scope.ApprovementSchema.SchemaDetails[i].Group.Id == group.Id) {
                group = $scope.ApprovementSchema.SchemaDetails[i].Group;
                break;
            }
        }
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ հասանելիության խումբը:' })
            .then(function () {
            
               
                if (group.HBUsers == null || (group.HBUsers != null && group.HBUsers.length < 1)) {

                    var s = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
                
                    for (var i = 0; i < s.SchemaDetails.length; i++) {
                        if (s.SchemaDetails[i].Group.Id == group.Id) {
                            s.SchemaDetails.splice(i, 1);
                            sessionStorage.setItem("hbApprovementSchema", JSON.stringify(s));
                            break;
                        }
                    }



                    $scope.$parent.$parent.isHBApplicationUpdated = true;

                    var refreshScope = angular.element(document.getElementById('XBUserGroups')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.getXBUserGroups();

                    }

                    var refreshScope = angular.element(document.getElementById('hbApplicationdetails')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.isHBApplicationUpdated = true;
                    }
                }
                else
                {
                    showMesageBoxDialog('Նշված խմբում առկա են օգտագործեղներ։ Խումբը չի կարող հեռացվել։', $scope, 'information');
                }
             
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


    $scope.setGroupId = function () {
        $scope.error = [];
        var Data = infoService.getGlobalLastKeyNumber(75);
        Data.then(function(key) {

                if (key.data != 0 && key.data != null) {
                    $scope.group.Id = key.data;
                } else {
                    $scope.error.push({
                        Code: 1111,
                        Description: 'Հնարավոր չէ ստեղծել հաստատման խումբ։ Խնդրում ենք նորից փորձել։'
                    });
                }

            },
            function() {
                $scope.error.push({
                    Code: 1111,
                    Description: 'Հնարավոր չէ ստեղծել հաստատման խումբ։ Խնդրում ենք նորից փորձել'
                });
            });
    };

    $scope.createXBGroup = function () {

        if ($http.pendingRequests.length == 0) {

            $scope.ApprovementSchema = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
            $scope.setGroupId();

            var s = $scope.ApprovementSchema;
            var orderCounter = 1;
            $scope.schemaDetails = {};
            $scope.schemaDetails.Group = {};

            if ($scope.ApprovementSchema.SchemaDetails != null && $scope.ApprovementSchema.SchemaDetails.length > 0) {
                orderCounter = $scope.ApprovementSchema.SchemaDetails[$scope.ApprovementSchema.SchemaDetails.length - 1].Order + 1;
            }
            $scope.group.GroupName = "Խումբ " + orderCounter.toString();

            $scope.schemaDetails.Group = $scope.group;
            $scope.schemaDetails.Order = orderCounter;
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
                                           
     
    };

    $scope.getChosenHBUsers = function () {
        $scope.ChosenHBUsersList = [];

        $scope.getXBUserGroups();

        for (var i = 0; i < $scope.ApprovementSchema.SchemaDetails.length; i++) {
            if ($scope.ApprovementSchema.SchemaDetails[i].Group.Id == $scope.group.Id) {
                $scope.group = $scope.ApprovementSchema.SchemaDetails[i].Group;
                break;
            }
        }

        for (var i = 0; i < $scope.hbusers.length; i++) {
            for (var j = 0; j < $scope.group.HBUsers.length; j++) {
                if ($scope.hbusers[i].ID == $scope.group.HBUsers[j].ID) {
                    $scope.ChosenHBUsersList.push($scope.hbusers[i]);
                }
            }
        }
       
    };


    
}]);
