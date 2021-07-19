app.controller("CreditHereAndNowCtrl", ['$scope', 'infoService', 'creditHereAndNowService', function ($scope, infoService, creditHereAndNowService) {

        $scope.searchParams = {};

        $scope.today = Date();
        $scope.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        $scope.searchParams.DateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()); 
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

        $scope.currentPage = 0;
        $scope.numPerPage = 30;
        $scope.maxSize = 1;
        $scope.totalRows = 0;

        $scope.$watch('currentPage', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.searchParams.StartRow = (newValue - 1) * $scope.numPerPage + 1;
                $scope.searchParams.EndRow = newValue * $scope.numPerPage;
                $scope.getSearchedCreditsHereAndNow();
            }
        });
        $scope.getSearchedCreditsHereAndNow = function () {
            $scope.searchParams.DateTo = $scope.searchParams.DateFrom;
            var Data = creditHereAndNowService.getSearchedCreditsHereAndNow($scope.searchParams);
            Data.then(function (acc) {
                $scope.creditsHereAndNow = acc.data;

                if ($scope.creditsHereAndNow.length>0)
                    $scope.totalRows = $scope.creditsHereAndNow[0].RowCount;
                else
                    $scope.totalRows = 0;
                if ($scope.totalRows / $scope.numPerPage > 5) {
                    $scope.maxSize = 5;
                }
                else {
                    $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                }


            }, function () {
                alert('Error getSearchedCreditsHereAndNow');
            });
        };
        
        $scope.setSearchParameters = function ()
        {
            $scope.searchParams = {};
            $scope.searchParams.DateFrom = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            $scope.searchParams.DateTo = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            $scope.searchParams.ContractsOnly = 1;
            $scope.searchParams.ShopFilial = 22000;
            $scope.searchParams.QualityFilter  = 4;
            $scope.searchParams.StartRow = 1;
            $scope.searchParams.EndRow = 30;
            $scope.searchParams.Quality = 30;
            $scope.searchParams.CustomerNumber = 0;
            $scope.searchParams.AppID = 0;


            $scope.getSearchedCreditsHereAndNow();

        }

        $scope.setClickedRow = function (credit) {

            $scope.selectedCreditHereAndNow = credit;

        };

        $scope.checkSelectedCredits = function (isCheckedAllCredits) {
            if ($scope.creditsHereAndNow != undefined) {
                for (var i = 0; i < $scope.creditsHereAndNow.length; i++) {
                    if (isCheckedAllCredits == true) {
                        $scope.creditsHereAndNow[i].isChecked = true; 
                    }
                    else {
                        $scope.creditsHereAndNow[i].isChecked = false;
                    }
                }
            }

        }

        $scope.setCurrentCredits = function () {
            $scope.currentCredits = [];
            if ($scope.creditsHereAndNow != undefined) {
                for (var i = 0; i < $scope.creditsHereAndNow.length; i++) {
                    if ($scope.creditsHereAndNow[i].isChecked == true) {
                        $scope.currentCredits.push($scope.creditsHereAndNow[i]); 
                    }
                }
            }

            $scope.params = { credits: $scope.currentCredits }
                return true;

        }


     
    }]);