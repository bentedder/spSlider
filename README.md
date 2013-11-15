SharePoint Slider
=================

This uses the [iDangerous Swiper](http://www.idangero.us/sliders/swiper/api.php) for the sliding functionality. It also uses the [jQuery SPServices library](http://spservices.codeplex.com) to query data from SharePoint. There can be multiple sliders on one page. Just make sure each has a unique ID, but each one must have the class of "swiper-container" (the only requirement).

HTML markup
-----------
Put this in a Content Editor Webpart (CEWP)
```html
<script src="dist/js/spSlider.min.js" type="text/javascript"></script>
<link href="dist/css/spSlider.min.css" type="text/javascript"></script>
<div id="slider1" class="swiper-container"></div>
```

Plugin implementation
---------------------
Put this javascript below the slider (in the same CEWP).

```javascript
$("#slider1").spSlider({
  
  // required parameters for the slider
  width:    600,                       // number of pixels wide
  height:   150,                       // number of pixels high
  listURL:  "https://mysite/subsite/", // url where the list resides
  listName: "Pictures", 	           // name of the list
  categories: ["MS","HS"]  			   // categories of pics               

  // put other options for the iDangerous swiper here:
  slidesPerView: 2,
  loop: true

});
```

All options for the iDangerous swiper can be found on the [iDangerous Swiper website](http://www.idangero.us/sliders/swiper/api.php).

Note, the listName is notoriously hard to figure out in SharePoint. It's always best to create a list without any spaces in the name. Then after it is created you can go in and add space back to the name. You should use the non-spaced name for this plugin. 

How it's done
-------------
If you check out the files in the /src directory you'll see that I'm combining everything into one tiny script. The goal is for the end user to not have to worry about jQuery, sliders, plugins, etc. They just need to put in one script, one css, and some markup.

So basically I created a jQuery plugin called **spSlider**. This plugin gathers options from the user, queries SharePoint, creates the HTML for the list, and puts it in the container element. Then it has a method called **applyPlugin**, where I've put the code for applying all settings from the user to the iDangerous swiper plugin. It's built so that if you have a swiper you prefer to use, you can swap it out.

It's super basic. I'd eventually like to add lazyloading, etc. But I also kind of see that as the responsibility of the plugin. This is essentially a wrapper for any jQuery slider that makes it useable in SharePoint.