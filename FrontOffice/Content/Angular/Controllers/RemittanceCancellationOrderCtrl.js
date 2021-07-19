app.controller("RemittanceCancellationOrderCtrl", ['$scope', 'remittanceCancellationOrderService', '$rootScope', '$http', 'infoService', '$confirm', function ($scope, remittanceCancellationOrderService, $rootScope, $http, infoService, $confirm) {

    $scope.initRemittanceCancellationOrder = function () {
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.Transfer = {};
        $scope.order.URN = $scope.URN;
        $scope.order.Transfer.Id = $scope.transferId;
        $scope.order.Transfer.MTOAgentCode = $scope.MTOAgentCode;

        if ($scope.cancellationCustomerNumber != undefined && $scope.cancellationCustomerNumber != 0) {
            $scope.order.CustomerNumber = $scope.cancellationCustomerNumber;
        }


        if ($scope.sendOrReceived == 1) {
            $scope.order.subType = 1;       //Ուղարկված փոխանցման չեղարկում
            $scope.canCancelSentRemittance = false;
            $scope.getRemittanceDetails($scope.URN);
        }
        else if ($scope.sendOrReceived == 0) {
            $scope.order.subType = 2;       //Ստացված փոխանցման չեղարկում
        }


    };

    $scope.saveRemittanceCancellationOrder = function () {
        if ($http.pendingRequests.length == 0) {
            //document.getElementById("remittanceCancellationOrderLoad").classList.remove("hidden");
            var questionText = "";

            if ($scope.order.subType == 1) {
                questionText = 'Դուք համոզվա՞ծ եք, որ ուզում եք վերադարձնել ուղարկված փոխանցումը:';
            }
            else if ($scope.order.subType == 2) {
                questionText = 'Դուք համոզվա՞ծ եք, որ ուզում եք չեղարկել վճարված փոխանցումը:';
            }

            $confirm({ title: 'Շարունակե՞լ', text: questionText })
                .then(function () {
                    showloading();


                    var Data = remittanceCancellationOrderService.saveRemittanceCancellationOrder($scope.order);

                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data)) {
                            //document.getElementById("remittanceCancellationOrderLoad").classList.add("hidden");
                            CloseBPDialog('newRemittanceCancellationOrder');
                            $scope.path = '#transfers';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            $state.go('transfers');
                            refresh($scope.order.Type);
                        }
                        else {
                            //document.getElementById("remittanceCancellationOrderLoad").classList.add("hidden");
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }

                    }, function (err) {
                        //document.getElementById("remittanceCancellationOrderLoad").classList.add("hidden");
                        hideloading();
                        if (err.status != 420) {
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        }
                        alert('Error saveRemittanceCancellationOrder');
                    });
                });
        }

        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };



    $scope.getCancellationReversalCodes = function () {
        var Data = infoService.getARUSCancellationReversalCodes($scope.MTOAgentCode);
        Data.then(function (codes) {
            $scope.cancellationReversalCodes = codes.data;
        }, function () {
            alert('Error getARUSCancellationReversalCodes');
        });
    };

    $scope.getRemittanceCancellationOrder = function (orderId) {
        var Data = remittanceCancellationOrderService.getRemittanceCancellationOrder(orderId);
        Data.then(function (order) {
            $scope.orderDetails = order.data;
        }, function () {
            alert('Error getRemittanceCancellationOrder');
        });
    };


    $scope.getRemittanceSendCancellationApplication = function (type) {
        if (type == 1) {
            if ($scope.order.CancellationReversalCode == undefined) {
                if ($scope.error.filter(a => a.Code == -1)[0] == undefined) {
                    $scope.error.push({
                        Code: -1, Description: 'Խնդրում ենք նշել չեղարկման/վերադարձման գործողության տեսակը։'
                    });
                }
                return;
            }
            if ($scope.order.Transfer.Id != undefined) {

                showloading();
                var Data = remittanceCancellationOrderService.getRemittanceSendCancellationApplication($scope.order);
                ShowPDF(Data);
            }
        }
        else if (type == 2) {
            if ($scope.orderDetails.Transfer.Id != undefined) {

                showloading();
                var Data = remittanceCancellationOrderService.getRemittanceSendCancellationApplication($scope.orderDetails);
                ShowPDF(Data);
            }
        }

    };


    $scope.getRemittanceDetails = function (URN) {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("remittanceCancellationOrderLoad").classList.remove("hidden");

            var Data = remittanceCancellationOrderService.getRemittanceDetails(URN);

            Data.then(function (response) {

                if (validate($scope, response.data.ActionResult)) {
                    document.getElementById("remittanceCancellationOrderLoad").classList.add("hidden");
                    $scope.remittanceDetails = response.data.RemittanceDetails;

                    if (response.data.ActionResult != undefined && response.data.ActionResult.ResultCode == 7) {
                        var info = "";
                        for (var i = 0; i < response.data.ActionResult.Errors.length; i++) {
                            info += response.data.ActionResult.Errors[i].Description + '\n';
                        }
                        ShowMessage(info, 'information', $scope.path);
                        CloseBPDialog('newRemittanceCancellationOrder');
                    }
                    else {
                        $scope.order.BeneficiaryLastName = $scope.remittanceDetails.BeneficiaryLastName;
                        $scope.order.BeneficiaryFirstName = $scope.remittanceDetails.BeneficiaryFirstName;
                        $scope.order.BeneficiaryMiddleName = $scope.remittanceDetails.BeneficiaryMiddleName;

                        $scope.order.NATBeneficiaryFirstName = $scope.remittanceDetails.NATBeneficiaryFirstName;
                        $scope.order.NATBeneficiaryLastName = $scope.remittanceDetails.NATBeneficiaryLastName;
                        $scope.order.NATBeneficiaryMiddleName = $scope.remittanceDetails.NATBeneficiaryMiddleName;

                        $scope.order.NATSenderLastName = $scope.remittanceDetails.NATSenderLastName;
                        $scope.order.NATSenderFirstName = $scope.remittanceDetails.NATSenderFirstName;
                        $scope.order.NATSenderMiddleName = $scope.remittanceDetails.NATSenderMiddleName;

                        $scope.order.SenderLastName = $scope.remittanceDetails.SenderLastName;
                        $scope.order.SenderFirstName = $scope.remittanceDetails.SenderFirstName;
                        $scope.order.SenderMiddleName = $scope.remittanceDetails.SenderMiddleName;

                        $scope.canCancelSentRemittance = true;
                    }
                }
                else {
                    document.getElementById("remittanceCancellationOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("remittanceCancellationOrderLoad").classList.add("hidden");
                CloseBPDialog('newRemittanceCancellationOrder');
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in getRemittanceDetails');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Չեղարկել>> կոճակը:', 'error');

        }
    };

}]);