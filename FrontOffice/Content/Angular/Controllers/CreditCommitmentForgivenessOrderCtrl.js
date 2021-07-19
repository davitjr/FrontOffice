app.controller("CreditCommitmentForgivenessOrderCtrl", ['$scope', 'CreditCommitmentForgivenessOrderService', 'infoService', '$http', '$confirm', function ($scope, CreditCommitmentForgivenessOrderService, infoService, $http, $confirm) {
    $scope.creditCommitmentForgivenessList = [];
    $scope.Save = [];
    //$scope.DateForHimq = date.now();
    $scope.SaveFilter = {
        DateOfFoundation: new Date(),
    };

    $scope.TotalForAll2 = 0;
    $scope.NumberFormat = 2;

    $scope.getForgivableLoanCommitment = function (productId, loanType) {
        showloading();
        $scope.loading = true;
        $scope.SaveFilter.AppId = productId;
        $scope.SaveFilter.LoanType = loanType;
        var Data = CreditCommitmentForgivenessOrderService.getForgivableLoanCommitment(productId, loanType);
        Data.then(function (creditCommitmentForgiveness) {
            $scope.creditCommitmentForgivenessList = creditCommitmentForgiveness.data;
            $scope.SaveFilter.DateOfDeath = $scope.creditCommitmentForgivenessList.DateOfDeathToString;
            $scope.SaveFilter.NumberOfDeath = $scope.creditCommitmentForgivenessList.NumberOfDeath;
            if ($scope.creditCommitmentForgivenessList.LoanQuality != 11 && $scope.creditCommitmentForgivenessList.LoanQuality != 12) {
                $scope.TotalForAll1 = $scope.creditCommitmentForgivenessList.CurrentFee + $scope.creditCommitmentForgivenessList.JudgmentPenaltyRate + $scope.creditCommitmentForgivenessList.PenaltyRate + $scope.creditCommitmentForgivenessList.CurrentRateValue + $scope.creditCommitmentForgivenessList.CurrentCapital;
            }
            else {
                $scope.TotalForAll1 = $scope.creditCommitmentForgivenessList.CurrentFee + $scope.creditCommitmentForgivenessList.JudgmentPenaltyRate + $scope.creditCommitmentForgivenessList.PenaltyRate + $scope.creditCommitmentForgivenessList.CurrentRateValue + $scope.creditCommitmentForgivenessList.OutCapital;
            }
            if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                $scope.NumberFormat = 1;
            }
            $scope.Total1 = $scope.creditCommitmentForgivenessList.CurrentFee;
            $scope.Total2 = $scope.creditCommitmentForgivenessList.JudgmentPenaltyRate;
            $scope.Total3 = $scope.creditCommitmentForgivenessList.PenaltyRate;
            $scope.Total4 = $scope.creditCommitmentForgivenessList.CurrentRateValue;
            $scope.Total5 = $scope.creditCommitmentForgivenessList.CurrentCapital; 
            $scope.Total6 = $scope.creditCommitmentForgivenessList.OutCapital;
            $scope.Total7 = $scope.creditCommitmentForgivenessList.CurrentRateValueNused;
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;
            hideloading();
        },
            function () {
                hideloading();
                $scope.loading = false;
                alert('Error getForgivableLoanCommitment');
            });
    };


    $scope.getCreditCommitmentForgiveness = function (orderId) {
        var Data = CreditCommitmentForgivenessOrderService.getCreditCommitmentForgiveness(orderId);
        Data.then(function (acc) {
            $scope.orderDetails = acc.data;
        }, function () {
            alert('Error getCreditCommitmentForgiveness');
        });

    };

    $scope.saveForgivableLoanCommitment = function () {
        $scope.SaveFilter.LoanFilialCode = $scope.creditCommitmentForgivenessList.LoanFilialCode;
        if ($scope.TotalForAll2 == 0) {
            showMesageBoxDialog('Հնարավոր չէ պահպանել բոլոր արժեքները 0 են', $scope, 'error');
        }
        else {
            if ($http.pendingRequests.length == 0) {
                $confirm({ title: 'Շարունակե՞լ', text: 'Պահպանե՞լ հայտը' })
                    .then(function () {
                        showloading();

                        $scope.SaveFilter.Type = 208;
                var Data = CreditCommitmentForgivenessOrderService.saveForgivableLoanCommitment($scope.SaveFilter);
                Data.then(function (res) {
                    if (validate($scope, res.data)) {
                        hideloading();
                        document.getElementById("CreditCommitmentForgivenessLoad").classList.add("hidden");
                        showMesageBoxDialog('Պահպանումը կատարված է', $scope, 'information');
                        CloseBPDialog('newMature');
                    }
                    else {
                        hideloading();
                        document.getElementById("CreditCommitmentForgivenessLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        
                    }
                },
                    function (err) {
                        hideloading();
                        document.getElementById("CreditCommitmentForgivenessLoad").classList.add("hidden");
                        if (err.status != 420) {
                            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        }
                        alert('Error saveForgivableLoanCommitment');
                    });

                    });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

            }
        }
    };
    $scope.TotalForAll3 = 0;
   

    $scope.SaveFilter.CurrentFee = parseFloat(0).toFixed(1);
    $scope.SaveFilter.JudgmentPenaltyRate = parseFloat(0).toFixed(1);
    $scope.SaveFilter.PenaltyRate = parseFloat(0).toFixed(1);
    $scope.SaveFilter.CurrentRateValue = parseFloat(0).toFixed(1);
    $scope.SaveFilter.CurrentCapital = parseFloat(0).toFixed(1);
    $scope.SaveFilter.OutCapital = parseFloat(0).toFixed(1);
    $scope.SaveFilter.CurrentRateValueNused = parseFloat(0).toFixed(1);
    $scope.updateTotal = function (Value1, Value2, num) {
        
        if (num == 1) {
            if ($scope.SaveFilter.CurrentFee == undefined) {
                $scope.SaveFilter.CurrentFee = 0;
                $scope.Total1 = $scope.creditCommitmentForgivenessList.CurrentFee;
            }
            else {
                $scope.Total1 = Value1 - Number(Value2);
                
                $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);
            }
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;
        }
        if (num == 2) {
            if ($scope.SaveFilter.JudgmentPenaltyRate == undefined) {
                $scope.SaveFilter.JudgmentPenaltyRate = 0;
                $scope.Total2 = $scope.creditCommitmentForgivenessList.JudgmentPenaltyRate;
            }
            else {
                $scope.Total2 = Value1 - Number(Value2);
                
                $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);
            }
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;
        }
        if (num == 3) {
            if ($scope.SaveFilter.PenaltyRate == undefined) {
                $scope.SaveFilter.PenaltyRate = 0;
                $scope.Total3 = $scope.creditCommitmentForgivenessList.PenaltyRate;
            }
            else {
                $scope.Total3 = Value1 - Number(Value2);
                
                $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);
            }
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;
        }
        if (num == 4) {
            if ($scope.SaveFilter.CurrentRateValue == undefined) {
                $scope.SaveFilter.CurrentRateValue =  0;
                $scope.Total4 = $scope.creditCommitmentForgivenessList.CurrentRateValue;
            }
            else {
                $scope.Total4 = Value1 - Number(Value2);
                
                $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);
            }
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;

        }
        if (num == 5) {
            if ($scope.SaveFilter.CurrentCapital == undefined) {
                $scope.SaveFilter.CurrentCapital = 0;
                $scope.Total5 = $scope.creditCommitmentForgivenessList.CurrentCapital;
            }
            else {
                $scope.Total5 = Value1 - Number(Value2);
                
                $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);
            }
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;
        }
        if (num == 6) {
            if ($scope.SaveFilter.OutCapital == undefined) {
                $scope.SaveFilter.OutCapital = 0;
                $scope.Total6 = $scope.creditCommitmentForgivenessList.OutCapital;
            }
            else {
                $scope.Total6 = Value1 - Number(Value2);
                
                $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);
            }
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;
        }
        if (num == 7) {
            if ($scope.SaveFilter.CurrentRateValueNused == undefined) {
                $scope.SaveFilter.CurrentRateValueNused = 0;
                $scope.Total7 = $scope.creditCommitmentForgivenessList.CurrentRateValue;
            }
            else {
                $scope.Total7 = Value1 - Number(Value2);
                
                $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);
            }
            $scope.TotalForAll3 = $scope.Total1 + $scope.Total2 + $scope.Total3 + $scope.Total4 + $scope.Total5 + $scope.Total6;
        }
        $scope.TotalForAll2 = Number($scope.SaveFilter.CurrentFee) + Number($scope.SaveFilter.JudgmentPenaltyRate) + Number($scope.SaveFilter.PenaltyRate) + Number($scope.SaveFilter.CurrentRateValue) + Number($scope.SaveFilter.CurrentCapital) + Number($scope.SaveFilter.OutCapital) + Number($scope.SaveFilter.CurrentRateValueNused);

    }

    $scope.resetFields = function (value, num) {

        switch (num) {
            case 1:
                if (value == undefined || value == null) {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentFee = parseFloat(0).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentFee = parseFloat(0).toFixed(2);
                    }
                }
                else {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentFee = parseFloat($scope.SaveFilter.CurrentFee).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentFee = parseFloat($scope.SaveFilter.CurrentFee).toFixed(2);
                    }
                }
                break;
            case 2:
                if (value == undefined || value == null) {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.JudgmentPenaltyRate = parseFloat(0).toFixed(1);
                    } else {
                        $scope.SaveFilter.JudgmentPenaltyRate = parseFloat(0).toFixed(2);
                    }
                }
                else {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.JudgmentPenaltyRate = parseFloat($scope.SaveFilter.JudgmentPenaltyRate).toFixed(1);
                    } else {
                        $scope.SaveFilter.JudgmentPenaltyRate = parseFloat($scope.SaveFilter.JudgmentPenaltyRate).toFixed(2);
                    }
                }
                break;
            case 3:
                if (value == undefined || value == null) {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.PenaltyRate = parseFloat(0).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.PenaltyRate = parseFloat(0).toFixed(2);
                    }
                }
                else {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.PenaltyRate = parseFloat($scope.SaveFilter.PenaltyRate).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.PenaltyRate = parseFloat($scope.SaveFilter.PenaltyRate).toFixed(2);
                    }
                }
                break;
            case 4:
                if (value == undefined || value == null) {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentRateValue = parseFloat(0).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentRateValue = parseFloat(0).toFixed(2);
                    }
                }
                else {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentRateValue = parseFloat($scope.SaveFilter.CurrentRateValue).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentRateValue = parseFloat($scope.SaveFilter.CurrentRateValue).toFixed(2);
                    }
                }
                break;
            case 5:
                if (value == undefined || value == null) {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentCapital = parseFloat(0).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentCapital = parseFloat(0).toFixed(2);
                    }
                }
                else {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentCapital = parseFloat($scope.SaveFilter.CurrentCapital).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentCapital = parseFloat($scope.SaveFilter.CurrentCapital).toFixed(2);
                    }
                }
                break;
            case 6:
                if (value == undefined || value == null) {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.OutCapital = parseFloat(0).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.OutCapital = parseFloat(0).toFixed(2);
                    }
                }
                else {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.OutCapital = parseFloat($scope.SaveFilter.OutCapital).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.OutCapital = parseFloat($scope.SaveFilter.OutCapital).toFixed(2);
                    }
                }
                break;
            case 7:
                if (value == undefined || value == null) {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentRateValueNused = parseFloat(0).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentRateValueNused = parseFloat(0).toFixed(2);
                    }
                }
                else {
                    if ($scope.creditCommitmentForgivenessList.Currency == "AMD") {
                        $scope.SaveFilter.CurrentRateValueNused = parseFloat($scope.SaveFilter.CurrentRateValueNused).toFixed(1);
                    }
                    else {
                        $scope.SaveFilter.CurrentRateValueNused = parseFloat($scope.SaveFilter.CurrentRateValueNused).toFixed(2);
                    }
                    $scope.SaveFilter.CurrentRateValueNused = parseFloat($scope.SaveFilter.CurrentRateValueNused).toFixed(1);
                }
                break;
        }
    };

    $scope.ClearInputData = function () {
        $scope.SaveFilter.NumberOfFoundation = undefined;
    };

    $scope.getTaxForForgiveness = function (capital, rebateType) {
        var Data = CreditCommitmentForgivenessOrderService.getTaxForForgiveness(capital, rebateType, $scope.creditCommitmentForgivenessList.Currency);
        Data.then(function (acc) {
            $scope.taxForForgiveness = acc.data;
        }, function () {
            alert('Error getCreditCommitmentForgiveness');
        });

    };
    
}]);