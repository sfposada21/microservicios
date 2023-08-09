const express = require('express')
const routes = express.Router()
const { getBenefits, deleteCustomer} = require('../controllers/customerController')

// Ruta principal
routes.get('/benefits', getBenefits);

routes.post('/delete/:id', deleteCustomer);



module.exports = routes