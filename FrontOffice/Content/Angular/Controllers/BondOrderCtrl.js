app.controller("BondOrderCtrl", ['$scope', 'bondOrderService', 'bondIssueService', 'infoService', 'casherService', 'bondService', '$location', 'dialogService', '$uibModal', 'customerService', '$filter', '$http', 'dateFilter','ReportingApiService',
    function ($scope, bondOrderService, bondIssueService, infoService, casherService, bondService, $location, dialogService, $uibModal, customerService, $filter, $http, dateFilter, ReportingApiService) {


     $scope.banks = [];

     $scope.initBondOrder = function () {
         $scope.bondOrder = {};
         $scope.bondOrder.RegistrationDate = new Date();
         $scope.bondOrder.Bond = {};
         $scope.bondOrder.Bond.AccountForBond = {};
         $scope.bondOrder.Bond.AccountForCoupon = {};
         $scope.bondOrder.Bond.CustomerDepositaryAccount = {};

         $scope.attachmentsCounter = [];
         $scope.attachmentsCounter.push(0);
         $scope.bondOrder.Attachments = [];

         var Data = customerService.getAuthorizedCustomerNumber();
         Data.then(function (res) {
             $scope.customerNumber = res.data;

             $scope.hasCustomerDepositaryAccountInBankDB($scope.customerNumber);

             if ($scope.bondOrder.Bond.DepositaryAccountExistenceType == 1) {
                 $scope.getCustomerDepositaryAccount($scope.customerNumber);
             }
         });

         $scope.setBondDocumentNumber();




         var Data = casherService.getUserFilialCode();
         Data.then(function (filial) {
             $scope.bondOrder.Bond.FilialCode = filial.data;
         },
         function () {
             $scope.loading = false;
             alert('Error getUserFilialCode');
         });
     };

     $scope.saveBondOrder = function () {
         if ($http.pendingRequests.length == 0) {


             document.getElementById("bondOrderSaveLoad").classList.remove("hidden");

             if ($scope.bondOrder.Currency == 'AMD') {
                 $scope.bondOrder.Bond.AccountForBond.AccountNumber = $scope.bondOrder.Bond.AccountForCoupon.AccountNumber;
             }

             var Data = bondOrderService.saveBondOrder($scope.bondOrder);

             Data.then(function (res) {

                 if (validate($scope, res.data)) {

                     document.getElementById("bondOrderSaveLoad").classList.add("hidden");
                     CloseBPDialog('newbondorder');
                     $scope.path = '#Orders';
                     showMesageBoxDialog('Պարտատոմսի վաճառքի մուտքագրումը կատարված է', $scope, 'information');
                     refresh(186);
                 }
                 else {
                     document.getElementById("bondOrderSaveLoad").classList.add("hidden");
                     showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                 }

             }, function (err) {
                 document.getElementById("bondOrderSaveLoad").classList.add("hidden");
                 if (err.status != 420) {
                     showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                 }
                 alert('Error saveBondOrder');
             });
         }

         else {
             return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
         }
     };

     $scope.bondIssueChange = function () {
         if ($scope.bondOrder.Bond.BondIssueId != undefined) {
             $scope.getNonDistributedBondsCount($scope.bondOrder.Bond.BondIssueId);

             if ($scope.bondOrder.Bond.BondIssueId != undefined) {
              

                 var Data = bondIssueService.getBondIssue($scope.bondOrder.Bond.BondIssueId);
                 Data.then(function (b) {
                     $scope.bondIssue = b.data;
                     $scope.bondOrder.Currency = $scope.bondIssue.Currency;
                     $scope.bondOrder.Bond.Currency = $scope.bondIssue.Currency;
                     $scope.getAccountsForCouponRepayment();
                     $scope.getAccountsForBondRepayment();
                     $scope.getBondPrice($scope.bondIssue.ID);
                 },
                 function () {
                     $scope.loading = false;
                     alert('Error bondIssueChange');
                 });
             }
             else {
                 $scope.bondIssue = undefined;
             }

         }
         else {
             $scope.NonDistributedBondCount = undefined;
         }

     };

     $scope.getBondIssues = function (filter) {
         $scope.loading = true;
         if (filter == undefined) {
             filter = {
                 Quality: 11,
                 IssuerType: 3
             };
         }

         var Data = bondIssueService.getBondIssuesList(filter, true);
         Data.then(function (bondIssuesList) {
             $scope.bondIssuesList = bondIssuesList.data;
         },
         function () {
             $scope.loading = false;
             alert('Error getBondIssues');
         });
     };

     $scope.getBondOrder = function (orderId) {
         var Data = bondOrderService.getBondOrder(orderId);
         Data.then(function (acc) {
             $scope.orderDetails = acc.data;
         }, function () {
             alert('Error getBondOrder');
         });

     };

     $scope.getNonDistributedBondsCount = function (bondIssueId) {
         var Data = bondIssueService.getNonDistributedBondsCount(bondIssueId);
         Data.then(function (count) {
             $scope.NonDistributedBondCount = count.data;
         }, function () {
             alert('Error getNonDistributedBondsCount');
         });

     };

     $scope.calculateTotalPrice = function () {
         if ($scope.bondOrder.Bond.BondCount != undefined && $scope.bondOrder.Bond.UnitPrice != undefined) {
             $scope.bondOrder.Bond.TotalPrice = numeral($scope.bondOrder.Bond.BondCount * $scope.bondOrder.Bond.UnitPrice).format('0,0.00');
         }
         else {
             $scope.bondOrder.Bond.TotalPrice = undefined;
         }
     };


     $scope.getAccountsForCouponRepayment = function () {
         var Data = bondOrderService.getAccountsForCouponRepayment();
         Data.then(function (acc) {
             $scope.couponRepaymentAccounts = acc.data;
             $scope.bondOrder.Bond.AccountForCoupon.AccountNumber = undefined;
         }, function () {
             alert('Error getAccountsForCouponRepayment');
         });

     };

     $scope.getAccountsForBondRepayment = function () {
         if ($scope.bondOrder.Currency != undefined && $scope.bondOrder.Currency != "AMD") {
             var Data = bondOrderService.getAccountsForBondRepayment($scope.bondOrder.Currency);
             Data.then(function (acc) {
                 $scope.bondRepaymentAccounts = acc.data;
                 $scope.bondOrder.Bond.AccountForBond.AccountNumber = undefined;
             }, function () {
                 alert('Error getAccountsForBondRepayment');
             });
         }
         else {
             $scope.bondRepaymentAccounts = undefined;
         }


     };

     $scope.getBondPrice = function (bondIssueId) {
         var Data = bondService.getBondPrice(bondIssueId);
         Data.then(function (acc) {
             $scope.bondOrder.Bond.UnitPrice = acc.data;
         }, function () {
             $scope.bondOrder.Bond.UnitPrice = undefined;
             alert('Error getBondPrice');
         });
     };

     $scope.newFile = function () {
         var i = 0;
         if ($scope.attachmentsCounter.length == $scope.bondOrder.Attachments.length )
         {
             if ($scope.attachmentsCounter != undefined && $scope.attachmentsCounter.length > 0) {
                 i = $scope.attachmentsCounter.length;
             }
             $scope.attachmentsCounter.push(i);
         }
         else
         {
             return ShowMessage('Առկա են չկցված ֆայլեր։', 'error');
         }
       
     };

     $scope.removeFile = function (index) {
         $scope.bondOrder.Attachments.splice(index, 1);
         $scope.attachmentsCounter.splice(index, 1);
     }

     $scope.obj = {};
     $scope.convertfile = function ($files, $event, $flow, index) {
         var fr = new FileReader();

         fr.onload = function () {
             $scope.arraybuffer = this.result;



             var arraybuffer = $scope.arraybuffer
             arraybuffer = arraybuffer.replace('data:image/jpeg;base64,', '');
             arraybuffer = arraybuffer.replace('data:image/png;base64,', '');
             arraybuffer = arraybuffer.replace('data:image/jpg;base64,', '');
             arraybuffer = arraybuffer.replace('data:application/pdf;base64,', '');

             var oneAttachment = {};
             oneAttachment.Attachment = arraybuffer;
             oneAttachment.FileExtension = '.' + $scope.obj.flow.files[0].getExtension();
             //oneAttachment.Id = '0';
             oneAttachment.FileName = $files[0].name;
             $scope.bondOrder.Attachments.push(oneAttachment);

         };


         fr.readAsDataURL($files[0].file);

     };

     $scope.setBondDocumentNumber = function () {
         $scope.error = [];
         var Data = infoService.getLastKeyNumber(82);
         Data.then(function (key) {

             if (key.data != 0 && key.data != null) {
                 $scope.bondOrder.Bond.DocumentNumber = key.data;
             }
             else {
                 $scope.error.push({
                     Code: 1111, Description: 'Հնարավոր չէ ստեղծել հայտի համար։ Խնդրում ենք նորից փորձել։'
                 });
             }

         }, function () {
             $scope.error.push({
                 Code: 1111, Description: 'Հնարավոր չէ ստեղծել հայտի համար։ Խնդրում ենք նորից փորձել'
             });
         })
     };

     $scope.getBanks = function () {
         var Data = infoService.getBanks();
         Data.then(function (b) {
             $scope.banks = b.data;

         }, function () {
             alert('Error getBanks');
         });
     };

     $scope.hasCustomerDepositaryAccountInBankDB = function (customerNumber) {
         var Data = bondService.hasCustomerDepositaryAccountInBankDB(customerNumber);
         Data.then(function (acc) {
             if (acc.data == true) {
                 $scope.bondOrder.Bond.DepositaryAccountExistenceType = 1;
                 $scope.getCustomerDepositaryAccount(customerNumber);
             }

         }, function () {
             $scope.bondOrder.Bond.DepositaryAccountExistenceType = undefined;
             alert('Error hasCustomerDepositaryAccountInBankDB');
         });
     };

     $scope.getCustomerDepositaryAccount = function (customerNumber) {
         var Data = bondService.getCustomerDepositaryAccount(customerNumber);
         Data.then(function (acc) {
             var account = acc.data;
             $scope.bondOrder.Bond.CustomerDepositaryAccount.AccountNumber = account.AccountNumber;
             $scope.bondOrder.Bond.CustomerDepositaryAccount.BankCode = account.BankCode.toString();
             $scope.bondOrder.Bond.CustomerDepositaryAccount.Description = account.Description;


         }, function () {
             $scope.bondOrder.Bond.CustomerDepositaryAccount = {};
             alert('Error hasCustomerDepositaryAccountInBankDB');
         });
     };


     $scope.printBondCustomerCard = function (accountNumber, accountNumberForBond) {

         if ((accountNumber != undefined && $scope.bondOrder.Currency == 'AMD') || ($scope.bondOrder.Currency != 'AMD' && accountNumber != undefined && accountNumberForBond != undefined))
         {
             if ($scope.bondOrder.Currency == 'AMD') {
                 accountNumberForBond = undefined;
             }
             showloading();

             var Data = bondOrderService.printBondCustomerCard(accountNumber, accountNumberForBond);
             Data.then(function (response) {
                 var reportId = 0;
                 var result = angular.fromJson(response.data.result);
                 var customerType = angular.fromJson(response.data.customerType);
                 if (customerType == 6) {
                     reportId = 115;
                 }
                 else {
                     reportId = 116;
                 }
                 var requestObj = { Parameters: result, ReportName: reportId, ReportExportFormat: 1 }
                 ReportingApiService.getReport(requestObj, function (result) {
                     ShowPDFReport(result);
                 });
             }, function () {
                 alert('Error printBondCustomerCard');
             });
         }
         else {
             return ShowMessage('Առկա են չմուտքագրված դաշտեր։', 'error');
         }
     };

     $scope.getBondContract = function (accountNumberForCoupon,accountNumberForBond, contractDate) {

       
         if ((accountNumberForCoupon != undefined && $scope.bondOrder.Currency == 'AMD') || ($scope.bondOrder.Currency != 'AMD' && accountNumberForCoupon != undefined && accountNumberForBond != undefined)) {
             if ($scope.bondOrder.Currency == 'AMD') {
                 accountNumberForBond = undefined;
             }
             showloading();
             var Data = bondOrderService.getBondContract(accountNumberForCoupon, accountNumberForBond, contractDate);
             ShowPDF(Data);
         }
         else {
             return ShowMessage('Առկա են չմուտքագրված դաշտեր։', 'error');
         }
     };


 }]);
