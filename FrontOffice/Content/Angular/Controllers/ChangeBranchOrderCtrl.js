app.controller('ChangeBranchOrderCtrl', ['$scope', 'ChangeBranchOrderService', 'infoService', 'cardService', '$location', 'dialogService', '$uibModal', 'orderService', 'accountService', '$http', function ($scope, ChangeBranchOrderService, infoService, cardService, $location, dialogService, $uibModal, orderService, accountService, $http) {



    $scope.order = {};
    if ($scope.card != undefined)
        $scope.order.CardNumber = $scope.card.CardNumber;
    $scope.order.Card = $scope.card;
    // $scope.order.ProductId = $scope.card.ProductId


    $scope.saveChangeBranchOrder = function () {

        if ($http.pendingRequests.length == 0) {
            if ($scope.NewMovedFilial == '' || $scope.NewMovedFilial == undefined) {
                $scope.empty = true;
                return;
            }
            else
                if ($scope.NewMovedFilial != '' || $scope.NewMovedFilial != undefined) { $scope.empty = false; }

            if ($scope.NewMovedFilial.substring(0, 5) == $scope.Branch.Filial) {
                $scope.equal = true;
                return;
            }
            else ($scope.NewMovedFilial.substring(0, 5) != $scope.Branch.Filial)
            { $scope.equal = false; }

            document.getElementById("ChangeBranchOrderLoad").classList.remove("hidden");
            $scope.order.ProductId = $scope.Branch.ProductId;
            $scope.order.MovedFilial = +$scope.NewMovedFilial.substring(0, 5);
            $scope.order.CardNumber = +$scope.order.CardNumber;
            $scope.order.Filial = +$scope.Branch.Filial;


            var Data = ChangeBranchOrderService.saveChangeBranchOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("ChangeBranchOrderLoad").classList.add("hidden");
                    CloseBPDialog('changeBranch');
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                }
                else {
                    document.getElementById("ChangeBranchOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("ChangeBranchOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveAccount');
            });


        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };



    $scope.getChangeBranchOrder = function (ID) {
        var Data = ChangeBranchOrderService.getChangeBranchOrder(ID);
        Data.then(function (result) {
            $scope.order = result.data;

        }, function () {
            alert('Error getChangeBranchOrder');
        });
    };

    $scope.getCurrentBranch = function (ID) {
        var Data = ChangeBranchOrderService.getCurrentBranch(ID);
        Data.then(function (result) {
            $scope.Branch = result.data;

            if ($scope.Branch.ProductId == 0 || $scope.Branch.ProductId == '' || $scope.Branch.ProductId == null) {
                document.getElementById("ChangeBranchOrderLoad").classList.add("hidden");
                CloseBPDialog('changeBranch');
                showMesageBoxDialog('Քարտը փակված է !!!', $scope, 'information');
            }

        }, function () {
            alert('Error getCurrentBranch');
        });
    };



    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.FilialList = ref.data;
        }, function () {
            alert('Error FilialList');
        });
    };




    $scope.callbackgetChangeBranchOrder = function () {
        $scope.getChangeBranchOrder($scope.selectedOrderId);
    };


}]);