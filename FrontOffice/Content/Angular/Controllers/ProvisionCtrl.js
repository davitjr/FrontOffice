app.controller("ProvisionCtrl", ['$scope', 'provisionService', '$q', 'infoService', function ($scope, provisionService, $q, infoService) {
    $scope.filter = {};
    $scope.getProductProvisions = function (productId) {
        var Data = provisionService.getProductProvisions(productId);
        Data.then(function (acc) {
                $scope.provisions = acc.data;
        }, function () {
            $scope.loading = false;
            alert('Error getProductProvisions');
        });
    };

    $scope.setClickedRow = function (index) {
        $scope.selectedProvision = $scope.provisions[index];
    }


    $scope.getProvisionOwners = function (productId) {
        var Data = provisionService.getProvisionOwners(productId);
        Data.then(function (acc) {
            $scope.owners = acc.data;
        }, function () {
            $scope.loading = false;
            alert('Error getProvisionOwners');
        });
    };
 //function setProvisionLoans(loanIndex) {
 //  var DataLoans=provisionService.getProvisionLoans($scope.customerProvisions[k].Id);
 //               DataLoans.then(function(loans){
 //                   $scope.customerProvisions[k].loans = loans.data;
 //               })
 //   }
 //$scope.getCustomerProvisions = function (currency,type,quality) {
 //       var Data = provisionService.getCustomerProvisions(currency, type, quality);
 //       Data.then(function (acc) {
 //           $scope.customerProvisions = acc.data;
 //           for (var i = 0; i < $scope.customerProvisions.length; i++)            {
 //               setProvisionLoans(i)
 //           }
 //       }, function () {
 //           $scope.loading = false;
 //           alert('Error getCustomerProvisions');
 //       });
 //};

 $scope.getCustomerProvisions = function (currency, type, quality) {
     var promises = [];
     var Data = provisionService.getCustomerProvisions(currency, type, quality);
     Data.then(function (acc) {
         $scope.customerProvisions = acc.data;
         angular.forEach($scope.customerProvisions, function (item) {
             var deferred = $q.defer();
             provisionService.getProvisionLoans(item.Id).then(function (loans) {
                 deferred.resolve(loans);
             });
             promises.push(deferred.promise);
         });
         $q.all(promises).then(
             function (results) {
                 for (var i = 0; i < $scope.customerProvisions.length; i++)
                 {
                     $scope.customerProvisions[i].Loans = results[i].data;
                 }
             },
             // error
             function (response) {
             }
         );
     }, function () {
         $scope.loading = false;
         alert('Error getCustomerProvisions');
     });
 }


 $scope.getCurrencies = function () {
     var Data = infoService.getCurrencies();
     Data.then(function (rep) {
         $scope.currencies = rep.data;
     }, function () {
         alert('Error getSourceDescription');
     });
 };


 $scope.getProvisionTypes = function () {
     var Data = infoService.getProvisionTypes();
     Data.then(function (rep) {
         $scope.provisionTypes = rep.data;
                
     }, function () {
         alert('Error getProvisionTypes');
     });
 };
 $scope.qualityFilter = function () {
     $scope.getCustomerProvisions($scope.filter.currency, $scope.filter.provisionType, $scope.filter.provisionQuality);
 }
 $scope.filter.provisionQuality = "1";
 $scope.filter.currency ="AMD";
}]);