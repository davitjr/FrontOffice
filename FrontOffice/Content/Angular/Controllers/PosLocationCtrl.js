app.controller("PosLocationCtrl", ['$scope', 'dateFilter', 'posLocationService', '$state', 'ReportingApiService', function ($scope, dateFilter, posLocationService, $state, ReportingApiService) {

   $scope.filter = 1;
   $scope.dateFrom = $scope.$root.SessionProperties.OperationDate;
   $scope.dateTo = $scope.$root.SessionProperties.OperationDate;
   $scope.statementType = 1;
    $scope.contractDate = $scope.$root.SessionProperties.OperationDate;
    $scope.actTypes = {
        1: "ԱՍԿ-ին",
        2: "ԱՍԿ-ից",
        3: "ԲԱՆԿԻ մասն-ին",
        4: "ԲԱՆԿԻ մասն-ից",
        5: "ՍՊԱՍԱՐԿՈՂ ԿԱԶՄԱԿԵՐՊՈՒԹՅԱՆԸ"
    };
    $scope.contractTypes = {
        2: "Local-International",
        3: "Առանց քարտի ներկայացման",
        4: "Վիրտուալ POS",
        5: "Առանց քարտի ավտովարձույթ"
    };
    $scope.showContract = true;
    $scope.showAct = true;
    $scope.showAgreement = true;
    $scope.actType = 0;
    $scope.contractType = 0;


   $scope.getCustomerPosLocations = function () {
            var Data = posLocationService.getCustomerPosLocations($scope.filter);
            Data.then(function (result) {
                if ($scope.filter == 1) {
                    $scope.customerPosLocations = result.data;
                    $scope.closingCustomerPosLocations = [];
                }
                else if ($scope.filter == 2) {
                    $scope.closingCustomerPosLocations = result.data;
                }
                $scope.loading = false;
        }, function () {
            alert('Error getCustomerCardTariffContracts');
        });
   };
   
   $scope.setClickedLocationRow = function (index, posLoc) {
       $scope.selectedLocationRow = index;
       $scope.selectedPosLoc = posLoc;
       $scope.selectedPosLocId = posLoc.Id;
   };
   
   //$scope.setClickedLocationRowClose = function (index,posLoc) {
   //     $scope.selectedLocationRowClose = index;
   //     $scope.selectedPosLoc = posLoc;
   //     $scope.selectedPosLocId = posLoc.Id
   //     $scope.selectedRow = null;
   //};

   $scope.setClickedTerminalRow=function(index,posTerminal)
   {
       $scope.terminalId = posTerminal.Id;
       $scope.merchantId = posTerminal.TerminalID;
   }


   
   $scope.QualityFilter = function () {
       $scope.selectedRow = null;
       $scope.selectedRowClose = null;
       $scope.getCustomerPosLocations();
       if($scope.filter==1) {
           $scope.filter == 1;
       }
       else {
           $scope.filter == 2;
       }

   }
   
   $scope.getPosLocation = function (posLocationId) {
       var Data = posLocationService.getPosLocation(posLocationId);
        Data.then(function (result) {
            $scope.posLocation = result.data;
        }, function () {
            alert("Error getPosLocation");
        });
   }

   
   $scope.getPosRates = function (code) {
       var Data = posLocationService.getPosRates(code);
       Data.then(function (result) {
           $scope.posRates = result.data;
       }, function () {
           alert("Error getPosRates");
       });
   }


   $scope.getPosCashbackRates = function (terminalId) {
       var Data = posLocationService.getPosCashbackRates(terminalId);
       Data.then(function (result) {
           $scope.posCashbackRates = result.data;
       }, function () {
           alert("Error getPosCashbackRates");
       });
   }

   $scope.openPosLocationDetails = function () {
       $state.go('posLocationDetails', { selectedPosLoc: $scope.selectedPosLoc });

   };


   $scope.printPosStatement = function (accountNumber, exportFormat) {

       if (accountNumber == null)
       {
           return ShowMessage('Ընտրեք հաշվեհամարը', 'error');
       }

       showloading();
       var Data = posLocationService.printPosStatement(accountNumber, $scope.dateFrom, $scope.dateTo, $scope.statementType, exportFormat);
       Data.then(function (response) {
           if (response.data != null) {
               var format = 0;
               if (exportFormat == 'pdf') {
                   format = 1;
               }
               else {
                   format = 2;
               }
               var requestObj = { Parameters: response.data, ReportName: 88, ReportExportFormat: format }
               ReportingApiService.getReport(requestObj, function (result) {
                   if (exportFormat == 'xls') {
                       ShowExcelReport(result, 'PosStatement');
                   }
                   else {
                       ShowPDFReport(result);
                   }
               });
           }
       }, function () {
           alert('Error printPosStatement');
       });

             
    };

    $scope.changeActType = function () {
        if ($scope.actType == 1) {
            $scope.showContract = true;
            $scope.showAct = true;
        }
        else if ($scope.actType == 2) {
            $scope.showContract = true;
            $scope.contractType = undefined;
            $scope.showAct = true;
        }
        else {
            $scope.showContract = false;
            $scope.contractType = undefined;
            $scope.showAct = false;
        }
    }

    $scope.changeContractType = function () {
        if ($scope.contractType == 7) {
            $scope.showAct = true;
        }
        else {
            $scope.showAct = false;
        }
        $scope.showContract = true;
        $scope.actType = undefined;
        if ($scope.contractType == 3 || $scope.contractType == 5) {
            $scope.showAgreement = true;
        }
        else {
            $scope.showAgreement = false;
        }
    }

    $scope.PrintContracts = function () {
        if ($scope.actType == 1 || $scope.actType == 2) {
            $scope.printPosActsPDF($scope.terminalId, $scope.actType, $scope.contractNumber, $scope.actNumber, $scope.merchantId);
        }
        else {
            $scope.actType && $scope.printPosActs($scope.terminalId, $scope.actType, $scope.merchantId)
        }
        if ($scope.contractType == 1 || $scope.contractType == 2) {
            $scope.printPosContract($scope.terminalId, $scope.contractType, $scope.contractNumber)
        }
        else {
            if ($scope.contractType == 4) {
                $scope.printInternetContract($scope.terminalId, $scope.contractType, $scope.contractNumber)
            }
            else if ($scope.contractType == 3) {
                $scope.printAgreementWithNoCard($scope.terminalId, $scope.contractNumber, $scope.agreementNumber)
            }
            else if ($scope.contractType == 5) {
                $scope.printWithoutCardPaymentContract($scope.terminalId, $scope.contractNumber, $scope.agreementNumber)
            }
        }
    }

    $scope.printPosContract = function () {
        showloading();
        var Data = posLocationService.printPosContract();
        ShowPDF(Data);

    };

    $scope.printPosContract = function (id, contractType, contractNumber) {
        showloading();
        var Data = posLocationService.printPosContract(id, contractType, contractNumber);
        ShowPDF(Data);
    };

    $scope.printInternetContract = function (id, contractType, contractNumber) {
        showloading();
        var Data = posLocationService.printInternetContract(id, contractType, contractNumber);
        ShowPDF(Data);
    };

    $scope.printAgreementWithNoCard = function (id, contractNumber, agreementNumber) {
        showloading();
        var Data = posLocationService.printAgreementWithNoCard(id, contractNumber, agreementNumber);
        ShowPDF(Data);
    };

    $scope.printWithoutCardPaymentContract = function (id, contractNumber, agreementNumber) {
        showloading();
        var Data = posLocationService.printWithoutCardPaymentContract(id, contractNumber, agreementNumber);
        ShowPDF(Data);
    };

    $scope.printCardPaymentAgreementWithNoCard = function (contractNumber, agreementNumber) {
        showloading();
        var Data = posLocationService.printCardPaymentAgreementWithNoCard(contractNumber, agreementNumber);
        ShowPDF(Data);
    };

    $scope.printPosActsPDF = function (id, actType, contractNumber, actNumber, merchantId) {
        showloading();
        var Data = posLocationService.printPosActsPDF(id, actType, contractNumber, actNumber, merchantId);
        ShowPDF(Data);
    };

    $scope.printPosActs = function (id, actType, merchantId) {
        showloading();
        var Data = posLocationService.printPosActs(id, actType, merchantId);
        ShowPDF(Data);
    };    
}]);