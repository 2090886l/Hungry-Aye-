console.log("asda");
var baseURI = 'https://public.je-apis.com/';

$(document).ready(function(){

	$.ajaxSetup({
            headers: {
                'Accept-Tenant': 'uk',
                'Authorization': 'Basic VGVjaFRlc3RBUEk6dXNlcjI=',
            }
    });

    $("#search-button").click(function() {
        var postCode = $("#postCode").val();
        var cuisine = $("#cuisine").val();
        var restaurant = $("#restaurant").is(':checked');
        var takeAway = $("#takeAway").is(':checked');
        alert(cuisine + ", " + postCode + ", " + restaurant + ", " + takeAway);
    }); 
});

    

    getRestaurants = function (postcode, cuisine) {
        console.log('getting restaurants for postcode: ' + postcode);
        
        $.getJSON(baseURI + 'restaurants', {
                q: postcode.replace(' ', ''),
                c: cuisine,               
        },
            function (results) {
                console.log(results);
                
                //get array of resturant based on specific cuisine
                var cuisineRestaurants=jQuery.grep(results.Restaurants, function (a){
                    for(i = 0; i<a.CuisineTypes.length; i++){
                        if (a.CuisineTypes[i].Name==cuisine) return true;
                    }
                    return false;
                });
                console.log(cuisineRestaurants);
                
                //sort rests in descending order based on rating
                var sortedRestaurants = cuisineRestaurants.sort(function(a, b){
                    var a1= a.RatingStars, b1= b.RatingStars;
                    if(a1== b1) return 0;
                    return a1> b1? -1: 1;
                });
                
                //select rests based on postcode
                console.log(jQuery.grep(sortedRestaurants, function (a){
                    return a.Postcode.indexOf(postcode.toUpperCase())> -1;
                }));
            }
        );
    };