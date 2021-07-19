app.controller("PensionApplicationCtrl", ['$scope', 'pensionApplicationService', '$http', '$confirm', 'pensionApplicationOrderService', function ($scope, pensionApplicationService, $http, $confirm, pensionApplicationOrderService) {
    $scope.filter = 1;
    $scope.getPensionApplicationHistory = function () {
        var Data = pensionApplicationService.getPensionApplicationHistory($scope.filter);
        Data.then(function (historys) {

            if ($scope.filter == 1)
            {
                $scope.pensionApplicationHistorys = historys.data;
                $scope.closedpensionApplicationHistorys = [];
            }
            else if ($scope.filter == 2)
            {
                $scope.closedpensionApplicationHistorys = historys.data;
            }
            
        }, function () {
            alert('Error getPensionApplicationHistory');
        });
    };


    $scope.QualityFilter = function () {

        $scope.closedpensionApplicationHistorys = [];
        $scope.selectedRow = null;
        $scope.getPensionApplicationHistory();
    };


    $scope.setClickedRow = function (index, pensionApplication) {
        $scope.selectedRow = index;
        $scope.pensionApplication = pensionApplication;

    };

    $scope.PensionApplicationRemovalOrder = function () {
        $scope.showError = false;
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ դիմումը:' })
            .then(function () {
                $scope.order = {};
                $scope.order.Type = 92;
                $scope.order.SubType = 1;
                $scope.order.PensionApplication = {};
                $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
                    $scope.order.PensionApplication = angular.copy($scope.pensionApplication);
                var Data = pensionApplicationOrderService.savePensionApplicationOrder($scope.order);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        $scope.path = '#Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh($scope.order.Type);
                    }
                    else {
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveAccount');
                });
             });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.accountNoticeForm = function (accountNumber) {
        showloading();
        accountNumber = '( ' + accountNumber + ' )';
        var Data = pensionApplicationService.accountNoticeForm(accountNumber);
        ShowPDF(Data);
    };

    $scope.pensionCloseApplicationContract = function (contractId) {
        showloading();
        var Data = pensionApplicationService.pensionCloseApplicationContract(contractId);
        ShowPDF(Data);
    };

   

    
}]);