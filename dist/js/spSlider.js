/*!
 spSlider Build version 0.0.1, 11-15-2013, 12:39:51 PM
*/
(function($) {

	$.fn.spSlider = function(options) {

		var settings = $.extend({
			width: 		400,
			height: 	300,
			listURL: 	"",
			listName: 	"",
			categories: [],
			visibilityFullFit: false
			// all options for slider plugin are dynamic
		}, options);

		// get the HTML content for outputting to element
		var slides = outputSlides(settings);
		
		// set width and height of container
		this.height(settings.height);
		this.width(settings.width);

		// set innerHTML of element
		this.html(slides);

		// apply whatever plugin
		var result = applyPlugin(this, settings);

		// return this for chaining
		return result;
	};

	var applyPlugin = function(el, settings) {
		// set width and height of slides
		$(".swiper-slide").height(settings.height + "px").width(settings.width + "px");
		$(".swiper-container").height(settings.height + "px").width(settings.width + "px");
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
		
		var data = getData(settings);

		var slides = formatData(data);

		return slides;
	};

	var formatData = function(data) {

		var i, list = data, listLength = list.length;
		var pagination = "<a class='swipe-nav left'>left</a><a class='swipe-nav right'>right</a>";
		var slides = "<div class='swiper-wrapper'>";
		for(i = 0; i < listLength; i++) {

			slides += "<div class='swiper-slide'>";
			slides += "<img src='" + list[i].image + "' />";
			slides += "<div class='caption'>" + list[i].title + "</div>";
			slides += "</div>";
		}
		slides += "</ul>";
		var result = pagination + slides;
		return pagination + slides;

	};

	// get data from SharePoint
	var getData = function(settings) {
		var data = [];

	/* $().SPServices({
			operation: "GetListItems",
			async: true,
			listName: settings.listName,
			// query for category
			completefunc: function(xData, Status) {
				data = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJson({ 
					includeAllAttrs: true,
					removeOws: true
				});
				return data;
			}
		}); */
		
		data = [
			{
				title: "Test image",
				image: "images/1.jpg",
				link: "http://www.google.com",
				categories: "ES;MS;HS"
			},
			{
				title: "SAnother image",
				image: "images/2.jpg",
				link: "http://www.ebay.com",
				categories: "ES"
			},
			{
				title: "Someethisdnf sdf",
				image: "images/3.jpg",
				link: "http://www.amazon.com",
				categories: "HS"
			},
			{
				title: "Test image",
				image: "images/2.jpg",
				link: "http://www.fb.com",
				categories: "ES;HS"
			}
		];
		return data;
	};

}(jQuery));