angular.module('searchCustomerControl', [])
    .directive('searchcustomer', ['infoService', function (infoService) {
        return {
            scope: {
                callback: '&',
                close: '&'
            },
            templateUrl: '../Content/Controls/SearchCustomer.html',
            link: function (scope, element, attr) {
                $(".modal-dialog").draggable();
                scope.currentPage = 0;
                scope.numPerPage = 30;
                scope.maxSize = 1;
                scope.totalRows = 0;

                scope.selectCustomer = function () {
                    scope.callback({ customer: scope.selectedCustomer });
                };

                scope.closeSearchCustomersModal = function () {
                    scope.close();
                };

                var cacheOneSearchedCustomer = JSON.parse(localStorage.getItem('cacheOneSearchedCustomer'));

                if (cacheOneSearchedCustomer != null) {
                    scope.searchCash = true;
                    scope.oneSearchedCustomerCache = cacheOneSearchedCustomer;
                    scope.oneSearchedCustomerCache.quality = -1;
                    scope.oneSearchedCustomerCache.residence = 1;
                    scope.oneSearchedCustomerCache.customerType = -1;
                }
                scope.oneSearchedCustomer = {
                    filialCode: undefined,
                    customerNumber: null,
                    customerType: -1,
                    quality: -1,
                    qualityDescription: null,
                    residence: 1,
                    firstName: null,
                    lastName: null,
                    MiddleName: null,
                    birthDate: null,
                    organisationName: null,
                    emailAddress: null,
                    phoneNumber: null,
                    socCardNumber: null,
                    taxCode: null,
                    passportNumber: null,
                    documentNumber: null,
                    address: null,
                    MatchCase: false,
                    DoubleCustomers: false,
                    lastDate: null,
                    passportID: null,
                    idCardNumber: null,
                    isAutoSearch: false,
                    creditCode: null
                };




                scope.oneSearchedCustomer.addressSearchParams = null;

                var cacheCurrentPage = JSON.parse(localStorage.getItem('cacheCurrentPage'));
                if (cacheCurrentPage != null) {
                    scope.currentPage = cacheCurrentPage;
                    //scope.findCustomers();
                }

            },
            controller: ['$scope', '$element', 'customerService', 'dialogService', 'dateFilter', function ($scope, $element, customerService, dialogService, dateFilter) {
                $scope.setDisplayingFeatureForLeasing = function () {
                    debugger;
                    $scope.leasingSearchNumber = sessionStorage.getItem("calledForLeasing");
                    if ($scope.leasingSearchNumber != undefined && $scope.leasingSearchNumber != null) {
                        $scope.leasingSearchNumber = true;
                    }
                    else {
                        $scope.leasingSearchNumber = false;
                    }
                }

                $scope.getAttachmentDocumentList = function (customerNumber) {
                    showloading();
                    var Data = customerService.getAttachmentDocumentList(customerNumber, 1);
                    $scope.slides = [];
                    Data.then(function (att) {
                        $scope.attachments = att.data;



                        for (var i = 0; i < $scope.attachments.length; i++) {
                            if ($scope.attachments[i].FileExtension == 1) {
                                SlideImage($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
                            }
                            else if ($scope.attachments[i].FileExtension == 2) {
                                SlidePDF($scope.attachments[i].Attachment, $scope.attachments[i].FileExtension);
                            }
                        }
                        $scope.params = { slides: $scope.slides, customerNumber: $scope.selectedCustomerNumber, isCustomerDetailsCall: true }
                        hideloading();
                        $scope.openWindow('/ImageSlider/ImageSlider', 'Ստորագրության նմուշ', 'imageslider');

                    }, function () {
                        hideloading();
                        alert('Error getAttachmentDocumentList');
                    });
                };
                function SlideImage(response, extension) {
                    var byteArray = new Uint8Array(response);
                    var blob = new Blob([byteArray], { type: 'image/jpeg' });
                    var fileURL = URL.createObjectURL(blob);
                    $scope.slides.push({ image: fileURL, blob: blob, extension: extension });

                };
                function SlidePDF(response, extension) {
                    var byteArray = new Uint8Array(response);
                    var blob = new Blob([byteArray], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(blob);
                    $scope.slides.push({ image: '/Content/Images/pdf.png', blob: blob, extension: extension });

                };


                $scope.openWindow = function (url, title, id, params) {

                    if (document.getElementById(id)) {
                        CloseBPDialog(id);
                    }
                    var dialogOptions = {
                        callback: function () {
                            if (dialogOptions.result !== undefined) {
                                cust.mncId = dialogOptions.result.whateverYouWant;
                            }
                        },
                        result: {}
                    };
                    if (params != undefined)
                        $scope.params = params;



                    dialogService.open(id, $scope, title, url, dialogOptions, undefined, undefined);

                };





                $scope.getFilialList = function () {
                    var Data = infoService.GetFilialList();
                    Data.then(function (ref) {
                        $scope.filialList = ref.data;
                    }, function () {
                        alert('Error FilialList');
                    });
                };


                $scope.setClickedRow = function (index) {
                    $scope.selectedRow = index;
                    $scope.selectedCustomerNumber = $scope.customersList[index].customerNumber;
                    $scope.selectedCustomer = $scope.customersList[index];
                };

                $scope.$watch("currentPage", function (newValue, oldValue) {
                    if ($scope.currentPage != 0) {

                        if (newValue != oldValue) {
                            $scope.curentPageCash = false;
                        }
                        $scope.findCustomers();
                    }

                });

                $scope.btnFindClick = function () {

                    if ($scope.currentPage == 1) {
                        $scope.findCustomers();
                    }
                    else {
                        $scope.currentPage = 1;
                    }
                };


                $scope.findCustomers = function () {

                    if ($scope.leasingSearchNumber == true && $scope.leasingCustomerNumber != undefined && $scope.leasingCustomerNumber != null) {
                        var Data = customerService.getLeasingCustomerNumber($scope.leasingCustomerNumber);
                        Data.then(function (result) {
                            $scope.oneSearchedCustomer.customerNumber = result.data;

                            if ($scope.oneSearchedCustomer.firstName == "") {
                                $scope.oneSearchedCustomer.firstName = null;
                            }

                            if ($scope.oneSearchedCustomer.lastName == "") {
                                $scope.oneSearchedCustomer.lastName = null;
                            }

                            if ($scope.oneSearchedCustomer.MiddleName == "") {
                                $scope.oneSearchedCustomer.MiddleName = null;
                            }

                            if ($scope.oneSearchedCustomer.birthDate != "" && $scope.oneSearchedCustomer.birthDate instanceof Date) {
                                $scope.oneSearchedCustomer.birthDate =
                                    dateFilter($scope.oneSearchedCustomer.birthDate, 'yyyy/MM/dd');
                            }


                            var customersURL = appConfig.customersURL;

                            var customersList = JSON.parse(localStorage.getItem('customersList'));
                            if (customersList != null && $scope.searchCash == true && $scope.curentPageCash != false) {
                                $scope.customersList = customersList;
                                $scope.totalRows = localStorage.getItem('totalRows');
                                $scope.maxSize = localStorage.getItem('maxSize');
                                return;
                            }
                            if ($scope.oneSearchedCustomer.filialCode == undefined) {
                                $scope.oneSearchedCustomer.filialCode = -1;
                            }

                            $.ajax({
                                url: customersURL + "/SearchCustomer/SearchCustomersSharePoint",
                                type: 'GET',
                                dataType: 'json',
                                cache: false,
                                async: true,
                                data: {
                                    searchParams: JSON.stringify($scope.searchCash == true ? $scope.oneSearchedCustomerCache : $scope.oneSearchedCustomer), page: $scope.currentPage
                                },
                                xhrFields: {
                                    withCredentials: false
                                },
                                success: function (response) {

                                    if ($scope.oneSearchedCustomer.filialCode == -1) {
                                        $scope.oneSearchedCustomer.filialCode = undefined;
                                    }

                                    $scope.customersList = response.rows;

                                    localStorage.setItem('customersList', JSON.stringify(response.rows));

                                    $scope.totalRows = response.records;
                                    localStorage.setItem('totalRows', JSON.stringify(response.records));

                                    if (response.total > 5) {
                                        $scope.maxSize = 5;
                                    }
                                    else {
                                        $scope.maxSize = response.total;
                                    }
                                    localStorage.setItem('maxSize', JSON.stringify($scope.maxSize));
                                    localStorage.setItem('cacheOneSearchedCustomer', JSON.stringify($scope.searchCash == true ? $scope.oneSearchedCustomerCache : $scope.oneSearchedCustomer));
                                    localStorage.setItem('cacheCurrentPage', JSON.stringify($scope.currentPage));
                                    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                        $scope.$apply();
                                    }
                                }
                                , error: function (xhr) {
                                    if ($scope.oneSearchedCustomer.filialCode == -1) {
                                        $scope.oneSearchedCustomer.filialCode = undefined;
                                    }
                                    console.log("error");
                                    console.log(xhr);
                                }
                            });
                        }, function () {
                            hideloading();
                            alert('Error getLeasingCustomerNumber');
                        });

                    }
                    else {
                        if ($scope.oneSearchedCustomer.firstName == "") {
                            $scope.oneSearchedCustomer.firstName = null;
                        }

                        if ($scope.oneSearchedCustomer.lastName == "") {
                            $scope.oneSearchedCustomer.lastName = null;
                        }

                        if ($scope.oneSearchedCustomer.MiddleName == "") {
                            $scope.oneSearchedCustomer.MiddleName = null;
                        }

                        if ($scope.oneSearchedCustomer.birthDate != "" && $scope.oneSearchedCustomer.birthDate instanceof Date) {
                            $scope.oneSearchedCustomer.birthDate =
                                dateFilter($scope.oneSearchedCustomer.birthDate, 'yyyy/MM/dd');
                        }


                        var customersURL = appConfig.customersURL;

                        var customersList = JSON.parse(localStorage.getItem('customersList'));
                        if (customersList != null && $scope.searchCash == true && $scope.curentPageCash != false) {
                            $scope.customersList = customersList;
                            $scope.totalRows = localStorage.getItem('totalRows');
                            $scope.maxSize = localStorage.getItem('maxSize');
                            return;
                        }
                        if ($scope.oneSearchedCustomer.filialCode == undefined) {
                            $scope.oneSearchedCustomer.filialCode = -1;
                        }

                        $.ajax({
                            url: customersURL + "/SearchCustomer/SearchCustomersSharePoint",
                            type: 'GET',
                            dataType: 'json',
                            cache: false,
                            async: true,
                            data: {
                                searchParams: JSON.stringify($scope.searchCash == true ? $scope.oneSearchedCustomerCache : $scope.oneSearchedCustomer), page: $scope.currentPage
                            },
                            xhrFields: {
                                withCredentials: false
                            },
                            success: function (response) {

                                if ($scope.oneSearchedCustomer.filialCode == -1) {
                                    $scope.oneSearchedCustomer.filialCode = undefined;
                                }

                                $scope.customersList = response.rows;

                                localStorage.setItem('customersList', JSON.stringify(response.rows));

                                $scope.totalRows = response.records;
                                localStorage.setItem('totalRows', JSON.stringify(response.records));

                                if (response.total > 5) {
                                    $scope.maxSize = 5;
                                }
                                else {
                                    $scope.maxSize = response.total;
                                }
                                localStorage.setItem('maxSize', JSON.stringify($scope.maxSize));
                                localStorage.setItem('cacheOneSearchedCustomer', JSON.stringify($scope.searchCash == true ? $scope.oneSearchedCustomerCache : $scope.oneSearchedCustomer));
                                localStorage.setItem('cacheCurrentPage', JSON.stringify($scope.currentPage));
                                if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                                    $scope.$apply();
                                }
                            }
                            , error: function (xhr) {
                                if ($scope.oneSearchedCustomer.filialCode == -1) {
                                    $scope.oneSearchedCustomer.filialCode = undefined;
                                }
                                console.log("error");
                                console.log(xhr);
                            }
                        });
                    }


                    return false;
                }
            }

            ]
        };
    }]);


