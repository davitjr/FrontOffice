app.controller("CardDataChangeOrderCtrl", ['$scope', '$http', 'cardDataChangeOrderService', 'infoService', 'dateFilter', 'limitToFilter', 'uiGridConstants', function ($scope, $http, cardDataChangeOrderService, infoService, dateFilter, limitToFilter, uiGridConstants) {
    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.order.Type = 112;
    $scope.order.SubType = 1;

    if ($scope.isDate == true) {
        if ($scope.fieldValue != null && $scope.fieldValue != undefined) {
            $scope.order.FieldValue = angular.copy($scope.fieldValue);
            $scope.order.FieldValue = new Date(parseInt($scope.order.FieldValue.substr(6)));
            $scope.order.DateFieldValue = angular.copy($scope.order.FieldValue);
        }
    }
    else {
        $scope.order.FieldValue = angular.copy($scope.fieldValue);
    }

    if ($scope.fieldType != 20 && $scope.fieldType != 21)
        $scope.order.FieldType = $scope.fieldType;
    else
        $scope.order.FieldType = $scope.fieldType.toString();

    $scope.order.ProductAppId = $scope.productid;
    $scope.saveCardDataChangeOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.error = null;

            if ($scope.isDate) {
                $scope.order.FieldValue = dateFilter($scope.order.DateFieldValue, 'dd/MM/yy');
            }

            document.getElementById("cardDataChangeOrderLoad").classList.remove("hidden");
            var Data = cardDataChangeOrderService.saveCardDataChangeOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    $scope.path = '#Orders';
                    document.getElementById("cardDataChangeOrderLoad").classList.add("hidden");

                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('cardDataChangeOrder');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("cardDataChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("cardDataChangeOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveDepositCaseOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };


    $scope.getCardDataChangeFieldTypeDescription = function (type) {
        var Data = infoService.getCardDataChangeFieldTypeDescription(type);
        Data.then(function (acc) {
            $scope.fieldTypeDescription = acc.data;
        }, function () {
            alert('Error getCardDataChangeFieldTypeDescription');
        });
    };

    $scope.checkCardDataChangeOrderFieldTypeIsRequaried = function (type) {
        var Data = cardDataChangeOrderService.checkCardDataChangeOrderFieldTypeIsRequaried(type);
        Data.then(function (acc) {
            $scope.fieldTypeIsRequaried = acc.data;
        }, function () {
            alert('Error getCardDataChangeFieldTypeDescription');
        });
    };

    $scope.getCardRelatedOfficeName = function (relatedOfficeNumber) {
        var Data = infoService.getCardRelatedOfficeName(relatedOfficeNumber);
        Data.then(function (acc) {
            $scope.relOfficeDescription = acc.data;
        }, function () {
            alert('Error getCardRelatedOfficeName');
        });
    };

    $scope.searchRelatedOfficeTypes = function (relatedOfficeSearchParam) {

        return $http.get('/Info/SearchRelatedOfficeTypes', {
            params: {
                searchParam: relatedOfficeSearchParam
            }
        }).succes(function (response) {
            return limitToFilter(response.data, 10);
        });
    };

    $scope.onSelect = function ($item, $model, $label) {
        $scope.relOfficeDescription = $label;
    };


    $scope.getCardDataChangeOrder = function (OrderId) {
        var Data = cardDataChangeOrderService.getCardDataChangeOrder(OrderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error getCardDataChangeOrder');
        });
    };


    $scope.officeNumbers = {
        enableSorting: false,
        showHeader: true,
        enableRowSelection: false,
        enableRowHeaderSelection: false,
        multiSelect: false,
        modifierKeysToMultiSelect: false,
        noUnselect: true,
        enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
        enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
        columnDefs: [
            { field: 'FieldValue', displayName: 'Ծրագրի համար', width: 150, enableColumnMenu: false },
            { field: 'RegistrationDateString', displayName: 'Փոփոխման ամսաթիվ', width: 200, enableColumnMenu: false, cellFilter: 'CardDataChangeDate'},
            { field: 'user.userID', displayName: 'ՊԿ', enableSorting: false, width: 70, enableColumnMenu: false, cellFilter: 'PK' },
            { field: 'DocumentNumber', displayName: 'Պատճառ', widht: 500, enableColumnMenu: false }]
    };

    $scope.GetRelatedOfficeNumberChangeHistory = function () {

        var fieldType = $scope.$parent.fieldType;
        var productid = $scope.$parent.productid;

        if (fieldType == undefined || productid == undefined) {
            return;
        }

        var Data = cardDataChangeOrderService.GetRelatedOfficeNumberChangeHistory(productid, fieldType);

        Data.then(function (datas) {    
            $scope.officeNumbers.data = datas.data;

            if ($scope.gridApi != undefined) {
                $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
                $scope.gridApi.core.refresh();
            }
        }, function () {
            $scope.loading = false;
            alert('Error GetCardAdditionalDatas');
        });
    }

}]);

app.filter('PK', function () {
    return function (input) {
        if (input === 0) {
            return '';
        } else {
            return input;
        }
    }
}
);

app.filter('CardDataChangeDate', function () {
    return function (input) {
        if (input === "01/01/0001") {
            return '';
        } else {
            return input;
        }
    }
}
);


