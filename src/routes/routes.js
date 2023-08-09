const express = require('express')
const routes = express.Router()
const { getBenefits, deleteCustomer, getTest} = require('../controllers/customerController')

// Ruta principal
routes.get('/benefits', getBenefits);

routes.post('/delete/:id', deleteCustomer);

routes.get('/test', getTest);


module.exports = routes