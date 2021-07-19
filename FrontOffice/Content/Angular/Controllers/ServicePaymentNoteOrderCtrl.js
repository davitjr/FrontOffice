app.controller("ServicePaymentNoteOrderCtrl", ['$scope', 'servicePaymentNoteOrderService', 'customerService', 'infoService', '$location', 'dialogService', '$uibModal', 'orderService', '$http', '$filter', function ($scope, servicePaymentNoteOrderService, customerService, infoService, $location, dialogService, $uibModal, orderService, $http, $filter) {
  $scope.serviceNoteOrder = {};
  $scope.serviceNoteOrder.SubType = 1;
  $scope.serviceNoteOrder.OperationDate = $scope.$root.SessionProperties.OperationDate;
  $scope.serviceNoteOrder.Note = {};
  $scope.servicePaymentNoteReasons = [];
  $scope.serviceNoteOrder.Note.AdditionalDescription = "";

  if($scope.selectedNote!=undefined)
  {
    $scope.selectedNote.NoteDateFormated= $filter('mydate') ($scope.selectedNote.NoteDate, "dd/MM/yyyy");
  }
 

  $scope.getServicePaymentNoteList = function () {
        var Data = servicePaymentNoteOrderService.getServicePaymentNoteList();

        Data.then(function (notes) {
            $scope.paymentServiceNotes = notes.data;
        }, function () {
            alert('Error getSevicePaymentNotes');
        });
    };

  $scope.deleteServicePaymentNote = function (Id) {
        var Data = servicePaymentNoteOrderService.deleteServicePaymentNote();
        Data.then(function (result) {
            if (result.data.ResultCode == 1)
            {
                $scope.paymentServiceNotes.splice($scope.selectedNoteIndex, 1);
            }
         
        }, function () {
            alert('Error deleteServicePaymentNote');
        });
    }

  $scope.setSelectedNoteIndex = function (index)
    {
        $scope.selectedNoteIndex = index;
        $scope.selectedNote = $scope.paymentServiceNotes[index];
    }


  $scope.getServicePaymentNoteReasons = function () {
      var Data = infoService.getServicePaymentNoteReasons($scope.$root.SessionProperties.CustomerType);
        Data.then(function (noteReasons) {
            $scope.servicePaymentNoteReasons = noteReasons.data;
        }, function () {
            alert('Error getServicePaymentNoteReasons');
        });
        }

  $scope.saveServicePaymentNoteOrder = function (orderType) {

        if (orderType == 87)
        {
            if ($scope.serviceNoteOrder.Note.NoteActionType == 1) {
                $scope.serviceNoteOrder.Note.NoteReason = 0;
                $scope.serviceNoteOrder.Note.NoteReasonDescription = " ";
                $scope.serviceNoteOrder.Note.AdditionalDescription = "Գանձել";
            }
            else {
                $scope.serviceNoteOrder.Note.NoteReason = $scope.noteReason.key;
                $scope.serviceNoteOrder.Note.NoteReasonDescription = $scope.noteReason.value;
            }

        }      
            if (orderType == 88)
            {
                $scope.serviceNoteOrder.Note.Id = $scope.selectedNote.Id;
                $scope.serviceNoteOrder.Note.NoteDate = $scope.selectedNote.NoteDate;

            }
            $scope.serviceNoteOrder.Type = orderType;
            if ($http.pendingRequests.length == 0) {
                document.getElementById("noteLoad").classList.remove("hidden");
                var Data = servicePaymentNoteOrderService.saveServicePaymentNoteOrder($scope.serviceNoteOrder);
                Data.then(function (res) {
                        if (validate($scope, res.data)) {
                            document.getElementById("noteLoad").classList.add("hidden");
                            if ($scope.serviceNoteOrder.Type == 87) {
                                CloseBPDialog('newServicePaymentNote');
                            }
                            else {
                                CloseBPDialog('deleteServicePaymentNote');
                            }
                            
                            $scope.path = '#Orders';
                            showMesageBoxDialog('Հայտի մուտքագրումը կատարված է', $scope, 'information');
                            refresh(87);
                        }
                        else {
                            document.getElementById("noteLoad").classList.add("hidden");
                            showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                        }

                    }, function () {
                        document.getElementById("noteLoad").classList.add("hidden");
                        showMesageBoxDialog('Տեղի ունեցավ սխալ', $scope, 'error');
                        alert('Error saveServicePaymentNoteOrder');
                    });
            }
            else {
                return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
            }
  }

  $scope.getServicePaymentNoteOrder = function (orderId) {

      var Data = servicePaymentNoteOrderService.getServicePaymentNoteOrder(orderId);
      Data.then(function (note) {
          $scope.orderDetails = note.data;
      }, function () {
          alert('Error GetServicePaymentNote');
      });

  }

 $scope.getDelatedServicePaymentNoteOrder = function (orderId) {

        var Data = servicePaymentNoteOrderService.getDelatedServicePaymentNoteOrder(orderId);
      Data.then(function (note) {
          $scope.orderDetails = note.data;
      }, function () {
          alert('Error GetDelatedServicePaymentNoteOrder');
      });

  }


 $scope.setNoteActionType = function (action)
 {
     if (action == 1)
     {
         $scope.noteReason = " ";
     }
 }

}]);