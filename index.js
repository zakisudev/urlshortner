require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Url Shortener Microservice
const urlDatabase = [];
const urlRegex =
  /^(https?:\/\/)?(www\.)?([\w-]+)(\.[a-z]{2,8})(\.[a-z]{2,8})?(\.[a-z]{2,8})?/;

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  const urlMatch = url.match(urlRegex);
  if (!urlMatch) {
    res.json({ error: 'invalid url' });
  } else {
    const urlObj = {
      original_url: url,
      short_url: urlDatabase.length,
    };
    urlDatabase.push(urlObj);
    res.json(urlObj);
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const { short_url } = req.params;
  const urlObj = urlDatabase[short_url];

  if (!urlObj) {
    res.json({ error: 'invalid url' });
  } else {
    res.redirect(urlObj.original_url);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
