<script src="https://code.jquery.com/jquery-3.2.0.js"></script>
<script type="text/javascript" src="webcam.js"></script>
<script type="text/javascript" src="base64-binary.js"></script>
<script language="JavaScript">
var stopIntervalIsTrue = true;

function take_snapshot() {
    //document.getElementById("takeSnapshotButton").setAttribute("disabled","disabled");
    Webcam.snap(function(data_uri) {
        document.getElementById('busyimg').style.visibility = 'visible';

        var file = data_uri.substring(23).replace(' ', '+');
    	  var img = Base64Binary.decodeArrayBuffer(file);
        var ajax = new XMLHttpRequest();
        ajax.addEventListener("load", function(event) {
            var data = JSON.parse(event.target.response);

            var happiness = 0;

            if(data.length > 0) {
                // we got a face
                happiness = data[0].scores.happiness;
            }

            var resEl = document.getElementById('results');
            resEl.innerHTML = '<div><p>' + happiness + '</p><img src="'+ data_uri +'"/></div>' + resEl.innerHTML;

            document.getElementById('busyimg').style.visibility = 'hidden';

            document.getElementById('debugtext').innerHTML = '<div><p>' +intervalID + '   ' + stopIntervalIsTrue + '</p></div>'
            if (stopIntervalIsTrue) {
                clearInterval(intervalID);
            }
            // document.getElementById("takeSnapshotButton").removeAttribute("disabled");
        }, false);
        ajax.open("POST", "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize","image/jpg");
      	ajax.setRequestHeader("Content-Type","application/octet-stream");
      	ajax.setRequestHeader("Accept","application/json,text/html,application/xhtml+xml,application/xml");
      	ajax.setRequestHeader("Ocp-Apim-Subscription-Key","fa5211a24a3448eebf0fae55eb9d0b5f");

      	ajax.send(img);
    });
}
function stop_take_snapshot() {
    stopIntervalIsTrue = true;
}

$(function() {
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 100
    });
    Webcam.attach('#my_camera');

    var intervalID = setInterval(take_snapshot, 5000);
    stopIntervalIsTrue = false;
});
</script>
