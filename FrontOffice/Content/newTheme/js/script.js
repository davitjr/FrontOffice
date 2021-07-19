//doc ready function
$(document).ready(function () {


    //------------- Bootstrap tooltips -------------//
    $("[data-toggle=tooltip]").tooltip({ container: 'body' });
    $(".tip").tooltip({ placement: 'top', container: 'body' });
    $(".tipR").tooltip({ placement: 'right', container: 'body' });
    $(".tipB").tooltip({ placement: 'bottom', container: 'body' });
    $(".tipL").tooltip({ placement: 'left', container: 'body' });
    //------------- Bootstrap popovers -------------//
    $("[data-toggle=popover]").popover();

});

//--------------------------//
function RenderAdvancedSearch() {
		var e = document.getElementById("advanced-search-arrow"); 
		if(e.classList.contains('fa-angle-double-down'))
		{
			e.classList.remove('fa-angle-double-down');
			e.classList.add('fa-angle-double-up');
			document.getElementById("display-advanced-search").style.display = "block";
			
		}
		else
		{
			e.classList.add('fa-angle-double-down');
			e.classList.remove('fa-angle-double-up');
			document.getElementById("display-advanced-search").style.display = "none";
		}
	}

function ShowLogoutContainer()
{ 
    var container = document.querySelector("#LogoutContainer");
    
    if ($(LogoutContainer).is(":hidden"))
        {
                $(LogoutContainer).slideDown(400);
                container.style.top = "50px";
                container.style.right = "0px";
				
        }
        else
        {
                  $(LogoutContainer).hide(400);
        }
}

function ShowNotifications(){
 /* $('#notificationPanel').toggleClass('hide-notificationPanel'); */
		 if ($('#NotificationPanel').hasClass('hide-notificationPanel'))
		 {
			$('#NotificationPanel').removeClass('hide-notificationPanel');
		    $('#notificationNavBar').removeClass('navbar-item-clicked');
		 }
		 else
		 {
			$('#NotificationPanel').addClass('hide-notificationPanel');
			$('#notificationNavBar').addClass('navbar-item-clicked');
		 }
	}
	
	
function RemoveMessage(sourceElement) {
		 /* $(sourceElement).parent('li').remove(); */
		 $(sourceElement).closest('li').css('display','none'); 
		 $(sourceElement).closest('li').addClass('read');
		 $(sourceElement).closest('li').removeClass('new');
		  var countElement = $('.js-count');
          var prevCount = +countElement.attr('data-count');
          var newCount = prevCount - 1;
          countElement.attr('data-count', newCount).html(newCount);
            if (newCount === 0) {
                countElement.remove();
                $('.js-notifications').addClass('empty');
            }
    }
function DisplayAllMessages() {

    $('li').each(function() {
        if ($(this).hasClass('read')) {
            $(this).css('display', 'block');
        }
    });
}



// Հեղինակ: Տիգրան Սիմոնյան 16.02.2016թ.
function SlideApplicationAreas() {
	var contentContainer = document.querySelector('.application-area-wrapper');
	if (contentContainer) {
		if ($('.application-area-wrapper').css('display') != "none") {
			$('.application-area-wrapper').hide('slide', { direction: "up" }, 500);
			document.querySelector(".overlay").classList.add("display-none");
		}
		else {
			$('.application-area-wrapper').show('slide', { direction: "up" }, 500);
			document.querySelector(".overlay").classList.remove("display-none");
		}
	}
}

function AddZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}



function AddNewNote(){
	var d = new Date();
    var day = AddZero(d.getDate());
    var month = AddZero(d.getMonth()+1);
    var year = AddZero(d.getFullYear());
    var h = AddZero(d.getHours());
    var m = AddZero(d.getMinutes());
    var s = AddZero(d.getSeconds());
    var date = day + "/" + month + "/" + year.toString().substr(2,2) + " (" + h + ":" + m + ")"  ;
	
	var notText = $("#note-text").val();
	toastr8.twitter({
			message:notText, 
			title:date,
			employee:"Մեսրոպ Ավետիսյան",
			iconClass:"fa fa-info"
		});
	$("#note-text").val("");
	HideNoteInput();
}

