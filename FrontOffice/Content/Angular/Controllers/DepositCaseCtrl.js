app.controller("DepositCaseCtrl", ['$scope', 'depositCaseService', 'infoService', 'casherService', 'depositCaseOrderService', '$http', '$confirm', 'customerService', '$state', 'orderService', 'ReportingApiService', function ($scope, depositCaseService, infoService, casherService, depositCaseOrderService, $http, $confirm, customerService, $state, orderService, ReportingApiService) {

    $scope.filter = 1;

     try {
         $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.isOnlineAcc = "0";
    }



    $scope.getDepositCases = function () {
        $scope.loading = true;
        var Data = depositCaseService.getDepositCases($scope.filter);
        Data.then(function (cases) {
            if ($scope.filter==1) {
                $scope.depositcases = cases.data;
                $scope.closedDepositCases = [];
            }
            else if ($scope.filter==2) {
                $scope.closedDepositCases = cases.data;
            }
            
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };

    $scope.getDepositCase = function (productId) {
        if ($scope.depositcase==null) {
            $scope.loading = true;
                    var Data = depositCaseService.getDepositCase(productId);
                    Data.then(function (depositcase) {
                        $scope.depositcase = depositcase.data;
                        $scope.loading = false;
                    }, function () {
                        $scope.loading = false;
                        alert('Error');
                    });
        }
        

    };
    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error FilialList');
        });
    };

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.selectedCaseNumber = $scope.depositcases[index].CaseNumber;
        $scope.selectedProductId = $scope.depositcases[index].ProductId;
        $scope.selectedRowClose = null;
        $scope.selectedDepositCase = angular.copy($scope.depositcases[index]);
    }
    $scope.setClickedRowClose = function (index) {
        $scope.selectedRowClose = index;
        $scope.selectedRow = null;
        $scope.selectedDepositCase = $scope.closedDepositCases[index];
    }

    $scope.QualityFilter = function () {

        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.selectedAccountNumber = null;
        $scope.getDepositCases();
    };

    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.userFilialCode =ref.data;
        }, function () {
            alert('Error FilialList');
        });
    };

    $scope.getDepositCaseContract = function (productId)
        {
            showloading();
            var Data = depositCaseOrderService.getDepositCaseContract(productId);
            ShowPDF(Data);
        };


    $scope.DepositCaseRemovalOrder = function () {
        $scope.showError = false;
       
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Հեռացնե՞լ պայմանագիրը:' })
                .then(function() {
                    showloading();
                    var Data = customerService.getAuthorizedCustomerNumber();
                    Data.then(function(descr) {
                        $scope.customerNumber = descr.data;
                        $scope.order = {};
                        $scope.order.Type = 100;
                        $scope.order.SubType = 1;
                        $scope.order.DepositCase = {};
                        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
                        $scope.order.DepositCase = angular.copy($scope.selectedDepositCase);
                        $scope.order.DepositCase.StartDate =
                            new Date(parseInt($scope.order.DepositCase.StartDate.substr(6)));
                        $scope.order.DepositCase.EndDate =
                            new Date(parseInt($scope.order.DepositCase.EndDate.substr(6)));
                        for (var i = 0; i < $scope.order.DepositCase.JointCustomers.length; i++) {
                            if ($scope.order.DepositCase.JointCustomers[i].key == $scope.customerNumber) {
                                $scope.order.DepositCase.JointCustomers.splice(i, 1);
                            }
                        }

                        var Data = depositCaseOrderService.saveDepositCaseOrder($scope.order);
                        Data.then(function(res) {
                                hideloading();
                                if (validate($scope, res.data)) {
                                    $scope.path = '#Orders';
                                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                                    refresh($scope.order.Type);
                                } else {
                                    hideloading();
                                    $scope.showError = true;
                                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                                }

                            },
                            function() {
                                hideloading();
                                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                                alert('Error saveAccount');
                            });
                    });
                });

        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.openDepositCaseDetails = function () {
         $state.go('depositCaseDetails', { productId: $scope.selectedProductId, depositCase: $scope.selectedDepositCase
     });
    };



      $scope.printOrder = function () {

              $scope.order = {};
              $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
              $scope.order.DepositCase = {};
          $scope.order.DepositCase = angular.copy($scope.selectedDepositCase);
              var Data = customerService.getAuthorizedCustomerNumber();
              Data.then(function (descr) {
                $scope.order.CustomerNumber = descr.data;
                var Data = orderService.generateNextOrderNumber($scope.order.CustomerNumber);
                Data.then(function (nmb) {
                    $scope.order.OrderNumber = nmb.data;
                     showloading();
                    var Data = depositCaseOrderService.printOrder($scope.order);
                    Data.then(function (response) {
                        var requestObj = { Parameters: response.data, ReportName: 81, ReportExportFormat: 1 }
                        ReportingApiService.getReport(requestObj, function (result) {
                            ShowPDFReport(result);
                        });
                    }, function () {
                        alert('Error printOrder');
                    });
               });

               });
         
        
    }
}]);