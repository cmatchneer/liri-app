require("dotenv").config();
var keys = require("./keys.js");
var userInput = process.argv.slice(3).join(" ");
var command = process.argv[2];
console.log(userInput);
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

switch (command) {
    case "song-search":
        if (userInput.length <= 0) {
            userInput = "your horoscope for today";
        }
        spotify.search({ type: 'track', query: userInput, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // console.log(data.tracks.items[0]);
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
            console.log("Link to the Song: " + data.tracks.items[0].external_urls.spotify);

        });

        break;
}