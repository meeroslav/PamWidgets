/**
 * Created by JetBrains PhpStorm.
 * User: mjonas
 * Date: 3/16/12
 * Time: 1:40 PM
 */
/********* FIELDS ************/
var rest_url = "http://www.pam.com/JSON/getdata.php",
    previousOrientation = null;
var PamSettings = {
    "serial":null,    
    "serverURL":rest_url,    
    "holderId":"graphFrame",
    "widgets":["PamGraphWidget", "AdviceWidget", "CurrentValueWidget"],
    "language":"en",
    "PamGraphWidget":{
        "style":"pamGraphWidget",
        "barColorHue":215,
        "barColorSaturation":0.74,
        "barGradientDirection":1,
        "chunkSize":20,
        "hideGoal":true
    },
    "AdviceWidget":{
        "style":"adviceWidget",
        "language":"en",
        "holderId":"adviceFrame"
    },
    "CurrentValueWidget":{
        "style":"currentValueWidget",
        "holderId":"adviceFrame"
    }
};
/********* FUNCTIONS ************/
function onBodyLoad()
{
    document.addEventListener("deviceready", onDeviceReady, false);
    window.addEventListener("orientationchange", checkOrientation, false);
}

function onDeviceReady()
{
    if (window.localStorage.getItem("serial_number") != null){
        $("#username").val(window.localStorage.getItem("username"));
        PamSettings.serial = window.localStorage.getItem("serial_number").toString();
        pamInit();
    } else {
        $('#cancel_settings').hide();
        $.mobile.changePage($("#settings"),{transition: "pop"});
    }
}

function checkOrientation(){
  if (window.orientation != previousOrientation){
      previousOrientation = window.orientation;
      if (window.localStorage.getItem("serial_number") != null)
        pamRedraw();
  }
}

function submitWithAjax(){
    var form = $("#settings_form")[0];
    if (form.username.value != "" && form.password.value != ""){
        // set data
        window.localStorage.setItem("username", form.username.value);
        // login
        $.ajax({
            type: "POST",
            url: rest_url,
            data: {action: "Login", username: form.username.value, password: form.password.value},
            jsonp: 'callback',
            dataType: "jsonp",
            jsonpCallback: 'loginCallback'
        });
    } else {
    
        alert("Invalid username or password.");
    }
}

function loginCallback(data){
    if (data.invalid != null){
        alert(data.invalid);
    } else {
        window.localStorage.setItem("serial_number", data.serial);
        $('#cancel_settings').show();
        $.mobile.changePage($("#graph"),{reverse: true, transition: "slide"});
        $.mobile.fixedToolbars.show(true);
        PamSettings.serial = window.localStorage.getItem("serial_number").toString();
        pamInit();
    }
}