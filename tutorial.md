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

Step 4: Implement plugin in HTML
--------------------------------
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

Step 5: Importing dynamic data
------------------------------
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

Step 6: Creating DOM objects dynamically from data
--------------------------------------------------
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

Go preview index.html in the browser. You'll now see that our div contains 3 images, one after the other. We're getting closer!

The next step is to apply a slider that allows us to swipe back and forth between these slides.

Step 7: Applying the slider
---------------------------
Let's take a step back. We're not writing a slider plugin. We're writing a plugin that allows us to view SharePoint data in a slider format. So that means we need to actually get a slider that works well, and wrap it in our functions. For this tutorial I've chosen the awesome [iDangerous Swiper](idangero.us/sliders/swiper/api.php). We're going to download the source files for that swiper and integrate it with our plugin.

iDangerous swiper comes with two files we need:
* idangerous.swiper-2.3.js
* idangerous.swiper.css

Put these files in their respective places (js/ and css/). Then go and reference them in index.html.

```html
<head>
	<title>SharePoint Slider</title>
	<script src="js/jquery-1.10.2.js" type="text/javascript"></script>
	<script src="js/idangerous.swiper-2.3.js" type="text/javascript"></script>
	<script src="js/spSlider.js"></script>

	<link href="css/idangerous.swiper.css" rel="stylesheet" />
	<link href="css/style.css" rel="stylesheet" />
</head>
```

While you have index.html open, go down to the `div` and add a class of *swiper-container*. This is what iDangerous needs in order to run the slider.

```html
<div id="text" class="swiper-container"></div>
```

Open up **spSlider.js** and lets get to work integrating the slider.

Create a new function above formatData called **applySlider**. This function will accept two parameters: the element it is being applied to, and the settings. All we're going to do is add a bit of functionality, and then just call the swiper on our element.

```javascript
var applySlider = function(el, settings) {

	// set the width and height of the container and slides
	el.children(".swiper-container").height(settings.height).width(settings.width);
	el.children(".swiper-slide").height(settings.height).width(settings.width);

	// options for the swiper that you want to set default
	var hardcodedOptions = {
		keyboardControl: true,
		loop: true
	};

	// extend the user's settings with these options
	$.extend(settings, hardcodedOptions);

	// call the swiper plugin on the element we passed
	var swiper = el.swiper(settings);

	// set click handlers on the navigation arrows
	el.children(".swipe-nav.left").click(function() {
		swiper.swipePrev();
	});
	el.children(".swipe-nav.right").click(function() {
		swiper.swipeNext();
	});
};
```

So our function is set. Now we need to call that function from within our plugin.

```javascript
$.fn.spSlider = function(options) {
	
	...

	var data = getData(settings);
	
	var slides = formatData(data, settings);

	self.html(slides);

	// apply the slider and then return it
	var swiper = applySlider(self, settings);

	return swiper;
};
```

**Apply some CSS**

Before we check out our index.html, lets add a bit of styling to style.css. Check out the source files of this repo and you'll find right.png and left.png which will replace the 'left' and 'right' links with nice arrows.

```css
.swiper-slide {
	position:relative;
	text-align:center;
	overflow:hidden;
}

.swipe-nav {
	position: absolute;
	top:40%;
	background:#000;
	text-indent:-9999px;
	height:40px;
	width:35px;
	z-index:9999;
	cursor:pointer;
}

.swipe-nav.right {
	right:0;
	background: transparent url('../img/right.png') no-repeat center center;
}
.swipe-nav.left {
	left:0;
	background: transparent url('../img/left.png') no-repeat center center;
}
.swipe-nav:hover {
	background-color:#333;
}
```

Now if you go and preview index.html you should see a swipeable div of photos! We're not done, but we've got a nice functioning slideshow. At this point it should be noted that this wrapper plugin can be used with **any** slider/swiper and with **any** database (not just SharePoint). All that needs to be replaced are the getData() function and applySlider() function in order to add all sorts of different functionality. Of course, for this tutorial the next step is to add SharePoint capability to the slider.

Step 8: Integrating SharePoint
------------------------------
We're going to be focusing on the getData() function for this part of the tutorial. But before we do, first go and grab [SPServices](http://spservices.codeplex.com) , put it in the **js/** folder, and reference it right above the reference to spSlider.js in index.html.

