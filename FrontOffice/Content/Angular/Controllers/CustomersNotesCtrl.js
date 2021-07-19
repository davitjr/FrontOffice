app.controller("CustomersNotesCtrl", ['$scope', 'infoService', 'customersNotesService', '$uibModal', 'customerService', '$confirm', function ($scope, infoService, customersNotesService, $uibModal, customerService, $confirm) {
        $scope.PersonNote = {};
        $scope.$root.OpenMode = 8;
        $scope.searchParams = {};
        $scope.PersonNote.Note = '';
        $scope.Note = "";
        $scope.today = Date();
        $scope.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        if ($scope.selectedNote != undefined) {
            $scope.PersonNote.NoteID = $scope.selectedNote.NoteID;
            $scope.PersonNote.Note = $scope.selectedNote.Note;
            //$scope.PersonNote.Quality = $scope.selectedNote.Quality;
        }
        else {
            $scope.PersonNote.Quality='1';
            $scope.disableQuality = true;
        }

        $scope.currentPage = 0;
        $scope.numPerPage = 30;
        $scope.maxSize = 1;
        $scope.totalRows = 0;

        $scope.$watch('currentPage', function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.searchParams.BeginRow = (newValue - 1) * $scope.numPerPage + 1;
                $scope.searchParams.EndRow = newValue * $scope.numPerPage;
                $scope.getSearchedPersonNotes();
            }
        });
        $scope.getSearchedPersonNotes = function () {
            var Data = customersNotesService.getSearchedPersonNotes($scope.searchParams);
            Data.then(function (acc) {
                $scope.customersNotes = acc.data;
                var notReadedNotesCount = 0;
                if ($scope.customersNotes.length>0)
                    $scope.totalRows = $scope.customersNotes[0].RowCount;
                if ($scope.totalRows / $scope.numPerPage > 5) {
                    $scope.maxSize = 5;
                }
                else {
                    $scope.maxSize = Math.ceil($scope.totalRows / $scope.numPerPage);
                }

                for (var i = 0; i < $scope.customersNotes.length; i++)
                {
                    if ($scope.customersNotes[i].NotReadedNote == true)
                    {
                        notReadedNotesCount = notReadedNotesCount + 1;
                    }
                }
                $scope.notReadedNotesCount = notReadedNotesCount;

            }, function () {
                alert('Error getSearchedPersonNotes');
            });
        };
        
        $scope.setSearchParameters = function ()
        {
            $scope.searchParams = {};
            $scope.searchParams["BeginRow"] = 1;
            $scope.searchParams["EndRow"] = 30;
            if ($scope.$root.SessionProperties != undefined && ($scope.$root.SessionProperties.SourceType == 2 || $scope.$root.SessionProperties.SourceType == 6))
            {
                $scope.disableCustomerNumber = true;
                var Data = customerService.getAuthorizedCustomerNumber();
                Data.then(function (cust) {
                    $scope.searchParams.CustomerNumber = cust.data;
                    $scope.searchParams.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                    $scope.searchParams.Quality = '1';
                    $scope.getSearchedPersonNotes();
                });
            }
            else
            {
                $scope.searchParams.RegistrationDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                $scope.searchParams.Quality = '1';
                $scope.getSearchedPersonNotes();
            }
        }

        $scope.changeQuality = function (quality)
        {
            if (quality != 2 && quality != 3 ) {
                $scope.searchParams.ClosingSetNumber = undefined;
                $scope.searchParams.ClosingDate = undefined;
                $scope.ClosingSetNumberDescription = undefined;
            }
        }

        $scope.setClickedRow = function (customerNote) {

            $scope.selectedcustomerNote = customerNote;
           

        };
        



        $scope.savePersonNote = function (customerNumber,isopeninlist) {
            $scope.loading = true;
            $scope.error = null;
            if ($scope.isNewNote && customerNumber == undefined)
                customerNumber = 0;
            var Data = customersNotesService.savePersonNote($scope.PersonNote,customerNumber);
            Data.then(function (res) {
                $scope.loading = false;
                if (res.data.errorList.length == 0) {
                    if (isopeninlist != true) {
                        $scope.getPersonNotesHistory(1);
                        $("#noteContainer").html('');
                        $("#note-text").val("");
                        HideNoteInput();
                        var refreshScope = angular.element(document.getElementById('CustomersNotes')).scope();
                        if (refreshScope != undefined)
                        {
                            refreshScope.getSearchedPersonNotes();
                        }
                        
                    }
                    else {
                        CloseBPDialog('customernewnote');
                        var refreshScope = angular.element(document.getElementById('RightSidebar')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.getPersonNotesHistory(1);
                        }
                        refreshScope = angular.element(document.getElementById('CustomersNotes')).scope();
                        if (refreshScope != undefined)
                        {
                            refreshScope.getSearchedPersonNotes();
                        }
                    }
                }
                else {
                    $scope.error = [];
                    for (var i = 0; i < res.data.errorList.length; i++) {
                        $scope.error.push({ Description: res.data.errorList[i].value });
                    }
                    showMesageBoxDialog('Խնդրում ենք ուղղել սխալները և կրկին փորձել', $scope, 'error');
                    
                }
            }
           , function () {

               alert('Error in SavePersonNote');
           });
        }
        $scope.getPersonNotesHistory = function (noteQuality) {
            var Data = customersNotesService.getPersonNotesHistory(noteQuality);
            Data.then(function (acc) {
                $scope.personNoteHistory = acc.data;
                $scope.$root.personNoteCount = acc.data.length;
            }, function () {
                alert('Error getPersonNote');
            });
        };

        $scope.getPersonNoteHistory = function (noteId) {
            var Data = customersNotesService.getPersonNoteHistory(noteId);
            Data.then(function (acc) {
                $scope.personOneNoteHistory = acc.data;
            }, function () {
                alert('Error getPersonNote');
            });
        };

        $scope.InsertNote = function (note) {
            var date = note.ActionDateString;
            var notText = note.PersonNote.Note;

            toastr8.twitter({
                message: notText,
                title: date,
                employee: note.ActionUserName,
                iconClass: "fa fa-info"
            });
            $("#note-text").val("");
        };


        $scope.searchCustomers = function () {
            $scope.searchCustomersModalInstance = $uibModal.open({
                template: '<searchcustomer callback="getSearchedCustomer(customer)" close="closeSearchCustomersModal()"></searchcustomer>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });

            $scope.searchCustomersModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };

        $scope.getSearchedCustomer = function (customer) {
            $scope.searchParams.CustomerNumber = customer.customerNumber;
            $scope.closeSearchCustomersModal();
        };

        $scope.closeSearchCustomersModal = function () {
            $scope.searchCustomersModalInstance.close();
        };



        $scope.searchCashiers = function (isClosingSetNumber) {
            $scope.searchCashiersModalInstance = $uibModal.open({
                template: '<searchcashier callback="getSearchedCashier(cashier'+','+isClosingSetNumber+')" close="closeSearchCashiersModal()"></searchcashier>',
                scope: $scope,
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: false,
                backdrop: 'static',
            });


            $scope.searchCashiersModalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {

            });
        };
        $scope.getSearchedCashier = function (cashier, isClosingSetNumber) {

            if (isClosingSetNumber)
            {
                $scope.searchParams.ClosingSetNumber = cashier.setNumber;
                $scope.ClosingSetNumberDescription = cashier.firstName + ' ' + cashier.lastName;
            }
            else {
                $scope.searchParams.SetNumber = cashier.setNumber;
                $scope.SetNumberDescription = cashier.firstName + ' ' + cashier.lastName;
            }
            $scope.closeSearchCashiersModal();
        }

        $scope.closeSearchCashiersModal = function () {
            $scope.searchCashiersModalInstance.close();
        };

        $scope.redirectProducts = function (customerNumber) {
            var Data = customerService.redirectProducts(customerNumber);
            Data.then(function (acc) {
                var url = location.origin.toString();
                window.location = url+acc.data.redirectUrl + "?customerNumber=" + acc.data.customerNumber + "&customerType=" + acc.data.customerType + "&authorizedUserSessionToken=" + acc.data.authorizedUserSessionToken;
            }, function () {
                alert('Error redirectProducts');
            });
        };


        $scope.changePersonNoteReadingStatus = function (noteId) {

            $confirm({ title: 'Շարունակե՞լ', text: 'Նշել կարդացվա՞ծ' })
            .then(function () {

            var Data = customersNotesService.changePersonNoteReadingStatus(noteId);
            Data.then(function (acc) {
                $scope.ok = acc.data;
                var refreshScope = angular.element(document.getElementById('CustomersNotes')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getSearchedPersonNotes();
                }
            }, function () {
                alert('Error changePersonNoteReadingStatus');
            });
             });
        };


        $scope.checkCustomerHasArrests = function () {
            var Data = customersNotesService.getCustomerHasArrests();
            Data.then(function (acc) {
                $scope.customerArrests = acc.data;
            }, function () {
                alert('Error changePersonNoteReadingStatus');
            });
        };


    }]);