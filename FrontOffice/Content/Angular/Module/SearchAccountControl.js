angular.module('searchAccountControl', [])
.directive('searchaccount', ['infoService', '$uibModal', function (infoService, $uibModal) {
    return {
        scope: {
            callback: '&',
            close: '&'
        },
        templateUrl: '../Content/Controls/SearchAccount.html',
        link: function (scope, element, attr) {

            $(".modal-dialog").draggable();

            scope.accountsList = [];
            scope.numPerPage = 30;
            scope.maxSize = 1;
            scope.totalRows = 0;
            scope.currentPage= 0;
            scope.numPages = 0;

            scope.searchParams = {
                accountNumber: "",
                customerNumber: "",
                currency: undefined,
                sintAcc: "",
                sintAccNew: "",
                filialCode: undefined,
                isCorAcc: false,
                includeClosedAccounts: false,
            };

            scope.selectAccount = function () {
                scope.callback({ selectedAccount: scope.selectedAccount });
            };

            scope.closeSearchAccountsModal = function () {
                scope.close();
            };
           
        },
        controller:['$scope', '$element', function ($scope, $element) {
           
            //Մանաճյուղեր
            $scope.getFilialList = function () {
                var Data = infoService.GetFilialList();
                Data.then(function (ref) {
                    $scope.filialList = ref.data;
                }, function () {
                    alert('Error FilialList');
                });
            };

            //Արժույթ
            $scope.getCurrencies = function () {
                var Data = infoService.getCurrencies();
                Data.then(function (acc) {
                    $scope.currencies = acc.data;
                }, function () {
                    alert('Currencies Error');
                });

            };
            
            $scope.setClickedRow = function (index) {
                $scope.selectedRow = index;
                $scope.selectedAccountNumber = $scope.accountsList[index].AccountNumber;
                $scope.selectedAccount = $scope.accountsList[index];
            };

            $scope.$watch("currentPage", function () {
                $scope.goToPage();



            });

            $scope.btnFindClick = function () {
                $scope.findAccounts();

            };

            $scope.goToPage = function () {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredAccounts = $scope.accountsList.slice(begin, end);
                    

                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }

                }
                else {
                    $scope.filteredAccounts = {};
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
            };

            $scope.findAccounts = function () {

                $scope.hasaccounts = true;

                if ($scope.searchParams.customerNumber != "" && $scope.searchParams.customerNumber.length != 12) {
                    $scope.searchParams.customerNumber = "";
                }

                if ($scope.searchParams.accountNumber.length > 15) {
                    $scope.searchParams.accountNumber = "";
                }

                if ($scope.searchParams.customerNumber == "" && $scope.searchParams.accountNumber == "") {
                    return false;
                }

                $.ajax({
                    url: "../SearchAccounts/GetSearchedAccounts",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data :$scope.searchParams,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.accountsList = response;

                        if ($scope.accountsList.length == 0)
                        {
                            $scope.hasaccounts = false;
                        }

                        $scope.totalRows = $scope.accountsList.length;
                        
                        if ($scope.totalRows / $scope.numPerPage > 5) {
                            $scope.maxSize = 5;
                        }
                        else {
                            $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                        }

                        $scope.numPages = Math.ceil($scope.totalRows / $scope.numPerPage);
                        $scope.currentPage = 1;
                        $scope.goToPage();
                        
                    }
                    , error: function (xhr) {
                        console.log("error");
                        console.log(xhr);
                    }
                });

                return false;
            };

            $scope.searchCustomers = function () {
                $scope.searchCustomersModalInstance = $uibModal.open({
                    template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
                    scope: $scope,
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: false,
                    backdrop: 'static',
                });

                $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {

                });
            };

            $scope.getSearchedCustomer = function (customer) {
                $scope.searchParams.customerNumber = customer.customerNumber;
                $scope.closeSearchCustomersModal();
            };

            $scope.closeSearchCustomersModal = function () {
                $scope.searchCustomersModalInstance.close();
            };
           
        }]

    };
}]);


