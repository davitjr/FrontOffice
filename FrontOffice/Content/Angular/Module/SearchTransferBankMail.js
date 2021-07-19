angular.module('SearchTransferBankMailControl', [])
.directive('searchtransferbankmail', [function () {
    return {
        scope: {
            callback: '&',
            close: '&',
            accnumber: '=?',
            isbudget: '=?',
            transfergroup:'=?'            
        },
        templateUrl: '../Content/Controls/SearchTransferBankMail.html',
        link: function (scope, element, attr) {
            $(".modal-dialog").draggable();
            scope.transfersBankMailList = [];
            scope.currentPage = 0;
            scope.numPerPage = 20;
            scope.maxSize = 1;
            scope.totalRows = 0;

            scope.selectTransferBankMail = function () {
                scope.callback({ transferBankMail: scope.transfersBankMailList[scope.selectedRow] });
            };

            scope.closeTransfersBankMailModal = function () {
                scope.close();
            };

            scope.searchParams = {
                DateOfTransfer: "",
                SenderAccount: scope.accnumber,
                ReceiverAccount: "",
                ReceiverName: "",
                Amount: "",
                DescriptionForPayment: "",
                IsArchive: '0',
                IsBudget: scope.isbudget,
                BeginRow: 1,
                EndRow: 20,
                TransferGroup: scope.transfergroup
            };
            if (scope.transfergroup == 4)
            {
                scope.searchParams.IsBudget = 0;
            }
        },
        controller:['$scope', '$element', 'dateFilter', function ($scope, $element, dateFilter) {
            if ($scope.transfergroup == undefined)
            {
                $scope.transfergroup = 1;
            }
            $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
                $scope.selectedTransferID = $scope.transfersBankMailList[index].TransferID;
            };

            $scope.$watch("currentPage", function () {

                $scope.goToPage();

            });

            $scope.goToPage = function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredTransfersBankMail = $scope.transfersBankMailList.slice(begin, end);
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
                $scope.findTransfersBankMail();
            };



            $scope.$watch('currentPage', function (newValue, oldValue) {
                if (newValue != oldValue && oldValue!=0) {
                    $scope.searchParams.BeginRow = (newValue - 1) * $scope.numPerPage + 1;
                    $scope.searchParams.EndRow = newValue * $scope.numPerPage;
                    $scope.findTransfersBankMail();
                }
            });



            $scope.findTransfersBankMail = function () {

                if ($scope.searchParams.DateOfTransfer == "" && $scope.searchParams.ReceiverAccount == "" && $scope.searchParams.SenderAccount == "" && $scope.searchParams.Amount == "" && $scope.searchParams.DescriptionForPayment == "" && $scope.searchParams.ReceiverName == "") {
                    return false;
                }
                if ($scope.searchParams.DateOfTransfer != "" && $scope.searchParams.DateOfTransfer instanceof Date) {
                    $scope.searchParams.DateOfTransfer = dateFilter($scope.searchParams.DateOfTransfer, 'yyyy/MM/dd');
                }

                $.ajax({
                    url: "../SearchTransferBankMail/GetSearchedTransfersBankMail",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: $scope.searchParams,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.transfersBankMailList = response;

                        if ($scope.transfersBankMailList.length > 0) {
                            $scope.totalRows = $scope.transfersBankMailList[0].RowCount;
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


