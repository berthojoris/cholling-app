var oauth; // It Holds the oAuth data request
var requestParams;
var options = {
	consumerKey : 'consumerKey',
	consumerSecret : 'consumerSecret',
	callbackUrl : "callbackUrl"
};

var twitterKey = "twtrKey"; // This key is used for storing Information related

var TwitterController = {
	login : function() {
		// Apps storedAccessData , Apps Data in Raw format
		var storedAccessData, rawData = localStorage.getItem(twitterKey);
		// here we are going to check whether the data about user is already
		// with us.
		if (localStorage.getItem(twitterKey) !== null) {
			// when App already knows data
			storedAccessData = JSON.parse(rawData); // JSON parsing
			// options.accessTokenKey = storedAccessData.accessTokenKey; // data
			// will be saved when user first time signin
			options.accessTokenSecret = storedAccessData.accessTokenSecret; // data
																			// will
																			// be
																			// saved
																			// when
																			// user
																			// first
																			// first
																			// signin

			// javascript OAuth take care of everything for app we need to
			// provide just the options
			oauth = OAuth(options);
			oauth
					.get(
							'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
							function(data) {
								var entry = JSON.parse(data.text);
								console.log("USERNAME: " + entry.screen_name);
							});
		} else {
			// we have no data for save user
			oauth = OAuth(options);
			oauth.get('https://api.twitter.com/oauth/request_token', function(
					data) {
				requestParams = data.text;
				cb.showWebPage('https://api.twitter.com/oauth/authorize?'
						+ data.text); // This opens the Twitter authorization
										// / sign in page
				cb.onLocationChange = function(loc) {
					TwitterController.success(loc);
				}; // Here will will track the change in URL of ChildBrowser
			}, function(data) {
				console.log("ERROR: " + data);
			});
		}
	},
	/*
	 * When ChildBrowser's URL changes we will track it here. We will also be
	 * acknowledged was the request is a successful or unsuccessful
	 */
	success : function(loc) {

		// Here the URL of supplied callback will Load

		/*
		 * Here Plugin will check whether the callback Url matches with the
		 * given Url
		 */
		if (loc.indexOf("http://www.cholling.es/socialLogin/registerTwitter.php") >= 0) {

			// Parse the returned URL
			var index, verifier = '';
			var params = loc.substr(loc.indexOf('?') + 1);

			params = params.split('&');
			for ( var i = 0; i < params.length; i++) {
				var y = params[i].split('=');
				if (y[0] === 'oauth_verifier') {
					verifier = y[1];
				}
			}

			// Here we are going to change token for request with token for
			// access

			/*
			 * Once user has authorised us then we have to change the token for
			 * request with token of access here we will give data to
			 * localStorage.
			 */
			oauth
					.get(
							'https://api.twitter.com/oauth/access_token?oauth_verifier='
									+ verifier + '&' + requestParams,
							function(data) {
								var accessParams = {};
								var qvars_tmp = data.text.split('&');
								for ( var i = 0; i < qvars_tmp.length; i++) {
									var y = qvars_tmp[i].split('=');
									accessParams[y[0]] = decodeURIComponent(y[1]);
								}

								oauth.setAccessToken([
										accessParams.oauth_token,
										accessParams.oauth_token_secret ]);

								// Saving token of access in Local_Storage
								var accessData = {};
								accessData.accessTokenKey = accessParams.oauth_token;
								accessData.accessTokenSecret = accessParams.oauth_token_secret;

								// Configuring Apps LOCAL_STORAGE
								console
										.log("TWITTER: Storing token key/secret in localStorage");
								localStorage.setItem(twitterKey, JSON
										.stringify(accessData));

								oauth
										.get(
												'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
												function(data) {
													var entry = JSON
															.parse(data.text);
													console
															.log("TWITTER USER: "
																	+ entry.screen_name);
													successfulLogin();
												}, function(data) {
													console.log(data);
												});

								// Now we have to close the child browser
								// because everthing goes on track.

								window.plugins.childBrowser.close();
							}, function(data) {
								console.log(data);

							});
		} else {
			// Just Empty
		}
	},
}

function successfulLogin() {
	Lungo.Router.section('landing');
	$$("#logoutBtn").show();
}

function logOut() {
	window.localStorage.removeItem(twitterKey);
	Lungo.Router.section('login');
	$$("#logoutBtn").hide();
}
