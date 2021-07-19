app.controller("hbTokenActivationOrderCtrl", ['$scope', '$location', 'dialogService', '$http', 'hbTokenActivationOrderSerivce', function ($scope, $location, dialogService, $http, hbTokenActivationOrderSerivce) {
    $scope.order = {};
    $scope.order.HBtoken = {};
    $scope.order.HBtoken.HBUser = {};
    $scope.order.Type = 137;

    $scope.order.SubType = 1;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
   

    $scope.saveHBTokenActivationOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("hbTokenActivationLoad").classList.remove("hidden");
            $scope.order.HBtoken.ID = $scope.selectedToken.ID;
            $scope.order.HBtoken.TokenNumber = $scope.selectedToken.TokenNumber;
            $scope.order.HBtoken.HBUser.UserName = $scope.selectedToken.HBUser.UserName;
            $scope.order.HBtoken.HBUser.UserFullName = $scope.selectedToken.HBUser.UserFullName;
            var Data = hbTokenActivationOrderSerivce.saveHBTokenTokenActivationOrder($scope.order);
        Data.then(function (result) {

            if (validate($scope, result.data)) {
                document.getElementById("hbTokenActivationLoad").classList.add("hidden");
                CloseBPDialog('hbtokenactivation');
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information'); 
                window.location.href = location.origin.toString() + '#/hbapplication';
            }
            else {
                document.getElementById("hbTokenActivationLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function (err) {
            document.getElementById("hbTokenActivationLoad").classList.add("hidden");
            if (err.status != 420)
            {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
            alert('Error saveHBTokenActivationOrder');
        });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getHBServletRequestTokenUnBlockOrder = function (orderId) {
        var Data = hbTokenActivationOrderSerivce.getHBServletRequestTokenUnBlockOrder(orderId);
        Data.then(function (result) {
            $scope.order = result.data;
        }, function () {
            alert('Error getHBApplicationOrder');
        });
    };

    
}]);