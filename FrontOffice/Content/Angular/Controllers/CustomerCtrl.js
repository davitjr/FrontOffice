app.controller("CustomerCtrl", ['$scope', '$interval', 'customerService', '$location', 'infoService', 'dialogService', 'HBActivationOrderService', 'dateFilter','$controller',
    function ($scope, $interval, customerService, $location, infoService,  dialogService, HBActivationOrderService, dateFilter,$controller) {
    $scope.PersonNote = {};
    $scope.PersonNote.Note = '';
    $scope.Note = "";
    $scope.today = Date();
    $scope.customerDebts = [];
    $scope.currentRequest = "";

    $scope.getCustomer = function (customerNumber) {
        var Data = customerService.getCustomer(customerNumber);
        Data.then(function (cust) {
            $scope.customer = cust.data;

            if (cust.data.BirthDate != null)
            {

                var birthDate = cust.data.BirthDate;

                var dateTmp = moment(birthDate);

                var sec = dateTmp._d.setHours(dateTmp._d.getHours() - dateTmp._d.getTimezoneOffset() / 60);

                $scope.customer.BirthDate = moment(sec).format("DD/MM/YY");
                $scope.customer.Age = getAge(moment(sec).format("YYYY/MM/DD"));

            }
                //  $scope.getAttachmentDocumentList(cust.data.DefaultDocumentID);
            }, function(xhr) {
            alert('Error getCustomer');
        });
    };
    
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    $scope.changeCustomer = function () {
        var Data = customerService.changeCustomer($scope.findCustomerNumber);
        Data.then(function (cust) {
            if (cust.data == 0) {
                alert("Սխալ հաճախորդի համար:");
            }
            else if (cust.data == 99) {
                alert("Դուք չունեք հասանելիություն տվյալ հաճախորդի տվյալները դիտարկելու:");
            }
            //else
            //{
            //    $location.path("main")
            //}


        }, function () {
            alert('Error changeCustomer');
        });
    };
    $scope.hasACBAOnline = function () {
        var Data = customerService.hasACBAOnline();
        Data.then(function (cust) {

            $scope.HasHB = cust.data;

            if (cust.data == 1)
                $scope.ACBAOnline = "Ոչ ";
            else if (cust.data == 2)
                $scope.ACBAOnline = "Այո";
        }, function () {
            alert('Error hasACBAOnline');
        });
    };
    $scope.getCustomerDebts = function () {
        $scope.loading = true;

        $scope.serviceFeeCount = 0;
        $scope.overdraftCount = 0;
        $scope.overdueCount = 0;
        $scope.provisionCount = 0;
        $scope.blockageCount = 0;

        $('#collapseCustomerDebts').collapse('show');
        var Data = customerService.GetCustomerDebts();
        Data.then(function (debts) {
            $scope.customerDebts = debts.data;
            
            if ($scope.customerDebts.length == 0)
            {
                $('#menuCustomerDebts').hide();
            }
            else
            {
                $('#menuCustomerDebts').show();
            }

            for (var i = 0; i < $scope.customerDebts.length; i++) {
                if ($scope.customerDebts[i].DebtType == 1 || $scope.customerDebts[i].DebtType == 2 || $scope.customerDebts[i].DebtType == 3) {
                    $scope.serviceFeeCount = $scope.serviceFeeCount + 1;
                }
                else if ($scope.customerDebts[i].DebtType == 4) {
                    $scope.overdraftCount = $scope.overdraftCount + 1;
                }
                else if ($scope.customerDebts[i].DebtType == 6 || $scope.customerDebts[i].DebtType == 7 || $scope.customerDebts[i].DebtType == 8) {
                    $scope.overdueCount = $scope.overdueCount + 1;
                }
                else if ($scope.customerDebts[i].DebtType == 5) {
                    $scope.provisionCount = $scope.provisionCount + 1;
                }
                else if ($scope.customerDebts[i].DebtType == 9 || $scope.customerDebts[i].DebtType == 10) {
                    $scope.blockageCount = $scope.blockageCount + 1;
                }

            }

            if ($scope.blockageCount != 0) {
                $scope.itemIndex = 4;
                document.getElementById('blockageDebts').classList.add("active");
            }
            else if ($scope.serviceFeeCount != 0) {
                $scope.itemIndex = 0;
                document.getElementById('serviceFeeDebts').classList.add("active");
            }
            else if ($scope.overdraftCount != 0) {
                $scope.itemIndex = 1;
                document.getElementById('overdraftDebts').classList.add("active");
            }
            else if ($scope.overdueCount != 0) {
                $scope.itemIndex = 2;
                document.getElementById('overdueDebts').classList.add("active");
            }
            else if ($scope.provisionCount != 0) {
                $scope.itemIndex = 3;
                document.getElementById('provisionDebts').classList.add("active");
            }

            $scope.customerStrictDebts = $.grep($scope.customerDebts, function (v) { return v.AlowTransaction == 0 || v.AlowTransaction == 2; });

            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getCustomerDebts');
        });
    };


    $scope.setClickedRow = function (index) {
        $scope.selectedRow = index;
        $scope.selectedObjectNumber = $scope.customerDebts[index].ObjectNumber;
        $scope.selectedType = $scope.customerDebts[index].DebtType;
    }
    $scope.savePersonNote = function () {
        $scope.loading = true;
        var Data = customerService.savePersonNote($scope.PersonNote);

        Data.then(function (res) {
            $scope.loading = false;
            $scope.getPersonNoteHistory();
        }
       , function () {

            alert('Error in SavePersonNote');
        });


        $("#noteContainer").html('');
        $("#note-text").val("");
        HideNoteInput();

    }
    $scope.getPersonNoteHistory = function () {
        var Data = customerService.getPersonNoteHistory();
        Data.then(function (acc) {
            $scope.personNoteHistory = acc.data;
        }, function () {
            alert('Error getPersonNote');
        });
    };


    $scope.clearAllCache = function () {

        var Data = infoService.clearAllCache();
        Data.then(function (acc) {

            $scope.clearAllCache = acc.data;
        }, function () {
            alert('Error clearAllCache');
        });
    };



    //$interval(function () { $scope.getPersonNoteHistory(); }, 60000);
    $scope.getCasherDescription = function (setNumber) {

        var Data = customerService.getCasherDescription(setNumber);
        Data.then(function (descr) {
            $scope.casherDescription = descr.data;

        }, function () {
            alert('Error getCasherDescription');
        });
    };

    $scope.getAttachmentDocumentList = function (customerNumber, showSlide, isCustomerDetailsCall, isKYC) {
        showloading();
        $scope.slidesKYC = [];
        $scope.slides = [];
        
        var Data = customerService.getAttachmentDocumentList(customerNumber, 1);
        
        Data.then(function (att) {
            $scope.attachments = att.data;
            hideloading();
                for (var i = 0; i < $scope.attachments.length; i++) {
                    if ($scope.attachments[i].FileExtension == 1 && $scope.attachments[i].DocumentType!=39) {
                        SlideImage($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
                    }
                    else if ($scope.attachments[i].FileExtension == 2 && $scope.attachments[i].DocumentType != 39) {
                        SlidePDF($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
                    }
                    else if ($scope.attachments[i].FileExtension == 1 && $scope.attachments[i].DocumentType == 39) {
                        SlideImageKYC($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
                    }
                    else if ($scope.attachments[i].FileExtension == 2 && $scope.attachments[i].DocumentType == 39) {
                        SlidePDFKYC($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
                    }
                }
            
           

           


            if (showSlide == true)
            {
                if (isCustomerDetailsCall != true)
                    isCustomerDetailsCall = false;

                $controller('PopUpCtrl', { $scope: $scope });
                $scope.params = { slides: $scope.slides, customerNumber: $scope.selectedCustomerNumber, isCustomerDetailsCall: isCustomerDetailsCall }
                $scope.openWindow('/ImageSlider/ImageSlider', 'Ստորագրության նմուշ', 'imageslider');
            }

            
        }, function () {
            hideloading();
            alert('Error getAttachmentDocumentList');
        });
    };

   
    //$scope.payServiceFees = function (debtType) {

    //    $scope.debtType = debtType;
    //    $scope.ServiceFeeModalInstance = $uibModal.open({
    //        template: '<servicepaymentorder debt-type=' + debtType + ' callback="getCustomerDebts();closeServiceFeeModalInstance();" close="closeServiceFeeModalInstance();" ></servicepaymentorder>',
    //        scope: $scope,
    //        backdrop: true,
    //        backdropClick: true,
    //        dialogFade: false,
    //        keyboard: false,
    //        backdrop: 'static',
    //        size:'650px',
    //    });


    //};

    $scope.closeServiceFeeModalInstance = function () {
        $scope.ServiceFeeModalInstance.close();
    };

$scope.changeCustomerNumber = function (custNum) {
        $scope.customerNumber = custNum;
};

$scope.hasPhoneBanking = function () {
    //var Data = customerService.hasPhoneBanking();
    //Data.then(function (cust) {

    //    $scope.HasPB = cust.data;
    //    if (cust.data == 1) {
    //        $scope.PhoneBanking = "Ոչ ";
    //    }
    //    else if (cust.data == 2)
    //        $scope.PhoneBanking = "Այո";
    //}, function () {
    //    alert('Error hasPhoneBanking');
    //});
};

    function SlideImage(response, extension) {
             var byteArray = new Uint8Array(response);
             var blob = new Blob([byteArray], {type: 'image/jpeg'});
             var fileURL = URL.createObjectURL(blob);
             $scope.slides.push({ image: fileURL, blob: blob, extension: extension, originalimage: byteArray });

        };
         function SlidePDF(response, extension) {
             var byteArray = new Uint8Array(response);
             var blob = new Blob([byteArray], { type: 'application/pdf' });
             var fileURL = URL.createObjectURL(blob);
             $scope.slides.push({ image: '/Content/Images/pdf.png', blob: blob, extension: extension });

        };


        function SlideImageKYC(response, extension) {
            var byteArray = new Uint8Array(response);
            var blob = new Blob([byteArray], { type: 'image/jpeg' });
            var fileURL = URL.createObjectURL(blob);
            $scope.slidesKYC.push({ image: fileURL, blob: blob, extension: extension, originalimage: byteArray });

        };
        function SlidePDFKYC(response, extension) {
            var byteArray = new Uint8Array(response);
            var blob = new Blob([byteArray], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(blob);
            $scope.slidesKYC.push({ image: '/Content/Images/pdf.png', blob: blob, extension: extension });

        };


    function SlideImageOld(response, extension) {
        response.then(function (dt) {
            var blob = new Blob([dt.data], { type: 'image/jpeg' });
            var fileURL = URL.createObjectURL(blob);
            $scope.slides.push({ image: fileURL, blob: blob, extension: extension });

        }, function ($scope) {
            alert('Error get Application');
            ShowMessage('Տեղի ունեցավ սխալ', 'error');
        });
    };

    function SlidePDFOld(response, extension) {
        response.then(function (dt) {
            var blob = new Blob([dt.data], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(blob);
            $scope.slides.push({ image: '/Content/Images/pdf.png', blob: blob, extension: extension });

        }, function ($scope) {
            alert('Error get Application');
            ShowMessage('Տեղի ունեցավ սխալ', 'error');
        });
    };
    
    $scope.getHBRequests = function () {
        var Data = HBActivationOrderService.getHBRequests();
        Data.then(function (acc) {
        $scope.requests = acc.data;
        for (var i = 0; i < $scope.requests.length; i++) {
            if ($scope.requests[i].RequestType == 1) {
                $scope.HasHB = 3;
            }
        }
        }, function () {
            alert('Error getHBActivationRequests');
        });
    };


    $scope.callbackgetCustomerDebts = function () {
        $scope.getCustomerDebts();
    }


    $scope.callbackhasOnlineBanking = function () {
        $scope.hasACBAOnline();
        $scope.hasPhoneBanking();
        $scope.getHBRequests();
    }

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
    }

    $scope.setCurrentRequest = function (index) {
        $scope.currentRequest = angular.copy($scope.requests[index]);
    }

    //Հաճախորդի պարտավորություններում ցույց է տալիս առաջին ոչ դատարկ tab-ը
    //itemIndex-ը ցույց է տալիս թե որ tab-ն է ակտիվ
    $scope.ActiveDivContentLoad = function ()
    {
        $("#customerDebtsContent div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("#customerDebtsContent div.bhoechie-tab>div.bhoechie-tab-content").eq($scope.itemIndex).addClass("active");
    };

    $scope.saveCustomerPhoto = function (arraybuffer, fileExtension)
    {
        arraybuffer = arraybuffer.replace('data:image/jpeg;base64,', '');
        arraybuffer = arraybuffer.replace('data:image/png;base64,', '');
        arraybuffer = arraybuffer.replace('data:image/jpg;base64,', '');

        var oneAttachment = {};
        oneAttachment.Attachment = arraybuffer;
        oneAttachment.FileExtension = fileExtension;

        var binary = fixBinary(atob(arraybuffer));
        var blob = new Blob([binary], { type: 'image/' + fileExtension });

        if (blob.size > 307200) {
            ShowMessage('Նկարի չափը չի կարող գերազանցել 300kb-ն', 'error');
            return;
        }

        oneAttachment.Id = 0;
        var Data = customerService.saveCustomerPhoto(oneAttachment, 0);
        Data.then(function (att) {
            if (att.data == "OK") {

                var refreshScope = angular.element(document.getElementById('customerNew')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getCustomerPhoto();
                }
            }
        }, function () {
            ShowMessage('Տեղի ունեցավ սխալ:', 'error');
            alert('Error saveCustomerPhoto');
        });
    }

    function fixBinary(bin) {
        var length = bin.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return buf;
    };

    $scope.obj = {};
    $scope.convertfile = function ($files, $event, $flow) {
        var fr = new FileReader();

        fr.onload = function () {
            $scope.arraybuffer = this.result;

            $scope.saveCustomerPhoto($scope.arraybuffer, $scope.obj.flow.files[0].getExtension(), $scope.obj.flow.files[0].size);
       };

        if ($files.length == 0)
        {
            ShowMessage('Ընտրված է սխալ տեսակի ֆայլ:', 'error');
            return;
        }
        fr.readAsDataURL($files[0].file);

    };


    $scope.getCustomerPhoto = function (customerNumber) {

        if (customerNumber == undefined)
            customerNumber = 0;

        $scope.customerPhoto = "/Content/newTheme/Images/bluemanmxxl.png";
        $scope.hasPicture = false;
        var Data = customerService.getCustomerPhoto(customerNumber);
        Data.then(function (dt) {
            $scope.photo = dt.data;
            if ($scope.photo != '' && $scope.photo.PhotoThumbnail != undefined)
            {
                $scope.hasPicture = true;
                var byteArrayThumbnail = new Uint8Array($scope.photo.PhotoThumbnail);
                var blobThumbnail = new Blob([byteArrayThumbnail], { type: 'image/jpeg' });
                var fileURLThumbnail = URL.createObjectURL(blobThumbnail);

               
            }
            else {
                var fileURLThumbnail = "/Content/newTheme/Images/bluemanmxxl.png";
            }

            $scope.customerPhoto = fileURLThumbnail;
        }, function () {
            alert('Error');
        });

    };


    $scope.deleteCustomerPhoto = function (photoId) {

        var Data = customerService.deleteCustomerPhoto(photoId);
        Data.then(function (dt) {
            $scope.getCustomerPhoto();
            ShowMessage('Նկարը հեռացված է:', 'ok');

        }, function () {
            ShowMessage('Տեղի ունեցավ սխալ:', 'error');
            alert('Error getCasherDescription');
        });
    };

    $scope.getCustomerOnePhoto = function (photoId) {
        var Data = customerService.getCustomerOnePhoto(photoId);
        Data.then(function (acc) {
            var byteArray = new Uint8Array(acc.data);

            var blob = new Blob([byteArray], { type: 'image/jpeg' });

            var fileURL = URL.createObjectURL(blob);

            $scope.photos = [];

            $scope.photos.push({ image: fileURL, blob: blob });

            $scope.params = { slides: $scope.photos,isCustomerDetailsCall: true };
            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.open('imageslider', $scope, 'Հաճախորդի նկար', '/ImageSlider/ImageSlider', dialogOptions);
        }, function () {
            alert('Error getPersonNote');
        });
    };

    $scope.getCustomerLinkedPersons = function (customerNumber, quality) {
        var Data = customerService.getCustomerLinkedPersons(customerNumber, quality);
        Data.then(function (acc) {
            $scope.linkedPersonsList = acc.data;
        }, function () {
            alert('Error getCustomerLinkedPersons');
        });

    };

    
    $scope.getAuthorizedCustomerLinkedPersons = function () {
        var Data = customerService.getAuthorizedCustomerNumber();
        Data.then(function (cust) {
            $scope.CustomerNumber = cust.data;
           
            $scope.params = { customerNumber: $scope.CustomerNumber };

            var temp = '<customerlinkedpersons></customerlinkedpersons>';
            var id = 'LinkedPersonsList';
            var title = 'Փոխկապակցված անձինք';
            
            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.openWithTemplate(id, $scope, title, temp, dialogOptions);

        }, function () {
            alert('Error getAuthorizedCustomerLinkedPersons');
        });
    };


  $scope.hasCardTariffContract = function () {
       var Data = customerService.hasCardTariffContract();
    Data.then(function (result) {
        $scope.hasCardTariffContract = result.data;
    }, function () {
        alert('Error hasCardTariffContract');
    });
  };

 $scope.hasPosTerminal = function () {
       var Data = customerService.hasPosTerminal();
    Data.then(function (result) {
        $scope.hasPosTerminal = result.data;
    }, function () {
        alert('Error hasPosTerminal');
    });
 };




    
 $scope.setCurrentRequests = function ()
 {
     $scope.currentRequests = [];
     if ($scope.requests != undefined)
     {
         for (var i = 0; i < $scope.requests.length; i++)
         {
             $scope.currentRequests.push($scope.requests[i]);
             
         }
     }
     $scope.params = { requests: $scope.currentRequests }
     
 };
 
 

}]);
