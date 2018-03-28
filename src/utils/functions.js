/* ===========================
   Author: Bhargav Gandhi (BG)
   Description: airMain.js

   Objects
   loctions, locCords

   Global variables
   geocoder, gmap, directionsRenderer, marker1, marker2, mapLine1, mapLine2

   Functions

   1. addClassTo(el,cl){ return};
   2. removeClassFrom(el, cl){ return};
   3. showElements(elem, sec, anim, remClass){};
   4. calculateNauticalMiles(distance){ return};
   5. viewOnMap(point1, point2);
   6. findGeolocation(loc);
   7. findDistance(addressFrom, addressTo);
   8. measureDistance();
   9. initMap();
   10. IIFE function (function(){...}());


   =========================== */

   var locations = {};
   var locCords = {};

   var geocoder, gmap, directionsRenderer, marker1, marker2, mapLine1, mapLine2;

   //This function is used to add given classname to the given HTML element
   function addClassTo(el, cl){
    return el.classList.add(cl);
  }

  //This function is used to remove given classname from given HTML element
  function removeClassFrom(el, cl){
    return el.classList.remove(cl);
  }

  //This function is used to remove a given class name from the given HTML element as well as add an animation classname to that HTML element.
  //By giving sec as milliseconds, delays the the process for that specific time frame.
  function showElements(elem, sec, anim, remClass){
    setTimeout(function(){
      removeClassFrom(elem, remClass);

      addClassTo(elem, "animated");
      addClassTo(elem, anim);
    }, sec);
  }

  //This function is used to calculate the Nautical Miles from the given distance in KM.
  function calculateNauticalMiles(distance){
    return (distance * 0.539957).toFixed(2);
  }

  //This function gets called inside findGeolocation() function after retreiving the co-ordinates and getting distance between points in nautical miles.
  //This function plots the line between the given 2 points and pins respective markers at given positions. It also bounds the map view to that specific location.
  //And binds both input value/name of location the marker info window, which can be seen when clicked on markers.
  function viewOnMap(point1, point2) {

    var faddressFrom = document.getElementById("airFrom").value;
    var faddressTo = document.getElementById("airTo").value;

    var pointFromTo = [point1, point2];

    if(mapLine1 !== undefined) {
      mapLine1.setMap(null);
    }
    if(mapLine2 !== undefined) {
      mapLine2.setMap(null);
    }

    mapLine1 = new google.maps.Polyline({
      path: pointFromTo,
      strokeColor: "#000853",
      strokeOpacity: 0.8,
      geodesic: true,
      strokeWeight: 4
    });
    mapLine1.setMap(gmap);

    mapLine2 = new google.maps.Polyline({
      path: pointFromTo,
      strokeColor: "#888888",
      strokeOpacity: 0.4,
      strokeWeight: 3
    });
    mapLine2.setMap(gmap);

    marker1.setPosition(point1);

    var newBounds = new google.maps.LatLngBounds();
    newBounds.extend(point1);
    newBounds.extend(point2);
    gmap.fitBounds(newBounds);

    var newInfoWindow1 = new google.maps.InfoWindow();

    newInfoWindow1.setContent(faddressFrom);

    google.maps.event.addListener(marker1, "click", function () {
      newInfoWindow1.open(gmap, marker1)
    });


    marker2.setPosition(point2);

    var newInfoWindow2 = new google.maps.InfoWindow();

    newInfoWindow2.setContent(faddressTo);

    google.maps.event.addListener(marker2, "click", function () {
      newInfoWindow2.open(gmap, marker2)
    })
  }

  //This function gets called within findDistance() function if validates. Also, to find location co-ordinates for both inputs, this function is also gets called within it.
  //Geocode() Google's geo-location service is used to find out the co-ordinates (lat and long) for given address/airport name.
  function findGeolocation(loc) {

    var totDistance = document.getElementById("totDistance"),
    mainDetails2 = document.getElementById("mainDetails");

    geocoder.geocode({
      componentRestrictions: {
        country: "US"
      },
      address: locations[loc]},

      function (results, status) {
        if(status == google.maps.GeocoderStatus.OK) {

          if(loc == "locFrom") {
            locCords.fromLat = parseFloat(results[0].geometry.location.lat());
            locCords.fromLng = parseFloat(results[0].geometry.location.lng());

            loc = "locTo";
            findGeolocation(loc);

          }else if(loc == "locTo"){

            locCords.toLat = parseFloat(results[0].geometry.location.lat());
            locCords.toLng = parseFloat(results[0].geometry.location.lng());

            var point1 = new google.maps.LatLng(locCords.fromLat, locCords.fromLng);
            var point2 = new google.maps.LatLng(locCords.toLat, locCords.toLng);

            var distance = (google.maps.geometry.spherical.computeDistanceBetween(point1, point2)/1000).toFixed(2);
            // getting distance and converting it to Kilometres with 2 values after decimal point.

            var nauticalMiles = calculateNauticalMiles(distance); // converting distance from KM to nautical miles.

            totDistance.innerHTML =  nauticalMiles + " nmi";

            showElements(mainDetails2, 0, "fadeIn", "Hide"); //Displays the Details section on the front-end to view the details.
            mainDetails2.scrollIntoView(); //scrolls the page to Details section.
            viewOnMap(point1, point2); // passes the retreived co-ordinate points to viewOnMap which plots line and markers on the given positions.
          }
        }
      });

  }

  //This function is called within MeasureDistance() function if validates. This function furhter validates input data and then if it validates
  //it will define the 2 objects and further calls findGeolocation() function;

  function findDistance(addressFrom, addressTo){

    var distanceFrom = document.getElementById("distanceFrom"),
    distanceTo = document.getElementById("distanceTo");

    if(addressFrom != "" && addressTo != "") {
      if(addressFrom != addressTo && addressFrom.length > 1  && addressTo.length > 1) {
        if(!geocoder) {
          return"Error! No Geocoder is found."
        }

        if(directionsRenderer != null) {
          directionsRenderer.setMap(null);
          directionsRenderer = null;
        }

        locations = {};
        locations ={locFrom : addressFrom, locTo: addressTo};

        locCords = {};
        locCords = {fromLat : 0, fromLng : 0,  toLat : 0, toLng : 0};

        distanceFrom.innerHTML = addressFrom;
        distanceTo.innerHTML = addressTo;

        findGeolocation("locFrom");

      }else{
        alert("Please Enter Valid Airport / Location!");
      }
    }else{
      alert("Please Enter Valid Airport / Location!");
    }

  }

  //This function fires when user clicks on Measure Button. Based on validation it further calls findDistance() function.
  function measureDistance(){

    var locFrom = document.getElementById("airFrom");
    var locTo = document.getElementById("airTo");

    addressFrom = locFrom.value;
    addressTo = locTo.value;

    if((airportLists.includes(addressFrom) == true && airportLists.includes(addressTo) == true) ||
      (airportLists.indexOf(addressFrom) > -1 || airportLists.indexOf(addressTo) > -1)){

      findDistance(addressFrom, addressTo);


  }else{
    alert("Please Enter Valid Airport / Location!");
  }
}

