app.controller('FinancialPlanningCtrl', ['$scope', 'FinancialPlanningService', 'casherService', '$filter', '$rootScope', '$uibModal', '$confirm', 'infoService', function ($scope, FinancialPlanningService, casherService, $filter, $rootScope, $uibModal, $confirm, infoService) {
    if (document.getElementById("readFile") != undefined)
        document.getElementById("readFile").required = true;

    $rootScope.OpenMode = 9;

    $scope.FinancialPlanning = {

    };

    $scope.tabDescription = function (target) {
        if (target.TargetType != 4) {
            return target.Description;
        }
        else {
            return target.Description + ' ՊԿ';
        }
    };

    $scope.document = {};

    var reader = new FileReader();
    reader.onload = function () {
        var data = reader.result;
        var cfb = XLS.CFB.read(data, { type: 'binary' });
        var wb = XLS.parse_xlscfb(cfb);
        var document = {};
        document["Targets"] = [];
        var fillial = wb.Sheets[wb.SheetNames[0]]["F6"].v;

        wb.SheetNames.forEach(function (sheetName) {
            if (targets.indexOf(sheetName) != -1 || sheetName.indexOf("#") == 0) {
                var targetID;
                var targetType;
                if (sheetName.indexOf("#") == 0) {
                    targetID = sheetName.replace(/#/g, "");
                    targetType = targetTypes["Individual"];
                }
                else {
                    targetID = targetTypes[sheetName];
                    targetType = targetTypes[sheetName];
                }

                var columns = ["D", "E", "F", "G", "H"];

                var target = {};
                target.TargetID = targetID;
                target.TargetType = targetType;
                target.Filial = fillial;
                target.PlanningIndicators = [];

              
                for (let i = 0; i < Object.keys(columns).length; i++)
                {
                    var column = Object.keys(columns)[i];
                    var planningIndicator = {};
                    if (columns[column] == "D") {
                        planningIndicator.Type = 1;
                    }
                    else {
                        planningIndicator.Type = 2;
                    }

                    planningIndicator.Date = wb.Sheets[sheetName][columns[column] + "6"]["w"];

                    //planningIndicator["Type"] = IndicatorDetails["PlanningIndicator"]["Type"];
                    planningIndicator["PlanningIndicatorGroups"] = [];
                    var planningIndicatorGroups = planningIndicator["PlanningIndicatorGroups"];

                    var indDetails = IndicatorDetails["PlanningIndicator"];
                    for (let i = 0; i < Object.keys(indDetails).length;i++) {

                        var planning = Object.keys(indDetails)[i];

                        if (planning != "Type") {
                            var planningIndicatorGroup = {};
                            planningIndicatorGroup["Type"] = indDetails[planning]["Type"];

                            planningIndicatorGroup["PlanningIndicatorDetails"] = [];

                            var plnData = planningIndicatorGroup["PlanningIndicatorDetails"];
                            var planningDataDetails = indDetails[planning]["PlanningIndicatorDetails"];

                            for (let j = 0; j < planningDataDetails.length;j++) {

                                var columnDataDetails = planningDataDetails[j]["ColumnData"];

                                var pData = {};
                                pData["Type"] = planningDataDetails[j]["Type"];

                               
                                for (let k = 0; k < Object.keys(columnDataDetails).length;k++) {
                                        var cell = wb.Sheets[sheetName][columns[column] + columnDataDetails[Object.keys(columnDataDetails)[k]]["RowNumber"]];
                                    if (cell != undefined) {
                                        pData[columnDataDetails[Object.keys(columnDataDetails)[k]]["PropertyName"]] = cell["v"];
                                    }
                                }
                                plnData.push(pData);
                            }
                            planningIndicatorGroups.push(planningIndicatorGroup);
                        }
                    }
                    target.PlanningIndicators.push(planningIndicator);
                }
                document["Targets"].push(target);
            }
        });

        document.financialPlanningType = $scope.financialPlanningType;
        var formData = new FormData();
        formData.append("document", JSON.stringify(document));
        formData.append("file", readFile.files[0]);

        var Data = FinancialPlanningService.SaveFinancialPlaning(formData);
        Data.then(function (res) {
            if (validate($scope, res.data)) {
                CloseBPDialog('addFinancialPlanning');
                ShowToaster('Գործողությունը կատարված է', 'success');
            }
            else {
                showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
            }
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    }

    $scope.SaveFinancialPlaning = function () {
        reader.readAsBinaryString(readFile.files[0]);
    };

    $scope.checkFile = function () {
        if (document.getElementById("readFile") != undefined) {
            return readFile.files[0] == undefined;
        }
    };

    $scope.GetPlanningTypes = function () {
        var Data = FinancialPlanningService.GetPlanningTypes();
        Data.then(function (res) {
            $scope.planningTypes = res.data;
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.GetFinancialPlanningTypes = function () {
        var Data = FinancialPlanningService.GetFinancialPlanningTypes();
        Data.then(function (res) {
            $scope.financialPlanningTypes = res.data;
            $scope.document.financialPlanningType = 1;
            $scope.financialPlanningType = 1;
        }, function () {
            showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
        });
    };

    $scope.GetFinancialPlanning = function () {
        if ($scope.document.financialPlanningType != undefined && $scope.filialCode != undefined && $scope.filialCode.trim().length > 0 && $scope.year != undefined) {
            var Data = FinancialPlanningService.GetFinancialPlanning($scope.document, $scope.year, $scope.filialCode, $scope.setNumber);
            Data.then(function (res) {
                $scope.financialPlanning = res.data;
                $scope.fillTable();
            }, function () {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            });
        }
    };

    $scope.fillTable = function () {
        for (var t = 0; t < $scope.financialPlanning.Targets.length; t++) {
            var currentTarget = $scope.financialPlanning.Targets[t];
            currentTarget.planningTypes = angular.copy($scope.planningTypes);
            var currentPlanningType = currentTarget.planningTypes;

            var table = {};

            for (var i = 0; i < currentTarget.PlanningIndicators.length; i++) {
                var currIndicator = currentTarget.PlanningIndicators[i];
                table[currIndicator.ID] = {};
                for (var j = 0; j < currIndicator.PlanningIndicatorGroups.length; j++) {
                    var currGroup = currIndicator.PlanningIndicatorGroups[j];
                    for (var k = 0; k < currGroup.PlanningIndicatorDetails.length; k++) {
                        var currIndDetails = currGroup.PlanningIndicatorDetails[k];
                        table[currIndicator.ID][currIndDetails.Type] = currIndDetails;
                    }
                }
            }

            for (var i = 0; i < currentPlanningType.length; i++) {
                var currPlanningType = currentPlanningType[i];
                for (var j = 0; j < currPlanningType.SubTypes.length; j++) {
                    var currsubType = currPlanningType.SubTypes[j];
                    for (var k = 0; k < currsubType.Measures.length; k++) {
                        var currMeasure = currsubType.Measures[k];
                        currMeasure.values = [];
                        for (var n = 0; n < currentTarget.PlanningIndicators.length; n++) {
                            var currIndicator = currentTarget.PlanningIndicators[n];
                            if (currIndicator.ID != undefined) {
                                var value = table[currIndicator.ID][currsubType.ID][propertyMatchTable[currMeasure.ID]] == null ? ""
                                    : table[currIndicator.ID][currsubType.ID][propertyMatchTable[currMeasure.ID]];
                                currMeasure.values.push(value);
                                if (value != undefined && value != '') {
                                    currPlanningType.Visible = true;
                                    currsubType.Visible = true;
                                }
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < currentPlanningType.length; i++) {
                var currPlanningType = currentPlanningType[i];
                if (currPlanningType.Measures.length != 0) {
                    for (var j = 0; j < currPlanningType.SubTypes.length; j++) {
                        var currsubType = currPlanningType.SubTypes[j];
                        for (var k = 0; k < currsubType.Measures.length; k++) {
                            var currMeasure = currsubType.Measures[k];
                            if (currPlanningType.Measures[k].values == undefined) {
                                currPlanningType.Measures[k].values = [];
                            }
                            for (var m = 0; m < currMeasure.values.length; m++) {
                                var value = currMeasure.values[m];
                                if (currPlanningType.Measures[k].values[m] == undefined) {
                                    currPlanningType.Measures[k].values.push(value);
                                }
                                else {
                                    if(value != ''){
                                        currPlanningType.Measures[k].values[m] =Number(currPlanningType.Measures[k].values[m]) + value;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            for (var i = 0; i < currentPlanningType.length; i++) {
                var currPlanningType = currentPlanningType[i];

                if (currPlanningType.Parent == null)
                    continue;

                for (var n = 0; n < currentPlanningType.length; n++) {
                    if (currentPlanningType[n].ID == currPlanningType.Parent) {
                        var parent = currentPlanningType[n];
                    }
                }

                for (var k = 0; k < currPlanningType.Measures.length; k++) {
                    var currMeasure = currPlanningType.Measures[k];
                    var currParentMeasure = parent.Measures[k];
                    if (currParentMeasure.values == undefined) {
                        currParentMeasure.values = [];
                    }
                    for (var m = 0; m < currMeasure.values.length; m++) {
                        var value = currMeasure.values[m];
                        if (currParentMeasure.values[m] == undefined) {
                            currParentMeasure.values.push(value);
                        }
                        else {
                            if(value != ''){
                                currParentMeasure.values[m] = Number(currParentMeasure.values[m]) + value;
                            }
                        }
                        if (value != undefined && value != '') {
                            parent.Visible = true;
                        }
                    }
                }
            }
        }
    }

    $scope.today = function () {
        $scope.year = new Date();
    };
    $scope.today();

    $scope.clear = function () {
        $scope.year = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    //$scope.toggleMin = function () {
    //    $scope.minDate = new Date(1990, 5, 22);
    //};
    //$scope.toggleMin();

    //$scope.maxDate = new Date(2100, 5, 22);
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.dateOptions = {
        datepickerMode: "'year'",
        minMode: 'year',
        minDate: 'minDate',
        showWeeks: 'false'
    };

    $scope.formats = ['yyyy'];
    $scope.format = $scope.formats[0];

    $scope.searchCashiers = function () {
        $scope.searchCashiersModalInstance = $uibModal.open({
            template: '<searchcashier callback="getSearchedCashier(cashier)" close="closeSearchCashiersModal()"></searchcashier>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });
    }

    $scope.getSearchedCashier = function (cashier) {
        $scope.setNumber = cashier.setNumber;
        $scope.closeSearchCashiersModal();
    };

    $scope.closeSearchCashiersModal = function () {
        $scope.searchCashiersModalInstance.close();
    };

    $scope.changeTab = function ($event) {
        $event.preventDefault();
        $($event.target).siblings('#financialPlanningForm div.active').removeClass("active");
        $($event.target).addClass("active");
        var index = $($event.target).index();
        $("#financialPlanningForm div .bhoechie-tab>.bhoechie-tab-content").removeClass("active");
        $("#financialPlanningForm div .bhoechie-tab>.bhoechie-tab-content").eq(index).addClass("active");
    };

    $scope.getFilialList = function () {

        var Data = infoService.GetFilialList();
        Data.then(function (acc) {
            $scope.filialList = acc.data;
            $scope.getUserFilialCode();
        }, function () {
            alert('Error getFilialList');
        });
    };

    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.changeFilial = $scope.$root.SessionProperties.AdvancedOptions.canChangeFinancialPlanningFilial;
            if ($scope.changeFilial == "0") {
                $scope.filialCode = ref.data.toString();
            }
        }, function () {
            alert('Error getUserFilialCode');
        });
    };

    $scope.getUserID = function () {
        var Data = casherService.getUserID();
        Data.then(function (user) {
            $scope.changeSetNumber = $scope.$root.SessionProperties.AdvancedOptions.canChangeFinancialPlanningSetNumber;
            $rootScope.uploadPlanningFile = $scope.$root.SessionProperties.AdvancedOptions.canUploadFiles;
            if ($scope.changeSetNumber == "0") {
                $scope.setNumber = user.data;
            }
        }, function () {
            alert('Error getUserID');
        });
    };
}]);