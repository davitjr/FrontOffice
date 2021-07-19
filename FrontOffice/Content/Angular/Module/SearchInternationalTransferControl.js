angular.module('SearchInternationalTransferControl', [])
.directive('searchinternationaltransfer', [function () {
    return {
        scope: {
            callback: '&',
            close: '&',
            accnumber:'=?'
        },
        templateUrl: '../Content/Controls/SearchInternationalTransfer.html',
        link: function (scope, element, attr) {
            $(".modal-dialog").draggable();
            scope.internationalTransfersList = [];
            scope.currentPage = 0;
            scope.numPerPage = 20;
            scope.maxSize = 1;
            scope.totalRows = 0;

            scope.selectInternationalTransfer = function () {
                scope.callback({ internationalTransfer: scope.internationalTransfersList[scope.selectedRow] });
            };

            scope.closeInternationalTransfersModal = function () {
                scope.close();
            };

            scope.searchParams = {
                DateOfTransfer: "",
                SenderName: "",
                SenderAccNumber:scope.accnumber,
                ReceiverName: "",
                BeginRow:  1,
                EndRow:  20
            };

        },
        controller:['$scope', '$element', 'dateFilter', function ($scope, $element, dateFilter) {

                    $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
                $scope.selectedTransferID = $scope.internationalTransfersList[index].TransferID;
            };

            $scope.$watch("currentPage", function () {

                $scope.goToPage();

            });

            $scope.goToPage = function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredInternationalTransfers = $scope.internationalTransfersList.slice(begin, end);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
                else {
                    $scope.filteredInternationalTransfers = {};
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            }

            $scope.btnFindClick = function () {
                $scope.currentPage = 1;
                $scope.totalRows = 0;
                $scope.findInternationalTransfers();
            };



            $scope.$watch('currentPage', function (newValue, oldValue) {
                if (newValue != oldValue && oldValue != 0)
                {
                    $scope.searchParams.BeginRow = (newValue - 1) * $scope.numPerPage + 1;
                    $scope.searchParams.EndRow = newValue * $scope.numPerPage;
                    $scope.findInternationalTransfers();
                }
            });



            $scope.findInternationalTransfers = function () {

                if ($scope.searchParams.DateOfTransfer == "" && $scope.searchParams.SenderName == "" && $scope.searchParams.SenderAccNumber == "" && $scope.searchParams.ReceiverName == "") {
                    return false;
                }
                if ($scope.searchParams.DateOfTransfer != "" && $scope.searchParams.DateOfTransfer instanceof Date) {
                    $scope.searchParams.DateOfTransfer = dateFilter($scope.searchParams.DateOfTransfer, 'yyyy/MM/dd');
                }
                
                $.ajax({
                    url: "../SearchInternationalTransfer/GetSearchedInternationalTransfers",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: $scope.searchParams,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.internationalTransfersList = response;

                        if ($scope.internationalTransfersList.length > 0)
                        {
                            $scope.totalRows = $scope.internationalTransfersList[0].RowCount;
                        }


                        if ($scope.totalRows / $scope.numPerPage > 5) {
                            $scope.maxSize = 5;
                        }
                        else {
                            $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                        }

                        $scope.goToPage();
                    }
                    , error: function (xhr) {
                        console.log("error");
                        console.log(xhr);
                    }
                });

                return false;
            }




        }
        ]
    };
}]);


