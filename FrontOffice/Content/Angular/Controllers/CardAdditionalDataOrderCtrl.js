app.controller("CardAdditionalDataOrderCtrl", ['$scope', '$rootScope', 'dialogService', 'CardAdditionalDataOrderService', 'customerService', 'infoService', 'dialogService', '$uibModal', '$http', '$filter', 'uiGridConstants', function ($scope, $rootScope, dialogService, CardAdditionalDataOrderService, customerService, infoService, dialogService, $uibModal, $http, $filter, uiGridConstants) {

    $scope.CardAdditionalDataOrder = {
        CardAdditionalData: {}
    };
    $scope.IsClosed = 0;


    $scope.gridOptions = {
        enableSorting: false,
        showHeader: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: true,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableSelectionBatchEvent: true,
        columnDefs: [{ name: 'ExtensionData', visible: false },
        { name: 'AdditionDescription', width: '60%' },
        { name: 'AdditionValue' },
        { name: 'SetNumber' },
        { name: 'CardAdditionalDataID' }]
    };


    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
    };

    $scope.GetCustomerPlasticCardsForAdditionalData = function () {
        $scope.loading = true;
        var Data = CardAdditionalDataOrderService.GetCustomerPlasticCardsForAdditionalData($scope.IsClosed);

        Data.then(function (card) {

            $scope.cards = card.data;
            $scope.loading = false;

        }, function () {
            $scope.loading = false;
            alert('Error GetCustomerPlasticCardsForAdditionalData');
        });
    };

    $scope.Filter = function () {
        $scope.clearFilters();
        const Data = CardAdditionalDataOrderService.GetCustomerPlasticCardsForAdditionalData($scope.IsClosed)
            .then(function (datas) {
                $scope.cards = datas.data;
                console.log(datas.data);
            }, function () {
                alert('Error Filter')
            })
    };


    $scope.deleteRow = function (row) {
        var index = $scope.gridOptions.data.indexOf(row.entity);
        $scope.gridOptions.data.splice(index, 1);
    };


    $scope.clearFilters = function () {

        const selectedNode = $scope.gridApi.grid.getVisibleRows();
        for (var i = 0; i < selectedNode.length; i++) {
            $scope.deleteRow(selectedNode[i]);
        }
        $scope.gridApi.core.refresh();
    };

    $scope.GetCardAdditionalDatas = function (CardNumber, ExpiryDate) {

        if (CardNumber == undefined && ExpiryDate == undefined) {
            return;
        }
        var Data = CardAdditionalDataOrderService.GetCardAdditionalDatas(CardNumber, ExpiryDate);

        Data.then(function (datas) {
            $scope.gridOptions.data = datas.data;
            if ($scope.gridApi != undefined) {
                $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
                $scope.gridApi.core.refresh();
            }
        }, function () {
            $scope.loading = false;
            alert('Error GetCardAdditionalDatas');
        });
    };

    $scope.AddCardAdditionalData = function () {

        if (document.getElementById("cardadditionaldataorder") != null) return;
        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };

        if ($scope.card != undefined) {
            $scope.params = {
                card: $scope.card,
                gridApi: $scope.gridApi,
                DocumentSubType: 1

            };
            dialogService.open('cardadditionaldataorder', $scope, 'Քարտի լրացուցիչ տվյալների մուտքագրման հայտ', '/CardAdditionalDataOrder/CardAdditionalDataOrder', dialogOptions, undefined, undefined, undefined);
        }
    }
    $scope.EditCardAdditionalData = function () {

        if (document.getElementById("cardadditionaldataorder") != null) return;
        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };

        if ($scope.gridApi.selection.getSelectedRows().length !== 0) {

            $scope.CardAdditionalDataOrder.CardAdditionalData = $scope.gridApi.selection.getSelectedRows()[0];
            $scope.params = {
                CardAdditionalDataOrder: {
                    CardAdditionalData: $scope.gridApi.selection.getSelectedRows()[0]
                },
                card: $scope.card,
                gridApi: $scope.gridApi,
                DocumentSubType: 2
            };
            dialogService.open('cardadditionaldataorder', $scope, 'Քարտի լրացուցիչ տվյալների խմբագրման հայտ', '/CardAdditionalDataOrder/CardAdditionalDataOrder', dialogOptions, undefined, undefined, undefined);
        }

    }

    $scope.RemoveCardAdditionalData = function () {

        if (document.getElementById("cardadditionaldataorder") != null) return;
        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };

        if ($scope.gridApi.selection.getSelectedRows().length !== 0) {

            $scope.CardAdditionalDataOrder.CardAdditionalData = $scope.gridApi.selection.getSelectedRows()[0];
            $scope.params = {
                CardAdditionalDataOrder: {
                    CardAdditionalData: $scope.gridApi.selection.getSelectedRows()[0]
                },
                card: $scope.card,
                gridApi: $scope.gridApi,
                DocumentSubType: 3
            };
            dialogService.open('cardadditionaldataorder', $scope, 'Քարտի լրացուցիչ տվյալների հեռացման հայտ', '/CardAdditionalDataOrder/CardAdditionalDataOrder', dialogOptions, undefined, undefined, undefined);
        }
    }
    $scope.GetCardAdditionalDataTypes = function () {

        var Data = infoService.GetCardAdditionalDataTypes($scope.$parent.card.CardNumber, $scope.$parent.card.ExpiryDate);
        $scope.additionaldatatypes = [];
        Data.then(function (datas) {

            for (var prop in datas.data) {
                var additionaltype = {};
                additionaltype.additionID = prop;
                additionaltype.additionDescription = datas.data[prop];
                $scope.additionaldatatypes.push(additionaltype);
            }
        }, function () {
            $scope.loading = false;
            alert('Error GetCardAdditionalDataTypes');
        });
    }

    $scope.setAdditionalValues = function () {

        var operday = new Date($rootScope.SessionProperties.OperationDate);

        $scope.CardAdditionalDataOrder.CardAdditionalData.AdditionValue = (operday.getDate().toString().length < 2 ? "0" + operday.getDate() : operday.getDate()) + "/" +
            ((operday.getMonth() + 1).toString().length < 2 ? "0" + (operday.getMonth() + 1) : operday.getMonth() + 1) + "/" +
            operday.getFullYear().toString().slice(2);

        $scope.CardAdditionalDataOrder.SubType = $scope.$parent.DocumentSubType,
            $scope.CardAdditionalDataOrder.PlasticCard = {
                ProductId: $scope.$parent.card.ProductId
            };
        if ($scope.$parent.DocumentSubType == 2 || $scope.$parent.DocumentSubType == 3) {
            $scope.CardAdditionalDataOrder.CardAdditionalData = $scope.$parent.CardAdditionalDataOrder.CardAdditionalData
        };
    };

    $scope.saveCardAdditionalDataOrder = function () {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("CardAdditionalDataOdrerLoad").classList.remove("hidden");

            var Data = CardAdditionalDataOrderService.saveCardAdditionalDataOrder($scope.CardAdditionalDataOrder);

            Data.then(function (res) {

                if (validate($scope, res.data)) {

                    document.getElementById("CardAdditionalDataListLoad").classList.add("hidden");
                    CloseBPDialog('cardadditionaldataorder');
                    ShowMessage('Հայտի մուտքագրումը կատարված է', 'bp-information');

                    $scope.GetCardAdditionalDatas($scope.card.CardNumber, $scope.card.ExpiryDate)

                }
                else {
                    document.getElementById("CardAdditionalDataOdrerLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                $scope.confirm = false;
                document.getElementById("CardAdditionalDataOdrerLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error in saveCardAdditionalDataOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.ShowHide = function () {

        $scope.IsVisible = true;

        if ($scope.gridApi.selection.getSelectedRows().length !== 0) {

            $scope.Data = $scope.gridApi.selection.getSelectedRows()[0];
            if ($scope.Data.AdditionID == 9 || $scope.Data.AdditionID == 10) {
                $scope.IsVisible = false;
            }
        }

    }, function () {
        alert('Error ShowHide');
    };


    $scope.getCardAdditionalDataOrderDetails = function (selectedID) {

        var Data = CardAdditionalDataOrderService.getCardAdditionalDataOrderDetails(selectedID);

        Data.then(function (AdditionalDetails) {
            $scope.order = AdditionalDetails.data;
        });
    }

}]);