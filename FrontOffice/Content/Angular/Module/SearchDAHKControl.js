angular.module('SearchDAHKControl', [])
.directive('searchdahk', ['customerService', function (customerService) {
    return {
        scope: {
            close: '&'
        },
        templateUrl: '../Content/Controls/SearchDAHK.html',
        link: function (scope, element, attr) {
            $(".modal-dialog").draggable();
            scope.currentPage = 0;
            scope.numPerPage = 30;
            scope.maxSize = 1;
            scope.totalRows = 0;
            scope.dahkList = {};
            scope.showFreeAttaches = false;
            scope.closeSearchDAHKModal = function () {
                scope.close();
            };
        },
        controller:['$scope', '$element', function ($scope, $element) {
           
            if ($scope.$root.SessionProperties.IsNonCustomerService == false)
            {
                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function (cust) {
                    $scope.findCustomerNumber = cust.data;
                    $scope.findDAHK();
                }, function () {
                    alert('Error getAuthorizedCustomerNumber');
                });
            }

            $scope.$watch("currentPage", function () {

                $scope.goToPage();

            });

            $scope.goToPage = function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredDahkList = $scope.dahkList.slice(begin, end);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
                else {
                    $scope.filteredDahkList = {};
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            };

            $scope.btnFindClick = function () {
               
                    $scope.findDAHK();
            };


            $scope.findDAHK = function () {
                                 
                var customerNumber = 0;
                var documentNumber = "";

                if ($scope.findCustomerNumber != undefined)
                {
                    customerNumber = $scope.findCustomerNumber;
                }

                if ($scope.findDocumentNumber != undefined)
                {
                    documentNumber = $scope.findDocumentNumber;
                }
                
                $.ajax({
                    url: "../Dahk/SearchDAHK",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: { customerNumber: customerNumber, documentNumber: documentNumber, showFreeAttaches: $scope.showFreeAttaches },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.dahkList = response.rows;
                        $scope.totalRows = response.records;

                        if (response.total > 5) {
                            $scope.maxSize = 5;
                        }
                        else {
                            $scope.maxSize = response.total;
                        }

                        $scope.currentPage = 1;
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


