const router = require('express').Router()
const utilFunctions = require('../utility')

router.use('/fury', require('./fury'))
router.use('/archive', require('./archive'))

router.get("/", (req, res) => {
	res.json({"Message" : "Server OK", "Status" : 200});
});

router.post ("/", function (req, res) {
    utilFunctions.processHighcharts(req, res)
  });

router.post('/', (req, res) => {
    utilFunctions.processHighcharts(req, res)
})






module.exports = router