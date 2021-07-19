angular.module('searchCardControl', [])
.directive('searchcard', ['infoService', '$uibModal', function (infoService, $uibModal) {
    return {
        scope: {
            callback: '&',
            close: '&'
        },
        templateUrl: '../Content/Controls/SearchCard.html',
        link: function (scope, element, attr) {
            $(".modal-dialog").draggable();
            scope.cardsList = [];
            scope.currentPage = 0;
            scope.numPerPage = 30;
            scope.maxSize = 1;
            scope.totalRows = 0;

            scope.selectCard = function () {
                scope.callback({ card: scope.selectedCard });
            };

            scope.closeSearchCardsModal = function () {
                scope.close();
            };

            scope.searchParams = {
                filialCode: undefined,
                customerNumber: "",
                cardNumber: "",
                currency: undefined,
                includeCloseCards: false
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
                $scope.selectedCardNumber = $scope.cardsList[index].CardNumber;
                $scope.selectedCard = $scope.cardsList[index];
            };

            $scope.$watch("currentPage", function () {

                $scope.goToPage();

            });

            $scope.goToPage = function()
            {
                var begin = (($scope.currentPage - 1) * $scope.numPerPage)
                        , end = begin + $scope.numPerPage;

                if (begin >= 0) {
                    $scope.filteredCards = $scope.cardsList.slice(begin, end);
                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                        $scope.$apply();
                    }
                }
                else {
                    $scope.filteredCards = {};
                }
            }

            $scope.btnFindClick = function () {
                    $scope.findCards();
            };


            $scope.findCards = function () {

                if ($scope.searchParams.customerNumber != "" && $scope.searchParams.customerNumber.length != 12)
                {
                    $scope.searchParams.customerNumber = "";
                }

                if ($scope.searchParams.cardNumber.length > 16)
                {
                    $scope.searchParams.cardNumber = "";
                }

                if ($scope.searchParams.customerNumber == "" && $scope.searchParams.cardNumber == "")
                {
                    return false;
                }
               
                $.ajax({
                    url: "../SearchCards/GetSearchedCards",
                    type: 'GET',
                    dataType: 'json',
                    cache: false,
                    async: true,
                    data: $scope.searchParams,
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (response) {
                        $scope.cardsList = response;

                        $scope.totalRows = $scope.cardsList.length;
                       
                        
                        if ($scope.totalRows / $scope.numPerPage > 5) {
                            $scope.maxSize = 5;
                        }
                        else
                        {
                            $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
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
            }

            $scope.closeSearchCustomersModal = function () {
                $scope.searchCustomersModalInstance.close();
            }

        }]

    };
}]);


