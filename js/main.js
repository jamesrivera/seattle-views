var map;

//Load Google Maps API
function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=false&callback=initialize';
    document.body.appendChild(script);
}
window.onload = loadScript;

//Use to populate info about locations
var markers = [{
    title: "Seattle Waterfront",
    address: "Alaskan Way & Seneca Street",
    cityState: "Seattle, WA",
    latitude: 47.605452,
    longitude: -122.340148,
    photo: "https://farm2.staticflickr.com/1550/25947363854_fd22c4d23d_o.png",
    id: "nav0",
    visible: ko.observable(true),
    flag: true
}, {
    title: "North Alki Beach",
    address: "Alki Avenue & 63rd Avenue",
    cityState: "Seattle, WA",
    latitude: 47.578262,
    longitude: -122.413251,
    photo: "https://farm2.staticflickr.com/1472/25949420673_50bcb116e4_o.png",
    id: "nav1",
    visible: ko.observable(true),
    flag: true
}, {
    title: "Luna Park",
    address: "37 Alki Trail",
    cityState: "Seattle, WA",
    latitude: 47.595290,
    longitude: -122.387547,
    photo: "https://farm2.staticflickr.com/1695/25947363784_29036fcf0c_o.png",
    id: "nav2",
    visible: ko.observable(true),
    flag: true
}, {
    title: "South Alki Beach",
    address: "Beach Drive & Andover Street",
    cityState: "Seattle, WA",
    latitude: 47.568520,
    longitude: -122.409914,
    photo: "https://farm2.staticflickr.com/1466/25949420623_32c6569063_o.png",
    id: "nav3",
    visible: ko.observable(true),
    flag: true
}, {
    title: "Golden Gardens Park",
    address: "8498 Seaview Place",
    cityState: "Seattle, WA",
    latitude: 47.689707,
    longitude: -122.402325,
    photo: "https://farm2.staticflickr.com/1660/26486284001_8f103b4a4d_o.png",
    id: "nav4",
    visible: ko.observable(true),
    flag: true
}];

//Initialize map
function initialize() {
    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(47.630369, -122.373877),
        mapTypeControl: false,
        disableDefaultUI: true,
        styles: [{
            stylers: [{
                saturation: -100
            }, {
                lightness: 0
            }, {
                gamma: 0.4
            }]
        }]
    };

    if ($(window).width() <= 1080) {
        mapOptions.zoom = 12;
    }
    if ($(window).width() < 900 || $(window).height() < 600) {
        hideNav();
    }

    map = new google.maps.Map(document.getElementById('canvas'), mapOptions);

    setMarkers(markers);

    setAllMap();

    //Reset map on click & resize
    function resetMap() {
        var windowWidth = $(window).width();
        if (windowWidth <= 1080) {
            map.setZoom(12);
            map.setCenter(mapOptions.center);
        } else if (windowWidth > 1080) {
            map.setZoom(12);
            map.setCenter(mapOptions.center);
        }
    }
    $("#reset").click(function() {
        resetMap();
    });
    $(window).resize(function() {
        resetMap();
    });
}

//Determine if markers should be visible & pass to Knockout
function setAllMap() {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].flag === true) {
            markers[i].holdMarker.setMap(map);
        } else {
            markers[i].holdMarker.setMap(null);
        }
    }
}

