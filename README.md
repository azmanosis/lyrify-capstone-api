<!-- logo -->

<p align="center">
    <img width='300' src='./assets/icons/logo.svg'>
    <h1 align="center"><strong>Lyrify</strong></h1>
</p>

<p align='center' style="font-weight:800"> This is the Server Side of the Project</p></br>

<p align='center'>
    <a href="#motivation">Motivation</a> • 
    <a href="#key-features">Key Features</a> • 
    <a href="#get-the-api">Get The API</a> • 
    <a href="#how-to-install">How To Install</a> • 
    <a href="#tech-dependencies">Tech Dependencies</a> • 
    <a href="#credits">Credits</a>
</p></br>

# Motivation

<p>Music is the language without barriers, in recent years, we are seeing an uptrend in the appeal to the global artist, BTS, a Korean boy band, who achieved international success & exposure and have their music played across radio stations worldwide. Even 'Macarena' was charting as a top dance song among non-native language speakers, back in 1995. Though these are great songs, unless you are native to the language, it is difficult to understand the meaning behind the song's lyrics. In contrast, English songs often generate a strong sense of curiosity among listeners, as they are intended to be understood and appreciated through their lyrics. A few notable examples are SAINt JHN - Roses (Imanbek Remix)</br></br>Lyrify offers a comprehensive solution to bridge the gap by displaying the lyrics for every song searched via Spotify. In addition, Lyrify offers translation for non-English songs to facilitate a deeper understanding of the thoughts and emotions conveyed via the music. This innovative platform promises to enhance the listening experience broader audience, promoting greater cultural exchange and appreciation in the global music community.</p>

# Key Features

<p> Lyrics and Translation for non-english song are displayed simultaneously or seperately based on requirement of the user</p>
<p>API calls are made only when song search is Unique. If Song is found in JSON, Lyrify displays from the JSON instead of calling API</p>
<p>Translation API is called and only occurs for non-english songs</p>
<p> Spotify Web Player automatically expires after 10 minutes, thereby limiting potential API calls</p>

# <p align="center"><strong> A Valid Spotify Premium Account is Required</strong></p>

# <p align="center"><strong>Google Cloud Key Will Require You To Link Your Credit Card</strong></p>

<p align="center">Your Credit Card however may not be charged</p>

# Get The API

### Spotify

To get started, set up a [Spotify APP](https://developer.spotify.com/dashboard/applications)

> Application Name: <strong>Lyrify</strong></br>
> Please note the `Client ID` and the `Client Secret`</br>
> Under `Edit Settings` go to `Redirect URIs` and add `http://localhost:3000/lyrify`</br>
> Save

Further explanation for Spotify Dashboard is provided here [Spotify Dashboard](https://developer.spotify.com/documentation/general/guides/authorization/app-settings/)

### Google Cloud Translate

To get started, go to link [Google Cloud](https://console.cloud.google.com/home/dashboard)

> Click on New Project</br>
> Next click the ☰ and go to `API & Services` then `Enabled API & Services`</br>
> Search for `Cloud Translation` and select `Enable`</br>
> Enable `Billing` and select your billing account</br>
> Go to `IAM & Admin` and then to `Service Account`</br>
> Create a `Service Account`</br>
> Under `Grant this service account access to project` – `Role`</br>
> Choose `Cloud Translation API Admin` and then click `Done`</br>
> Click the `⋮` then `Manage Keys`</br>
> Select `ADD KEY` then `Create new key`</br>
> Keep default `JSON` selected and `Create`

The above steps will generate a Google Cloud Translation API Key

Further explanantion for Google Cloud Translation API is provided here [Google Cloud Translation Doc](https://cloud.google.com/translate/docs)
</br>

# How To Install

To clone and run the program on the Server Side. You will require [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/en/download/)</br><strong>After which, please follow the instructions below:</strong>

Open an IDE program, preferable VS Code.</br>Under `Terminal` in `VS Code` select `New Terminal`

```bash
# Clone this repository
$ git clone https://github.com/azmanosis/lyrify-capstone-api.git
# Go into the folder
$ cd lyrify-capstone-api
# Install dependencies
$ npm install
```

Set up a `.env` file inside `lyrify-capstone-api` folder.</br>
Add `REDIRECT_URI` <strong>REDIRECT_URI=http://localhost:3000/lyrify</strong> If running locally.</br>
Add `CLIENT_ID` and `CLIENT_SECRET` from your <a href="#spotify">Spotify Account</a></br>
Add the <a href="#google-cloud-translate">GOOGLE_APPLICATION_CREDENTIALS</a></br>
Add `PORT=8080`</br>

After completing the above steps

```bash
# Start the Server
$ npm start
```

## Congratulations your API's are now set up!</br>

Please continue to the [Client Side](https://github.com/azmanosis/lyrify-capstone) to begin application.

# Tech Dependencies

Installed via `npm install` in previous step</br>

<a href="https://www.npmjs.com/package/dotenv" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/motdotla/dotenv/master/dotenv.svg" height="30"/></a>
<a href="https://www.npmjs.com/package/express" target="_blank" rel="noreferrer"><img src="https://camo.githubusercontent.com/0566752248b4b31b2c4bdc583404e41066bd0b6726f310b73e1140deefcc31ac/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67" height="30"/></a>
<a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://cdn.freebiesupply.com/logos/large/2x/nodejs-1-logo-png-transparent.png" height="30"/></a></br>

<p>google-cloud translate, helmet, lyrics-finder and spotify-web-api</p>

# Credits:

<p>Support and guidance from the BrainStation Educators and TA's</p>
