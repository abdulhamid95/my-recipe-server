require('dotenv').config()
const express = require('express');
const router = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const db = require('./models/database')
const models = require('./models');

const app = express();
app.use(cors());

const port = process.env.PORT || 5000;


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(morgan('dev'))

app.use('/', router);

app.use('*/images', express.static(__dirname + '/public/images'));


db.sync({}).then(() => {
    app.listen(port, () => {
       console.log(`server running`);
    })
});