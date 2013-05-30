/* 
 * =============================================================
 * FHI INTRANET NAVIGATION PROTOTYPE
 * =============================================================
 */
$(function(){
	
// this should fix the console problem in IE 
if (typeof console == "undefined") {
	this.console = {log: function() {}};
}
/* 
 * =============================================================
 * IE FIXES
 * =============================================================
 */
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
	function getInternetExplorerVersion() {
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re	= new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null) {
				rv = parseFloat( RegExp.$1 );
			}
		}
		return rv;
	}
	//Sample Check Version Function
	function checkVersion() {
		var msg = "You're not using Internet Explorer.";
		var ver = getInternetExplorerVersion();
		if ( ver > -1 ) {
			if ( ver >= 8.0 ) {
				msg = "You're using a recent copy of Internet Explorer."
			}
			else {
				msg = "You should upgrade your copy of Internet Explorer.";
			}
		}
		console.log( msg );
	}

	//checkVersion();

	//IE 7-8 last child compatibility
	function ieCompSpans() {
		$('.row-fluid').each(function(){
			$(this).find("[class*=\"span\"]:last-child").addClass('l');
		});
		$('#pages').each(function(){
			$(this).find("[class*=\"row-fluid\"]:last-child").addClass('l');
		});
	}
	ieCompSpans();

/* 
 * =============================================================
 * Some Vars
 * =============================================================
 */

	//Window Width
	$winWidth = $(window).width();
	//iPad Check
	var isiPad = navigator.userAgent.match(/iPad/i) != null;
	var ieVer = getInternetExplorerVersion();
	
/* 
 * =============================================================
 * iDevices touch wipe
 * =============================================================
 */
	
	var ieVer = getInternetExplorerVersion();
	if(ieVer == -1) {
		// iDevice
		$("body").touchwipe({
			wipeLeft: function(e) {
				console.log("wipe left");
				e.preventDefault();
			},
			wipeRight: function(e) {
				console.log("wipe right");
				e.preventDefault();
			},
			wipeUp: function() {
				
			},
			wipeDown: function() {
	
			}
	
		});
	}
/* 
 * =============================================================
 * NAV HEIGHTS
 * =============================================================
 */
	var $siteNavHeight = []; //site-nav = 0, second-nav = 1, section-nav = 2
	var $heightDif = [];
	var $checkSection = 0;
	
	function getInitHeight(el, x){
		$siteNavHeight[x] = ($(el).height());
	}
	
	function navHeight(el,height){
		if($(el).length) {
			$(el).height(height);
		}
	}

	function navDif(el, x) {
		if(x == 2) {
			$heightDif[x] = ($siteNavHeight[x] - 63) - ($(el).parent().height() - 63);
		} else {
			$heightDif[x] = $siteNavHeight[x] - $(el).height();
		}
		
		//attach the wheel
		mouseWheelie(el, $heightDif[x]);
		clickScrollie(el, $heightDif[x]);
		
		console.log('dif for ' + x + ' is ' + $heightDif[x] + ' and init nav height is ' + $siteNavHeight[x] + ' current height is ' + $(el).height());
	}

	//when the window loads
	$(window).load(function(){
		//SITE NAV
		getInitHeight('.site-nav', 0);
		//set actual size of nav to take up whole window
		var $targetHeight = $(window).height() - 53;
		navHeight('.site-nav', $targetHeight);
		//Get DIF after height is adjusted
		navDif('.site-nav', 0);

		//SECTION NAV

	});
	
	//if window is resized
	$(window).resize(function(){
		$('[data-role="nav"] ul').css('margin-top','0')
		var $reTargetHeight = $(window).height() - 53;


		if($siteNavHeight[2]) {
			$('.section-nav').height('auto');
			
			//Resize for just .section-nav
			navHeight('.section-nav', $reTargetHeight);
			//get DIF on resize
			navDif('.section-nav-inner', 2);
		}

		//Resize for just .site-nav
		navHeight('.site-nav', $reTargetHeight);
		//get DIF on resize
		navDif('.site-nav', 0);

	});
	
/* 
 * =============================================================
 * NAV SCROLL (mousewheel)
 * =============================================================
 */

var marginTop = 0;

function mouseWheelie(object, dif) {
	var marginTop = 0;
	$(object).unbind('mousewheel');
	$(object).bind('mousewheel', function(event, delta, deltaX, deltaY) {
			var vel = Math.abs(delta);

			var dir = delta > 0 ? 'Up' : 'Down';
			if(dir == "Up" && marginTop < 0) {

				//attempt to make it not go too far if u scroll fast
				if(vel + marginTop > 0) {
					vel = -(marginTop);
				}

				$(object).find('ul').css('margin-top', '+=' + vel);
				marginTop += vel;
			} else if(dir == "Down" && marginTop > -(dif)){

				$(object).find('ul').css('margin-top', '-=' + vel);
				marginTop -= vel;
			}
			return false;
	});

}

/* 
 * =============================================================
 * NAV SCROLL (hover over arrow)
 * =============================================================
 */

function clickScrollie(object, dif) {
	console.log(dif);
	$(object).append('<a href="#">stufffff</a>');
}


