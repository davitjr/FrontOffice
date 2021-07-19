app.controller('LeasingCustomerClassificationCtrl', ['$scope', 'LeasingCustomerClassificationService', '$location', 'dialogService', '$confirm', '$uibModal', '$http', '$compile', '$state', '$window', '$filter','$log', '$sce', 'ReportingApiService', function ($scope, LeasingCustomerClassificationService, $location, dialogService, $confirm, $uibModal, $http, $compile, $state, $window, $filter, $log, $sce, ReportingApiService) {
    $scope.date = new Date(new Date().setTime(new Date().getTime() - (24 * 60 * 60 * 1000) * 90)) //new Date();
    $scope.date3 = new Date();
    $scope.closingDate = new Date();
    $scope.reportDate = new Date();
    $scope.closeDate3 = new Date();
    $scope.closeReportDate = new Date();
    $scope.classificationdate = new Date();
    $scope.isActive1 = 1;
    $scope.isActive2 = 1;
    $scope.isActive3 = 1;
    $scope.isActive5 = 1;
    $scope.classificationType = 0;
    $scope.classificationClass = 1;
    $scope.additionalDescription = "";
    $scope.gridSelectedRow = { selectedRow1: undefined, selectedRow2: undefined, selectedRow3: undefined, selectedRow4: undefined, selectedRow5: undefined };
    $scope.mod = true;
    $scope.connectionResult = false;
    $scope.leasingCustomerNumber = 0;

    $scope.setLeasingCustomerSearch = function () {
        sessionStorage.setItem("calledForLeasing", "true");
    };

    $scope.SelectedRow = function (propName, index) {
        $scope.gridSelectedRow[propName] = index;
        $scope.selectedRow = index;

    };

    $scope.GetPermission = () => {
        var data = LeasingCustomerClassificationService.getUserPermission();
        data.then(
            (response) => {
                var resData = response.data;


                resData.map(function (item) {
                    if ($scope.PermissionForCustomerClassification[item.nameOfControl] != undefined) {
                        $scope.PermissionForCustomerClassification[item.nameOfControl].valueOfPermission = Boolean(item.valueOfPermission);
                    }
                });

            },
            (error) => { showMesageBoxDialog('Տեղի է ունեցել սխալ', 'Error'); }
        );
    };

    $scope.getSearchedCustomer = function (customer) {
        $scope.customerNumber = parseInt(customer.customerNumber);
        var Data = LeasingCustomerClassificationService.getLeasingCustomerInfo($scope.customerNumber);
        Data.then(
            function (response) {
                $scope.leasingCustomerNumber = response.data.LeasingCustomerNumber;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            });
        $scope.closeSearchCustomersModal();
    };

    $scope.searchCustomers = function () {
        $scope.searchCustomersModalInstance = $uibModal.open({
            template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
            scope: $scope,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static'
        });
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
        if ($scope.customerNumber != undefined) {
            $scope.mod = false;
        }

    };

    $scope.LoadAllData = function () {
        if ($scope.customerNumber == null || $scope.customerNumber == undefined || $scope.customerNumber == "" || $scope.customerNumber == 0) {
            showMesageBoxDialog('Ընտրեք հաճախորդի համարը', 'Error getTransfer');
        }
        else {
            $scope.GetCustomerInfo();
            $scope.GetCustomerSubjectiveClassificationGrounds();
            $scope.GetConnectionGroundsForNotClassifyingWithCustomer();
            $scope.GetConnectionGroundsForClassifyingWithCustomer();
            $scope.GetCustomerClassificationHistory();
            $scope.GetGroundsForNotClassifyingCustomerLoan();

        }

    };

    // Ստանում է տվյալներ (հաճախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակի) ավելացնելու հիմքեր դաշտի համար
    $scope.GetReasonTypes = function () {
        if ($scope.classificationType == 1) {
            $scope.classificationClass = 0;
            $scope.RiskDaysCountAndName();
        }
        var data = LeasingCustomerClassificationService.GetReasonTypes($scope.classificationType);

        data.then(
            function (response) {
                $scope.types = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };


    // classificationdate

    $scope.GetClassificationDate = function (classificationClass) {
        switch (classificationClass) {
            case 0:                                      /*ստանդարտ*/
                $scope.classificationdate = new Date();
                break;
            case 1:                                      /*հսկվող*/
                $scope.classificationdate = new Date($scope.classificationdate.setTime(new Date().getTime() - (24 * 60 * 60 * 1000) * parseInt($scope.riskDaysCountAndName.m_Item1)));
                break;
            case 2:                                      /*ոչ ստանդարտ*/
                $scope.classificationdate = new Date($scope.classificationdate.setTime(new Date().getTime() - (24 * 60 * 60 * 1000) * parseInt($scope.riskDaysCountAndName.m_Item1)));
                break;
            case 3:                                     /*կասկածելի*/
                $scope.classificationdate = new Date($scope.classificationdate.setTime(new Date().getTime() - (24 * 60 * 60 * 1000) * parseInt($scope.riskDaysCountAndName.m_Item1)));
                break;
            case 4:                                     /*անհուսալի*/
                $scope.classificationdate = new Date($scope.classificationdate.setTime(new Date().getTime() - (24 * 60 * 60 * 1000) * parseInt($scope.riskDaysCountAndName.m_Item1)));
                break;
        }

    };



    $scope.RiskDaysCountAndName = function () {
        var data = LeasingCustomerClassificationService.RiskDaysCountAndName($scope.classificationClass);
        data.then(
            function (response) {
                $scope.riskDaysCountAndName = response.data;
                $scope.GetClassificationDate($scope.classificationClass);
            },
            function (erroe) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    $scope.ChangeClassificationClass = function () {

        $scope.result = new Date().getTime() - $scope.classificationdate.getTime();
        $scope.result = $scope.result / (24 * 60 * 60 * 1000);
        $scope.riskDaysCountAndName.m_Item1 = $scope.result.toFixed(0);
        if ($scope.result == 0) {
            $scope.riskDaysCountAndName.m_Item2 = "ստանդարտ";
            $scope.classificationClass = "0";
        }
        else if ($scope.result >= 1 && $scope.result <= 90) {
            $scope.riskDaysCountAndName.m_Item2 = "հսկվող";
            $scope.classificationClass = "1";
        }
        else if ($scope.result >= 91 && $scope.result <= 180) {
            $scope.riskDaysCountAndName.m_Item2 = "ոչ ստանդարտ";
            $scope.classificationClass = "2";
        }
        else if ($scope.result >= 181 && $scope.result <= 270) {
            $scope.riskDaysCountAndName.m_Item2 = "կասկածելի";
            $scope.classificationClass = "3";
        }
        else {
            $scope.riskDaysCountAndName.m_Item2 = "անհուսալի";
            $scope.classificationClass = "4";
        }
    };


    // Հաճախորդի մասին տվյալներ
    $scope.GetCustomerInfo = function () {

        var Data = LeasingCustomerClassificationService.getLeasingCustomerInfo($scope.customerNumber);
        Data.then(
            function (response) {

                $scope.customerInfo = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            });
    };

    $scope.GetCustomerSubjectiveClassificationGrounds = function () {
        if ($scope.customerNumber == undefined) {
            $scope.customerNumber = $scope.custNamber;
        }
        var Data = LeasingCustomerClassificationService.GetLeasingCustomerSubjectiveClassificationGrounds($scope.customerNumber, $scope.isActive1);
        Data.then(
            function (response) {

                $scope.subjectiveClassificationGrounds = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            });
    };

    // Ավելացնում է հաճախորդ (հաճախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակում)
    $scope.AddCustomerSubjectiveClassificationGrounds = function () {
        if ($scope.classificationType == undefined || $scope.classificationType == 0) {
            showMesageBoxDialog('Ընտրեք տեսակը', 'Error ');
            return;
        }
        if ($scope.reasonDescriptionID == undefined) {
            showMesageBoxDialog('Ընտրեք հիմքը', 'Error ');
            return;
        }

        $scope.classificationObj = {};
        $scope.classificationObj.Id = $scope.id1;
        $scope.classificationObj.LeasingCustomerNumber = $scope.leasingCustNumber;
        $scope.classificationObj.ReportNumber = $scope.reportNumber;
        $scope.classificationObj.ReportDate = $scope.reportDate;
        $scope.classificationObj.ClassificationReason = $scope.reasonDescriptionID;
        $scope.classificationObj.AdditionalDescription = $scope.additionalDescription;
        $scope.classificationObj.RiskClassName = $scope.classificationClass;
        $scope.classificationObj.ClassificationDate = $scope.classificationdate;
        $scope.classificationObj.CalcByDays = $scope.isDaysAccumulated;
        $scope.classificationObj.ClassificationType = $scope.classificationType;

        var data = LeasingCustomerClassificationService.AddCustomerSubjectiveClassificationGrounds($scope.classificationObj);
        data.then(
            function (res) {
                $scope.ResultCode = res.data.ResultCode;
                if ($scope.ResultCode == 1) {
                    $scope.Message = 'Մուտքագրումը հաջողությամբ կատարվել է:';
                    ShowMessage($scope.Message, 'success');
                    CloseBPDialog('addCustomerSubjectiveClassificationGroundsForm');
                    //angular.element(document.getElementById('addCustomerSubjectiveClassificationGroundsForm')).scope().GetCustomerSubjectiveClassificationGrounds();
                    $scope.GetCustomerSubjectiveClassificationGrounds();
                } else {
                    if ($scope.ResultCode == 4) {
                        $scope.Message = res.data.Errors[0].Description;
                        showMesageBoxDialog($scope.Message, 'Error');
                    } else {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error ');
                    }

                }

            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );

    };

    //----------------------------------
    $scope.keyPressAddCustomerSubjectiveClassificationGrounds = function (event) {
        if (event.keyCode == 13) {
            $scope.AddCustomerSubjectiveClassificationGrounds();
        }
    };
    $scope.keyPressCloseBPDialogAddCustomerSubjectiveClassificationGrounds = function (event) {
        if (event.keyCode == 13) {
            CloseBPDialog('addCustomerSubjectiveClassificationGroundsForm');
        }
    };
    //----------------------------------

    //Վերադարձնում է  ՀաՃախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակի ընտրված տողի տվյալները
    $scope.GetCustomerSubjectiveClassificationGroundsByID = function () {
        var data = LeasingCustomerClassificationService.GetCustomerSubjectiveClassificationGroundsByID($scope.id1);
        data.then(
            function (response) {
                $scope.subjectiveClassificationGroundsByID = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            }
        );
    };


    $scope.CloseCustomerSubjectiveClassificationGrounds = function () {
        if ($scope.subjectiveClassificationGrounds[$scope.selectedRow] == null || $scope.subjectiveClassificationGrounds[$scope.selectedRow] == undefined || $scope.subjectiveClassificationGrounds[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք փակվող տողը', 'Error getTransfer');
            return;
        }
        $confirm({ title: 'Ուշադրություն', text: 'Փակե՞լ ընտրված դասը' })
            .then(function () {


                var data = LeasingCustomerClassificationService.CloseCustomerSubjectiveClassificationGrounds($scope.subjectiveClassificationGrounds[$scope.selectedRow].ClassificationID);
                data.then(

                    function (response) {
                        $scope.ResultCode = response.data.ResultCode;
                        if ($scope.ResultCode == 1) {
                            $scope.Message = 'Դասակարգումը հաջողությամբ փակվել է:';
                            ShowMessage($scope.Message, 'success');
                            //angular.element(document.getElementById('LeasingCustomerClassificationForm')).scope().GetCustomerSubjectiveClassificationGrounds();
                            $scope.GetCustomerSubjectiveClassificationGrounds();
                        } else {
                            if ($scope.ResultCode == 4) {
                                $scope.Message = res.data.Errors[0].Description;
                                showMesageBoxDialog($scope.Message, 'Error');
                            } else {
                                showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error getTransfer');
                            }

                        }
                    },
                    function (error) {
                        ShowMessage('Տեղի ունեցավ սխալ ', 'error');
                    }
                );


            }, function () {
                return;
            });
    };

    // Հաճախորդի հետ փոխկապակցված անձանց չդասակարգելու հիմքեր (աղյուսակ 2)
    $scope.GetConnectionGroundsForNotClassifyingWithCustomer = function () {
        if ($scope.leasingCustomerNumber == undefined || $scope.leasingCustomerNumber == 0 || $scope.leasingCustomerNumber == null) {
            $scope.leasingCustomerNumber = $scope.leasingCustNumber;
        }

        var data = LeasingCustomerClassificationService.GetConnectionGroundsForNotClassifyingWithCustomer($scope.leasingCustomerNumber, $scope.isActive2);
        data.then(
            function (response) {

                $scope.notClassificationGrounds = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            });
    };


    $scope.GetInterconnectedPersonNumber = function () {
        var data = LeasingCustomerClassificationService.GetInterconnectedPersonNumber($scope.leasingCustNumber);
        data.then(
            function (response) {
                $scope.interconnectedPersonNumber = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    // Ավելացնում է փոխկապակցված անձ (Հաճախորդի հետ փոխկապակցված անձանց չդասակարգելու հիմքեր աղյուսակում)
    $scope.AddConnectionGroundsForNotClassifyingWithCustomer = function () {
        if ($scope.interconnectedPerson == undefined || $scope.interconnectedPerson == 0) {
            ShowMessage('Ընտրեք փոխկապակցված հաճախորդի համարը ', 'error');
            return;
        }

        $scope.classificationObj = {};
        $scope.classificationObj.LinkedCustomerNumber = $scope.interconnectedPerson;
        $scope.classificationObj.LeasingCustomerNumber = $scope.leasingCustNumber;
        $scope.classificationObj.ReportNumber = $scope.repNumber;
        $scope.classificationObj.ReportDate = $scope.date;

        var data = LeasingCustomerClassificationService.AddConnectionGroundsForNotClassifyingWithCustomer($scope.classificationObj);
        data.then(
            function (res) {
                $scope.ResultCode = res.data.ResultCode;
                if ($scope.ResultCode == 2) {
                    $scope.Message = 'Մուտքագրումը հաջողությամբ կատարվել է:';
                    ShowMessage($scope.Message, 'success');
                    CloseBPDialog('addConnectionGroundsForNotClassifyingWithCustomerForm');
                    $scope.GetConnectionGroundsForNotClassifyingWithCustomer();

                } else {
                    if ($scope.ResultCode == 4) {
                        $scope.Message = res.data.Errors[0].Description;
                        showMesageBoxDialog($scope.Message, 'Error');
                    } else {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error getTransfer');
                    }

                }

            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );

    };

    //-------------------
    $scope.keyPressAddConnectionGroundsForNotClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            $scope.AddConnectionGroundsForNotClassifyingWithCustomer();
        }
    };

    $scope.keyPressCloseBPDialogAddConnectionGroundsForNotClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            CloseBPDialog('addConnectionGroundsForNotClassifyingWithCustomerForm');
        }
    };

    //-------------------

    // Վերադարձնում է Հաճախորդի հետ փոխկապակցված անձանց չդասակարգելու հիմքեր աղյուսակի ընտրված տողի տվյալները
    $scope.GetConnectionGroundsForNotClassifyingWithCustomerByID = function () {
        var data = LeasingCustomerClassificationService.GetConnectionGroundsForNotClassifyingWithCustomerByID($scope.id2);
        data.then(
            function (response) {
                $scope.notClassifyingWithCustomerByID = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            }
        );
    };

    //Վերադարձնում է  Հաճախորդի հետ փոխկապակցված անձանց դասակարգելու հիմքեր աղյուսակի ընտրված տողի տվըալները 
    $scope.GetConnectionGroundsForClassifyingWithCustomerByID = function () {
        var data = LeasingCustomerClassificationService.GetConnectionGroundsForClassifyingWithCustomerByID($scope.id3, $scope.custNamber3);
        data.then(
            function (response) {
                $scope.classifyingWithCustomerByID = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    $scope.CloseConnectionGroundsForNotClassifyingWithCustomerView = function () {
        if ($scope.notClassificationGrounds[$scope.selectedRow] == null || $scope.notClassificationGrounds[$scope.selectedRow] == undefined || $scope.notClassificationGrounds[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք փակվող տողը', 'Error getTransfer');
            return;
        }

        $scope.params = {
            notClassificationGrounds: $scope.notClassificationGrounds[$scope.selectedRow],
            leasingCustNumber: $scope.leasingCustomerNumber

        };

        $scope.openWindow('/LeasingCustomerClassification/DeleteConnectionGroundsForNotClassifyingWithCustomer', '', 'deleteConnectionGroundsForNotClassifyingWithCustomerForm');
    }

    $scope.CloseConnectionGroundsForNotClassifyingWithCustomer = function () {


        $confirm({ title: 'Ուշադրություն', text: 'Փակե՞լ ընտրված դասը' })
            .then(function () {

                var data = LeasingCustomerClassificationService.CloseConnectionGroundsForNotClassifyingWithCustomer($scope.closingDocumentNmber, $scope.closingDate, $scope.notClassificationGrounds.ClassificationID);
                data.then(

                    function (response) {
                        $scope.ResultCode = response.data.ResultCode;

                        if ($scope.ResultCode == 1) {
                            $scope.Message = 'Հաջողությամբ փակվել է:';
                            ShowMessage($scope.Message, 'success');
                            CloseBPDialog('deleteConnectionGroundsForNotClassifyingWithCustomerForm');
                            $scope.GetConnectionGroundsForNotClassifyingWithCustomer();
                            //angular.element(document.getElementById('CustomerClassification')).scope().GetConnectionGroundsForNotClassifyingWithCustomer();
                        } else {
                            if ($scope.ResultCode == 4) {
                                $scope.Message = response.data.Errors[0].Description;
                                showMesageBoxDialog($scope.Message, 'Error');
                            } else {
                                showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error getTransfer');
                            }
                        }
                    },
                    function (error) {
                        ShowMessage('Տեղի ունեցավ սխալ ', 'error');
                    }
                );


            }, function () {
                return;
            });

    };

    $scope.closeDeleteConnectionGroundsForNotClassifyingWithCustomerView = function () {
        $scope.$parent.modalInstance.close();
    }

    //------------------------
    $scope.keyPressDeleteConnectionGroundsForNotClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            $scope.CloseConnectionGroundsForNotClassifyingWithCustomer();
        }
    };

    $scope.keyPressCloseDeleteConnectionGroundsForNotClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            $scope.closeDeleteConnectionGroundsForNotClassifyingWithCustomerView();
        }
    };

    //------------------------

    // Հաճախորդի հետ փոխկապակցված անձանց դասակարգելու հիմքեր (աղյուսակ 3)
    $scope.GetConnectionGroundsForClassifyingWithCustomer = function () {
        if ($scope.leasingCustomerNumber == undefined || $scope.leasingCustomerNumber == 0 || $scope.leasingCustomerNumber == null) {
            $scope.leasingCustomerNumber = $scope.leasingCustNumber;
        }

        var data = LeasingCustomerClassificationService.GetConnectionGroundsForClassifyingWithCustomer($scope.leasingCustomerNumber, $scope.isActive3);
        data.then(
            function (response) {

                $scope.classificationGrounds = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            });
    };

    // Ավելացնում է փոխկապակցված անձ (Հաճախորդի հետ փոխկապակցված անձանց դասակարգելու հիմքեր աղյուսակում)
    $scope.AddConnectionGroundsForClassifyingWithCustomer = function () {
        if ($scope.interconnectedPerson3 == undefined || $scope.interconnectedPerson3 == 0) {
            ShowMessage('Ընտրեք փոխկապակցված հաճախորդի համարը ', 'error');
            return;
        }
        $scope.classificationObj = {};
        $scope.classificationObj.LinkedCustomerNumber = $scope.interconnectedPerson3;
        $scope.classificationObj.LeasingCustomerNumber = $scope.leasingCustNumber;
        $scope.classificationObj.ReportNumber = $scope.repNumber3;
        $scope.classificationObj.ReportDate = $scope.date3;

        var data = LeasingCustomerClassificationService.AddConnectionGroundsForClassifyingWithCustomer($scope.classificationObj);
        data.then(
            function (res) {
                $scope.ResultCode = res.data.ResultCode;

                if ($scope.ResultCode == 1) {
                    $scope.Message = 'Մուտքագրումը հաջողությամբ կատարվել է:';
                    ShowMessage($scope.Message, 'success');
                    CloseBPDialog('addConnectionGroundsForClassifyingWithCustomerForm');
                    $scope.GetConnectionGroundsForClassifyingWithCustomer();

                } else {
                    if ($scope.ResultCode == 4) {
                        $scope.Message = res.data.Errors[0].Description;
                        showMesageBoxDialog($scope.Message, 'Error');
                    } else {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error getTransfer');
                    }

                }

            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );

    };

    //-------------------------------------------------------
    $scope.keyPressAddConnectionGroundsForClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            $scope.AddConnectionGroundsForClassifyingWithCustomer();
        }
    };

    $scope.keyPressCloseBPDialogAddConnectionGroundsForClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            CloseBPDialog('addConnectionGroundsForClassifyingWithCustomerForm');
        }
    };

    $scope.keyPressCloseConnectionGroundsForClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            $scope.CloseConnectionGroundsForClassifyingWithCustomer();
        }
    };
    $scope.keyPressCloseBPDialogCloseConnectionGroundsForClassifyingWithCustomer = function (event) {
        if (event.keyCode == 13) {
            CloseBPDialog('closeConnectionGroundsForClassifyingWithCustomerForm');
        }
    };

    //-------------------------------------------------------

    $scope.GetConnectionGroundsForClassifyingWithCustomerByIDView = function () {
        if ($scope.classificationGrounds[$scope.selectedRow] == null || $scope.classificationGrounds[$scope.selectedRow] == undefined || $scope.classificationGrounds[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք դիտարկվող տողը', 'Error getTransfer');
            return;
        }

        $scope.params = {
            id3: $scope.classificationGrounds[$scope.selectedRow].ClassificationID,
            custNamber3: $scope.customerNumber
        };

        $scope.openWindow('/LeasingCustomerClassification/GetConnectionGroundsForClassifyingWithCustomerDetails', 'Դիտարկում', 'getConnectionGroundsForClassifyingWithCustomerDetailsForm');

    };

    $scope.CloseConnectionGroundsForClassifyingWithCustomerView = function () {
        if ($scope.classificationGrounds[$scope.selectedRow] == null || $scope.classificationGrounds[$scope.selectedRow] == undefined || $scope.classificationGrounds[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք փակվող տողը', 'Error getTransfer');
            return;
        }

        $scope.params = {
            closeCustomerNamber3: $scope.classificationGrounds[$scope.selectedRow].CustomerNumber,
            closeId: $scope.classificationGrounds[$scope.selectedRow].ClassificationID,
            cusomertNamber3: $scope.customerNumber,
            leasingCustNumber: $scope.leasingCustomerNumber,
            isClos: $scope.isActive3
        };

        $scope.openWindow('/LeasingCustomerClassification/CloseConnectionGroundsForClassifyingWithCustomer', 'Դասակարգվող կապակցված անձի հեռացում', 'closeConnectionGroundsForClassifyingWithCustomerForm');

    };

    // Հեռացնում է տող աղյուսակ 3-ից                                  
    $scope.CloseConnectionGroundsForClassifyingWithCustomer = function () {

        $scope.classificationObj = {};
        $scope.classificationObj.Id = $scope.closeId;
        $scope.classificationObj.LeasingCustomerNumber = $scope.leasingCustNumber;
        $scope.classificationObj.ReportNumber = $scope.closeRepnumber3;
        $scope.classificationObj.ReportDate = $scope.closeDate3;
        $scope.classificationObj.ClassificationReason = $scope.closeCustomerNamber3;


        var data = LeasingCustomerClassificationService.CloseConnectionGroundsForClassifyingWithCustomer($scope.classificationObj, $scope.isClos);
        data.then(
            function (res) {
                $scope.ResultCode = res.data.ResultCode;

                if ($scope.ResultCode == 1) {
                    $scope.Message = 'Հեռացումը հաջողությամբ կատարվել է:';
                    ShowMessage($scope.Message, 'success');
                    CloseBPDialog('closeConnectionGroundsForClassifyingWithCustomerForm');
                    $scope.GetConnectionGroundsForClassifyingWithCustomer();

                } else {
                    if ($scope.ResultCode == 4) {
                        $scope.Message = res.data.Errors[0].Description;
                        showMesageBoxDialog($scope.Message, 'Error');
                    } else {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error getTransfer');
                    }

                }

            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );

    };

    //ՀԱՃԱԽՈՐԴԻ ԴԱՍԱԿԱՐԳՄԱՆ ՊԱՏՄՈՒԹՅՈՒՆ 
    $scope.GetCustomerClassificationHistory = function () {

        if ($scope.date == null || $scope.date == undefined) {
            ShowMessage('Ամսաթիվը սխալ է ', 'error');
            return;
        }
        var data = LeasingCustomerClassificationService.GetCustomerClassificationHistory($scope.leasingCustomerNumber, $scope.date);
        data.then(
            function (response) {

                $scope.classificationHistory = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            });
    };

    $scope.CustomerClassificationHistoryByIDView = function () {
        if ($scope.classificationHistory[$scope.selectedRow] == null || $scope.classificationHistory[$scope.selectedRow] == undefined || $scope.classificationHistory[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք դիտարկվող տողը', 'Error getTransfer');
            return;
        }

        $scope.params = {
            id4: $scope.classificationHistory[$scope.selectedRow].ClassificationID,
            classificationHistory: $scope.classificationHistory[$scope.selectedRow]
        };

        $scope.openWindow('/LeasingCustomerClassification/CustomerClassificationHistoryDetails', 'Դիտարկում', 'customerClassificationHistoryDetailsForm');


    };

    //Վերադարձնում է աղյուսակ 4-ի ընտրված տողի տվըալները 
    $scope.GetCustomerClassificationHistoryByID = function () {
        var data = LeasingCustomerClassificationService.GetCustomerClassificationHistoryByID($scope.id4, $scope.classificationHistory.AccountOrLink, $scope.classificationHistory.SubstitutePersonNumber);
        data.then(
            function (response) {
                $scope.classificationHistory = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    // Կապը հաճախորդների միջև
    $scope.CustomercConnectionView = function () {
        $scope.params = {

            SelectedCustomerNumberN1: $scope.leasingCustomerNumber
        };

        $scope.openWindow('/LeasingCustomerClassification/LeasingCustomerConnection', 'Դասակարգվող կապակցված անձի ավելացում', 'leasingCustomerConnectionForm');

    };

    $scope.CustomerConnectionResult = function () {
        if ($scope.CustomerN2 == null || $scope.CustomerN2 == undefined || $scope.CustomerN2 == "") {
            $scope.connectionResult = false;
            return;
        }
        var data = LeasingCustomerClassificationService.CustomerConnectionResult($scope.SelectedCustomerNumberN1, $scope.CustomerN2);
        data.then(
            function (response) {
                $scope.connectionResult = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    //   Տեղեկատվությաուն հաճախորդների կապի  վերաբերյալ     
    $scope.printCustomerConnectionData = function () {
        if ($scope.CustomerN2 == null || $scope.CustomerN2 == undefined || $scope.CustomerN2 == "" || $scope.SelectedCustomerNumberN1 == null || $scope.SelectedCustomerNumberN1 == undefined || $scope.SelectedCustomerNumberN1 == "") {
            ShowMessage('Ընտրեք հաճախորդին', 'error');
        }
        var data = LeasingCustomerClassificationService.CustomerConnectionResult($scope.SelectedCustomerNumberN1, $scope.CustomerN2);
        data.then(
            function (response) {
                $scope.connectionResult = response.data;
                if ($scope.connectionResult == false) {
                    ShowMessage('Տվյալ հաճախորդների միջև կապը բացակայում է', 'error');
                    return;
                }
                showloading();
                var Data = LeasingCustomerClassificationService.printCustomerConnectionData($scope.SelectedCustomerNumberN1, $scope.CustomerN2);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 41, ReportExportFormat: 2 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowExcelReport(result, "CustomerConnectionData_" + new Date().toString("ddMMyyyy"));
                    });  
                }, function () {
                        alert('Error printCustomerConnectionData');
                });
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );

    };

    $scope.SubjectiveClassificationDetailsView = function () {
        if ($scope.subjectiveClassificationGrounds[$scope.selectedRow] == null || $scope.subjectiveClassificationGrounds[$scope.selectedRow] == undefined || $scope.subjectiveClassificationGrounds[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք դիտարկվող տողը', 'Error getTransfer');
            return;
        }
        $scope.params = {
            id1: $scope.subjectiveClassificationGrounds[$scope.selectedRow].ClassificationID
        };

        $scope.openWindow('/LeasingCustomerClassification/SubjectiveClassificationDetails', 'Հաճախորդի դասակարգման դիտարկում', 'subjectiveClassificationDetailsForm');

    };

    // Մուտքագրում աղյուսակ 1-ի համար
    $scope.AddCustomerSubjectiveClassificationGroundsView = function () {
        $scope.params = {
            custNamber: $scope.customerNumber,
            leasingCustNumber: $scope.leasingCustomerNumber
        };

        $scope.openWindow('/LeasingCustomerClassification/AddCustomerSubjectiveClassificationGrounds', 'Հաճախորդի դասակարգում', 'addCustomerSubjectiveClassificationGroundsForm');

    };

    // Մուտքագրում աղյուսակ 2-ի համար
    $scope.AddConnectionGroundsForNotClassifyingWithCustomerView = function () {
        $scope.params = {
            custNamber: $scope.customerNumber,
            leasingCustNumber: $scope.leasingCustomerNumber
        };

        $scope.openWindow('/LeasingCustomerClassification/AddConnectionGroundsForNotClassifyingWithCustomer', 'Չդասակարգվող կապակցված անձի ավելացում', 'addConnectionGroundsForNotClassifyingWithCustomerForm');

    };

    $scope.NotClassifyingWithCustomerDetailsView = function () {
        if ($scope.notClassificationGrounds[$scope.selectedRow] == null || $scope.notClassificationGrounds[$scope.selectedRow] == undefined || $scope.notClassificationGrounds[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք դիտարկվող տողը', 'Error getTransfer');
            return;
        }

        $scope.params = {
            id2: $scope.notClassificationGrounds[$scope.selectedRow].ClassificationID

        };

        $scope.openWindow('/LeasingCustomerClassification/NotClassifyingWithCustomerDetails', 'Դիտարկում', 'notClassifyingWithCustomerDetailsForm');

    };

    $scope.AddConnectionGroundsForClassifyingWithCustomerView = function () {
        $scope.params = {
            custNamber: $scope.customerNumber,
            leasingCustNumber: $scope.leasingCustomerNumber
        };

        $scope.openWindow('/LeasingCustomerClassification/AddConnectionGroundsForClassifyingWithCustomer', 'Դասակարգվող կապակցված անձի ավելացում', 'addConnectionGroundsForClassifyingWithCustomerForm');
    };


    // Հաճախորդի վարկը անհուսալի դասով չդասակարգելու հիմքեր (աղյուսակ 5)
    $scope.GetGroundsForNotClassifyingCustomerLoan = function () {

        var data = LeasingCustomerClassificationService.GetGroundsForNotClassifyingCustomerLoan($scope.leasingCustomerNumber, $scope.isActive5);
        data.then(
            function (response) {

                $scope.notClassifyingCustomerLoan = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            });
    };

    $scope.AddGroundsForNotClassifyingCustomerLoanView = function () {
        $scope.params = {
            loanCustNamber: $scope.leasingCustomerNumber,
            notClassifyingCustomerLoan: $scope.notClassifyingCustomerLoan[$scope.selectedRow]
        };

        $scope.openWindow('/LeasingCustomerClassification/AddGroundsForNotClassifyingCustomerLoan', 'Անհուսալի դասով չդասակարգելու զեկուցագիր', 'addGroundsForNotClassifyingCustomerLoanForm');

    };

    $scope.GetLoanInfo = function () {
        var data = LeasingCustomerClassificationService.GetLoanInfo($scope.loanCustNamber);
        data.then(
            function (response) {
                $scope.loanInfo = response.data;
            },
            function (erroe) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    $scope.AddGroundsForNotClassifyingCustomerLoan = function () {
        if ($scope.appId == undefined || $scope.appId == 0) {
            ShowMessage('Վարկը նշված չէ ', 'error');
            return;
        }
        $scope.classificationObj = {};
        $scope.classificationObj.AppId = $scope.appId;
        $scope.classificationObj.LeasingCustomerNumber = $scope.loanCustNamber;
        $scope.classificationObj.ReportNumber = $scope.docNumber;
        $scope.classificationObj.ReportDate = $scope.reportDate;
        $scope.classificationObj.Account = 0;
        $scope.classificationObj.DateOfBeginning = new Date();
        $scope.classificationObj.AdditionalDescription = $scope.addInfo;

        var data = LeasingCustomerClassificationService.AddGroundsForNotClassifyingCustomerLoan($scope.classificationObj);
        data.then(
            function (res) {
                $scope.ResultCode = res.data.ResultCode;

                if ($scope.ResultCode == 1) {
                    $scope.Message = 'Մուտքագրումը հաջողությամբ կատարվել է:';
                    ShowMessage($scope.Message, 'success');
                    CloseBPDialog('addGroundsForNotClassifyingCustomerLoanForm');
                    $scope.GetGroundsForNotClassifyingCustomerLoan();
                } else {
                    if ($scope.ResultCode == 4) {
                        $scope.Message = res.data.Errors[0].Description;
                        showMesageBoxDialog($scope.Message, 'Error');
                    } else {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error getTransfer');
                    }
                }
            },
            function (erroe) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    $scope.GetGroundsForNotClassifyingCustomerLoanByIDView = function () {
        if ($scope.notClassifyingCustomerLoan[$scope.selectedRow] == null || $scope.notClassifyingCustomerLoan[$scope.selectedRow] == undefined || $scope.notClassifyingCustomerLoan[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք դիտարկվող տողը', 'Error getTransfer');
            return;
        }

        $scope.params = {
            id5: $scope.notClassifyingCustomerLoan[$scope.selectedRow].ClassificationID,
            notClassifyingCustomerAccount: $scope.notClassifyingCustomerLoan[$scope.selectedRow].Account
        };

        $scope.openWindow('/LeasingCustomerClassification/GetGroundsForNotClassifyingCustomerLoanDetails', 'Դիտարկում', 'getGroundsForNotClassifyingCustomerLoanDetailsForm');

    };

    $scope.keyPressAddGroundsForNotClassifyingCustomerLoan = function (event) {
        if (event.keyCode == 13) {
            $scope.AddGroundsForNotClassifyingCustomerLoan();
        }
    };

    $scope.keyPressCloseBPDialogAddGroundsForNotClassifyingCustomerLoan = function (event) {
        if (event.keyCode == 13) {
            CloseBPDialog('addGroundsForNotClassifyingCustomerLoanForm');
        }
    };

    $scope.keyPressCloseGroundsForNotClassifyingCustomerLoan = function (event) {
        if (event.keyCode == 13) {
            $scope.CloseGroundsForNotClassifyingCustomerLoan();
        }
    };

    $scope.keyPressCloseBPDialogCloseGroundsForNotClassifyingCustomerLoan = function (event) {
        if (event.keyCode == 13) {
            CloseBPDialog('CloseGroundsForNotClassifyingCustomerLoan');
        }
    };

    /// Վերադարձնում է Հաճախորդի վարկը անհուսալի դասով չդասակարգելու հիմքեր աղյուսակի ընտրված տողի տվըալները 
    $scope.GetGroundsForNotClassifyingCustomerLoanByID = function () {
        var data = LeasingCustomerClassificationService.GetGroundsForNotClassifyingCustomerLoanByID($scope.id5);
        data.then(
            function (response) {
                $scope.forNotClassifyingCustomerLoan = response.data;
            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };

    $scope.CloseGroundsForNotClassifyingCustomerLoanView = function () {
        if ($scope.notClassifyingCustomerLoan[$scope.selectedRow] == null || $scope.notClassifyingCustomerLoan[$scope.selectedRow] == undefined || $scope.notClassifyingCustomerLoan[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք փակվող տողը', 'Error getTransfer');
            return;
        }
        $scope.params = {
            closeId: $scope.notClassifyingCustomerLoan[$scope.selectedRow].ClassificationID,
            closeAccount: $scope.notClassifyingCustomerLoan[$scope.selectedRow].Account,
            closeApp: $scope.notClassifyingCustomerLoan[$scope.selectedRow].AppId
        };

        $scope.openWindow('/LeasingCustomerClassification/CloseGroundsForNotClassifyingCustomerLoan', 'Անհուսալի դասով չդասակարգելու փակման զեկուցագիր', 'closeGroundsForNotClassifyingCustomerLoanForm');
    };


    $scope.CloseGroundsForNotClassifyingCustomerLoan = function () {
        var data = LeasingCustomerClassificationService.CloseGroundsForNotClassifyingCustomerLoan($scope.closeApp, $scope.closeId, $scope.closeDocNumber, $scope.closeReportDate);
        data.then(
            function (res) {
                $scope.ResultCode = res.data.ResultCode;

                if ($scope.ResultCode == 1) {
                    $scope.Message = 'Հաջողությամբ փակվել է:';
                    ShowMessage($scope.Message, 'success');
                    CloseBPDialog('closeGroundsForNotClassifyingCustomerLoanForm');
                    $scope.GetGroundsForNotClassifyingCustomerLoan();
                } else {
                    if ($scope.ResultCode == 4) {
                        $scope.Message = res.data.Errors[0].Description;
                        ShowMessage($scope.Message, 'Error');
                    } else {
                        ShowMessage('Տեղի ունեցավ սխալ', 'Error');
                    }
                }
            },
            function (erroe) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    };


    $scope.EditCustomerSubjectiveClassificationGroundsView = function () {

        if ($scope.subjectiveClassificationGrounds[$scope.selectedRow] == null || $scope.subjectiveClassificationGrounds[$scope.selectedRow] == undefined || $scope.subjectiveClassificationGrounds[$scope.selectedRow] == "") {
            showMesageBoxDialog('Ընտրեք դիտարկվող տողը', 'Error getTransfer');
            return;
        }
        $scope.params = {
            custNamber: $scope.customerNumber,
            leasingCustNumber: $scope.leasingCustomerNumber,
            id1: $scope.subjectiveClassificationGrounds[$scope.selectedRow].ClassificationID
        };


        $scope.openWindow('/LeasingCustomerClassification/EditCustomerSubjectiveClassificationGrounds', 'Հաճախորդի դասակարգման խմբագրում', 'editCustomerSubjectiveClassificationGroundsForm');

    };


    $scope.keyPressCloseBPDialogEditCustomerSubjectiveClassificationGrounds = function (event) {
        if (event.keyCode == 13) {
            CloseBPDialog('editCustomerSubjectiveClassificationGroundsForm');
        }
    }

    $scope.keyPressEditCustomerSubjectiveClassificationGrounds = function (event) {
        if (event.keyCode == 13) {
            $scope.EditCustomerSubjectiveClassificationGrounds();
        }
    }

    //Վերադարձնում է  ՀաՃախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակի ընտրված տողի տվյալները
    $scope.GetCustomerSubjectiveClassificationGroundsByIDForEdit = function () {
        var data = LeasingCustomerClassificationService.GetCustomerSubjectiveClassificationGroundsByIDForEdit($scope.id1);
        data.then(
            function (response) {
                $scope.classificationType = response.data.ClassificationType;
                $scope.reportNumber = response.data.ReportNumber;
                if (response.data.ReportDate != "/Date(-62135596800000)/") {
                    $scope.reportDate = new Date(parseInt(response.data.ReportDate.substr(6)));
                }
                else {
                    $scope.reportDate = null;
                }
                $scope.additionalDescription = response.data.AdditionalDescription;
                $scope.classificationClass = response.data.RiskClassName;
                $scope.classificationdate = new Date(parseInt(response.data.ClassificationDate.substr(6)));
                $scope.isDaysAccumulated = response.data.CalcByDays;
                if ($scope.classificationType == 1) {
                    $scope.classificationClass = "ստանդարտ";
                }
                if ($scope.classificationClass != null) {
                    $scope.RiskDaysCountAndName();
                }
                var data1 = LeasingCustomerClassificationService.GetReasonTypes($scope.classificationType);

                data1.then(
                    function (res) {
                        $scope.types = res.data;
                        $scope.reasonDescriptionID = parseInt(response.data.Description);
                    },
                    function (error) {
                        ShowMessage('Տեղի ունեցավ սխալ ', 'error');
                    }
                );


            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');

            }
        );
    };

    $scope.EditCustomerSubjectiveClassificationGrounds = function () {
        if ($scope.classificationType == undefined || $scope.classificationType == 0) {
            showMesageBoxDialog('Ընտրեք տեսակը', 'Error ');
            return;
        }
        if ($scope.reasonDescriptionID == undefined) {
            showMesageBoxDialog('Ընտրեք հիմքը', 'Error ');
            return;
        }

        $scope.classificationObj = {};
        $scope.classificationObj.Id = $scope.id1;
        $scope.classificationObj.LeasingCustomerNumber = $scope.leasingCustNumber;
        $scope.classificationObj.ReportNumber = $scope.reportNumber;
        $scope.classificationObj.ReportDate = $scope.reportDate;
        $scope.classificationObj.ClassificationReason = $scope.reasonDescriptionID;
        $scope.classificationObj.AdditionalDescription = $scope.additionalDescription;
        $scope.classificationObj.RiskClassName = $scope.classificationClass;
        $scope.classificationObj.ClassificationDate = $scope.classificationdate;
        $scope.classificationObj.CalcByDays = $scope.isDaysAccumulated;
        $scope.classificationObj.ClassificationType = $scope.classificationType;

        var data = LeasingCustomerClassificationService.EditCustomerSubjectiveClassificationGrounds($scope.classificationObj);
        data.then(
            function (res) {
                $scope.ResultCode = res.data.ResultCode;
                if ($scope.ResultCode == 1) {
                    $scope.Message = 'Պահպանումը հաջողությամբ կատարվել է:';
                    ShowMessage($scope.Message, 'success');
                    CloseBPDialog('editCustomerSubjectiveClassificationGroundsForm');
                    $scope.GetCustomerSubjectiveClassificationGrounds();
                } else {
                    if ($scope.ResultCode == 4) {
                        $scope.Message = res.data.Errors[0].Description;
                        showMesageBoxDialog($scope.Message, 'Error');
                    } else {
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', 'Error ');
                    }

                }

            },
            function (error) {
                ShowMessage('Տեղի ունեցավ սխալ ', 'error');
            }
        );
    }

    $scope.printOneMoreTimeClassifiedCustomersReport = function () {
        showloading();
        var requestObj = { Parameters: null, ReportName: 42, ReportExportFormat: 2 }
        ReportingApiService.getReport(requestObj, function (result) {
            ShowExcelReport(result, "OneMoreTimeClassifiedCustomers_" + new Date().toString("ddMMyyyy"));
        });  
    };

    $scope.printCustomersWithOpenBaseReport = function () {
        showloading();
        var requestObj = { Parameters: null, ReportName: 48, ReportExportFormat: 2 }
        ReportingApiService.getReport(requestObj, function (result) {
            ShowExcelReport(result, "CustomersWithOpenBase_" + new Date().toString("ddMMyyyy"));
        }); 
    };

    $scope.printClassificationBaseChangedCustomersReport = function () {
        showloading();
        var requestObj = { Parameters: null, ReportName: 49, ReportExportFormat: 2 }
        ReportingApiService.getReport(requestObj, function (result) {
            ShowExcelReport(result, "ClassificationBaseChangedCustomers_" + new Date().toString("ddMMyyyy"));
        }); 
    };

    $scope.openWindow = function (url, title, id, callbackFunction) {
        $scope.disabelButton = true;
        if (!document.getElementById(id)) {
            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.open(id, $scope, title, url, dialogOptions, undefined, undefined, callbackFunction);
        }
        else {
            $scope.disabelButton = true;
        }

    };
}]);

function CloseBPDialog(dialogID) {
    var dialog = document.querySelector('#' + dialogID);
    $('#' + dialogID).hide();
    dialog.parentNode.removeChild(dialog);
    if (document.querySelector('.bp-dialog-overlay')) {
        $('.bp-dialog-overlay').css("display", "none");
    }
    return false;
};