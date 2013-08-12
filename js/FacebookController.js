// Detect when Facebook tells us that the user's session has been returned
function updateAuthElements() {
	FB.Event.subscribe('auth.statusChange', function(session) {
		if (session.authResponse) {
			// The user is logged in, so let's pre-fetch some data and check the
			// current
			// permissions to show/hide the proper elements.
			preFetchData();
			checkUserPermissions();
		}
	});
}

// Pre-fetch data, mainly used for requests and feed publish dialog
var nonAppFriendIDs = [];
var appFriendIDs = [];
var friendIDs = [];
var friendsInfo = [];

function preFetchData() {
	// First, get friends that are using the app
	FB.api({
		method : 'friends.getAppUsers'
	}, function(appFriendResponse) {
		appFriendIDs = appFriendResponse;

		// Now fetch all of the user's friends so that we can determine who
		// hasn't used the app yet
		FB.api('/me/friends', {
			fields : 'id, name, picture'
		}, function(friendResponse) {
			friends = friendResponse.data;

			// limit to a 200 friends so it's fast
			for ( var k = 0; k < friends.length && k < 200; k++) {
				var friend = friends[k];
				var index = 1;

				friendIDs[k] = friend.id;
				friendsInfo[k] = friend;

				for ( var i = 0; i < appFriendIDs.length; i++) {
					if (appFriendIDs[i] == friend.id) {
						index = -1;
					}
				}

				if (index == 1) {
					nonAppFriendIDs.push(friend.id);
				}
			}

			console.log('Got your friend\'s that use the app: ', appFriendIDs);

			console.log('Got all of your friends: ', friendIDs);

			console.log('Got friends that are not using the app yet: ',
					nonAppFriendIDs);
		});
	});
}