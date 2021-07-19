app.controller("CasherCtrl", ['$scope', 'casherService', '$rootScope','infoService', function ($scope, casherService, $rootScope,infoService) {

    $scope.getUserDescription = function () {

        var Data = casherService.getUserDescription();
        Data.then(function (descr) {
            $scope.userDescription = descr.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.getUserAccept = function () {

        var Data = casherService.getUserID();
        Data.then(function (user) {
            if (user.data == 2136 || user.data == 2137 || user.data == 1271 || user.data == 1270 || user.data == 114)
                $scope.useraccept = true;
            else
                $scope.useraccept = false;

        }, function () {
            alert('Error');
        });
    };


    $scope.getCasherDepartment = function () {
        var Data = casherService.getCasherDepartment();
        Data.then(function (department) {
            $scope.casherDepartment = department.data;
        }, function () {
            alert('Error');
        });

    };

    $scope.getCurrentUserPicture = function () {
        $rootScope.userPicture = "/Content/newTheme/Images/bluemanmxxl.png";
        var Data = casherService.getCurrentUserPicture();
        Data.then(function (dt) {
            var file = new Blob([dt.data], { type: 'image/jpeg' });
            if (file.size == 0) {
                var fileURL = "/Content/newTheme/Images/bluemanmxxl.png";
            }
            else {
                var fileURL = URL.createObjectURL(file);
            }

            $rootScope.userPicture = fileURL;
        }, function () {
            alert('Error');
        });

    };

    $scope.getUserPicture = function (setNumber) {
        $scope.userPicture = "/Content/newTheme/Images/bluemanmxxl.png";
        var Data = casherService.getUserPicture(setNumber);
        Data.then(function (dt) {
            var file = new Blob([dt.data], { type: 'image/jpeg' });
            file.size = 0;
            if (file.size == 0) {
                var fileURL = "/Content/newTheme/Images/bluemanmxxl.png";
            }
            else {
                var fileURL = URL.createObjectURL(file);
            }

            $scope.userPicture = fileURL;
        }, function () {
            alert('Error');
        });
    };

    $scope.getCashier = function (setNumber) {
        var Data = casherService.getCashier(setNumber);
        Data.then(function (c) {
            $scope.cashier = c.data;
        }, function () {
            alert('getCashier');
        });

    };


    $scope.logout = function () {


        var Data = infoService.isTestingMode();
        Data.then(function (res) {

            if ($scope.$root.SessionProperties != undefined && $scope.$root.SessionProperties.SourceType == 2 && $scope.$root.notificationCount > 0 && res.data==false) {
                ShowMessage('Առկա են չկատարված հայտեր: Խնդրում ենք ապահովել հայտերի կատարումը:', 'error');
                return;
            }
            $.ajax({ type: "POST", data: {}, dataType: "json", url: "../Login/LogOut" })
                .then(function (data) {
                    window.location = data.redirectUrl;
                }, function (error) {
                    console.log(error);
                });

        }, function () {

            alert('Error logout');
        });




       

    }


}]);