app.controller("CreditHereAndNowActivationOrdersCtrl", ['$scope', 'infoService', 'creditHereAndNowService', '$uibModal', 'customerService', '$confirm', '$http', 
    function ($scope, infoService, creditHereAndNowService, $uibModal, customerService, $confirm, $http) {
  
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.PreOrderType = 1; 
                
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
     
        $scope.saveCreditHereAndNowActivationOrders = function () {
            
            if ($scope.$parent.credits.length <= 0)
                return;           
            
            document.getElementById("creditHereAndNowLoad").classList.remove("hidden");
            $scope.duplicateCredits = {};
            $scope.duplicateCredits.lenght = 0;
            if ($http.pendingRequests.length == 0) {
                
                if ($scope.duplicateCredits.lenght > 0) {
                    messageText = 'Նախնական հայտի ձևավորման ընթացքում հայտնաբերվել են վարկերի, որոնք արդեն ընդգրկվել են մեկ այլ նախնական հայտի ակտիվացման ենթակա վարկերի ցանկում: Շարունակելու դեպքում նշված վարկերը չեն ընդգրկվի տվյալ նախնական հայտում: ';

                    $confirm({ title: 'Շարունակե՞լ', text: messageText })
                        .then($scope.save());
                }
                else
                {
                    $scope.save();
                }                
            }
            else {
                document.getElementById("creditHereAndNowLoad").classList.add("hidden");
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
            
        }
        $scope.save = function () {
             
            $scope.initCreditHereAndNowActivationDetails();

            var Data = creditHereAndNowService.saveCreditHereAndNowActivationPreOrder($scope.order);
            Data.then(function (res) {
                $scope.order.PreOrderID = res.data.Id;
                if (validate($scope, res.data)) {
                    switch ($scope.ResultCode) {
                        case 0:
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            break;
                        case 1:
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            $scope.approve();
                            break;
                    }

                }
                else {
                    document.getElementById("creditHereAndNowLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("creditHereAndNowLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveCreditHereAndNowPreOrder save');
                });
//            document.getElementById("creditHereAndNowLoad").classList.add("hidden");
        }
        $scope.initCreditHereAndNowActivationDetails = function () {
            $scope.order.CreditHereAndNowActivationDetails = $scope.$parent.credits;
            for (var i = 0; i < $scope.$parent.credits.length; i++) {
                $scope.order.CreditHereAndNowActivationDetails[i].AppID = $scope.$parent.credits[i].ProductId;
            }
        }

        $scope.approve = function () {
            
            var Data = creditHereAndNowService.approveCreditHereAndNowActivationPreOrder($scope.order.PreOrderID);
            Data.then(function (res) {

                if (validateResultList($scope, res.data)) {
                    
                    $scope.ResultCode = 8;
                    CloseBPDialog('CreditHereAndNowActivationOrders');
                    showMesageBoxDialog('Հայտերը ձևավորվել և կատարվել են', $scope, 'error'); 

                    $("#creditsHereAndNow_tab").removeClass("active");
                    $("#preOrders_tab").addClass("active");
                    $("#creditTab").removeClass("active");
                    $("#preorderTab").addClass("active");

                    refreshByPreOrderType($scope.order.PreOrderType);
                    
                }
                else {
                    document.getElementById("creditHereAndNowLoad").classList.add("hidden");
                    $scope.ResultCode = 10;
                    showMesageBoxDialog('Գոյություն ունեն չձևավորված կամ ձևավորված,բայց չկատարված հայտեր', $scope, 'error');

                    refreshByPreOrderType($scope.order.PreOrderType);

                }

            }, function () {
                document.getElementById("creditHereAndNowLoad").classList.add("hidden");
                $scope.ResultCode = 2;
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveCreditHereAndNowPreOrder approve');
            });
        }
        $scope.closeDialog = function () {
            CloseBPDialog('CreditHereAndNowActivationOrders');
        }

        $scope.resetIncompletePreOrderDetailQuality = function () {
            $confirm({ title: 'Հեռացնե՞լ', text: 'Հեռացնե՞լ նախորդ խմբաքանակի բոլոր չձևավորված հայտերը' })
                .then(function () {
                    showloading();
                    var Data = creditHereAndNowService.resetIncompletePreOrderDetailQuality();
                    Data.then(function () {
                        showMesageBoxDialog('Հեռացված է', $scope, 'information');
                        hideloading();
                    }, function () {
                        hideloading();
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error resetIncompletePreOrderDetailQuality');
                    });
                });
        };

        $scope.getIncompletePreOrdersCount = function () {
            var Data = creditHereAndNowService.getIncompletePreOrdersCount();
            Data.then(function (orders) {
                $scope.incompletePreOrdersCount = orders.data;

            }, function () {
                alert('Error getIncompletePreOrdersCount');
            });
        };

        setInterval(function () {
            $scope.getIncompletePreOrdersCount();
        }, 10000);
        
    }]);