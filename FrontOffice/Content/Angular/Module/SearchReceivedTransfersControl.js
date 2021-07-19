angular.module('SearchReceivedTransferControl', [])
.directive('searchreceivedtransfer', [function () {
    return {
        scope: {
            callback: '&',
            close: '&',
            transfertype: '=?'
        },
        templateUrl: '../Content/Controls/SearchReceivedTransfer.html',
        link: function (scope, element, attr) {
            $(".modal-dialog").draggable();
            scope.ReceivedTransfersList = [];
            scope.currentPage = 0;
            scope.numPerPage = 20;
            scope.maxSize = 1;
            scope.totalRows = 0;

            scope.selectReceivedTransfer = function () {
                scope.callback({ receivedTransfer: scope.ReceivedTransfersList[scope.selectedRow] });
            };

            scope.closeReceivedTransfersModal = function () {
                scope.close();
            };
 


 
     
        


            scope.searchParams = {
                Amount:"",
                Currency:"",
                TransferType: scope.transfertype,
                DateOfransfer: new Date(),
                Code: "",
                BeginRow:  1,
                EndRow: 20 
                
            };

        },
        controller:['$scope', '$element', 'dateFilter', function ($scope, $element, dateFilter) {

                    $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
                $scope.selectedTransferID = $scope.ReceivedTransfersList[index].TransferID;
            };

            $scope.$watch("currentPage", function () {

                $scope.goToPage();

            });

            $scope.goToPage = function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredReceivedTransfers = $scope.ReceivedTransfersList.slice(begin, end);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
                else {
                    $scope.filteredReceivedTransfers = {};
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            }

            $scope.btnFindClick = function () {
                $scope.currentPage = 1;
                $scope.totalRows = 0;
                $scope.findReceivedTransfers();
            };

           
            //$scope.getTransferSystemCurrency = function () {
            //    var Data = infoService.getCurrencies();
            //    Data.then(function (ref) {
            //        $scope.curencyList = ref.data;
            //    }, function () {
            //        alert('Error FilialList');
            //    });
            //};



            $scope.getTransferSystemCurrency = function () {
                $scope.curencyList = [
                       { id: '', name: '' } ,
                       { id: 'AMD', name: 'AMD' },
                       { id: 'USD', name: 'USD' },
                       { id: 'EUR', name: 'EUR' },
                       { id: 'RUR', name: 'RUR' }];
            };

 
            $scope.$watch('currentPage', function (newValue, oldValue) {
                if (newValue != oldValue && oldValue != 0)
                {
                    $scope.searchParams.BeginRow = (newValue - 1) * $scope.numPerPage + 1;
                    $scope.searchParams.EndRow = newValue * $scope.numPerPage;
                    $scope.findReceivedTransfers();
                }
            });



            $scope.findReceivedTransfers = function () {

                if ($scope.searchParams.DateOfransfer != "" && $scope.searchParams.DateOfransfer instanceof Date) {
                    $scope.searchParams.DateTransfer = dateFilter($scope.searchParams.DateOfransfer, 'yyyy/MM/dd');
                }
                     
                $.ajax({
                    url: "../SearchReceivedTransfer/GetSearchedReceivedTransfers",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: $scope.searchParams,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.ReceivedTransfersList = response;

                        if ($scope.ReceivedTransfersList.length > 0)
                        {
                            $scope.totalRows = $scope.ReceivedTransfersList[0].RowCount;
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


