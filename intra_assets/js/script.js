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
	function navHeight(el,height){
		if($(el).length) {
			$(el).height(height);
		}
	}
	var $targetHeight = $(window).height() - 53;
	navHeight('.site-nav', $targetHeight);
	navHeight('.second-nav', $targetHeight);
	navHeight('.section-nav', $targetHeight);
	
	$(window).resize(function(){
		var $reTargetHeight = $(window).height() - 53;
		navHeight('.site-nav', $reTargetHeight);
		navHeight('.second-nav', $reTargetHeight);
		navHeight('.section-nav', $reTargetHeight);
	});


/* 
 * =============================================================
 * SITE NAV PULL OUT
 * =============================================================
 */
	$('.site-nav > ul > li').find('a').click(function(e){
		$('.site-nav a.active').removeClass('active');
		$(this).addClass('active');
		var navHtml = $(this).closest('li').find('ul').html();
		$('.second-nav ul').html(navHtml);
		var pos = $('.second-nav').position();
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
			$('.site-nav a.active').removeClass('active');
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
		console.log(url);
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
			$('#main').prepend('<nav class="section-nav">' + $nav + '</nav>');
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
		//size for section nav
		var $targetHeight = $(window).height() - 53;
		navHeight('.section-nav', $targetHeight);
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
