app.controller("LoanMonitoringConclusionCtrl", ['$scope', 'loanMonitoringConclusionService', '$rootScope', 'infoService', 'casherService', '$http', '$confirm', function ($scope, loanMonitoringConclusionService, $rootScope, infoService, casherService, $http, $confirm) {

    if ($scope.isUpdate!=true) {
        $scope.monitoring = {};
        $scope.FactorsDescription = '';
        //$scope.monitoringFactors = [];
        $scope.monitoring.MonitoringDate = $scope.$root.SessionProperties.OperationDate;
        
    }


    try {
        $scope.canAddLoanMonitoringConclusion = $scope.$root.SessionProperties.AdvancedOptions["canAddLoanMonitoringConclusion"];
        
    }
    catch (ex) {
        $scope.canAddLoanMonitoringConclusion = "0";
    }

    try {
        $scope.canDeleteLoanMonitoringConclusion = $scope.$root.SessionProperties.AdvancedOptions["canDeleteLoanMonitoringConclusion"];

    } catch (e) {
        $scope.canDeleteLoanMonitoringConclusion = "0";
    }

    

    $scope.saveLoanMonitoring = function () {
        if ($http.pendingRequests.length == 0) {

            document.getElementById("loanMonitoringLoad").classList.remove("hidden");
            $scope.monitoring.LoanProductId = $scope.loanProductId;
            
            var Data = loanMonitoringConclusionService.saveLoanMonitoring($scope.monitoring);
            Data.then(function (res) {
                if (validate($scope, res.data)) {
                    document.getElementById("loanMonitoringLoad").classList.add("hidden");

                    CloseBPDialog('newloanmonitoring');
                    var monitoringsScope = angular.element(document.getElementById('loanMonitorings')).scope();
                    monitoringsScope.getLoanMonitorings($scope.monitoring.LoanProductId);
                }
                else
                {
                    document.getElementById("loanMonitoringLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function (err) {
                $scope.ResultCode = undefined;
                document.getElementById("loanMonitoringLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveMonitoring');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }

    $scope.approveLoanMonitoring = function () {
        $confirm({
                title: 'Ուշադրություն',
                text: 'Հաստատելու դեպքում տվյալներն այլևս խմբագրման ենթակա չեն լինի:Շարունակե՞լ:'
            })
            .then(function() {
                if ($http.pendingRequests.length == 0) {

                    document.getElementById("loanMonitoringLoad").classList.remove("hidden");
                    $scope.monitoring.LoanProductId = $scope.loanProductId;
                    var Data = loanMonitoringConclusionService.approveLoanMonitoring($scope.monitoring);
                    Data.then(function(res) {
                            if (validate($scope, res.data)) {
                                document.getElementById("loanMonitoringLoad").classList.add("hidden");

                                CloseBPDialog('newloanmonitoring');
                                var monitoringsScope =
                                    angular.element(document.getElementById('loanMonitorings')).scope();
                                monitoringsScope.getLoanMonitorings($scope.monitoring.LoanProductId);
                            } else {
                                document.getElementById("loanMonitoringLoad").classList.add("hidden");
                                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                                var monitoringsScope =
                                    angular.element(document.getElementById('loanMonitorings')).scope();
                                monitoringsScope.getLoanMonitorings($scope.monitoring.LoanProductId);
                            }


                        },
                        function(err) {
                            $scope.ResultCode = undefined;
                            document.getElementById("loanMonitoringLoad").classList.add("hidden");
                            if (err.status != 420) {
                                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                            }
                            alert('Error saveMonitoring');
                        });
                } else {
                    return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Հաստատել>> կոճակը:',
                        'error');

                }
            });
    }

    $scope.deleteLoanMonitoring = function () {
        if ($http.pendingRequests.length == 0) {

            var Data = loanMonitoringConclusionService.deleteLoanMonitoring($scope.selectedConclusion);
            Data.then(function (res) {

                showMesageBoxDialog('Եզրակացությունը հեռացված է', $scope, 'information');
                $scope.getLoanMonitorings($scope.loan.ProductId);

            }, function (err) {
                $scope.ResultCode = undefined;
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }
                alert('Error saveMonitoring');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }

    }






    $scope.getMonitoringTypes = function () {

        var Data = infoService.getLoanMonitoringTypes();
        Data.then(function (types) {
            $scope.monitoringTypes = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.getLoanMonitoringFactorGroupes = function () {

        var Data = infoService.getLoanMonitoringFactorGroupes();
        Data.then(function (types) {
            $scope.factorGroupes = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.getLoanMonitoringFactors = function () {

        var Data = infoService.getLoanMonitoringFactors();
        Data.then(function (types) {
            $scope.factors = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.getProfitReductionTypes = function () {

        var Data = infoService.getProfitReductionTypes();
        Data.then(function (types) {
            $scope.reductionTypes = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.getProvisionCostConclusionTypes = function () {

        var Data = infoService.getProvisionCostConclusionTypes();
        Data.then(function (types) {
            $scope.provCostConclusions = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.getProvisionQualityConclusionTypes = function () {

        var Data = infoService.getProvisionQualityConclusionTypes();
        Data.then(function (types) {
            $scope.provQualityConclusions = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.getLoanMonitorings = function (productId) {

        var Data = loanMonitoringConclusionService.getLoanMonitorings(productId);
        Data.then(function (mon) {
            $scope.loanMonitorings = mon.data;

            
        }, function () {
            alert('Error');
        });
    };

    $scope.getLoanMonitoringConclusion = function (monitoringId,isUpdate) {

        var Data = loanMonitoringConclusionService.getLoanMonitoringConclusion(monitoringId, $scope.loanProductId);
        Data.then(function (mon) {
            $scope.monitoring = mon.data;
            if (isUpdate==true) {
                $scope.monitoring.MonitoringDate = moment($scope.monitoring.MonitoringDate)._d;
                $scope.monitoring.ProfitReductionSize = $scope.monitoring.ProfitReductionSize * 100;
                if ($scope.monitoring.ProvisionCoverCoefficient==0) {
                    $scope.monitoring.ProvisionCoverCoefficient = null;
                }
                else {
                    $scope.monitoring.ProvisionCoverCoefficient = $scope.monitoring.ProvisionCoverCoefficient * 100;
                }
                
                $scope.monitoring.Conclusion = $scope.monitoring.Conclusion.toString();
                $scope.monitoring.MonitoringType = $scope.monitoring.MonitoringType.toString();
                $scope.monitoring.MonitoringSubType = $scope.monitoring.MonitoringSubType.toString();
                if ($scope.monitoring.ProfitReduced == true) {
                    $scope.monitoring.ProfitReduceType = $scope.monitoring.ProfitReduceType.toString();
                }
                else
                {
                    $scope.monitoring.ProfitReductionSize = null;
                    $scope.monitoring.ProfitReduceType = null;
                }
                
                for (var i = 0; i < $scope.monitoring.ProvisionQualityConclusion.length; i++) {
                    $scope.monitoring.ProvisionQualityConclusion[i] = $scope.monitoring.ProvisionQualityConclusion[i].toString();
                }
                $scope.monitoring.ProvisionCostConclusion = $scope.monitoring.ProvisionCostConclusion.toString();
            }
            else {
                $scope.selectedConclusion = mon.data;
                if ($scope.selectedConclusion.ProvisionCoverCoefficient == 0) {
                    $scope.selectedConclusion.ProvisionCoverCoefficient = null;
                }
                else {
                    $scope.selectedConclusion.ProvisionCoverCoefficient = $scope.selectedConclusion.ProvisionCoverCoefficient * 100;
                }
            }
            

        }, function () {
            alert('Error');
        });
    };

    $scope.getLoanMonitoringType = function () {
        if ($scope.isUpdate != true) {
            var Data = loanMonitoringConclusionService.getLoanMonitoringType();
            Data.then(function (user) {
                $scope.monitoring.MonitoringType = user.data.toString();

            }, function () {
                alert('Error');
            });
        }
    }


    $scope.getUserDescription = function () {
         
        Data = casherService.getUserDescription();
             Data.then(function (c) {
                 $scope.MonitoringSetNumberDescription = c.data + ' [' + $scope.$root.SessionProperties.UserId +' ՊԿ]';

            }, function () {
                alert('getCashier');
            });
    };


    $scope.getLoanMonitoringConclusions = function () {

        var Data = infoService.getLoanMonitoringConclusions();
        Data.then(function (types) {
            $scope.conclusions = types.data;

        }, function () {
            alert('Error');
        });
    };


    $scope.getLinkedLoans = function () {
        if ($scope.isUpdate != true) {
            var Data = loanMonitoringConclusionService.getLinkedLoans($scope.loanProductId);
            Data.then(function (types) {
                $scope.monitoring.LinkedMonitoringLoans = types.data;

            }, function () {
                alert('Error');
            });
        }
    };

    $scope.getProvisionCoverCoefficient = function () {

        var Data = loanMonitoringConclusionService.getProvisionCoverCoefficient($scope.loanProductId);
        Data.then(function (types) {
            $scope.monitoring.ProvisionCoverCoefficient = types.data;

        }, function () {
            alert('Error');
        });
    };

    $("#loanmonitoringform div.bhoechie-tab-menu>div.list-group>div").click(function (e) {
        e.preventDefault();
        $(this).siblings('#loanmonitoringform div.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("#loanmonitoringform div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("#loanmonitoringform div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
    });

    $scope.getLoanMonitoringFactorsForTree = function () {
        var Data = infoService.getLoanMonitoringFactorsForTree(0);
        Data.then(function (types) {
            $scope.treeFactors = types.data;
            for (var i = 0; i < $scope.monitoringFactors.length; i++) {
                for (var k = 0; k < $scope.treeFactors.length; k++) {
                    if ($scope.treeFactors[k].Factors.findIndex(x=>x.Key === $scope.monitoringFactors[i].FactorId.toString()) != -1) {
                        $scope.treeFactors[k].Factors[$scope.treeFactors[k].Factors.findIndex(x=>x.Key === $scope.monitoringFactors[i].FactorId.toString())].Selected = true;
                    }
                }
            }
        }, function () {
            alert('Error');
        });
    };
    



    $scope.selectFactor = function (factor) {
        if ($scope.monitoringFactors==undefined) {
            $scope.monitoringFactors = [];
        }

        $scope.selectedFactor = { FactorId: factor.Key, FactorDescription: factor.Value,Selected:factor.Selected };
        if (factor.Selected) {
            factor.Selected = false;
            $scope.monitoringFactors.splice(
                $scope.monitoringFactors.findIndex(x => x.FactorId.toString() === $scope.selectedFactor.FactorId),
                1);

        }
        else {
            factor.Selected = true;
            $scope.monitoringFactors.push($scope.selectedFactor);
        }
    }

    $scope.saveMonitoringFactors = function () {

        for (var i = 0; i < $scope.monitoringFactors.length; i++) {
            $scope.FactorsDescription += $scope.monitoringFactors[i].FactorDescription + ', ';
        }


        var newMonitoringScope = angular.element(document.getElementById('loanmonitoringform')).scope();
        newMonitoringScope.monitoring.MonitoringFactors = $scope.monitoringFactors;
        newMonitoringScope.monitoring.MonitoringFactorsDescription = $scope.FactorsDescription;
        CloseBPDialog('monitoringFactors');
    }

    $scope.setClickedRow = function (index, selectedConclusion, loanProductId) {
        $scope.selectedRow = index;
        $scope.loanProductId = loanProductId;
        $scope.selectedConclusion = selectedConclusion;
    }

    $scope.getMonitoringSubTypes = function () {

        var Data = infoService.getLoanMonitoringSubTypes();
        Data.then(function (types) {
            $scope.monitoringSubTypes = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.hasPropertyProvision = function () {

        var Data = loanMonitoringConclusionService.hasPropertyProvision($scope.loanProductId);
        Data.then(function (types) {
            $scope.hasProv = types.data;

        }, function () {
            alert('Error');
        });
    };

    $scope.isLawDivision = function () {

        var Data = loanMonitoringConclusionService.isLawDivision();
        Data.then(function (types) {
            $scope.isLaw = types.data;

        }, function () {
            alert('Error');
        });
    };

}])