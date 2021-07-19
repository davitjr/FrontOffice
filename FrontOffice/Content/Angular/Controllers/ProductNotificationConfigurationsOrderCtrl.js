app.controller("productNotificationConfigurationsOrderCtrl", ['$scope', 'productNotificationConfigurationsOrderService', 'accountService','infoService', '$http', 'customerService',  function ($scope, productNotificationConfigurationsOrderService,accountService, infoService, $http, customerService) {

    $scope.order = {};
    $scope.order.RegistrationDate = new Date();
    $scope.order.OperationDate = $scope.$root.SessionProperties.OperationDate;
    if  ($scope.operationType == 1)      //Մուտքագրում
        $scope.order.Type = 175;
    else if ($scope.operationType == 2)  //Փոփոխում
        $scope.order.Type = 179;
    else if ($scope.operationType == 3)  //Հեռացում
        $scope.order.Type = 180;
    $scope.order.SubType = 1;
    $scope.order.configuration = {};
    if ($scope.config != undefined) {
        $scope.order.configuration = $scope.config;
    }
    else
    {
        $scope.order.configuration.InformationType = $scope.informationType;
        $scope.order.configuration.ProductType = $scope.productType;
        $scope.order.configuration.ProductId = $scope.productId;
        $scope.order.configuration.OperationType = $scope.operationType;
    }
    $scope.getCustomerMainData = function () {
        customerService.getAuthorizedCustomerNumber().then(function (authCustomer) {
            $scope.authorizedCustomerNumber = authCustomer.data;
            customerService.getCustomerMainData($scope.authorizedCustomerNumber).then(function(customerData) {
                $scope.customerMainData = customerData.data;
            });
        });
          // customerService.getCustomerMainData($scope.customernumber).then(function (customerData) {
          //      $scope.customerMainData = customerData.data;
          //});
    };

    $scope.saveProductNotificationsConfigurationsOrder = function () {

        //Validacia Email,Phone 
        if (($scope.order.configuration.NotificationOption == 2 || $scope.order.configuration.NotificationOption == 5)
            && ($scope.order.configuration.CommunicationIds == undefined || $scope.order.configuration.CommunicationIds.length == 0)
            && $scope.order.configuration.AllComunications != true
            && $scope.operationType!= 3
        )
        {
            return;
        }
        if ($http.pendingRequests.length == 0) {
            document.getElementById("notificationConfigurationLoad").classList.remove("hidden");
            $scope.order.configuration.CustomerNumber = $scope.authorizedCustomerNumber;
            //$scope.order.configuration.CustomerNumber = $scope.customernumber;
            var Data = productNotificationConfigurationsOrderService.saveProductNotificationsConfigurationsOrder($scope.order);
            Data.then(function (res) {

                if (validate($scope, res.data)) {
                    document.getElementById("notificationConfigurationLoad").classList.add("hidden");
                    showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                    CloseBPDialog('productNotificationConfigurationsOrder');
                    refresh($scope.order.Type);
                }
                else {
                    document.getElementById("notificationConfigurationLoad").classList.add("hidden");
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                }

            }, function () {
                document.getElementById("notificationConfigurationLoad").classList.add("hidden");
                showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                alert('Error saveProductNotificationsConfigurationsOrder');
            });
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }
    };

    $scope.getProductNotificationInformationTypes = function () {

        var Data = infoService.getProductNotificationInformationTypes();
        Data.then(function (types) {
            $scope.informationTypes = types.data;

        }, function () {
            alert('Error');
        });
    }

    $scope.getProductNotificationFrequencyTypes = function () {
        var Data = infoService.getProductNotificationFrequencyTypes($scope.order.configuration.InformationType);
        Data.then(function (types) {
            $scope.frequencyTypes = types.data;

        }, function () {
            alert('Error');
        });
    }

    $scope.getProductNotificationOptionTypes = function () {
        var Data = infoService.getProductNotificationOptionTypes($scope.order.configuration.InformationType);
        Data.then(function (types) {
            $scope.optionTypes = types.data;

        }, function () {
            alert('Error');
        });
    }

    $scope.getProductNotificationLanguageTypes = function () {
        var Data = infoService.getProductNotificationLanguageTypes($scope.order.configuration.InformationType);
        Data.then(function (types) {
            $scope.languageTypes = types.data;

        }, function () {
            alert('Error');
        });
    }

    $scope.getProductNotificationFileFormatTypes = function () {

        var Data = infoService.getProductNotificationFileFormatTypes();
        Data.then(function (types) {
            $scope.productNotificationFileFormatTypes = types.data;

        }, function () {
            alert('Error');
        });
    }


    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.selectedConfig = $scope.productNotificationConfigurations[index];
    };


    $scope.getProductNotificationConfigurations = function ()
    {
        var Data = productNotificationConfigurationsOrderService.getProductNotificationConfigurations($scope.productid);
        Data.then(function (configs) {
            $scope.productNotificationConfigurations = configs.data;

        }, function () {
            alert('getProductNotificationConfigurations');
        });
    }

    $scope.changeAllCommunications = function () {
        $scope.order.configuration.CommunicationIds = undefined;
    }

    $scope.printProductNotificationContract = function () {
        if ($http.pendingRequests.length == 0) {
            //$scope.order.configuration.CustomerNumber = $scope.customernumber;
            $scope.order.configuration.CustomerNumber = $scope.authorizedCustomerNumber;
            if ($scope.order.configuration.NotificationOption == 2)
            {
                $scope.order.configuration.Emails = $scope.getConcatEmails();
            }
            var Data = productNotificationConfigurationsOrderService.printProductNotificationContract($scope.order.configuration);
            showloading();
            ShowPDF(Data);
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Հանձնարական>> կոճակը:', 'error');
        }
    };

    $scope.getConcatEmails = function () {
        var emails = '';
        if ($scope.order.configuration.AllComunications == true) {
            for (var i = 0; i < $scope.customerMainData.Emails.length; i++) {
                    emails += $scope.customerMainData.Emails[i].email.emailAddress + ',';
            }
        }
        else
        {
            for (var i = 0; i < $scope.customerMainData.Emails.length; i++) {
                for (var j = 0; j < $scope.order.configuration.CommunicationIds.length; j++) {
                    if ($scope.customerMainData.Emails[i].id == $scope.order.configuration.CommunicationIds[j]) {
                        emails += $scope.customerMainData.Emails[i].email.emailAddress + ',';
                    }
                }
            }
        }
        emails = emails.slice(0, -1);
        return emails;
    }
    $scope.getProductNotificationConfigurationOrder = function (orderID) {
        var Data = productNotificationConfigurationsOrderService.getProductNotificationConfigurationOrder(orderID);
        Data.then(function (or) {
            $scope.order = or.data;     
        }, function () {
            alert('Error getting  Order');
        });
    };
	}]);