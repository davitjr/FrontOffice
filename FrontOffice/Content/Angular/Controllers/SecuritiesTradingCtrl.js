app.controller("SecuritiesTradingCtrl", ['$scope', 'securitiesTradingService', 'infoService', '$http', '$confirm', function ($scope, securitiesTradingService, infoService, $http, $confirm) {

    $scope.SecuritieTradingsList = [];
    $scope.securitieTradingsFilter = {
        StartDate: new Date(),
        EndDate: new Date(),
    };
    $scope.SecuritiesOrderDetails = { };
    $scope.RejectOrder = {};
    $scope.currentPage = 1;
    $scope.numPerPage = 100;
    $scope.maxSize = 5;
    $scope.totalRows = 0;
    $scope.checkAccessToSecuritiesTranding = $scope.$root.SessionProperties.AdvancedOptions["checkAccessToSecuritiesTranding"];
    $scope.checkAccessToDepositedSecuritiesTranding = $scope.$root.SessionProperties.AdvancedOptions["checkAccessToDepositedSecuritiesTranding"];
    $scope.checkAccessToSaveOrRejectSecuritiesTranding = $scope.$root.SessionProperties.AdvancedOptions["checkAccessToSaveOrRejectSecuritiesTranding"];



    $scope.$watch('currentPage', function () {
        $scope.securitieTradingsFilter.Page = $scope.securitieTradingsFilter.Row + 1;
    });
    
    $scope.GetSentSecuritiesTradingOrders = function () {
        showloading();
        var Data = securitiesTradingService.GetSentSecuritiesTradingOrders($scope.securitieTradingsFilter);
        Data.then(function (securitiesTrading) {
            $scope.SecuritieTradingsList = securitiesTrading.data;

            $scope.GetSecuritiesTradingLenght();
            $scope.ShowRows = $scope.SecuritieTradingsList.length;

            $scope.totalRows = $scope.securitiesTradingLenght;
            if ($scope.totalRows / $scope.numPerPage > 0) {
                $scope.maxSize = 5;
            }
            else {
                $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
            }
            hideloading();

        }, function () {
            hideloading();
            alert('Error GetSecuritiesTrading');
        });
    };

    $scope.GetSentSecuritiesTradingOrdersSort = function () {
        showloading();
        $scope.securitieTradingsFilter.FromCach = 1;
        var Data = securitiesTradingService.GetSentSecuritiesTradingOrders($scope.securitieTradingsFilter);
        Data.then(function (securitiesTrading) {
            $scope.SecuritieTradingsList = securitiesTrading.data;
            $scope.securitieTradingsFilter.FromCach = 0;

            $scope.GetSecuritiesTradingLenght();
            $scope.ShowRows = $scope.SecuritieTradingsList.length;

            $scope.totalRows = $scope.securitiesTradingLenght;
            if ($scope.totalRows / $scope.numPerPage > 0) {
                $scope.maxSize = 5;
            }
            else {
                $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
            }
            hideloading();

        }, function () {
            hideloading();
            alert('Error GetSecuritiesTrading');
        });
    };

    $scope.GetSecuritiesTradingsPagination = function () {
        showloading();
        var Data = securitiesTradingService.GetSentSecuritiesTradingOrders($scope.securitieTradingsFilter);
        Data.then(function (securitiesTrading) {
            $scope.SecuritieTradingsList = securitiesTrading.data;
            $scope.GetSecuritiesTradingLenght();
            $scope.ShowRows = securitiesTrading.data.length;
            hideloading();
        },
            function () {
                hideloading();
                $scope.loading = false;
                alert('Error GetSecuritiesTradingsPagination');
            });
    };

    $scope.GetSecuritiesTradingLenght = function () {
        var Data = securitiesTradingService.GetSecuritiesTradingLenght();
        Data.then(function (Lenght) {
            $scope.securitiesTradingLenght = Lenght.data;

            $scope.totalRows = $scope.securitiesTradingLenght;
            if ($scope.totalRows / $scope.numPerPage > 5) {
                $scope.maxSize = 5;
            }
            else {
                $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
            }
        }, function () {
            alert('Error GetSecuritiesTradingLenght');
        });
    };

    $scope.GetOrderQualityTypes = function () {
            $scope.qualityTypes = {
                "50": "Հաստատման ենթակա",
                "60": "Դիտարկվում է աշխատակցի կողմից",
                "30": "Կատարված է",
                "20": "Մասնակի կատարված",
                "31": "Մերժված է",
                "32": "Հրաժարված"
            };
    };


    $scope.GetSharesTypes = function () {
        var Data = infoService.getSecuritiesTypes();
        Data.then(function (types) {
            $scope.sharesTypes = types.data;
        }, function () {
            alert('Error GetSecuritiesTypes');
        });
    };


    $scope.GetSecuritiesTradingOrderTypes = function () {
        var Data = infoService.getTradingOrderTypes();
        Data.then(function (types) {
            $scope.securitiesTradingOrderTypes = types.data;
        }, function () {
            alert('Error GetSecuritiesTradingOrderTypes');
        });
    };


    $scope.GetTradingOrderExpirationTypes = function () {
        var Data = infoService.getTradingOrderExpirationTypes();
        Data.then(function (types) {
            $scope.expirationType = types.data;
        }, function () {
            alert('Error GetTradingOrderExpirationTypes');
        });
    };

    //$scope.GetSecuritiesTradingOrderTypes = function () {
    //    $scope.securitiesTradingOrderTypes = {
    //        "1": "Շուկայական",
    //        "2": "Լիմիտային",
    //        "3": "Ստոպ",
    //        "4": "Ստոպ լիմիտային"
    //    };
    //};

    //$scope.GetSharesTypes = function () {
    //    $scope.sharesTypes = {
    //        "1": "Պարտատոմսեր",
    //        "2": "Բաժնետոմսեր"
    //    };
    //};

    $scope.GetCurrencyTypes = function () {
        $scope.Currencys = {
            "AMD": "AMD",
            "USD": "USD"
        };
    };

    $scope.GetOrderTypes = function () {
        $scope.orderTypes = {
            "261": "Առք",
            "262": "Վաճառք",
            "265": "Չեղարկում"
        };
    };

    $scope.GetSortTypes = function () {
        $scope.SortBy = {
            "0": "Դասական",
            "1": "Գումարի աճման",
            "2": "Գումարի նվազման",
            "3": "Ամսաթվի աճման",
            "4": "Ամսաթվի նվազման"
        };
    };


    $scope.setClickedRowDealing = function (index) {
        $scope.selectedRow = index;
        $scope.SecuritiesTrading = $scope.SecuritieTradingsList[index];
    };

    $scope.GetSentSecuritiesTradingOrder = function (type, orderId) {
        showloading();
        var Data = securitiesTradingService.GetSentSecuritiesTradingOrder(type, orderId);
        Data.then(function (securitiesTrading) {
            $scope.SecuritiesOrderDetails = securitiesTrading.data;
            hideloading();
        }, function () {
            hideloading();
            alert('Error GetSecuritiesTrading');
        });
    };


    $scope.InitConfirmOrRejectSecuritiesTradingOrderCancellationOrder = function (orderId, securitiesTradingOrderId, customerNumber) {
        $scope.RejectOrder.Id = orderId;
        $scope.RejectOrder.SecuritiesTradingOrderId = securitiesTradingOrderId;
        $scope.RejectOrder.CustomerNumber = customerNumber;
    };

    $scope.ConfirmSecuritiesTradingOrderCancellationOrder = function () {
        var Message = 'Համոզվա՞ծ եք, որ ցանկանում եք հաստատել չեղարկման հայտը։ ';
        $confirm({ title: 'Շարունակե՞լ', text: Message })
        .then(function () {
            var Data = securitiesTradingService.ConfirmSecuritiesTradingOrderCancellationOrder($scope.RejectOrder);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("ConfirmSecuritiesTradingOrderCancellationOrder").classList.add("hidden");
                    showMesageBoxDialog('Հայտի չեղարկումը կատարված է', $scope, 'information');
                    CloseBPDialog('oneRejectSecuritiesTradingOrderCancellationOrder');
                }
                else {
                    document.getElementById("ConfirmSecuritiesTradingOrderCancellationOrder").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("ConfirmSecuritiesTradingOrderCancellationOrder").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error ConfirmSecuritiesTradingOrderCancellationOrder');
            });
        });
    };


    $scope.RejectSecuritiesTradingOrderCancellationOrder = function () {
        var Message = 'Համոզվա՞ծ եք, որ ցանկանում եք մերժել չեղարկման հայտը։ ';
        $confirm({ title: 'Շարունակե՞լ', text: Message })
            .then(function () {
                var Data = securitiesTradingService.RejectSecuritiesTradingOrderCancellationOrder($scope.RejectOrder);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        document.getElementById("RejectSecuritiesTradingOrderCancellationOrder").classList.add("hidden");
                        showMesageBoxDialog('Չեղարկման հայտը մերժված է', $scope, 'information');
                        CloseBPDialog('oneRejectSecuritiesTradingOrderCancellationOrder');
                    }
                    else {
                        document.getElementById("RejectSecuritiesTradingOrderCancellationOrder").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    document.getElementById("RejectSecuritiesTradingOrderCancellationOrder").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error RejectSecuritiesTradingOrderCancellationOrder');
                });
            });
    };

    $scope.InitConfirmOrRejectSecuritiesTradingOrder = function (orderId) {
        $scope.SecuritiesOrderDetails.Id = orderId;
    };

    $scope.ConfirmSecuritiesTradingOrder = function () {
        var Message = 'Համոզվա՞ծ եք, որ ցանկանում եք հաստատել հայտը։ ';
        $confirm({ title: 'Շարունակե՞լ', text: Message })
            .then(function () {
                var Data = securitiesTradingService.ConfirmSecuritiesTradingOrder($scope.SecuritiesOrderDetails);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        document.getElementById("ConfirmSecuritiesTradingOrder").classList.add("hidden");
                        showMesageBoxDialog('Հայտը կատարված է', $scope, 'information');
                        CloseBPDialog('ConfirmSecuritiesTradingOrder');
                    }
                    else {
                        document.getElementById("ConfirmSecuritiesTradingOrder").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    document.getElementById("ConfirmSecuritiesTradingOrder").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error ConfirmSecuritiesTradingOrder');
                });
            });
    };

    $scope.RejectSecuritiesTradingOrder = function () {
            var Message = 'Համոզվա՞ծ եք, որ ցանկանում եք մերժել հայտը։ ';
        $confirm({ title: 'Շարունակե՞լ', text: Message })
            .then(function () {
                var Data = securitiesTradingService.RejectSecuritiesTradingOrder($scope.SecuritiesOrderDetails);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        document.getElementById("RejectSecuritiesTradingOrder").classList.add("hidden");
                        showMesageBoxDialog('Հայտը մերժել է', $scope, 'information');
                        CloseBPDialog('oneRejectSecuritiesTradingOrder');
                    }
                    else {
                        document.getElementById("RejectSecuritiesTradingOrder").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    document.getElementById("RejectSecuritiesTradingOrder").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error ConfirmOrRejectSecuritiesTradingOrder');
                });
            });
    };

    $scope.UpdateSecuritiesTradingOrderDeposited = function (docId) {
        var Message = 'Համոզվա՞ծ եք, որ ցանկանում եք դեպոնացնել հայտը։ ';
        $confirm({ title: 'Շարունակե՞լ', text: Message })
            .then(function () {
                var Data = securitiesTradingService.UpdateSecuritiesTradingOrderDeposited(docId);
                Data.then(function () {
                    showMesageBoxDialog('Հայտը դեպոնացված է', $scope, 'information');
                    $scope.SecuritieTradingsList[$scope.selectedRow].IsDeposited = 1;
                }, function () {
                    alert('Error UpdateSecuritiesTradingOrderDeposited');
            });
        });
    };
    

    $scope.GetStockMarketTickers = function () {
        var Data = securitiesTradingService.GetStockMarketTickers();

        Data.then(function (types) {
            $scope.Ticker = types.data;
        }, function () {
            alert('Error GetStockMarketTickers');
        });
    };

}]);