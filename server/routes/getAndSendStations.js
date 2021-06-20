const express = require('express');
const app = express();
const router = express.Router();
const { celebrate, Joi, errors, Segments } = require('celebrate');
app.use(errors());
const fetch = require('node-fetch');
const env = require('../readenv');

// get service stations list from rav-kav api and send it back to the client
router.get('/getstations', celebrate({
    [Segments.QUERY]: Joi.object().keys({
        attributes: Joi.any().required(),
        lat: Joi.string().required(),
        lon: Joi.string().required()
    })
}), (req, res) => {
    var fetch_url = env.rav_kav_url + "?attributes=" + req.query.attributes + "&lat=" + req.query.lat +
        "&lon=" + req.query.lon;
    fetch(fetch_url,
        {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            method: 'GET',
            mode: 'no-cors'
        })
        .then(response => response.json().then(data => {
            return res.status(200).send(data);
        }))
});

module.exports = router;