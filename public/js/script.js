var fbname;
var fbabout;
var fbdesc;
var fbphone;
var fbwebsite
var mapOptions;
var map;
var infoBox;
var AllMarkers;
var accessToken;
var name;
var pageid;

function runFb() {
  $.ajax({
    url: "./config.json",
    dataType: "json",
    beforeSend: function(xhr) {
      if (xhr.overrideMimeType) {
        xhr.overrideMimeType("application/json");
      }

    },
    success: function(DataFromJson) {

      accessToken = DataFromJson.accessToken;

console.log(name);
      if (name == "No facebook") {
          $('.stuff').empty();
            $('.stuff').css("display", "block");
          $('.stuff').append("<h4 id='name'></h4><h4 id='about'></h4><h4 id='desc'></h4><h4 id='phone'></h4><h4 id='website'></h4>")
        $('#about').append("No facebook data availble, pls try again ");
        return;
      }
      getId();

    },
    error: function() {
      console.log("Something Went Wrong");

    }

  });
};


function getId() {
  $.ajax({
    url: "https://graph.facebook.com/v2.10/" + name + "?access_token=" + accessToken,
    dataType: "jsonp",
    success: function(DataFromFacebook) {


      pageid = DataFromFacebook.id;
      getData();
    },
    error: function() {
      console.log("Something went wrong");
    }
  });

}

function getData() {

  $.ajax({
    url: "https://graph.facebook.com/v2.10/" + pageid + "?fields=about%2Cphone%2Cdescription%2Cname%2Cgeneral_info%2Cwebsite&access_token=" + accessToken,
    dataType: "jsonp",
    success: function(DataFromFacebook) {

      fbname = DataFromFacebook.name;
      fbabout = DataFromFacebook.about;
      fbdesc = DataFromFacebook.desc;
      fbphone = DataFromFacebook.phone;
      fbwebsite = DataFromFacebook.website;
      addInfostuff();

    },
    error: function() {
      console.log("Something went wrong");
    }
  });

};




function initMap() {
  mapOptions = {
    lat: -41.2950008,
    lng: 174.7814311
  };
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: mapOptions,
    styles: [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#63c6e5"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "gamma": 0.01
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -31
            },
            {
                "lightness": -33
            },
            {
                "weight": 2
            },
            {
                "gamma": 0.8
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#782c2c"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text",
        "stylers": [
            {
                "saturation": "71"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 30
            },
            {
                "saturation": 30
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "saturation": 20
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 20
            },
            {
                "saturation": -20
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 10
            },
            {
                "saturation": -30
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "saturation": 25
            },
            {
                "lightness": 25
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "lightness": -20
            }
        ]
    }
]

  });

  addAllMarkers();

}


function addAllMarkers() {

  $.ajax({
    url: "./data/allMarkers.json",
    dataType: "json",
    success: function(DataFromJSON) {


      for (var i = 0; i < DataFromJSON.length; i++) {
        marker = new google.maps.Marker({
          position: {
            lat: DataFromJSON[i].lat,
            lng: DataFromJSON[i].lng
          },
          map: map,
          animation: google.maps.Animation.DROP,
          icon: "images/pin.png",
          title: DataFromJSON[i].title,
          description: DataFromJSON[i].description,
          page: DataFromJSON[i].page
        });

        getInfo(marker);
      }

    },
    error: function() {
      console.log("something went wrong");
    }
  })
}

function getInfo(page) {
  google.maps.event.addListener(marker, "click", function() {

    name = page.page;


    runFb();
  });

};



function addInfostuff() {
  $('.stuff').css("display", "block");

  $('.stuff').empty();
  $('.stuff').append("<div id='redBorder'><h4 id='name'></h4></div><h4 id='about'></h4><h4 id='desc'></h4><h4 id='phone'></h4><h4 id='website'></h4>")
  $('#name').append(fbname);
  $('#about').append(" - "+fbabout);
  $('#desc').append(" - "+fbdesc);
  $('#phone').append(" - "+fbphone);
  $('#website').append(" - "+fbwebsite);
  $('.stuff').click(function(){

    $('.stuff').css("display", "none");
  });
}
$('.stuff').click(function(){

  $('.stuff').css("display", "none");
});



//
//
// curl -i -X GET \
//  "https://graph.facebook.com/v2.10/search?q=beach%20babylon&type=page&access_token=EAACEdEose0cBAJqHvHQWbKMMmIQz6iH6GNR6pLZCHAELx4uxw4zamcfee8HYwhOCjgSZA5OLGZAZAfXhBxGZBFxb3YePTueEE8CpuRCJZAYzApFGySo2FmhUL1TMyaILetfqGfleEnjOZBZAeuRpbRMzeuaKzfFZCXuplnfzhwNSY68zOS9VJWEQkX9bZCCk3Fd9MZD"
