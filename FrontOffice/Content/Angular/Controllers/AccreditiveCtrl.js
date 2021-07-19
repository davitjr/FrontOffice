app.controller("AccreditiveCtrl", ['$scope', 'accreditiveService', '$state', '$confirm', '$http', function ($scope, accreditiveService, $state, $confirm, $http) {

    $scope.filter = 1;
    try {
        $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.isOnlineAcc = "0";
    }
    $scope.percentCummulation = [];
    $scope.percentCummulation[0] = "Նախնական գանձում";
    $scope.percentCummulation[1] = "Կուտակում";
    //To Get All Records  
    $scope.getAccreditives = function () {
        $scope.loading = true;
        var Data = accreditiveService.getAccreditives($scope.filter);
        Data.then(function (accr) {
            if ($scope.filter == 1) {
                $scope.accreditives = accr.data;
                $scope.closingAccreditives = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingAccreditives = accr.data;
            }

            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error getAccreditives');
        });
    };

    $scope.getAccreditive = function (productId) {
        if ($scope.accreditive==null) {
            $scope.loading = true;
            var Data = accreditiveService.getAccreditive(productId);
                    Data.then(function (accr) {
                        $scope.accreditive = accr.data;


                        $scope.loading = false;

                    }, function () {
                        $scope.loading = false;
                        alert('Error getAccreditive');
                    });
        }
        
    };

    $scope.setClickedRow = function (index,accreditive) {
        $scope.selectedRow = index;
        $scope.selectedProductId = $scope.accreditives[index].ProductId;
        $scope.params = { selectedAccreditive: $scope.accreditives[index] };
        $scope.selectedAccreditive = accreditive;
        $scope.selectedRowClose = null;
        $scope.selectedAccreditiveIsAccessible = $scope.accreditives[index].isAccessible;

    };

    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedClosedAccreditive = $scope.closingAccreditives[index];
        $scope.selectedAccreditiveIsAccessible = $scope.closingAccreditives[index].isAccessible;
    };

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getAccreditives();
    };

    $scope.openAccreditiveDetails = function () {
        $state.go('accreditiveDetails', { productId: $scope.selectedProductId, closedAccreditive: $scope.selectedClosedAccreditive });
    };

    $scope.saveAccreditiveTerminationOrder = function (productId) {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Դադարեցնե՞լ տվյալ ակրեդիտիվը:' })
             .then(function () {
                 showloading();
                 var Data = accreditiveService.saveAccreditiveTerminationOrder(productId);
                 Data.then(function (res) {
                     hideloading();
                     if (validate($scope, res.data)) {
                         $scope.path = '#Orders';
                         showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                         refresh(156);
                     }
                     else {
                         $scope.showError = true;
                         showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                     }

                 }, function () {
                     hideloading();
                     showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                     alert('Error saveFactoringTerminationOrder');
                 });
             });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };
    $scope.callbackgetAccreditive = function () {
        $scope.accreditive = null;
        $scope.getAccreditive($scope.productId);
    }
}])