function HideNoteInput(){
	if(document.getElementById("noteInput").classList.contains("display-none"))
	{
		$("#noteInput").removeClass("display-none");
		document.getElementById("noteCollapse").style.backgroundPosition="0px -72px";
	}
	else
	{
		$("#noteInput").addClass("display-none");
		document.getElementById("noteCollapse").style.backgroundPosition="0px 0px";
	}
}
function ZoomInAnimate(element){
	var type="#" + element.classList[0] + "Div";
	var openDiv="zoomIn";
		
	$("#subItems > div").addClass("display-none");
	$(type).removeClass("display-none");
		
	if($(type).hasClass(openDiv)){
		
		$(type).removeClass(openDiv);
		$(type).addClass("display-none");
	}
	else
	{
		$(type).removeClass("display-none");
		$(type).addClass(openDiv);
	}
}

function ShowContacts(){
	$(".contactListCollaps").toggleClass(" fa-chevron-circle-down  fa-chevron-circle-up");
	$(".contactList").toggleClass("display-none");
}

function ShowHideCompleteMessage(element){
	var notificationTextElement = element.parentNode.parentNode.querySelector(".notification-text");
	$(notificationTextElement).toggleClass("text-truncate");
	if(element.classList.contains("fa-angle-down"))
	{
		element.classList.remove("fa-angle-down");
		element.classList.add("fa-angle-up");
	}
	else{
		element.classList.remove("fa-angle-up");
		element.classList.add("fa-angle-down");
	}
}

function ShowHideCompleteNote(element){
	$(element).closest('tr').find("div.ellipsis-multiline").toggleClass("multiline");
	if(element.classList.contains("fa-angle-down"))
	{
		element.classList.remove("fa-angle-down");
		element.classList.add("fa-angle-up");
	}
	else{
		element.classList.remove("fa-angle-up");
		element.classList.add("fa-angle-down");
	}
}

function ShowHideMainMenu() {
		if ($('.full-screen-nav-content').css('display') != "none") {
			$('.full-screen-nav-content').hide('slide', { direction: "up" }, 500);
		}
		else {
			$('.full-screen-nav-content').show('slide', { direction: "up" }, 500);
		}
}

// Հեղինակ: Տիգրան Սիմոնյան 16.03.2016թ.
function ShowHideSidebarItem(itemIDSelector)
{
	var isSidebarShown = false;
	var slideSideBar = false;
	var isItemShown = false;
	var leftSidebarWidth=340;
	var rightSidebarWidth=270;
	var widthCorrection=0;
	
	if($(".left-sidebar").css('display')!="none")
	{
		isSidebarShown = true;
	}
	
	if(isSidebarShown == false)
	{
		slideSideBar = true;
	}
	else if($(itemIDSelector).css('display')!="none")
	{
		slideSideBar = true;
	}
	
	if($(itemIDSelector).css('display')!="none")
	{
		isItemShown = true;
	}

	if(!slideSideBar && isItemShown == false)
	{
	    $(itemIDSelector).css('display','block');
		
		var itemList = [];
		itemList = document.querySelectorAll(".sidebar-item");
		for(var i=0; i<=itemList.length-1; i++) 
		{
			if(itemList[i].id != itemIDSelector.substring(1, itemIDSelector.length))
			{
				$(itemList[i]).css('display','none');
				
			}
		}
	}
	
	if(slideSideBar == true)
	{
		var isRightSideBarShown = false;
		if($(".right-sidebar").css('display')!="none")
		{
			isRightSideBarShown = true;
		}
		
		if(isRightSideBarShown)
		{
			widthCorrection = rightSidebarWidth;
		}
		
		
		if(isSidebarShown)
		{
			$('.left-sidebar').hide('slide', { direction: "left" }, 500);
			setTimeout(function(){
				$(".content-container").css("width", "calc(100% - " + widthCorrection + "px)");
			}, 500);
		}
		else{
			widthCorrection = widthCorrection + leftSidebarWidth;
			$(".content-container").css("width", "calc(100% - " + widthCorrection + "px)");
			$('.left-sidebar').show('slide', { direction: "left" }, 500);
		}
	}
		if(itemIDSelector == "#CustomerData")
			{
			  $(".personalData").toggleClass("navbar-item-clicked");
			}
			else{
			  $(".personalData").removeClass("navbar-item-clicked");
			}
		if(itemIDSelector == "#SearchPanel")
			{
			  $("#searchAreaWrapper").toggleClass("navbar-item-clicked");
			}
			else{
			  $("#searchAreaWrapper").removeClass("navbar-item-clicked");
			}
			
}

