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
	};
}(jQuery));
```

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

***
**Catchup**

Make sure everything looks like it should:

index.html
```html
<!DOCTYPE html>
<html>
<head>
	<title>SharePoint Slider</title>
	<script src="js/jquery-1.10.2.js" type="text/javascript"></script>
	<script src="js/spSlider.js"></script>
	<link href="css/style.css" rel="stylesheet" />
</head>
<body>
	
	<div id="test"></div>

	<script>
		$("#test").spSlider({
			width:300,
			height:250
		});
	</script>

</body>
</html>
```
***