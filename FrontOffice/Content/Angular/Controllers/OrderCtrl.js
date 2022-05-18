app.controller('OrderCtrl', ['$scope', 'orderService', 'utilityPaymentService', '$location', 'dialogService', '$confirm', '$uibModal', 'customerService', 'casherService', 'arcaCardsTransactionOrderService', 'remittanceCancellationOrderService', 'fastTransferPaymentOrderService', 'remittanceAmendmentOrderService', 'plasticCardService', 'creditLineService', 'ReportingApiService', 'cardlessCashoutCancellationOrderCtrlService', function ($scope, orderService, utilityPaymentService, $location, dialogService, $confirm, $uibModal, customerService, casherService, arcaCardsTransactionOrderService, remittanceCancellationOrderService, fastTransferPaymentOrderService, remittanceAmendmentOrderService, plasticCardService, creditLineService, ReportingApiService, cardlessCashoutCancellationOrderCtrlService) {

    $scope.OrderType = '0';
    $scope.OrderQualityType = '0';
    $scope.dateFrom = new Date();
    $scope.dateTo = new Date();
    $scope.CardRenewType = {
        WithSameType: "Նույն տեսակով",
        WithNewType: "Այլ տեսակով"
    };

    try {
        $scope.canApproveFondChange = $scope.$root.SessionProperties.AdvancedOptions["canApproveFondChange"];
        $scope.isCardDepartment = $scope.$root.SessionProperties.AdvancedOptions["isCardDepartment"];
        $scope.isOnlineAcc = $scope.$root.SessionProperties.AdvancedOptions["isOnlineAcc"];
    }
    catch (ex) {
        $scope.canChangeDepositRate = "0";
    }


    $scope.searchParams = {
        DateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        DateTo: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
        Type: '0',
        OrderQuality: undefined
    };

    $scope.allattachments = [];

    $scope.getOrders = function () {
        $scope.loading = true;

        if ($scope.$root.OpenMode == 1) {
            $scope.searchParams.IsCashBookOrder = true;
        }
        else if ($scope.$root.OpenMode == 14) {
            $scope.searchParams.IsFondOrder = true;
        }

        if ($scope.searchParams.RegisteredUserID == null || $scope.searchParams.RegisteredUserID == "") {
            $scope.searchParams.RegisteredUserID = 0;
        }

        var Data = orderService.getOrders($scope.searchParams);
        Data.then(function (orderList) {
            $scope.orders = orderList.data;

            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error');
        });
    };

    $scope.getOrderTypes = function () {
        $scope.orderTypes = [];
        var Data = orderService.GetOrderTypes();
        Data.then(function (ord) {
            $scope.orderTypes = ord.data;
            angular.forEach($scope.orderTypes, function (value, key) {
                if ($scope.$root.OpenMode == 1) {
                    if (key != 139 && key != 140 && key != 144 && key != 146 && key != 147 && key != 149 && key != 149 && key != 150)
                        delete $scope.orderTypes[key];
                }
                else if ($scope.$root.OpenMode == 14) {
                    if (key != 190 && key != 192)
                        delete $scope.orderTypes[key];
                }
                else {
                    if (key == 139 || key == 140 || key == 144 || key == 146 || key == 147 || key == 149 || key == 150 || key == 200)
                        delete $scope.orderTypes[key];
                }


            });
            $scope.orderTypes = FillCombo($scope.orderTypes);
        }, function () {
            alert('Error CashTypes');
        });
    };
    $scope.getOrderQualityTypes = function () {
        var Data = orderService.GetOrderQualityTypes();
        Data.then(function (ord) {
            $scope.orderQualityTypes = ord.data;

        }, function () {
            alert('Error CashTypes');
        });
    };

    $scope.getOrderHistory = function (orderID) {
        var Data = orderService.getOrderHistory(orderID);
        Data.then(function (ord) {
            $scope.historys = ord.data;
        }, function () {
            alert('Error OrderHistory');
        });
    };

    $scope.getOrderRejectHistory = function (orderID) {
        var Data = orderService.getOrderRejectHistory(orderID);
        Data.then(function (ord) {
            $scope.rejectHistory = ord.data;
        }, function () {
            alert('Error Order Reject History');
        });
    };

    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.canConfirmOrder = false;
        $scope.selectedOrderId = $scope.orders[index].Id;
        $scope.type = $scope.orders[index].Type;
        $scope.selectedSubTypeDescription = $scope.orders[index].SubTypeDescription;
        $scope.subType = $scope.orders[index].SubType;
        $scope.selectedQualityDescription = $scope.orders[index].QualityDescription;
        $scope.selectedSourceDescription = $scope.orders[index].SourceDescription;

        $scope.params = { selectedOrderId: $scope.selectedOrderId, type: $scope.type, selectedQualityDescription: $scope.selectedQualityDescription, selectedSourceDescription: $scope.selectedSourceDescription, subType: $scope.subType };
        $scope.setCanConfirmOrder($scope.orders[index]);

    }


    $scope.showModalOrder = function (type, subType, title) {
        $scope.error = "";
        switch (type) {
            case 4:
                var temp = '/Deposit/TerminateDepositDetails';
                var id = 'TerminateDepositDetails';
                var title = title;//'Ավանդի դադարեցման հայտ'
                break;
            case 9:
                var temp = '/DepositOrder/PersonalDepositOrderDetails';
                var id = 'PersonalDepositOrderDetails';
                var title = title;// 'Ավանդի ձևակերպման հայտ'
                break;
            case 20:
                var temp = '/ReferenceOrder/ReferenceOrderDetails';
                var id = 'ReferenceOrderDetails';
                var title = title;//'Տեղեկանքի ստացման հայտ'
                break;
            case 21:
                var temp = '/CreditLine/CreditLineTerminationOrderDetails';
                var id = 'CreditLineTerminationOrderDetails';
                var title = title;//'Վարկային գծի դադարեցման հայտ'
                break;
            case 22:
                var temp = '/ChequeBookOrder/ChequeBookOrderDetails';
                var id = 'ChequeBookOrderDetails';
                var title = title;//'Չեկային գրքույկի ստացման հայտ'
                break;
            case 23:
                var temp = '/CashOrder/CashOrderDetails';
                var id = 'CashOrderDetails';
                var title = title;// 'Գումարի ստացման/փոխանցման հայտ'
                break;
            case 24:
                var temp = '/StatmentByEmailOrder/StatmentByEmailOrderDetails';
                var id = 'StatmentByEmailOrderDetails';
                var title = title;//'Քաղվածքն էլեկտրոնային ստացման հայտ'
                break;
            case 26:
                var temp = '/SwiftCopyOrder/SwiftCopyOrderDetails';
                var id = 'SwiftCopyOrderDetails';
                var title = title;// 'Swift հաղորդագրության պատճենի ստացման հայտ'
                break;
            case 27:
                var temp = '/CustomerDataOrder/CustomerDataOrderDetails';
                var id = 'CustomerDataOrderDetails';
                var title = title;//'Տվյալների խմբագրման հայտ'
                break;
            case 50:
            case 124:
                var temp = '/AccountDataChangeOrder/AccountDataChangeOrderDetails';
                var id = 'AccountDataChangeOrderDetails';
                var title = 'Հաշվի տվյալների խմբագրման հայտ';
                break;
            case 6:
            case 2:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 65:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 95:
            case 113:
            case 122:
            case 121:
            case 123:
            case 133:
            case 134:
            case 145:
            case 184:
            case 185:
            case 248:
            case 249:
            case 251:
            case 253:
                var temp = '/PaymentOrder/PaymentOrderDetails';
                var id = 'PaymentOrderDetails';
                var title = title;//'Փոխանցում սեփական հաշիվների մեջ'
                break;
            case 1:
            case 56:
                if (subType == 2) {
                    var temp = '/PaymentOrder/TransferArmPaymentOrderDetails';
                    var id = 'TransferArmPaymentOrderDetails';
                    var title = title;//'Փոխանցում ՀՀ տարածքում'
                }
                else if (subType == 5) {
                    var temp = '/PaymentOrder/BudgetPaymentOrderDetails';
                    var id = 'BudgetPaymentOrderDetails';
                    var title = title;// 'Փոխանցում բյուջե'
                }
                else {
                    var temp = '/PaymentOrder/PaymentOrderDetails';
                    var id = 'PaymentOrderDetails';
                    var title = title;//'Փոխանցում սեփական հաշիվների մեջ'
                }

                break;
            case 15:
            case 60:
                var temp = '/UtilityPayment/UtilityPaymentOrderDetails';
                var id = 'UtilityPaymentOrderDetails';
                var title = title;// 'Կոմունալ վճարումներ'
                break;
            case 5:
                var temp = '/MatureOrder/MatureOrderDetails';
                var id = 'MatureOrderDetails';
                var title = title;// 'Վարկի մարման հայտ'
                break;
            case 8:
                var temp = '/MatureOrder/MatureOrderDetails';
                var id = 'MatureOrderDetails';
                var title = title;// 'Վարկային գծի մարման հայտ'
                break;
            case 7:
                var temp = '/AccountOrder/PersonalAccountOrderDetails';
                var id = 'PersonalAccountOrderDetails';
                var title = title;// 'Հաշվի բացման հայտ'
                break;
            case 17:
                var temp = '/AccountOrder/PersonalAccountOrderDetails';
                var id = 'PersonalAccountOrderDetails';
                var title = title;// 'Հօգուտ երրորդ անձի ընթացիկ հաշվի բացման հայտ'
                break;
            case 28:
                var temp = '/AccountOrder/PersonalAccountOrderDetails';
                var id = 'PersonalAccountOrderDetails';
                var title = title;// 'Հաշվի բացման հայտ'
                break;
            case 29:
                var temp = '/AccountClosingOrder/PersonalAccountClosingOrderDetails';
                var id = 'PersonalAccountClosingOrderDetails';
                var title = title;// 'Հաշվի փակման հայտ'
                break;
            case 30:
                var temp = '/CardClosingOrder/CardClosingOrderDetails';
                var id = 'CardClosingOrderDetails';
                var title = title;// 'Քարտի փակման հայտ'
                break;
            case 10:
                if (subType == 2) {
                    var temp = '/PeriodicOrder/PeriodicUtilityPaymentOrderDetails';
                    var id = 'PeriodicUtilityPaymentOrderDetails';
                    var title = title;// 'Պարբերական փոխանցման հայտ';
                }
                if (subType == 3 || subType == 1 || subType == 4 || subType == 5) {
                    var temp = '/PeriodicOrder/PeriodicPersonalPaymentOrderDetails';
                    var id = 'PeriodicUtilityPaymentOrderDetails';
                    var title = title;// 'Պարբերական փոխանցման հայտ';
                }
                break;
            case 201:
                var temp = '/PeriodicTransferDataChangeOrder/PeriodicTransferDataChangeOrderDetails';
                var id = 'PeriodicTransferDataChangeOrderDetails';
                var title = title;// 'Պարբերական փոխանցման փոփոխման հայտ';
                break;
            case 12:
                var temp = '/AccountOrder/PersonalAccountReOpenOrderDetails';
                var id = 'PersonalAccountReOpenOrderDetails';
                var title = title;//'Հաշվի վերաբացման հայտ';
                break;
            case 11:
                var temp = '/PeriodicTransfer/PeriodicTerminationOrderDetails';
                var id = 'PeriodicTerminationOrderDetails';
                var title = title;// 'Պարբերականի դադարեցման հայտ'
                break;
            case 3:
            case 64:
                var temp = '/InternationalPaymentOrder/InternationalPaymentOrderDetails';
                var id = 'InternationalPaymentOrderDetails';
                var title = title;//'Միջազգային փոխանցում'
                break;
            case 63:
                var temp = '/TransitPaymentOrder/TransitPaymentOrderDetails';
                var id = 'TransitPaymentOrderDetails';
                var title = title;//'Փոխանցում տարանցիկ հաշվին'
                break;
            case 58:
            case 59:
            case 61:
            case 62:
                var temp = '/Customer/ServicePaymentDetails';
                var id = 'ServicePaymentDetails';
                var title = title;
                break;
            case 13:
                var temp = '/LoanProductOrder/LoanOrderDetails';
                var id = 'LoanOrderDetails';
                var title = title;
                break;
            case 14:
            case 159:
                var temp = '/LoanProductOrder/CreditLineOrderDetails';
                var id = 'LoanOrderDetails';
                var title = title;
                break;

            case 66:
                var temp = '/AccountFreeze/AccountFreezeOrderDetails';
                var id = 'AccountFreezeOrderDetails';
                var title = title; //Հաշվի սառեցման հայտ
                break;
            case 67:
                var temp = '/AccountFreeze/AccountUnfreezeOrderDetails';
                var id = 'AccountUnfreezeOrderDetails';
                var title = title; //Հաշվի ապասառեցման հայտ
                break;
            case 69:
                var temp = '/HBActivationOrder/HBActivationOrderDetails';
                var id = 'HBActivationOrderDetails';
                var title = title;
                break;
            case 71:
            case 72:
                var temp = '/FeeForServiceProvidedOrder/FeeForServiceProvidedOrderDetails';
                var id = 'FeeForServiceProvidedOrderDetails';
                var title = title;
                break;
            case 68:
                var temp = '/CashPosPaymentOrder/CashPosPaymentOrderDetails';
                var id = 'CashPosPaymentOrderDetails';
                var title = title;//'Կանխիկացում POS տերմինալով'
                break;
            case 70:
                var temp = '/CardUnpaidPercentPaymentOrder/CardUnpaidPercentPaymentOrderDetails';
                var id = 'CardUnpaidPercentPaymentOrderDetails';
                var title = 'Տոկոսագումարի վճարում';
                break;
            case 73:
            case 74:
            case 109:
            case 110:
            case 111:
            case 141:
            case 152:
                var temp = '/LoanProductActivationOrder/LoanProductActivationOrderDetails';
                var id = 'LoanProductActivationOrderDetails';
                var title = title;
                break;
            case 18:
            case 19:
                var temp = '/RemovalOrder/RemovalOrderDetails';
                var id = 'RemovalOrderDetails';
                var title = title;
                break;
            case 75:
                var temp = '/ChequeBookReceiveOrder/ChequeBookReceiveOrderDetails';
                var id = 'ChequeBookReceiveOrderDetails';
                var title = title;
                break;
            case 77:
                var temp = '/CredentialOrder/CredentialOrderDetails';
                var id = 'CredentialOrderDetails';
                var title = title;
                break;
            case 76:
            case 102:
                var temp = '/FastTransferPaymentOrder/FastTransferPaymentOrderDetails';
                var id = 'FastTransferPaymentOrder';
                var title = title;
                break;
            case 78:
                var temp = '/MatureOrder/MatureOrderDetails';
                var id = 'MatureOrderDetails';
                var title = title;// 'Վարկի մարման հայտ'
                break;
            case 79:
                var temp = '/ReceivedFastTransferPaymentOrder/ReceivedFastTransferPaymentOrderDetails';
                var id = 'ReceivedFastTransferPaymentOrder';
                var title = title;
                break;
            case 87:
                var temp = '/ServicePaymentNoteOrder/GetServicePaymentNoteOrderDetails';
                var id = 'ServicePaymentNoteOrder';
                var title = title;
                break;

            case 88:
                var temp = '/ServicePaymentNoteOrder/GetDeletedServicePaymentNoteOrderDetails';
                var id = 'DelatedServicePaymentNoteOrder';
                var title = title;
                break;

            case 86:
                var temp = '/PaymentOrder/TransferArmPaymentOrderDetails';
                var id = 'InterBankTransferCashOrderDetails';
                var title = title;//'Միջմասնաճյուղային կանխիկ փոխանցում'
                break;
            case 90:
                var temp = '/PaymentOrder/TransferArmPaymentOrderDetails';
                var id = 'InterBankTransferNonCashOrderDetails';
                var title = title;//'Միջմասնաճյուղային անկանխիկ փոխանցում'
                break;
            case 93:
                var temp = '/PensionApplicationOrder/PensionApplicationTerminationOrderDetails';
                var id = 'PensionApplicationOrderCtrlDetails';
                var title = title;// 'Կենսաթոշակի ստացման դադարեցում'
                break;

            case 89:
            case 91:
            case 92:
            case 94:
                var temp = '/PensionApplicationOrder/PensionApplicationOrderDetails';
                var id = 'PensionApplicationOrderDetails';
                var title = title;// 'Կենսաթոշակի ստացման դիմում'
                break;
            case 96:
                var temp = '/TransferCallContractOrder/TransferCallContractOrderDetails';
                var id = 'TransferCallContractOrderDetails';
                var title = title;// 'Հեռախոսազանգով փոխանցման համաձայնագրի ստացման դիմում'
                break;
            case 97:
                var temp = '/TransferCallContractOrder/TransferCallContractTerminationOrderDetails';
                var id = 'TransferCallContractTerminationOrderDetails';
                var title = title;// 'Հեռախոսազանգով փոխանցման համաձայնագրի դադարեցման դիմում'
                break;


            case 98:
            case 99:
            case 100:
            case 101:
                var temp = '/DepositCaseOrder/DepositCaseOrderDetails';
                var id = 'DepositCaseOrderDetails';
                var title = title;
                break;

            case 103:
                var temp = '/CardRegistrationOrder/CardRegistrationOrderDetails';
                var id = 'CardRegistrationOrderDetails';
                var title = title;
                break;

            case 104:
            case 105:
                var temp = '/DepositCasePenaltyMatureOrder/DepositCasePenaltyMatureOrderDetails';
                var id = 'DepositCasePenaltyMatureOrderDetails';
                var title = title;
                break;
            case 106:
                var temp = '/TransferToShopOrder/PersonalTransferToShopOrderDetails';
                var id = 'PersonalTransferToShopOrderDetails';
                var title = title;
                break;
            case 107://Ապահովագրության հայտ
            case 108://Ապահովագրության հայտ(կանխիկ)
                var temp = '/InsuranceOrder/InsuranceOrderDetails';
                var id = 'InsuranceOrderDetails';
                var title = title;
                break;
            case 112://Քարտի տվյալների փոփոխման հայտ
                var temp = '/CardDataChangeOrder/PersonalCardDataChangeOrderDetails';
                var id = 'CardDataChangeOrderDetails';
                var title = title;
                break;
            case 114://Քարտի սպասարկման վարձի գրաֆիկի տվյալների փոփոխման հայտ
            case 115://Քարտի սպասարկման վարձի գրաֆիկի հեռացման հայտ
                var temp = '/CardServiceFeeGrafikDataChangeOrder/PersonalCardServiceFeeGrafikDataChangeOrderDetails';
                var id = 'PersonalCardServiceFeeGrafikDataChangeOrderDetails';
                var title = title;
                break;
            case 117://Ռեեստրով կոմունալ վճարում
            case 118://Ռեեստրով կանխիկ կոմունալ վճարում
                var temp = '/UtilityPayment/ReestrUtilityPaymentOrderDetails';
                var id = 'ReestrUtilityPaymentOrderDetails';
                var title = title;
                break;
            case 116://Հեռահար բանկիկնգի պայմանագիր
            case 132://Հեռահար բանկիկնգի պայմանագիր
                var temp = '/HBApplicationOrder/HBApplicationOrderDetails';
                var id = 'HBApplicationOrderDetails';
                var title = title;
                break;
            case 126: //Հեռախոսային Բանկինգի պայմանագրի մուտքագրում
                var temp = '/PhoneBankingContract/PhoneBankingContractOrderDetails';
                var id = 'PhoneBankingContractClosingOrderDetails';
                var title = title;
                break;
            case 127: //Հեռախոսային Բանկինգի պայմանագրի խմբագրում
                var temp = '/PhoneBankingContract/PhoneBankingContractOrderDetails';
                var id = 'PhoneBankingContractClosingOrderDetails';
                var title = title;
                break;
            case 128: //Հեռախոսային Բանկինգի պայմանագրի դադարեցում
                var temp = '/PhoneBankingContractClosingOrder/PhoneBankingContractClosingOrderDetails';
                var id = 'PhoneBankingContractClosingOrderDetails';
                break;
            case 125:
                var temp = '/RenewedCardAccountRegOrder/RenewedCardAccountRegOrderDetails';
                var id = 'RenewedCardAccountRegOrderDetails';
                var title = title;
                break;
            case 129://Փոխարինված քարտի հաշվի կցում
                var temp = '/ReplacedCardAccountRegOrder/ReplacedCardAccountRegOrderDetails';
                var id = 'ReplacedCardAccountRegOrderDetails';
                var title = title;
                break;

            case 120://to do
            case 119:
                var temp = '/HBApplicationQualityChangeOrder/HBApplicationQualityChangeOrderDetails';
                var id = 'HBApplicationQualityChangeOrderDetails';
                var title = title;
                break;
            case 136:
                var temp = '/CardStatusChangeOrder/PersonalCardStatusChangeOrderDetails';
                var id = 'CardStatusChangeOrderDetails';
                var title = title;
                break;

            case 135://to do
            case 137:
                var temp = '/HBServletRequestOrder/HBServletRequestOrderDetails';
                var id = 'HBServletRequestOrderDetails';
                var title = title;
                break;
            case 142:
                var temp = '/Factoring/FactoringTerminationOrderDetails';
                var id = 'CardStatusChangeOrderDetails';
                var title = title;
                break;
            case 143:
            case 156:
                var temp = '/Guarantee/GuaranteeTerminationOrderDetails';
                var id = 'GuaranteeTerminationOrderDetails';
                var title = title;
                break;
            case 148:
                var temp = '/DepositDataChangeOrder/PersonalDepositDataChangeOrderDetails';
                var id = 'DepositDataChangeOrderDetails';
                var title = title;
                break;
            case 139:
            case 140:
            case 144:
            case 146:
            case 147:
            case 148:
            case 149:
            case 150:
            case 200:
            case 167:
                var temp = '/CashBook/CashBookOrderDetails';
                var id = 'CashBookOrderDetails';
                var title = title;
                break;
            case 160:// Վարկային դիմումի վերլուծություն
            case 161://Վարկային դիմումի հաստատում
            case 162://Վարկային դիմումի հրաժարում
            case 163://Վարկային դիմումի հեռացում
                var temp = '/LoanApplication/LoanApplicationOrderDetails';
                var id = 'LoanApplicationOrderDetails';
                var title = title;
                break;
            case 165://Պահատուփի տուժանքի դադարեցման հայտ
                var temp = '/DepositCaseStoppingPenaltyCalculationOrder/PersonalDepositCaseStoppingPenaltyCalculationOrderDetails';
                var id = 'PersonalDepositCaseStoppingPenaltyCalculationOrderDetails';
                var title = title;
                break;
            case 153://Մուտք հաշվին այլ կանխիկ տերմինալով
            case 154://Վարկի մարում այլ կանխիկ տերմինալով
            case 155://Մուտք հաշվին փոխարկումով այլ կանխիկ տերմինալով
                var temp = '/Orders/CTOrderDetails';
                var id = 'CTOrderDetails';
                var title = title;
                break;
            case 168:
            case 169:
                var temp = '/CredentialOrder/PersonalCredentialActivationOrderDetails';
                var id = 'PersonalCredentialActivationOrderDetails';
                var title = title;// Լիազորագրի ատիվացման հայտ
                break;
            case 170://Լիազորված անձի նույնականացման հայտ
                var temp = '/CredentialOrder/AssigneeIdentificationOrderDetails';
                var id = 'AssigneeIdentificationOrderDetails';
                var title = title;
                break;
            case 171:
            case 172:
            case 197:
                var temp = '/ClassifiedLoanActionOrder/ClassifiedLoanActionOrderDetails';
                var id = 'ClassifiedLoanActionOrderDetails';
                var title = title;//Դասակարգված վարկի դուրս գրում, հետ բերում, արտաբալանասից հանում
                break;
            case 173:
                var temp = '/DemandDepositRateChangeOrder/DemandDepositRateChangeOrderDetails';
                var id = 'DemandDepositRateChangeOrderDetails';
                var title = title;// Ցպահանջ ավանդի տոկոսադրույքի փոփոխման հայտ
                break;
            case 174: // MR ծրագրի գրանցման հայտ
            case 176: // MR ծրագրի սպասարկման վարձի գանձման հայտ
            case 177: // MR ծրագրի վերաթողարկման հայտ
            case 178: // MR ծրագրի դադարեցման հայտ
                var temp = '/CardMembershipRewards/CardMembershipRewardsOrderDetails';
                var id = 'CardMembershipRewardsOrderDetails';
                var title = title;
                break;
            case 175: // MR ծրագրի գրանցման հայտ
            case 179: // MR ծրագրի սպասարկման վարձի գանձման հայտ
            case 180: // MR ծրագրի վերաթողարկման հայտ
                var temp = '/ProductNotificationConfigurationsOrder/ProductNotificationConfigurationOrderDetails';
                var id = 'ProductNotificationConfigurationOrderDetails';
                var title = title;
                break;
            case 181:
                var temp = '/CardUSSDServiceOrder/CardCardUSSDServiceOrderDetails';
                var id = 'CardUSSDServiceOrderDetails';
                var title = title;
                break;
            case 183:
                var temp = '/SwiftMessages/TransactionSwiftConfirmOrderDetails';
                var cont = 'SwiftMessagesCtrl';
                var id = 'TransactionSwiftConfirmOrderDetails';
                var title = title;
                break;
            case 186: // Պարտատոմսերի ձեռքբերման գրանցման հայտ
                var temp = '/BondOrder/BondOrderDetails';
                var cont = 'BondOrderCtrl';
                var id = 'BondOrderDetails';
                var title = title;
                break;
            case 189: // Պարտատոմսի կարգավիճակի փոփոխման  հայտ               
                var temp = '/BondQualityUpdateOrder/BondQualityUpdateOrderDetails';
                var cont = 'BondQualityUpdateOrderCtrl';
                var id = 'BondQualityUpdateOrderDetails';
                var title = title;
                break;
            case 191: // Արժեթղթերի հաշվի բացման հայտ               
                var temp = '/DepositaryAccountOrder/DepositaryAccountOrderDetails';
                var cont = 'DepositaryAccountOrderCtrl';
                var id = 'DepositaryAccountOrderDetails';
                var title = title;
                break;
            case 192: // Ֆոնդի տվյալների փոփոխման հայտ
                var temp = '/FondOrder/FondOrderDetails';
                var cont = 'FondOrderCtrl';
                var id = 'FondOrderDetails';
                var title = title;
                break;
            case 194: // Պարտատոմսի գումարի գանձման հայտ               
                var temp = '/BondAmountChargeOrder/BondAmountChargeOrderDetails';
                var cont = 'BondAmountChargeOrderCtrl';
                var id = 'BondAmountChargeOrderDetails';
                var title = title;
                break;
            case 198://Արագ դրամական համակարգերով փոխանցման չեղարկման հայտ
                var temp = '/RemittanceCancellationOrder/RemittanceCancellationOrderDetails';
                var id = 'RemittanceCancellationOrderDetails';
                var title = title;
                break;
            case 199://CreditLinePProlongationOrderDetails
                var temp = '/CreditLineProlongationOrder/CreditLineProlongationOrderDetails';
                var cont = 'CreditLineProlongationOrderCtrl';
                var id = 'CreditLineProlongationOrderDetails';
                var title = title;
                break;
            case 202://Արագ դրամական համակարգերով փոխանցման տվյալների փոփոխման հայտ
                var temp = '/RemittanceAmendmentOrder/RemittanceAmendmentOrderDetails';
                var id = 'RemittanceAmendmentOrderDetails';
                var title = title;
                break;
            case 203: //Վարկի վաղաժամկետ մարման վճար 
                var temp = '/LoanProductDataChangeOrder/LoanProductDataChangeOrderDetails';
                var cont = 'LoanProductDataChangeOrderCtrl';
                var id = 'LoanProductDataChangeOrderDetails';
                var title = title;
                break;
            case 205: // FTP փոփոխման հայտ
                var temp = '/FTPRateOrder/FTPRateOrderDetails';
                var cont = 'FTPRateOrderCtrl';
                var id = 'FTPRateOrderDetails';
                var title = title;
                break;
            case 206: // Քարտի բլոկավորման/ապաբլոկավորման հայտ
                var temp = '/ArcaCardsTransactionOrder/ArcaCardsTransactionOrderDetails';
                var cont = 'ArcaCardsTransactionOrderCtrl';
                var id = 'ArcaCardsTransactionOrderDetails';
                var title = title;
                break;
            case 207: // Քարտի լիմիտների փոփոխության հայտ
                var temp = '/CardLimitChangeOrder/CardLimitChangeOrderDetails';
                var cont = 'CardLimitChangeOrderCtrl';
                var id = 'CardLimitChangeOrderDetails';
                var title = title;
                break;
            case 208: // Վարկային պարտավորությունները ներելու Հայտ
                var temp = '/CreditCommitmentForgivenessOrder/CreditCommitmentForgivenessOrderDetails';
                var cont = 'CreditCommitmentForgivenessOrderCtrl';
                var id = 'CreditCommitmentForgivenessOrderDetails';
                var title = title;
                break;
            case 210: //Նոր քարտի հայտ
            case 211: //Լրացուցիչ քարտի պատվեր
            case 212: //Կից քարտի պատվեր
                var temp = '/PlasticCardOrder/PlasticCardOrderDetails';
                var cont = 'PlasticCardCtrl';
                var id = 'PlasticCardOrderDetails';
                var title = title;
                break;
            case 214://Քարտի հեռացման հայտ
                var temp = '/PlasticCardRemovalOrder/PlasticCardRemovalOrderDetails';
                var cont = 'PlasticCardRemovalOrderCtrl';
                var id = 'PlasticCardRemovalOrderDetails';
                var title = title;
                break;
            case 220://Հաշվի հեռացման հայտ
                var temp = '/CardAccountRemovalOrder/CardAccountRemovalOrderDetails';
                var cont = 'CardAccountRemovalOrderCtrl';
                var id = 'CardAccountRemovalOrderDetails';
                var title = title;
                break;
            case 221: // Տոկոսային մարժայի փոփոխման հայտ
                var temp = '/InterestMarginOrder/InterestMarginOrderDetails';
                var cont = 'InterestMarginChangeOrderCtrl';
                var id = 'InterestMarginOrderDetails';
                var title = title;
                break;
            case 222: // ՀԲ պայմանագրի ամբողջական հասանելիությունների տրամադրման հայտ
                var temp = '/HBApplicationFullPermissionsGrantingOrder/HBApplicationFullPermissionsGrantingOrderDetails';
                var id = 'HBApplicationFullPermissionsGrantingOrderDetails';
                var title = title;
                break;
            case 223: //Քարտաի SMS ծառայության ակտիվացման, փոփոխման և դադարեցման  հայտ
                var temp = '/PlasticCardSMSServiceOrder/PlasticCardSMSServiceOrderDetails';
                var id = 'PlasticCardSMSServiceOrderDetails';
                var title = title;
                break;
                break;
            case 225://Փոխարինում` նույն համար, նույն ժամկետ 
                debugger;
                var temp = '/PINRegenerationOrder/PINRegenerationOrderDetails';
                var id = 'PINRegenerationOrderDetails';
                var title = title;
                break;
            case 226://Փոխարինում` նոր համար, նոր ժամկետ - առանց վ․գ․
                debugger;
                var temp = '/NonCreditLineCardReplaceOrder/NonCreditLineCardReplaceOrderDetails';
                var id = 'NonCreditLineCardReplaceOrderDetails';
                var title = title;
                break;
            case 227://Փոխարինում` նոր համար, նոր ժամկետ - վ․գ․
                var temp = '/CreditLineCardReplaceOrder/CreditLineCardReplaceOrderDetails';
                var id = 'CreditLineCardReplaceOrderDetails';
                var title = title;
                break;
            case 228: // Visa Direct և MasterCard MoneySend փոխանցման հայտ
                var temp = '/Card/CardToOtherCardOrderDetails';
                var id = 'CardToOtherCardOrderDetails';
                var title = title;
                break;
            case 229://Վարկի հետաձգման հայտ
                var temp = '/LoanDelayOrder/LoanDelayOrderDetails';
                var id = 'LoanDelayOrderDetails';
                var title = title;
                break;
            case 230://Հետաձգված վարկի չեղարկում
                var temp = '/CancelLoanDelayOrder/CancelLoanDelayOrderDetails';
                var id = 'CancelLoanDelayOrderDetails';
                var title = title;
                break;
            case 231: //Քարտի մասնաճյուղի փոփոխման հայտ
                var temp = '/ChangeBranchOrder/ChangeBranchOrderDetails';
                var id = 'ChangeBranchOrderDetails';
                var title = title;
                break;
            case 232: //Քարտի լրացուցիչ տվյալների հայտ
                var temp = '/CardAdditionalDataOrder/CardAdditionalDataOrderDetails';
                var cont = 'CardAdditionalDataOrderCtrl';
                var id = 'CardAdditionalDataOrderDetails';
                var title = title;
                break
            case 233://Քարտի չվերաթողարկում
                var temp = '/CardNotRenewOrder/CardNotRenewOrderDetails';
                var id = 'CardNotRenewOrderDetails';
                var title = title;
                break;
            case 234: //Քարտային հաշվի հեռացման հայտ
                var temp = '/CardAccountClosingOrder/CardAccountClosingOrderDetails';
                var id = 'CardAccountClosingOrderDetails';
                var title = title;
                break;
            case 236://
                var temp = '/LoanInterestRateConcession/LoanInterestRateConcessionDetails';
                var id = 'LoanInterestRateConcessionDetails';
                var title = title;
                break;
            case 237: //Չվճարված կենսաթոշակի/նպաստի գումար
                var temp = '/PensionPaymentOrder/PensionPaymentOrderDetails';
                var id = 'PensionPaymentOrderDetails';
                var title = title;
                break;
            case 243://Քարտի վերաթողարկում
                var temp = '/CardRenewOrder/CardRenewOrderDetails';
                var id = 'CardRenewOrderDetails';
                var title = title;
                break;

            case 244: //Քարտի վերաբացման հայտ
                var temp = '/CardReOpenOrder/CardReOpenOrderDetails';
                var id = 'CardReOpenOrderDetails';
                var title = title;
                break;
            case 238://Անքարտ կանխիկացման հայտի մանրամասների ցուցադրում
                var temp = '/CardLessCashoutOrder/CardLessCashoutOrderDetails';
                var id = 'CardLessCashoutOrderDetails';
                var title = title;
                break;
            case 250: //Visa Alias  հայտ
                var temp = '/Card/VisaAliasOrderDetails';
                var id = 'VisaAliasOrderDetails';
                var title = title;
                break;
            case 257:
                var temp = '/CardlessCashoutCancellationOrder/CardlessCashoutCancellationOrderDetails';
                var id = 'CardlessCashoutCancellationOrderDetails';
                var title = title;
                break;
            case 268:  /*Davit Pos */
                var temp = '/PosLocation/NewPosApplicationOrderDetails';
                var id = 'NewPosApplicationOrderDetails';
                var title = title;
                break;
            default:
                var temp = '/Error/MsgBoxAccess';
                var id = 'MsgBoxAccess';
                break;
        }

        var dialogOptions = {
            callback: function () {
                if (dialogOptions.result !== undefined) {
                    cust.mncId = dialogOptions.result.whateverYouWant;
                }
            },
            result: {}
        };

        dialogService.open(id, $scope, title, temp, dialogOptions);
    };

    $scope.getOrderAttachmentsInfo = function (orderID) {
        var Data = orderService.getOrderAttachments(orderID);
        Data.then(function (ord) {
            $scope.attachments = ord.data;
        }, function () {
            alert('Error OrderAttachments');
        });
    };

    $scope.getOrderAttachment = function (id, extension) {

        var Data = orderService.getOrderAttachment(id);

        Data.then(function (dep) {
            if (extension != 'pdf') {
                var file = new Blob([dep.data], { type: 'image/jpeg' });
            }
            else {
                var file = new Blob([dep.data], { type: 'application/pdf' });
            }

            var fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        }, function () {

            alert('Error ');
        });
    };


    $scope.confirmOrder = function (orderID) {

        if ($scope.order != undefined) {
            if ($scope.order.Type == 6) {
                var checked = sessionStorage.getItem("isCheckedHBReestr");
                if (checked == "false") {
                    hideloading();
                    showMesageBoxDialog('Անհրաժեշտ է կատարել ստուգում։', $scope, 'error');
                    return;
                }
                for (var i = 0; i < $scope.order.ReestrTransferAdditionalDetails.length; i++) {
                    if ($scope.order.ReestrTransferAdditionalDetails[i].HbDAHKCheckResult &&
                        ($scope.order.ReestrTransferAdditionalDetails[i].PaymentType == null
                            || $scope.order.ReestrTransferAdditionalDetails[i].PaymentType == undefined || $scope.order.ReestrTransferAdditionalDetails[i].PaymentType == "")) {
                        $scope.order.ReestrTransferAdditionalDetails[i].NonValidate = true;
                        hideloading();
                        showMesageBoxDialog('§' + (i + 1) + '¦ տողի արգելադրման նպատակը ընտրված չէ', $scope, 'error');
                        return;
                    }
                }
            }

        }

        if ($scope.order != undefined && $scope.$root.SessionProperties.IsCalledFromHB == true) {
            if (orderID != null && orderID != undefined) {
                if ($scope.order.Type == 1 && $scope.order.SubType == 1 && $scope.order.CreditorHasDAHK == true) {
                    var Data = orderService.confirmOrder(orderID);
                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data) && res.data.ResultCode != 5) {
                            CloseBPDialog("PaymentOrderDetails");
                            refresh(6);
                        }
                        else {
                            $scope.showError = true;
                            hideloading();
                            ShowToaster($scope.error[0].Description, 'error');
                        }
                    }, function () {
                        hideloading();
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                        alert('Error confirmOrder');
                    });
                }
                else if ($scope.order.Type == 6) {
                    var Data = orderService.confirmOrder(orderID);
                    Data.then(function (res) {
                        hideloading();
                        if (validate($scope, res.data) && res.data.ResultCode != 5) {
                            CloseBPDialog("reestrDetails");
                            CloseBPDialog("PaymentOrderDetails");
                            refresh(6);
                        }
                        else {
                            $scope.showError = true;
                            hideloading();
                            ShowToaster($scope.error[0].Description, 'error');
                            var refreshScope = angular.element(document.getElementById('reestrDetailsForm')).scope();
                            if (refreshScope != undefined) {
                                refreshScope.getReestrTransferOrder($scope.order.Id);
                            }
                        }
                    }, function () {
                        hideloading();
                        ShowToaster('Տեղի ունեցավ սխալ', 'error');
                        alert('Error confirmOrder');
                    });
                }
                else {
                    $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                        .then(function () {
                            showloading();
                            var Data = orderService.confirmOrder(orderID);
                            Data.then(function (res) {
                                hideloading();

                                if (validate($scope, res.data) && res.data.ResultCode != 5) {
                                    switch ($scope.order.Type) {
                                        case 1:
                                            if ($scope.order.SubType == 2) {
                                                CloseBPDialog("TransferArmPaymentOrderDetails");
                                            }
                                            else if ($scope.order.SubType == 5) {
                                                CloseBPDialog("BudgetPaymentOrderDetails");
                                            }
                                            else {
                                                CloseBPDialog("PaymentOrderDetails");
                                            }

                                            break;
                                        case 2:
                                        case 6:
                                            CloseBPDialog("reestrDetails");
                                            CloseBPDialog("PaymentOrderDetails");
                                            break;
                                        case 3:
                                            CloseBPDialog("InternationalPaymentOrderDetails");
                                            break;
                                        case 4:
                                            CloseBPDialog("TerminateDepositDetails");
                                            break;
                                        case 15:
                                            CloseBPDialog("UtilityPaymentOrderDetails");
                                            break;
                                        case 18:
                                        case 19:
                                            CloseBPDialog("RemovalOrderDetails");
                                            break;
                                        case 20:
                                            CloseBPDialog("ReferenceOrderDetails");
                                            break;
                                        case 21:
                                            CloseBPDialog("CreditLineTerminationOrderDetails");
                                            break;
                                        case 26:
                                            CloseBPDialog("SwiftCopyOrderDetails");
                                            break;
                                        case 0:
                                            CloseBPDialog("CreditLineTerminationOrderDetails");
                                    }
                                    refresh(6);

                                }
                                else {
                                    $scope.showError = true;
                                    hideloading();
                                    ShowToaster($scope.error[0].Description, 'error');
                                }
                            }, function () {
                                hideloading();
                                ShowToaster('Տեղի ունեցավ սխալ', 'error');
                                alert('Error confirmOrder');
                            });
                        });
                }

            };
        }
        else {
            if (orderID != null && orderID != undefined) {
                $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                    .then(function () {
                        showloading();
                        if ($scope.type != 198 && $scope.type != 202) {
                            var Data = orderService.confirmOrder(orderID);
                        }
                        else {
                            if ($scope.type == 198) {
                                var Data = remittanceCancellationOrderService.approveRemittanceCancellationOrder(orderID);
                            }
                            else if ($scope.type == 202) {
                                var Data = remittanceAmendmentOrderService.approveRemittanceAmendmentOrder(orderID);
                            }

                            else {
                                var Data = orderService.confirmOrder(orderID);
                            }

                        }
                        Data.then(function (res) {
                            hideloading();

                            if (validate($scope, res.data) && res.data.ResultCode != 5) {
                                $scope.orders[$scope.selectedRow].Quality = 30;
                                $scope.orders[$scope.selectedRow].QualityDescription = 'Կատարված է';
                                var msg = 'Գործարքը կատարված է';

                                if ($scope.type == 198 || ($scope.type == 76 && $scope.subType == 23) || ($scope.type == 102 && $scope.subType == 23) || $scope.type == 202) {
                                    msg = msg + $scope.error[0].Description;
                                }

                                ShowToaster(msg, 'success');

                            }
                            else {
                                $scope.showError = true;
                                ShowToaster($scope.error[0].Description, 'error');
                            }
                        }, function () {
                            hideloading();
                            ShowToaster('Տեղի ունեցավ սխալ', 'error');
                            alert('Error confirmOrder');
                        });
                    });
            };
        }


    };


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


        $scope.searchCashiersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
    $scope.getSearchedCashier = function (cashier) {
        $scope.setnumber = cashier.setNumber;
        $scope.CasherDescription = cashier.firstName + ' ' + cashier.lastName;
        $scope.closeSearchCashiersModal();
    }

    $scope.closeSearchCashiersModal = function () {
        $scope.searchCashiersModalInstance.close();
    }

    $scope.getAuthorizedCustomerNumber = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (user) {
            $scope.searchParams.CustomerNumber = user.data;
            $scope.getOrders();
        });
    };

    $scope.getUserID = function () {
        var Data = casherService.getUserID();
        Data.then(function (user) {
            $scope.searchParams.RegisteredUserID = user.data;
            $scope.getOrders();
        }, function () {
            alert('Error');
        });
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

        $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };

    $scope.getSearchedCustomer = function (customer) {
        $scope.customerNumber = customer.customerNumber;
        $scope.searchParams.CustomerNumber = customer.customerNumber;
        $scope.closeSearchCustomersModal();
    };

    $scope.closeSearchCustomersModal = function () {
        $scope.searchCustomersModalInstance.close();
    };


    $scope.getNotConfirmedOrders = function () {
        var Data = orderService.getNotConfirmedOrders();
        Data.then(function (order) {
            $scope.notConfirmedOrders = order.data;
            $scope.getUserRejectedMessages(1, 1);
            $scope.setTotalUserMessages();
        }, function () {
            alert('Error');
        });
    };


    $scope.openNotConfirmedOrder = function (notConfirmedOrder) {
        $scope.params = { selectedOrderId: notConfirmedOrder.Id, type: notConfirmedOrder.Type, selectedQualityDescription: notConfirmedOrder.QualityDescription, selectedSourceDescription: notConfirmedOrder.SourceDescription, subType: notConfirmedOrder.SubType };
    }


    $scope.getOrder = function (orderID) {
        var Data = orderService.getOrder(orderID);
        Data.then(function (ord) {
            $scope.order = ord.data;
        }, function () {
            alert('Error getOrder');
        });
    };
    $scope.getUserRejectedMessages = function (filter, state) {
        //state=1 initial state of user rejected messages
        //state=2 when message is closing
        var Data = orderService.getUserRejectedMessages(filter);
        Data.then(function (messages) {
            $scope.userRejectedMessages = messages.data;
            if (state == 1) {
                //$scope.$root.notificationCount = parseInt($scope.$root.notificationCount) + $scope.userRejectedMessages.length;
            }
            if (state == 2) {
                $scope.$root.notificationCount = parseInt($scope.$root.notificationCount) - 1;
            }

        }, function () {
            alert('Error');
        });
    };


    $scope.closeRejectedMessage = function (messageId) {
        if ($scope.notificationFilter == undefined) {
            $scope.notificationFilter = 1;
        }
        var Data = orderService.closeRejectedMessage(messageId);
        Data.then(function () {
            $scope.getUserRejectedMessages($scope.notificationFilter, 2);
        }, function () {
            alert('Error closeRejectedMessage');
        });
    }
    $scope.updateNotificationsFilter = function () {
        $scope.getUserRejectedMessages($scope.notificationFilter);
        $scope.rejectedMessagesScrollState = 0;
    }
    $scope.rejectedMessagesScrollState = 0;
    $scope.notConfirmedOrdersScrollState = 0;
    $scope.notificationFilter = 1;

    $scope.loadNots = function () {
        var count = 10;
        if ($scope.notificationFilter == 1) {
            if ($scope.notConfirmedOrdersScrollState * count < $scope.$root.notificationCount) {
                $scope.getNotConfirmedOrdersWithScroll($scope.notConfirmedOrdersScrollState, count);
                $scope.notConfirmedOrdersScrollState += 1;
            }

        }
        else if ($scope.notificationFilter == 2) {
            //if ($scope.rejectedMessagesScrollState * count < $scope.userRejectedMessages.length) {
            $scope.geUserRejectedMessagesWithScroll($scope.rejectedMessagesScrollState, count);
            $scope.rejectedMessagesScrollState += 1;
            //}
        }
    }

    $scope.getNotConfirmedOrdersWithScroll = function (scrollState, count) {
        var Data = orderService.getNotConfirmedOrdersWithScroll($scope.notificationFilter, scrollState, count);
        Data.then(function (order) {
            $scope.notConfirmedOrders = $scope.notConfirmedOrders.concat(order.data);

        }, function () {
            alert('Error');
        });
    };

    $scope.geUserRejectedMessagesWithScroll = function (scrollState, count) {
        var Data = orderService.geUserRejectedMessagesWithScroll($scope.notificationFilter, scrollState, count);
        Data.then(function (rejectedMessages) {
            $scope.userRejectedMessages = $scope.userRejectedMessages.concat(rejectedMessages.data);

        }, function () {
            alert('Error');
        });
    };


    $scope.setTotalUserMessages = function () {
        var Data = orderService.setTotalUserMessages();
        Data.then(function (total) {
            $scope.$root.notificationCount = total.data;
        },
            function () {
                alert('Error');
            });

    };
    $scope.setCanConfirmOrder = function (selectedOrder) {
        $scope.canConfirmOrder = false;
        if (selectedOrder.Source != 1 && (selectedOrder.Quality == 3 || (selectedOrder.Quality == 20 && (selectedOrder.Type == 122 || selectedOrder.Type == 190 || ((selectedOrder.Type == 192 || selectedOrder.Type == 205 || selectedOrder.Type == 221) && $scope.canApproveFondChange == "1")))) && $scope.$root.SessionProperties.SourceType == 2
            && selectedOrder.HasAoutomaticConfirmation == true && (($scope.$root.SessionProperties.IsNonCustomerService == true && selectedOrder.CustomerNumber == 0) || ($scope.$root.SessionProperties.IsNonCustomerService != true && selectedOrder.CustomerNumber != 0))
            || (selectedOrder.Quality == 50 && (selectedOrder.Type == 198 || selectedOrder.Type == 202)) || (selectedOrder.Source = 1 && selectedOrder.Type == 228 && $scope.isCardDepartment == "1" && selectedOrder.Quality == 3)) {
            $scope.canConfirmOrder = true;
            if (selectedOrder.Type == 228 && $scope.isCardDepartment != "1") {
                $scope.canConfirmOrder = false;
            }
        }
        else if ($scope.$root.SessionProperties.SourceType == 6 && selectedOrder.Source == 6 && (selectedOrder.Type == 159 || selectedOrder.Type == 160
            || selectedOrder.Type == 161 || selectedOrder.Type == 162 || selectedOrder.Type == 163 || selectedOrder.Type == 14 || selectedOrder.Type == 21) && selectedOrder.Quality == 3) {
            $scope.canConfirmOrder = true;
        }
        if (selectedOrder.Quality == 50 && selectedOrder.Type == 206 && $scope.isCardDepartment == "1") {
            $scope.canConfirmOrder = true;
        }
        //Քարտի բլոկավորման/ապաբլոկավորման դեպքում կատարելու հնարավորություն առկա չէ, քանի որ տվյալ հայտը կատարվում է դեպի Arca հարցման միջոցով։
        if (selectedOrder.Type == 206 && ($scope.isCardDepartment != "1" && $scope.isOnlineAcc != "1")) {
            $scope.canConfirmOrder = false;
        }
    };


    $scope.getCTPaymentOrder = function (orderId) {
        var Data = orderService.getCTPaymentOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountOrder');
        });
    };


    $scope.getCTLoanMatureOrder = function (orderId) {
        var Data = orderService.getCTLoanMatureOrder(orderId);
        Data.then(function (acc) {
            $scope.order = acc.data;
        }, function () {
            alert('Error GetAccountOrder');
        });
    };

    $scope.getOrderReport = function () {
        var fileName = 'Order_report';
        var Data = null;
        switch ($scope.searchParams.Type) {
            case "206": //Քարտի բլոկավորման/ապաբլոկավորման հայտ
                fileName = 'Arca_Cards_Transactions_Reporting';
                Data = arcaCardsTransactionOrderService.GetArcaCardsTransactionOrdersReport($scope.searchParams);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 128, ReportExportFormat: 2 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowExcelReport(result, fileName);
                    });
                }, function () {
                    alert('Error GetArcaCardsTransactionOrdersReport');
                });
                break;
            case "210": //Նոր քարտի հայտ
            case "211": //Լրացուցիչ քարտի պատվեր
            case "212": //Կից քարտի պատվեր
                fileName = 'Plastic_Card_Orders_Report';
                Data = plasticCardService.GetPlasticCardOrdersReport($scope.searchParams);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 141, ReportExportFormat: 2 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowExcelReport(result, fileName);
                    });
                }, function () {
                    alert('Error GetPlasticCardOrdersReport');
                });
                break;
            case "21":
            case "199":
            case "74":
                fileName = 'Creditline_Orders_Report'
                Data = creditLineService.GetCreditLineOrderReport($scope.searchParams);
                Data.then(function (response) {
                    var reportId = 0;
                    switch ($scope.searchParams.Type) {
                        case "74":
                            reportId = 146;
                            break;
                        case "21":
                            reportId = 147;
                            break;
                        default:
                            reportId = 148;
                            break;
                    }
                    var requestObj = { Parameters: response.data, ReportName: reportId, ReportExportFormat: 2 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowExcelReport(result, 'Creditline_Orders_Report');
                    });
                }, function () {
                    alert('Error GetCreditLineOrderReport');
                });
                break;
            case "238":
                fileName = 'CardlessCashoutCancellationOrder';
                Data = cardlessCashoutCancellationOrderCtrlService.GetCardlessCashoutCancellationOrderReport($scope.searchParams);
                Data.then(function (response) {
                    var requestObj = { Parameters: response.data, ReportName: 169, ReportExportFormat: 2 }
                    ReportingApiService.getReport(requestObj, function (result) {
                        ShowExcelReport(result, fileName);
                    });
                }, function () {
                    alert('Error GetCardlessCashoutCancellationOrderReport');
                });
                break;
        }
    };


    $scope.setNotConfirmOrderFromLayout = function () {


        var refreshScope = angular.element(document.getElementById('NotificationPanel')).scope();

        if (refreshScope != undefined) {
            refreshScope.getNotConfirmedOrders();
        }


    };

    //hb reestr
    $scope.saveReestrPaymentDetails = function (orderID) {
        showloading();
        if ($scope.showPaymentType == true) {
            var Data = orderService.postReestrPaymentDetails($scope.order);
            Data.then(function (res) {

                $scope.confirmOrder(orderID);

            }, function () {
                hideloading();
                ShowToaster('Տեղի ունեցավ սխալ', 'error');
            });
        }
        else {
            $scope.confirmOrder(orderID);
        }
    };

    $scope.saveDAHKPaymentType = function (orderID, armPaymentType) {

        if ($scope.order.Type == 1 && $scope.order.CreditorHasDAHK == true && $scope.order.ArmPaymentType == undefined) {
            hideloading();
            showMesageBoxDialog('Ալգելադրման նպատակը ընտրված չէ։', $scope, 'error');
            return;
        }
        else {
            $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                .then(function () {
                    showloading();
                    var Data = orderService.postDAHKPaymentType($scope.order.Id, $scope.order.ArmPaymentType);
                    Data.then(function (acc) {
                        $scope.confirmOrder($scope.order.Id);
                    }, function () {
                        hideloading();
                        alert('Error saveDAHKPaymentType');
                    });
                });
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
