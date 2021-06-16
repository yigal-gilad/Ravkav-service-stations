const express = require('express');
const app = express();
const http = require('http');
// const debug = require('debug')()
const helmet = require('helmet');
const clc = require("cli-color");
const server = http.Server(app);
const fetch = require('node-fetch');
const bodyParser = require("body-parser");
const env = require('./readenv');
const Ddos = require('ddos');
const ddos = new Ddos({ burst: parseInt(env.ddos_burst), limit: parseInt(env.ddos_limit) });
const port = env.port || 3000;


if (env.node_env !== "production") {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  app.use(require('express-request-response-logger')());
}

app.use(ddos.express)
app.use(require('sanitize').middleware);
app.use(helmet())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname + '/dist/app'));

// get rav-kav nearby stations
app.get('/getstations', async (req, res) => {
  fetch(req.query.url + "&lat=" + req.query.lat +
  "&lon=" + req.query.lon,
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      method: 'GET',
      mode: 'no-cors'
    })
    .then(response => response.json().then(data => {
      console.log(req.query.url)
      return res.status(200).send(data);
    }))
    .then(data => {
      console.log(req.query.url)
    })
});

// start server
server.listen(port, () => {
  console.log('started on port: ' + clc.cyan.bold(port));
});

