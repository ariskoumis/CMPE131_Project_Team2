const express = require('express');
const handlers = require('./util/route_handlers.js');
const app = express();
const PORT = 8000;

//Serve public folder (required to reference files when using express)
app.use(express.static('public'));

//Establish endpoint handlers
app.get('/', handlers.rootHandler);
app.get('/home', handlers.homeHandler);

//Provide port to access project
app.listen(PORT, () => console.log(`Project hosted on port ${PORT}!`));