// Հեղինակ: Տիգրան Սիմոնյան 16.03.2016թ.
function ShowHideRightSidebar(){
	var isSidebarShown = false;
	var leftSidebarWidth=340;
	var rightSidebarWidth=270;
	var widthCorrection=0;
	
	if($(".right-sidebar").css('display')!="none")
	{
		isSidebarShown = true;
	}
	
	var isLeftSideBarShown = false;
	if($(".left-sidebar").css('display')!="none")
	{
		isLeftSideBarShown = true;
	}
		
		if(isLeftSideBarShown)
		{
			widthCorrection = leftSidebarWidth;
		}
		
		if(isSidebarShown)
		{
			
			$('.right-sidebar').hide('slide', { direction: "right" }, 500);
			setTimeout(function(){
				$(".content-container").css("width", "calc(100% - " + widthCorrection + "px)");
			}, 500);
			$('#toggle-right-sidebar').toggleClass('navbar-item-clicked');
		}
		else{
			widthCorrection = widthCorrection + rightSidebarWidth;
			$(".content-container").css("width", "calc(100% - " + widthCorrection + "px)");
			$('.right-sidebar').show('slide', { direction: "right" }, 500);
			$('#toggle-right-sidebar').toggleClass('navbar-item-clicked');
		}
}

function CloseProductContainer(element) {

    $(element).closest(".product-container").css("display", "none");
}

function CollapseProductContainer(element) {
    $(element).toggleClass(" fa-chevron-down  fa-chevron-up");
    $(element).parents("div.product-container").find(".product-collapsable-section").toggleClass("display-none");
   
}

function CollapseDebtsContainer(element) {
    $("#customerDebtsIcon").toggleClass(" customerDebtsButtonActive  customerDebtsButtonInactive");
    $("#fullCustomerDebts").toggleClass("display-none");
}

//Տ. Սիմոնյան, 22.03.2016
function CloseBPDialog(dialogID) {
    var dialog = document.querySelector('#' + dialogID);
    $('#' + dialogID).hide();
    dialog.parentNode.removeChild(dialog);

    if (document.querySelector('.bp-dialog-overlay')) {
        $('.bp-dialog-overlay').css("display", "none");
    }

    var refreshScope = angular.element(document.getElementById('sessionpropertie')).scope();
    if (refreshScope != undefined) {
        refreshScope.$root.openedView.splice(refreshScope.$root.openedView.indexOf(dialogID + '_isOpen'), 1);
    }

    return false;
}

//Տ. Սիմոնյան, 22.03.2016
function MaximizeBPDialog(dialogID) {
    var dialog = document.querySelector('#' + dialogID);
    if (dialog.style.width = "100%" && dialog.style.height == "100%") {
        dialog.style.width = dialog.getAttribute('data-initial-width');
        dialog.style.height = dialog.getAttribute('data-initial-height');
        dialog.style.top = "60px";
        dialog.style.left = "calc(50% - " + dialog.style.width + "/2)";
    }
    else {
        dialog.style.width = "100%";
        dialog.style.height = "100%";
        dialog.style.top = "0px";
        dialog.style.left = "0px";
    }
}

function MinimizeBPDialog(dialogID) {
    var parentDialogId = "#" + dialogID;
    var minimizedDialogHTML = '<div class="minimized-dialog tip" data-original-title="' +
        document.querySelector(parentDialogId).getAttribute('data-dialog-name') +
        '" data-dialog-id=' +
        dialogID +
        ' onclick="RestoreWindow(this)"><div class="minimized-dialog-icon"></div>' +
        '<div class="minimized-dialog-lable">' +
        document.querySelector(parentDialogId).getAttribute('data-dialog-name') +
        '</div>' +
        '<div class="close-minimized-dialog" onclick="RemoveMinimizedDialog(this)"></div>' +
        '</div>';
    $(".minimized-dialog-container").css("display", "block");
    $(".footer").css("display", "none");
    $(".minimized-dialog-container").append(minimizedDialogHTML);
    //$(parentDialogId).effect("transfer", { to: $("[data-dialog-id=" + dialogID + "]") });
    $(parentDialogId).hide("slide", { direction: "down" }, 1000);
    $(".invisible-minimized-items-container").css("display", "none");
    $(".tip").tooltip({ placement: 'top', container: 'body' });
    AddOverflowButton();
}