//IIFE function access the DOM HTML elements, creates awesomplete objects, add events to the HTML elements. This funciton invokes immediately.
(function(){

  var fadeClass = "fadeInUp",
  airBody = document.body,
  preloader = document.getElementById("preloader"),
  headers = document.querySelectorAll(".main header"),
  airFrom = document.getElementById("airFrom"),
  airTo = document.getElementById("airTo"),
  airMeasureBtn = document.getElementById("airMeasureBtn"),
  mainDetails = document.getElementById("mainDetails"),
  gmapSection = document.getElementById("gmapSection");

  addClassTo(airBody, "Hidden");
  removeClassFrom(preloader, "Hide");

  window.addEventListener("DOMContentLoaded", function() {
    setTimeout(function(){
      addClassTo(preloader, "Hide");

      removeClassFrom(airBody, "Hidden");
      addClassTo(airBody, "animated");
      addClassTo(airBody, "fadeIn");
    }, 500);
  }, true);

  addClassTo(headers[0], "Hide");
  addClassTo(airFrom, "Hide")
  addClassTo(airTo, "Hide")
  addClassTo(airMeasureBtn, "Hide")
  addClassTo(mainDetails, "Hide")
  addClassTo(gmapSection, "Hidden")

  showElements(headers[0], 600, fadeClass, "Hide");
  showElements(airFrom, 1000, fadeClass, "Hide");
  showElements(airTo, 1400, fadeClass, "Hide");
  showElements(airMeasureBtn, 1800, fadeClass, "Hide");
  showElements(gmapSection, 2500, "fadeIn", "Hidden");


  //Create Awesomplete object for From input box. This will contain the list of airport and matches the input value.
  var awesompleteFrom = new Awesomplete(airFrom, {
    minChars: 2
  });
  awesompleteFrom.list = airportLists;

  //Create Awesomplete object for To input box and attach airportLists to its list.
  var awesompleteTo = new Awesomplete(airTo, {
    minChars: 2
  });
  awesompleteTo.list = airportLists;

  //creating location icons HTML elements which will be added dynamically once their respective input boxes are loaded.
  var icon1 = document.createElement("i");
  icon1.classList.add("icon", "fa", "fa-map-marker", "Hide");

  var icon2 = document.createElement("i");
  icon2.classList.add("icon", "fa", "fa-map-marker", "Hide");

  setTimeout(function(){
    airFrom.insertAdjacentElement("afterend", icon1 );
    showElements(icon1, 0, fadeClass, "Hide");
  }, 1000);

  setTimeout(function(){
    airTo.insertAdjacentElement("afterend", icon2 );
    showElements(icon2, 0, fadeClass, "Hide");
  }, 1400);

  airFrom.addEventListener("change", function(){
    airTo.focus();
  }, true);

  airTo.addEventListener("change", function(){
    airMeasureBtn.click();
  }, true);

  //bind click event to the Measure button and call measureDistance() function.
  airMeasureBtn.addEventListener("click", measureDistance, false);

}());


//Initializes the Google Map with custom marker pinned to the map at center of US map.
function initMap() {

  geocoder = new google.maps.Geocoder();
  directionsRenderer = new google.maps.DirectionsRenderer();

  var center = new google.maps.LatLng(39.298063, -107.475168);

  gmap = new google.maps.Map(document.getElementById("gmap"), {
    zoom: 4,
    center: center,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false
  });

  var iconFrom = "assets/images/map-from.png";
  var iconTo = "assets/images/map-to.png";

  marker1 = new google.maps.Marker({
    map: gmap,
    position: center,
    animation: google.maps.Animation.DROP,
    icon: iconFrom
  });

  marker2 = new google.maps.Marker({
    map: gmap,
    position: center,
    animation: google.maps.Animation.DROP,
    icon: iconTo
  });

}
