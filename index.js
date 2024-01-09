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

app.post('/api/shorturl', (req, res) => {
  let { url } = req.body;
  let urlRegex = /^(http|https):\/\/www\.[a-z0-9]+\.[a-zA-Z0-9]/g;
  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid url' });
  } else {
    dns.lookup(url.split('//')[1].split('/')[0], (err, address, family) => {
      if (err) {
        res.json({ error: 'invalid url' });
      } else {
        urlDatabase.push({ original_url: url, short_url: id++ });
        res.json({ original_url: url, short_url: id - 1 });
      }
    });
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