/* 
 * =============================================================
 * SITE NAV PULL OUT
 * =============================================================
 */
	$('.site-nav > ul > li').find('a').click(function(e){
		$('.site-nav a.active').removeClass('active');
		$(this).addClass('active');
		$('.second-nav').addClass('active');
		var navHtml = $(this).closest('li').find('ul').html();
		$('.second-nav ul').html(navHtml);
		var pos = $('.second-nav').position();

		//SECOND NAV
		//make sure margin of ul is 0
		$('.second-nav ul').css('margin-top', '0px');
		getInitHeight('.second-nav ul', 1);
		//set actual size of nav to take up whole window
		var $targetHeight = $(window).height() - 53;
		navHeight('.second-nav', $targetHeight);
		//Get DIF after height is adjusted
		navDif('.second-nav', 1);
		
		var posLeft = pos.left;
		if(posLeft < 0) {
			$('.second-nav').animate({left:'101px'},500);
		}
		e.preventDefault();
	});
	
	$('.second-nav').hover(
		function(){
			//console.log('in');
		},
		function(){
			$('.second-nav').animate({left:'-200px'},500);
			$('.site-nav a.active, .second-nav').removeClass('active');
		}
	);

/* 
 * =============================================================
 * SECTION NAV PULL OUT
 * =============================================================
 */

	function bindToggleClick() {
		//dont duplicate
		$('.section-nav .toggle').unbind('click');
		
		//bind click
		$('.section-nav .toggle').click(function(e){
			var pos = $('.section-nav').position();
			var posLeft = pos.left;

			if(posLeft > 0) {
				$('.section-nav').animate({left:'-108px'},500).addClass('is-closed');
				$('#pages').animate({marginLeft:'50px'},500);
			} else {
				$('.section-nav').animate({left:'101px'},500).removeClass('is-closed');
				$('#pages').animate({marginLeft:'260px'},500);
			}
			e.preventDefault();
		});
	}
	
	bindToggleClick();

	if(!$('.section-nav').length) {
		$('#pages').css('margin','0px')
	}

/* 
 * =============================================================
 * PAGINATION LINK ASSIGNMENTS
 * =============================================================
 */
	function assignPagination(url) {
		//console.log(url);
		var url = url.split('/');

		for (var i=0; i<url.length ;i++){
			var newUrl = url.pop();
			var usableLink = url.join('/');
			
			//console.log(usableLink);
			if(i == 1) {
				$('.middle > .pagination').attr('href', usableLink);
			} else if(i == 2) {
				$('.last > .pagination').attr('href', usableLink);
			} else if(i > 2) {
				console.log('do something with these links')
			}
		}
	}
	

	var loadUrl = window.location.pathname;
	assignPagination(loadUrl);

/* 
 * =============================================================
 * GET CONTENT PAGE CREATE
 * =============================================================
 */

	// HTML Helper
	var documentHtml = function(html){
		// Prepare
		var result = String(html)
			.replace(/<\!DOCTYPE[^>]*>/i, '')
			.replace(/<(html|head|body|title|meta|script)([\s\>])/gi,'<div class="document-$1"$2')
			.replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
		;
		// Return
		return result;
	};

	function newPageMagic(data, url){
		var
			$data = $(documentHtml(data))
			, $title = $data.find('.document-title:first').text()
			, $front = $data.find('#pages .front').html()
			, $nav = $data.find('.section-nav').html();
		;
		var split = url.split('/');

		//content swap
		$('#pages .front').html($front);
		
		//nav swap
		if($('.section-nav').length) {
			$('.section-nav').html($nav);
		} else {
			$('#main').prepend('<nav class="section-nav" data-role="nav">' + $nav + '</nav>');
		}
		
		//Create pages effect
		if(url == '/') {
			$('#pages').removeClass();
			$('.section-nav').remove();
		} else if(split.length == 3) {
			$('#pages').removeClass();
			$('#pages').addClass('medium');
		} else if(split.length >= 4) {
			$('#pages').removeClass();
			$('#pages').addClass('high');
		} else {
			$('#pages').removeClass();
		}
		
		//Animate navigation and pages after page change
		if(!$('.section-nav').length) {
			$('#pages').animate({marginLeft:'0px'},500);
		} else {
			var pos = $('.section-nav').position();
			var posLeft = pos.left;
			if(posLeft < 0) {
				$('#pages').animate({marginLeft:'50px'},500);
			} else {
				$('#pages').animate({marginLeft:'260px'},500);
			}
		}
	
		
		//turn on ajax clicks again
		bindAjaxClicks();
		//bind toggle clicks again
		bindToggleClick();
		//assign correct links for pagination
		assignPagination(url + '/');
		//remake l classes
		ieCompSpans();
		
		
		//SECTION NAV
		//make sure margin of ul is 0 and the initial height is auto
		$('.section-nav-inner ul').css('margin-top', '0px');
		$('.section-nav').height('auto');
		
		getInitHeight('.section-nav', 2);
		//set actual size of nav to take up whole window
		var $targetHeight = $(window).height() - 53;
		navHeight('.section-nav', $targetHeight);
		//Get DIF after height is adjusted
		navDif('.section-nav-inner', 2);
		
		
		
	}

	function bindAjaxClicks() {
		//dont duplicate
		$('.second-nav ul, .section-nav ul, #brand').off('click');
		
		//attach ajax click
		$('.second-nav ul, .section-nav ul, #brand').on("click", "a", function(e){
			var $href = $(this).attr('href');

			var pageRequest = $.ajax({
				url: $href,
				success: function(data){
					newPageMagic(data, $href);
				}
			}); //end ajax
			e.preventDefault();

		});

		//dont duplicate
		$('.pagination').unbind('click');
		
		//attach ajax click
		$('.pagination').click(function(e){
			var $href = $(this).attr('href');

			var pageRequest = $.ajax({
				url: $href,
				success: function(data){
					newPageMagic(data, $href);
				}
			}); //end ajax
			e.preventDefault();

		});

	}
	bindAjaxClicks();





}); //end ready function
