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
        getRestaurants(postCode, cuisine);


        $('#query-results').fadeIn(800);
        $("h1").animate({"margin-top":"2%"}, 800);
        $("#main-panel").animate({"margin-top":"2%"}, 800);
    }); 
});

    

    getRestaurants = function (postcode, cuisine) {
        console.log('getting restaurants for postcode: ' + postcode);
        
        $.getJSON(baseURI + 'restaurants', {
                q: postcode.replace(' ', ''),
                c: cuisine,               
        },
            function (results) {
                
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
                
                //select rests based on postcode
                var resultsByCode = jQuery.grep(sortedRestaurants, function (a){
                    return a.Postcode.indexOf(postcode.toUpperCase())> -1;
                });
                console.log(resultsByCode[1]);
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

                    $('#query-results').append('<div class="query-result">' +
                        '<img src="' +
                        resultsByCode[i].Logo[0].StandardResolutionURL +
                        '"class="img-circle" width="20%" height="20%"></img>' +
                        '<ul class="list-group info">' +
                        '<li class="list-group-item">Name: ' +
                        resultsByCode[i].Name +
                        '<li class="list-group-item">Address: ' +
                        resultsByCode[i].Address +
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
                        '</div>');
                }
            }
        );
    };