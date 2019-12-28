require("dotenv").config();
var keys = require("./keys.js");
var options = require("./geo-setup");
var nodeGeoCoder = require('node-geocoder');
var geocoder = nodeGeoCoder(options.option);
var axios = require("axios");
var userInput = process.argv.slice(3).join(" ");
var command = process.argv[2];
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment')

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
    case "concert-this":
        concert(userInput);
        break;
}

function concert(bandName) {
    if (bandName.length <= 0) {
        bandName = "eagles";
    }
    axios.get(" https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp").then(
        function(response) {

            console.log("The Artist: " + response.data[0].artist.name);
            console.log("The Venue: " + response.data[0].venue.name);
            console.log("The City: " + response.data[0].venue.city);
            geocoder.reverse({ lat: response.data[0].venue.latitude, lon: response.data[0].venue.longitude }, function(err, res) {
                console.log("The Address: " + res[0].streetName);
                console.log("The ZipCode: " + res[0].zipcode);
                console.log("The State: " + res[0].stateCode);
                console.log("The Date and Time: " + moment(response.data[0].datetime).format("lll"));
            });


        }
    )
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
    if (movieName.length <= 0) {
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