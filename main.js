
var baseURI = 'https://public.je-apis.com/';
var geocoder = new google.maps.Geocoder();
var map;        
var resultsByCode;
//var geocoder = new google.maps.Geocoder;


$(document).ready(function(){
    var pos = getLocation();
});

$(document).ready(function(){

	$.ajaxSetup({
            headers: {
                'Accept-Tenant': 'uk',
                'Authorization': 'Basic VGVjaFRlc3RBUEk6dXNlcjI=',
            }
    });

    $("#search-button").click(function() {
        var postCode = $("#postcode").val();
        var cuisine = $("#cuisine").val();
        getRestaurants(postCode, cuisine);
        $("h1").animate({"margin-top":"2%"}, 800);
        $("#main-panel").animate({"margin-top":"2%"}, 800);
    }); 
    
    
    $(window).scroll(function(){
		if ($(this).scrollTop() > 1000) {
			$('#scrollToTop').fadeIn();
		} else {
			$('#scrollToTop').fadeOut();
		}
	});
    
    $("a[href='#top']").click(function() {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

    $("input").keypress(function(event) {
        var postCode = $("#postcode").val();
        var cuisine = $("#cuisine").val();
        if (event.which == 13) {
            event.preventDefault();
            getRestaurants(postCode, cuisine);
            $("h1").animate({"margin-top":"2%"}, 800);
            $("#main-panel").animate({"margin-top":"2%"}, 800);
        }
});
});

    

    getRestaurants = function (postcode, cuisine) {
        console.log('getting restaurants for postcode: ' + postcode);
        
        $.getJSON(baseURI + 'restaurants', {
                q: postcode.replace(' ', ''),
                c: cuisine,               
        },
            function (results) {

                $('#query-results').fadeOut(0);
                //get array of resturant based on specific cuisine
                var cuisineRestaurants=jQuery.grep(results.Restaurants, function (a){
                    for(i = 0; i<a.CuisineTypes.length; i++){
                        if (a.CuisineTypes[i].Name==cuisine) return true;
                    }
                    return false;
                });
                
                //sort rests in descending order based on rating
                var sortedRestaurants = cuisineRestaurants.sort(function(a, b){
                    var a1= a.RatingStars, b1= b.RatingStars;
                    if(a1== b1) return 0;
                    return a1> b1? -1: 1;
                });
                console.log(sortedRestaurants);
                //select rests based on postcode
                resultsByCode = jQuery.grep(sortedRestaurants, function (a){
                    //return a.Postcode.indexOf(postcode.toUpperCase())> -1;
                    return a.IsCloseBy;
                });
                
                var resultsLeft = jQuery.grep(sortedRestaurants, function (a){
                    //return a.Postcode.indexOf(postcode.toUpperCase())> -1;
                    return !a.IsCloseBy;
                });
                
                resultsByCode = jQuery.merge(resultsByCode, resultsLeft);
                console.log(resultsByCode);
                $('#query-results').empty();
                for (i = 0; i<resultsByCode.length; i++) {
                    if (resultsByCode[i].IsOpenNow) {
                        var open = "open.jpg";
                    } else {
                        var open = "closed.jpg";
                    }
                    if (resultsByCode[i].IsOpenNowForDelivery) {
                        var delivery = "open.jpg";
                    } else {
                        var delivery = "closed.jpg";
                    }
                    if (resultsByCode[i].IsHalal) {
                        var halal = "open.jpg";
                    } else {
                        var halal = "closed.jpg";
                    }

                    $('#query-results').append('<div class="container">' +
                        '<div class="row" >' +
                        '<div class="col-md-2 col-lg-8">' +
                        '<div class="query-result" >' +
                        '<br>' +
                        '<a href="#myModal" data-toggle="modal" onclick="doModal(event);">' +
                        '<img src="' +
                        resultsByCode[i].Logo[0].StandardResolutionURL +
                        '"class="img-circle ' + resultsByCode[i].Name +'\" id="rest-logo-' + i + '\"></img></a>' +
                        //'<div class="buttons">' +
                        //'<a href="' +
                        //resultsByCode[i].Url +
                        //'" target="_blank" class="btn btn-default link" role="button">Restaurant Website</a>' +
                        //'</div>' +
                        '<div class="info" >' +
                        '<ul class="list-group info">' +
                        '<li class="list-group-item">Name: ' +
                        resultsByCode[i].Name +
                        '<li class="list-group-item" id="rest-address-' + i + '\">Address: ' +
                        resultsByCode[i].Address + ", " + resultsByCode[i].Postcode + 
                        '<li class="list-group-item" id="rest-rating-' + '\">' +
                        '<div class="star-ratings-css">' +
                          '<div class="star-ratings-css-top" style="width: '+ resultsByCode[i].RatingStars/6*100 + '%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>' +
                          '<div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>' +
                        '</div>' +
                        // '<li class="list-group-item">Delivery now: ' +
                        // '<img class="available-image " src="' +
                        // delivery +
                        // '"</img>' +
                        // '<li class="list-group-item">Halal: ' +
                        // '<img class="available-image " src="' +
                        // halal +
                        // '"</img>' +
                        '</ul>' +
                        '</div>' +
                        '<br>' +
                        '</div>' +
                        '</div>' +
                        '</div>');
                $('#query-results').fadeIn(400);
                }
            }
        );
    };

function doModal(event) {

     

    last_char = event.target.id.substr(event.target.id.length - 1);
    restaurant_id = "rest-address-" + last_char;
    
    $.getJSON(baseURI + 'restaurants/' + resultsByCode[last_char].Id + "/details", 
            function (results) {
                console.log(results);
   
    header = $(event.target).attr('class').replace("img-circle ",'');
    src = $('#' + event.target.id).attr('src');

    restaurant_address = $('#' + restaurant_id).text().replace("Address: ",'');
    address_long_lat = codeAddress(restaurant_address);
    $('#modal-title').html(header);
    $('#modal-logo').attr('src',src);

    if (resultsByCode[last_char].IsOpenNow) {
        var open = "open.jpg";
    } else {
        var open = "closed.jpg";
    }
    if (resultsByCode[last_char].IsOpenNowForDelivery) {
        var delivery = "open.jpg";
    } else {
        var delivery = "closed.jpg";
    }
    if (resultsByCode[last_char].IsHalal) {
        var halal = "open.jpg";
    } else {
        var halal = "closed.jpg";
    }

    var description = results.Description;
    if (description == ""){
        description = "Come to our great restaurant to taste the most magical food you have ever tasted! Not only the food but our customer service are top notch. Hope to see you soon!";
    }
    
    $('.modal-info').html('<div class="list-info">' +
    '<ul class="list-group">' +
    '<li class="list-group-item">Description: ' +
     description +
    '<li class="list-group-item">Open: ' +
    '<img class="available-image " src="' +
    open +
    '"</img>' +
    '<li class="list-group-item">Delivery now: ' +
    '<img class="available-image " src="' +
    delivery +
    '"</img>' +
    '<li class="list-group-item">Halal: ' +
    '<img class="available-image " src="' +
    halal +
    '"</img>' +
    '</ul>' +
    '</div>')
             }
    );
}


function initialize() {
  var mapProp = {
      //center:myCenter,
      zoom: 16,
      draggable: true,
      scrollwheel: true,
      mapTypeId:google.maps.MapTypeId.ROADMAP
  };
  
  map=new google.maps.Map(document.getElementById("map-canvas"),mapProp);

};
google.maps.event.addDomListener(window, 'load', initialize);

google.maps.event.addDomListener(window, "resize", resizingMap());
$(document).ready(function() {
  $('#myModal').on('show.bs.modal', function (e) {
    resizeMap();
  });
});

function resizeMap() {
   if(typeof map =="undefined") return;
   setTimeout( function(){resizingMap();} , 400);
}

function resizingMap() {
   if(typeof map =="undefined") return;
   var center = map.getCenter();
   google.maps.event.trigger(map, "resize");
   map.setCenter(center); 
}

function codeAddress(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map, 
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }; 
      geocodeLatLng(geocoder, pos)
      return pos;
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function geocodeLatLng(geocoder, pos) {
  var latlng = {lat: parseFloat(pos.lat), lng: parseFloat(pos.lng)};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        var address = results[0].address_components;
        $("#postcode").val(address[address.length - 1].long_name);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
// =======
// var baseURI = 'https://public.je-apis.com/';
// var geocoder = new google.maps.Geocoder();
// var map;        
// var resultsByCode;
// //var geocoder = new google.maps.Geocoder;


// $(document).ready(function(){
//     var pos = getLocation();
// });

// $(document).ready(function(){

// 	$.ajaxSetup({
//             headers: {
//                 'Accept-Tenant': 'uk',
//                 'Authorization': 'Basic VGVjaFRlc3RBUEk6dXNlcjI=',
//             }
//     });

//     $("#search-button").click(function() {
//         var postCode = $("#postcode").val();
//         var cuisine = $("#cuisine").val();
//         getRestaurants(postCode, cuisine);
//         $("h1").animate({"margin-top":"2%"}, 800);
//         $("#main-panel").animate({"margin-top":"2%"}, 800);
//     }); 
    
    
//     $(window).scroll(function(){
// 		if ($(this).scrollTop() > 1000) {
// 			$('#scrollToTop').fadeIn();
// 		} else {
// 			$('#scrollToTop').fadeOut();
// 		}
// 	});
    
//     $("a[href='#top']").click(function() {
//         $("html, body").animate({ scrollTop: 0 }, "slow");
//         return false;
//     });

//     $("input").keypress(function(event) {
//         var postCode = $("#postcode").val();
//         var cuisine = $("#cuisine").val();
//         if (event.which == 13) {
//             event.preventDefault();
//             getRestaurants(postCode, cuisine);
//             $("h1").animate({"margin-top":"2%"}, 800);
//             $("#main-panel").animate({"margin-top":"2%"}, 800);
//         }
// });
// });

    

//     getRestaurants = function (postcode, cuisine) {
//         console.log('getting restaurants for postcode: ' + postcode);
        
//         $.getJSON(baseURI + 'restaurants', {
//                 q: postcode.replace(' ', ''),
//                 c: cuisine,               
//         },
//             function (results) {
//                 $('#query-results').fadeOut(0);
//                 //get array of resturant based on specific cuisine
//                 var cuisineRestaurants=jQuery.grep(results.Restaurants, function (a){
//                     for(i = 0; i<a.CuisineTypes.length; i++){
//                         if (a.CuisineTypes[i].Name==cuisine) return true;
//                     }
//                     return false;
//                 });
                
//                 //sort rests in descending order based on rating
//                 var sortedRestaurants = cuisineRestaurants.sort(function(a, b){
//                     var a1= a.RatingStars, b1= b.RatingStars;
//                     if(a1== b1) return 0;
//                     return a1> b1? -1: 1;
//                 });
//                 console.log(sortedRestaurants);
//                 //select rests based on postcode
//                 resultsByCode = jQuery.grep(sortedRestaurants, function (a){
//                     //return a.Postcode.indexOf(postcode.toUpperCase())> -1;
//                     return a.IsCloseBy;
//                 });
                
//                 var resultsLeft = jQuery.grep(sortedRestaurants, function (a){
//                     //return a.Postcode.indexOf(postcode.toUpperCase())> -1;
//                     return !a.IsCloseBy;
//                 });
                
//                 resultsByCode = jQuery.merge(resultsByCode, resultsLeft);
//                 console.log(resultsByCode);
//                 $('#query-results').empty();
//                 for (i = 0; i<resultsByCode.length; i++) {
//                     if (resultsByCode[i].IsOpenNow) {
//                         var open = "open.jpg";
//                     } else {
//                         var open = "closed.jpg";
//                     }
//                     if (resultsByCode[i].IsOpenNowForDelivery) {
//                         var delivery = "open.jpg";
//                     } else {
//                         var delivery = "closed.jpg";
//                     }
//                     if (resultsByCode[i].IsHalal) {
//                         var halal = "open.jpg";
//                     } else {
//                         var halal = "closed.jpg";
//                     }

//                     $('#query-results').append('<div class="container">' +
//                         '<div class="row" >' +
//                         '<div class="col-md-2 col-lg-8">' +
//                         '<div class="query-result" >' +
//                         '<br>' +
//                         '<a href="#myModal" data-toggle="modal" onclick="doModal(event);">' +
//                         '<img src="' +
//                         resultsByCode[i].Logo[0].StandardResolutionURL +
//                         '"class="img-circle ' + resultsByCode[i].Name +'\" id="rest-logo-' + i + '\"></img></a>' +
//                         //'<div class="buttons">' +
//                         //'<a href="' +
//                         //resultsByCode[i].Url +
//                         //'" target="_blank" class="btn btn-default link" role="button">Restaurant Website</a>' +
//                         //'</div>' +
//                         '<div class="info" >' +
//                         '<ul class="list-group info">' +
//                         '<li class="list-group-item">Name: ' +
//                         resultsByCode[i].Name +
//                         '<li class="list-group-item" id="rest-address-' + i + '\">Address: ' +
//                         resultsByCode[i].Address +
//                         '<li class="list-group-item" id="rest-rating-' + '\">' +
//                         '<div class="star-ratings-css">' +
//                           '<div class="star-ratings-css-top" style="width: '+ resultsByCode[i].RatingStars/6*100 + '%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>' +
//                           '<div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>' +
//                         '</div>' +
//                         // '<li class="list-group-item">Delivery now: ' +
//                         // '<img class="available-image " src="' +
//                         // delivery +
//                         // '"</img>' +
//                         // '<li class="list-group-item">Halal: ' +
//                         // '<img class="available-image " src="' +
//                         // halal +
//                         // '"</img>' +
//                         '</ul>' +
//                         '</div>' +
//                         '<br>' +
//                         '</div>' +
//                         '</div>' +
//                         '</div>');
//                 $('#query-results').fadeIn(400);
//                 }
//             }
//         );
//     };

// function doModal(event) {
//     last_char = event.target.id.substr(event.target.id.length - 1);
//     restaurant_id = "rest-address-" + last_char;
//     header = $(event.target).attr('class').replace("img-circle ",'');
//     src = $('#' + event.target.id).attr('src');

//     restaurant_address = $('#' + restaurant_id).text().replace("Address: ",'');
//     address_long_lat = codeAddress(restaurant_address);
//     $('#modal-title').html(header);
//     $('#modal-logo').attr('src',src);

//     if (resultsByCode[last_char].IsOpenNow) {
//         var open = "open.jpg";
//     } else {
//         var open = "closed.jpg";
//     }
//     if (resultsByCode[last_char].IsOpenNowForDelivery) {
//         var delivery = "open.jpg";
//     } else {
//         var delivery = "closed.jpg";
//     }
//     if (resultsByCode[last_char].IsHalal) {
//         var halal = "open.jpg";
//     } else {
//         var halal = "closed.jpg";
//     }

//     $('.modal-info').html('<div class="list-info">' +
//     '<ul class="list-group">' +
//     '<li class="list-group-item">Open: ' +
//     '<img class="available-image " src="' +
//     open +
//     '"</img>' +
//     '<li class="list-group-item">Delivery now: ' +
//     '<img class="available-image " src="' +
//     delivery +
//     '"</img>' +
//     '<li class="list-group-item">Halal: ' +
//     '<img class="available-image " src="' +
//     halal +
//     '"</img>' +
//     '</ul>' +
//     '</div>')
// }


// function initialize() {
//   var mapProp = {
//       //center:myCenter,
//       zoom: 16,
//       draggable: true,
//       scrollwheel: true,
//       mapTypeId:google.maps.MapTypeId.ROADMAP
//   };
  
//   map=new google.maps.Map(document.getElementById("map-canvas"),mapProp);

// };
// google.maps.event.addDomListener(window, 'load', initialize);

// google.maps.event.addDomListener(window, "resize", resizingMap());
// $(document).ready(function() {
//   $('#myModal').on('show.bs.modal', function (e) {
//     resizeMap();
//   });
// });

// function resizeMap() {
//    if(typeof map =="undefined") return;
//    setTimeout( function(){resizingMap();} , 400);
// }

// function resizingMap() {
//    if(typeof map =="undefined") return;
//    var center = map.getCenter();
//    google.maps.event.trigger(map, "resize");
//    map.setCenter(center); 
// }

// function codeAddress(address) {
//     geocoder.geocode( { 'address': address}, function(results, status) {
//       if (status == google.maps.GeocoderStatus.OK) {
//         //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
//         map.setCenter(results[0].geometry.location);
//         var marker = new google.maps.Marker({
//             map: map, 
//             position: results[0].geometry.location
//         });
//       } else {
//         alert("Geocode was not successful for the following reason: " + status);
//       }
//     });
//   }

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       }; 
//       geocodeLatLng(geocoder, pos)
//       return pos;
//     }, function() {
//       handleLocationError(true, infoWindow, map.getCenter());
//     });
//   } else {
//     // Browser doesn't support Geolocation
//     handleLocationError(false, infoWindow, map.getCenter());
//   }

// }

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//                         'Error: The Geolocation service failed.' :
//                         'Error: Your browser doesn\'t support geolocation.');
// }

// function geocodeLatLng(geocoder, pos) {
//   var latlng = {lat: parseFloat(pos.lat), lng: parseFloat(pos.lng)};
//   geocoder.geocode({'location': latlng}, function(results, status) {
//     if (status === google.maps.GeocoderStatus.OK) {
//       if (results[1]) {
//         var address = results[0].address_components;
//         $("#postcode").val(address[address.length - 1].long_name);
//       } else {
//         window.alert('No results found');
//       }
//     } else {
//       window.alert('Geocoder failed due to: ' + status);
//     }
//   });
// >>>>>>> Stashed changes
// }