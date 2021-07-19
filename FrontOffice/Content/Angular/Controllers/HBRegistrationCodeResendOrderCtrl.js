app.controller("hbRegistrationCodeResendOrderCtrl", ['$scope', '$location', 'dialogService', '$http', 'hbTokenService', function ($scope, $location, dialogService, $http, hbTokenService) {
    $scope.order = {};
    $scope.order.Token = {};
    $scope.order.SubType = 1;
    $scope.order.Type = 157;    
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Token.TokenNumber = $scope.selectedToken.TokenNumber;
    $scope.order.Token.TokenType = $scope.selectedToken.TokenType;
    $scope.order.Token.ID = $scope.selectedToken.ID;
    $scope.order.Token.HBUserID = $scope.selectedToken.HBUserID;
    $scope.order.Token.Quality = $scope.selectedToken.Quality;
    $scope.order.Token.HBUser = $scope.selectedToken.HBUser;
    

    $scope.closeDialog = function () {
        CloseBPDialog('hbRegistrationCodeResend');
    }

    $scope.saveHBRegistrationCodeResendOrder = function () {
        if ($http.pendingRequests.length == 0) {
            document.getElementById("hbRegistrationCodeResendLoad").classList.remove("hidden");
             
              var Data = hbTokenService.saveHBRegistrationCodeResendOrder($scope.order);
             
            Data.then(function (result) {
                if (validate($scope, result.data)) {
                    //
                    document.getElementById("hbRegistrationCodeResendLoad").classList.add("hidden");
                    $scope.closeDialog();
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                }
                else {
                    document.getElementById("hbRegistrationCodeResendLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                document.getElementById("hbRegistrationCodeResendLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveHBRegistrationCodeResendOrder');
            });
        } else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };
}]);