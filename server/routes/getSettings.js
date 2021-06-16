var express = require('express');

var router = express.Router();

var settings = require("../models/settings")

router.get('/getsettings', async (req, res) => {
  settings.find({}).then((doc) => {
    if (!doc) return res.status(500).send("something went wrong...");
    return res.status(200).send(doc);
  })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("something went wrong...");
    });
});

module.exports = router;