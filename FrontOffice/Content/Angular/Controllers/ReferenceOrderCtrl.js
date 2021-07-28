app.controller('ReferenceOrderCtrl', ['$scope', 'infoService', 'referenceOrderService', 'paymentOrderService', '$location', 'dialogService', 'orderService', 'feeForServiceProvidedOrderService', '$http', 'casherService', 'customerService', 'ReportingApiService', function ($scope, infoService, referenceOrderService, paymentOrderService, $location, dialogService, orderService, feeForServiceProvidedOrderService, $http, casherService, customerService, ReportingApiService) {
    //$scope.OrderId = 0;
    $scope.reference = {};
    $scope.reference.RegistrationDate = new Date();
    //$scope.reference.ReceiveDate = new Date();
    $scope.reference.Urgent = 0;
    $scope.accounts = "";
    $scope.cashType = 15;
    $scope.orderDetails = {};
    $scope.orderDetails.referenceTypes = [];
    $scope.orderDetails.filialList = [];
    //var currentDate = new Date();
    //$scope.reference.ReceiveDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
    $scope.reference.Type = 20;
    $scope.reference.OperationDate = $scope.$root.SessionProperties.OperationDate;

    $scope.reference.OrderNumber = "";

    $scope.generateNewOrderNumber = function () {
        var Data = orderService.generateNewOrderNumber(1);
        Data.then(function (nmb) {
            $scope.reference.OrderNumber = nmb.data;
        }, function () {
            alert('Error generateNewOrderNumber');
        });
    };


    $scope.getReferenceOrder = function (OrderId) {


        var Data = referenceOrderService.GetReferenceOrder(OrderId);
        Data.then(function (ref) {
            for (var i = 0; i < ref.data.Accounts.length; i++) {
                $scope.accounts += ref.data.Accounts[i].AccountNumber + ' ' + ref.data.Accounts[i].Currency + ' ' + ref.data.Accounts[i].AccountTypeDescription + ",\n";
            }
            $scope.reference = ref.data;
            $scope.getEmbassyList(); $scope.getReferenceTypes(); $scope.getLanguages(); $scope.getFilialList();
        }, function () {
            alert('Error Reference');
        });
    };

    $scope.saveReferenceOrder = function () {
        if ($http.pendingRequests.length == 0) {


            if ($scope.cashType == 14) {
                $scope.reference.FeeAccount = {};
                $scope.reference.FeeAccount.AccountNumber = 0;
            }

            document.getElementById("referenceLoad").classList.remove("hidden");
            $scope.reference.FeeAmount = parseFloat($scope.reference.FeeAmount.toString().replace(",", ""));
            $scope.reference.Fees = [];
            $scope.reference.Fees = [
                {
                    Amount: $scope.reference.FeeAmount,
                    Type: $scope.cashType,
                    Account: $scope.reference.FeeAccount,
                    Currency: 'AMD'
                }
            ];
            var Data = referenceOrderService.SaveReferenceOrder($scope.reference);

            Data.then(function (ref) {

                if (validate($scope, ref.data)) {
                    hideloading();
                    document.getElementById("referenceLoad").classList.add("hidden");
                    CloseBPDialog('newreference');
                    $scope.path = '#Orders';
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');

                }
                else {
                    document.getElementById("referenceLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }
            }, function (err) {
                document.getElementById("referenceLoad").classList.add("hidden");
                if (err.status != 420) {
                    showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                }

                alert('Error saveReference');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');

        }
    };
    $scope.getEmbassyList = function () {
        var Data = infoService.GetEmbassyList($scope.reference.ReferenceTypes);
        Data.then(function (ref) {
            if (Data != null) {
                debugger;
                $scope.embassyList = FillCombo(ref.data);

                for (var i = 0, m = null; i < $scope.embassyList.length; ++i) {
                    if ($scope.embassyList[i].id == $scope.reference.ReferenceEmbasy) {
                        $scope.EmbassyDescription = $scope.embassyList[i];
                        break;
                    }
                }
                $scope.embassyList.splice(26, 1);

                $scope.embassyList.push({
                    id: "27",
                    desc: "Այլ"
                });


                if ($scope.reference.ReferenceTypes == 9) {
                    $scope.reference.ReferenceEmbasy = "30";
                }
            }
            else {
                $scope.embassyList = null;
            }

        }, function () {
            alert('Error EmbassyList');
        });
    };

    $scope.getLanguages = function () {
        var Data = infoService.GetReferenceLanguages();
        Data.then(function (ref) {
            $scope.languages = ref.data;
        }, function () {
            alert('Error Languages');
        });
    };
    $scope.getReferenceTypes = function () {

        var Data = infoService.GetReferenceTypes();
        Data.then(function (ref) {
            $scope.referenceTypes = ref.data;
            for (var i = 0; i < $scope.referenceTypes.length; i++) {
                $scope.orderDetails.referenceTypes[$scope.referenceTypes[i].key] = $scope.referenceTypes[i].value;
            }
        }, function () {
            alert('Error ReferenceTypes');
        });
    };
    $scope.Urgent = function () {

        if ($scope.reference.Urgent == 1) {
            $scope.reference.FeeAmount = numeral(5000).format('0,0.00');
        }
        else {
            $scope.reference.Urgent = 0;
            $scope.reference.FeeAmount = numeral(3000).format('0,0.00');
        }
    };
    $scope.getFilialList = function () {
        var Data = infoService.GetFilialAddressList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
            for (var i = 0; i < $scope.filialList.length; i++) {
                $scope.orderDetails.filialList[$scope.filialList[i].key] = $scope.filialList[i].value;
            }
        }, function () {
            alert('Error FilialList');
        });
    };

    $scope.getFeeAccounts = function () {
        var Data = paymentOrderService.getAccountsForOrder(20, 1, 3);
        Data.then(function (acc) {
            $scope.feeAccounts = acc.data;
        }, function () {
            alert('Error getfeeaccounts');
        });
    };
    $scope.getAccounts = function () {
        var Data = referenceOrderService.GetAccounts();
        Data.then(function (ref) {
            $scope.accounts = ref.data;
        }, function () {
            alert('Error Accounts');
        });
    };

    $scope.getReferenceOrderServiceFee = function () {
        var Data = orderService.getOrderServiceFee($scope.reference.Type, $scope.reference.Urgent);
        Data.then(function (acc) {
            $scope.reference.FeeAmount = numeral(acc.data).format('0,0.00');
        }, function () {
            alert('Error getfeeaccounts');
        });
    };


    $scope.callbackgetReferenceOrder = function () {
        $scope.getReferenceOrder($scope.selectedOrderId);
    };

    //Վճարման հանձնարարականի տպում
    $scope.getReferenceOrderDetails = function (isCopy) {
        showloading();
        if (isCopy == undefined)
            isCopy = false;

        var refOrder = $scope.reference;
        refOrder.ServiceType = 205;
        refOrder.Amount = parseFloat($scope.reference.FeeAmount.toString().replace(",", ""));
        refOrder.Currency = "AMD";
        refOrder.DebitAccount = { AccountNumber: "0", Currency: "AMD" };

        if ($scope.$root.SessionProperties.CustomerType == 6) {
            if ($scope.reference.Urgent == 1) {
                refOrder.Description = "Նույն օրվա ընթացքում տեղեկանքի համար (" + refOrder.OPPerson.CustomerNumber.toString() + ")";
            }
            else {
                refOrder.Description = "Տեղեկանքի համար (" + refOrder.OPPerson.CustomerNumber.toString() + ")";
            }
            var Data = feeForServiceProvidedOrderService.getFeeForServiceProvidedOrderDetails(refOrder, isCopy);
            Data.then(function (response) {
                var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                ReportingApiService.getReport(requestObj, function (result) {
                    ShowPDFReport(result);
                });
            }, function () {
                alert('Error getFeeForServiceProvidedOrderDetails');
            });

        }
        else {

            var Data = customerService.getAuthorizedCustomerNumber();
            Data.then(function (nmb) {
                $scope.authorizedCustomerNumber = nmb.data;

                if ($scope.reference.Urgent == 1) {
                    refOrder.Description = "Նույն օրվա ընթացքում տեղեկանքի համար (" + $scope.authorizedCustomerNumber.toString() + ")";
                }
                else {
                    refOrder.Description = "Տեղեկանքի համար (" + $scope.authorizedCustomerNumber.toString() + ")";
                }

                var Data = feeForServiceProvidedOrderService.getFeeForServiceProvidedOrderDetails(refOrder, isCopy);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 70, ReportExportFormat: 1 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowPDFReport(result);
                    });
                }, function () {
                    alert('Error getFeeForServiceProvidedOrderDetails');
                });

            }, function () {
                alert('Error getAuthorizedCustomerNumber');
            });



        }






    };

    $scope.getUserFilialCode = function () {
        var Data = casherService.getUserFilialCode();
        Data.then(function (ref) {
            $scope.reference.ReferenceFilial = ref.data;
        }, function () {
            alert('Error Accounts');
        });
    };

    $scope.showBlock = function () {
        if ($scope.reference.ReferenceTypes != undefined && $scope.reference.ReferenceTypes.indexOf(8) == -1) {
            $scope.reference.OtherTypeDescription = '';
        }
        return $scope.reference.ReferenceTypes != undefined && $scope.reference.ReferenceTypes.indexOf(3) != -1;
    }

    $scope.setReceiveDate = function (urgent) {


        var Data = referenceOrderService.setReceiveDate(urgent);
        Data.then(function (acc) {
            var date = new Date(parseInt(acc.data.substr(6)));
            $scope.reference.ReceiveDate = date;
        }, function () {
            alert('Error setReceiveDate');
        });
        //var currentDate = new Date();
        //if ($scope.reference.Urgent == 1) {
        //    $scope.reference.ReceiveDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        //} else {
        //    $scope.reference.ReceiveDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        //}
    }

    $scope.setUrgent = function () {
        var currentDate = new Date();
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        var resDate = new Date($scope.reference.ReceiveDate.getFullYear(), $scope.reference.ReceiveDate.getMonth(), $scope.reference.ReceiveDate.getDate());
        if (resDate.getDate() == currentDate.getDate()) {
            $scope.reference.Urgent = 1;
            $scope.getReferenceOrderServiceFee();
        }
    }

    $scope.referenceApplication = function () {
        showloading();
        var Data = referenceOrderService.referenceApplication($scope.reference);
        ShowPDF(Data);
    }

    $scope.accountsRequired = function () {
        if ($scope.reference.ReferenceTypes != undefined && $scope.reference.ReferenceTypes.length == 1 && $scope.reference.ReferenceTypes.indexOf(4) > -1) {
            return false;
        }
        if ($scope.reference.ReferenceTypes != undefined && $scope.reference.ReferenceTypes.length == 1 && $scope.reference.ReferenceTypes.indexOf(8) > -1) {
            return false;
        }
        if ($scope.reference.ReferenceTypes != undefined && $scope.reference.ReferenceTypes.length == 2 && $scope.reference.ReferenceTypes.indexOf(4) > -1 && $scope.reference.ReferenceTypes.indexOf(8) > -1) {
            return false;
        }
    }


    $scope.getAccountDesc = function (account) {
        if ($scope.maxBalance == undefined && $scope.maxAccountDesc == undefined) {
            var balances = [];
            var accountNumbers = [];
            var productDescriptions = [];
            for (var i = 0; i < $scope.accounts.length; i++) {
                balances.push($scope.accounts[i].BalanceString);
                if ($scope.accounts[i].AccountType == 11) {
                    accountNumbers.push($scope.accounts[i].ProductNumber);

                    var desc = $scope.accounts[i].AccountDescription.replace($scope.accounts[i].ProductNumber + ' ', '');
                    productDescriptions.push(desc);
                    $scope.hasCardAccount = true;
                }
                else {
                    accountNumbers.push($scope.accounts[i].AccountNumber);
                }
            }
            $scope.maxBalance = Math.max.apply(Math, $.map(balances, function (el) { return el.length }));
            $scope.maxAccountNumber = Math.max.apply(Math, $.map(accountNumbers, function (el) { return el.length }));
            $scope.maxProductDesc = Math.max.apply(Math, $.map(productDescriptions, function (el) { return el.length }));
        }
        var desc = "";
        var dif = 0;
        if (account.AccountType == 11) {

            desc = desc + account.ProductNumber;
            dif = $scope.maxAccountNumber - account.ProductNumber.length;
            desc = desc + $scope.addSpaces(dif);

            desc += $scope.addSpaces(1);

            var productDesc = account.AccountDescription.replace(account.ProductNumber + ' ', '');
            desc = desc + productDesc;
            dif = $scope.maxProductDesc - productDesc.length;
            desc = desc + $scope.addSpaces(dif);

            desc += $scope.addSpaces(4);


            var balance = account.BalanceString;
            dif = $scope.maxBalance - account.BalanceString.length;
            balance = $scope.addSpaces(dif) + balance;
            desc = desc + balance;

            desc += $scope.addSpaces(1);

            desc = desc + account.Currency;
            dif = 3 - account.Currency.length;
            desc = desc + $scope.addSpaces(dif);

            desc += $scope.addSpaces(1);

        }
        else {
            desc = desc + account.AccountNumber;
            dif = $scope.maxAccountNumber - account.AccountNumber.length;
            desc = desc + $scope.addSpaces(dif);

            desc += $scope.addSpaces(1);

            if ($scope.hasCardAccount) {
                desc += $scope.addSpaces($scope.maxProductDesc);
            }

            desc += $scope.addSpaces(4) + " ";

            var balance = account.BalanceString;
            dif = $scope.maxBalance - account.BalanceString.length;
            balance = $scope.addSpaces(dif) + balance;
            desc = desc + balance;

            desc += $scope.addSpaces(1);

            desc = desc + account.Currency;
            dif = 3 - account.Currency.length;
            desc = desc + $scope.addSpaces(dif);

            desc += $scope.addSpaces(1);
        }
        return desc;
    }

    $scope.addSpaces = function (count) {
        var spaces = "";
        for (var i = 0; i < 1; i++) {
            spaces += String.fromCharCode(160);
        }
        return spaces;
    }

    $scope.onlyAm = function () {
        if ($scope.reference.ReferenceTypes == 9) {
            $scope.reference.ReferenceLanguage = "1"
        }
    }

    $scope.getReferenceReceiptTypes = function () {
        var Data = infoService.getReferenceReceiptTypes();
        Data.then(function (ref) {
            $scope.ReferenceReceiptTypes = ref.data;
        }, function () {
                alert('Error getReferenceReceiptTypes');
        });
    };

    $scope.getCustomerAllPassports = function () {
        var Data = infoService.getCustomerAllPassports();
        Data.then(function (ref) {
            $scope.customerAllPassports = ref.data;
            if ($scope.customerAllPassports != undefined) {
                $scope.reference.PassportDetails = Object.keys($scope.customerAllPassports)[0];
            }
        }, function () {
            alert('Error getCustomerAllPassports');
        });
    };

    $scope.getCustomerAllPhones = function () {
        var Data = infoService.getCustomerAllPhones();
        Data.then(function (ref) {
            $scope.customerAllPhones = ref.data;
            if ($scope.customerAllPhones != undefined) {
                $scope.reference.PhoneNumber = Object.keys($scope.customerAllPhones)[0];
            }
        }, function () {
            alert('Error customerAllPhones');
        });
    };


    $scope.changeFeeAmount = function () {

        var indexId;

        switch ($scope.reference.ReferenceReceiptType) {
            case "1":
                indexId = 923;
                break;
            case "2":
                indexId = 924;
                break;
            case "3":
                indexId = 925;
                break;
        }

        var Data = referenceOrderService.getOrderServiceFeeByIndex(indexId);
        Data.then(function (acc) {
            $scope.reference.FeeAmount = numeral(acc.data).format('0,0.00');
        }, function () {
            alert('Error getfeeaccounts');
        });
    }

}]);