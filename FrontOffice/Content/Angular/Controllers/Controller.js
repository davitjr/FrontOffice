validate = function ($scope, data) {
    var val = true;

    switch (data.ResultCode) {
        case 1:
            val = true;
            $scope.error = data.Errors;
            break;
        case 2:
            $scope.error = data.Errors;
            val = false;
            break;
        case 3:
            $scope.error = data.Errors;
            val = false;
            break;
        case 4:
            $scope.error = data.Errors;
            val = false;
            break;
        case 5:
            $scope.error = data.Errors;
            val = true;
            break;
        case 6:
            $scope.validateWarnings = data.Errors;
            val = false;
            break;
        case 7:
            $scope.infos = data.Errors;
            val = true;
            break;
        case 8:
            $scope.infos = data.Errors;
            val = true;
            break;
        case 9:
            $scope.values = data.Errors;
            val = true;
            break;
        case 14:
            $scope.values = data.Errors;
            val = true;
            break
        default:
            $scope.error = data.Errors;
            break;
    }

    $scope.ResultCode = data.ResultCode;
    return val;
}

showloading = function () {
    document.getElementById("Loader").classList.remove("hidden");
}
hideloading = function () {
    document.getElementById("Loader").classList.add("hidden");
}

generateUUID=function () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

FillCombo = function (data) {
    var i = 0;
    var List = [];
    for (var key in data) {
        List[i] = { id: key, desc: data[key] };
        i++;
    }
    return List;

};
showMesageBoxDialog = function (text, $scope, dialogType, $confirm, saveFunction) {

    var dialogOptions = {
        callback: function () {
            if (dialogOptions.result !== undefined) {
                cust.mncId = dialogOptions.result.whateverYouWant;
            }
        },
        result: {}
    };


    var showErrors = "";
    if ($scope.showError == true && $scope.error != undefined) {
        for (var i = 0; i < $scope.error.length; i++) {
            showErrors += $scope.error[i].Description + '<br/>';
        }
        text = '<b>' + text + '</b>' + '<br/>' + showErrors;
    }



    switch ($scope.ResultCode) {
        case 1:

            if ($scope.error.length > 0) {
                var warningsForCasher = "";
                for (var i = 0; i < $scope.error.length; i++) {
                    warningsForCasher += $scope.error[i].Description + '<br/>';
                }
                text = '<b>' + text + '</b>' + "<br/>" + warningsForCasher;
                $scope.path = undefined;
                ShowMessage(text, 'warning', $scope.path);
            }

            break;
        case 2:
            ShowMessage(text, 'error', $scope.path);
            break;
        case 3:
            ShowMessage(text, 'error', $scope.path);
            break;
        case 4:
            ShowMessage(text, 'error', $scope.path);
            break;
        case 5:
            text = "<b>Հայտը պահպանված է, սակայն սխալի պատճառով կատարված չէ:</b>";
            var errors = "";
            for (var i = 0; i < $scope.error.length; i++) {
                errors += $scope.error[i].Description + '<br/>';
            }
            text += '<br/>' + errors;
            ShowMessage(text, 'error', $scope.path);
            break;
        case 6:
            $scope.warning = "";
            for (var i = 0; i < $scope.validateWarnings.length; i++) {
                $scope.warning += (i + 1).toString() + "." + $scope.validateWarnings[i].Description + "\n";
            }
            $scope.warning += '\nՇարունակե՞լ:';
            $confirm({ title: 'Շարունակե՞լ', text: $scope.warning })
                .then(function() {
                    $scope.confirm = true;
                    saveFunction();
                });
            break;
        case 7:
            var info = "";
            for (var i = 0; i < $scope.infos.length; i++) {
                info += $scope.infos[i].Description + '\n';
            }
            ShowMessage(info, 'information', $scope.path);
            break;
        case 9:
            var info = "";
            info = $scope.valuedescription +" " +$scope.values[0].Description + '\n';

            ShowMessage(info, 'information', $scope.path);
            break;
        case 10:
            if ($scope.error.length > 0) {
                var warningsForCasher = "";
                for (var i = 0; i < $scope.error.length; i++) {
                    warningsForCasher += (i + 1).toString() + "." + $scope.error[i].Description + '<br/>';
                }
                text = '<b>' + text + '</b>' + "<br/><br/>" + warningsForCasher;
                $scope.path = undefined;
                ShowMessage(text, 'warning', $scope.path);
            }

            break;
        default:
            ShowMessage(text, 'error', $scope.path);
            break;
    }


};

