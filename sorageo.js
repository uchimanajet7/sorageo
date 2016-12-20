(function(){
    // geolocation data
    var geo_data = {
        vv_timestamp: "---",
        vv_latitude: "---",
        vv_longitude: "---",
        vv_altitude: "---",
        vv_accuracy: "---",
        vv_altitude_accuracy: "---",
        vv_heading: "---",
        vv_speed: "---",
        vv_uplod: "---"
    };
    // vue object
    var vue_geo = new Vue({
        el: '#geo-val',
        data: geo_data
    })
    // Does it correspond?
    if (!navigator.geolocation){
        window.alert("Please use a browser that corresponds to that of 'navigator.geolocation'.");
        return false;
    }
    // geolocation option
    var geo_option = {
        enableHighAccuracy: true,
        maximumAge: 15,
        timeout: 10000
    };
    // use watchPosition
    var watch_Id = navigator.geolocation.watchPosition(success, err, geo_option);
    console.dir(watch_Id);
    // get success
    function success(position) {        
        console.dir(position);

        // mappig view
        geo_data.vv_timestamp = getDisplayDate(position.timestamp);
        geo_data.vv_latitude = position.coords.latitude;
        geo_data.vv_longitude = position.coords.longitude;
        geo_data.vv_altitude = position.coords.altitude;
        geo_data.vv_accuracy = position.coords.accuracy;
        geo_data.vv_altitude_accuracy = position.coords.altitudeAccuracy;
        geo_data.vv_heading = position.coords.heading;
        geo_data.vv_speed = getDisplaySpeed(position.coords.speed);

        // send data
        postHarvest();
    }  
    // get error
    function err(error){
        var error_text;
        switch (error.code) {
            case error.PERMISSION_DENIED:
                error_text = "Acquisition of position information in the browser is not allowed.";
                break;
            case error.POSITION_UNAVAILABLE:
                error_text = "You can not identify the current position.";
                break;
            case error.TIMEOUT:
                error_text = "Timed out before obtaining a position information.";
                break;
        }
        window.alert("[" + error.code + "]: " + error_text);
    }
    // To convert a number of milliseconds to the display string.
    function getDisplayDate(date) {
        return moment(date).format("YYYY-MM-DD HH:mm:ss:SSS");
    }
    // To change the value of the speed from per second to per hour.
    function getDisplaySpeed(speed) {
        return speed * 3.6;
    }
    // post data use vue-resource
    // var harvest_url = 'http://harvest.soracom.io';
    var harvest_url = 'http://localhost:8080';
    function postHarvest() {
        vue_geo.$http.post(
            harvest_url, 
            JSON.stringify(geo_data),
            {
                headers: {
                    'Content-Type': 'content-type:application/json'
                }
            }
        ).then(function (response) {
            // success
            console.dir(response);
            geo_data.vv_uplod = "Success";
        },　function (response) {
            // error
            console.dir(response);
            geo_data.vv_uplod = "!! Error !!";
        })
    }
})();

