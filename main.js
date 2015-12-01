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
        var postCode = $("#postcode").val();
        var cuisine = $("#cuisine").val();
        getRestaurants(postCode, cuisine);
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
                var resultsByCode = jQuery.grep(sortedRestaurants, function (a){
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
                        '<img src="' +
                        resultsByCode[i].Logo[0].StandardResolutionURL +
                        '"class="img-circle" id="rest-logo"></img>' +
                        '<div class="buttons">' +
                        '<a href="#" class="btn btn-default link" role="button">More Information</a>' +
                        '<a href="' +
                        resultsByCode[i].Url +
                        '" target="_blank" class="btn btn-default link" role="button">Restaurant Website</a>' +
                        '</div>' +
                        '<div class="info" >' +
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