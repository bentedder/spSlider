***

Today we're going to cover how to build a jQuery plugin that creates a slider for SharePoint.

***

This post is going to cover my build process from beginning to end on how I created a re-useable (even multiple per page) slider for use in SharePoint (specifically SharePoint 2010).

The Goal: Create a slider that is easy for power users of SharePoint to use in their pages.

Step 1: Setup the project
-------------------------
Let's create our basic structure for the project:

* css/
* img/
* js/
* index.html

That's it! We'll use this structure to build out our slider. Then when we're done I'll show you how to package everything up and include it in SharePoint.

Step 2: Create the HTML page
----------------------------
Open up index.html and let's start editing:

```html
<!DOCTYPE html>
<html>
<head>
	<title>SharePoint Slider</title>
</head>
<body>
	
	<div id="test"></div>

</body>
</html>
```

As you can see so far, this project is super simple. That's the goal. We want all the logic hidden from the end user. Remember, this project is built so that a power user of SharePoint can simply import one file into a Content Editor Webpart and have full slideshow features and functionality.

Step 3: Create the jQuery Plugin
--------------------------------

**Create Files**

Things will begin to get more intense from here. First, go grab jQuery (1.10.2 for this tutorial) and drop it in the **js/** folder. Then create a new file inside that folder called **spSlider.js**. Now let's go over to index.html and reference those two scripts:

```html
...
<head>
	<title>SharePoint Slider</title>
	<script src="js/jquery-1.10.2.js" type="text/javascript"></script>
	<script src="js/spSlider.js" type="text/javascript"></script>
</head>
...
```
**Create our base plugin**

Open up spSlider.js and let's start creating! Creating a jQuery plugin is not as daunting as it sounds. In fact, it's quite straightforward. Here's the basic construct:

```javascript
(function($) {

}(jQuery));
```

Everything inside that self-contained function will now have access to jQuery. Once inside this function, we want to create the actual plugin. Since I'm calling this plugin **spSlider**, here's my plugin code:

```javascript
$.fn.spSlider = function(options) {
	// put plugin logic here
	return this;
};
```

Take note of a few things here. First, we're creating the function with $.fn.spSlider. This is jQuery syntax for creating plugins. Next, we assign a function and pass an **options** parameter. These are the options the user will pass when instantiating the plugin. Finally, we **return this;**. This is important in order to preserve jQuery chaining of plugins.

**Read and set default options**

When the user instantiates the plugin, they will be able to pass options. We want to listen for those options, and in some cases set defaults. So we'll create a **settings** variable that is an extension of the options passed:

```javascript
$.fn.spSlider = function(options) {

	var settings = $.extend({
		width: 400,
		height: 300
	}, options);

	return this;
});
```

At this point we have a fully-functioning plugin. But it doesn't do anything. So, to test it out, what we're going to do is set the width and height of the plugin based on the parameters the user has passed (if any). First, I'm going to store the value of **this** to **self** (my standard practice inside functions) so that we always have access to **this** and know what it is. Then we're going to set the width and height of **self** (this). We're still working inside of the plugin function here.

```javascript
...
	self.height(settings.height);
	self.width(settings.width);
...
```

Ok, so *now* we have a fully-functioning plugin. We can officially go and test things out. Your spSlider.js should look like this:

```javascript
(function($) {

	$.fn.spSlider = function(options) {

		var self = this;

		var settings = $.extend({
			width: 400,
			height: 300
		}, options);

		self.height(settings.height);
		self.width(settings.width);

		return self;

	};
}(jQuery));
```

Implement plugin in HTML
------------------------
Now, in index.html we need to instantiate this plugin. So right beneath the `<div>` in the index.html we create a new script tag.

```html
<script type="text/javascript">
$("#test").spSlider({
	width:200,
	height:100
});
</script>
```

In order to see how it's working, let's quickly go create a file called **style.css** inside the **css/** folder.

```css
div {
	border:1px solid red;
}
```

Let's make sure and reference it in index.html:
```html
	<link href="css/style.css" rel="stylesheet" />
```

Go preview index.html in the browser and you should see a box with a red outline that is 200px wide and 100px tall. Congrats! You just made a jQuery plugin! But that's just the beginning.

Importing dynamic data
----------------------
This plugin is great...but doesn't do anything. We need some data. For right now we're not going to integrate SharePoint. We're going to fake it. I always find it's easier to create the UI separate from the data and then bringing in real data later. So beneath our plugin function (but still within the self-contained function in spSlider.js) we can create a new function and assign it to a variable called **getData**.

```javascript
	$.fn.spSlider = function(options){
		// plugin we create earlier
	};

	var getData = function(settings) {

		var data = [
			{
				img: "img/img1.png",
				caption: "test caption",
				link: "http://www.amazon.com"
			},
			{
				img: "img/img2.png",
				caption: "another caption",
				link: "http://www.ebay.com"
			},
			{
				img: "img/img3.png",
				caption: "",
				link: "http://www.facebook.com"
			}
			
		];

		return data;
	
	};
```

So this function simply returns an array of objects when it is called. Eventually this function will actually return an array of objects from SharePoint, but for now we'll stick with this to keep it speedy.

In **spSlider.js** we need to get this data and pass it into the element the plugin is called from.

```javascript
$.fn.spSlider = function(options){

	...

	var data = getData(settings);
	console.log(data);

	return self;
};
```

If you check index.html in the browser again, you should see an array with 3 objects appear in the console. This confirms our data is being piped in correctly. Now let's put it into the DOM.

Go get 3 images and put them in the **img/** folder and make sure they're the same size. Name them img1.png, img2.png, and img3.png (to align with our data object we created earlier).

Creating DOM objects dynamically from data
------------------------------------------
Above the **getData** function we're going to create another function called **formatData**. This function will iterate through our data and create an html string that is suitable for adding to the DOM. We'll go in depth with a few of things a bit later:

```
var formatData = function(data, settings) {
	var i, dataLength = data.length;

	// create pagination links
	var pagination = "<a class='swipe-nav left'>left</a><a class='swipe-nav right'>right</a>";

	// create a wrapper for our slides
	var slides = "<div class='swiper-wrapper'>";

	// iterate through the data
	for(i = 0; i < dataLength; i++) {

		// assign data to variables from the user's input
		var link = data[i][settings.linkColumn] || "";
		var img = data[i][settings.imgColumn] || "";
		var caption = data[i][settings.captionColumn] || "";
		
		// create a new div for each slide
		slides += "<div class='swiper-slide'>";

		slides += "<a href='" + data[i].link + "'><img src='" + data[i].img + "' /></a><br/><span>" + data[i].caption + "</span>";

		slides += "</div>";
	}
	// close out the wrapper div
	slides += "</div>";

	// concatenate the pagination and the slides and return the result
	var result = pagination + slides;

	return result;
};
```
So, that's a big function, and has a lot of HTML in it. Arguably, you could move this html into a template and include it some other way. But for now this works. Check out the comments to see what we're doing, but basically we're just creating a slide for each slide in the data.

You may have noticed some settings that the user hasn't provided yet. Now when the user instantiates the plugin, they will pass in a few more things:

```javascript
$("#test").spSlider({
	width:200,
	height:100,
	linkColumn: "link",
	imgColumn: "img",
	captionColumn: "caption"
});
```
The reason we do this is because SharePoint itself has some funky names for columns (especially the image column). So we can just mask them for the function, and let the user provide the actual column name. This way it's flexible enough to work in different scenarios.

Now we need to put this data into the DOM. So back in our plugin, we need to add a few lines. We're already storing the data in a variable. Now we need to pass that data, and our settings, to the formatData function. This will return the HTML string, which we'll assign to a variable called **slides**. Then we'll simply use jQuery to put the content of **slides** into the html of the element. 

*Note: we will entirely replace anything else in the div that is calling the plugin.*

```javascript
$.fn.spSlider = function(options) {

	var self = this;

	var settings = $.extend({
		width: 400,
		height: 300
	}, options);

	self.height(settings.height);
	self.width(settings.width);

	var data = getData(settings);
	
	var slides = formatData(data, settings);

	self.html(slides);

	return self;

	};
```