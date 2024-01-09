require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const { url } = require('inspector');
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
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  const urlRegex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}/;

  if (!urlRegex.test(url)) {
    res.json({ error: 'invalid url' });
  } else {
    const urlObj = new URL(url);
    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        res.json({ error: 'invalid url' });
      } else {
        res.json({ original_url: url, short_url: 1 });
      }
    });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
