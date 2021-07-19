app.controller("FTPRateChangeOrderCtrl", ['$scope', 'FTPRateService', 'fondChangeOrderService', 'infoService', '$http', function ($scope, FTPRateService, fondChangeOrderService, infoService, $http) {

    $scope.initFTPRateChangeOrder = function () {
        $scope.FTPRateOrder = {};  
        $scope.FTPRateOrder.RegistrationDate = new Date();
        $scope.FTPRateOrder.Type = 205;
        $scope.FTPRate = null;
        //$scope.fondOrder.Fond.ProvidingDetails = [{}];

        //$scope.bondOrder.Bond.UnitPrice = 120;  //Հանել հետագայում
        };

     //Արժույթները
     $scope.getCurrentAccountCurrencies = function () {
         var Data = infoService.getCurrentAccountCurrencies();
         Data.then(function (acc) {
             $scope.currencies = acc.data;
         }, function () {
             alert('Currencies Error');
         });

     };

     $scope.getFTPRateDetails = function () {
         var Data = FTPRateService.getFTPRateDetails($scope.rateType);
         Data.then(function (FTPRate) {
             $scope.FTPRate = FTPRate.data;
             for (var i = 0; i < $scope.FTPRate.FTPRateDetails.length; i++) {
                 $scope.FTPRate.FTPRateDetails[i].isDisable = true;
                 $scope.FTPRate.FTPRateDetails[i].InterestRate = $scope.FTPRate.FTPRateDetails[i].InterestRate * 100;
             }
         }, function () {
             alert('Error getFTPRateDetails');
         });
     };


     //$scope.setFondProvidingTerminationDate = function (index) {
     //    var today = new Date();
     //    $scope.fond.ProvidingDetails[index].TerminationDate = today;
     //};

     //$scope.removeFondProvidingTerminationDate = function (index) {
     //    $scope.fond.ProvidingDetails[index].TerminationDate = undefined;
     //};


    
     $scope.saveFTPRateChangeOrder = function ()
     {
         if ($http.pendingRequests.length == 0)
         {
                document.getElementById("FTPRateChangeOrderSaveLoad").classList.remove("hidden");
            
                $scope.FTPRateOrder.FTPRate = $scope.FTPRate;
                var Data = FTPRateService.saveFTPRateChangeOrder($scope.FTPRateOrder);
                Data.then(function (res)
                {
                     if (validate($scope, res.data))
                     {
                         document.getElementById("FTPRateChangeOrderSaveLoad").classList.add("hidden");
                         CloseBPDialog('FTPRateorder');
                         showMesageBoxDialog('Տվյալների խմբագրումը կատարված է', $scope, 'information');
                         refresh(186);
                     }
                     else
                     {
                        document.getElementById("FTPRateChangeOrderSaveLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                     }

                },
                function (err)
                {
                    document.getElementById("FTPRateChangeOrderSaveLoad").classList.add("hidden");
                    if (err.status != 420)
                    {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error saveFTPRateChangeOrder');
                });
         }

         else
         {
             return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
         }
     };

     //$scope.addFondProvidingDetail = function () {
     //    debugger;
     //    $scope.fond.ProvidingDetails.push({});
     //};
    
     //$scope.delete = function (index) {
     //    $scope.fond.ProvidingDetails.splice(index, 1);
     //}

     $scope.getFTPRateOrder = function (orderId) {
         var Data = FTPRateService.getFTPRateOrder(orderId);
         Data.then(function (acc) {
             $scope.orderDetails = acc.data;
         }, function () {
             alert('Error getFTPRateOrder');
         });

     };
    
    

}]);