//Տիգրան Սիմոնյան, 24.03.16 
function BPWindowClick(node) {
    var el = $(node), // այն պատուհանը որի վրա click է արվել
        max = 0;

    var boxes = $(".bp-window");

    // Որոշում ենք ամենամեծ z-index
    boxes.each(function () {
        // Գտնում ենք ընթացիկ z-index-ը
        var z = parseInt($(this).css("z-index"), 10);
        max = Math.max(max, z);
    });

    // Click արված պատուհանի z-index-ը դնում ենք max + 1
    el.css("z-index", max + 1);
}

function AddOverflowButton() {
    if ($(".minimized-dialog-container").get(0) == undefined)
    {
        $(".overflow-button").css("display", "block");
    }
    else if ($(".minimized-dialog-container").get(0).scrollWidth > 0) {
        var overflowSize = $(".minimized-dialog-container").get(0).scrollWidth - 183;
        var dialogSize = $(".minimized-dialog-container>div.minimized-dialog").length * 155;

        if (overflowSize < dialogSize) {
            $(".overflow-button").css("display", "block");
        }
    }

}

function ShowHiddenDialogs() {
    var overflowSize = $(".minimized-dialog-container").get(0).scrollWidth - 183;
    var numberOfDialogs = $(".minimized-dialog-container>div.minimized-dialog").length - 1;
    var numberOfVisibleDialogs = (overflowSize - (overflowSize % 155)) / 155;
    for (numberOfDialogs; numberOfVisibleDialogs <= numberOfDialogs ; numberOfDialogs--) {
        /* var index=numberOfDialogs-numberOfVisibleDialogs; */
        $(".minimized-dialog-container> div.minimized-dialog:nth-child(" + numberOfDialogs + ")").detach().appendTo(".invisible-minimized-items-container");

    }

    if ($(".invisible-minimized-items-container").css("display") == "none") {
        $(".invisible-minimized-items-container").css("display", "block");
    }
    else {
        $(".invisible-minimized-items-container").css("display", "none");
    }

}

function RestoreWindow(element) {

    var windowId = "#" + $(element).attr("data-dialog-id");

    if (event.target.className != "close-minimized-dialog") {
        $(windowId).show("clip", { direction: "vertical" }, 200);
        //$(element).effect("transfer", { to: $(windowId) }, 200);
        $(element).remove();
        if ($(".minimized-dialog-container>div.minimized-dialog").length < 1) {

            $(".minimized-dialog-container").css("display", "none");
            $(".footer").css("display", "block");
        }
        if ($(".invisible-minimized-items-container>div.minimized-dialog").length < 1) {

            $(".invisible-minimized-items-container").css("display", "none");
            $(".overflow-button").css("display", "none");
        }
        BPWindowClick(document.getElementById(element.getAttribute("data-dialog-id")));
        $(".tooltip").remove();
    }
}


function CheckAvailableSpaceForDialog() {
    $(".invisible-minimized-items-container").css("display", "none");
    var overflowSize = $(".minimized-dialog-container").get(0).scrollWidth - 183;
    var numberOfDialogs = $(".minimized-dialog-container>div.minimized-dialog").length;
    var numberOfVisibleDialogs = (overflowSize - (overflowSize % 155)) / 155;
    var numberOfHiddenDialogs = $(".invisible-minimized-items-container>div.minimized-dialog").length;
    if (numberOfHiddenDialogs > 0 && numberOfDialogs < numberOfVisibleDialogs) {
        var i = 0;
        var differenceOfHiddenAndAllowed = numberOfVisibleDialogs - numberOfDialogs;
        for (numberOfHiddenDialogs - 1; differenceOfHiddenAndAllowed != 0; numberOfHiddenDialogs--) {

            $(".invisible-minimized-items-container> div.minimized-dialog:nth-child(" + numberOfHiddenDialogs + ")").detach().appendTo(".minimized-dialog-container");
            differenceOfHiddenAndAllowed--;
            if ($(".invisible-minimized-items-container>div.minimized-dialog").length < 1) {

                $(".overflow-button").css("display", "none");
            }
        }
    }
    if (numberOfVisibleDialogs < numberOfDialogs) {
        AddOverflowButton();
        for (numberOfDialogs; numberOfVisibleDialogs <= numberOfDialogs ; numberOfDialogs--) {

            $(".minimized-dialog-container> div.minimized-dialog:nth-child(" + numberOfDialogs + ")").detach().appendTo(".invisible-minimized-items-container");
        }
    }
}

