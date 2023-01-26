const express = require("express");
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require("body-parser");
const cors = require("cors");

// Import config
require("dotenv").config();
const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Server
app.listen(PORT, () => {
    console.log(`App running on Port #${PORT}`);
});