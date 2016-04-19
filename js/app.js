'use strict';
var map;
//Initiate map
function initMap() {
    //Initialize the map on the view and ser default  lat , lng and zoom.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 42.360492,
            lng: -71.055107
        },
        zoom: 12
    });



};

