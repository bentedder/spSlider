(function($) {

	$.fn.spSlider = function(options) {
		var self = this;
		
		var settings = $.extend({
			width: 		400,
			height: 	300,
			listURL: 	"",
			listName: 	"",
			limit: 0
		}, options);
		
		var newHeight = settings.height;
		if(settings.caption === true) {
			newHeight = newHeight + 36;
		}
		settings.newHeight = newHeight;
		

		// set width and height of container
		self.height(settings.newHeight);
		self.width(settings.width);

		// get the HTML content for outputting to element
		var slides = outputSlides(settings);
		$.when(slides).done(function(slideData) {

			// set innerHTML of element
			self.html(slideData);

			// apply whatever plugin
			var result = applyPlugin(self, settings);
			
			// return this for chaining
			return result;
		
		});
	};

	var applyPlugin = function(el, settings) {
		// set width and height of slides
		el.children(".swiper-slide").height(settings.newHeight).width(settings.width);
		el.children(".swiper-container").height(settings.newHeight).width(settings.width);
		
		var hardcodedOptions = {
			keyboardControl: true,
			loop: true,
			watchActiveIndex: true
		};
		
		$.extend(settings, hardcodedOptions);
		var swiper = el.swiper(settings);
		
		el.children(".swipe-nav.left").click(function(){swiper.swipePrev()});
		el.children(".swipe-nav.right").click(function(){swiper.swipeNext()});
	};

	// gather the html and return it
	var outputSlides = function(settings) {
		var defer = $.Deferred();
		
		var data = getData(settings);
		$.when(data).done(function(pics){
			var slides = formatData(pics, settings);
			defer.resolve(slides);
		});
		
		return defer.promise();
	};

	var formatData = function(data, settings) {

		var i, list = data, listLength = list.length, link, img, caption;
		var pagination = "<a class='swipe-nav left'>left</a><a class='swipe-nav right'>right</a>";
		var slides = "<div class='swiper-wrapper'>";
		for(i = 0; i < listLength; i++) {
			
			link = list[i][settings.linkColumn] || "";
			img  = list[i][settings.imageColumn] || "";
			caption = list[i][settings.captionColumn] || "";
			
			slides += "<div class='swiper-slide'>";
			if(link === "") {
				slides += "<img src='" + img + "' />";
			} else {
				slides += "<a href='" + link + "'><img style='border:none' src='" + img + "' /></a>";
			}
			if(settings.caption === true) {
				slides += "<div class='caption' style='top:" + settings.height + "px'>" + caption + "</div>";
			}
			slides += "</div>";
		}
		slides += "</ul>";
		var result = pagination + slides;
		return result;

	};

	// get data from SharePoint
	var getData = function(settings) {
		var defer = $.Deferred();
		$().SPServices({
			operation: "GetListItems",
			async: true,
			webURL: settings.listURL,
			listName: settings.listName,
			// query for category
			CAMLViewFields: "<ViewFields Properties='True' />",
			CAMLQuery: "<Query><Where><Eq><FieldRef Name='ContentType' /><Value Type='Text'>Picture</Value></Eq></Where><OrderBy><FieldRef Name='ID' Ascending='False' /></OrderBy></Query>",
			CAMLRowLimit: settings.limit,
			completefunc: function(xData, Status) {
				var data = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson({ 
					includeAllAttrs: true,
					removeOws: true
				});
				defer.resolve(data);
			}
		});
		return defer.promise();
	};

}(jQuery));