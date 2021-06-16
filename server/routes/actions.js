var express = require('express');
var app = express();
var router = express.Router();
var { celebrate, Joi, errors, Segments } = require('celebrate');
app.use(errors());
var checkToken = require('../middlewares/checktoken');
var user = require('../models/user');
var actions = ["ban", "unban", "premote", "demote", "payback"];

// admin/moderators can modify users
router.post('/actions', celebrate({
    [Segments.BODY]: Joi.object().keys({
        token: Joi.string().required(),
        target_id: Joi.string().required(),
        action: Joi.string().required()
    })
}), checkToken, async (req, res) => {

    if (!actions.includes(req.body.action))
        return res.status(403).send({ messege: "invalid action" });

    user.findById(req.body.token._id)
        .then(async (doc) => {

            if (!doc) return res.status(404).send("could not find user");
            if (doc.isbanned) return res.status(403).send("banned users can't preform this action");

            if (!["admin", "moderator"].includes(doc.role))
                return res.status(403).send({ messege: "access denied" });

            user.findById(req.body.target_id)
                .then(async (doc1) => {
                    if (!doc1) return res.status(404).send("could target not find user");

                    if (doc1.role === "admin")
                        return res.status(403).send({ messege: "you cant modify admin" });

                    if (doc.email === doc1.email)
                        return res.status(403).send({ messege: "you cant modify yourself!" });

                    if (doc.role === doc1.role)
                        return res.status(403).send({ messege: "you cant modify moderators if you are one" });

                    switch (req.body.action) {
                        case "ban":
                            if (doc1.isbanned)
                                return res.status(403).send({ messege: "user is already banned" });
                            if (doc1.role !== "user") {
                                doc1.role = "user";
                            }
                            doc1.isbanned = true;
                            break;
                        case "unban":
                            if (!doc1.isbanned)
                                return res.status(403).send({ messege: "user is already unbanned" });
                            doc1.isbanned = false;
                            break;
                        case "premote":
                            if (doc.role !== "admin")
                                return res.status(403).send({ messege: "only the admin can preform this action" });
                            if (doc1.role !== "user")
                                return res.status(403).send({ messege: "user is already premoted" });
                            doc1.role = "moderator";
                            break;
                        case "demote":
                            if (doc.role !== "admin")
                                return res.status(403).send({ messege: "only the admin can preform this action" });
                            if (doc1.role === "user")
                                return res.status(403).send({ messege: "user is already demoted" });
                            doc1.role = "user";
                            break;
                        case "payback":
                            if (doc1.mouneyBack === 0)
                                return res.status(403).send({ messege: "no need to return money " });
                            doc1.mouneyBack = 0;
                            break;
                    }
                    doc1.save().then(function () {
                        return res.status(200).send({
                            messege:
                                req.body.action + " on user " + doc1.name
                                + " successfully completed"
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