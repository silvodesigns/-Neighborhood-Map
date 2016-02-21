'use strict';


/*

///CODE REFERENCE
Variables:
self.-----This Variable refers to the ViewModel function.
length-----This variable contains the length of the  number of places we are working with in the application.
nytHeaderElem----- This Variable refers to an observable header element in the HTML for each news item pulled from the NYT news.
nytElem-----This Variable refers to an observable ul element in the HTML for each news item pulled from the NYT news, which contains the link for all the news.
articles-----This variable containes an observable array that holds all the information of each of the news articles pulled from the NYT; these are url, headline and paragraph.
images-----This is an array which contains all the images from each of the places that appears when a marker is clicked and the infowindow opens.


Functions:
self.filter()-----This observable watches the value coming in from the input text in the html.
self.Markers([])-----This observable array is initialy empty, but it is used to store the markers later as they are being created and placed on the map.
self.places()-----This observable array contains all the data about each of the places to be placed in the map.
self.filterSearch()----- This computed observable is used later on as the varibale containing the info about each marker entry in the map.
self.timesAPI()-----This function makes an  API request to the NYTimes when a maker from the map is clicked. This function is called within thr createMarkers function.
self.filterSearch()-----//This function filters the name of places available based on  the user's input and dysplays the result on the list view.
self.generateStreetViewImages()-----This function generates images to be displayed in the  info window based on the marker's location.
self.generateInfoWindowData()-----This function genates the info that appears on the infoWindow for each marker when it is clicked.
self.createMarkers()-----This function creates the markers  and  places them on the map.
startViewModel()-----This function starts the whole application and Iniates the View and the map.

*/