function RemoveMinimizedDialog(element) {
    $(element).parent().remove();
    CheckAvailableSpaceForDialog();
    if ($(".minimized-dialog-container>div.minimized-dialog").length < 1) {

        $(".minimized-dialog-container").css("display", "none");
        $(".footer").css("display", "block");
    }
    if ($(".invisible-minimized-items-container>div.minimized-dialog").length < 1) {

        $(".invisible-minimized-items-container").css("display", "none");
        $(".overflow-button").css("display", "none");
    }
    $(".tooltip").remove();
}

function CreateBPDialog(dialogID, dialogOptions) {
    var defaultOptions = { name: '', width: "600px", height: "400px", top: "60px", resizable: false, draggable: true, modal: false, menubar: true };

    var dialog = document.createElement('div');
    dialog.className = "bp-window";
    if (dialogID == null) {
        dialogID = GenerateUniqueID();
    }
    dialog.id = dialogID;

    if (dialogOptions == null) {
        dialogOptions = defaultOptions;
    }
    else {
        if (!dialogOptions.modal == null) {
            dialogOptions.modal = defaultOptions.modal;
        }
        if (!dialogOptions.width) {
            dialogOptions.width = defaultOptions.width;
        }
        if (dialogOptions.height == null) {
            dialogOptions.height = defaultOptions.height;
        }
        if (!dialogOptions.top) {
            dialogOptions.top = defaultOptions.top;
        }
        if (!dialogOptions.name) {
            dialogOptions.name = defaultOptions.name;
        }
        if (!dialogOptions.resizable) {
            dialogOptions.resizable = defaultOptions.resizable;
        }
        if (dialogOptions.draggable == null) {
            dialogOptions.draggable = defaultOptions.draggable;
        }
        if (dialogOptions.menubar == null) {
            dialogOptions.menubar = defaultOptions.menubar;
        }
        if (!dialogOptions.theme) {
            dialogOptions.theme = "";
        }
    }
    dialog.style.width = dialogOptions.width;
    dialog.style.height = dialogOptions.height;
    dialog.setAttribute('data-initial-width', dialogOptions.width);
    dialog.setAttribute('data-dialog-name', dialogOptions.name);
    dialog.setAttribute('data-initial-height', dialogOptions.height);
    dialog.style.top = dialogOptions.top;
    if (dialogOptions.minWidth != null) {
        dialog.style.minWidth = dialogOptions.minWidth;
    }
    if (dialogOptions.minHeight != null) {
        dialog.style.minHeight = dialogOptions.minHeight;
    }
    if (dialogOptions.left == null) {
        if (dialogOptions.width != "auto") {
            dialog.style.left = "calc(50% - " + dialog.style.width + "/2)";
        }
    }
    else {
        dialog.style.left = dialogOptions.left;
    }

    var titleContainer = document.createElement('div');
    titleContainer.className = "bp-dialog-title " + dialogOptions.theme;
    titleContainer.innerHTML = '<div class="bp-dialog-name">' + dialogOptions.name + '</div><div class="bp-dialog-buttonset">' +
		'<div class="close-dialog" onclick="CloseBPDialog(\'' + dialogID + '\')"></div>' +
	'</div>';
    dialog.appendChild(titleContainer);

    if (dialogOptions.menubar == true) {
        var menuBar = document.createElement('div');
        menuBar.id = dialogID + '_menu';
        menuBar.className = "menu-bar dialog-menu light-green";
        dialog.appendChild(menuBar);

        dialog.setAttribute('data-menubar', "true");
    }
    else {
        dialog.setAttribute('data-menubar', "false");
    }

    var dialogContent = document.createElement('div');
    dialogContent.className = "bp-dialog-content custom-scroll";
    dialog.appendChild(dialogContent);

    if (dialogOptions.contentHTML != null) {
        dialogContent.innerHTML = dialogOptions.contentHTML;
    }

    dialogContent.innerHTML += '<div class="popup_buttons" style="padding-bottom:10px"><button  class="btn btn-sm btn-success" onclick="msgOkDialog(\'' + dialogOptions.path + '\',\'' + dialogID + '\')"><span class="glyphicon glyphicon-ok"></span>&nbsp;Ok</button></div>';

    //Սահմանում ենք dialog click ֆունկցիան
    dialog.onmousedown = function () {
        BPWindowClick(this);
    };

    if (dialogOptions.modal == true) {
        dialog.setAttribute('data-modal', "true");
        if (document.querySelectorAll('.bp-dialog-overlay').length == 0) {
            var modalOverlay = document.createElement('div');
            modalOverlay.className = "bp-dialog-overlay";
            modalOverlay.style.display = "block";
            document.body.appendChild(modalOverlay);
        }
        else {
            $('.bp-dialog-overlay').css("display", "block");
        }
    }
    else {
        dialog.setAttribute('data-modal', "false");
    }


    dialog.style.zIndex = "5002";

    //Ավելացնում ենք DOM-ում
    document.body.appendChild(dialog);

    if (dialogOptions.width == "auto") {
        dialog.style.left = "calc(50% - " + dialog.offsetWidth + "px/2)";
    }

    //$(".bp-dialog-content").mCustomScrollbar({
    //    theme: "rounded-dark",
    //    scrollButtons: {
    //        scrollAmount: 75,
    //        enable: true
    //    },
    //    mouseWheel: {
    //        scrollAmount: 75
    //    }
    //});

    //Ստեղծում ենք մենյուի կոճակները
    if (dialog.getAttribute('data-menubar') == "true") {
        RenderDialogMenu(dialogOptions.menubarJson, menuBar.id, dialogOptions.menuButtonOptions, dialogID);
    }

    //Դարձնում ենք շարժվող
    if (dialogOptions.draggable) {
        $('#' + dialog.id).draggable({ handle: ".bp-dialog-title" });
    }

    //Դարձնում ենք փոփոխվող չափերով
    if (dialogOptions.resizable) {
        $('#' + dialog.id).resizable();
    }

    if (dialog.getAttribute('data-menubar') == "true") {
        $('#' + dialog.id).resize(function () {
            RenderDialogMenu(dialogOptions.menubarJson, menuBar.id, dialogOptions.menuButtonOptions, dialogID);
            HorizontalMenu.prototype.PerformLayout(menuBar.id);
        });
    }

    return false;
}


