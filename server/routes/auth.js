var express = require('express');
var app = express();
var router = express.Router();
var { celebrate, Joi, errors, Segments } = require('celebrate');
app.use(errors());
var checkToken = require('../middlewares/checktoken');
var user = require('../models/user');

// recive jwt token and send user info to the client
router.post('/auth', celebrate({
    [Segments.BODY]: Joi.object().keys({
        token: Joi.string().required(),
    })
}), checkToken, async (req, res) => {
    user.findById(req.body.token._id)
        .then(async (doc) => {
            if (!doc) return res.status(404).send("user is not exist");
            return res.status(200).send({
                _id: doc._id,
                name: doc.name,
                email: doc.email,
                profileImg: doc.profileImg,
                role: doc.role,
                isbanned: doc.isbanned,
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send("something went wrong...")
        });
});

module.exports = router;
