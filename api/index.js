const router = require('express').Router()
// const utilFunctions = require('../utility')
const exporter = require('highcharts-export-server');

exporter.initPool ();

router.use('/fury', require('./fury'))
router.use('/archive', require('./archive'))

router.get("/", (req, res) => {
	res.json({"Message" : "Server OK", "Status" : 200});
});

// router.post ("/", function (req, res) {
//     utilFunctions.processHighcharts(req, res)
//   });

router.post('/', (request, response) => {
  var exportSettings = request.body;

	exportSettings.options = exportSettings.infile;
	delete exportSettings.infile;
    // utilFunctions.processHighcharts(req, res)
    exporter.export (exportSettings, function (err, res) {
	    if (res && res.data !== undefined)
	    	response.send (res.data);
	    else
	    	response.send (null);
	});
})






module.exports = router