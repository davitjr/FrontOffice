$(document).ready(function() {
	$( ".search_ico" ).click(function() {
		$(".search").submit();
	});
	
	$( ".page_content_left_menu_inner_search img" ).click(function() {
		$(".page_content_left_menu_inner_search form").submit();
	});
	
	$( ".page_content_left_menu_item" ).click(function(e) {
		if(e.target.tagName == "IMG")
		{
			return;
		}
		
		var selector = $(this).children(".page_content_left_menu_item_hide");
		$(".page_content_left_menu_item_hide").not(selector).slideUp( "fast" );
		selector.slideToggle("fast");
		
		
		var menu_hide = $(this).children(".page_content_left_menu_item_inner").children(".drop_ico");
		if($(menu_hide).hasClass("drop_ico_selected"))
		{
			$(menu_hide).removeClass("drop_ico_selected");
		}
		else
		{
			$(".drop_ico").removeClass("drop_ico_selected");
			$(menu_hide).addClass("drop_ico_selected");
		}
		
		var menu_hide = $(this).children(".page_content_left_menu_item_inner").children(".text");
		if($(menu_hide).hasClass("menu_text_colored"))
		{
			$(menu_hide).removeClass("menu_text_colored");
		}
		else
		{
			$(".text").removeClass("menu_text_colored");
			$(menu_hide).addClass("menu_text_colored");
		}
		
	});
	
	$(function() {
		$(".page_content_left_menu_inner").sortable({
			handle: "img[src*='pics/drag_ico.png']",
		});

	});
	

	$(".header_left_item_prof_ico, .header_left_item_prof_drop").click(function(event) {
		event.stopPropagation();
		var ico_active = $(".header_left_item_prof_ico");
		if($(ico_active).hasClass("header_left_item_prof_ico_active"))
		{
		    $(ico_active).removeClass("header_left_item_prof_ico_active");
		    HideLogoutContainer(event);

		}
		else
		{
			$(".header_left_item_prof_ico").removeClass("header_left_item_prof_ico_active");
			$(ico_active).addClass("header_left_item_prof_ico_active");
			//MenuLogoutButtonClick();
		}
		$(".header_left_item_langs div").fadeOut(200);
		$(".header_left_item_hide").fadeToggle(200);
		$(".page_top_panel_item").removeClass("page_top_panel_item_active");
		$(".page_top_panel_item_hide").fadeOut(200);
		
		$(".header_left_item_ico").children("a").children(".hide_select").removeClass("header_left_item_ico_img_selected");
		$(".header_left_item_ico").parent().removeClass("header_left_item_ico_selected");
		$(".header_left_item_ico").children().children(".header_left_item_ico_hide").removeClass("header_left_item_ico_hide_selected");		
	});
	$( ".header_left_item_langs" ).click(function(event) {
		event.stopPropagation();
		$(".header_left_item_langs div").fadeToggle();
		$(".page_top_panel_item").removeClass("page_top_panel_item_active");
		$(".page_top_panel_item_hide").fadeOut(200);
		$(".header_left_item_prof_ico").removeClass("header_left_item_prof_ico_active");
		HideLogoutContainer(event);
		$(".header_left_item_hide").fadeOut(200);
		
		$(".header_left_item_ico").children("a").children(".hide_select").removeClass("header_left_item_ico_img_selected");
		$(".header_left_item_ico").parent().removeClass("header_left_item_ico_selected");
		$(".header_left_item_ico").children().children(".header_left_item_ico_hide").removeClass("header_left_item_ico_hide_selected");
	});
	$( ".page_top_panel_item" ).click(function(event) {
		$(".header_left_item_langs div").fadeOut(200);
		$(".header_left_item_prof_ico").removeClass("header_left_item_prof_ico_active");
		HideLogoutContainer(event);
		$(".header_left_item_hide").fadeOut(200);
		
		event.stopPropagation();
		var selector = $(this).children(".page_top_panel_item_hide");
		$(".page_top_panel_item_hide").not(selector).fadeOut( "fast" );
		selector.fadeToggle("fast");
		
		var panel_active = $(this);
		if($(panel_active).hasClass("page_top_panel_item_active"))
		{
			$(panel_active).removeClass("page_top_panel_item_active");
		}
		else
		{
			$(".page_top_panel_item").removeClass("page_top_panel_item_active");
			$(panel_active).addClass("page_top_panel_item_active");
		}
		$(".header_left_item_ico").children("a").children(".hide_select").removeClass("header_left_item_ico_img_selected");
		$(".header_left_item_ico").parent().removeClass("header_left_item_ico_selected");
		$(".header_left_item_ico").children().children(".header_left_item_ico_hide").removeClass("header_left_item_ico_hide_selected");
	});
	
	$( "html" ).click(function() {
		$(".page_top_panel_item").removeClass("page_top_panel_item_active");
		$(".header_left_item_prof_ico").removeClass("header_left_item_prof_ico_active");
		//HideLogoutContainer(event);
		$(".header_left_item_hide").fadeOut(200);
		$(".page_top_panel_item_hide").fadeOut(200);
		$(".header_left_item_langs div").fadeOut(200);
		$(".header_left_item_ico").children("a").children(".hide_select").removeClass("header_left_item_ico_img_selected");
		$(".header_left_item_ico").parent().removeClass("header_left_item_ico_selected");
		$(".header_left_item_ico").children().children(".header_left_item_ico_hide").removeClass("header_left_item_ico_hide_selected");
		
	});
	$( ".page_right_content" ).click(function() {
		$(".page_content_left_menu").removeClass("page_content_left_menu_selected");
		$( "#nav-toggle" ).removeClass("active");
	});
	$( ".page_content_sub_item" ).click(function() {
		var selector = $(this);
		$(".page_content_sub_item").not(selector).removeClass( "page_content_sub_item_selected" );
		selector.addClass("page_content_sub_item_selected");
	});
	
	
	/*new code*/
		
	$(".header_left_item_ico").click(function(event) {
		event.stopPropagation();
		var pop = $(this).children("a").children(".hide_select");
	
		if($(pop).hasClass("header_left_item_ico_img_selected"))
		{
			$(pop).removeClass("header_left_item_ico_img_selected");
			$(this).parent().removeClass("header_left_item_ico_selected");
			$(this).children().children(".header_left_item_ico_hide").removeClass("header_left_item_ico_hide_selected");
		}
		else
		{
			
			$(".header_left_item_ico").children("a").children(".hide_select").removeClass("header_left_item_ico_img_selected");
			$(".header_left_item_ico").parent().removeClass("header_left_item_ico_selected");
			$(".header_left_item_ico").children().children(".header_left_item_ico_hide").removeClass("header_left_item_ico_hide_selected");
			
			$(pop).addClass("header_left_item_ico_img_selected");
			$(this).parent().addClass("header_left_item_ico_selected");
			$(this).children(".header_left_item_ico_hide").fadeIn();
			$(this).children().children(".header_left_item_ico_hide").addClass("header_left_item_ico_hide_selected");
			
		}
		
		$(".page_top_panel_item").removeClass("page_top_panel_item_active");
		$(".header_left_item_prof_ico").removeClass("header_left_item_prof_ico_active");
		HideLogoutContainer(event);
		$(".header_left_item_hide").fadeOut(200);
		$(".page_top_panel_item_hide").fadeOut(200);
		$(".header_left_item_langs div").fadeOut(200);
	});
	$(".click_me").click(function() {
		$(".popup_wrapper").fadeIn();
		$(".back_fade").fadeIn();
	});
	
	$(".back_fade, .popup_wrapper_top img").click(function() {
		$(".popup_wrapper").fadeOut();
		$(".back_fade").fadeOut();
	});
	
	$( ".click_toggle" ).click(function() {
		var table = $(this).parent().next(".hide_table");
		var parent = $(this).parent();
		
		if(!$(this).children("div").hasClass("click_toggle_selected"))
		{
			$(".click_toggle").parent().next(".hide_table").removeClass("hide_table_selected");
			$(".click_toggle").children("div").removeClass( "click_toggle_selected" );
			$(".click_toggle").parent().removeClass("selected_tr");
			$(table).addClass("hide_table_selected");
			$(this).children("div").addClass( "click_toggle_selected" );
			$(parent).addClass("selected_tr");
		}
		else {
				
			$(".click_toggle").parent().next(".hide_table").removeClass("hide_table_selected");
			$(".click_toggle").children("div").removeClass( "click_toggle_selected" );
			$(".click_toggle").parent().removeClass("selected_tr");
		}
		
	});
    $(window).on('load',function() {
		if ($(window).width() <= 1114) {	
			$(".page_content_left_menu").removeClass("col-sm-2");
		}
		else {
			
		}
	});
	
	$( window ).resize(function() {
		if ($(window).width() <= 1114) {	
			$(".page_content_left_menu").removeClass("col-sm-2");
		}
		else {
			
		}
	});
});

function HideLogoutContainer(event) {
    if (event.target.getAttribute('id') != 'userName' && event.target.getAttribute('id') != 'userImage') {
        if ($(event.target).closest("div[id='LogoutContainer']").attr("id") != 'LogoutContainer') {
            if (!document.getElementById('LogoutContainer').classList.contains('hidden')) {
                document.getElementById('LogoutContainer').classList.add('hidden');
            }
        }
    }
}
function MenuLogoutButtonClick() {
    var logoutContainer = document.getElementById('LogoutContainer');
    if (logoutContainer.classList.contains('hidden')) {
        logoutContainer.classList.remove('hidden');
    }
    else {
        logoutContainer.classList.add('hidden');
    }
}
