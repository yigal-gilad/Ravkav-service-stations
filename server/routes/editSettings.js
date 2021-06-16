var express = require('express');
var app = express();
var router = express.Router();
var { celebrate, Joi, errors, Segments } = require('celebrate');
app.use(errors());
var checkToken = require('../middlewares/checktoken');
var user = require('../models/user');
var settings = require('../models/settings')


// only admin can edit the site settings
router.post('/editsettings', celebrate({
    [Segments.BODY]: Joi.object().keys({
        token: Joi.string().required(),
        appicon: Joi.string().required(),
        applogo: Joi.string().required(),
        credit: Joi.boolean().required(),
        disablechat: Joi.boolean().required(),
        termsofuse: Joi.string().required(),
        privacypolicy: Joi.string().required(),
        facebooklink: Joi.string(),
        instagramlink: Joi.string(),
        linkedinlink: Joi.string(),
        twitterlink: Joi.string(),
        youtubelink: Joi.string()
    })
}), checkToken, (req, res) => {

    user.findById(req.body.token._id)
        .then((doc) => {

            if (!doc) return res.status(404).send("could not find user");

            if (doc.role !== "admin")
                return res.status(403).send({ messege: "access denied" });

            settings.findOne({})
                .then((doc1) => {
                    if (!doc1) return res.status(404).send("Fatal! can't find any settings!!!");
                    doc1.appicon = req.body.appicon !== "none" ? req.body.appicon : doc1.appicon;
                    doc1.applogo = req.body.applogo !== "none" ? req.body.applogo : doc1.applogo;
                    doc1.chattdisabled = req.body.disablechat;
                    doc1.creditbuilder = req.body.credit;
                    doc1.privacypolicy = req.body.privacypolicy !== "none" ? req.body.privacypolicy : doc1.privacypolicy;
                    doc1.termsofuse = req.body.termsofuse !== "none" ? req.body.termsofuse : doc1.termsofuse;
        
                    doc1.facebooklink = req.body.facebooklink;
                    doc1.instagramlink = req.body.instagramlink;
                    doc1.linkedinlink = req.body.linkedinlink;
                    doc1.twitterlink = req.body.twitterlink;
                    doc1.youtubelink = req.body.youtubelink;
                    doc1.save().then(function () {

                        return res.status(200).send({
                            messege:
                                "Settings successfully edited"
                        });
                    });
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).send("something went wrong...")
                });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send("something went wrong...")
        });
});

module.exports = router;