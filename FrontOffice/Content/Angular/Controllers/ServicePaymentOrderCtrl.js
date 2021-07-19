app.controller("ServicePaymentOrderCtrl", ['$scope', 'dialogService', 'servicePaymentOrderService','$http', function ($scope, dialogService, servicePaymentOrderService,$http) {

    $scope.checkBox = false;
    $scope.order = {};
    $scope.order.Currency = 'AMD';
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.setOrderType = function (debtType) {
        //var checkBox = document.getElementById('checkBox')
        if (debtType == 1)
            if ($scope.checkBox == false)
                $scope.order.Type = 58;
            else
                $scope.order.Type = 61;
        else if (debtType == 2)
            if ($scope.checkBox == false)
                $scope.order.Type = 59;
            else
                $scope.order.Type = 62;



    };
        
    $scope.seterror = function (error) {
        $scope.error = error;
    }
    //Հայտի պահպանում
    $scope.saveServicePaymentOrder = function () {
        if ($http.pendingRequests.length == 0) {


            document.getElementById("Loader").classList.remove("hidden");
            var Data = servicePaymentOrderService.saveServicePaymentOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("Loader").classList.add("hidden");
                    $scope.path = '#Orders';
                    CloseBPDialog('servicepaymentorder');
                    refresh($scope.order.Type);
                    showMesageBoxDialog( 'Գանձումը կատարված է', $scope, 'information');

                }
                else {
                    document.getElementById("Loader").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope,'error');
                    //$scope.seterror($scope.error);
                    //document.getElementById("Loader").classList.add("hidden");

                }
            }, function () {
                document.getElementById("Loader").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in savePayment');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.initDebitAccount = function() {
        var Data = servicePaymentOrderService.initDebitAccount($scope.order);
        Data.then(function(acc) {
                $scope.debitAccount = acc.data;
            },
            function() {
                alert('Error initDebitAccount');
            });
    };
}]);
