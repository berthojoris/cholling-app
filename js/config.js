//desarrollando en casa
//var server = "http://192.168.1.132/prestacommons/";

//desarrollando en crea
var server = "http://10.13.16.90/prestacommons/";

var checkLoginKey = "chllKey";
//Config Plugin
var configFacebook = {
	app_id		: 'YOUR APP ID',
	secret		: 'YOUR SECRET',
	scope		: 'YOUR ACCESS PREFERENCE(default email)',
	host		: '', //App Domain ( Facebook Developer ).
	onLogin 	: LungoController.onLogin,
	onLogout 	: LungoController.onLogout
};

var configTwitter = {
	consumerKey : 'YOUR TWITTER CONSUMER KEY',
	consumerSecret : 'YOUR SECRET TWITTER',
	callbackUrl : "CALL BACK TO REGISTER LOGIN"
};
