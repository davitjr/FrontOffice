app.controller("PosLocationCtrl", ['$scope', 'dateFilter', 'posLocationService', '$state', '$confirm', 'ReportingApiService', 'accountService', 'customerService', function ($scope, dateFilter, posLocationService, $state, $confirm, ReportingApiService, accountService, customerService) {

    $scope.filter = 1;
    $scope.dateFrom = $scope.$root.SessionProperties.OperationDate;
    $scope.dateTo = $scope.$root.SessionProperties.OperationDate;
    $scope.statementType = 1;
    $scope.contractDate = $scope.$root.SessionProperties.OperationDate;
    /*Davit Pos */

    $scope.cardSystem = [
        { id: 9, description: "ARCA", fee: 0, feeInt: 0 },
        { id: 4, description: "VISA", fee: 0, feeInt: 0 },
        { id: 5, description: "MC", fee: 0, feeInt: 0 },
        { id: 2, description: "MIR", fee: 0, feeInt: 0 },
        { id: 3, description: "AMEX", fee: 0, feeInt: 0 },
        { id: 7, description: "JCB", fee: 0, feeInt: 0 },
        { id: 8, description: "UPI", fee: 0, feeInt: 0 },
        { id: 20, description: "QR", fee: 0, feeInt: 0 }
    ];

    $scope.actTypes = {
        1: "ԱՍԿ-ին",
        2: "ԱՍԿ-ից",
        3: "ԲԱՆԿԻ մասն-ին",
        4: "ԲԱՆԿԻ մասն-ից",
        5: "ՍՊԱՍԱՐԿՈՂ ԿԱԶՄԱԿԵՐՊՈՒԹՅԱՆԸ"
    };
    $scope.contractTypes = {
        2: "Local-International",
        3: "Առանց քարտի ներկայացման",
        4: "Վիրտուալ POS",
        5: "Առանց քարտի ավտովարձույթ"
    };
    let allDocumentTypes = {
        1: "Վճարային քարտերի եվ QR կոդով սպասարկման մասին պայմանագիր",
        2: "Առանց քարտի ներկայացման վճարումների մասին համաձայնագիր",
        3: "Առանց քարտի ներկայացման վճարումների մասին համաձայնագիր  (տրանսպորտային միջոցների վարձույթ)",
        4: "Վճարային քարտերի առցանց սպասարկման մասին պայմանագիր",
        5: "Առեվտրի եվ սպասարկման կետից POS տերմինալի ընդունման-հանձման ակտ",
        6: "Առեվտրի/սպասարկման կետերին POS տերմինալների հանձնման-ընդունման ակտ"
    };

    $scope.includeAll = false;
    $scope.include = function (forAllPOS) {
        $scope.includeAll = forAllPOS;
    }

    $scope.getDocumetTypes = function () {
        console.log($scope.posTerminalType)
        console.log($scope.posTerminalType);
        if ($scope.posTerminalType != 3) {
            delete allDocumentTypes['4'];
            if ($scope.posOwnerBankCode != 22000 || $scope.posTerminalType != 2) {
                delete allDocumentTypes['5'];
                delete allDocumentTypes['6'];
            }
            console.log(allDocumentTypes);
        }
        else {
            allDocumentTypes = {
                4: allDocumentTypes['4']
            };
        }
        $scope.documentTypes = allDocumentTypes;
        console.log($scope.documentTypes);
    }



    $scope.showValidationMessage = function () {
        return ShowMessage('Վավերացման ձախողում<br/>Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը։', 'error');
    };

    $scope.selectedDocument = {};

    $scope.showContract = true;
    $scope.showAct = true;
    $scope.showAgreement = true;
    $scope.actType = 0;
    $scope.contractType = 0;
    $scope.forAllPOS = false;

    /*Davit Pos */
    $scope.newPosLocationOrder = {
        OperDay: new Date(),
        posType: 0,
        payWithoutCard: 0,
        phoneCode: 374,
        cardSystemForService: [],
        Type: 268,
        SubType: 1,
        ActivitySphere: []
    };

    $scope.getCustomerPosLocations = function () {
        var Data = posLocationService.getCustomerPosLocations($scope.filter);
        Data.then(function (result) {
            if ($scope.filter == 1) {
                $scope.customerPosLocations = result.data;
                $scope.closingCustomerPosLocations = [];
            }
            else if ($scope.filter == 2) {
                $scope.closingCustomerPosLocations = result.data;
            }
            $scope.loading = false;
        }, function () {
            alert('Error getCustomerCardTariffContracts');
        });
    };

    $scope.setClickedLocationRow = function (index, posLoc) {
        $scope.selectedLocationRow = index;
        $scope.selectedPosLoc = posLoc;
        $scope.selectedPosLocId = posLoc.Id;
    };

    //$scope.setClickedLocationRowClose = function (index,posLoc) {
    //     $scope.selectedLocationRowClose = index;
    //     $scope.selectedPosLoc = posLoc;
    //     $scope.selectedPosLocId = posLoc.Id
    //     $scope.selectedRow = null;
    //};

    $scope.setClickedTerminalRow = function (index, posTerminal) {
        $scope.terminalId = posTerminal.Id;
        $scope.merchantId = posTerminal.TerminalID;
        $scope.posTerminalType = posTerminal.Type;
        $scope.posOwnerBankCode = posTerminal.OwnerBankCode;
        //$scope.getDocumetTypes();
    }



    $scope.QualityFilter = function () {
        $scope.selectedRow = null;
        $scope.selectedRowClose = null;
        $scope.getCustomerPosLocations();
        if ($scope.filter == 1) {
            $scope.filter == 1;
        }
        else {
            $scope.filter == 2;
        }

    }

    $scope.getPosLocation = function (posLocationId) {
        var Data = posLocationService.getPosLocation(posLocationId);
        Data.then(function (result) {
            $scope.posLocation = result.data;
        }, function () {
            alert("Error getPosLocation");
        });
    }

    $scope.getPosRates = function (code) {
        var Data = posLocationService.getPosRates(code);
        Data.then(function (result) {
            $scope.posRates = result.data;
        }, function () {
            alert("Error getPosRates");
        });
    }


    $scope.getPosCashbackRates = function (terminalId) {
        var Data = posLocationService.getPosCashbackRates(terminalId);
        Data.then(function (result) {
            $scope.posCashbackRates = result.data;
        }, function () {
            alert("Error getPosCashbackRates");
        });
    }

    $scope.openPosLocationDetails = function () {
        $state.go('posLocationDetails', { selectedPosLoc: $scope.selectedPosLoc });

    };


    $scope.printPosStatement = function (accountNumber, exportFormat) {

        if (accountNumber == null) {
            return ShowMessage('Ընտրեք հաշվեհամարը', 'error');
        }

        showloading();
        var Data = posLocationService.printPosStatement(accountNumber, $scope.dateFrom, $scope.dateTo, $scope.statementType, exportFormat);
        Data.then(function (response) {
            if (response.data != null) {
                var format = 0;
                if (exportFormat == 'pdf') {
                    format = 1;
                }
                else {
                    format = 2;
                }
                var requestObj = { Parameters: response.data, ReportName: 88, ReportExportFormat: format }
                ReportingApiService.getReport(requestObj, function (result) {
                    if (exportFormat == 'xls') {
                        ShowExcelReport(result, 'PosStatement');
                    }
                    else {
                        ShowPDFReport(result);
                    }
                });
            }
        }, function () {
            alert('Error printPosStatement');
        });


    };

    $scope.changeActType = function () {
        if ($scope.actType == 1) {
            $scope.showContract = true;
            $scope.showAct = true;
        }
        else if ($scope.actType == 2) {
            $scope.showContract = true;
            $scope.contractType = undefined;
            $scope.showAct = true;
        }
        else {
            $scope.showContract = false;
            $scope.contractType = undefined;
            $scope.showAct = false;
        }
    }

    $scope.changeContractType = function () {
        if ($scope.contractType == 7) {
            $scope.showAct = true;
        }
        else {
            $scope.showAct = false;
        }
        $scope.showContract = true;
        $scope.actType = undefined;
        if ($scope.contractType == 3 || $scope.contractType == 5) {
            $scope.showAgreement = true;
        }
        else {
            $scope.showAgreement = false;
        }
    }

    $scope.PrintContracts = function () {
        if ($scope.actType == 1 || $scope.actType == 2) {
            $scope.printPosActsPDF($scope.terminalId, $scope.actType, $scope.contractNumber, $scope.actNumber, $scope.merchantId);
        }
        else {
            $scope.actType && $scope.printPosActs($scope.terminalId, $scope.actType, $scope.merchantId)
        }
        if ($scope.contractType == 1 || $scope.contractType == 2) {
            $scope.printPosContract($scope.terminalId, $scope.contractType, $scope.contractNumber)
        }
        else {
            if ($scope.contractType == 4) {
                $scope.printInternetContract($scope.terminalId, $scope.contractType, $scope.contractNumber)
            }
            else if ($scope.contractType == 3) {
                $scope.printAgreementWithNoCard($scope.terminalId, $scope.contractNumber, $scope.agreementNumber)
            }
            else if ($scope.contractType == 5) {
                $scope.printWithoutCardPaymentContract($scope.terminalId, $scope.contractNumber, $scope.agreementNumber)
            }
        }
    }

    $scope.printPosContract = function () {
        showloading();
        var Data = posLocationService.printPosContract();
        ShowPDF(Data);

    };

    $scope.printPosContract = function (id, contractType, contractNumber) {
        showloading();
        var Data = posLocationService.printPosContract(id, contractType, contractNumber);
        ShowPDF(Data);
    };

    $scope.printInternetContract = function (id, contractType, contractNumber) {
        showloading();
        var Data = posLocationService.printInternetContract(id, contractType, contractNumber);
        ShowPDF(Data);
    };

    $scope.printAgreementWithNoCard = function (id, contractNumber, agreementNumber) {
        showloading();
        var Data = posLocationService.printAgreementWithNoCard(id, contractNumber, agreementNumber);
        ShowPDF(Data);
    };

    $scope.printWithoutCardPaymentContract = function (id, contractNumber, agreementNumber) {
        showloading();
        var Data = posLocationService.printWithoutCardPaymentContract(id, contractNumber, agreementNumber);
        ShowPDF(Data);
    };

    $scope.printCardPaymentAgreementWithNoCard = function (contractNumber, agreementNumber) {
        showloading();
        var Data = posLocationService.printCardPaymentAgreementWithNoCard(contractNumber, agreementNumber);
        ShowPDF(Data);
    };

    $scope.printPosActsPDF = function (id, actType, contractNumber, actNumber, merchantId) {
        showloading();
        if ($scope.forAllPOS) {
            merchantId = '';
        }
        var Data = posLocationService.printPosActsPDF(id, actType, contractNumber, actNumber, merchantId);
        ShowPDF(Data);
    };

    $scope.printPosActs = function (id, actType, merchantId) {
        showloading();
        console.log($scope.forAllPOS);
        if ($scope.forAllPOS) {
            merchantId = '';
        }
        var Data = posLocationService.printPosActs(id, actType, merchantId);
        ShowPDF(Data);
    };

    $scope.SendContracts = function () {

        console.log($scope.terminalId, $scope.merchantId, $scope.contractNumber, $scope.agreementNumber, $scope.actNumber, $scope.includeAll);

        let selectedDocuments = [];
        angular.forEach($scope.selectedDocument, function (selected, key) {
            if (selected) {
                selectedDocuments.push(parseInt(key));
            }
        });

        let parameters = {
            merchantID: $scope.merchantId,
            code: $scope.terminalId.toString(),
            contractNumber: $scope.contractNumber,
            agreementNumber: $scope.agreementNumber,
            actNumber: $scope.actNumber,
            includeAll: $scope.includeAll
        };

        $confirm({ title: 'Հաստատե՞լ', text: 'Հաճախորդի անձնական Էլեկտրոնային հասցեին ուղարկվելու է պայմանագրերի փաթեթ։' })
            .then(function () {
                showloading();
                var Data = posLocationService.sendDigitalContract($scope.terminalId, selectedDocuments, parameters);
                Data.then(function (res) {
                    hideloading();
                    if (validate($scope, res.data)) {
                        console.log(res.data.ResultCode);
                        ShowToaster('Ուղարկված է։', 'success');
                        CloseBPDialog('sendposterminaldocuments');
                    }
                    else {
                        console.log(res.data.ResultCode);
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function (acc) {
                    hideloading();
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                });
            });
        console.log({
            attachmentType: selectedDocuments,
            parameters: parameters
        });

    };

    $scope.digitalContractStatuses = {
        1: "Ընթացիկ",
        2: "Հաստատված",
        3: "Ժամկետանց",
        4: "Չեղարկված",
        5: "Հաստատված է թղթային"
    };

    $scope.getSentDigitalContracts = function () {
        showloading();
        var Data = posLocationService.getSentDigitalContracts();
        Data.then(function (res) {
            hideloading();
            let sentDigitalContracts = res.data;
            console.log(sentDigitalContracts);
            angular.forEach(sentDigitalContracts, function (digitalcontract, key) {
                console.log(digitalcontract);
                digitalcontract.StatusText = $scope.digitalContractStatuses[digitalcontract.Status];
                digitalcontract.RegistrationDate = new Date(parseInt(digitalcontract.RegistrationDate.substr(6)));
                digitalcontract.StatusDate = new Date(parseInt(digitalcontract.StatusDate.substr(6)));
                angular.forEach(digitalcontract.Attachments, function (attachment, key) {
                    let parameters = attachment.Parameters;
                    attachment.Date = parameters.filter(function (el, index) {
                        return el.Name.indexOf("Date") !== -1;
                    })[0].Value;
                    attachment.Number = parameters.filter(function (el, index) {
                        return el.Name.indexOf("Number") !== -1;
                    })[0].Value;
                });
            });
            $scope.SentDigitalContracts = sentDigitalContracts;
            console.log($scope.SentDigitalContracts)
        }, function (acc) {
            hideloading();
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
        });
    };

    $scope.getSignedDigitalContracts = function () {
        showloading();
        var Data = posLocationService.getSignedDigitalContracts();
        Data.then(function (res) {
            hideloading();
            let signedDigitalContracts = res.data;
            console.log(signedDigitalContracts);
            angular.forEach(signedDigitalContracts, function (digitalcontract, key) {
                digitalcontract.RegistrationDate = new Date(parseInt(digitalcontract.RegistrationDate.substr(6)));
                digitalcontract.SignatureDate = new Date(parseInt(digitalcontract.SignatureDate.substr(6)));
            });
            $scope.signedDigitalContracts = signedDigitalContracts;
            console.log($scope.signedDigitalContracts)
        }, function (acc) {
            hideloading();
            if (err.status != 420) {
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
            }
        });
    };

    $scope.getSignedDocument = function (fileId) {
        showloading();
        var Data = posLocationService.getSignedDocument(fileId, "f_" + fileId);
        ShowPDF(Data);
    }

    $scope.cancelDigitalContract = function (Id) {
        console.log(Id);
        $confirm({ title: 'Հաստատե՞լ', text: 'Ցանկանու՞մ եք չեղարկել' })
            .then(function () {
                showloading();
                console.log(Id);
                var Data = posLocationService.cancelDigitalContract(Id);
                Data.then(function (res) {
                    hideloading();
                    if (validate($scope, res.data)) {
                        ShowToaster('Չեղարկված է։', 'success');
                    }
                    else {
                        console.log(res.data.ResultCode);
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function (acc) {
                    hideloading();
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                });
            });
    };

    $scope.signedInPaperDigitalContract = function (Id) {
        console.log(Id);
        $confirm({ title: 'Հաստատե՞լ', text: 'Ցանկանու՞մ եք ստորագրել թղթային տարբերակով' })
            .then(function () {
                showloading();
                console.log(Id);
                var Data = posLocationService.signedInPaperDigitalContract(Id);
                Data.then(function (res) {
                    hideloading();
                    if (validate($scope, res.data)) {
                        ShowToaster('Նշումը կատարվել է։', 'success');
                    }
                    else {
                        console.log(res.data.ResultCode);
                        $scope.showError = true;
                        showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    }
                }, function (acc) {
                    hideloading();
                    if (err.status != 420) {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                    }
                });
            });
    };
    //Davit Pos
    $scope.saveNewPosLocationOrder = function () {
        showloading();
        if ($scope.newPosLocationOrder.cardSystemForService.length == 0) {
            showMesageBoxDialog('Քարտի տեսակ ընտրված չէ։', $scope, 'error');
        }
        else if ($scope.newPosLocationOrder.posPhone.toString().length != 8) {
            showMesageBoxDialog('ԱՍԿ հեռախոսահամը սխալ է։', $scope, 'error');
        }
        else if ($scope.newPosLocationOrder.contactPersonPhone.toString().length.toString() != 8) {
            showMesageBoxDialog('Կոնտակտային անձի հեռախոսահամը սխալ է։', $scope, 'error');
        }
        else {
            var data = posLocationService.saveNewPosLocationOrder($scope.newPosLocationOrder);

            data.then(function (result) {

                if (result.status == 200) {
                    ShowToaster('Հայտի մուտքագրումը կատարված է։', 'success');
                }
            }, function () {
                alert('Error saveNewPosLocationOrder');
            });
        }
        CloseBPDialog('NewPosApplication');
        hideloading();
    };

    //Davit Pos
    $scope.getCurrentAccounts = function () {
        $scope.loading = true;
        var Data = accountService.GetCurrentAccounts(1);//($scope.filter);
        Data.then(function (acc) {
            $scope.accounts = acc.data;
            $scope.closedAccounts = [];
            $scope.setCurrnetAccountsScroll();
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCurrentAccounts');
        });
    };
    //Davit Pos
    $scope.selectCardSystem = function (id, isChecked, fee, feeInt) {
        if (isChecked == true) {
            $scope.newPosLocationOrder.cardSystemForService.push({ id: id, fee: fee, feeInt: feeInt });
        }
        else {
            $scope.newPosLocationOrder.cardSystemForService = $scope.newPosLocationOrder.cardSystemForService.filter((item) => item.id !== id);
        }
    };

    //Davit Pos
    $scope.getNewPosApplicationOrderDetails = function (orderId) {
        var Data = posLocationService.getNewPosApplicationOrderDetails(orderId);
        Data.then(function (result) {
            $scope.order = result.data;
        }, function () {

            alert('Error getNewPosApplicationOrderDetails');
        });
    };

    //Davit Pos
    $scope.GetCustomer = function () {
        var Data = customerService.getCustomer(0);
        Data.then(function (result) {
            $scope.customer = result.data;
            $scope.newPosLocationOrder.contactPerson = $scope.customer.OrganisationDirector.Value;
            $scope.newPosLocationOrder.mail = $scope.customer.EmailList[0];
            $scope.newPosLocationOrder.contactPersonPhone = $scope.customer.PhoneList[0].phone.areaCode + $scope.customer.PhoneList[0].phone.phoneNumber;
        }, function () {
            alert('Error GetCustomer');
        });
    };
    //Davit Pos
    $scope.GetPosTerminalActivitySphere = function () {
        var Data = posLocationService.GetPosTerminalActivitySphere();
        Data.then(function (result) {
            $scope.newPosLocationOrder.ActivitySphere = result.data;
        }, function () {
            alert('Error getPosTerminalActivitySphere');
        });
    };

    //Davit Pos
    $scope.saveNewPosTerminalOrder = function () {
        showloading();
        $scope.newPosLocationOrder.SubType = 2;
        if ($scope.newPosLocationOrder.cardSystemForService.length == 0) {
            showMesageBoxDialog('Քարտի տեսակ ընտրված չէ։', $scope, 'error');
        }
        else {
            var data = posLocationService.saveNewPosTerminalOrder($scope.newPosLocationOrder);

            data.then(function (result) {

                if (result.status == 200) {
                    ShowToaster('Հայտի մուտքագրումը կատարված է։', 'success');
                }
            }, function () {
                alert('Error saveNewPosTerminalOrder');
            });
            CloseBPDialog('NewPosTerminalApplication');
            hideloading();
        }

    };

}]);