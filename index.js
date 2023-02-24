const express = require("express");
const { Translate } = require(`@google-cloud/translate`).v2
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');
const helmet = require("helmet");

// Import config
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

// Your Google Translate Credentials
const CREDENTIALS = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Configuration for the client
const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
});

// Set Security Configs
app.use(helmet());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// the function below reads lyrics from the growing request library
const readLyrics = () => {

    // if (!fs.existsSync('./data/lyrics.json')) {
    //     fs.writeFileSync('./data/lyrics.json', "[]");
    // }

    return JSON.parse(fs.readFileSync("./data/lyrics.json", "utf-8", (err) => {
        if (err) {
            return;
        }
    })
    );
};

// the function below detects language and translates text from any langugage other than English.
const translateText = async (text) => {

    const [detection] = await translate.detect(text);
    const detectedLanguage = detection.language;

    if (detectedLanguage === 'en') {
        return null;
    }

    try {
        const [response] = await translate.translate(text, 'en');
        return response;
    } catch (err) {
        console.log(`Error at translateText --> ${err}`);
        return 0;
    }
};


// Request to refresh token every 10 minutes
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
        })
        .catch((err) => {
            res.sendStatus(400)
        })
})

// Spotify login request
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
            res.sendStatus(400)
        })
})

// the below get request checks for three items:
// 1) read and post the data from lyrics.json file to the client side.
// 2) if no lyrics found then search the lyrics via lyricfinder and translate lyrics, post both data to client.
// 3) write the lyrics newly searched via lyricfinder and save in lyrics.json file
app.get('/lyrics', async (req, res) => {
    const dataLyric = readLyrics();
    const findLyrics = dataLyric.find(({ artist, track }) => artist === req.query.artist && track === req.query.track);
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "Woah! where did you find this song?  i am still searching";
    const translation = await translateText(lyrics, 'en');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };
    const timing = new Intl.DateTimeFormat('en-US', options);
    const timestamp = timing.format(new Date());

    const lyricObject = {
        timestamp: timestamp,
        artist: req.query.artist,
        track: req.query.track,
        lyrics: lyrics,
        translation: translation
    }

    if (findLyrics !== undefined) {
        return res.json(findLyrics)
    } else if (findLyrics === undefined) {
        dataLyric.push(lyricObject);
        fs.writeFile('./data/lyrics.json', JSON.stringify(dataLyric), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Server Error");
            }
            return res.json({ "lyrics": lyrics, "translation": translation });
        });
    }
});



// app.put("/lyrics/:artist/:track", (req, res) => {
//     const artist = req.params.artist;
//     const track = req.params.track;
//     const lyrics = req.params.lyrics;

//     // Read the existing content of file
//     const fileContents = fs.readFileSync('./data/lyrics.json', 'utf8');
//     const data = JSON.parse(fileContents);

//     const objectIndex = data.findIndex(obj => obj.artist === artist && obj.track === track);
//     if (objectIndex === -1) {
//         return res.status(404);
//     }

//     data[objectIndex].lyrics = lyrics;

//     fs.writeFileSync('./data/lyrics.json', JSON.stringify(data));
// })

// Server
app.listen(PORT, () => {
    console.log(`App running on Port #${PORT}`);
});