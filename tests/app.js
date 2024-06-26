const { resolve } = require('path');
const fs = require('fs-extra');
const express = require('express');
const app = express();
const elFinder = require('../');
const ejs = require('ejs');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const uploadsDir = resolve(__dirname, process.env.PUBLIC_PATH);
const roots = [
  {
    driver: elFinder.LocalFileStorage,
    URL: '/uploads/', //Required
    path: uploadsDir, //Required
    permissions: { read: 1, write: 1, lock: 0 },
  },
];
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());
app.set('view engine', 'ejs');
app.use('/uploads', express.static(uploadsDir));

app.use('/connector', elFinder(roots));
app.get('/', function (req, res) {
  res.render(resolve(__dirname, '../index'),{
    API_URL: process.env.API_URL || 'https://localhost:3000'
  });
});

fs.mkdirpSync(uploadsDir);

module.exports = app;
