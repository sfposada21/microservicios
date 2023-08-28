const express = require('express')
const routes = express.Router()
const { getBenefits, getTest, postBitacora} = require('../controllers/benefitsController')
const { getResumeGraphics, getPayments } = require('../controllers/paymentsController')
const { getAllPermissions, 
    getPosts, 
    loanValidations, 
    vacationValidations, 
    campaniasValidations, 
    SickLeaveDiagnosis, 
    SickLeaveReasons, 
    SickLeaveTypes } = require('../controllers/homeController')
const Auth = require("../middleware/auth");

// Ruta principal
routes.get('/benefits', getBenefits);
routes.post('/bitacora', postBitacora);
routes.get('/test', Auth, getTest);
routes.get('/resume_graphics', getResumeGraphics);
routes.get('/recent_payments', getPayments);
routes.get('/permissions', getAllPermissions);
routes.get('/posts', getPosts);
routes.get('/loan_validations', loanValidations);
routes.get('/vacation_validations', vacationValidations);
routes.get('/campanias_validations', campaniasValidations);
routes.get('/sick_leave_diagnosis', SickLeaveDiagnosis);
routes.get('/sick_leave_reasons', SickLeaveReasons);
routes.get('/sick_leave_types', SickLeaveTypes);


module.exports = routes