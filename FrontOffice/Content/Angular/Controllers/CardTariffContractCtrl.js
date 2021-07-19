app.controller("CardTariffContractCtrl", ['$scope', 'dateFilter', 'cardTariffContractService', '$state', '$controller', function ($scope, dateFilter, cardTariffContractService, $state, $controller) {

   $scope.filter = 1;

   $scope.getCustomerCardTariffContracts = function () {
            var Data = cardTariffContractService.getCustomerCardTariffContracts($scope.filter);
            Data.then(function (result) {
                if ($scope.filter == 1) {
                    $scope.cardTariffContracts = result.data;
                    $scope.closingCardTariffContracts = [];
                }
                else if ($scope.filter == 2) {
                    $scope.closingCardTariffContracts = result.data;
                }
                $scope.loading = false;
        }, function () {
            alert('Error getCustomerCardTariffContracts');
        });
   };
   
   $scope.setClickedRow = function (index, contract) {
       $scope.selectedRow = index;
       $scope.selectedContract = contract;
       $scope.selectedTariffID = contract.TariffID;
       $scope.selectedRowClose = null;
   };
   
   $scope.setClickedRowClose = function (index,contract) {
        $scope.selectedRowClose = index;
        $scope.selectedContract = contract;
       $scope.selectedTariffID = contract.TariffID;
        $scope.selectedRow = null;
    };
   
   $scope.QualityFilter = function () {
       $scope.selectedRow = null;
       $scope.selectedRowClose = null;
       $scope.getCustomerCardTariffContracts();
       if($scope.filter==1) {
           $scope.filter == 1;
       }
       else {
           $scope.filter == 2;
       }

   }
   
   $scope.getCardTariffContract = function (tariffID) {
        var Data = cardTariffContractService.getCardTariffContract(tariffID);
        Data.then(function (result) {
            $scope.contract = result.data;
        }, function () {
            alert("Error getCardTariffContract");
        });
   }

   $scope.openCardTariffContractDetails = function () {
       $state.go('cardTariffContractDetails', { selectedContract: $scope.selectedContract });

   }

   $scope.getActiveCardsCount = function (tariffID) {
       var Data = cardTariffContractService.getActiveCardsCount(tariffID);
       Data.then(function (result) {
           $scope.activeCardsCount = result.data;
       }, function () {
           alert("Error getActiveCardsCount");
       });
   }
   $scope.getCardTariffContracts = function () {
       var Data = cardTariffContractService.geCardTariffContracts(1, $scope.organisationCustomerNumber);
       Data.then(function (cont) {
           $scope.cardTariffContracts = cont.data;
       }, function () {
           alert('Error geCardTariffContracts');
       });
   };


   $scope.openCardTariffs = function (tariffID) {
          cardTariffContractService.getCardTariffContract(tariffID)
          .then(function (result) {
              $scope.contract = result.data;
              $controller('PopUpCtrl', { $scope: $scope });
              $scope.params = { cardTariffContract: $scope.contract};
              $scope.openWindow('/CardTariffContract/CardTariffs', 'Աշխատավարձային ծրագրի սակագներ', 'CardTariffContract');
           }, function () {
                  alert("Error openCardTariffs");
              });
   }





   $scope.getCardTariffContractAttachment = function (customerNumber, showSlide, isCustomerDetailsCall) {

       var Data = cardTariffContractService.getCardTariffContractAttachment(customerNumber, 1);
       $scope.slides = [];
       Data.then(function (att) {
           $scope.attachments = att.data;

           for (var i = 0; i < $scope.attachments.length; i++) {
               if ($scope.attachments[i].FileExtension == 1) {
                   SlideImage($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
               }
               else if ($scope.attachments[i].FileExtension == 2) {
                   SlidePDF($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
               }
           }
           if (showSlide == true) {
               if (isCustomerDetailsCall != true)
                   isCustomerDetailsCall = false;

               $controller('PopUpCtrl', { $scope: $scope });
               $scope.params = { slides: $scope.slides, customerNumber: customerNumber, isCustomerDetailsCall: isCustomerDetailsCall }
               $scope.openWindow('/ImageSlider/ImageSlider',
                   'Աշխատավարձային ծրագրերի պայմանագրեր,հրամաններ',
                   'imageslider');
           }
       }, function () {
           alert('Error getAttachmentDocumentList');
       });
   };


   $scope.printCardTarifContract = function (tarifID) {
       showloading();
       var Data = cardTariffContractService.printCardTarifContract(tarifID);
       ShowExcel(Data,'SalaryPaymentReport');
   }

   function SlideImage(response, extension) {
       var byteArray = new Uint8Array(response);
       var blob = new Blob([byteArray], { type: 'image/jpeg' });
       var fileURL = URL.createObjectURL(blob);
       $scope.slides.push({ image: fileURL, blob: blob, extension: extension, originalimage: byteArray });

   };
   function SlidePDF(response, extension) {
       var byteArray = new Uint8Array(response);
       var blob = new Blob([byteArray], { type: 'application/pdf' });
       var fileURL = URL.createObjectURL(blob);
       $scope.slides.push({ image: '/Content/Images/pdf.png', blob: blob, extension: extension });

   };

}]);