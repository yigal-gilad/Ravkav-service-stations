var express = require('express');
var app = express();
var router = express.Router();
var { celebrate, Joi, errors, Segments } = require('celebrate');
app.use(errors());
var user = require('../models/user');
var formatDate = require('../fuctions/formatdate')
const { OAuth2Client } = require('google-auth-library');
var env = require('../readenv')
const client = new OAuth2Client(env.GOOGLE_CLINT_ID);
const request = require('request');
var jwt = require('jsonwebtoken');

// login user with google or facebook
router.post('/signup', celebrate({
    [Segments.BODY]: Joi.object().keys({
        provider: Joi.string().required(),
        id: Joi.string(),
        token: Joi.string().required(),
    })
}), async (req, res) => {

    if (req.body.provider === "facebook") {

        request("https://graph.facebook.com/" + req.body.id + "?fields=birthday,email,hometown,picture,name&access_token=" + req.body.token,
            function (error, response, body) {
                var fbData = JSON.parse(body);

                if (fbData.error) return res.status(403).send(fbData.error);
                // console.log(fbData);
                user.findOne({ email: fbData.email }).
                    then((doc) => {
                        if (doc) {
                            doc.provider = req.body.provider,
                                doc.name = fbData.name,
                                doc.email = fbData.email,
                                doc.profileImg = fbData.picture.data.url
                            doc.save().then(function () {
                                var token = jwt.sign({ _id: doc._id }, env.jwt_pass);
                                return res.status(200).send({ token: token });
                            });
                        } else {
                            var User = new user({
                                date: formatDate(new Date),
                                provider: req.body.provider,
                                name: fbData.name,
                                email: fbData.email,
                                profileImg: fbData.picture.data.url,
                                role: "user",
                                isbanned: false,
                            });
                            User.save().then(function () {
                                var token = jwt.sign({ _id: User._id }, env.jwt_pass);
                                return res.status(200).send({ token: token });
                            });
                        }
                    })
            });
    } else {
        try {
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: env.GOOGLE_CLINT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            // console.log(payload);
            user.findOne({ email: payload.email }).
                then((doc) => {
                    if (doc) {
                        doc.provider = req.body.provider,
                            doc.name = payload.name,
                            doc.profileImg = payload.picture
                        doc.save().then(function () {
                            var jwttoken = jwt.sign({ _id: doc._id }, env.jwt_pass);
                            return res.status(200).send({ token: jwttoken });
                        });
                    } else {
                        var User = new user({
                            date: formatDate(new Date),
                            provider: req.body.provider,
                            name: payload.name,
                            email: payload.email,
                            profileImg: payload.picture,
                            role: "user",
                            isbanned: false,
                        });
                        User.save().then(function () {
                            var jwttoken = jwt.sign({ _id: User._id }, env.jwt_pass);
                            return res.status(200).send({ token: jwttoken });
                        });
                    }
                })
        } catch (err) {
            console.log(err);
            return res.status(403).send(err);
        }
    }
});

module.exports = router;