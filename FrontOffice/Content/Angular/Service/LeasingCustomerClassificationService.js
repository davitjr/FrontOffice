app.service("LeasingCustomerClassificationService", ['$http', function ($http) {

    this.getUserPermission = function () {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetUserPermission"
        });
        return response;
    };

    // Հաճախորդի մասին տվյալներ
    this.getLeasingCustomerInfo = function (customerNumber) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingCustomerInfo",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    // ՀաՃախորդի սուբյեկտիվ դասակարգման հիմքեր(աղյուսակ 1)
    this.GetLeasingCustomerSubjectiveClassificationGrounds = function (customerNumber, isActive) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingCustomerSubjectiveClassificationGrounds",
            params: {
                customerNumber: customerNumber,
                isActive: isActive
            }
        });
        return response;
    };

    // Ստանում է տվյալներ (հաճախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակի) հիմքեր դաշտի համար 
    this.GetReasonTypes = function (classificationType) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingReasonTypes",
            params: {
                classificationType: classificationType
            }
        });
        return response;
    };

    this.RiskDaysCountAndName = function (riskClassCode) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingRiskDaysCountAndName",
            params: {
                riskClassCode: riskClassCode
            }

        });
        return response;
    };

    // Ավելացնում է հաճախորդ (հաճախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակում)
    this.AddCustomerSubjectiveClassificationGrounds = function (obj) {
        var response = $http({
            method: "POST",
            url: "/LeasingCustomerClassification/AddLeasingCustomerSubjectiveClassificationGrounds",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    //Վերադարձնում է  ՀաՃախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակի ընտրված տողի տվյալները
    this.GetCustomerSubjectiveClassificationGroundsByID = function (id) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingCustomerSubjectiveClassificationGroundsByID",
            params: {
                id: id
            }
        });
        return response;
    };

    this.CloseCustomerSubjectiveClassificationGrounds = function (Id) {
        var response = $http({
            method: "Post",
            url: "/LeasingCustomerClassification/CloseLeasingCustomerSubjectiveClassificationGrounds",
            params: {
                Id: Id
            }
        });
        return response;
    };

    // Հաճախորդի հետ փոխկապակցված անձանց չդասակարգելու հիմքեր (աղյուսակ 2)
    this.GetConnectionGroundsForNotClassifyingWithCustomer = function (customerNumber, isActive) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingConnectionGroundsForNotClassifyingWithCustomer",
            params: {
                customerNumber: customerNumber,
                isActive: isActive
            }
        });
        return response;
    };

    this.GetInterconnectedPersonNumber = function (customerNumber) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingInterconnectedPersonNumber",
            params: {
                customerNumber: customerNumber
            }
        });
        return response;
    };

    // Ավելացնում է փոխկապակցված անձ (Հաճախորդի հետ փոխկապակցված անձանց չդասակարգելու հիմքեր աղյուսակում)
    this.AddConnectionGroundsForNotClassifyingWithCustomer = function (obj) {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/AddLeasingConnectionGroundsForNotClassifyingWithCustomer",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    //Վերադարձնում է Հաճախորդի հետ փոխկապակցված անձանց չդասակարգելու հիմքեր աղյուսակի ընտրված տողի տվյալները
    this.GetConnectionGroundsForNotClassifyingWithCustomerByID = function (id) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingConnectionGroundsForNotClassifyingWithCustomerByID",
            params: {
                id: id
            }
        });
        return response;
    };

    // Վերադարձնում է  Հաճախորդի հետ փոխկապակցված անձանց դասակարգելու հիմքեր աղյուսակի ընտրված տողի տվըալները 
    this.GetConnectionGroundsForClassifyingWithCustomerByID = function (id, custNamber3) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingConnectionGroundsForClassifyingWithCustomerByID",
            params: {
                id: id,
                customerNumber: custNamber3
            }
        });
        return response;
    };

    //հեռացնում է  հաճախորդի հետ փոխկապակցված անձանց չդասակարգելու հիմքեր  աղյուսակի ընտրված տողը:
    this.CloseConnectionGroundsForNotClassifyingWithCustomer = function (docNumber, docDate, deletedId) {
        var response = $http({
            method: "Post",
            url: "/LeasingCustomerClassification/CloseLeasingConnectionGroundsForNotClassifyingWithCustomer",
            data: JSON.stringify({ docNumber: docNumber, docDate: docDate, deletedId: deletedId }),
            dataType: "json"

        });
        return response;
    };


    // Հաճախորդի հետ փոխկապակցված անձանց դասակարգելու հիմքեր ()
    this.GetConnectionGroundsForClassifyingWithCustomer = function (customerNumber, isActive) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingConnectionGroundsForClassifyingWithCustomer",
            params: {
                customerNumber: customerNumber,
                isActive: isActive
            }
        });
        return response;
    };

    // Ավելացնում է փոխկապակցված անձ (Հաճախորդի հետ փոխկապակցված անձանց դասակարգելու հիմքեր աղյուսակում)
    this.AddConnectionGroundsForClassifyingWithCustomer = function (obj) {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/AddLeasingConnectionGroundsForClassifyingWithCustomer",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.CloseConnectionGroundsForClassifyingWithCustomer = function (obj, isClos) {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/CloseLeasingConnectionGroundsForClassifyingWithCustomer",
            params: {
                isClos: isClos
            },
            data: obj,
            dataType: "json"
        });
        return response;
    };

    //ՀԱՃԱԽՈՐԴԻ ԴԱՍԱԿԱՐԳՄԱՆ ՊԱՏՄՈՒԹՅՈՒՆ (աղյուսակ 4)
    this.GetCustomerClassificationHistory = function (leasingCustomerNumber, date) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingCustomerClassificationHistory",
            params: {
                leasingCustomerNumber: leasingCustomerNumber,
                date: date
            }
        });
        return response;
    };

    // Վերադարձնում է  ՀԱՃԱԽՈՐԴԻ ԴԱՍԱԿԱՐԳՄԱՆ ՊԱՏՄՈՒԹՅՈՒՆ աղյուսակի ընտրված տողի տվըալները 
    this.GetCustomerClassificationHistoryByID = function (id, loanFullNumber, lpNumber) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingCustomerClassificationHistoryByID",
            params: {
                id: id,
                loanFullNumber: loanFullNumber,
                lpNumber: lpNumber
            }
        });
        return response;
    };

    this.CustomerConnectionResult = function (CustomerNumberN1, CustomerNumberN2) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/LeasingCustomerConnectionResult",
            params: {
                CustomerNumberN1: CustomerNumberN1,
                CustomerNumberN2: CustomerNumberN2
            }
        });
        return response;
    };

    //   Տեղեկատվությաուն հաճախորդների կապի  վերաբերյալ     
    this.printCustomerConnectionData = function (SelectedCustomerNumberN1, CustomerN2) {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/PrintLeasingCustomerConnectionData",
            params: {
                selectedCustomerNumberN1: SelectedCustomerNumberN1,
                customerN2: CustomerN2
            }
        });
        return response;
    };

    //  Հաճախորդի վարկը անհուսալի դասով չդասակարգելու հիմքեր (աղյուսակ 5)
    this.GetGroundsForNotClassifyingCustomerLoan = function (leasingCustomerNumber, isActive) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingGroundsForNotClassifyingCustomerLoan",
            params: {
                leasingCustomerNumber: leasingCustomerNumber,
                isActive: isActive
            }
        });
        return response;
    };

    this.GetLoanInfo = function (leasingCustNamber) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingLoanInfo",
            params: {
                leasingCustNamber: leasingCustNamber
            }
        });
        return response;
    };

    this.AddGroundsForNotClassifyingCustomerLoan = function (obj) {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/AddLeasingGroundsForNotClassifyingCustomerLoan",
            data: obj,
            dataType: "json"
        });
        return response;
    };


    /// Վերադարձնում է Հաճախորդի վարկը անհուսալի դասով չդասակարգելու հիմքեր աղյուսակի ընտրված տողի տվըալները 
    this.GetGroundsForNotClassifyingCustomerLoanByID = function (id) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingGroundsForNotClassifyingCustomerLoanByID",
            params: {
                id: id
            }
        });
        return response;
    };

    this.CloseGroundsForNotClassifyingCustomerLoan = function (appId, id, docNumber, docDate) {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/CloseLeasingGroundsForNotClassifyingCustomerLoan",
            params: {
                appId: appId,
                id: id,
                docNumber: docNumber,
                docDate: docDate
            }
        });
        return response;
    };

    // Խմբագրում է հաճախորդ (հաճախորդի սուբյեկտիվ դասակարգման հիմքեր աղյուսակում)
    this.EditCustomerSubjectiveClassificationGrounds = function (obj) {
        var response = $http({
            method: "POST",
            url: "/LeasingCustomerClassification/EditLeasingCustomerSubjectiveClassificationGrounds",
            data: obj,
            dataType: "json"
        });
        return response;
    };

    this.GetCustomerSubjectiveClassificationGroundsByIDForEdit = function (id) {
        var response = $http({
            method: "GET",
            url: "/LeasingCustomerClassification/GetLeasingSubjectiveClassificationGroundsByIDForEdit",
            params: {
                id: id
            }
        });
        return response;
    };

    this.printOneMoreTimeClassifiedCustomersReport = function () {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/PrintOneMoreTimeClassifiedCustomersReport",
            responseType: 'arraybuffer'
        });
        return response;
    };

    this.printCustomersWithOpenBaseReport = function () {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/PrintCustomersWithOpenBaseReport",
            responseType: 'arraybuffer'
        });
        return response;
    };

    this.printClassificationBaseChangedCustomersReport = function () {
        var response = $http({
            method: "post",
            url: "/LeasingCustomerClassification/PrintClassificationBaseChangedCustomersReport",
            responseType: 'arraybuffer'
        });
        return response;
    };

}]);