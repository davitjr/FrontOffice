app.controller("RemittanceAmendmentOrderCtrl", ['$scope', 'remittanceAmendmentOrderService', '$rootScope', '$http', 'infoService', '$confirm', function ($scope, remittanceAmendmentOrderService, $rootScope, $http, infoService, $confirm) {

    $scope.initRemittanceAmendmentOrder = function () {
        $scope.order = {};
        $scope.order.RegistrationDate = new Date();
        $scope.order.Transfer = {};
        $scope.order.URN = $scope.URN;
        $scope.order.Transfer.Id = $scope.transferId;
        $scope.order.Transfer.MTOAgentCode = $scope.MTOAgentCode;

        $scope.canChangeRemittance = false;

        if ($scope.amendmentCustomerNumber != undefined && $scope.amendmentCustomerNumber != 0) {
            $scope.order.CustomerNumber = $scope.amendmentCustomerNumber;
        }

        $scope.order.subType = 1;

        $scope.getRemittanceDetails($scope.URN);

    };

    $scope.saveRemittanceAmendmentOrder = function () {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("remittanceAmendmentOrderLoad").classList.remove("hidden");

            var Data = remittanceAmendmentOrderService.saveRemittanceAmendmentOrder($scope.order);

            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("remittanceAmendmentOrderLoad").classList.add("hidden");
                    CloseBPDialog('newRemittanceAmendmentOrder');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                }
                else {
                    document.getElementById("remittanceAmendmentOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("remittanceAmendmentOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in saveRemittanceAmendmentOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };

    $scope.getRemittanceDetails = function (URN) {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("remittanceAmendmentOrderLoad").classList.remove("hidden");

            var Data = remittanceAmendmentOrderService.getRemittanceDetails(URN);

            Data.then(function (response) {

                if (validate($scope, response.data.ActionResult)) {
                    document.getElementById("remittanceAmendmentOrderLoad").classList.add("hidden");
                    $scope.remittanceDetails = response.data.RemittanceDetails;

                    if (response.data.ActionResult != undefined && response.data.ActionResult.ResultCode == 7) {
                        var info = "";
                        for (var i = 0; i < response.data.ActionResult.Errors.length; i++) {
                            info += response.data.ActionResult.Errors[i].Description + '\n';
                        }
                        ShowMessage(info, 'information', $scope.path);
                        CloseBPDialog('newRemittanceAmendmentOrder');
                    }
                    else {
                        $scope.getAmendmentReasons();
                        $scope.order.BeforeBeneLastName = $scope.remittanceDetails.BeneficiaryLastName;
                        $scope.order.BeforeBeneFirstName = $scope.remittanceDetails.BeneficiaryFirstName;
                        $scope.order.BeforeBeneMiddleName = $scope.remittanceDetails.BeneficiaryMiddleName;

                        $scope.order.BeneficiaryLastName = $scope.remittanceDetails.BeneficiaryLastName;
                        $scope.order.BeneficiaryFirstName = $scope.remittanceDetails.BeneficiaryFirstName;
                        $scope.order.BeneficiaryMiddleName = $scope.remittanceDetails.BeneficiaryMiddleName;

                        $scope.order.NATBeneficiaryFirstName = $scope.remittanceDetails.NATBeneficiaryFirstName;
                        $scope.order.NATBeneficiaryLastName = $scope.remittanceDetails.NATBeneficiaryLastName;
                        $scope.order.NATBeneficiaryMiddleName = $scope.remittanceDetails.NATBeneficiaryMiddleName;

                        $scope.order.BeforeNATBeneficiaryFirstName = $scope.remittanceDetails.NATBeneficiaryFirstName;
                        $scope.order.BeforeNATBeneficiaryLastName = $scope.remittanceDetails.NATBeneficiaryLastName;
                        $scope.order.BeforeNATBeneficiaryMiddleName = $scope.remittanceDetails.NATBeneficiaryMiddleName;

                        $scope.canChangeRemittance = true;
                    }
                }
                else {
                    document.getElementById("remittanceAmendmentOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ողղել սխալները և կրկին փորձել', $scope, 'error');

                }
            }, function () {
                document.getElementById("remittanceAmendmentOrderLoad").classList.add("hidden");
                CloseBPDialog('newRemittanceAmendmentOrder');
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error in getRemittanceDetails');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Փոփոխել ստացողին>> կոճակը:', 'error');

        }
    };



    $scope.getAmendmentReasons = function () {
        var Data = infoService.getARUSAmendmentReasons($scope.MTOAgentCode);
        Data.then(function (codes) {
            $scope.amendmentReasons = codes.data;
        }, function () {
            alert('Error getARUSAmendmentReasons');
        });
    };

    $scope.getRemittanceAmendmentOrder = function (orderId) {
        var Data = remittanceAmendmentOrderService.getRemittanceAmendmentOrder(orderId);
        Data.then(function (order) {
            $scope.orderDetails = order.data;
        }, function () {
            alert('Error getRemittanceAmendmentOrder');
        });
    };


    $scope.getRemittanceAmendmentApplication = function (type) {
        if (type == 1) {
            if ($scope.order.AmendmentReasonCode == undefined) {
                if ($scope.error.filter(a => a.Code == -1)[0] == undefined) {
                    $scope.error.push({
                        Code: -1, Description: 'Խնդրում ենք նշել չեղարկման/վերադարձման գործողության տեսակը։'
                    });
                }
                return;
            }

            if ($scope.order.Transfer.Id != undefined) {
                showloading();

                var Data = remittanceAmendmentOrderService.getRemittanceAmendmentApplication($scope.order, $scope.amendmentReasons[$scope.order.AmendmentReasonCode]);
            }

            ShowPDF(Data);
        }
        else if (type == 2) {
            if ($scope.orderDetails.Transfer.Id != undefined) {

                showloading();

                var Data = remittanceAmendmentOrderService.getRemittanceAmendmentApplication($scope.order, $scope.orderDetails.BeneficiaryMiddleName);
            }

            ShowPDF(Data);
        }

    };

}]);