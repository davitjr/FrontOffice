app.controller("VirtualCardCtrl", ['$scope', 'virtualCardService', 'casherService', function ($scope, virtualCardService, casherService) {

    $scope.filter = 1;

    $scope.getVirtualCards = function (productID) {
        var Data = virtualCardService.getVirtualCards(productID);
        Data.then(function (result) {
            var obj = JSON.parse(result.data);
            if (obj.ResultCode == 1) {
                $scope.virtualCards = obj.Result;
            }
            else {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }

        }, function (result) {
            var error = result.data.Description;
            alert('Error getCard3DSecureService');
        });
    };

    $scope.getVirtualCardHistory = function (virtualCardId) {
        var Data = virtualCardService.getVirtualCardHistory(virtualCardId);
        Data.then(function (result) {
            var obj = JSON.parse(result.data);
            if (obj.ResultCode == 1) {
                $scope.history = obj.Result;
            }
            else {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }

        }, function (result) {
            var error = result.data.Description;
            alert('Error getCard3DSecureService');
        });
    };

    $scope.setClickedRowVirtualCard = function (virtual) {
        if ($scope.filter == 1) {
            $scope.selectedVirtualcard = virtual;
        }
        else {
            $scope.selectedVirtualcard = {};
            $scope.selectedVirtualcard.VirtualCardId = virtual.virtualCardId;
            $scope.selectedVirtualcard.Status = 0;
        }
    };

    $scope.getCasherDescription = function (setNumber) {

        if (setNumber == undefined) {
            $scope.CasherDescription = undefined;
            return;
        }
        var Data = casherService.getCasherDescription(setNumber);
        Data.then(function (dep) {
            $scope.CasherDescription = dep.data;

        }, function () {
            alert('Error');
        });
        return $scope.CasherDescription;
    };

    $scope.reSendUpdateVirtualCard = function (updateRequestId) {
        showloading();
        var Data = virtualCardService.reSendUpdateVirtualCard(updateRequestId);
        Data.then(function (b) {
            hideloading();
            if (b.data.ResultCode == 1) {
                showMesageBoxDialog('Հարցումն ուղարկված է', $scope, 'information');
            }
            else {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }


        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.getVirtualCardCTFInfo = function (virtualCardId) {
        var Data = virtualCardService.getVirtualCardCTFInfo(virtualCardId);
        Data.then(function (result) {
            var obj = JSON.parse(result.data);
            if (obj.ResultCode == 1) {
                $scope.CTFInfos = obj.Result;
            }
            else {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }

        }, function (result) {

            alert('Error getCard3DSecureService');
        });
    };


    $scope.getVirtualCardInfoFromThales = function (productID) {
        var Data = virtualCardService.getVirtualCardInfoFromThales(productID);
        Data.then(function (result) {
            var obj = JSON.parse(result.data);
            var jsonse = JSON.stringify(obj, null, "\t");
            var blob = new Blob([jsonse], {
                type: "application/json"
            });
            $scope.filename = "getVirtualCardInfoFromThales_" + productID.toString();
            saveAs(blob, $scope.filename + ".json");


        }, function (result) {

            alert('Error getVirtualCardInfoFromThales');
        });
    };
    $scope.qualityFilterChange = function (productID) {
        if ($scope.filter == 1) {
            $scope.getVirtualCards(productID)
        }
        else {
            $scope.getInactiveVirtualCardInfoFromThales(productID);
        }
    };
    $scope.getInactiveVirtualCardInfoFromThales = function (productID) {
        var Data = virtualCardService.getVirtualCardInfoFromThales(productID);
        Data.then(function (result) {
            var obj = JSON.parse(result.data);
            if (obj != null && obj.Result != null) {
                $scope.virtualCardsFromtThales = obj.Result.virtualCardList.filter(o => o.status === "INACTIVE");
            }
        }, function (result) {
            alert('Error getInactiveVirtualCardInfoFromThales');
        });
    };
}]);