console.log("asda");
console.log($("#test"));
var baseURI = 'https://public.je-apis.com/';

$(document).ready(function(){

	$.ajaxSetup({
            headers: {
                'Accept-Tenant': 'uk',
                'Authorization': 'Basic VGVjaFRlc3RBUEk6dXNlcjI=',
            }
    });


	$( "#button" ).click(getRestaurants("g20"));
});

    getRestaurants = function (postcode) {
        console.log('getting restaurants for postcode: ' + postcode);

        $.getJSON(baseURI + 'restaurants', {
                q: postcode.replace(' ', ''),
                c: "Chinese"
        },
            function (results) {
                console.log(results);
            }
        );
    };