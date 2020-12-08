const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const cors = require('cors');
 
module.exports = () => {
 const app = express();
 app.use(bodyParser.json({limit: '50mb'}));
 app.use(cors());
 app.use(bodyParser.urlencoded({ extended: true, limit:'50mb', parameterLimit: 100000 }));
 app.use('/estatico', express.static('public'));
 consign()
   .include('controllers')
   .into(app);
 
 return app;
}