const router 		= require ('express').Router()
// const axios 		= require ('axios')
// const del 			= require ('del')
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
		cb (null, id + '.zip'); //somethingasoidaosidjaoisjd==helloworld.zip
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
		
		// const result = await utility.ramlToApiE (JSON.parse (swagger.data));
		// axios.post (`http://localhost:${process.env.PORT || 7801}/fury`, JSON.parse (swagger)).then ((apiElements) => {
		// 	if (apiElements)
		// 		res.send (apiElements.data)
		// 	else
		// 		throw "Something wrong with swagger";
		// })

		ramlFlatten.ramlFlattener (req.file.path, target_dir).then ((swagger) => {
			utility.ramlToApiE (swagger).then ((apiElements) => {
				if (apiElements)
					res.send (apiElements)
				else
					throw "Something wrong with swagger";
				
				utility.removeTempData (target_dir)
			})
		})
    } catch (err) {
        res.status (500).send ({
			"Status" : 500,
			"Message" : "Internal Server Error (Invalid RAML)"
		})
    }
})

module.exports = router
