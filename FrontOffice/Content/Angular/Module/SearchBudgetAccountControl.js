angular.module('SearchBudgetAccountControl', [])
.directive('searchbudgetaccount', [function () {
    return {
        scope: {
            callback: '&',
            close: '&',
            accnumber: '=?'
        },
        templateUrl: '../Content/Controls/SearchBudgetAccount.html',
        link: function (scope, element, attr) {
            //$(".modal-dialog").draggable();
            scope.budgetAccountsList = [];
            scope.currentPage = 0;
            scope.numPerPage = 20;
            scope.maxSize = 1;
            scope.totalRows = 0;

            scope.selectBudgetAccount = function () {
                scope.callback({ budgetAccount: scope.budgetAccountsList[scope.selectedRow] });
            };

            scope.closeBudgetAccountModal = function () {
                scope.close();
            };

            scope.searchParams = {
                AccountNumber: scope.accnumber,
                Description: "",
                AccountType: "",
                CustomerType:"",
                BeginRow: 1,
                EndRow: 20
            };

        },
        controller:['$scope', '$element', function ($scope, $element) {

            $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
                $scope.selectedTransferID = $scope.budgetAccountsList[index].TransferID;
            };

            $scope.$watch("currentPage", function () {

                $scope.goToPage();

            });

            $scope.goToPage = function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredBudgetAccounts = $scope.budgetAccountsList.slice(begin, end);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
                else {
                    $scope.filteredBudgetAccounts = {};
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            }

            $scope.btnFindClick = function () {
                $scope.currentPage = 1;
                $scope.totalRows = 0;
                $scope.filteredBudgetAccount();
            };



            $scope.$watch('currentPage', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    $scope.searchParams.BeginRow = (newValue - 1) * $scope.numPerPage + 1;
                    $scope.searchParams.EndRow = newValue * $scope.numPerPage;
                    $scope.filteredBudgetAccount();
                }
            });



            $scope.filteredBudgetAccount = function () {

                if ($scope.searchParams.AccountNumber == "" && $scope.searchParams.Description == "" && $scope.searchParams.AccountType == "" && $scope.searchParams.CustomerType == "") {
                    return false;
                }
              
                $.ajax({
                    url: "../SearchBudgetAccount/GetSearchedBudgetAccounts",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: $scope.searchParams,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.budgetAccountsList = response;

                        if ($scope.budgetAccountsList.length > 0) {
                            $scope.totalRows = $scope.budgetAccountsList[0].RowCount;
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




        }]

    };
}]);


