app.controller("LoanApplicationCtrl", ['$scope', 'loanApplicationService', 'infoService', '$http', '$confirm', 'loanProductOrderService',
    function ($scope, loanApplicationService, infoService, $http, $confirm, loanProductOrderService) {
        $scope.selectedProductId = null;

        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
        $scope.order.Quality = 1;
        $scope.order.SubType = 1;


        //To Get All Records  
        $scope.getLoanApplications = function () {

            $scope.loading = true;
            var Data = loanApplicationService.getLoanApplications();
            Data.then(function (la) {

                $scope.loanApplications = la.data;
                $scope.loading = false;

            }, function () {
                $scope.loading = false;
                alert('Error getLoanApplications');
            });
        };


        $scope.setClickedRow = function (index, loanApplication) {
            $scope.selectedRow = index;
            $scope.selectedProductId = loanApplication.ProductId;
            $scope.params = { ProductId: loanApplication.ProductId };
        };


        $scope.getLoanApplication = function (productID) {

            $scope.loading = true;
            var Data = loanApplicationService.getLoanApplication(productID);
            Data.then(function (la) {

                $scope.loanApplication = la.data;

                $scope.getRegions();
                $scope.getCountries();
                $scope.getArmenianPlaces();

                $scope.loading = false;

            }, function () {
                $scope.loading = false;
                alert('Error getLoanApplication');
            });
        };


        $scope.getCurrencies = function () {
            var Data = infoService.getCurrencies();
            Data.then(function (rep) {
                $scope.currencies = rep.data;
            }, function () {
                alert('Error getSourceDescription');
            });
        };

        $scope.getRegions = function () {
            var Data = infoService.getRegions($scope.loanApplication.LoanUseCountry);
            Data.then(function (acc) {
                $scope.regions = acc.data;
                $scope.loanApplication.LoanUseRegionDescription = $scope.regions[$scope.loanApplication.LoanUseRegion];
            }, function () {
                alert('Error getRegions');
            });
        };

        $scope.getArmenianPlaces = function () {
            var Data = infoService.getArmenianPlaces($scope.loanApplication.LoanUseRegion);
            Data.then(function (acc) {
                $scope.Places = acc.data;
                if ($scope.loanApplication.LoanUseLocality != 0) {
                    $scope.loanApplication.LoanUseLocalityDescription =
                        $scope.Places[$scope.loanApplication.LoanUseLocality];
                }
            }, function () {
                alert('Error getArmenianPlaces');
            });
        };

        $scope.getCountries = function () {
            var Data = infoService.getCountries();
            Data.then(function (acc) {
                $scope.Countries = acc.data;
                if ($scope.loanApplication.LoanUseCountry != 0) {
                    $scope.loanApplication.LoanUseCountryDescription =
                        $scope.Countries[$scope.loanApplication.LoanUseCountry];
                }
            }, function () {
                alert('Error getCountries');
            });
        };


        $scope.getLoanApplicationByDocId = function (docId) {

            $scope.loading = true;
            var Data = loanApplicationService.getLoanApplicationByDocId(docId);
            Data.then(function (la) {

                $scope.loanApplication = la.data;

                $scope.getRegions();
                $scope.getCountries();
                $scope.getArmenianPlaces();

                $scope.loading = false;

            }, function () {
                $scope.loading = false;
                alert('Error getLoanApplication');
            });
        };


        $scope.confirm = false;
        $scope.saveLoanApplicationQualityChangeOrder = function (orderType, productId) {
            var confirmText = "";
            $scope.order.Type = orderType;
            $scope.order.ProductId = productId;
            if (orderType == 160) {
                confirmText = "Վերլուծել";
            }
            else if (orderType == 161) {
                confirmText = "Հաստատել";
            }
            else if (orderType == 162) {
                confirmText = "Հրաժարվել";
            }
            else if (orderType == 163) {
                confirmText = "Հեռացնել";
            }


            $confirm({ title: 'Շարունակե՞լ', text: confirmText })
                .then(function () {
                    if ($http.pendingRequests.length == 0) {

                        showloading();
                        var Data = loanProductOrderService.saveLoanApplicationOrder($scope.order, $scope.confirm);
                        Data.then(function (res) {

                            $scope.confirm = false;
                            if (validate($scope, res.data)) {
                                refresh(orderType);
                                if (orderType != 163 && orderType != 162) {
                                    $scope.getLoanApplication(productId);
                                }
                                if (orderType == 161 || orderType == 163 || orderType == 162) {

                                    if (document.getElementById('newloan') != undefined) {
                                        CloseBPDialog('newloan');
                                    }
                                }
                                if (orderType == 162) {
                                    CloseBPDialog('loanApplicationTerminationOrder');
                                }
                                hideloading();
                                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            }
                            else {
                                hideloading();
                                $scope.showError = true;
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error', $confirm, $scope.saveLoanProductOrder);
                            }


                        }, function (err) {
                            $scope.confirm = false;
                            $scope.ResultCode = undefined;
                            hideloading();

                            if (err.status != 420) {
                                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            }
                            alert('Error saveAccount');
                        });
                    }
                    else {
                        return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել ' + confirmText + ' կոճակը:', 'error');

                    }


                });

        }






        $scope.getLoanApplicationFicoScoreResults = function (productID, requestDate) {
            $scope.loading = true;
            var Data = loanApplicationService.getLoanApplicationFicoScoreResults(productID, new Date(parseInt(requestDate.substr(6))));
            Data.then(function (res) {
                $scope.ficoScoreResults = res.data;
                $scope.loading = false;
            }, function () {
                $scope.loading = false;
                alert('Error getLoanApplicationFicoScoreResults');
            });
        };

        $scope.setSelectetFicoScore = function (ficoResult) {
            $scope.selectedReasons = ficoResult.Reasons;

        };


    $scope.GetLoanTypesForLoanApplication = function (loanApplicationType) {
        var Data = infoService.GetLoanTypesForLoanApplication(loanApplicationType);
        Data.then(function (acc) {
            $scope.loanTypes = acc.data;
            
        }, function () {
            alert('Error GetLoanTypesForLoanApplication');
        });
    };

    }]);