function ShowPDF(response) {
    response.then(function (dt) {
        var file = new Blob([dt.data], { type: 'application/pdf' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
        hideloading();
    }, function ($scope) {
        alert('Error get Application');
        hideloading();
        showMesageBoxDialog($scope.statusText, $scope, 'error');
    }
    );
}

function ShowImage(response) {
    response.then(function (dt) {
        var file = new Blob([dt.data], { type: 'image/jpeg' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
        hideloading();
    }, function ($scope) {
        alert('Error get Application');
        hideloading();
        showMesageBoxDialog($scope.statusText, $scope, 'error');
    }
    );
}

function ShowExcel(response, fileName) {
    response.then(function (dt) {
        var blob = new Blob([dt.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        saveAs(blob, fileName + '.xls');
        hideloading();
    }, function ($scope) {
        alert('Error get Application');
        hideloading();
        showMesageBoxDialog($scope.statusText, $scope, 'error');
    }

    );
}

function ShowPDFReport(response) {
    var binary_string = window.atob(response.reportBuffer);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    var file = new Blob([bytes.buffer], { type: 'application/pdf' });
    var fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
    hideloading();
};

function ShowExcelReport(response, fileName) {
    var binary_string = window.atob(response.reportBuffer);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    var file = new Blob([bytes.buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(file, fileName + '.xls');
    hideloading();

}

$.fn.scrollTo = function (target, options, callback) {
    if (typeof options == 'function' && arguments.length == 2) { callback = options; options = target; }
    var settings = $.extend({
        scrollTarget: target,
        offsetTop: 5000,
        duration: 500,
        easing: 'swing'
    }, options);
    return this.each(function () {
        var scrollPane = $(this);
        var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
        var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
        scrollPane.animate({ scrollTop: scrollY }, parseInt(settings.duration), settings.easing, function () {
            if (typeof callback == 'function') { callback.call(this); }
        });
    });
}

function ShowToaster(msg, type) {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    toastr[type](msg);
}

function isArmenianUnicode(ew, forPoliceViolationID) {

    if (forPoliceViolationID == true && !((ew >= 1329 && ew <= 1366) || (ew >= 1377 && ew <= 1415) || (ew >= 48 && ew <= 57) || (ew >= 65 && ew <= 90) || (ew >= 97 && ew <= 122)))
        return false;

    if (ew >= 1329 && ew <= 1423)
        return true;
    if (32 <= ew && ew <= 90)
        return true;
    if (ew == 166 || ew == 167)
        return true;
    if (97 <= ew && ew <= 122)
        return true;
    if (ew == 94) //EKENG
        return true;
    if (ew == 95) //_
        return true;


    return false;
}

function CheckPasteText(e) {
    var clipText = e.clipboardData.getData("Text/Plain");
    for (var i = 0; i < clipText.length; i++) {
        if (!isArmenianUnicode(clipText[i].charCodeAt(0))) {
            return false;
        }
        else
            return true;
    }

}
//Save file to user's computer
var saveAs = saveAs || function (view) { "use strict"; if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) { return } var doc = view.document, get_URL = function () { return view.URL || view.webkitURL || view }, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"), can_use_save_link = "download" in save_link, click = function (node) { var event = new MouseEvent("click"); node.dispatchEvent(event) }, is_safari = /Version\/[\d\.]+.*Safari/.test(navigator.userAgent), webkit_req_fs = view.webkitRequestFileSystem, req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem, throw_outside = function (ex) { (view.setImmediate || view.setTimeout)(function () { throw ex }, 0) }, force_saveable_type = "application/octet-stream", fs_min_size = 0, arbitrary_revoke_timeout = 500, revoke = function (file) { var revoker = function () { if (typeof file === "string") { get_URL().revokeObjectURL(file) } else { file.remove() } }; if (view.chrome) { revoker() } else { setTimeout(revoker, arbitrary_revoke_timeout) } }, dispatch = function (filesaver, event_types, event) { event_types = [].concat(event_types); var i = event_types.length; while (i--) { var listener = filesaver["on" + event_types[i]]; if (typeof listener === "function") { try { listener.call(filesaver, event || filesaver) } catch (ex) { throw_outside(ex) } } } }, auto_bom = function (blob) { if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) { return new Blob(["\ufeff", blob], { type: blob.type }) } return blob }, FileSaver = function (blob, name, no_auto_bom) { if (!no_auto_bom) { blob = auto_bom(blob) } var filesaver = this, type = blob.type, blob_changed = false, object_url, target_view, dispatch_all = function () { dispatch(filesaver, "writestart progress write writeend".split(" ")) }, fs_error = function () { if (target_view && is_safari && typeof FileReader !== "undefined") { var reader = new FileReader; reader.onloadend = function () { var base64Data = reader.result; target_view.location.href = "data:attachment/file" + base64Data.slice(base64Data.search(/[,;]/)); filesaver.readyState = filesaver.DONE; dispatch_all() }; reader.readAsDataURL(blob); filesaver.readyState = filesaver.INIT; return } if (blob_changed || !object_url) { object_url = get_URL().createObjectURL(blob) } if (target_view) { target_view.location.href = object_url } else { var new_tab = view.open(object_url, "_blank"); if (new_tab == undefined && is_safari) { view.location.href = object_url } } filesaver.readyState = filesaver.DONE; dispatch_all(); revoke(object_url) }, abortable = function (func) { return function () { if (filesaver.readyState !== filesaver.DONE) { return func.apply(this, arguments) } } }, create_if_not_found = { create: true, exclusive: false }, slice; filesaver.readyState = filesaver.INIT; if (!name) { name = "download" } if (can_use_save_link) { object_url = get_URL().createObjectURL(blob); setTimeout(function () { save_link.href = object_url; save_link.download = name; click(save_link); dispatch_all(); revoke(object_url); filesaver.readyState = filesaver.DONE }); return } if (view.chrome && type && type !== force_saveable_type) { slice = blob.slice || blob.webkitSlice; blob = slice.call(blob, 0, blob.size, force_saveable_type); blob_changed = true } if (webkit_req_fs && name !== "download") { name += ".download" } if (type === force_saveable_type || webkit_req_fs) { target_view = view } if (!req_fs) { fs_error(); return } fs_min_size += blob.size; req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) { fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) { var save = function () { dir.getFile(name, create_if_not_found, abortable(function (file) { file.createWriter(abortable(function (writer) { writer.onwriteend = function (event) { target_view.location.href = file.toURL(); filesaver.readyState = filesaver.DONE; dispatch(filesaver, "writeend", event); revoke(file) }; writer.onerror = function () { var error = writer.error; if (error.code !== error.ABORT_ERR) { fs_error() } }; "writestart progress write abort".split(" ").forEach(function (event) { writer["on" + event] = filesaver["on" + event] }); writer.write(blob); filesaver.abort = function () { writer.abort(); filesaver.readyState = filesaver.DONE }; filesaver.readyState = filesaver.WRITING }), fs_error) }), fs_error) }; dir.getFile(name, { create: false }, abortable(function (file) { file.remove(); save() }), abortable(function (ex) { if (ex.code === ex.NOT_FOUND_ERR) { save() } else { fs_error() } })) }), fs_error) }), fs_error) }, FS_proto = FileSaver.prototype, saveAs = function (blob, name, no_auto_bom) { return new FileSaver(blob, name, no_auto_bom) }; if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) { return function (blob, name, no_auto_bom) { if (!no_auto_bom) { blob = auto_bom(blob) } return navigator.msSaveOrOpenBlob(blob, name || "download") } } FS_proto.abort = function () { var filesaver = this; filesaver.readyState = filesaver.DONE; dispatch(filesaver, "abort") }; FS_proto.readyState = FS_proto.INIT = 0; FS_proto.WRITING = 1; FS_proto.DONE = 2; FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null; return saveAs }(typeof self !== "undefined" && self || typeof window !== "undefined" && window || this.content); if (typeof module !== "undefined" && module.exports) {var exp = module.exports; exp.saveAs = saveAs} else if (typeof define !== "undefined" && define !== null && define.amd != null) { define([], function () { return saveAs }) }



convertToDouble = function (number) {
    var stringNumber = String(number);
    var index1 = stringNumber.indexOf(',');
    var index2 = stringNumber.indexOf('.');

    if (index1 == -1 && index2 == -1) {
        return parseFloat(stringNumber);
    }
    if (index1 == -1 && index2 != -1) {
        if (stringNumber.substring(index2 + 1).length > 2) {
            return parseFloat(stringNumber.replaceAll('.', ''));
        }
        else {
            return parseFloat(stringNumber);
        }
    }
    if (index1 != -1 && index2 == -1) {
        if (stringNumber.substring(index1 + 1).length > 2) {
            return parseFloat(stringNumber.replaceAll(',', ''));
        }
        else {
            return parseFloat(stringNumber);
        }
    }

    if (index1 != -1 && index2 != -1) {
        if (index1 < index2) {
            return parseFloat(stringNumber.replaceAll(',', ''));
        }
        if (index1 > index2) {
            return parseFloat(stringNumber.replaceAll('.', ''));
        }
    }


}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
}


forTotal = function (loan, utilityService) {
    if (loan) {
        var CurrentCapital = (loan.CurrentCapital != undefined) ? utilityService.formatRound(Math.abs(loan.CurrentCapital), 2) : 0;
        var OverdueCapital = (loan.OverdueCapital != undefined) ? utilityService.formatRound(Math.abs(loan.OverdueCapital), 2) : 0;
        var OutCapital = (loan.OutCapital != undefined) ? utilityService.formatRound(Math.abs(loan.OutCapital), 2) : 0;
        var CurrentRateValue = (loan.CurrentRateValue != undefined) ? utilityService.formatRound(Math.abs(loan.CurrentRateValue), 0) : 0;
        var PenaltyRate = (loan.PenaltyRate != undefined) ? utilityService.formatRound(Math.abs(loan.PenaltyRate), 0) : 0;
        var JudgmentRate = (loan.JudgmentRate != undefined) ? utilityService.formatRound(Math.abs(loan.JudgmentRate), 0) : 0;
        var InpaiedRestOfRate = (loan.InpaiedRestOfRate != undefined) ? utilityService.formatRound(Math.abs(loan.InpaiedRestOfRate), 0) : 0;
        var OverdueAmount = (loan.OverdueAmount != undefined) ? utilityService.formatRound(Math.abs(loan.OverdueAmount), 0) : 0;
        var CurrentFee = (loan.CurrentFee != undefined) ? utilityService.formatRound(Math.abs(loan.CurrentFee), 0) : 0;
        var SubsidiaCurrentRateValue = (loan.SubsidiaCurrentRateValue != undefined) ? utilityService.formatRound(Math.abs(loan.SubsidiaCurrentRateValue), 2) : 0;
        var CurrentRateValueUnused = (loan.CurrentRateValueUnused != undefined) ? utilityService.formatRound(Math.abs(loan.CurrentRateValueUnused), 2) : 0;

        loan.TotalDebt = CurrentCapital + PenaltyRate + OutCapital + CurrentRateValue + JudgmentRate + CurrentFee - SubsidiaCurrentRateValue + CurrentRateValueUnused;
        loan.TotalRate = PenaltyRate + CurrentRateValue + JudgmentRate + CurrentFee + CurrentRateValueUnused;
        loan.TotalOverdue = OverdueCapital + InpaiedRestOfRate + PenaltyRate + JudgmentRate + OverdueAmount;
        loan.TotalOverdueRate = InpaiedRestOfRate + PenaltyRate + OverdueAmount;
        loan.JudgmentRateABS = JudgmentRate;
        loan.TotalRateAMD = 0;
        loan.TotalOverdueAMD = 0;
        loan.TotalOverdueRateAMD = 0;
        if (loan.Currency != 'AMD') {
            loan.percentAMD = ((InpaiedRestOfRate + PenaltyRate + OverdueAmount) * loan.ExchangeRate).toFixed(2);
            loan.TotalDebtAMD = utilityService.formatRound(loan.TotalDebt * loan.ExchangeRate, 1);
            loan.TotalRateAMD = utilityService.formatRound(loan.TotalRate * loan.ExchangeRate, 1);
            loan.TotalOverdueAMD = utilityService.formatRound(loan.TotalOverdue * loan.ExchangeRate, 1);
            loan.TotalOverdueRateAMD = utilityService.formatRound(loan.TotalOverdueRate * loan.ExchangeRate, 1);
            loan.JudgmentRateAMD = utilityService.formatRound(loan.JudgmentRateABS * loan.ExchangeRate, 1);
        }
    }
    return loan;
};

refresh = function (orderType, product1, product2) {
    var state = location.hash.substr(3);



    switch (orderType) {
        case 1:     //Փոխանցումներ (բանկի ներսում, ՀՀ տարածքում, սեփական հաշիվների մեջ, բյուջե),Առևտրային վարկային գծի/օվերդրաֆտի տրամադրում
        case 2:     //Արտարժույթի առք/վաճառք
        case 3:     //Միջազգային փոխանցում
        case 51:    //Փոխանցումներ բանկի ներսում (կանխիկ մուտք հաշվին)
        case 52:    //Փոխանցումներ բանկի ներսում (կանխիկ ելք հաշվից)
        case 53:    //Արտարժույթի առք/վաճառք (կանխիկ)
        case 54:    //Արտարժույթի առք/վաճառք(Կանխիկ մուտք հաշվին)
        case 55:    //Արտարժույթի առք/վաճառք(Կանխիկ ելք հաշվից)
        case 56:    //Կանխիկ փոխանցում
        case 65:    //Արտարժույթի առք/վաճառք(Բանկի ներսում)
        case 15:    //Կոմունալ վճարում
        case 83:    //Քարտի սպասարկման միջնորդավճարի գանձում
        case 71:    //Հաճախորդին տրամադրվող ծառայությունների միջնորդավճարի գանձում
        case 95:    //Ռեեստրով փոխանցում
        case 121:   //Քարտի սպասարկման միջնորդավճարի գանձում խնդրահարույց վարկերի տարանցիկ հաշվից
        case 122:   //Ռեեստրով փոխանցում
        case 237:   //Չվճարված կենսաթոշակի/նպաստի գումար
            if ((orderType == 237 || product1.AccountType == 10 || product2.AccountType == 10 || product1.AccountType == 58 || product2.AccountType == 58 || product1.AccountType == 54 || product2.AccountType == 54
                || product1.AccountType == 115 || product2.AccountType == 115 || product1.AccountType == 118 || product2.AccountType == 118 ) && (state == 'allProducts' || state == 'currentAccounts')) {
                var refreshScope = angular.element(document.getElementById('accounts')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCurrentAccounts();

                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }

              

            }

            if (orderType != 237) {
                if (product1.AccountType == 18 && (state == 'allProducts' || state == 'currentTransitAccounts')) {
                    var refreshScope = angular.element(document.getElementById('transitAccounts')).scope();
                    refreshScope.callbackgetCustomerTransitAccounts();
                }
            }
            
            if (orderType == 237 || ((product1.AccountType == 11 || product2.AccountType == 11) && (state == 'allProducts' || state == 'cards'))) {
                var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCards();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }
            if ((product1.AccountType == 13 || product2.AccountType == 13) && (state == 'allProducts' || state == 'deposits')) {
                var refreshScope = angular.element(document.getElementById('AllDeposits')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getDeposits();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }

            if (orderType == 51) {
                var refreshScope = angular.element(document.getElementById('matureOrderForm')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getLoanCalculatedRest();
                    refreshScope.calculateLoanRest(refreshScope.Product);
                }
                refreshScope = angular.element(document.getElementById('creditlinedetails')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCreditLine();
                }
            }

            if (orderType == 83 || orderType == 121) {
                var refreshScope = angular.element(document.getElementById('customerDebtsContent')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getCustomerDebts();
                }
            }

            if ((product1.AccountType == 21 || product2.AccountType == 21) && (state == 'allProducts' || state == 'currentTransitAccounts')) {
                var refreshScope = angular.element(document.getElementById('transitAccounts')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getCustomerTransitAccounts();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }

            if (state == 'swiftmessages' || location.pathname.substr(1) =='SwiftMessages') {
                var refreshScope = angular.element(document.getElementById('SwiftMessagesForm')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getSearchedSwiftMessages();
                }
            }
            break;
        case 4: //Ավանդի դադարեցում
        case 9: //Ավանդի ձևակերպում
            if (state == 'allProducts' || state == 'currentAccounts') {
                var refreshScope = angular.element(document.getElementById('accounts')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCurrentAccounts();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }
            if (state == 'allProducts' || state == 'deposits') {
                var refreshScope = angular.element(document.getElementById('AllDeposits')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getDeposits();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }
            break;
        case 58: //Հաշիվների սպասարկման պարտք
        case 59:
        case 61:
        case 62:
            if (state == 'allProducts' || state == 'currentAccounts') {
                var refreshScope = angular.element(document.getElementById('accounts')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCurrentAccounts();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }

            if ((state == 'allProducts' || state == 'cards')) {
                var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCards();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }
            var refreshScope = angular.element(document.getElementById('customerDebtsContent')).scope();
            if (refreshScope != undefined) {
                refreshScope.getCustomerDebts();
            }
            break;
        case 7:   //Ընթացիկ հաշվի բացում
        case 12:  //Ընթացիկ հաշվի վերաբացում
        case 17:  //Հօգուտ երրորդ անձի ընթացիկ հաշվի բացում
        case 28:  //Համատեղ ընթացիկ հաշվի բացում  
        case 29:  //Ընթացիկ հաշվի փակում
            if (state == 'allProducts' || state == 'currentAccounts') {
                var refreshScope = angular.element(document.getElementById('accounts')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCurrentAccounts();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }
            break;
        case 5:     //Վարկի մարում (տոկոս, մասնակի, լրիվ)

        case 73:    //Վարկի ակտիվացում
        case 13:    //Ավանդի գրավով վարկի ձևակերպում


            //Վարկի լրիվ մարման դեպքում տեխափոխում ենք վարկերի ցուցակի մեջ
            if (state == 'allProducts' || state == 'loans') {
                var refreshScope = angular.element(document.getElementById('AllLoans')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetLoans();
                }
            }
            var refreshScope = angular.element(document.getElementById('accounts')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetCurrentAccounts();

            }
            var refreshScope = angular.element(document.getElementById('customerDebtsContent')).scope();
            if (refreshScope != undefined) {
                refreshScope.getCustomerDebts();
            }

            if (product1 == 5) {
                var refreshScope = angular.element(document.getElementById('loanJudgment')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getProductClaims(refreshScope.loan.ProductId);
                }
            }

            break;
        case 8:     //Առևտրային վարկային գծի/օվերդրաֆտի մարում
        case 74:    //Վարկային գծի ակտիվացում
        case 21:
            if (state == 'allProducts' || state == 'creditlines') {
                var refreshScope = angular.element(document.getElementById('AllCreditLines')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCreditLines();
                }
            }
            var refreshScope = angular.element(document.getElementById('accounts')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetCurrentAccounts();
            }
            break;
        case 78:    //Քարտային վարկային գծի մարում
        case 14:    //Ավանդի գրավով վարկային գծի ձևակերպում
        case 30:    //Քարտի փակում
        case 21:    //Քարտային վարկային գծի դադարեցում
            if (state == 'allProducts' || state == 'cards') {
                var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetCards();
                    var accountFlowDetailsScope =
                        angular.element(document.getElementById('accountflowdetails')).scope();
                    if (accountFlowDetailsScope != undefined) {
                        accountFlowDetailsScope.getAccountFlowDetails();
                    }
                }
            }
            var refreshScope = angular.element(document.getElementById('customerDebtsContent')).scope();
            if (refreshScope != undefined) {
                refreshScope.getCustomerDebts();
            }
            break;
        case 10: //Նոր պարբերականի ձևակերպում
        case 11: //Պարբերականի դադարեցում    
            if (state == 'allProducts' || state == 'periodicTransfers') {
                var refreshScope = angular.element(document.getElementById('AllPeriodicTransfers')).scope();
                if (refreshScope != undefined) {
                    refreshScope.GetPeriodicTransfers();
                }
            }
            if (orderType == 11) {
                if (state == 'periodicdetails') {
                    var refreshScope = angular.element(document.getElementById('periodicTransferDetails')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.callbackgetPeriodicTransfer();
                    }
                }
            }
            break;

        case 201:
            if (state == 'periodicdetails') {
                var refreshScope = angular.element(document.getElementById('periodicTransferDetails')).scope();
                if (refreshScope != undefined) {
                    refreshScope.periodic = null;
                    refreshScope.getPeriodicTransfer(refreshScope.productId);
                }
            }
            break;

        case 50: //Հաշվի տվյալնների խմբագրում     
        case 124 : //Հաշվի տվյալնների խմբագրում     
            var refreshScope = angular.element(document.getElementById('accountDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.getAccountAdditionalDetails(product1);
                if (orderType == 50 && product1.AccountType==116) {
                    refreshScope.getBankruptcyManager(product1.AccountNumber);
                }
            }
            break;

        case 66: //Հաշվի սառեցում 
            var refreshScope = angular.element(document.getElementById('accountFreezeHistoryDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.getAccountFreezeHistory(product1);
            }
            break;
        case 67: //Հաշվի ապասառեցում
            var refreshScope = angular.element(document.getElementById('accountFreezeHistoryDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.getAccountFreezeHistory(product1);
            }
            break;
        case 69:    //HB ակտիվացման հայտ
            if (state == 'allProducts') {
                var customerScope = angular.element(document.getElementById('customerNew')).scope();
                if (customerScope != undefined) {
                    customerScope.hasACBAOnline();
                }
                var HBScope = angular.element(document.getElementById('HBRequests')).scope();
                if (HBScope != undefined) {
                    HBScope.getHBRequests();
                }
                if (product1 != undefined) {
                    if (product1.AccountType == 10) {
                        var refreshScope = angular.element(document.getElementById('accounts')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.callbackgetCurrentAccounts();
                        }
                    }
                    if (product1.AccountType == 11) {
                        var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.callbackgetCards();
                        }
                    }
                }
            }
            break;

        case 81: //Տարանցիկից ելք փոխարկումով, փոխանցման ձևակերպում
        case 82: //Տարանցիկից ելք փոխարկումով, փոխանցման ձևակերպում
        case 84://Տարանցիկից ելք , փոխանցման ձևակերպում
        case 85://Տարանցիկից ելք , փոխանցման ձևակերպում
        case 79://Ստացված արագ փոխանցում
        case 145://Ստացված արագ փոխանցում
            if (product1 != undefined && (orderType == 79 || orderType == 145)) {
                var refreshScope = angular.element(document.getElementById('TransferCalls')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getTransferCalls();
                }
            }
            else {
                var refreshScope = angular.element(document.getElementById('Transfers')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getTransfers();
                }
            }
            break;
        case 87: //Սպասարկման վարձի գանձման նշում
            {
                var refreshScope = angular.element(document.getElementById('servicePaymentNoteDetails')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getServicePaymentNoteList();
                }
                break;
            }


        case 89:  //Կենսաթոշակ ստանլու դիմում
        case 91:  //Կենսաթոշակ ստանլու դիմումի ակտիվացում
        case 92:  //Կենսաթոշակ ստանլու դիմումի հեռացում
        case 93:  //Կենսաթոշակի ստացման դադարեցում
        case 94:  //Կենսաթոշակի ստացման վերագրանցում
            var refreshScope = angular.element(document.getElementById('PensionApplications')).scope();
            if (refreshScope != undefined) {
                refreshScope.getPensionApplicationHistory();
            }

            break;
        case 96:
        case 97:
            {
                var refreshScope = angular.element(document.getElementById('TransferCallContractDetails')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getTransferCallContracts();
                }
                break;
            }



        case 98:  // Պահատուփի դիմում
        case 99:  // Պահատուփի ակտիվացման հայտ
        case 100: // Պահատուփի հեռացման հայտ
        case 101: // Պահատուփի դադարեցման հայտ
        case 104: // Պահատուփի տուժանքի մարում
        case 105: // Կանխիկ պահատուփի տուժանքի մարում
            {
                var refreshScope = angular.element(document.getElementById('AllDepositCases')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getDepositCases();
                    refreshScope.getUserFilialCode();
                }


                if (orderType == 99 || orderType == 104) {
                    if (state == 'allProducts' || state == 'currentAccounts') {
                        var refreshScope = angular.element(document.getElementById('accounts')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.callbackgetCurrentAccounts();
                            var accountFlowDetailsScope =
                                angular.element(document.getElementById('accountflowdetails')).scope();
                            if (accountFlowDetailsScope != undefined) {
                                accountFlowDetailsScope.getAccountFlowDetails();
                            }
                        }
                    }

                    if ((state == 'allProducts' || state == 'cards')) {
                        var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                        if (refreshScope != undefined) {
                            refreshScope.callbackgetCards();
                            var accountFlowDetailsScope =
                                angular.element(document.getElementById('accountflowdetails')).scope();
                            if (accountFlowDetailsScope != undefined) {
                                accountFlowDetailsScope.getAccountFlowDetails();
                            }
                        }
                    }
                }

                break;
            }
        case 107:
        case 108:
        {

                var refreshScope = angular.element(document.getElementById('AllInsurances')).scope();

                if (refreshScope != undefined) {
                    refreshScope.getInsurances();
                }
                if (state == 'allProducts' || state == 'currentAccounts') {
                    var refreshScope = angular.element(document.getElementById('accounts')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.callbackgetCurrentAccounts();
                        var accountFlowDetailsScope =
                            angular.element(document.getElementById('accountflowdetails')).scope();
                        if (accountFlowDetailsScope != undefined) {
                            accountFlowDetailsScope.getAccountFlowDetails();
                        }
                    }
                }
                if ((state == 'allProducts' || state == 'cards')) {
                    var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.callbackgetCards();
                        var accountFlowDetailsScope =
                            angular.element(document.getElementById('accountflowdetails')).scope();
                        if (accountFlowDetailsScope != undefined) {
                            accountFlowDetailsScope.getAccountFlowDetails();
                        }
                    }
                }
                break;
            }
        case 214: //Քարտի հեռացման հայտ
        case 220: //Հաշվի հեռացման հայտ
        case 103:
            {
                if (state == 'allProducts' || state == 'cards') {
                    var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.callbackgetCards();
                        var accountFlowDetailsScope =
                            angular.element(document.getElementById('accountflowdetails')).scope();
                        if (accountFlowDetailsScope != undefined) {
                            accountFlowDetailsScope.getAccountFlowDetails();
                        }
                    }
                }
                break;
            }

        case 112:  //Քարտի տվյալների փոփոխման հայտ
        case 114: //Քարտի սպասարկման վարձի գրաֆիկի տվյալների փոփոխման հայտ
        case 115: //Քարտի սպասարկման վարձի գրաֆիկի հեռացման հայտ
            {
                var refreshScope = angular.element(document.getElementById('cardServiceFeeDetails')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getCardServiceFee(refreshScope.productid);
                    refreshScope.getCardServiceFeeGrafik();
                }
                var refreshScope = angular.element(document.getElementById('cardTariffDetails')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getCardTariff(refreshScope.productid);
                }
                break;
            }
        case 119:
        case 120:
            {
                var refreshScope = angular.element(document.getElementById('hbUserDetails')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getHBUsers();
                }
                break;
            }
        case 125:
        case 129:
            {
                if (state == 'cardDetails') {
                    var refreshScope = angular.element(document.getElementById('cardDetails')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.card = null;
                        var productId = refreshScope.plasticCard.ProductId;
                        refreshScope.plasticCard = null;
                        refreshScope.getCard(productId);
                        refreshScope.getCardStatus(productId);
                        sessionStorage.setItem('card', productId);

                    }

                }
                break;
            }
        case 130: //Լիազորագրի դադարեցում    
        case 168:
        case 169:
            if (state == 'allProducts' || state == 'credentials') {
                var refreshScope = angular.element(document.getElementById('AllCredentials')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getCredentials();
                }
            }
            break;
        case 63://Փոխանցում տարանցիկ հաշվին
        case 184://Փոխանցում տարանցիկ հաշվին
        case 80://Փոխանցում տարանցիկ հաշվին
        case 185://Փոխանցում տարանցիկ հաշվին
            var refreshScope = angular.element(document.getElementById('matureOrderForm')).scope();
            if (refreshScope != undefined) {
                refreshScope.getOperationSystemAccount();
            }
        case 156: //Ակրեդիտիվի դադարեցում
            var refreshScope = angular.element(document.getElementById('accreditiveDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.accreditive = null;
                refreshScope.getAccreditive(refreshScope.productId);
            }
            break;
        case 136://Փոխանցում տարանցիկ հաշվին
            var refreshScope = angular.element(document.getElementById('cardDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.getCardStatus(refreshScope.productid);
            }
        case 141:
            if ((state == 'allProducts' || state == 'paidGuarantees')) {
                var refreshScope = angular.element(document.getElementById('AllPaidGuarantees')).scope();
                if (refreshScope != undefined) {
                    refreshScope.callbackgetPaidGuarantees();
                }
            }
            var refreshScope = angular.element(document.getElementById('accounts')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetCurrentAccounts();

            }
            break;

        case 161:
        case 163:
            {
                if (state == 'allProducts' || state == 'cards') {
                    var refreshScope = angular.element(document.getElementById('AllCards')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.getCards();
                        var accountFlowDetailsScope =
                            angular.element(document.getElementById('accountflowdetails')).scope();
                        if (accountFlowDetailsScope != undefined) {
                            accountFlowDetailsScope.getAccountFlowDetails();
                        }
                    }
                }
                var refreshScope = angular.element(document.getElementById('loanApplicationDetailsForm')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getLoanApplication(refreshScope.loanApplication.ProductId);
                }

                var refreshScope = angular.element(document.getElementById('AllApplications')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getLoanApplications();
                }
                break;
            }

        case 160:
        case 162:
            {

                var refreshScope = angular.element(document.getElementById('loanApplicationDetailsForm')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getLoanApplication(refreshScope.loanApplication.ProductId);
                }

                var refreshScope = angular.element(document.getElementById('AllApplications')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getLoanApplications();
                }

                break;
            }
        case 164:
            var refreshScope = angular.element(document.getElementById('AllHbApplication')).scope();
            if (refreshScope != undefined) {
                refreshScope.getHBApplication();
            }
            break;
        case 165:
            var refreshScope = angular.element(document.getElementById('depositCaseDetails')).scope();
            if (refreshScope != undefined)
            {
                refreshScope.depositcase = null;
                refreshScope.getDepositCase(refreshScope.productId);
            }
            break;
        case 166:
            var refreshScope = angular.element(document.getElementById('PhoneBankingContract')).scope();
            if (refreshScope != undefined) {
                refreshScope.getPhoneBankingContract();
                refreshScope.hasPBRequests = false;
            }
            break;
        case 173:
            {


                if (state == 'accountdetails') {
                    var refreshScope = angular.element(document.getElementById('accountDetails')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.getDemandDepositRate(refreshScope.account);
                    }
                }
                break;
            }
        case 174: // MR ծրագրի գրանցման հայտ
        case 176: // MR ծրագրի սպասարկման վարձի գանձման հայտ
        case 177: // MR ծրագրի վերաթողարկման հայտ
        case 178: // MR ծրագրի դադարեցման հայտ
            {
                if (state == 'cardDetails') {
                    var refreshScope = angular.element(document.getElementById('CardMembershipRewardsDiv')).scope();
                    if (refreshScope != undefined) {
                        refreshScope.getCardMembershipRewards(refreshScope.cardnumber);
                    }
                }
                break;
            }
        case 175:
        case 179:
        case 180:
            {
                var refreshScope = angular.element(document.getElementById('productNotificationConfigurations')).scope();
                if (refreshScope != undefined) {
                    refreshScope.getProductNotificationConfigurations(refreshScope.productid);
                }

                break;
            }

        case 181://Քարտի USSD ծառայության գրանցման հայտ
            var refreshScope = angular.element(document.getElementById('cardDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.getCardUSSDService(refreshScope.productId);
            }





        case 171:
        case 172:
            var refreshScope = angular.element(document.getElementById('creditlinedetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetCreditLine();
            }
            var refreshScope = angular.element(document.getElementById('loandetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetLoan();
            }
            var refreshScope = angular.element(document.getElementById('guaranteedetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetGuarantee();
            }
            var refreshScope = angular.element(document.getElementById('accreditiveDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetAccreditive();
            }
            var refreshScope = angular.element(document.getElementById('paidguaranteedetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetPaidGuarantees();
            }
            var refreshScope = angular.element(document.getElementById('paidAccreditiveDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetPaidAccreditive();
            }

        case 186: //Պարտատոմսի վաճառքի հայտի մուտքագրում
            var refreshScope = angular.element(document.getElementById('bonds')).scope()
            if (refreshScope != undefined) {
                refreshScope.filter = {
                    Quality: 0,
                    ISIN: ""
                };
                refreshScope.QualityFilter = '100';
       
                refreshScope.getBonds();
            }
            break;
        case 189: //Պարտատոմսի կարգավիճակի փոփոխման հայտի մուտքագրում
            window.location.href = location.origin.toString() + '/#!/bonds';
            break;
        case 191:
            var refreshScope = angular.element(document.getElementById('BondDealing')).scope()
            if (state == 'allProducts' || state == 'depositaryAccount') {
                var refreshScope2 = angular.element(document.getElementById('depositaryAccount')).scope();
                if (refreshScope2 != undefined) {
                    refreshScope2.getCustomerDepositaryAccounts();
                    refreshScope2.getCustomerDepositaryAccount();
                }
            }         
            else if (refreshScope != undefined)
           {
                refreshScope.getBondsForDealing(refreshScope.filter);
            }
            break;
          
            //window.location.href = location.origin.toString() + '/#!/depositaryAccount'
            
        case 194:   //  Պարտատոմսի գումարի գանձման հայտ
            var refreshScope = angular.element(document.getElementById('BondDetails')).scope();
            break;
        case 188: //3DSecure ծառայության ակտիվացում/դադարեցում
            var refreshScope = angular.element(document.getElementById('cardDetails')).scope()
            if (refreshScope != undefined) {
                refreshScope.getCard3DSecureService(product1);
            }
            break;
        case 188: //3DSecure ծառայության ակտիվացում/դադարեցում
            var refreshScope = angular.element(document.getElementById('cardDetails')).scope()
            if (refreshScope != undefined) {
                refreshScope.getCard3DSecureService(product1);
            }
            break;
        case 171:
        case 172:
            var refreshScope = angular.element(document.getElementById('creditlinedetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetCreditLine();
            }
            var refreshScope = angular.element(document.getElementById('loandetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetLoan();
            }
            var refreshScope = angular.element(document.getElementById('guaranteedetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetGuarantee();
            }
            var refreshScope = angular.element(document.getElementById('accreditiveDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetAccreditive();
            }
            var refreshScope = angular.element(document.getElementById('paidguaranteedetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetPaidGuarantees();
            }
            var refreshScope = angular.element(document.getElementById('paidAccreditiveDetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.callbackgetPaidAccreditive();
            }
            break;
        case 203: //Վարկի տվյալների փոփոխման հայտ
            var refreshScope = angular.element(document.getElementById('loanDataChangeForLoanEarlyMature')).scope();
            if (refreshScope != undefined) {
                refreshScope.existsLoanProductDataChange(refreshScope.loan.ProductId);
            }
            break;
        case 6:
            var refreshScope = angular.element(document.getElementById('HBDocuments')).scope();
            if (refreshScope != undefined) {
                refreshScope.refreshInfos();
            }
            break;
			
		case 224:
			var refreshScope = angular.element(document.getElementById('virtualCards')).scope();
			if (refreshScope != undefined) {
				refreshScope.getVirtualCards(refreshScope.productid);
            }
            break;
        case 229://Վարկի հետաձգման հայտ
            var refreshScope = angular.element(document.getElementById('loandetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.getLoanRepaymentDelayDetails(refreshScope.productId);
            }
            var refreshScopeCreditLine = angular.element(document.getElementById('creditlinedetails')).scope();
            if (refreshScopeCreditLine != undefined) {
                refreshScopeCreditLine.getLoanRepaymentDelayDetails(refreshScopeCreditLine.productid);
            }
        case 230://Հետաձգված հայտի չեղարկման հայտ
            var refreshScope = angular.element(document.getElementById('loandetails')).scope();
            if (refreshScope != undefined) {
                refreshScope.getLoanRepaymentDelayDetails(refreshScope.productId);
            }
            break;
        case 231: //Պարտատոմսի կարգավիճակի փոփոխման հայտի մուտքագրում
            window.location.href = location.origin.toString() + '/#!/PensionPaymentDetails';
            break;
        case 'RefreshLoanRepaymentFromCardDataChange':
            var refreshScope = angular.element(document.getElementById('GetLoanRepaymentFromCardDataChangeHistory')).scope();
            if (refreshScope != undefined) {
                refreshScope.GetLoanRepaymentFromCardDataChangeHistory(refreshScope.appid);
            }
            break;

        case 'isAlias'://Հետաձգված հայտի չեղարկման հայտ
            var refreshScope = angular.element(document.getElementById('aliasHistory')).scope();
            if (refreshScope != undefined) {
                refreshScope.GetVisaAliasHistory(refreshScope.$parent.cardNumber);
            }
            break;
        default:
            break;

    }

    if (state == 'accountdetails') {
        var refreshScope = angular.element(document.getElementById('accountDetails')).scope();
        if (refreshScope != undefined) {
            if (orderType == 12) {
                refreshScope.callbackgetCurrentAccountAfterReopenAccount();
            }
            else {
                refreshScope.callbackgetCurrentAccount();

            }
        }

        var refreshAccountStatementScope = angular.element(document.getElementById('accountStatement')).scope();
        if (refreshAccountStatementScope != undefined) {
            refreshAccountStatementScope.getAccountStatement(refreshAccountStatementScope.$parent.accountnumber);
        }

    }
    if (state == 'depositdetails') {
        var refreshScope = angular.element(document.getElementById('depositdetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.callbackgetDeposit();
        }
    }
    if (state == 'cardDetails' && orderType != 125 && orderType != 129) {
        var refreshScope = angular.element(document.getElementById('cardDetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.card.CreditLine = null;
            refreshScope.getCard(refreshScope.card.ProductId);
        }
        if (orderType == 83 || orderType == 121) {
            var refreshCardServiceFeeDetailsScope =
                angular.element(document.getElementById('cardServiceFeeDetails')).scope();
            if (refreshCardServiceFeeDetailsScope != undefined) {
                refreshCardServiceFeeDetailsScope.getCardServiceFee(refreshScope.productid);
            }
        }



        var refreshcardStatementScope = angular.element(document.getElementById('cardStatement')).scope();
        if (refreshcardStatementScope != undefined) {
            refreshcardStatementScope.getcardStatement(refreshcardStatementScope.card);
        }


    }
    if (state == 'creditLineDetails') {
        var refreshScope = angular.element(document.getElementById('creditlinedetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.callbackgetCreditLine();
        }
    }
    if (state == 'loanDetails') {
        var refreshScope = angular.element(document.getElementById('loandetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.callbackgetLoan();
        }
    }
    if (state == 'Orders') {
        var refreshScope = angular.element(document.getElementById('AllOrders')).scope();
        if (refreshScope != undefined) {
            refreshScope.getOrders();
        }
    }

    var notificationScope = angular.element(document.getElementById('NotificationPanel')).scope();
    if (notificationScope != undefined) {
        notificationScope.getNotConfirmedOrders();
    }

    if (state == 'paidFactoringDetails') {
        var refreshScope = angular.element(document.getElementById('paidFactoringDetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.paidFactoring = null;
            refreshScope.getPaidFactoring(refreshScope.productId);
        }
    }
    if (state == 'paidGuaranteeDetails') {
        var refreshScope = angular.element(document.getElementById('paidguaranteedetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.callbackgetPaidGuarantee();
        }
    }

    if (state == 'factoringDetails') {
        var refreshScope = angular.element(document.getElementById('factoringdetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.callbackgetFactoring();
        }
    }
    if (state == 'guaranteeDetails') {
        var refreshScope = angular.element(document.getElementById('guaranteedetails')).scope();
        if (refreshScope != undefined) {
            refreshScope.callbackgetGuarantee();
        }
    }



}

refreshByPreOrderType = function (preOrderType) {
    var state = location.hash.substr(2);
    if (state == 'ImageCarousel') {
        var scope = angular.element(document.getElementById('sessionpropertie')).scope();
        if (scope != undefined) {
            if (scope.currentUrl != undefined) {
                state = scope.currentUrl;
            }
        }
    }
    switch (preOrderType) {
        case 1:
            var refreshScope = angular.element(document.getElementById('CreditHereAndNow')).scope();
            if (refreshScope != undefined) {
                refreshScope.getSearchedCreditsHereAndNow();
            }
            refreshScope = angular.element(document.getElementById('AllPreOrders')).scope();
            if (refreshScope != undefined) {
                refreshScope.getSearchedPreOrderDetails();
            }
            break;
        case 2:
        case 3:
            var refreshScope = angular.element(document.getElementById('ClassifiedLoan')).scope();
            if (refreshScope != undefined) {
                refreshScope.getSearchedClassifiedLoans();
            }
            refreshScope = angular.element(document.getElementById('AllPreOrders')).scope();
            if (refreshScope != undefined) {
                refreshScope.getSearchedPreOrderDetails();
            }
            break;
    }

}

validateResultList = function ($scope, data) {
    var val = true;
    var i = 0;

    for (var i = 0; i < data.length ; i++)
    {
        switch (data[i].ResultCode) {
            case 4:
                $scope.error = $scope.error.concat(data[i].Errors);
                val = false;
                $scope.showErrors = true;
                break;
            case 2:
                $scope.error = $scope.error.concat(data[i].Errors);
                val = false;
                $scope.showErrors = true;
                break;
            case 5:
                $scope.error = $scope.error.concat(data[i].Errors);
                val = false;
                $scope.showErrors = true;
                break;
        }

    }

    return val;
}

$.ajaxSetup({
    headers: { 'SessionId': sessionStorage.getItem('sessionId') === null ? '' : sessionStorage.getItem('sessionId') }
});


Array.prototype.equals = function (arr1) {
    var arr2 = this;

    arr1 = arr1.sort(function(a, b) { return a - b; });
    arr2 = arr2.sort(function(a, b) { return a - b; });
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

groupBy = function groupBy(collection, property) {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}

function ShowWord(response, fileName) {
    response.then(function (dt) {
        var blob = new Blob([dt.data], {
            type: 'application/doc'
        });
        saveAs(blob, fileName + '.doc');
    }, function ($scope) {
        alert('Error get Application');
        showMesageBoxDialog($scope.statusText, $scope, 'error');
    }

    );
}

