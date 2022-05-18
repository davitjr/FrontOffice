app.controller("BrokerContractOrderCtrl", ['$scope', 'brokerContractService', '$http', 'ReportingApiService', function ($scope, brokerContractService, $http, ReportingApiService) {

    $scope.order = {};
    $scope.order.OrderNumber = "";
    $scope.order.StockToolIds = [];
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.saveBrokerContractOrder = function () {
        ShowMessage('Տվյալ պահին հնարավոր չէ կնքել բրոքերային պայմանագիր', 'information');
        return;
        $scope.order.Type = 263;
        $scope.order.SubType = 1;

        if ($http.pendingRequests.length == 0) {

            document.getElementById("brokerContractLoad").classList.remove("hidden");
            var Data = brokerContractService.generateBrokerContractNumber();
            Data.then(function (rec) {
                $scope.order.ContractId = rec.data;
                var Data = brokerContractService.saveBrokerContractOrder($scope.order);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        $scope.printStocksInvestmentRisksDescription();
                        $scope.printInterestPolicyContract();
                        $scope.printStockBrokerContract($scope.order.ContractId, $scope.order.OperationDate, true);
                        $scope.printBrokerContractQuestionnaire($scope.order.ContractId);
                        document.getElementById("brokerContractLoad").classList.add("hidden");
                        CloseBPDialog('newBrokerContract');
                        $scope.path = '#Orders';
                        ShowMessage('Պայմանգիրը հաջողությամբ կնքվել է', 'information');
                        refresh($scope.order.Type);
                    }
                    else {
                        document.getElementById("brokerContractLoad").classList.add("hidden");
                        $scope.dialogId = 'newBrokerContract';
                        $scope.divId = 'BrokerContractOrderForm';
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function () {
                    document.getElementById("brokerContractLoad").classList.add("hidden");
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    alert('Error saveBrokerContract');
                });
            }, function () {
                document.getElementById("brokerContractLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveBrokerContract');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    }

    $scope.callbackBrokerContractProduct = function () {
        $scope.getBrokerContractProduct();
    }

    $scope.getBrokerContractProduct = function () {
        var Data = brokerContractService.getBrokerContractProduct();
        Data.then(function (dep) {
            $scope.brokerContractProduct = dep.data;
        }, function () {
            alert('Error getBrokerContractProduct');
        });
    };

    $scope.getBrokerContractSurvey = function () {
        var Data = brokerContractService.getBrokerContractSurvey();
        Data.then(function (dep) {
            $scope.brokerContractSurvey = dep.data;
        }, function () {
            alert('Error getBrokerContractSurvey');
        });
    };

    $scope.printBrokerContractQuestionnaire = function (contractId) {
        showloading();
        var Data = brokerContractService.getBrokerContractQuestionnaireDetails(contractId);
        Data.then(function (response) {
            var requestObj = { Parameters: response.data, ReportName: 182, ReportExportFormat: 1 }
            ReportingApiService.getReport(requestObj, function (result) {
                ShowPDFReport(result, 'BrokerContractQuestionnaire');
            });
        }, function () {
            alert('Error getBrokerContractQuestionnaireDetails');
        });
    };

    $scope.printStocksInvestmentRisksDescription = function () {
        showloading();
        var Data = brokerContractService.getStocksInvestmentRisksDescription();
        ShowPDF(Data);
    };


    $scope.printInterestPolicyContract = function () {
        showloading();
        var Data = brokerContractService.getInterestPolicyContract();
        ShowPDF(Data);
    };


    $scope.printStockBrokerContract = function (contractId, registrationDate, fromSave) {
        showloading();
        if(!fromSave)
             date = new Date(parseInt(registrationDate.substr(6)));
        else
            date = registrationDate;

        var Data = brokerContractService.getStockBrokerContract(contractId, date);
        ShowPDF(Data);
    };



    $scope.checkStockTools = function (id, isChecked) {
        if (isChecked == true) {
            $scope.order.StockToolIds.push(id);
        }
        else {
            var myIndex = $scope.order.StockToolIds.indexOf(id);
            if (myIndex !== -1) {
                $scope.order.StockToolIds.splice(myIndex, 1);
            }
        }
    };
}]);
