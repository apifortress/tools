const router 		= require ('express').Router()
const axios 		= require ('axios')
const del 			= require ('del')
const multer 		= require ('multer')
const ramlFlatten 	= require ('../raml-flatten')
const uuid 			= require ('uuid/v4')
const utility 		= require ('../utility')


const storage = multer.diskStorage ({
    destination: function (req, file, cb) {
		cb (null, 'temp/')
    },
    filename: function (req, file, cb) {
		// file.originalname
		const id = uuid ();
		cb (null, id + '.zip');
    }
});

const upload = multer ({ storage: storage });




utility.tempDirectory ('temp').then (async (valid) => {
	if (!valid)
		throw "Can\'t write on the filesystem";
});

router.post ('/', upload.single ('file'), async (req, res, next) => {
    try {
		const target_dir = req.file.path.substring (0, req.file.path.length - 4);
		const swagger = await ramlFlatten.ramlFlattener (req.file.path, target_dir);
		// const result = await utility.ramlToApiE (JSON.parse (swagger.data));
		const result = await axios.post (`http://localhost:${process.env.PORT || 7801}/fury`, JSON.parse (swagger.data));
		utility.removeTempData (target_dir);
		res.send (result.data)
    } catch (err) {
        res.status (500).send ({
			"Status" : 500,
			"Message" : "Internal Server Error (Invalid RAML)"
		})
    }
})

module.exports = router
