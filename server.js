const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const controller = require('./controllers/index')
const app = express();
const upload = require('express-fileupload');
const PORT = 3000;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

controller(app);
app.use(upload())

app.listen(PORT, ()=>{console.log(`App running on port ${PORT}`)})