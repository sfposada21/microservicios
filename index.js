// index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const cors = require('cors');
const morgan = require('morgan')

const app = express();
const routes = require('./src/routes/routes')

// settings
app.set('port', process.env.PORT || 3003)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/hrm_api_node/api', routes);

// Escuchar el puerto
app.listen(app.get('port'), () => {
  console.log(`Microservicio escuchando en ${app.get('port')}`);
});
