const express 		= require("express");
const bodyParser 	= require('body-parser');
const app 			= express();
const volleyball    = require('volleyball');
const PORT          = process.env.PORT || 7801;
const utilFunctions = require('./utility')

//transactional logging
app.use(volleyball);

//body-parsing middleware. 
app.use (bodyParser.json ({ limit: '50mb', verify: utilFunctions.rawBodySaver }));

//routing middleware
app.use('/', require('./api'))

//generic error handling
app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })

//start server on process.env.PORT or 7801
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})


//exported for testing purposes
module.exports = app 
