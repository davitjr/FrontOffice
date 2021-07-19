app.controller("ClassifiedLoanActionOrderCtrl", ['$scope', 'classifiedLoanService', 'paymentOrderService', 'loanService', '$location', 'dialogService', '$confirm', 'orderService', '$http',
    function ($scope, classifiedLoanService, paymentOrderService, loanService, $location, dialogService,   $confirm, orderService, $http) {

    $scope.getDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    $scope.order = {};
    $scope.order.Type = $scope.orderType;
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    if ($scope.product != undefined && $scope.product.Type == 54) {
        $scope.order.FeeAccount = $scope.product.ConnectAccount;
    }
        
    $scope.saveClassifiedLoanActionOrder = function () {
   
          $scope.order.SubType = 1;
        
        if ($http.pendingRequests.length == 0) {

            document.getElementById("classifiedLoanActionLoad").classList.remove("hidden");
            $scope.order.ProductId = $scope.$parent.productId; 
            $scope.order.ProductType = $scope.$parent.productType; 

            if ($scope.$parent.actionType == 1)//Դասակարգված վարկի դասի հեռացում
            {
                var Data = classifiedLoanService.saveLoanProductClassificationRemoveOrder($scope.order, $scope.includingSurcharge);
                $scope.order.Type = 171;
            }
            else if ($scope.$parent.actionType == 2)//Դասակարգված վարկի դուրսգրում
                {
                var Data = classifiedLoanService.saveLoanProductMakeOutOrder($scope.order,  $scope.includingSurcharge);
                    $scope.order.Type = 172;
                }
            else if ($scope.$parent.actionType == 3)//Արտաբալանսից հանում
            {
                var Data = classifiedLoanService.saveLoanProductMakeOutBalanceOrder($scope.order, $scope.includingSurcharge);
                    $scope.order.Type = 197;
            }
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                    CloseBPDialog('newClassifiedLoanActionOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'infromation');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function (err) {
                document.getElementById("classifiedLoanActionLoad").classList.add("hidden");

                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveClassifiedLoanActionOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    }
  

}])