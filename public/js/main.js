//-- lint options
/*jslint browser: true*/ /*global  $*/
//-- 

//-- our main module
var HugeNav = {
	
	init : function() {
		Helpers.getJson('/api/nav.json', HugeNav.buildNav);
		Helpers.checkWindowSize();
	},
	
	buildNav : function(data) {	
		var _navArr = data.items;
		var _navHtml = '';
		
		//-- construct our navigation
		$.each(_navArr, function(i, val) {
			_navHtml += '<li><a class="'+ hasSubnav(val.items) +'" href="'+ val.url +'" target="_self">'+ val.label +'</a>'+ popSubnav(val.items) +'</li>';
		});
		
		//-- check if element has a subnav child, return a class and flag for populating subnav below
		function hasSubnav(sn) {
			var _subnavMarker = '';
			
			if (sn.length > 0) {
				_subnavMarker = 'has-subnav';
			} 
			
			return _subnavMarker;
		}
		
		//-- add subnav to parent if present
		function popSubnav(_subNavArr) {
			var _subnav = '';
			var _subnavHtml = '';
			
			if (hasSubnav(_subNavArr) === 'has-subnav') {
				$.each(_subNavArr, function(i, val) {
					_subnavHtml += '<li><a href="'+ val.url +'" target="_self">'+ val.label +'</a></li>';
				});
				_subnav = '<ul class="subnav">'+ _subnavHtml +'</ul>';
			}
			
			return _subnav;
		}
		
		$('.main-navigation').html(_navHtml); //-- add to DOM
		HugeNav.addNavHandlers();
	},
	
	addNavHandlers : function(){
		//-- menu toggle, show:hide
		$('.menu-toggle').on('click', function() {
			toggleNav();
		});
		
		//-- subnav items
		$('.has-subnav').on('click', function(e) {
			e.preventDefault();
			var $subItem = $(this);
			
			if ($subItem.hasClass('active')) {
				$subItem.toggleClass('active').next('.subnav').slideUp();
				if (Helpers.currWindowSize === 'large-res') $('.screen-matte').removeClass('nav-active');
				
				return; //-- is active, just hide the current subnav, prevent slide from opening again below
			} 
			
			hideSubNav();
			
			$subItem.toggleClass('active').next('.subnav').slideDown();
			$('.screen-matte').addClass('nav-active');
		});
		
		//-- screen matte
		$('.screen-matte').on('click', function() {			
			if ($(this).hasClass('nav-active')) {
				toggleNav('remove');
			}
		});
		
		//-- window resize
		$(window).resize(function() {
			if (Helpers.currWindowSize !== Helpers.checkWindowSize()){
				toggleNav('remove');
			}
		});
		
		//-- shared functionality
		function toggleNav(action) {
			//-- these elements share the class '.nav-active' defined for each section in the CSS
			var $group = $('.main-navigation, .content-wrapper, .screen-matte, .m-nav');
			
			if (action === 'remove'){
				$group.removeClass('nav-active');
			} else {
				$group.toggleClass('nav-active');
			}
			
			hideSubNav();
		}
		
		function hideSubNav() {
			$('.has-subnav').removeClass('active');
			$('.subnav').slideUp();
		}
	}
};


var Helpers = {
	
	currWindowSize : 'small-res', //-- default value, will update on page init
	
	getJson : function(path, cb) {
		$.ajax({
			url: path,
			dataType: 'json'
		})
		.done(function(data) {
			if (typeof cb === 'function') {
				cb(data); //-- execute callback, build the nav
			}
		})
		.fail(function() {
			// console.log('JSON failed to load');
		});
	},
	
	checkWindowSize : function() {		
		var size;
		
		if ($(window).width() >= 768) {
			size = 'large-res';
		}else{
			size = 'small-res';
		}
			
		Helpers.currWindowSize = size; //-- store current window size in object
		
		return size;
	}
};


//-- DOM ready
$(document).ready(function() {
	HugeNav.init();
});