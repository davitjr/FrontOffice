app.controller("SecuritiesMarketTradingOrderCtrl", ['$scope', 'securitiesMarketTradingOrderService', 'infoService', '$http', function ($scope, securitiesMarketTradingOrderService, infoService, $http) {

    $scope.saveOrder = {};

    $scope.SaveAndApproveSecuritiesMarketTradingOrder = function () {

        showloading();
        var Data = securitiesMarketTradingOrderService.SaveAndApproveSecuritiesMarketTradingOrder($scope.saveOrder);
        Data.then(function (res) {
            hideloading();
            if (validate($scope, res.data)) {
                document.getElementById("SecuritiesMarketTradingOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                CloseBPDialog('oneSecuritieTradingDetailsList');
            }
            else {
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }

        }, function () {
            hideloading();
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            alert('Error SaveAndApproveSecuritiesMarketTradingOrder');
        });
    };

    $scope.InitSecuritiesMarketTradingOrder = function (securitiesTrading) {
        $scope.saveOrder.FullName = securitiesTrading.FullName;
        $scope.saveOrder.Type = securitiesTrading.Type;
        $scope.saveOrder.TypeDescription = securitiesTrading.TypeDescription;
        $scope.saveOrder.TradingOrderType = securitiesTrading.TradingOrderType;
        $scope.saveOrder.ISIN = securitiesTrading.ISIN;
        $scope.saveOrder.OrderId = securitiesTrading.OrderId;
        $scope.saveOrder.TransactionPlace = 'Հայաստանի ֆոնդային բորսա ԲԲԸ';
        $scope.saveOrder.CustomerNumber = securitiesTrading.CustomerNumber;
        $scope.saveOrder.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        $scope.saveOrder.BrokerageCode = securitiesTrading.BrokerageCode;
        $scope.saveOrder.ReferenceNumber = securitiesTrading.ReferenceNumber;
        $scope.saveOrder.TradingOrderTypeDescription = securitiesTrading.TradingOrderTypeDescription;
        $scope.saveOrder.Quantity = securitiesTrading.Quantity;
        
    };

    $scope.updateTotalVolume = function () {
        $scope.saveOrder.TotalVolume = $scope.saveOrder.UnitAmount * $scope.saveOrder.ActuallyQuantity;
    };

    $scope.updateResidualQuantity = function () {
        $scope.saveOrder.ResidualQuantity = $scope.saveOrder.ActuallyQuantity - $scope.saveOrder.Quantity;
    };


    
    $scope.GetSecuritiesMarketTradingOrder = function (orderId) {
        var Data = securitiesMarketTradingOrderService.GetSecuritiesMarketTradingOrder(orderId);
        Data.then(function (securitiesMarketTradingOrder) {
            $scope.orderDetails = securitiesMarketTradingOrder.data;
        }, function () {
            alert('Error GetSecuritiesMarketTradingOrder');
        });
    };

}]);