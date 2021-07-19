app.controller("EmployeeWorksCtrl", ['$scope', 'casherService', 'employeeWorksService', '$uibModal', 'customerService', '$confirm', '$controller', '$filter',
    function ($scope, casherService, employeeWorksService, $uibModal, customerService, $confirm, $controller, $filter) {
    $scope.$root.OpenMode = 11;
    $scope.searchParams = {};
    if ($scope.employeeWork == undefined)
    {
        $scope.employeeWork = {}
        $scope.employeeWork.RegistrationDate = new Date();
    }
    else
    {
        $scope.employeeWork = angular.copy($scope.employeeWork);
    }
    $scope.currentPage = 0;
    $scope.numPerPage = 30;
    $scope.maxSize = 1;
    $scope.totalRows = 0;

    $scope.$watch('currentPage', function (newValue, oldValue) {
        if (newValue != oldValue) {
            $scope.searchParams.BeginRow = (newValue - 1) * $scope.numPerPage + 1;
            $scope.searchParams.EndRow = newValue * $scope.numPerPage;
            $scope.searchEmployeesWorks();
        }
    });
    $scope.searchEmployeesWorks = function () {
        var Data = employeeWorksService.searchEmployeesWorks($scope.searchParams);
        Data.then(function (acc) {
            $scope.employeeWorks = acc.data;
            $scope.newWorkCount = 0;
            if ($scope.employeeWorks.length > 0)
            {

                $scope.totalRows = $scope.employeeWorks[0].RowCount;
                for (var i = 0; i < $scope.employeeWorks.length; i++) {
                    if ($scope.employeeWorks[i].Quality == 10)
                    {
                        $scope.newWorkCount = $scope.newWorkCount + 1;
                    }

                }


            }
            if ($scope.totalRows / $scope.numPerPage > 5) {
                $scope.maxSize = 5;
            }
            else {
                $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
            }

        }, function () {
            alert('Error searchEmployeesWorks');
        });
    };

    $scope.setSearchParameters = function () {
        $scope.searchParams = {};
        $scope.searchParams["BeginRow"] = 1;
        $scope.searchParams["EndRow"] = 30;
        if ($scope.$root.SessionProperties != undefined && ($scope.$root.SessionProperties.SourceType == 2 || $scope.$root.SessionProperties.SourceType == 6)) {
            $scope.disableCustomerNumber = true;
            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (cust) {
                $scope.searchParams.CustomerNumber = cust.data;
                $scope.searchParams.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                $scope.searchParams.Quality = '10';
                $scope.searchEmployeesWorks();
            });
        }
        else {
            $scope.searchParams.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            $scope.searchParams.Quality = '10';
            $scope.searchEmployeesWorks();
        }
    }



    $scope.getAuthorizedCustomerNumber = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (cust) {
            $scope.customerNumber = cust.data;
            $scope.addCustomer(cust.data.toString());
        });
    };

    

    $scope.setClickedRow = function (work) {

        $scope.selectedWork = work;


    };

    $scope.getTypeOfEmployeeWorks = function () {
        var Data = employeeWorksService.getTypeOfEmployeeWorks();
        Data.then(function (result) {
            $scope.typeOfEmployeeWorks = result.data;
        }, function () {
            alert('Error getTypeOfEmployeeWorks');
        });
    };

    $scope.getTypeOfEmployeeWorkImportances = function () {
        var Data = employeeWorksService.getTypeOfEmployeeWorkImportances();
        Data.then(function (result) {
            $scope.typeOfEmployeeWorkImportances = result.data;
        }, function () {
            alert('Error getTypeOfEmployeeWorkImportances');
        });
    };

    $scope.getTypeOfEmployeeWorkQualities = function () {
        var Data = employeeWorksService.getTypeOfEmployeeWorkQualities();
        Data.then(function (result) {
            $scope.typeOfEmployeeWorkQualities = result.data;
        }, function () {
            alert('Error getTypeOfEmployeeWorkQualities');
        });
    };


    $scope.getTypeOfEmployeeWorkDescriptions = function () {
        var Data = employeeWorksService.getTypeOfEmployeeWorkDescriptions();
        Data.then(function (result) {
            $scope.typeOfEmployeeWorkDescriptions = result.data;
        }, function () {
            alert('Error getTypeOfEmployeeWorkDescriptions');
        });
    };



    $scope.confirmEmployeeWork = function (isChangeWorkQuality, isChangeWork)
    {
        if (isChangeWorkQuality != true && isChangeWork != true && $scope.employeeWork != undefined && ($scope.employeeWork.CustomerNumber == undefined || $scope.employeeWork.CustomerNumber.toString().length != 12)) {
            return;
        }


        $confirm({ title: 'Շարունակե՞լ', text: confirmText })
              .then(function () {
                  $scope.saveEmployeeWork();
              });


        
    }



    $scope.saveEmployeeWork = function (isChangeWorkQuality,isChangeWork) {
        showloading();
        $scope.error = null;
        var Data = employeeWorksService.saveEmployeeWork($scope.employeeWork);
        Data.then(function (res) {
                hideloading();
            if (validate($scope, res.data)) {
                if (isChangeWorkQuality != true) {
                    CloseBPDialog('newemployeework');
                }
                else
                {
                    if (isChangeWork)
                    {
                        CloseBPDialog('changeworkdetails');
                    }

                    var refreshScope = angular.element(document.getElementById('employeework_details')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.getEmployeeWork(refreshScope.employeeWork.Id);
                    }

                }

                var refreshScope = angular.element(document.getElementById('employeeWorks')).scope();
                if (refreshScope != undefined) {
                    refreshScope.searchEmployeesWorks();
                }

            }
            else {
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }

            
        }
       , function () {
                hideloading();
           alert('Error in saveEmployeeWork');
       });
    }
    


    $scope.searchCustomers = function (isSearchForm) {
        if (isSearchForm == undefined)
            isSearchForm = false;


        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer,'+isSearchForm+')" close="closeSearchCustomersModal()"></searchcustomer>',
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

    $scope.getSearchedCustomer = function (customer, isSearchForm) {
        if (isSearchForm != true) {
            $scope.employeeWork.CustomerNumber = customer.customerNumber;
        }
        else {
            $scope.searchParams.CustomerNumber = customer.customerNumber;
        }
        $scope.closeSearchCustomersModal();
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };



    $scope.searchCashiers = function (isClosingSetNumber) {
        $scope.searchCashiersModalInstance = $uibModal.open({
            template: '<searchcashier callback="getSearchedCashier(cashier' + ',' + isClosingSetNumber + ')" close="closeSearchCashiersModal()"></searchcashier>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
        });


        $scope.searchCashiersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
    $scope.getSearchedCashier = function (cashier, isClosingSetNumber) {

        if (isClosingSetNumber) {
            $scope.searchParams.ClosingSetNumber = cashier.setNumber;
            $scope.ClosingSetNumberDescription = cashier.firstName + ' ' + cashier.lastName;
        }
        else {
            $scope.searchParams.ExecutorSetNumber = cashier.setNumber;
            $scope.SetNumberDescription = cashier.firstName + ' ' + cashier.lastName;
        }
        $scope.closeSearchCashiersModal();
    }

    $scope.closeSearchCashiersModal = function () {
        $scope.searchCashiersModalInstance.close();
    };

    $scope.redirectProducts = function (customerNumber) {
        var Data = customerService.redirectProducts(customerNumber);
        Data.then(function (acc) {
            var url = location.origin.toString();
            window.location = url + acc.data.redirectUrl + "?customerNumber=" + acc.data.customerNumber + "&customerType=" + acc.data.customerType + "&authorizedUserSessionToken=" + acc.data.authorizedUserSessionToken;
        }, function () {
            alert('Error redirectProducts');
        });
    };




    $scope.addCustomer = function (customerNumber) {
      
        if (customerNumber == undefined) {
            return ShowMessage('Կատարեք հաճախորդի որոնում', 'error'); 
        }
        else if (customerNumber.length != 12) {
            return ShowMessage('Հաճախորդի համարը պետք է լինի 12 նիշ', 'error');
        }
        
        $scope.employeeWork.CustomerNumber = customerNumber;
    }


    $scope.deleteCustomer = function (index) {
        $scope.customerNumber = undefined;
        $scope.employeeWork.CustomerNumber = undefined;
    }


    $scope.getUserID = function (isNewWork) {
        var Data = casherService.getUserID();
        Data.then(function (result) {
            if (isNewWork) {
                $scope.employeeWork.SetNumber = result.data;
            }
            else {
                $scope.userSetNumber = result.data;
            }
        }, function () {
            alert('Error getUserID');
        });
    };



    $scope.getEmployeeWork = function (workId) {
        var Data = employeeWorksService.getEmployeeWork(workId);
        Data.then(function (result) {
            $scope.employeeWorkDetails = result.data;
            $scope.employeeWork = angular.copy($scope.employeeWorkDetails);
            if (typeof $scope.employeeWork.RegistrationDate == "string") {
                $scope.employeeWork.RegistrationDate = $filter('mydate')($scope.employeeWork.RegistrationDate, "dd/MM/yyyy");
            }

            if (typeof $scope.employeeWork.EndDate == "string") {
                $scope.employeeWork.EndDate = $filter('mydate')($scope.employeeWork.EndDate, "dd/MM/yyyy");
            }
        }, function () {
            alert('Error getUserID');
        });
    };


    $scope.chancgeWorkQuality = function (quality,isConfirmed)
    {

        

        if (isConfirmed != true) {
            var confirmText = '';
            if (quality == 20) {
                confirmText = 'Նշել ընթացիկ';
            }
            else if (quality == 30) {
                confirmText = 'Նշել փակված';
            }
            else if (quality == 40) {
                confirmText = 'Նշել հրաժարված';
            }

            $confirm({ title: 'Շարունակե՞լ', text: confirmText })
               .then(function () {

                   $scope.employeeWork.Quality = quality;
                   if (quality == 40) {
                       $controller('PopUpCtrl', { $scope: $scope });
                       $scope.params = { employeeWork: $scope.employeeWork,isReject:true }
                       $scope.openWindow('/EmployeeWorks/ChangeWorkDetails',
                           'Աշխատանքի հրաժարման պատճառ',
                           'changeworkdetails');
                   }
                   else
                   {
                       var Data = casherService.getUserID();
                       Data.then(function (result) {
                           
                           $scope.employeeWork.ClosingDate = new Date();
                           $scope.employeeWork.ClosingSetNumber = result.data;
                           $scope.saveEmployeeWork(true);
                       }, function () {
                           alert('Error getUserID');
                       });
                   }
               });
        }
        else 
        {
            var Data = casherService.getUserID();
            Data.then(function (result) {
                $scope.employeeWork.ClosingDate = new Date();
                $scope.employeeWork.ClosingSetNumber = result.data;
                $scope.saveEmployeeWork(true,true);
            }, function () {
                alert('Error getUserID');
            });
        }


    }


    $scope.isUserManager = function (setNumber) {
        var Data = casherService.isUserManager(setNumber);
        Data.then(function (result) {
            $scope.canChangeDetails = result.data;
        }, function () {
            alert('Error isUserManager');
        });
    };
      
    $scope.checkWorkEndDate = function ()
    {
        var monthDiff = moment(new Date($scope.employeeWork.EndDate)).diff(new Date($scope.employeeWork.RegistrationDate), 'months', true);
        if(monthDiff>3)
        {
            ShowMessage('Կատարման վերջնաժամկետը գերազանցում է 3 ամիս ժամկետը', 'info');
        }

    }


}]);