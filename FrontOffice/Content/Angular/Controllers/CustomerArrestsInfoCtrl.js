app.controller("CustomerArrestsInfoCtrl", ['$scope','CustomerArrestsInfoService', 'infoService', '$http', '$controller', '$stateParams', '$state', '$uibModal', '$confirm', '$filter', 'dialogService',
    function ($scope, CustomerArrestsInfoService, infoService, $http, $controller, $stateParams, $state, $uibModal, $confirm, $filter, dialogService) {

        $scope.loanArrest = {};
        $scope.personData = {};
        $scope.newLoanArrest = {};
        $scope.totalRows = 0;
        $scope.customerNumber = 0;
        $scope.operDaye;
        $scope.setNumber = 0;
        $scope.type = 0;
        $scope.hasArrests = false;
        $scope.setNumberInfo = [];
        
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth();

        //$scope.currentPage = 0;
        //$scope.numPerPage = 2;
        //$scope.maxSize = 1;
        //$scope.totalRows = 0;

        //$scope.$watch('currentPage', function (newValue, oldValue) {
        //    if (newValue != oldValue) {
        //        $scope.searchParams.BeginRow = (newValue - 1) * $scope.numPerPage + 1;
        //        $scope.searchParams.EndRow = newValue * $scope.numPerPage;
        //        $scope.getCustomerArrestsInfo();
        //    }
        //});

        $scope.selectRow = function (info) {
            sessionStorage.setItem("ArrestID", info.ID);
            $scope.params = { loanArrestInfo: info};
        };

        $scope.getCustomerArrestsInfos = function () {
            var Data = CustomerArrestsInfoService.getCustomerInfos($scope.customerNumber);
            Data.then(function (bond) {
                $scope.personData = [];
                $scope.personData = angular.fromJson(bond.data);


                $scope.customerNumber = $scope.personData.CustomerNumber;

                var Data = CustomerArrestsInfoService.getCustomerArrestsInfo($scope.customerNumber);
                Data.then(function (bond) {
                    $scope.loanArrest = [];
                    $scope.loanArrest = angular.fromJson(bond.data);
                    $scope.totalRows = $scope.loanArrest.length;

                    $scope.hasArrests = $scope.loanArrest[0].HasArrests;

                    var Data2 = CustomerArrestsInfoService.getSetNumberInfo();
                    Data2.then(function (bond2) {

                        $scope.setNumberInfo = angular.fromJson(bond2.data);

                    }, function () {

                    });
                    //if ($scope.totalRows / $scope.numPerPage > 3) {
                    //    $scope.maxSize = 3;
                    //}
                    //else {
                    //    $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                    //}

                    
                }, function () {

                    });

            }, function () {

                });

            //var Data1 = CustomerArrestsInfoService.getOperday();
            //Data1.then(function (bond1) {
            //    $scope.operDaye = angular.fromJson(bond1.data);
            //}, function () {

            //    });

            //var Data2 = CustomerArrestsInfoService.getSetNumber();
            //Data2.then(function (bond2) {
            //    $scope.setNumber = angular.fromJson(bond2.data);
            //}, function () {

            //});
            
        };

        $scope.refreshInfos = function () {
            var Data = CustomerArrestsInfoService.getCustomerArrestsInfo($scope.customerNumber);
            Data.then(function (bond) {
                $scope.loanArrest = [];
                $scope.loanArrest = angular.fromJson(bond.data);
                $scope.totalRows = $scope.loanArrest.length;

                $scope.hasArrests = $scope.loanArrest[0].HasArrests;
                

            }, function () {

            });
        };

        $scope.getArrestTypes = function () {
            var Data = CustomerArrestsInfoService.getArrestTypes();
            Data.then(function (bond) {
                $scope.arrestTypes = angular.fromJson(bond.data);
            }, function () {

            });
        };

        $scope.getArrestsReasonTypes = function () {
            var Data = CustomerArrestsInfoService.getArrestsReasonTypes();
            Data.then(function (bond) {
                $scope.arrestsReasonTypes = angular.fromJson(bond.data);
            }, function () {

            });
        };

        $scope.setLoanArrest = function () {


            var id = sessionStorage.getItem("checkWhichButtonClicked");
            if (id == 2 || id == 3) {
                if ($scope.newLoanArrest.Description == undefined || $scope.newLoanArrest.Description == null || $scope.newLoanArrest.Description == "") {
                    showMesageBoxDialog('Մուտքագրեք նկարագրություն դաշտը', $scope, 'error');
                    return;
                }
            }

            if (id == 1) {
                if ($scope.newLoanArrest.ArrestReasonID == undefined || $scope.newLoanArrest.ArrestReasonID == null) {
                    showMesageBoxDialog('Մուտքագրեք արգելանքի պատճառը', $scope, 'error');
                    return;
                }

                if (($scope.newLoanArrest.Description == undefined || $scope.newLoanArrest.Description == null || $scope.newLoanArrest.Description == "") && $scope.newLoanArrest.ArrestReasonID == 20) {
                    showMesageBoxDialog('Մուտքագրեք պատճառի հակիրճ նկարագրություն ', $scope, 'error');
                    return;
                }
            }           


            if ($scope.newLoanArrest.TypeID == 0) {
                
                var Data = CustomerArrestsInfoService.getCustomerInfos($scope.customerNumber);
                Data.then(function (bond) {
                    var obj = angular.fromJson(bond.data);

                    $scope.newLoanArrest.ID = sessionStorage.getItem("ArrestID");
                    $scope.newLoanArrest.CustomerNumber = obj.CustomerNumber;

                    var DataRemove = CustomerArrestsInfoService.postRemovedCustomerArrestInfo($scope.newLoanArrest);
                    DataRemove.then(function (bondRemove) {


                        if (bondRemove.data != "") {

                            showMesageBoxDialog(bondRemove.data, $scope, 'error');

                            CloseBPDialog('AddRemoveLoanBan');
                        }
                        else {

                            CloseBPDialog('AddRemoveLoanBan');

                            refresh();
                        }
                       
                        }, function () {

                        });
                }, function () {

                });
            }
            else {
                
                var Data1 = CustomerArrestsInfoService.getCustomerInfos($scope.customerNumber);
                Data1.then(function (bond1) {
                    var obj = angular.fromJson(bond1.data);

                    $scope.newLoanArrest.CustomerNumber = obj.CustomerNumber;

                    var DataAdd = CustomerArrestsInfoService.postAddedCustomerArrestInfo($scope.newLoanArrest);
                    DataAdd.then(function (bondAdd) {

                        if (bondAdd.data != "") {
                            showMesageBoxDialog(bondAdd.data, $scope, 'error');

                            CloseBPDialog('AddRemoveLoanBan');
                        }
                        else {

                            CloseBPDialog('AddRemoveLoanBan');
                            //showMesageBoxDialog('OK', $scope, 'information');
                            refresh();
                        }

                    }, function () {

                    });
                }, function () {

                });


            }
            
        };

        $scope.checkWhichButtonclicked = function (id) {
            sessionStorage.setItem("checkWhichButtonClicked", id);

            switch (id) {
                case 1:
                    var Data = CustomerArrestsInfoService.checkCustomerFilial($scope.customerNumber);
                    Data.then(function (bond) {
                        if (bond.data == 0) {
                            $scope.openWindow('/CustomerArrestsInfo/AddRemoveLoanBan', 'Դնել Արգելք', 'AddRemoveLoanBan');
                        }
                        else {
                            showMesageBoxDialog("Նշված հաճախորդը "+ bond.data +" մասնաճյուղի հաճախորդ է", $scope, 'error');
                        }
                    }, function () {

                    });
                    break;
                case 2:
                    $scope.openWindow('/CustomerArrestsInfo/AddRemoveLoanBan', 'Ինֆորմացիա', 'AddRemoveLoanBan');
                    break;
                case 3:
                    var Data1 = CustomerArrestsInfoService.checkCustomerFilial($scope.customerNumber);
                    Data1.then(function (bond1) {
                        if (bond1.data == 0) {
                            $scope.openWindow('/CustomerArrestsInfo/AddRemoveLoanBan', 'Հանել արգելքը', 'AddRemoveLoanBan');
                        }
                        else {
                            showMesageBoxDialog("Նշված հաճախորդը " + bond1.data + " մասնաճյուղի հաճախորդ է", $scope, 'error');
                        }
                    }, function () {

                    });
                    break;
            }
           

        };

        $scope.initFieldsValues = function () {

            var obj = sessionStorage.getItem("ArrestID");


            $scope.type = sessionStorage.getItem("checkWhichButtonClicked");
            var Data1 = CustomerArrestsInfoService.getOperday();
            Data1.then(function (bond1) {
                $scope.operDaye = bond1.data;

                var Data2 = CustomerArrestsInfoService.getSetNumberInfo();
                Data2.then(function (bond2) {
                    var obj = angular.fromJson(bond2.data);
                    $scope.setNumber = obj.SetNumber;

                    if ($scope.type == 1) {
                        $scope.newLoanArrest.SetNumber = $scope.setNumber;
                        $scope.newLoanArrest.RegistrationDate = $scope.operDaye;
                        if (obj.IsChief == true) {
                            $scope.newLoanArrest.TypeID = "2";
                        }
                        else {
                            $scope.newLoanArrest.TypeID = "1";
                        }
                        $scope.showArrestsReasons = true;
                    }
                    else if ($scope.type == 2) {
                        $scope.newLoanArrest.SetNumber = $scope.setNumber;
                        $scope.newLoanArrest.RegistrationDate = $scope.operDaye;

                        $scope.newLoanArrest.TypeID = "3";
                        $scope.showArrestsReasons = false;
                    }
                    else {
                        $scope.newLoanArrest.TypeID = "0";
                        $scope.newLoanArrest.SetNumber = $scope.setNumber;
                        $scope.newLoanArrest.RegistrationDate = $scope.operDaye;

                        $scope.showArrestsReasons = true;
                    }


                }, function () {

                    });

            }, function () {

            });
            
           
        };

        $scope.openWindow = function (url, title, id, callbackFunction) {
            $scope.disabelButton = true;
            if (!document.getElementById(id)) {
                var dialogOptions = {
                    callback: function () {
                        if (dialogOptions.result !== undefined) {
                            cust.mncId = dialogOptions.result.whateverYouWant;
                        }
                    },
                    result: {}
                };

                dialogService.open(id, $scope, title, url, dialogOptions, undefined, undefined, callbackFunction);
            }
            else {
                $scope.disabelButton = true;
            }

        };

    }]);

function CloseBPDialog(dialogID) {
    var dialog = document.querySelector('#' + dialogID);
    $('#' + dialogID).hide();
    dialog.parentNode.removeChild(dialog);

    if (document.querySelector('.bp-dialog-overlay')) {
        $('.bp-dialog-overlay').css("display", "none");
    }

    return false;
}