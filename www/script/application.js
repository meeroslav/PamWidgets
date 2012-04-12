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
        "barColorSecondHue":355,
        "barColorThirdHue":110,
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
var login_message = "Invalid username or password.";
/********* FUNCTIONS ************/
function onBodyLoad()
{
    document.addEventListener("deviceready", onDeviceReady, false);
    window.addEventListener("orientationchange", checkOrientation, false);
}

function onDeviceReady() {
    if (window.localStorage.getItem("serial_number") != null){
        $("#username").val(window.localStorage.getItem("username"));
        PamSettings.serial = window.localStorage.getItem("serial_number").toString();
        PamSettings.language = window.localStorage.getItem("language").toString();
        $("#language_" + PamSettings.language).checked = true;
        translateApplication(PamSettings.language);
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
    
    if ((screen.width==320) && (screen.height==480)) {
        PamSettings.PamGraphWidget.marginRight = 0;
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
        navigator.notification.alert(login_message.toString(), clearStorage);
    }
}

function loginCallback(data){
    if (data.invalid != null){
        navigator.notification.alert(login_message.toString());
    } else {
        var langValue = $("input:radio['name=r']:checked").val();
        window.localStorage.setItem("serial_number", data.serial);
        window.localStorage.setItem("language", langValue);
        $('#cancel_settings').show();
        $.mobile.changePage($("#graph"),{reverse: true, transition: "slide"});
        $.mobile.fixedToolbars.show(true);
        PamSettings.serial = window.localStorage.getItem("serial_number").toString();
        PamSettings.language = window.localStorage.getItem("language").toString();
        translateApplication(PamSettings.language);
        pamInit();
    }
}

function clearStorage(){
    window.localStorage.clear();
}

function translateApplication(language){
    var langObj = eval("translations_" + language);
    if (langObj != null){
        login_message = langObj.mobile_invalidlogin;
        $("#mobile_savesettings span.ui-btn-text").text(langObj.mobile_savesettings);
        $("#mobile_cleardata span.ui-btn-text").text(langObj.mobile_cleardata);
        /** $("#mobile_language").text(langObj.mobile_language + ":"); **/
        $("#mobile_appsettings").text(langObj.mobile_appsettings);
        $("#mobile_useraccount").text(langObj.mobile_useraccount);
        $("#mobile_username").text(langObj.mobile_username);
        $("#mobile_password").text(langObj.mobile_password);
        $("a[href='#graph'] span.ui-btn-text").each(function(){
            $(this).text(langObj.mobile_pamgraph);
        });
        $("a[href='#graph'] span.ui-btn-text").each(function(){
            $(this).text(langObj.mobile_pamgraph);
        });
        $("a[href='#settings'] span.ui-btn-text").each(function(){
            $(this).text(langObj.mobile_settings);
        });
        $("#mobile_settings").text(langObj.mobile_settings);
        $("a[data-rel='back'] span.ui-btn-text").text(langObj.mobile_back);
        $("div.ui-field-contain.ui-body.ui-br div.ui-controlgroup-label").text(langObj.mobile_language);
    }
}








