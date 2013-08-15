var oauth;
var requestParams;

var TwitterController = {
		login : function() {
			console.log('EVE: login');
			var storedAccessData, rawData = localStorage.getItem(checkLoginKey);
			if (localStorage.getItem(checkLoginKey) !== null) {
				storedAccessData = JSON.parse(rawData); // JSON parsing
				configTwitter.accessTokenSecret = storedAccessData.accessTokenSecret;
				oauth = OAuth(configTwitter);
				oauth.get(
						'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
						function(data) {
							var entry = JSON.parse(data.text);
							console.log("USERNAME: " + entry.screen_name);
						});
			} else {
				// we have no data for save user
				oauth = OAuth(configTwitter);
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
					Lungo.Notification.hide();
					console.log("ERROR: " + data);
				});
			}
		},
		success : function(loc) {
			console.log('EVE: success with loc: ' + loc);
			if (loc.indexOf("http://www.cholling.es/socialLogin/registerTwitter.php") >= 0) {
				if (loc.indexOf('denied') > 0) {
					var accessData = {};
					accessData.status = 0;
					accessData.message = 'Twitter no ha devuelto login';
					LungoController.onLogin(accessData);
				} else {
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

								oauth
								.get(
										'https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
										function(data) {
											var entry = JSON
											.parse(data.text);
											console
											.log("TWITTER USER: "
													+ entry.screen_name);
											accessData.status = 1;
											LungoController.onLogin(accessData);
											cb.close();
										}, function(data) {
											accessData.status = 0;
											accessData.message = 'Twitter no ha devuelto login';
											LungoController.onLogin(accessData);
											console.log(data);
											cb.close();
										});

								// Now we have to close the child browser
								// because everthing goes on track.

								window.plugins.childBrowser.close();
							}, function(data) {
								data.status = 0;
								data.message = 'Twitter no ha devuelto login';
								LungoController.onLogin(data);
								cb.close();
							});
				}
			} else {
				if (loc.indexOf('denied') > 0) {
					var accessData = {};
					accessData.status = 0;
					accessData.message = 'Twitter no ha devuelto login';
					LungoController.onLogin(accessData);
				}
			}
		},
}