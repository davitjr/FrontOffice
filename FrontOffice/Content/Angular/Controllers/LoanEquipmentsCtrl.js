app.controller("LoanEquipmentsCtrl", ['$scope', 'loanEquipmentsService', 'infoService', 'accountService', '$rootScope', 'dialogService', '$uibModal', '$controller', '$confirm', 'casherService', '$http', '$filter', 'ReportingApiService', function ($scope, loanEquipmentsService, infoService, accountService, $rootScope, dialogService, $uibModal, $controller, $confirm, casherService, $http, $filter, ReportingApiService) {

    $scope.$root.OpenMode = 8;

    $scope.getSearchedLoanEquipments = function () {
        showloading();
        $scope.showCount = false;
        $scope.equipmentsCount = 0;
        var Data = loanEquipmentsService.getSearchedLoanEquipments($scope.searchParams);
        Data.then(function (acc) {
            $scope.loanEquipments = acc.data;
            $scope.equipmentsCount = $scope.loanEquipments[0].ListCount;
            if ($scope.equipmentsCount > 500)
                $scope.showCount = true;
            hideloading();
        }, function () {
            hideloading();
            alert('Error getSearchedLoanEquipments');
        });
    };

    $scope.getSumsOfEquipmentPrices = function () {
        showloading();
        var Data = loanEquipmentsService.getSumsOfEquipmentPrices($scope.searchParams);
        Data.then(function (acc) {
            $scope.sums = acc.data;
            hideloading();
        }, function () {
            hideloading();
            alert('Error getSumsOfEquipmentPrices');
        });
    };
    
    $scope.initLoanEquipmentsSearchParams = function () {
        $scope.searchParams = {};
        $scope.searchParams.LoanFullNumber = '';
        $scope.searchParams.EquipmentDescription = '';
        $scope.searchParams.EquipmentAddress = '';
        $scope.searchParams.EquipmentSalePriceFrom = null;
        $scope.searchParams.EquipmentSalePriceTo = null;
        $scope.searchParams.AuctionEndDateFrom = '';
        $scope.searchParams.AuctionEndDateTo = '';
        $scope.searchParams.CustomerNumber = '';
        $scope.searchParams.EquipmentQuality = "0";
        $scope.searchParams.SaleStage = "0";
    }

    $scope.initLoanEquipmentsContentScroll = function () {
        $(document).ready(function () {
            $("#loanEquipmentsContent").mCustomScrollbar({
                theme: "rounded-dark",
                scrollButtons: {
                    scrollAmount: 95,
                    enable: true
                },
                mouseWheel: {
                    scrollAmount: 150
                }
            });
        });
    }

    $scope.setColor = function (loanEquipment) {
        if (loanEquipment.ClosingDate != null ) {
            return { "background-color": "#E8E8E8" }; 
        }
    }

    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error getFilialList');
        });
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
        $scope.searchParams.CustomerNumber = customer.customerNumber;
        $scope.closeSearchCustomersModal();
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };
    
    $scope.saledEquipmentsReport = function () {
        var customerNumber = 0
        var filialCode = 0
        var equipmentDescription = null
        var equipmentAddress = null
        var loanFullNumber = 0
        var equipmentSalePriceFrom = null
        var equipmentSalePriceTo = null
        var auctionEndDateFrom = null
        var auctionEndDateTo = null
        var equipmentQuality = 0
        var saleStage = 0
        
        if ($scope.searchParams.CustomerNumber != "")
            customerNumber = $scope.searchParams.CustomerNumber
        if ($scope.searchParams.FilialCode != "" && $scope.searchParams.FilialCode != null)
            filialCode = $scope.searchParams.FilialCode
        if ($scope.searchParams.EquipmentDescription != "")
            equipmentDescription = $scope.searchParams.EquipmentDescription
        if ($scope.searchParams.EquipmentAddress != "")
            equipmentAddress = $scope.searchParams.EquipmentAddress
        if ($scope.searchParams.LoanFullNumber != "")
            loanFullNumber = $scope.searchParams.LoanFullNumber
        if ($scope.searchParams.EquipmentSalePriceFrom != "")
            equipmentSalePriceFrom = $scope.searchParams.EquipmentSalePriceFrom
        if ($scope.searchParams.EquipmentSalePriceTo != "")
            equipmentSalePriceTo = $scope.searchParams.EquipmentSalePriceTo
        if ($scope.searchParams.AuctionEndDateFrom != "")
            auctionEndDateFrom = $scope.searchParams.AuctionEndDateFrom
        if ($scope.searchParams.AuctionEndDateTo != "")
            auctionEndDateTo = $scope.searchParams.AuctionEndDateTo
        if ($scope.searchParams.EquipmentQuality != "" )
            equipmentQuality = $scope.searchParams.EquipmentQuality
        if ($scope.searchParams.SaleStage != "")
            saleStage = $scope.searchParams.SaleStage
       
        var Data = loanEquipmentsService.saledEquipmentsReport(customerNumber, filialCode, loanFullNumber, equipmentSalePriceFrom, equipmentSalePriceTo, auctionEndDateFrom, auctionEndDateTo, equipmentDescription, equipmentAddress, equipmentQuality, saleStage);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 125, ReportExportFormat: 2 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowExcelReport(result, 'SaledEquipmentsReport');
            });
        }, function () {
            alert('Error saledEquipmentsReport');
        });
    } 

    $scope.setClickedRow = function (loanEquipment) {
        $scope.selectedLoanEquipment = undefined;
        $scope.selectedAppID = loanEquipment.AppID;
        $scope.showEquipment = false;       
        var Data = loanEquipmentsService.getEquipmentDetails(loanEquipment.EquipmentID);
        Data.then(function (acc) {
            $scope.selectedLoanEquipment = acc.data;
            $scope.showEquipment = true;
            $scope.canClose = false;
            $scope.addRestriction = false;
            $scope.removeRestriction = false;
            if ($scope.selectedLoanEquipment.EquipmentSalePrice != 0 && ($scope.selectedLoanEquipment.ClosingDate == null || $scope.selectedLoanEquipment.ClosingDate == undefined))
                $scope.canClose = true
            if ($scope.selectedLoanEquipment.AllowMature == 1 && ($scope.selectedLoanEquipment.ClosingDate == null || $scope.selectedLoanEquipment.ClosingDate == undefined) && $scope.selectedLoanEquipment.EquipmentSalePrice > 0)
                $scope.addRestriction = true
            else if ($scope.selectedLoanEquipment.AllowMature == 0 && ($scope.selectedLoanEquipment.ClosingDate == null || $scope.selectedLoanEquipment.ClosingDate == undefined) && $scope.selectedLoanEquipment.EquipmentSalePrice > 0)
                $scope.removeRestriction = true
            $scope.selectedEquipmentID = $scope.selectedLoanEquipment.EquipmentID;
        }, function () {
            alert('Error getEquipmentDetails');
        });
    }

    $scope.getEquipmentDetails = function (equipmentID) {
        var Data = loanEquipmentsService.getEquipmentDetails(equipmentID);
        Data.then(function (acc) {
            $scope.loanEquipmentDetails = acc.data;
        }, function () {
            alert('Error getEquipmentDetails');
        });
    };

    $scope.initLoanEquipmentClosing = function (equipmentID) {
        var Data = loanEquipmentsService.getEquipmentClosingReason(equipmentID);
        Data.then(function (acc) {
            $scope.loanEquipmentClosing = {};
            $scope.loanEquipmentClosing.closingReason = acc.data;
            $scope.loanEquipmentClosing.EquipmentID = equipmentID
        }, function () {
            alert('Error getEquipmentClosingReason');
        });
    };

    $scope.closeLoanEquipment = function () {
        if ($scope.loanEquipmentClosing.closingReason != '' && $scope.loanEquipmentClosing.closingReason != undefined) {
            if ($scope.loanEquipmentClosing.closingReason.length <= 250) {
                var Data = loanEquipmentsService.closeLoanEquipment($scope.loanEquipmentClosing.EquipmentID, $scope.loanEquipmentClosing.closingReason);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        CloseBPDialog('equipmentclosing');
                        var refreshScope = angular.element(document.getElementById('LoanEquipmentsForm')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.getSearchedLoanEquipments();
                        }
                    }
                    else {
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ:', $scope, 'error');
                    alert('Error closeLoanEquipment');
                });
            }
            else {
                return ShowMessage('Փակման պատճառը պետք է լինի 250 նիշից պակաս։', 'error');
            }
        }
        else {
            return ShowMessage('Լրացրեք փակման պատճառը:', 'error');
        }
    };

    $scope.changeCreditProductMatureRestriction = function () {
        var errorText;
        var allowMature;
        if ($scope.addRestriction == true) {
            errorText = 'Ավելացնե՞լ սահմանափակում:';
            allowMature = 0;
        }
        else if ($scope.removeRestriction == true) {
            errorText = 'Հեռացնե՞լ սահմանափակումը:';
            allowMature = 1;
        }
        $confirm({ title: 'Շարունակե՞լ', text: errorText })
            .then(function () {
                var Data = loanEquipmentsService.changeCreditProductMatureRestriction($scope.selectedAppID, allowMature);
            });
    };

}]);