app.controller("TaxRefundAgreementCtrl", ['$scope', 'taxRefundService', '$state', '$confirm', '$http', function ($scope, taxRefundService, $state, $confirm, $http) {
    $scope.quarters = [{
        key: 1,
        value: 'I'
    }, {
        key: 2,
        value: 'II'
    }, {
        key: 3,
        value: 'III'
    }, {
        key: 4,
        value: 'IV'
    }];

    $scope.selectedQuarters = {};
    $scope.isValidQuarter = false;
    $scope.requestYear = new Date().getFullYear();

    $scope.selectAll = function () {
        angular.forEach($scope.quarters, function (item) {
            item.Selected = $scope.selectedAll;
        });
    };

    $scope.isCheckedQuarter = function () {
        for (var i = 0; i < $scope.quarters.length; ++i) {
            if ($scope.quarters[i].Selected) {
                $scope.isValidQuarter = true;
                $scope.TaxRefundRequestSendForm.$valid = true;
                return;
            }

        }
        $scope.isValidQuarter = false;
        $scope.TaxRefundRequestSendForm.$valid = false;
        return;

    };

    $scope.hasAgreements = function (borrowers) {
        for (var i = 0; i < $scope.borrowers.length; ++i) {
            if ($scope.borrowers[i].AgreementExistence) {
                return true;
            }
        }
        return false;
    };

    $scope.saveTaxRefundAgreementDetails = function (customerNumber, productId, checked) {
        if ($http.pendingRequests.length == 0) {
            var agreementExistence = (checked == undefined) ? 0 : checked;
            var message = (agreementExistence == 1) ?
                'Նշումը կատարելու դեպքում վարկի տոկոսագումարների մարման վերաբերյալ տեղեկատվությունը կփոխանցվի ՊԵԿ, համոզվեք, որ առկա է համաձայնագիր'
                : 'Նշումը հանելու դեպքում վարկի տոկոսագումարների մարման վերաբերյալ տեղեկատվությունն այլևս չի փոխանցվի ՊԵԿ'

            $confirm({ title: 'Հաստատե՞լ', text: message })
                .then(function () {
                    showloading();
                    var Data = taxRefundService.saveTaxRefundAgreementDetails(customerNumber, productId, agreementExistence);
                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data)) {
                            ShowToaster('Փոփոխությունը կատարված է', 'success');
                        }
                        else {
                            $scope.showError = true;
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }
                        refresh('RefreshAgreementExistanceChange');
                    }, function (acc) {
                        hideloading();
                        if (err.status != 420) {
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        }
                    });
                }, function () {
                    refresh('RefreshAgreementExistanceChange');
                });
        }
        else {
            refresh('RefreshAgreementExistanceChange');
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.send = function (borrowers, productid, requestYear) {
        if ($scope.hasAgreements(borrowers)) {
            $scope.sendRequest(productid, requestYear);
        } else {
            ShowMessage('Անհրաժեշտ է ստուգել Համաձայնության առկայություն բաժնում նշումի առկայությունը', 'error');
        }
    };
    $scope.sendRequest = function (productid, requestYear) {
        if ($http.pendingRequests.length == 0) {
            $confirm({ title: 'Շարունակե՞լ', text: 'Ուղարկե՞լ ՊԵԿ' })
                .then(function () {
                    let selectedQuarters = [];

                    angular.forEach($scope.quarters, function (quarter) {
                        if (quarter.Selected) {
                            selectedQuarters.push(parseInt(quarter.key));
                        }
                    });

                    let requestParams = {
                        MassSending: false,
                        ProductId: productid,
                        Year: requestYear,
                        Quarters: selectedQuarters
                    }

                    showloading();
                    var Data = taxRefundService.sendTaxRefundRequest(requestParams);
                    Data.then(function (res) {
                        if (validate($scope, res.data)) {
                            hideloading();
                            ShowMessage('Տվյալները հաջողությամբ ուղարկվել են', 'information');

                        }
                        else {
                            hideloading();
                            ShowMessage('Առկա է խնդիր։ Տվյալները չեն ուղարկվել։', $scope, 'error');
                        }
                    }, function () {
                        hideloading();
                        ShowMessage('Տեղի ունեցավ սխալ', 'error');
                        alert('Error SendTaxRefundRequest');
                    });
                });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getTaxRefundAgreementHistory = function (agreementId) {
        var Data = taxRefundService.getTaxRefundAgreementHistory(agreementId);
        Data.then(function (acc) {
            $scope.history = acc.data;
        }, function () {
            alert('Error getTaxRefundAgreementHistory');
        });
    };

}]);