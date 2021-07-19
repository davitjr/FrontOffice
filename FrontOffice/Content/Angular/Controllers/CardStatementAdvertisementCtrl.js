app.controller('AllCardsAdvertisementsCtrl', ['$scope', 'cardStatementAdvertisementService', 'infoService', 'dialogService', '$confirm', function ($scope, cardStatementAdvertisementService, infoService, dialogService, $confirm) {
    $scope.newAdvertisements = {};
    $scope.newAdvertisements.OneCardAdvertisements = [];
    for (var i = 0; i < 4; i++)
    {
        $scope.newAdvertisements.OneCardAdvertisements[i] = {};
        $scope.newAdvertisements.OneCardAdvertisements[i].Position = i + 1;
        $scope.newAdvertisements.OneCardAdvertisements[i].Files = [];
        $scope.newAdvertisements.OneCardAdvertisements[i].Files[0] = {};
        $scope.newAdvertisements.OneCardAdvertisements[i].Files[0].Name = null;
    }

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.currentCardAdvertisements = $scope.allCardsAdvertisements[index];
    };

    $scope.setClickedRowForOneAdvertisement = function (index) {
        $scope.selectedRow = index;
        $scope.currentCardOneAdvertisement = $scope.oneCardAdvertisements[index];
    };

    $scope.save = function () {
        for (var i = 0; i < $scope.newAdvertisements.OneCardAdvertisements.length; i++)
        {          
            var cnt = $scope.newAdvertisements.OneCardAdvertisements[i].Files.length;
            for (var j = 0; j < cnt; j++)
            {
                if ($scope.newAdvertisements.OneCardAdvertisements[i].Files[j].Content == undefined)
                {
                    $scope.newAdvertisements.OneCardAdvertisements[i].Files[j].Content = null;
                }
            }
        }


        var Data = cardStatementAdvertisementService.insertAdvertisement($scope.newAdvertisements);  //paymentOrderService.savePaymentOrder($scope.order, $scope.confirm);

        Data.then(function (res) {
            if (validate($scope, res.data)) {
                document.getElementById("cardStatementAdvertisementLoad").classList.add("hidden");
                CloseBPDialog('addNewAdvertisement');
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                $scope.refreshAllCardsAdvertisements();
            }
            else {
                document.getElementById("cardStatementAdvertisementLoad").classList.add("hidden");
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            document.getElementById("cardStatementAdvertisementLoad").classList.add("hidden");
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            alert('Error in TransferArmPayment');
        });
                
    }

    $scope.showAdvertisementOneFile = function (fileID) {
        var Data = cardStatementAdvertisementService.getAdvertisementFileByID(fileID);
        Data.then(function (res) {
            $scope.advertisementFile = res.data;

            var byteArray = new Uint8Array($scope.advertisementFile.Content);

            var blob = new Blob([byteArray], { type: 'image/jpeg' });

            var fileURL = URL.createObjectURL(blob);

            $scope.photos = [];

            $scope.photos.push({ image: fileURL, blob: blob });        
            $scope.params = { slides: $scope.photos, isCustomerDetailsCall: true };
            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.open('imageslider', $scope, 'Գովազդային ֆայլ', '/ImageSlider/ImageSlider', dialogOptions);
                        
        }, function () {
            alert('Error showAdvertisementOneFile');
            });        
    };

    $scope.getAllCardsAdvertisements = function () {
        var Data = cardStatementAdvertisementService.getAllCardsAdvertisements();
        Data.then(function (res) {
            $scope.advertisementConfiguration = res.data;
            $scope.allCardsAdvertisements = $scope.advertisementConfiguration.AllCardsAdvertisements;

            for (var i = 0; i < $scope.allCardsAdvertisements.length; i++)
            {
                $scope.allCardsAdvertisements[i].OneCardAdvertisementsCheckBoxes = [{ "isCheck": 0 }, { "isCheck": 0 }, { "isCheck": 0 }, { "isCheck": 0 }];
                for (var j = 0; j < $scope.allCardsAdvertisements[i].OneCardAdvertisements.length; j++) {
                    for (var k = 0; k < $scope.allCardsAdvertisements[i].OneCardAdvertisementsCheckBoxes.length; k++)
                    {
                        if ($scope.allCardsAdvertisements[i].OneCardAdvertisements[j].Position == k + 1) {
                            $scope.allCardsAdvertisements[i].OneCardAdvertisementsCheckBoxes[k].isCheck = 1;
                        }
                    }
                } 
            }

        }, function () {
            alert('Error getAllCardsAdvertisements');
        });
    };


    $scope.obj = {};    
    $scope.convertfile = function ($files, $event, $flow, index) {
        var fr = new FileReader();

        fr.onload = function () {
            $scope.arraybuffer = this.result;
            $scope.arraybuffer = $scope.arraybuffer.replace('data:image/jpeg;base64,', '');
            $scope.arraybuffer = $scope.arraybuffer.replace('data:image/png;base64,', '');
            $scope.arraybuffer = $scope.arraybuffer.replace('data:image/jpg;base64,', '');
            $scope.arraybuffer = $scope.arraybuffer.replace('data:application/pdf;base64,', '');
            //$scope.attachment = $flow.files[0];   //  $scope.obj.flow.files[0];
            
            $scope.newAdvertisements.OneCardAdvertisements[index].Files[0].Content = $scope.arraybuffer;
            $scope.newAdvertisements.OneCardAdvertisements[index].Files[0].Name = $files[0].name;
        };
        
        fr.readAsDataURL($files[0].file);
    };
    
    $scope.getOneCardAdvertisements = function (cardType) {
        var Data = cardStatementAdvertisementService.getOneCardAdvertisements(cardType);
        Data.then(function (res) {
            $scope.CardAdvertisements = res.data;
            $scope.oneCardAdvertisements = $scope.CardAdvertisements.OneCardAdvertisements;

            $scope.arr = [{ "romanNumeric": "I" }, { "romanNumeric": "II" }, { "romanNumeric": "III" }, { "romanNumeric": "IV" }];

            for (var i = 0; i < $scope.oneCardAdvertisements.length; i++) {
                $scope.oneCardAdvertisements[i].PositionWithRomanNumeric = $scope.arr[$scope.oneCardAdvertisements[i].Position - 1]; //  $scope.arr[i];

                for (var j = 0; j < $scope.oneCardAdvertisements[i].Files.length; j++)
                {
                    var byteArrayThumbnail = new Uint8Array($scope.oneCardAdvertisements[i].Files[j].Content);
                    var blobThumbnail = new Blob([byteArrayThumbnail], { type: 'image/jpeg' });
                    var fileURLThumbnail = URL.createObjectURL(blobThumbnail);
                    $scope.oneCardAdvertisements[i].Files[j].Photo = fileURLThumbnail;
                }
            }
        }, function () {
            alert('Error getAllCardsAdvertisements');
        });
    };

    $scope.getAdvertisementFiles = function (advertisementID) {
        var Data = cardStatementAdvertisementService.getAdvertisementFiles(advertisementID);
        Data.then(function (res) {
            $scope.advertisementFiles = res.data;
        }, function () {
            alert('Error getAdvertisementFiles');
        });
    };
      
    $scope.updateAdvertisementWithNewFile = function (advertisement) {
        var Data = cardStatementAdvertisementService.updateAdvertisementWithNewFile(advertisement);
        Data.then(function (res) {
            $scope.refreshAllCardsAdvertisements();
        }, function () {
            alert('Error updateAdvertisementWithNewFile');
        });
    };
    
    $scope.deactivateAdvertisement = function () {
        if ($scope.currentCardOneAdvertisement == undefined)
        {
            $scope.showError = true;
            showMesageBoxDialog('Ընտրեք փակվող գովազդը', $scope, 'error');
        }
        else {        
        $confirm({ title: 'Փակե՞լ գովազդը', text: 'Քարտի գովազդի փակում' })
            .then(function () {
                var Data = cardStatementAdvertisementService.deactivateAdvertisement($scope.currentCardOneAdvertisement.ID);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        showMesageBoxDialog('Գովազդը փակված է', $scope, 'information');
                        document.getElementById("oneCardAdvertisementsDetailsLoad").classList.add("hidden");
                        CloseBPDialog('cardstatementadvertisement');
                        $scope.refreshAllCardsAdvertisements();
                    }
                    else {
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function () {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error deactivateAdvertisement');
                });
                });
        }
    };
        
    $scope.refreshAllCardsAdvertisements = function () {
        var refreshScope = angular.element(document.getElementById('AllCardsAdvertisementsForm')).scope();
        if (refreshScope != undefined) {
            refreshScope.getAllCardsAdvertisements();
        }
    }

    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

    $scope.getCardSystemTypes = function () {
        var Data = infoService.GetCardSystemTypes();
        Data.then(function (ref) {
            $scope.cardSystemTypes = ref.data;
        }, function () {
            alert('Error CardSystemTypes');
        });
    };

    $scope.getAllCardTypes = function (cardSystem) {
        var Data = infoService.getAllCardTypes(cardSystem);
        Data.then(function (ref) {
            $scope.openCardTypes = ref.data;
        }, function () {
            alert('Error getAllCardTypes');
        });
    };

    
}]);