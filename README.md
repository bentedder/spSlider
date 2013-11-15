SharePoint Slider
=================

This uses the [iDangerous Swiper](http://www.idangero.us/sliders/swiper/api.php) for the sliding functionality. It also uses the [jQuery SPServices library](http://spservices.codeplex.com) to query data from SharePoint. There can be multiple sliders on one page. Just make sure each has a unique ID, but each one must have the class of "swiper-container" (the only requirement).


```javascript
$("#slider1").spSlider({
  
  // required parameters for the slider
  width:    600,                       // number of pixels wide
  height:   150,                       // number of pixels high
  listURL:  "https://mysite/subsite/", // url where the list resides
  listName: "Pictures"                 // name of the list

  // put other options for the iDangerous swiper here:
  slidesPerView: 2,
  loop: true

});
```

All options for the swiper can be found in the table below, or on the [iDangerous Swiper website](http://www.idangero.us/sliders/swiper/api.php). Note, the listName is notoriously hard to figure out in SharePoint. It's always best to create a list without any spaces in the name. Then after it is created you can go in and add space back to the name. You should use the non-spaced name for this plugin. 