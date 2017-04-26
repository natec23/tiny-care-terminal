var request = require("request");

function dayTracks(day) {
	var today = new Date();
	var date = new Date(today.getFullYear(), today.getMonth(), (today.getDate() - day), 0, 0, 0);
	return getRecent((date.getTime() / 1000), (Date.now() / 1000));
}

function getRecent(from, to) {
	return new Promise(function (resolve, reject) {
		var url =  "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user="+process.env.TCC_LASTFM_USERNAME+"&api_key="+process.env.TCC_LASTFM_KEY+"&format=json&limit=10&from="+from+"to="+to;
		request({
			url: url,
			json: true
		}, function(error, response, body) {
				if (!error && response.statusCode === 200) {
					var tracks = "";
					for(var i=0;i < body.recenttracks.track.length;i++) {
						tracks += body.recenttracks.track[i]['artist']['#text']+": "+body.recenttracks.track[i].name + "\n";
					}
					resolve({tracks: tracks, user: process.env.TCC_LASTFM_USERNAME, total: body['recenttracks']['@attr']['total']});
				}
				else {
					reject('Error connecting with Last.fm');
				}
		});
	});

}

 module.exports.dayTracks = dayTracks;
