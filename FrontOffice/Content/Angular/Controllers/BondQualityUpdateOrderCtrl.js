app.controller("BondQualityUpdateOrderCtrl", ['$scope','bondQualityUpdateOrderService', 'bondAmountChargeOrderService', '$rootScope', '$http','infoService',  function ($scope,bondQualityUpdateOrderService, bondAmountChargeOrderService, $rootScope, $http, infoService) {
 

       $scope.initBondQualityUpdateOrder = function (bondId) {
        $scope.order = {};  
        $scope.order.RegistrationDate = new Date();
        $scope.order.BondId = bondId;
		   $scope.order.SubType = $scope.subType;
		   $scope.order.Type = 189;
        if($scope.order.SubType == 3)
        {
            $scope.getBondRejectReasonTypes();
        }
    };

     $scope.saveBondQualityUpdateOrder = function () {
         if ($http.pendingRequests.length == 0) {          
		
             document.getElementById("bondQualityUpdateOrderLoad").classList.remove("hidden");

           
             var Data = bondQualityUpdateOrderService.saveBondQualityUpdateOrder($scope.order);

             Data.then(function (res) {
                 if (validate($scope, res.data)) {
                     document.getElementById("bondQualityUpdateOrderLoad").classList.add("hidden");
                     CloseBPDialog('newBondQualityUpdateOrder');
                  
                     showMesageBoxDialog('Պարտատոմսի կարգավիճակի փոփոխման հայտի մուտքագրումը կատարված է', $scope, 'information');
                     if (($scope.order.SubType == 2 || $scope.order.SubType == 3) && $rootScope.OpenMode == 13)
                     {
                         CloseBPDialog('oneBondDetails');

                         var refreshScope = angular.element(document.getElementById('BondDealing')).scope()
                         if (refreshScope != undefined) {                           
                             refreshScope.getBondsForDealing(refreshScope.filter);
                         }
                        
                     }
                     else
                     {
                         window.location.href = location.origin.toString() + '/#!/bonds';
                     }
                   
                     
                 }
                 else {
                     document.getElementById("bondQualityUpdateOrderLoad").classList.add("hidden");
                     showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                 }

             }, function (err) {
                 document.getElementById("bondQualityUpdateOrderLoad").classList.add("hidden");
                 if (err.status != 420) {
                     showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                 }
                 alert('Error saveBondQualityUpdateOrder');
             });
         }

         else {
             return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
         }
     };

     $scope.getBondQualityUpdateOrder = function (orderId) {
         var Data = bondQualityUpdateOrderService.getBondQualityUpdateOrder(orderId);
         Data.then(function (acc) {
             $scope.qualityUpdateOrderDetails = acc.data;
         }, function () {
             alert('Error getBondOrder');
         });

     };

     $scope.getBondRejectReasonTypes = function () {
         var Data = infoService.getBondRejectReasonTypes();
         Data.then(function (reasons) {
            
             $scope.reasons = reasons.data;

         }, function () {
             alert('Error getBondRejectReasonTypes');
         });
     };

}]);