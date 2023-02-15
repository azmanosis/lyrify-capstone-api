const express = require("express");
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');
const axios = require("axios").default;
const url = require("url");
// Unsure if required
const helmet = require("helmet");

// Import config
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

// Set Security Configs
app.use(helmet());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            })
            // console.log(data.body);
        })
        .catch((err) => {
            // console.log(err)
            res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch((err) => {
            // console.log(err)
            res.sendStatus(400)
        })
})

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics Found";

    const params = new url.URLSearchParams();
    params.append("from", "es");
    params.append("from", "ar");
    params.append("from", "ko");
    params.append("from", "hi");
    params.append("to", "en");
    params.append("text", lyrics);

    let options = {
        method: "POST",
        url: "https://lecto-translation.p.rapidapi.com/v1/translate/text",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "x-rapidapi-host": "lecto-translation.p.rapidapi.com",
            "x-rapidapi-key": process.env.TRANSLATEAPI_KEY,
        },
        data: params,
    };

    axios.request(options)
        .then(function (response) {
            res.json({
                lyrics, translation: response.data
            });
        })
        .catch(function (error) {
            console.error(error);
            res.sendStatus(500);
        });

    res.json({ lyrics })
})

// function writeVideos(data) {
//     const stringifiedData = JSON.stringify(data);
//     fs.writeFileSync('./data/lyrics.json', stringifiedData)
// }

// Server
app.listen(PORT, () => {
    console.log(`App running on Port #${PORT}`);
});