app.controller("BondAmountChargeOrderCtrl", ['$scope', 'bondAmountChargeOrderService', 'bondService', '$http', '$confirm', function ($scope, bondAmountChargeOrderService, bondService, $http, $confirm) {

    $scope.initBondAmountChargeOrder = function () {
      
        $scope.order = {};
        $scope.order.Bond = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

        $scope.attachmentsCounter = [];
        $scope.attachmentsCounter.push(0);
        $scope.order.Attachments = [];

        $scope.order.Type = 194;
        $scope.order.SubType = 1;
        $scope.order.Currency = $scope.currency;
        $scope.order.Amount = $scope.totalPrice;
        $scope.order.Bond.BondCount = $scope.bondCount;
    };


    $scope.saveBondAmountChargeOrder = function (bondID) {
            if ($http.pendingRequests.length == 0) {

                $confirm({ title: 'Շարունակե՞լ', text: "Գանձե՞լ ձեռք բերվող պարտատոմսերի գումարը" })
                        .then(function () {
                    showloading();
                    $scope.error = null;
					$scope.order.Bond.ID = bondID;
					$scope.order.IsCashInTransit = $scope.isCashOrNonCash;
                    var minutes = $scope.ChargeDateForTime.getMinutes()
                    var hours = $scope.ChargeDateForTime.getHours()
                    $scope.order.Bond.AmountChargeTime = hours + ':' + minutes;

                    var Data = bondAmountChargeOrderService.saveBondAmountChargeOrder($scope.order);
                    Data.then(function (res) {
                        if (validate($scope, res.data)) {

                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');

                            CloseBPDialog('amountChargeOrderForBond');

                            refresh($scope.order.Type);
                            hideloading();

                            var refreshScope = angular.element(document.getElementById('BondDetails')).scope();
                            if (refreshScope != undefined) {
                                refreshScope.getBondByID(bondID);
                            }

                        }
                        else {
                            hideloading();

                            $scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }
                    }, function () {
                        hideloading();
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error in saveBondAmountChargeOrder');
                    });
                });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
        };
      
        $scope.getBondAmountChargeOrder = function (orderId) {
            var Data = bondAmountChargeOrderService.getBondAmountChargeOrder(orderId);
            Data.then(function (acc) {
                $scope.amountChargeOrderDetails = acc.data;
            }, function () {
                alert('Error getBondAmountChargeOrder');
            });

        };
    
    $scope.newFile = function () {
        var i = 0;
       

        if ($scope.attachmentsCounter.length == $scope.order.Attachments.length) {
            if ($scope.attachmentsCounter != undefined && $scope.attachmentsCounter.length > 0) {
                i = $scope.attachmentsCounter.length;
            }
            $scope.attachmentsCounter.push(i);
        }
        else {
            return ShowMessage('Առկա են չկցված ֆայլեր։', 'error');
        }
    };

    $scope.removeFile = function (index) {
        $scope.order.Attachments.splice(index, 1);
        $scope.attachmentsCounter.splice(index, 1);
    }

    $scope.obj = {};
    $scope.convertfile = function ($files, $event, $flow, index) {
        var fr = new FileReader();

        fr.onload = function () {
            $scope.arraybuffer = this.result;



            var arraybuffer = $scope.arraybuffer
            arraybuffer = arraybuffer.replace('data:image/jpeg;base64,', '');
            arraybuffer = arraybuffer.replace('data:image/png;base64,', '');
            arraybuffer = arraybuffer.replace('data:image/jpg;base64,', '');
            arraybuffer = arraybuffer.replace('data:application/pdf;base64,', '');

            var oneAttachment = {};
            oneAttachment.Attachment = arraybuffer;
            oneAttachment.FileExtension = '.' + $scope.obj.flow.files[0].getExtension();
            //oneAttachment.Id = '0';
            oneAttachment.FileName = $files[0].name;
            $scope.order.Attachments.push(oneAttachment);

        };


        fr.readAsDataURL($files[0].file);

    };

    $scope.getBondAcquirementApplication = function () {
        if ($scope.order.Bond.AmountChargeDate != undefined && $scope.ChargeDateForTime != undefined)
        {
            showloading();
            var minutes = $scope.ChargeDateForTime.getMinutes()
            var hours = $scope.ChargeDateForTime.getHours()

            if (minutes < 10)
            {
                minutes = '0' + minutes;
            }

            var Data = bondService.getBondAcquirementApplication($scope.bondID, $scope.order.Bond.AmountChargeDate, hours + ':' + minutes);
            ShowPDF(Data);
        }
        else {
            return ShowMessage('Առկա են չմուտքագրված դաշտեր։', 'error');
        }               
    };


    }]);