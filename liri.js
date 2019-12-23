require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var userInput = process.argv.slice(3).join(" ");
var command = process.argv[2];
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

switch (command) {
    case "song-search":
        music(userInput);

        break;
    case "movie-this":
        movies(userInput);
        break;

    case "do-what-it-says":
        fs.readFile("random.txt", "utf8", function(error, data) {
            if (error) {
                return console.log(error);
            }
            var cpuInput = data.split(",");
            var input = cpuInput[1];
            music(input);
        });
        break;
}

function music(songName) {
    if (songName.length <= 0) {
        songName = "your horoscope for today";
    }
    spotify.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Artist Name: " + data.tracks.items[0].artists[0].name);
        console.log("Link to the Song: " + data.tracks.items[0].external_urls.spotify);
    });
}

function movies(movieName) {
    if (movieName <= 0) {
        movieName = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(
            function(response) {
                console.log("Movie Title: " + response.data.Title);
                console.log("Release Date: " + response.data.Released);
                console.log("Actors: " + response.data.Actors.split(","));
                console.log("Plot: " + response.data.Plot);
                console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
                console.log("imdb Rating: " + response.data.imdbRating);
                console.log("Made in: " + response.data.Country);
                console.log("Language: " + response.data.Language);
            })
        .catch(function(error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}