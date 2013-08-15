var LungoController = {
		onLogin : function(accessData) {
			show_props(accessData, "accessData");
			cb.onCloseBrowser = CordovaController.onCloseBrowser;
			if (accessData.status == 1) {
				localStorage.setItem(checkLoginKey, JSON.stringify(accessData));
				Lungo.Router.section('landing');
				$$("#logoutBtn").show();
				Lungo.Notification.hide();
			} else {
				Lungo.Notification.error("Error", // Title
						accessData.message, // Description
						"cancel", // Icon
						7 // Time on screen
				);
				cb.onCloseBrowser = null;
			}
			cb.close();
			return true;
		},
		onLogout : function(event) {
			show_props(event, 'eventOnLogout');

			window.localStorage.removeItem(checkLoginKey);
			$$.fn.FaceGap.config = configFacebook;
			$$.fn.FaceGap('logout');
			Lungo.Router.section('login');
			$$("#logoutBtn").hide();

			return true;
		}
}

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
	'tap #loginTwitter' : function() {
		Lungo.Notification.show();
		TwitterController.login();
	},

	'tap #loginFacebook' : function() {
		Lungo.Notification.show();
		$$.fn.FaceGap(configFacebook);
	},

	'tap #logoutBtn' : function() {
		LungoController.onLogout();
	}
});

//TODO Pasar a monocle el proyecto
window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
	Lungo.Notification.hide();
	console.log("errorMsg: " + errorMsg + " url: " + url + " lineNumber: "
			+ lineNumber);
	alert("errorMsg: " + errorMsg + " url: " + url + " lineNumber: "
			+ lineNumber);
	return false;
};