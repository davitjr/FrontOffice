angular.module('searchCashierControl', [])
.directive('searchcashier', ['infoService', function (infoService) {
    return {
        scope: {
            callback: '&',
            close: '&'
        },
        templateUrl: '../Content/Controls/SearchCashier.html',
        link: function (scope, element, attr) {
            $(".modal-dialog").draggable();
            scope.currentPage = 0;
            scope.numPerPage = 30;
            scope.maxSize = 1;
            scope.totalRows = 0;

            scope.selectCashier = function () {
                scope.callback({ cashier: scope.selectedCashier });
            };

            scope.closeSearchCashierModal = function () {
                scope.close();
            };

            scope.oneCashier = {
                setNumber: "",
                firstName: null,
                lastName: null,
                filial: { key: undefined, value: "" },
                position: "",
                blocked: 0
            };


        },
        controller:['$scope', '$element', function ($scope, $element) {

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
                $scope.selectedSetNumber = $scope.cashiersList[index].setNumber;
                $scope.selectedCashier = $scope.cashiersList[index];
            };

            $scope.$watch("currentPage", function () {
                if ($scope.currentPage != 0) {
                    $scope.findCashiers();
                }

            });

            $scope.btnFindClick = function () {

                if ($scope.currentPage == 1) {
                    $scope.findCashiers();
                }
                else {
                    $scope.currentPage = 1;
                }
            };


            $scope.findCashiers = function () {
                var customersURL = appConfig.customersURL;
                $.ajax({
                    url: customersURL + "/Cashier/SearchCashiersSharePoint",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: { searchParams: JSON.stringify($scope.paramsForSearch), page: $scope.currentPage },
                    xhrFields: {
                        withCredentials: false
                    },
                    success: function (response) {
                        $scope.cashiersList = response.rows;
                        $scope.totalRows = response.records;

                        if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                            $scope.$apply();
                        }

                        if (response.total > 5) {
                            $scope.maxSize = 5;
                        }
                        else {
                            $scope.maxSize = response.total;
                        }
                    }
                    , error: function (xhr) {
                        console.log("error");
                        console.log(xhr);
                    }
                });

                return false;
            }

            $scope.initParams = function () {
                $scope.paramsForSearch = {
                    setNumber: $scope.oneCashier.setNumber != "" ? $scope.oneCashier.setNumber : 0,
                    firstName: $scope.oneCashier.firstName,
                    lastName: $scope.oneCashier.lastName,
                    filial: { key: $scope.oneCashier.filial.key == undefined ? -1 : $scope.oneCashier.filial.key, value: $scope.oneCashier.filial.value },
                    position: $scope.oneCashier.position,
                    blocked: 0
                }
            }


            $scope.$watch('paramsForSearch', function () {
                if ($scope.paramsForSearch != undefined)
                    if ($scope.paramsForSearch.setNumber == 0 && ($scope.paramsForSearch.firstName == null || $scope.paramsForSearch.firstName == "") && ($scope.paramsForSearch.lastName == null || $scope.paramsForSearch.lastName == "") && $scope.paramsForSearch.filial.key == -1)
                        $scope.cashiersList = [];
                    else
                        $scope.btnFindClick();
                else
                    $scope.cashiersList = [];


            });
        }


        ]
    };
}]);


