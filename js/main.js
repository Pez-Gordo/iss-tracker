var map = L.map('map').fitWorld();

var issIcon = L.icon({
    iconUrl: './img/iss.png',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [-3, 16]
});

var issTimeoutID;
var issMarker;
var issCircle;

function loadMap(){

    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=ypfODnzHuwl0bYyyvG3i', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        crossOrigin: true
    }).addTo(map)

    map.setZoom(2.5);

    function trackISS () {
        $.ajax({
            url: "./php/issTracker.php",
            type: 'GET',
            dataType: 'json',
            success: function(result){
                console.log(result.data.info.iss_position.latitude);
                if(result){
                    updateISSMarker(result.data.info.iss_position.latitude, 
                        result.data.info.iss_position.longitude);
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(`Error in ISS pos: ${textStatus} ${errorThrown} ${jqXHR}`);
            }
        });
         issTimeoutID = setTimeout(trackISS, 1000); 
    }
    
    // ISS marker and circle update function
    function updateISSMarker(lat, lon) {
        if(issMarker != undefined && issCircle != undefined){
            map.removeLayer(issMarker);
            map.removeLayer(issCircle);
        }
        issMarker = new L.marker([lat, lon], {icon: issIcon}).addTo(map);
        issCircle = new L.circle([lat, lon], {color: 'gray', opacity: .5}).addTo(map);
    
        map.setView([lat, lon]);
    }

    trackISS();


    /*
    $.ajax({
        "message": "success", 
        "timestamp": UNIX_TIME_STAMP, 
        "iss_position": {
          "latitude": CURRENT_LATITUDE, 
          "longitude": CURRENT_LONGITUDE
        },
    
    	success: function(result) { 

        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }

    });
    */
}   

loadMap();