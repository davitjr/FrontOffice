app.controller("CardLimitChangeOrderCtrl", ['$scope', '$filter', 'cardLimitChangeOrderService', '$http', function ($scope, $filter, cardLimitChangeOrderService, $http) {
    const CardLimitTypeEnum = {
        "DailyCashingAmountLimit": 4,
        "DailyCashingQuantityLimit": 3,
        "DailyPaymentsAmountLimit": 8,
        "MonthlyAggregateLimit": 7
    }

    $scope.order = {};
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    $scope.nothingChecked = true;

    //Վերադարձնում է հայտի տեսակները։
    $scope.GetCardLimitChangeOrderActionTypes = function () {
        var Data = cardLimitChangeOrderService.GetCardLimitChangeOrderActionTypes();
        Data.then(function (acc) {
            $scope.SubTypes = acc.data;
        }, function () {
            alert('Error GetCardLimitChangeOrderActionTypes');
        });
    }

    $scope.SaveCardLimitChangeOrder = function () {
        if ($http.pendingRequests.length == 0) {
            //CheckBox validation
            if (($scope.order.SubType == 2 && $scope.DailyCashingQuantityLimitChecked == false && $scope.DailyCashingAmountLimitChecked == false && $scope.DailyPaymentsAmountLimitChecked == false && $scope.MonthlyAggregateLimitChecked == false)
                || ($scope.order.SubType == 1 && $scope.nothingChecked)) {
                showMesageBoxDialog('Առկա չէ ընտրված լիմիտ', $scope, 'error')
                return;
            }
            document.getElementById("cardLimitChangeOrderLoad").classList.remove("hidden");


            class CardLimit {
                constructor(limit, limitValue) {
                    this.Limit = limit;
                    this.LimitValue = limitValue;
                }
            }

            if ($scope.order.SubType == 1) {
                switch (true) {
                    case $scope.DailyCashingAmountLimitChecked:
                        $scope.order.Limits = [new CardLimit(CardLimitTypeEnum.DailyCashingAmountLimit, $scope.order.dailyCashingAmountLimit)];
                        break;
                    case $scope.DailyCashingQuantityLimitChecked:
                        $scope.order.Limits = [new CardLimit(CardLimitTypeEnum.DailyCashingQuantityLimit, $scope.order.dailyCashingQuantityLimit)];
                        break;
                    case $scope.DailyPaymentsAmountLimitChecked:
                        $scope.order.Limits = [new CardLimit(CardLimitTypeEnum.DailyPaymentsAmountLimit, $scope.order.dailyPaymentsAmountLimit)];
                        break;
                    case $scope.MonthlyAggregateLimitChecked:
                        $scope.order.Limits = [new CardLimit(CardLimitTypeEnum.MonthlyAggregateLimit, $scope.order.monthlyAggregateLimit)];
                        break;
                }
            }

            if ($scope.order.SubType == 2) {
                $scope.order.Limits = [];

                if ($scope.DailyCashingAmountLimitChecked) {
                    $scope.order.Limits.push(new CardLimit(CardLimitTypeEnum.DailyCashingAmountLimit, $scope.order.dailyCashingAmountLimit));
                }
                if ($scope.DailyCashingQuantityLimitChecked) {
                    $scope.order.Limits.push(new CardLimit(CardLimitTypeEnum.DailyCashingQuantityLimit, $scope.order.dailyCashingQuantityLimit));
                }
                if ($scope.DailyPaymentsAmountLimitChecked) {
                    $scope.order.Limits.push(new CardLimit(CardLimitTypeEnum.DailyPaymentsAmountLimit, $scope.order.dailyPaymentsAmountLimit));
                }
                if ($scope.MonthlyAggregateLimitChecked) {
                    $scope.order.Limits.push(new CardLimit(CardLimitTypeEnum.MonthlyAggregateLimit, $scope.order.monthlyAggregateLimit));
                }
            }

            $scope.order.CardNumber = $scope.Card.CardNumber;

            var Data = cardLimitChangeOrderService.SaveCardLimitChangeOrder($scope.order);
            Data.then(function (res) {
                if (validate($scope, res.data) && (res.data.ResultCode == 1)) {
                    document.getElementById("cardLimitChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Ուշադրություն', $scope, 'information');
                    CloseBPDialog('cardLimitChangeOrder');
                }
                else {
                    document.getElementById("cardLimitChangeOrderLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function () {
                document.getElementById("cardLimitChangeOrderLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error SaveCardLimitChangeOrder');
            });
        }
        else {
            ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    //Համապատասխանաբար վերադարձնում է լիմիտների արժեքները։
    $scope.GetCardLimits = function () {
        var Data = cardLimitChangeOrderService.GetCardLimits($scope.Card.ProductId);
        Data.then(function (acc) {
            var obj = acc.data;

            for (var key in acc.data) {
                switch (key) {
                    case String(CardLimitTypeEnum.DailyCashingAmountLimit):
                        $scope.order.dailyCashingAmountLimit = obj[key];
                        break;
                    case String(CardLimitTypeEnum.DailyCashingQuantityLimit):
                        $scope.order.dailyCashingQuantityLimit = obj[key];
                        break;
                    case String(CardLimitTypeEnum.DailyPaymentsAmountLimit):
                        $scope.order.dailyPaymentsAmountLimit = obj[key];
                        break;
                    case String(CardLimitTypeEnum.MonthlyAggregateLimit):
                        $scope.order.monthlyAggregateLimit = obj[key];
                        $scope.monthlyAggregateLimitValue = obj[key];
                        break;
                }
            }
        }, function () {
            alert('Error GetCardLimits');
        });
    };

    //Շտապ տարբերակի դեպքում ստուգում է, որ ընտրված լինի մեկ checkbox
    $scope.RemoveOtherCheckBoxes = function (number, value) {
        switch (number) {
            case 1:
                $scope.DailyCashingQuantityLimitChecked = false;
                $scope.DailyPaymentsAmountLimitChecked = false;
                $scope.MonthlyAggregateLimitChecked = false;
                break;
            case 2:
                $scope.DailyCashingAmountLimitChecked = false;
                $scope.DailyPaymentsAmountLimitChecked = false;
                $scope.MonthlyAggregateLimitChecked = false;
                break;
            case 3:
                $scope.DailyCashingQuantityLimitChecked = false;
                $scope.DailyCashingAmountLimitChecked = false;
                $scope.MonthlyAggregateLimitChecked = false;
                break;
            case 4:
                $scope.DailyCashingQuantityLimitChecked = false;
                $scope.DailyCashingAmountLimitChecked = false;
                $scope.DailyPaymentsAmountLimitChecked = false;
                break;
        }
        $scope.nothingChecked = !value;
    };


    //Տեսակի փոփոխության ժամանակ հեռացնում է նախորդ ընտրված checkbox-ները
    $scope.ClearCheckedBoxes = function () {
        $scope.DailyCashingQuantityLimitChecked = false;
        $scope.DailyCashingAmountLimitChecked = false;
        $scope.DailyPaymentsAmountLimitChecked = false;
        $scope.MonthlyAggregateLimitChecked = false;
    }


    $scope.dailyCashingAmountLimit;
    $scope.dailyCashingQuantityLimit;
    $scope.dailyPaymentsAmountLimit;
    $scope.monthlyAggregateLimit;

    $scope.GetCardLimitChangeOrder = function (selectedOrder) {
        $scope.order = null;
        var Data = cardLimitChangeOrderService.GetCardLimitChangeOrder(selectedOrder);
        Data.then(function (acc) {
            $scope.order = acc.data;

            console.log($scope.order);

            

            for (var i = 0; i < $scope.order.Limits.length; i++) {

                if ($scope.order.Limits[i].Limit == CardLimitTypeEnum.DailyCashingAmountLimit) {
                    $scope.dailyCashingAmountLimit = $scope.order.Limits[i].LimitValueString;
                }

                if ($scope.order.Limits[i].Limit == CardLimitTypeEnum.DailyCashingQuantityLimit) {
                    $scope.dailyCashingQuantityLimit = $scope.order.Limits[i].LimitValueString;
                }

                if ($scope.order.Limits[i].Limit== CardLimitTypeEnum.DailyPaymentsAmountLimit) {
                    $scope.dailyPaymentsAmountLimit = $scope.order.Limits[i].LimitValueString;
                }

                if ($scope.order.Limits[i].Limit == CardLimitTypeEnum.MonthlyAggregateLimit) {
                    $scope.monthlyAggregateLimit = $scope.order.Limits[i].LimitValueString;
                }
            }

        }, function () {
            alert('Error GetCardLimitChangeOrder');
        });
    }
}]);