```html
<head>
	<title>SharePoint Slider</title>
	<script src="js/jquery-1.10.2.js" type="text/javascript"></script>
	<script src="js/idangerous.swiper-2.3.js" type="text/javascript"></script>
	<script src="js/jquery.SPServices-0.7.2.js" type="text/javascript"></script>
	<script src="js/spSlider.js"></script>

	<link href="css/idangerous.swiper.css" rel="stylesheet" />
	<link href="css/style.css" rel="stylesheet" />
</head>
```

So in getData() we're going to create a new SPServices call. Then we'll store the data in a variable, and return it. For now we're going to keep things **synchronous**. But later on I'll show you a method of asynchronously loading the data into our slider.

```javascript
var getData = function(settings) {
	var data = [];
	
	$().SPServices({
		operation: "GetListItems",
		async: false,
		webURL: settings.listURL,
		listName: settings.listName,
		CAMLRowLimit: settings.limit,
		CAMLViewFields: "<ViewFields Properties='True' />",
		completefunc: function(xData, Status) {
			data = $(xData.responseXML).SPFilterNode("z:row").SPXmlToJSON({
				includeAllAttrs: true,
				removeOws: true
			});
		}
	});

	return data;
};
```
One of the first things to pay attention to here is the settings.listURL and settings.listName in the function. These are settings the user needs to pass when calling the plugin.

```javscript
$("#test").spSlider({
	width:200,
	height:100,
	listURL: "https://sharepoint/subsite",
	listName: "Pictures",
	limit: 5,
	imgColumn: "EncodedAbsUrl"
});
```
If you're familiar with SPServices, then these two items will make sense. They are just the URL where the list is residing, and the name of the list itself. **Fair warning:** If you create lists with spaces or special characters in the name it will become very difficult to figure out the exact name of the list. You've been warned!

Also, note that the imgColumn has been set to **EncodedAbsUrl**. This is SharePoint's default name for the image column in a Picture Library. I advise using this plugin with a picture library, as it will require no customization on your part.

At this point, the plugin will grab data from SharePoint and put it in a slideshow. If you set the limit to something nice and small (like 5) it won't take too long to wait for your images to appear. However, if you have a lot of images it would probably be better to load things asynchronously. We'll cover that a bit later. But right now we're going to talk about how to integrate this plugin into an actual SharePoint site. This will first include a quick intro on how I'm using Grunt to package everything up nice and small.

Step 9: Packaging the project
-----------------------------
I'm not going to go into great detail here, as all of the files are included in the repo and you can look through them to see how things are setup.

* Install Node.js
* Install Grunt to your project
* Create a package.json file and a Gruntfile.js (see the repo)
* grunt the project

When the project has been grunted, it will create a few packaged files inside a **dist/** folder. This is especially important for the javascript. The file spSlider-pkg.min.js includes all of the libraries used. Also, grunting the project produces a minified CSS file that includes both CSS files used. It also copies the image files from the image folder (for the arrows).


Step 10: Installing the plugin for end users
--------------------------------------------
In order to use this plugin throughout your whole SharePoint site, you'll want to upload it to a central place. Because SPServices is amazing, you'll be able to query any list from anywhere inside the site collection.

**A: Create a document library**

Create a new document library and put the **dist/** folder in it, with all of its subfolders and files.

**B: Create a .txt file for each instantiation**

Create a file called slider.txt. In that file, we're basically going to put some html:

```html
<!-- include js and css files -->
<script src="https://sharepoint/subsite/slider/dist/js/spSlider-pkg.min.js" type="text/javascript"></script>
<link href="https://sharepoint/subsite/slider/dist/css/spSlider.min.css" rel="stylesheet" />

<!-- begin slider script and markup -->
<div id="slider1" class="swiper-container"></div>
<script>
	$("#slider1").spSlider({
		width: 400,
		height: 200,
		listURL: "https://sharepoint/community",
		listName: "Photos",
		limit: 3,
		imageColumn: "EncodedAbsUrl"
	});
</script>
<!-- end slider script and markup -->
```

**C: Put on the page**

Edit the page that you would like to put the slider on, and add a new Content Editor WebPart (CEWP). Click "Edit Webpart" in the little menu on the top right of the webpart. Then put the direct link to that text file you just created and click OK. Now the slider should appear on the page!

So, moving forward, a new .txt file should be created for each user. It doesn't have to reside in the same folder as the **dist/** folder, but it must have an absolute reference to those files.


Bonus: Making things asynchronous
---------------------------------
