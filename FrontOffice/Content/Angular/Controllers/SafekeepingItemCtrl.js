app.controller("SafekeepingItemCtrl", ['$scope', 'SafekeepingItemService', 'infoService', '$confirm', 'customerService', '$uibModal', '$http', 'printDocumentsService', '$state',
    function ($scope, SafekeepingItemService, infoService, $confirm, customerService, $uibModal, $http, printDocumentsService, $state) {
        $scope.filter = 1;

        $scope.generateNewOrderNumber = function () {
            $scope.getOrderNumberType();
            var Data = orderService.generateNewOrderNumber($scope.orderNumberType);
            Data.then(function (nmb) {
                $scope.order.OrderNumber = nmb.data;
            }, function () {
                alert('Error generateNewOrderNumber');
            });
        };


        $scope.initSafekeepingItems = function () {
            $scope.loading = true;

            var Data = SafekeepingItemService.getSafekeepingItems($scope.filter);
            Data.then(function (acc) {

                if ($scope.filter == 1) {
                    $scope.safekeepingItems = acc.data;
                    $scope.closedSafekeepingItems = [];
                }
                else if ($scope.filter == 2) {
                    $scope.closedSafekeepingItems = acc.data;
                }
                $scope.setSafekeepingItemsScroll();
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                    alert('Error getSafekeepingItems');
            });
        };

        $scope.setClickedRow = function (index, obj) {
            $scope.selectedRow = index;
            $scope.selectedSafekeepingItem = obj;
        };

        $scope.getElementPosition = function (index) {
            var top = $('#safekeepingItemRow_' + index).position().top;
            //if (document.getElementById('accountflowdetails') != undefined)
            //    document.getElementById('accountflowdetails').setAttribute("style", "margin-top:" + (top + 60).toString() + "px; width: 350px !important;");
        };

        $scope.openSafekeepingItemDetails = function () {
            $state.go('safekeepingItemDetails', { productId: $scope.selectedSafekeepingItem.ProductId });
        };

        $scope.setSafekeepingItemsScroll = function () {
            $("#safekeepingItemsContent").mCustomScrollbar({
                theme: "rounded-dark",
                scrollButtons: {
                    scrollAmount: 200,
                    enable: true
                },
                mouseWheel: {
                    scrollAmount: 200
                }
            });
        };

        $scope.QualityFilter = function () {
            $scope.closingAccounts = [];

            $scope.selectedRow = null;
            $scope.selectedRowClose = null;
            $scope.selectedSafekeepingItem = null;

            $scope.initSafekeepingItems();
        };

        $scope.getFilialList = function () {
            var Data = infoService.GetFilialList();
            Data.then(function (ref) {
                $scope.filialList = ref.data;
               // $scope.filialDescription = $scope.filialList[$scope.safekeepingItem.FilialCode];
            }, function () {
                alert('Error getFilialList');
            });
        };

        $scope.initSafekeepingItem = function () {
            $scope.loading = true;

            var Data = SafekeepingItemService.getSafekeepingItem($scope.productId);
            Data.then(function (acc) {
                $scope.safekeepingItem = acc.data;
               // $scope.getFilialList();
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                    alert('Error getSafekeepingItem');
            });
        };


        $scope.initSafekeepingItemDescription = function () {
            var setPerson = null;
            if ($scope.order.SetPerson != undefined) {
                setPerson = $scope.order.SetPerson
            }
            $scope.loading = true;
            var Data = SafekeepingItemService.getSafekeepingItemDescription(setPerson);
            Data.then(function (acc) {
                $scope.order.SafekeepingItem.Description = acc.data;
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                    alert('Error getSafekeepingItemDescription');
            });
        };
}]);