const router = require('express').Router()
const axios = require('axios')
const del = require('del')
const multer = require('multer')
const ramlFlatten = require('../raml-flatten')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'temp/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
   
const upload = multer({ storage: storage })

router.post('/', upload.single('file'), async (req, res, next) => {
    try{

        const swagger = await ramlFlatten.ramlFlattener(req.file.path, 'temp')
        del(req.file.path)
        const result = await axios.post(`http://localhost:${process.env.PORT || 7801}/fury`, JSON.parse(swagger.data))
        del(swagger.filename)
        res.send(result.data)


    } catch(err){ 
        res.status(500).send(
            {
                "Status" : 500, 
                "Message" : "Internal Server Error (Invalid RAML)"
            }
        )
    }
})

module.exports = router