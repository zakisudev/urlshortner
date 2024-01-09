require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
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

// My code
let urlDatabase = [];
let id = 1;

app.post('api/shorturl', (req, res) => {
  let url = req.body.url;
  let urlRegex = /^https?:\/\/www\.\w+\.\w+\/?$/;
  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid url' });
  } else {
    let urlObj = {
      original_url: url,
      short_url: id++,
    };
    urlDatabase.push(urlObj);
    res.json(urlObj);
  }
});

app.get('/api/shorturl/:id', (req, res) => {
  let id = req.params.id;
  let url = urlDatabase.find((url) => url.short_url === id);
  if (!url) {
    res.json({ error: 'No short URL found for the given input' });
  } else {
    res.redirect(url.original_url);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
