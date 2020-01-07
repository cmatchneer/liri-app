require("dotenv").config();
var keys = require("./keys.js");
var options = require("./geo-setup");
var nodeGeoCoder = require('node-geocoder');
var geocoder = nodeGeoCoder(options.option);
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');
var inquirer = require("inquirer");
var areYouDone = false;
liri();

function liri() {
    if (areYouDone === false) {

        inquirer.prompt([{
                type: "list",
                message: "pick a command",
                choices: ["song search", "movie this", "do what it says", "concert this"],
                name: "command"

            },
            {
                type: "input",
                message: "Search a song, movie or band depending on your command choice. If you selected the third command then leave this blank ",
                name: "userInput"
            },
            {
                type: "confirm",
                message: "do you want to do another search?",
                name: "done",
                default: false
            }
        ]).then(function(response) {

            switch (response.command) {
                case "song search":
                    music(response.userInput);

                    break;
                case "movie this":
                    movies(response.userInput);
                    break;

                case "do what it says":
                    fs.readFile("random.txt", "utf8", function(error, data) {
                        if (error) {
                            return console.log(error);
                        }
                        var cpuInput = data.split(",");
                        var input = cpuInput[1];
                        music(input);
                    });
                    break;
                case "concert this":
                    concert(response.userInput);
                    break;
            }
            if (!response.done) {
                areYouDone = true;
            } else {
                liri();
            }

        })

    }
}


function concert(bandName) {
    if (bandName.length <= 0) {
        bandName = "eagles";
    }
    axios.get(" https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp").then(
        function(response) {

            console.log('\n', "The Artist: " + response.data[0].artist.name, '\n');
            console.log('\n', "The Venue: " + response.data[0].venue.name, '\n');
            console.log('\n', "The City: " + response.data[0].venue.city, '\n');
            geocoder.reverse({ lat: response.data[0].venue.latitude, lon: response.data[0].venue.longitude }, function(err, res) {
                console.log('\n', "The Address: " + res[0].streetName, '\n');
                console.log('\n', "The ZipCode: " + res[0].zipcode), '\n';
                console.log('\n', "The State: " + res[0].stateCode, '\n');
                console.log('\n', "The Date and Time: " + moment(response.data[0].datetime).format("lll"), '\n');
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
        console.log('\n', "Song Name: " + data.tracks.items[0].name, '\n');
        console.log('\n', "Album: " + data.tracks.items[0].album.name, '\n');
        console.log('\n', "Artist Name: " + data.tracks.items[0].artists[0].name, '\n');
        console.log('\n', "Link to the Song: " + data.tracks.items[0].external_urls.spotify, '\n');
    });
}

function movies(movieName) {
    if (movieName.length <= 0) {
        movieName = "Mr. Nobody";
    }
    axios.get("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy").then(
            function(response) {
                console.log('\n', "Movie Title: " + response.data.Title, '\n');
                console.log('\n', "Release Date: " + response.data.Released, '\n');
                console.log('\n', "Actors: " + response.data.Actors.split(","), '\n');
                console.log('\n', "Plot: " + response.data.Plot, '\n');
                console.log('\n', response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value, '\n');
                console.log('\n', "imdb Rating: " + response.data.imdbRating, '\n');
                console.log('\n', "Made in: " + response.data.Country, '\n');
                console.log('\n', "Language: " + response.data.Language, '\n');
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