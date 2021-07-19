app.controller("ClassifiedLoanActionOrdersCtrl", ['$scope', 'infoService', 'classifiedLoanService', 'customerService', '$confirm', '$http',
     function ($scope, infoService, classifiedLoanService, customerService, $confirm, $http) {
  
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        //$scope.order.PreOrderType = 1; 
                
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

        $scope.initPreOrder = function (poType) {
            $scope.order.PreOrderType = poType;
            if (poType == 2) {
                $scope.order.ActionType = 1;
            }
            else
                if (poType == 3)
                {
                    $scope.order.ActionType = 2;
                }
        }
        $scope.saveClassifiedLoanActionPreOrder = function () {
            //document.getElementById("classifiedLoanActionLoad").classList.remove("hidden");

            if ($http.pendingRequests.length == 0) {

                $scope.save();
                                
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
            
        }
        $scope.save = function () {
            if ($scope.$parent.loans.length <= 0)
                return;

            document.getElementById("classifiedLoanActionLoad").classList.remove("hidden");
            $scope.initClassifiedLoanDetails();

            var Data = classifiedLoanService.saveClassifiedLoanActionPreOrder($scope.order);
            Data.then(function (res) {
                $scope.order.PreOrderID = res.data.Id;
                if (validate($scope, res.data)) {
                    switch ($scope.ResultCode) {
                        case 0:
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                            break;
                        case 1:
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            $scope.approve();
                            break;
                    }

                }
                else {
                    document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveClassifiedLoanActionOrders save');
                });
                //document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
        }

        $scope.initClassifiedLoanDetails = function () {
            $scope.order.ClassifiedLoanActionDetails = [];
            for (var i = 0; i < $scope.$parent.loans.length; i++) {
                $scope.order.ClassifiedLoanActionDetails[i] = {};
                $scope.order.ClassifiedLoanActionDetails[i].AppID = $scope.$parent.loans[i].ProductId;
                $scope.order.ClassifiedLoanActionDetails[i].CustomerNumber = $scope.$parent.loans[i].CustomerNumber;
                $scope.order.ClassifiedLoanActionDetails[i].ProductType = $scope.$parent.loans[i].ProductType;
            }
        }

        $scope.approve = function () {
             
            var Data = classifiedLoanService.approveClassifiedLoanActionPreOrder($scope.order.PreOrderID, $scope.order.PreOrderType);
            Data.then(function (res) {

                if (validateResultList($scope, res.data)) {
                    
                    $scope.ResultCode = 8;
                    CloseBPDialog('ClassifiedLoanActionOrders');
                    showMesageBoxDialog('Հայտերը ձևավորվել և կատարվել են', $scope, 'error'); 
                    
                    $("#creditsHereAndNow_tab").removeClass("active");
                    $("#preOrders_tab").addClass("active");
                    $("#creditTab").removeClass("active");
                    $("#preorderTab").addClass("active");

                    refreshByPreOrderType($scope.order.PreOrderType);
                    
                }
                else {
                    document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                    $scope.ResultCode = 10;
                    showMesageBoxDialog('Գոյություն ունեն չձևավորված կամ ձևավորված,բայց չկատարված հայտեր', $scope, 'error');

                    refreshByPreOrderType($scope.order.PreOrderType);

                }

            }, function () {
                document.getElementById("classifiedLoanActionLoad").classList.add("hidden");
                $scope.ResultCode = 2;
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveClassifiedLoanActionOrders approve');
            });
        }
        $scope.closeDialog = function () {
            CloseBPDialog('ClassifiedLoanActionOrders');
            CloseBPDialog('newClassifiedLoanActionOrder');
        } 
        
    }]);