//Sets the markers and info windows on map
function setMarkers(location) {

    for (i = 0; i < location.length; i++) {
        location[i].holdMarker = new google.maps.Marker({
            position: new google.maps.LatLng(location[i].latitude, location[i].longitude),
            map: map,
            title: location[i].title,
            icon: {
                path: fontawesome.markers.MAP_MARKER,
                scale: 0.5,
                strokeWeight: 1,
                strokeColor: 'black',
                strokeOpacity: 1,
                fillColor: '#6f3',
                fillOpacity: 0.9,
            }
        });

        //Bind content to info window
        location[i].contentString = '<img src="' +
            location[i].photo + '"></a><br><hr style="margin-bottom: 5px"><strong>' +
            location[i].title + '</strong><br><p>' +
            location[i].address + '<br>' +
            location[i].cityState;

        var infowindow = new google.maps.InfoWindow({
            content: markers[i].contentString
        });

        //Click marker to view & center info window 
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(location[i].contentString);
                infowindow.open(map, this);
                var windowWidth = $(window).width();
                if (windowWidth <= 1080) {
                    map.setZoom(16);
                } else if (windowWidth > 1080) {
                    map.setZoom(15);
                }
                map.setCenter(marker.getPosition());
                location[i].picFlag = true;
                if ($(window).width() <= 770) {
                    map.panBy(0, -300);
                }
                if ($(window).width() > 770 && $(window).width() < 900) {
                    map.panBy(-100, 0);
                }
            };
        })(location[i].holdMarker, i));

        //Click nav list item to view & center info window
        $('#nav' + i).click((function(marker, i) {
            return function() {
                infowindow.setContent(location[i].contentString);
                infowindow.open(map, marker);
                map.setZoom(15);
                map.setCenter(marker.getPosition());
                location[i].picFlag = true;
                if ($(window).width() < 770) {
                    map.panBy(0, -300);
                }
                if ($(window).width() > 770 && $(window).width() < 900) {
                    map.panBy(-100, 0);
                }
            };
        })(location[i].holdMarker, i));

        //Show active state when list item is clicked
        $('li').click(function(e) {
            $('li.active').removeClass('active');
            $(this).addClass('active');
        });

        //Show active list item when marker is clicked
        new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
            return function() {
                $('li.active').removeClass('active');
                $('#nav' + i).addClass('active');
            };
        })(location[i].holdMarker, i));

        //Close info windows on map click
        google.maps.event.addListener(map, "click", function(event) {
            infowindow.close();
        });

        //Close info windows when resetting map
        $("#reset").click(function() {
            infowindow.close();
        });

        //Remove active highlighting from list when page is reset
        $("#reset").click(function() {
            $('li.active').removeClass('active');
        });
    }
}

//Search nav list & display matches
var viewModel = {
    query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function(marker) {
        if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.flag = true;
            return marker.visible(true);
        } else {
            marker.flag = false;
            setAllMap();
            return marker.visible(false);
        }
    });
}, viewModel);

ko.applyBindings(viewModel);

//Hide markers based on input
$("#input").keyup(function() {
    setAllMap();
});

//Bind nav with arrow button to hide & show on click
var navVisibility = true;

function invisibleNav() {
    $("#nav").animate({
        height: 0,
    }, 500);
    setTimeout(function() {
        $("#nav").hide();
    }, 500);
    $("#arrow").removeClass("fa fa-angle-double-up");
    $("#arrow").addClass("fa fa-angle-double-down");
    navVisibility = false;
}

function visibleNav() {
    $("#nav").show();
    var scrollerHeight = $("#list").height();
    $("#nav").animate({
        height: scrollerHeight,
    }, 500, function() {
        $(this).css('height', 'auto').css("max-height", 496);
    });
    $("#arrow").removeClass("fa fa-angle-double-down");
    $("#arrow").addClass("fa fa-angle-double-up");
    navVisibility = true;
}

function hideNav() {
    if (navVisibility === true) {
        invisibleNav();

    } else {
        visibleNav();
    }
}
$(".btn-circle").click(hideNav);

//Hide & show nav on resize
$(window).resize(function() {
    var windowWidth = $(window).width();
    if ($(window).width() < 900 && navVisibility === true) {
        invisibleNav();
    } else if ($(window).height() < 600 && navVisibility === true) {
        invisibleNav();
    }
    if ($(window).width() >= 900 && navVisibility === false) {
        if ($(window).height() > 600) {
            visibleNav();
        }
    } else if ($(window).height() >= 600 && navVisibility === false) {
        if ($(window).width() > 900) {
            visibleNav();
        }
    }
});