function ViewModel() {
    var self = this;
    self.filter = ko.observable();
    self.places = ko.observableArray([{
        name: "Museum of Fine Arts, Boston",
        address: "465 Huntington Ave, Boston, MA 02115",
        lat: 42.341801,
        lng: -71.094302,
        id: 0,
        show: true

    }, {
        name: "Massachusetts College of Art and Design, Boston",
        address: "621 Huntington Ave, Boston, MA 02115",
        lat: 42.337125,
        lng: -71.099145,
        id: 1,
        show: true

    }, {
        name: "Franklin Park Zoo, Boston",
        address: "1 Franklin Park Rd, Boston, MA 02121",
        lat: 42.303248,
        lng: -71.086903,
        id: 2,
        show: true

    }, {
        name: "Boston Opera House",
        address: "539 Washington St, Boston, MA 02111",
        lat: 42.353976,
        lng: -71.062302,
        id: 3,
        show: true

    }, {
        name: "Harvard Square",
        address: "18 Brattle St #352, Cambridge, MA 02138",
        lat: 42.375395,
        lng: -71.120372,
        id: 4,
        show: true

    }]);

    var length = self.places().length;



    self.header = 'New York Times Articles  ';
    self.articles = ko.observableArray([



        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        },

        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        },

        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        },

        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        },

        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        },

        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        },

        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        },

        {
            url: ko.observable(""),
            headline: ko.observable(""),
            p: ko.observable("")
        }




    ]);
    //This functions makes an  API request to the NYTimes when a maker on from the map is clicked. This function is called within thr createMarkers function.
    self.timesAPI = function(times) {
        var nytimesURL = "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + times + "&sort=newest&api-key=37f983f55e3a2e5d63ee4d3b4e71d58c:2:73773273";
        $.getJSON(nytimesURL, function(data) {
            var articles = data.response.docs;
            self.header += times;
            for (var i = 0; i < 5; i++) {
                var article = articles[i];
                self.articles()[i].url(article.web_url);
                self.articles()[i].headline(article.headline.main);
                self.articles()[i].p(article.snippet);
            }



        }).fail(function(e) {
         alert("New York Times API could not load at this moment");
        }); // in case error occurs displays error message;
    };



    self.images = ko.observableArray([]);
    self.generateStreetViewImages = function() {


        for (var i = 0; i < length; i++) {

            var img = '<img src="https://maps.googleapis.com/maps/api/streetview?size=200x200&location=' + self.places()[i].name + '&key=AIzaSyAtABxc1zGLRvkNG3ux8u3APQ95cOlbrso">';
            self.images().push(img);
        }


    };
    self.generateStreetViewImages();




    self.info = ko.observableArray([]);
    self.generateInfoWindowData = function() {
        for (var i = 0; i < length; i++) {

            var data = '<div id="content">' + '<h1 id="firstHeading" class="firstHeading">' + self.places()[i].name + '</h1>' +
                '<p>' + self.places()[i].address + '</p>' +
                '</div>' + self.images()[i];

            self.info().push(data);

        }



    };
    self.generateInfoWindowData();

    self.Markers = ko.observableArray([]);
    //This function create the markers on the map using information from our places() data
    self.createMarkers = function() {

        var infowindow = new google.maps.InfoWindow;
        for (var i = 0; i < length; i++) {
            var marker = new google.maps.Marker({
                position: {
                    lat: self.places()[i].lat,
                    lng: self.places()[i].lng
                },
                map: map,
                visible: self.places()[i].show,
                animation: google.maps.Animation.BOUNCE,
                title: self.places()[i].name
            });
            marker.setAnimation(null);
            self.Markers().push(marker);

            //add event listener to each of the markers.  turn on and off when clicked; also makes the info window pop for each marker
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infowindow.setContent(self.info()[i]);
                    infowindow.maxWidth = 300;
                    infowindow.open(map, marker);
                    if (this.getAnimation() === null) {
                        this.setAnimation(google.maps.Animation.BOUNCE);
                        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                        setTimeout(function() {
                            marker.setAnimation(null);
                            infowindow.close();
                        }, 10000);
                        setTimeout(function() {
                            marker.setIcon(null);
                        }, 10000);
                    } else {
                        this.setAnimation(null);
                        marker.setIcon(null);
                    }


                    self.timesAPI(self.Markers()[i].title);

                };
            })(marker, i));


        } /*------------------------------*/


    };
    self.createMarkers();

    //This function is used to set all markers in the array visible in the filterMarkers function
    self.setAllShow = function() {
        if (self.filter().length <= 0 || self.filter() === "")
            for (var i = 0; i < self.Markers().length; i++) {
                self.Markers()[i].setVisible(true);
            }
    };
    //This function filters the name of places available based on  the user's input and dysplays the result on the list view
    self.filterSearch = ko.computed(function() {
        return this.places().filter(function(place) {
            if (!self.filter() || place.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1)
                return place;


        });
    }, this);


    //This function  determines which markers should be hid or shown on the map base on the user's input

    self.visibleMarkers = function() {

        for (var i = 0; i < self.Markers().length; i++) {
            self.Markers()[i].setVisible(false);
        }

        var a = self.filterSearch();
        a.forEach(function(entry) {
            self.Markers()[entry.id].setVisible(true);
        });



    };


    // This function is called by the input on the event keyup to filter the Markers, it invoked two other functions based on wheather the filter value is empty or not
    self.filterMarkers = function() {
        if (self.filter() !== "") {
            self.visibleMarkers();
        } else {
            self.setAllShow();
        }
    };

    self.evaluate = function() {

        if (self.filter() == '') {
            for (var i = 0; i < 5; i++)
                self.Markers()[i].setVisible(true);
        }


    };
    // This function makes the marker animate when it is selected from the listview
    self.selectMarker = function(item) {
        var infowindow = new google.maps.InfoWindow;
        self.Markers().forEach(function(entry) {

            if (entry.animation == google.maps.Animation.BOUNCE) {
                entry.setAnimation(null);


            }
            if (entry.title.toLowerCase() == item.name.toLowerCase()) {
                entry.setAnimation(google.maps.Animation.BOUNCE);

                infowindow.setContent(self.info()[item.id]);
                infowindow.maxWidth = 300;
                infowindow.open(map, entry);
                setTimeout(function() {
                    entry.setAnimation(null);
                    infowindow.close();
                }, 2000); // stops animation fo markers after 2 seconds and closes infowindow



            }


        });
    };

    self.clearnews = function() {

        for (var i = 0; i < 8; i++) {

            self.articles()[i].url('');
            self.articles()[i].headline('');
            self.articles()[i].p('');
        }

    };






}

function startViewModel() {
    initMap();
    ko.applyBindings(new ViewModel());

}