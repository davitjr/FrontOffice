app.controller("FondOrderCtrl", ['$scope', 'fondOrderService', 'fondService', 'infoService', '$http', function ($scope, fondOrderService, fondService, infoService, $http) {
    $scope.filter = 1;
    $scope.$root.OpenMode = 14;

    $scope.initFondOrder = function () {
        $scope.fondOrder = {};  
        $scope.fondOrder.RegistrationDate = new Date();
        $scope.fondOrder.Fond = {};
        $scope.fondOrder.Type = 190;
        $scope.fondOrder.Fond.ProvidingDetails = [{}];

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

     $scope.saveFondOrder = function () {
         if ($http.pendingRequests.length == 0) {
             document.getElementById("fondOrderSaveLoad").classList.remove("hidden");
             var Data = fondOrderService.saveFondOrder($scope.fondOrder);
             Data.then(function (res) {
                 if (validate($scope, res.data)) {
                     document.getElementById("fondOrderSaveLoad").classList.add("hidden");
                     CloseBPDialog('newfondorder');
                     showMesageBoxDialog('Ֆոնդի մուտքագրումը կատարված է', $scope, 'information');
                     refresh(186);
                 }
                 else {
                     document.getElementById("fondOrderSaveLoad").classList.add("hidden");
                     showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                 }

             }, function (err) {
                 document.getElementById("fondOrderSaveLoad").classList.add("hidden");
                 if (err.status != 420) {
                     showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                 }
                 alert('Error saveFondOrder');
             });
         }

         else {
             return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
         }
     };

     $scope.addFondProvidingDetail = function () {
                $scope.fondOrder.Fond.ProvidingDetails.push({});
      }
    
     $scope.delete = function (index) {
         $scope.fondOrder.Fond.ProvidingDetails.splice(index, 1);
     }
    
     $scope.getFondOrder = function (orderId) {
         var Data = fondOrderService.getFondOrder(orderId);
         Data.then(function (acc) {
             $scope.orderDetails = acc.data;
         }, function () {
             alert('Error getFondOrder');
         });

     };
}]);