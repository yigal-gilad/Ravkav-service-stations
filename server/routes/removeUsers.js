var express = require('express');
var app = express();
var router = express.Router();
var { celebrate, Joi, errors, Segments } = require('celebrate');
app.use(errors());
var checkToken = require('../middlewares/checktoken');
var user = require('../models/user');

// allow admin/moderators to delete a report from db
router.post('/removeuser', celebrate({
    [Segments.BODY]: Joi.object().keys({
        token: Joi.string().required(),
        target_id: Joi.string().required()
    })
}), checkToken, async (req, res) => {
    user.findById(req.body.token._id)
        .then(async (doc) => {
            if (!doc) return res.status(404).send("could not find user");
            if (!["admin", "moderator"].includes(doc.role))
                return res.status(403).send("access denied");
            user.findById(req.body.target_id)
                .then(async (doc1) => {
                    if (!doc1) return res.status(404).send("could not find user");
                    if (doc1.role === 'admin')
                        return res.status(403).send("you cant remove admin");
                    if (doc.email === doc1.email)
                        return res.status(403).send("you cant remove your own user");
                    if (doc.role === doc1.role)
                        return res.status(403).send("you cant remove moderators if you are one");
                    user.remove({ _id: req.body.target_id }, function (err) {
                        if (err) return res.status(500).send("something went wrong...");
                        return res.status(200)
                            .send({ messege: "item has been deleted from database" });
                    });
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

module.exports = router;