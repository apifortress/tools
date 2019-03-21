// var _stringify = require('babel-runtime/core-js/json/stringify');
// var _stringify2 = _interopRequireDefault(_stringify);
// var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');
// var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
// var _createClass2 = require('babel-runtime/helpers/createClass');
// var _createClass3 = _interopRequireDefault(_createClass2);
// var _fs = require('fs');
// var _fs2 = _interopRequireDefault(_fs);
// var _repl = require('repl');
// var _repl2 = _interopRequireDefault(_repl);
// var _tty = require('tty');
// var _jsYaml = require('js-yaml');
// var _jsYaml2 = _interopRequireDefault(_jsYaml);
// var _commander = require('commander');
// var _commander2 = _interopRequireDefault(_commander);
// var _cardinal = require('cardinal');
// var _tomorrowNight = require('cardinal/themes/tomorrow-night');
// var _tomorrowNight2 = _interopRequireDefault(_tomorrowNight);
var _json = require('minim/lib/serialisers/json-0.6');
var _json2 = _interopRequireDefault(_json);
var _fury = require('fury');
var _fury2 = _interopRequireDefault(_fury);
var _furyAdapterSwagger = require('fury-adapter-swagger');
var _furyAdapterSwagger2 = _interopRequireDefault(_furyAdapterSwagger);
var _furyAdapterApibParser = require('fury-adapter-apib-parser');
var _furyAdapterApibParser2 = _interopRequireDefault(_furyAdapterApibParser);
var _furyAdapterApibSerializer = require('fury-adapter-apib-serializer');
var _furyAdapterApibSerializer2 = _interopRequireDefault(_furyAdapterApibSerializer);
var _furyAdapterApiaryBlueprintParser = require('fury-adapter-apiary-blueprint-parser');
var _furyAdapterApiaryBlueprintParser2 = _interopRequireDefault(_furyAdapterApiaryBlueprintParser);
const ramlConverter = require('oas-raml-converter');
const exporter = require('highcharts-export-server');
const util = require('util')
const fs = require('fs')

const ramlToOas20 = new ramlConverter.Converter(ramlConverter.Formats.RAML, ramlConverter.Formats.OAS20)

// exporter.initPool();

_fury2.default.use(_furyAdapterSwagger2.default);
_fury2.default.use(_furyAdapterApibParser2.default);
_fury2.default.use(_furyAdapterApibSerializer2.default);
_fury2.default.use(_furyAdapterApiaryBlueprintParser2.default);

function _interopRequireDefault (obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function rawBodySaver (req, res, buf, encoding) {
	if (buf && buf.length) {
		req.rawBody = buf.toString (encoding || 'utf8');
	}
}

function processInput (request, response) {
	var input 	= request.rawBody,
		options = {
			source: input
		},
		output = null;

	_fury2.default['parse'](options, function (err, result) {
		if (result) {
			try {
	        	var serialiser = new _json2.default (_fury2.default.minim);
	    	
	    		response.send (serialiser.serialise (result));
	    	} catch (e) {
				response.status (500);
				console.error(e)
  				response.send ({ error: e })
	    	}
	    } 

	    else {
	    	response.status (500);
  			response.send ({ error: err })
	    }
	})
}

function processHighcharts (request, response) {
	var exportSettings = request.body;

	exportSettings.options = exportSettings.infile;
	delete exportSettings.infile;

	// Perform an export
	exporter.export (exportSettings, function (err, res) {
	    // The export result is now in res.
	    // If the output is not PDF or SVG, it will be base64 encoded (res.data).
	    // If the output is a PDF or SVG, it will contain a filename (res.filename).

	    // Kill the pool when we're done with it, and exit the application
	    if (res && res.data !== undefined)
	    	response.send (res.data);
	    else
	    	response.send (null);
	    // exporter.killPool ();
	    // process.exit (1);
	});
}

const processRaml = (req) => {
    return ramlToOas20.convertData(req.rawBody)
}

module.exports = { rawBodySaver, processInput, processHighcharts, processRaml, ramlToOas20 }