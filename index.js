const express = require("express");
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require("body-parser");
const cors = require("cors");
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

// Server
app.listen(PORT, () => {
    console.log(`App running on Port #${PORT}`);
});