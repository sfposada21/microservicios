const { DOUBLE } = require("mysql/lib/protocol/constants/types");
const pool = require("../db/db");
const moment = require('moment');

function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
      pool.query(query, params, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

const getResumeGraphics = async (req, res) => {
    try {
    const documentNumber = req.query.document_number; 
    const year = moment().year();

    // Se obtiene los datos del trabajdor
    const graphicsQuery = `SELECT ID_PERIODO, ANO_ACTUAL, INGRESOS, BONIFICACIONES, APORTACIONES, 
                        QUINTA FROM PLM_MOVIPROCESO_CARDS 
                        WHERE NUM_DOC_IDEN = ? AND ANO_ACTUAL = ? ORDER BY ID_PERIODO`;
    const graphicsParams = [documentNumber, year];    
    const graphics = await executeQuery(graphicsQuery, graphicsParams);  
    console.log(graphics);
  
    // Se obtiene la moneda 
    const monedaQuery = 'select moneda from workflow_trabajador where TRAB_NUM_DOC_IDEN = ?';
    const monedaParams = [documentNumber];    
    const moneda = await executeQuery(monedaQuery, monedaParams);  

          
    // Se organiza los valores      
    let ingresos       = 0;
    let bonificaciones = 0;
    let aportaciones   = 0;
    let quinta         = 0;

    for (const item of graphics) {                  
       ingresos       += parseFloat(item.INGRESOS);
       bonificaciones += parseFloat(item.BONIFICACIONES);
       aportaciones   += parseFloat(item.APORTACIONES);
       quinta         += parseFloat(item.QUINTA);
    }

    const data = [
        {
            "orden" : "1",
            "tipo": "INGRESOS",
            "valor_concepto" : "",
            "periodo" :"",
            "total": `${moneda} ${ingresos.toFixed(2)}`
        },
        {
            "orden" : "2",
            "tipo": "BONIFICACIONES",
            "valor_concepto" : "",
            "periodo" :"",
            "total": `${moneda} ${bonificaciones.toFixed(2)}`
        },
        {
            "orden" : "3",
            "tipo": "APORTACIONES",
            "valor_concepto" : "",
            "periodo" :"",
            "total": `${moneda} ${aportaciones.toFixed(2)}`
        },
        {
            "orden" : "4",
            "tipo": "QUINTA",
            "valor_concepto" : "",
            "periodo" :"",
            "total": `${moneda} ${quinta.toFixed(2)}`
        },

    ]

    res.send({ error:0, message:'ok', data: data, })

    }  catch (error) {
        throw error;
      }
};

const getPayments = async (req, res) => {
  try {
  const documentNumber = req.query.document_number; 
  const year = moment().year();

  // Se obtiene los datos del trabajdor
  const graphicsQuery = `SELECT ID_PERIODO, ANO_ACTUAL, INGRESOS, BONIFICACIONES, APORTACIONES, 
                      QUINTA FROM PLM_MOVIPROCESO_CARDS 
                      WHERE NUM_DOC_IDEN = ? AND ANO_ACTUAL = ? ORDER BY ID_PERIODO`;
  const graphicsParams = [documentNumber, year];    
  const graphics = await executeQuery(graphicsQuery, graphicsParams);  
  console.log(graphics);

  // Se obtiene la moneda 
  const monedaQuery = 'select moneda from workflow_trabajador where TRAB_NUM_DOC_IDEN = ?';
  const monedaParams = [documentNumber];    
  const moneda = await executeQuery(monedaQuery, monedaParams);  

        
  // Se organiza los valores      
  let ingresos       = 0;
  let bonificaciones = 0;
  let aportaciones   = 0;
  let quinta         = 0;

  for (const item of graphics) {                  
     ingresos       += parseFloat(item.INGRESOS);
     bonificaciones += parseFloat(item.BONIFICACIONES);
     aportaciones   += parseFloat(item.APORTACIONES);
     quinta         += parseFloat(item.QUINTA);
  }

  const data = [
      {
          "orden" : "1",
          "tipo": "INGRESOS",
          "valor_concepto" : "",
          "periodo" :"",
          "total": `${moneda} ${ingresos.toFixed(2)}`
      },
      {
          "orden" : "2",
          "tipo": "BONIFICACIONES",
          "valor_concepto" : "",
          "periodo" :"",
          "total": `${moneda} ${bonificaciones.toFixed(2)}`
      },
      {
          "orden" : "3",
          "tipo": "APORTACIONES",
          "valor_concepto" : "",
          "periodo" :"",
          "total": `${moneda} ${aportaciones.toFixed(2)}`
      },
      {
          "orden" : "4",
          "tipo": "QUINTA",
          "valor_concepto" : "",
          "periodo" :"",
          "total": `${moneda} ${quinta.toFixed(2)}`
      },

  ]

  res.send({ error:0, message:'ok', data: data, })

  }  catch (error) {
      throw error;
    }
};
    

module.exports = { getResumeGraphics, getPayments };