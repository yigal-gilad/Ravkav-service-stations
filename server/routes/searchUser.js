var express = require('express');
var app = express();
var router = express.Router();
var { celebrate, Joi, errors, Segments } = require('celebrate');
app.use(errors());
var checkToken = require('../middlewares/checktoken');
var user = require('../models/user');

// allow admin/moderators to search users
router.post('/searchuser', celebrate({
  [Segments.BODY]: Joi.object().keys({
    token: Joi.string().required(),
    feed: Joi.string().required()
  })
}), checkToken, async (req, res) => {
  user.findById(req.body.token._id)
    .then((doc) => {
      if (!doc) return res.status(404).send("could not find user");
      if (!["admin", "moderator"].includes(doc.role))
        return res.status(403).send("access denied");
        // user.find({$text: { $search: req.body.feed.replace('', '') } },
        //   { score: { $meta: "textScore" } })
        //   .sort({ score: { $meta: "textScore" } })
        user.find({ name: req.body.feed })
        .then((doc1) => {
          if (!doc1.length) return res.status(404).send("no results for this search");
          return res.status(200).send({ data: doc1 });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send("something went wrong...");
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("something went wrong...");
    });
});

module.exports = router

// find({ h: "true", $text: { $search: req.body.email.replace('', '') } },
//           { score: { $meta: "textScore" } })
//           .sort({ score: { $meta: "textScore" } })