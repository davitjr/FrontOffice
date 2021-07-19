app.controller("FondChangeOrderCtrl", ['$scope', 'fondService', 'fondChangeOrderService', 'infoService', '$http', function ($scope, fondService, fondChangeOrderService, infoService, $http) {

    $scope.initFondChangeOrder = function () {
        $scope.fondOrder = {};  
        $scope.fondOrder.RegistrationDate = new Date();
        $scope.fondOrder.Type = 192;
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

     $scope.getFondByID = function (id) {
         var Data = fondService.getFondByID(id);
         Data.then(function (fond) {
             $scope.fond = fond.data;
             for (var i = 0; i < $scope.fond.ProvidingDetails.length; i++) {
                 $scope.fond.ProvidingDetails[i].isDisable = true;
                 $scope.fond.ProvidingDetails[i].InterestRate = $scope.fond.ProvidingDetails[i].InterestRate * 100;
             }
         }, function () {
             alert('Error getFondByID');
         });
     };


     $scope.setFondProvidingTerminationDate = function (index) {
         var today = new Date();
         $scope.fond.ProvidingDetails[index].TerminationDate = today;
     };

     $scope.removeFondProvidingTerminationDate = function (index) {
         $scope.fond.ProvidingDetails[index].TerminationDate = undefined;
     };


    

     $scope.saveFondChangeOrder = function () {
         if ($http.pendingRequests.length == 0) {
             document.getElementById("fondChangeOrderSaveLoad").classList.remove("hidden");
            
             $scope.fondOrder.fond = $scope.fond;
             $scope.fond.ProvidingDetails = $scope.fond.ProvidingDetails;
             $scope.fond.isActive = $scope.fond.isActive;
             var Data = fondChangeOrderService.saveFondChangeOrder($scope.fondOrder);
             Data.then(function (res) {
                 if (validate($scope, res.data)) {
                     document.getElementById("fondChangeOrderSaveLoad").classList.add("hidden");
                     CloseBPDialog('fondchange');
                     showMesageBoxDialog('Ֆոնդի խմբագրումը կատարված է', $scope, 'information');
                     refresh(186);
                 }
                 else {
                     document.getElementById("fondChangeOrderSaveLoad").classList.add("hidden");
                     showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                 }

             }, function (err) {
                 document.getElementById("fondChangeOrderSaveLoad").classList.add("hidden");
                 if (err.status != 420) {
                     showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                 }
                 alert('Error saveFondChangeOrder');
             });
         }

         else {
             return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
         }
     };

     $scope.addFondProvidingDetail = function () {
         $scope.fond.ProvidingDetails.push({});
     };
    
     $scope.delete = function (index) {
         $scope.fond.ProvidingDetails.splice(index, 1);
     }
    
    

}]);