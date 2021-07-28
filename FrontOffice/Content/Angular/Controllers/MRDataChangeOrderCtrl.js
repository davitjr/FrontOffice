app.controller("MRDataChangeOrderCtrl", ['$scope', 'MRDataChangeOrderService', '$location', 'dialogService', '$confirm', 'infoService', '$state', 'dateFilter', 'ReportingApiService', function ($scope, MRDataChangeOrderService, $location, dialogService, $confirm, infoService, $state, dateFilter, ReportingApiService) {
 
    $scope.saveMRDataChangeOrder = function () {

        var a = $scope.$parent;
        if ($scope.changes.changedServiceFeeReal == undefined || $scope.changes.changedServiceFeeReal == null) {
            showMesageBoxDialog("Խնդրում ենք լրացնել վճարման ենթակա գումարը", $scope, 'error');
        }
        else {
            $confirm({ title: 'Շարունակե՞լ', text: 'Պահպանե՞լ փոփոխությունը' })
                .then(function () {
                    showloading();
                    $scope.order = {};
                    $scope.order.MRId = $scope.cardMR.Id;
                    $scope.order.DataChangeAccount = {};
                    $scope.order.DataChangeAccount.AccountNumber = $scope.accountnumber;
                    $scope.order.DataChangeAccount.Currency = $scope.currency;
                    $scope.order.DataChangeCard = {};
                    $scope.order.DataChangeCard.CardNumber = $scope.cardnumber;
                    $scope.order.ServiceFee = $scope.changes.changedServiceFeeReal;
                    $scope.order.Type = 253;

                    var Data = MRDataChangeOrderService.postMRDataChangeOrder($scope.order);
                    Data.then(function (res) {
                        if (res.data.Errors.length == 0) {
                            hideloading();
                            $scope.$parent.isEdit = false;
                            $scope.$parent.mrDataChange = true;
                            showMesageBoxDialog('Տվյալների խմբագրումը կատարված է', $scope, 'information');   
                            $scope.$parent.reloadData();

                        }
                        else {
                            hideloading();
                            showMesageBoxDialog(res.data.Errors[0].Description, $scope, 'error');
                        }

                    }, function () {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error postMRDataChangeOrder');
                        hideloading();
                    });
                });
        }

    };




}]); 