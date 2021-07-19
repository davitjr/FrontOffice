app.controller("ProblemLoanTaxesCtrl", ['$scope', '$confirm', 'infoService', '$filter', '$uibModal', '$http', '$rootScope', '$state', 'problemLoanTaxesService',
    function ($scope, $confirm, infoService, $filter, $uibModal, $http, $rootScope, $state, problemLoanTaxesService) {

        $scope.ProblemLoanTaxesList = [];
        $scope.getModeType = [];
        $scope.problemLoanTaxesLenght = 0;

        var isTransferRegistratoinDateExistsList = {
            '1': 'Փոխանցված',
            '2': 'Չփոխանցված',
        };
        $scope.isTransferRegistratoinDateExists = isTransferRegistratoinDateExistsList;

        $scope.filter = {
            TaxRegistrationStartDate: new Date(),
            TaxRegistrationEndDate: new Date(),
        };

        $scope.currentPage = 1;
        $scope.numPerPage = 500;
        $scope.maxSize = 5;
        $scope.totalRows = 0;

        $scope.$watch('currentPage', function () {
            $scope.filter.Row = $scope.filter.Row + 1;
        });

        $scope.getProblemLoanTaxesList = function () {
            showloading();
            $scope.ProblemLoanTaxesList = undefined;
            $scope.filter.Row = 1;
            $scope.Cache = false;
            $scope.TaxSum = 0;
            $scope.loading = true;
            if ($scope.filter.TaxQuality == null || $scope.filter.TaxQuality == undefined) {
                $scope.filter.TaxQuality = -1;
            }
            if ($scope.filter.TaxCourtDecision == null || $scope.filter.TaxCourtDecision == undefined) {
                $scope.filter.TaxCourtDecision = -1;
            }
            var Data = problemLoanTaxesService.getProblemLoanTaxesList($scope.filter, $scope.Cache);
            Data.then(function (problemLoanTaxFilter) {
                if ($scope.filter.TaxQuality == -1 || $scope.filter.TaxQuality == undefined) {
                    $scope.filter.TaxQuality = null;
                }
                if ($scope.filter.TaxCourtDecision == -1 || $scope.filter.TaxCourtDecision == undefined) {
                    $scope.filter.TaxCourtDecision = null;
                }

                $scope.ProblemLoanTaxesList = problemLoanTaxFilter.data;
                $scope.ProblemLoanTaxesDate = problemLoanTaxFilter.problemLoanTaxFilterDate;
                for (var i = 0; i < problemLoanTaxFilter.data.length; i++) {
                    $scope.TaxSum = $scope.TaxSum + problemLoanTaxFilter.data[i].TaxAmount
                }
                $scope.getProblemLoanTaxesLenght();
                $scope.ShowRows = problemLoanTaxFilter.data.length;

                $scope.totalRows = $scope.problemLoanTaxesLenght;
                if ($scope.totalRows / $scope.numPerPage > 0) {
                    $scope.maxSize = 5;
                }
                else {
                    $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                }
                hideloading();
            },
                function () {
                    hideloading();
                    $scope.loading = false;
                    alert('Error getProblemLoanTaxesList');
                });
        };

        $scope.getProblemLoanTaxesListPagination = function () {
            showloading();
            $scope.ProblemLoanTaxesList = undefined;
            $scope.Cache = true;
            $scope.TaxSum = 0;
            $scope.loading = true;
            if ($scope.filter.TaxQuality == null || $scope.filter.TaxQuality == undefined) {
                $scope.filter.TaxQuality = -1;
            }
            if ($scope.filter.TaxCourtDecision == null || $scope.filter.TaxCourtDecision == undefined) {
                $scope.filter.TaxCourtDecision = -1;
            }
            var Data = problemLoanTaxesService.getProblemLoanTaxesList($scope.filter, $scope.Cache);
            Data.then(function (problemLoanTaxFilter) {
                if ($scope.filter.TaxQuality == -1 || $scope.filter.TaxQuality == undefined) {
                    $scope.filter.TaxQuality = null;
                }
                if ($scope.filter.TaxCourtDecision == -1 || $scope.filter.TaxCourtDecision == undefined) {
                    $scope.filter.TaxCourtDecision = null;
                }


                $scope.ProblemLoanTaxesList = problemLoanTaxFilter.data;
                $scope.ProblemLoanTaxesDate = problemLoanTaxFilter.problemLoanTaxFilterDate;
                for (var i = 0; i < problemLoanTaxFilter.data.length; i++) {
                    $scope.TaxSum = $scope.TaxSum + problemLoanTaxFilter.data[i].TaxAmount
                }
                $scope.getProblemLoanTaxesLenght();
                $scope.ShowRows = problemLoanTaxFilter.data.length;



                hideloading();
            },
                function () {
                    hideloading();
                    $scope.loading = false;
                    alert('Error getProblemLoanTaxesList');
                });
        };

        $scope.getFilialList = function () {
            var Data = infoService.GetFilialList();
            Data.then(function (options) {
                $scope.FilialList = options.data;
            }, function () {
                alert('Error GetFilialList');
            });
        };

        $scope.getProblemLoanTaxQualityTypes = function () {
            var Data = infoService.getProblemLoanTaxQualityTypes();
            Data.then(function (options) {
                $scope.ProblemLoanTaxQualityTypes = options.data;
            }, function () {
                alert('Error getProblemLoanTaxQualityTypes');
            });
        };

        $scope.getProblemLoanTaxCourtDecisionTypes = function () {
            var Data = infoService.getProblemLoanTaxCourtDecisionTypes();
            Data.then(function (options) {
                $scope.ProblemLoanTaxCourtDecisionTypes = options.data;
            }, function () {
                alert('Error getProblemLoanTaxCourtDecisionTypes');
            });
        };

        $scope.getProblemLoanTaxDetails = function (ClaimNumber) {
            var Data = problemLoanTaxesService.getProblemLoanTaxDetails(ClaimNumber);
            Data.then(function (ProblemLoanTaxDetails) {
                $scope.ProblemLoanTaxDetails = ProblemLoanTaxDetails.data;
            }, function () {
                alert('Error getProblemLoanTaxDetails');
            });
        };

        $scope.getProblemLoanTaxesLenght = function () {
            var Data = problemLoanTaxesService.getProblemLoanTaxesLenght();
            Data.then(function (problemLoanTaxesLenght) {
                $scope.problemLoanTaxesLenght = problemLoanTaxesLenght.data;

                $scope.totalRows = $scope.problemLoanTaxesLenght;
                if ($scope.totalRows / $scope.numPerPage > 5) {
                    $scope.maxSize = 5;
                }
                else {
                    $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                }
            }, function () {
                alert('Error getProblemLoanTaxesLenght');
            });
        };

        $scope.setClickedRow = function (index) {
            $scope.selectedRow = index;
            $scope.currentProblemLoanTaxes = $scope.ProblemLoanTaxesList[index]
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
            $scope.filter.CustomerNumber = customer.customerNumber;
            $scope.closeSearchCustomersModal();
        };

        $scope.closeSearchCustomersModal = function () {
            $scope.searchCustomersModalInstance.close();
        };


        //$scope.numPerPage = 10


    }]);