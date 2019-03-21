const router = require('express').Router()
const bodyParser = require('body-parser')
const utilFunctions = require('../utility')
const axios = require('axios')

router.use (bodyParser.raw ({ limit:'50mb', verify: utilFunctions.rawBodySaver, type: function () { return true } }));

router.post('/', (req, res, next) => {
    if(req.headers['content-type'].includes('multipart/form-data')){
        return res.redirect(308, '/archive')
    }
    utilFunctions.processRaml(req)
    .then((swagger) => {
        return axios.post(`http://localhost:${process.env.PORT || 7801}/fury`, JSON.parse(swagger))
    })
    .then((response) => {
        res.status(200).send(response.data)
    })
    .catch((err) => {
        console.error(err)
        res.status(500)
        res.send("Unable to parse RAML!")
    })
})

module.exports = router