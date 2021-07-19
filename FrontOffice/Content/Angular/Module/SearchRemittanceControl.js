angular.module('SearchRemittanceControl', [])
    .directive('searchremittance', [function () {
        return {
            scope: {
                callback: '&',
                close: '&'
            },
            templateUrl: '../Content/Controls/SearchRemittance.html',
            link: function (scope, element, attr) {
                $(".modal-dialog").draggable();
                scope.remittanceDetails = {};
                scope.error = [];

                scope.selectRemittance = function () {
                    scope.callback({ remittanceDetails: scope.remittanceDetails });
                };

                scope.closeRemittanceDetailsModal = function () {
                    scope.close();
                };


                scope.searchParams = {
                    URN: "" 
                };

            },
            controller: ['$scope', '$element', 'dateFilter', '$uibModal', function ($scope, $element, dateFilter, $uibModal) {

            
                $scope.btnFindClick = function () {
                    $scope.error = [];
                    $scope.getRemittanceDetailsByURN();
                };


                $scope.getRemittanceDetailsByURN = function () {

                    //showloading();
                    //document.getElementById("searchRemittanceLoad").classList.remove("hidden");
                    $.ajax({
                        url: "../Remittance/GetRemittanceDetailsByURN",
                        type: 'GET',
                        dataType: 'json',
                        cache: false,
                        async: true,
                        data: $scope.searchParams,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (response) {
                            if (validate($scope, response.ActionResult)) {
                                $scope.remittanceDetails = response.RemittanceDetails;
                                $scope.selectedRow = 0;
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                                if (response.ActionResult != undefined && response.ActionResult.ResultCode == 7) {
                                    var info = "";
                                    for (var i = 0; i < response.ActionResult.Errors.length; i++) {
                                        info += response.ActionResult.Errors[i].Description + '\n';
                                    }
                                    ShowMessage(info, 'information', $scope.path);
                                }

                            }
                            else {
                                remittanceDetails = {};
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                            }
                            

                        }
                        , error: function (xhr) {
                            remittanceDetails = {};
                            console.log("error");
                            console.log(xhr);
                            ShowMessage('Տեղի ունեցավ սխալ։', 'error');
                        }
                    });

                    return false;
                }

                $scope.openRemittanceWholeDetailsModal = function () {
                    $scope.searchRemittanceDetailsModalInstance = $uibModal.open({

                        template: '<remittancewholedetails remittancedetails="remittanceDetails" close="closeRemittanceWholeDetailsModal()"></remittancewholedetails>',
                        scope: $scope,
                        backdrop: true,
                        backdropClick: true,
                        dialogFade: false,
                        keyboard: false,
                        backdrop: 'static',
                    });
                };

                $scope.closeRemittanceWholeDetailsModal = function () {
                    $scope.searchRemittanceDetailsModalInstance.close();
                };


            }
            ]
        };
    }]);


