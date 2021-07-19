app.controller("PhoneBankingContractCtrl", ['$scope', 'dialogService', '$filter', "customerService", '$http', '$q', '$uibModal', 'infoService', 'phoneBankingContractService', '$confirm', '$state', 'HBActivationOrderService', function ($scope, dialogService, $filter, customerService, $http, $q, $uibModal, infoService, phoneBankingContractService, $confirm, $state, HBActivationOrderService) {
    
    $scope.order = {};
    
    $scope.setContractNumber = function (id) {
        var Data = infoService.getGlobalLastKeyNumber(id);
        Data.then(function(key) {
                $scope.order.ContractNumber = key.data;
            },
            function() {
                console.log('error keynumber');
            });
    }


    $scope.setOrderType = function () {
        if ($scope.order.Type != 127)
        {
            $scope.order.Type = 126;
        }
       
    };

    var Data = customerService.getAuthorizedCustomerNumber();
    Data.then(function(res) {
        $scope.customerNumber = res.data;
    });



    $scope.getPhoneBankingContract = function () {
        $scope.loading = true;
        var Data = phoneBankingContractService.getPhoneBankingContract();
        Data.then(function (app) {
            $scope.phoneBankingContract = app.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getPhoneBankingContract');
        });
    }

    $scope.getCustomerMainData = function () {      
        var Data = customerService.getCustomerMainData($scope.customerNumber);
        Data.then(function(customerData) {
                $scope.customerMainData = customerData.data;

                if ($scope.customerMainData.Phones != undefined) {
                    for (var i = 0; i < $scope.customerMainData.Phones.length; i++) {
                        if ($scope.customerMainData.Phones[i].phoneType.key != 1) {
                            $scope.customerMainData.Phones.splice(i, 1);
                            i = i - 1;
                        }
                    }
                }


            },
            function() {
                console.log('error getCustomerMainData');
            });
    }

    $scope.getPhoneBankingContractQuestions = function () {
        var Data = infoService.getPhoneBankingContractQuestions();
        Data.then(function(res) {
                $scope.questionsList = res.data;
            },
            function() {
                console.log('error getPhoneBankingContractQuestions');
            });
    }

    $scope.saveQuestionAnswer = function () {
        if ($http.pendingRequests.length == 0) {

            var refreshScope = angular.element(document.getElementById('PhoneBankingContractOrderForm')).scope();
            if (refreshScope != undefined) {

                var QuestionAnswer = { QuestionId: $scope.Question.key, QuestionDescription: $scope.Question.value, Answer: $scope.Answer };
                if (refreshScope.order.QuestionAnswers == undefined) {
                    refreshScope.order.QuestionAnswers = [];
                }
                else if (refreshScope.order.QuestionAnswers.some(e => e.QuestionId == QuestionAnswer.QuestionId)) {
                    return ShowMessage('Տվյալ հարցը մուտքագրված է։', 'error');
                }

                refreshScope.order.QuestionAnswers.push(QuestionAnswer);
            }

            document.getElementById("questionAnswerLoad").classList.remove("hidden");

            document.getElementById("questionAnswerLoad").classList.add("hidden");
            CloseBPDialog('newquestionanswer');

        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.setClickedRow = function (index, questionAnswer) {
        $scope.selectedRow = index;
        $scope.selectedQuestionAnswer = questionAnswer;
    };

    $scope.removeQuestionAnswer = function (questionAnswer) {
        for (var i = 0; i < $scope.order.QuestionAnswers.length; i++) {
            if ($scope.order.QuestionAnswers[i].QuestionId == questionAnswer.QuestionId) {
                $scope.order.QuestionAnswers.splice(i, 1);
                break;
            }
        }
    };

    $scope.savePhoneBankingContractOrder = function () {
        if ($http.pendingRequests.length == 0) {
            $scope.setOrderType();

            if ($scope.order.OneTransactionLimitToAnothersAccount == null || $scope.order.OneTransactionLimitToAnothersAccount == "")
            {
                $scope.order.OneTransactionLimitToAnothersAccount = $scope.order.DayLimitToAnothersAccount;
            }
            if ($scope.order.OneTransactionLimitToOwnAccount == null || $scope.order.OneTransactionLimitToOwnAccount == "")
            {
                $scope.order.OneTransactionLimitToOwnAccount = $scope.order.DayLimitToOwnAccount;
            }
            document.getElementById("phoneBankingContractLoad").classList.remove("hidden");
            var Data = phoneBankingContractService.savePhoneBankingContractOrder($scope.order);
                Data.then(function (res) {

                    if (validate($scope, res.data)) {
                        document.getElementById("phoneBankingContractLoad").classList.add("hidden");
                        CloseBPDialog('newphonebankingcontractorder');
                        window.location.href = location.origin.toString() + '#/Orders';
                        showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                        refresh(7);
                    }
                    else {
                        document.getElementById("phoneBankingContractLoad").classList.add("hidden");
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }

                }, function (err) {
                    document.getElementById("phoneBankingContractLoad").classList.add("hidden");
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                    alert('Error savePhoneBankingContractOrder');
                });
            }
        
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

  

    $scope.getPhoneBankingContractPDF = function () {
        showloading();
        var Data = phoneBankingContractService.getPhoneBankingContractPDF();
        ShowPDF(Data);
    };

    $scope.getPhoneBankingContractClosingPDF = function () {
        showloading();
        var Data = phoneBankingContractService.getPhoneBankingContractClosingPDF();
        ShowPDF(Data);
    };

    $scope.setPhoneBankingContractOrder = function () {
       
        $scope.order.RegistrationDate = new Date();
        $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;

        if ($scope.phoneBankingContractForEdit != undefined && $scope.setPhoneBankingContractOrder != null)
        {
            $scope.order.Type = 127;
            $scope.order.DayLimitToOwnAccount = $scope.phoneBankingContractForEdit.DayLimitToOwnAccount;
            $scope.order.DayLimitToAnothersAccount = $scope.phoneBankingContractForEdit.DayLimitToAnothersAccount;
            $scope.order.QuestionAnswers = [];
            for (var i = 0; i < $scope.phoneBankingContractForEdit.QuestionAnswers.length; i++)
            {
                $scope.order.QuestionAnswers[i] = $scope.phoneBankingContractForEdit.QuestionAnswers[i];
            }
           
            $scope.order.ContractNumber = $scope.phoneBankingContractForEdit.ContractNumber;
            $scope.order.OneTransactionLimitToOwnAccount = $scope.phoneBankingContractForEdit.OneTransactionLimitToOwnAccount;
            $scope.order.OneTransactionLimitToAnothersAccount = $scope.phoneBankingContractForEdit.OneTransactionLimitToAnothersAccount;
            $scope.order.PhoneId = $scope.phoneBankingContractForEdit.Phone.id;
            $scope.order.EmailId = $scope.phoneBankingContractForEdit.Email.id;

        }
        else
        {    
            $scope.order.DayLimitToOwnAccount = 10000000;
            $scope.order.DayLimitToAnothersAccount = 1500000;
            $scope.order.Type = 126;

            if ($scope.order.ContractNumber == undefined) {
                $scope.setContractNumber(78);
            }
        }
        
    };

    $scope.getPhoneBankingContractOrder = function (orderId) {
        var Data = phoneBankingContractService.getPhoneBankingContractOrder(orderId);
        Data.then(function (result) {
            $scope.order = result.data;
        }, function () {
            alert('Error getPhoneBankingContractOrder');
        });
    };

    $scope.openPhoneBankingContractDetails = function () {
        $state.go('phonebankingcontractdetails', { phoneBankingContract: $scope.phoneBankingContract });
    };
   
        
    $scope.getPhoneBankingRequests = function () {
        var Data = HBActivationOrderService.getPhoneBankingRequests();
        Data.then(function (cData) {
            if (cData.data.Id != 0) {
                $scope.hasPBRequests = true;
            }
        }, function () {
            alert('Error getPhoneBankingRequests');
        });
    }
}]);