function ShowMessage(message, dialogType, path,dialogName) {
    var dialogTypeClass = "bp-information";
    switch (dialogType) {
        case "information":
            dialogTypeClass = "bp-information";
            break;
        case "warning":
            dialogTypeClass = "bp-warning";
            break;
        case "error":
            dialogTypeClass = "bp-error";
            break;
        default:
            dialogTypeClass = "bp-information";
    }

    var bodyHTML =
        '<table style="width:auto"><tbody><tr><td><div style="text-align:center; display:inline-block;"><img src="/Content/newTheme/Images/Menu/invisible.png" class="bp-dg-type-icon ' +
            dialogTypeClass +
            '"' +
            '></div></td><td><div id="dialog-content-container" class="dialog-message-text" style="font-family:\'Arial Armenian\'">' +
            message +
            '</div></td></tr></tbody></table>';

    if (!dialogName) {
        dialogName = 'Ուշադրություն';
    }

    CreateBPDialog(null, {
        name: dialogName, menubar: false, height: "auto", width: "auto", top: "35%",
        minHeight: "0px", minWidth: "300px", contentHTML: bodyHTML, theme: "bp-green", modal: true,path:path
    });

    return false;

}

function GenerateUniqueID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'tsxxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function msgOkDialog(path,dialogId) {

    CloseBPDialog(dialogId);
    if (path != 'undefined') {
        path = path.substr(1);
        var url = location.origin.toString();
        window.location.href = url + '/#!/' + path;
    }
}