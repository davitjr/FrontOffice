angular.module('SearchSwiftCodeControl', [])
.directive('searchswiftcode', [function () {
    return {
        scope: {
            callback: '&',
            close: '&'
        },
        templateUrl: '../Content/Controls/SearchSwiftCode.html',
        link: function (scope, element, attr) {
            $(".modal-dialog").draggable();
            scope.swiftCodesList = [];
            scope.currentPage = 0;
            scope.numPerPage = 30;
            scope.maxSize = 1;
            scope.totalRows = 0;
            scope.totalPages = 1;

            scope.selectSwiftCode = function () {
                scope.callback({ swiftCode: scope.selectedSwiftCode });
            };

            scope.closeSearchSwiftCodesModal = function () {
                scope.close();
            };

            scope.searchParams = {
                SwiftCode: "",
                City: "",
                BankName: "",

            };

        },
        controller:['$scope', '$element', function ($scope, $element) {
            
 
            $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
                $scope.selectedSwiftCode = $scope.swiftCodesList[index].SwiftCode;
            };

            $scope.$watch("currentPage", function () {

                $scope.goToPage();

            });

            $scope.goToPage = function()
            {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredSwiftCodes = $scope.swiftCodesList.slice(begin, end);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
                else {
                    $scope.filteredSwiftCodes = {};
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            }

            $scope.btnFindClick = function () {
                $scope.findSwiftCodes();
            };


            $scope.findSwiftCodes = function () {

                if ($scope.searchParams.SwifrCode == "" && $scope.searchParams.City == "" && $scope.searchParams.BankName == "") {
                    return false;
                }

               
                $.ajax({
                    url: "../SearchSwiftCodes/GetSearchedSwiftCodes",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: $scope.searchParams,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.swiftCodesList = response;

                        $scope.totalRows = $scope.swiftCodesList.length;
                       
                        
                        if ($scope.totalRows / $scope.numPerPage > 5) {
                            $scope.maxSize = 5;
                           
                        }
                        else
                        {
                            $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                           
                        }

                        $scope.totalPages = Math.ceil($scope.totalRows / $scope.numPerPage);
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


