const express = require('express')
const routes = express.Router()
const { getBenefits, getTest, postBitacora} = require('../controllers/benefitsController')
const { getResumeGraphics, getPayments } = require('../controllers/paymentsController')
const Auth = require("../middleware/auth");

// Ruta principal
routes.get('/benefits', getBenefits);
routes.post('/bitacora', postBitacora);
routes.get('/test', Auth, getTest);
routes.get('/resume_graphics', getResumeGraphics);
routes.get('/payments_recent', getPayments);


module.exports = routes