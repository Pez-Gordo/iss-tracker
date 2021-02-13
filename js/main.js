var map = L.map('map');

alert('Press "T" to start/stop following the ISS')

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoicGV6IiwiYSI6ImNraWFlcDVsYTBpMW0ycnJreWRxdnNneXIifQ._2kq-bt8gs8Wmc5JIY-6NQ'
}).addTo(map);

var tracker = true;

var issIcon = L.icon({
    iconUrl: './img/iss.png',
    iconSize: [60, 60],
    iconAnchor: [30, 30],
    popupAnchor: [-3, 16]
});

var issTimeoutID;
var issMarker;

$(window).keypress(function (e) {
    //use e.which to know what key was pressed
    var keyCode = e.which;
    //console.log(e, keyCode, e.which)
    if (keyCode == 116) {
        if (tracker === false) {
            tracker = true;
        }
        else {
            tracker = false;
        }
        //console.log("You pressed T!");
        //alert("You pressed W!");
    }
})


function loadMap(){

    map.setZoom(5.5);

    function trackISS () {
        $.ajax({
            url: "./php/issTracker.php",
            type: 'GET',
            dataType: 'json',
            success: function(result){
                //console.log(result.data.info.iss_position.latitude);
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
        if(issMarker != undefined) { 
            map.removeLayer(issMarker);
        }

        issMarker = new L.marker([lat, lon], {icon: issIcon}).addTo(map);
        if (tracker) {
            map.setView([lat, lon]);
        }
    }
    trackISS();
}   

loadMap();