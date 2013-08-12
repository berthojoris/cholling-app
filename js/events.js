//desarrollando en casa
//var server = "http://192.168.1.132/prestacommons/";

//desarrollando en crea
var server = "http://10.13.16.90/prestacommons/";
Lungo.Service.Settings.async = true;
Lungo.Service.Settings.crossDomain = true;

Lungo.Service.Settings.error = function(type, xhr) {
	Lungo.Notification.hide();
	Lungo.Core.log(3, 'Algo fue mal, :(');
    Lungo.Core.log(2, 'Type: ' + type);
    Lungo.Core.log(2, xhr);
};
Lungo.Service.Settings.timeout = 5000;

Lungo.Events.init({
    'tap #loginTwitter': function() {
    	Lungo.Notification.show();
    	TwitterController.login();
    },
    
    'tap #logoutBtn': function() {
    	logOut();
    	Lungo.Router.section('login');
    }
});


//TODO Pasar a monocle el proyecto
window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
	Lungo.Notification.hide();
	console.log("errorMsg: " + errorMsg + " url: " + url + " lineNumber: " + lineNumber);
	alert("errorMsg: " + errorMsg + " url: " + url + " lineNumber: " + lineNumber);
    return false;
};