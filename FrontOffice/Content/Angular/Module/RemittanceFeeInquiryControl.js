angular.module('RemittanceFeeInuqiryControl', [])
    .directive('remittancefeeinuqiry', [function () {
        return {
            scope: {
                callback: '&',
                close: '&'
            },
            templateUrl: '../Content/Controls/RemittanceFeeInuqiry.html',
            link: function (scope, element, attr) {
                $(".modal-dialog").draggable();
                scope.feeData = {};
                scope.error = [];

                scope.selectFee = function () {
                    scope.callback({ feeData: scope.feeData });
                };

                scope.closeRemittanceFeeInquiryModal = function () {
                    scope.close();
                };


                scope.searchParams = {
                    SendingCountryCode: "",
                    PrincipalAmount: "",
                    PromotionCode: "",
                    PayOutAgentCode: ""
                };

            },
            controller: ['$scope', '$element', 'dateFilter', '$uibModal', 'infoService', function ($scope, $element, dateFilter, $uibModal, infoService) {

                $scope.btnFindClick = function () {
                    $scope.error = [];
                    $scope.getRemittanceFeeData();
                };


                $scope.getRemittanceFeeData = function () {
              
                    $.ajax({
                        url: "../Remittance/GetRemittanceFeeData",
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
                                $scope.feeData = response.RemittanceFeeData;
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
                                feeData = {};
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                            }


                        }
                        , error: function (xhr) {
                            feeData = {};
                            console.log("error");
                            console.log(xhr);
                            ShowMessage('Տեղի ունեցավ սխալ։', 'error');
                        }
                    });

                    return false;
                }

                $scope.getMTOList = function () {
                    var Data = infoService.getARUSMTOList();
                    Data.then(function (c) {
                        $scope.MTOList = c.data;
                    },
                        function () {
                            alert('Error getMTOList');
                        });

                };

                $scope.getPayoutDeliveryCodes = function () {
                    var Data = infoService.getARUSPayoutDeliveryCodes($scope.searchParams.MTOAgentCode);
                    Data.then(function (c) {
                        $scope.payoutDeliveryCodes = c.data;
                    },
                        function () {
                            alert('Error getPayoutDeliveryCodes');
                        });

                };

                $scope.getSendingCurrencies = function () {
                    if ($scope.searchParams.MTOAgentCode != undefined && $scope.searchParams.MTOAgentCode != '') {
                        var Data = infoService.getARUSSendingCurrencies($scope.searchParams.MTOAgentCode);
                        Data.then(function (c) {
                            $scope.currencies = c.data;                 
                        },
                            function () {
                                alert('Error getSendingCurrencies');
                            });
                    }
                };

                $scope.getCountries = function () {
                    if ($scope.searchParams.MTOAgentCode != undefined && $scope.searchParams.MTOAgentCode != '') {
                        var Data = infoService.getARUSCountriesByMTO($scope.searchParams.MTOAgentCode);
                        Data.then(function (c) {
                            $scope.countries = c.data;
                        },
                            function () {
                                alert('Error getCountries');
                            });
                    }

                };

            }
            ]
        };
    }]);


