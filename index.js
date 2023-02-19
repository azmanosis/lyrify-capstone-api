const express = require("express");
const { Translate } = require(`@google-cloud/translate`).v2
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs');
// Unsure if required
const helmet = require("helmet");

// Import config
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

// Your Credentials
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

const readLyrics = () => {
    return JSON.parse(fs.readFileSync("./data/lyrics.json", "utf-8", (err) => {
        if (err) {
            return;
        }
    })
    );
};

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

app.get('/lyrics', async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "Sorry, this search didn't generate any lyrics";
    const translation = await translateText(lyrics, 'en');
    // const matchinglyrics = readLyrics.find(req.query.artist === artist && req.query.track === track);
    // if (matchinglyrics) {
    //     const translation = matchinglyrics.lyrics;
    // } else {
    // const translation = await translateText(lyrics, "en") || "Sorry, this search didn't generate any lyrics";
    // }
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

    fs.appendFileSync('./data/lyrics.json', JSON.stringify(lyricObject) + '\n');

    res.json({ lyrics, "translation": translation })

})

// const translateText = async (text, targetLanguage) => {

//     try {
//         let [response] = await translate.translate(text, targetLanguage);
//         return response;
//     } catch (error) {
//         console.log(`Error at translateText --> ${error}`);
//         return 0;
//     }
// }

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
}



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