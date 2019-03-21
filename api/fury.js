const router = require('express').Router()
const utilFunctions = require('../utility')
const bodyParser = require('body-parser')

router.use('/raml', require('./raml'))

router.use (bodyParser.raw ({ limit:'50mb', verify: utilFunctions.rawBodySaver, type: function () { return true } }));

router.post("/", (req, res) => {
    utilFunctions.processInput(req, res)
});

module.exports = router