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
    let moneda = await executeQuery(monedaQuery, monedaParams);  
    
    moneda = moneda[0].moneda == 'SOL' ? 'S' : '$' 
          
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
  const dni = req.query.dni; 
  // Se obtiene los datos del trabajdor
  const paymentsQuery = `SELECT * FROM workflow_trabajador WHERE TRAB_NUM_DOC_IDEN = ? `;
  const paymentsParams = [dni];    
  const payments = await executeQuery(paymentsQuery, paymentsParams);  
  // console.log(payments);

  if( payments[0] == null ){
    return res.send({ error:1, message:'El trabajador no se encuentra registrado. Contacte con el administrador.', data: [], })
  }

  // Se obtiene la moneda 
  let moneda = payments[0].moneda == 'SOL' ? 'S' : '$'   

  // Se obtiene los pagos dependiendo del pais 
  if( payments[0].CIA == '01' || payments[0].CIA == 'C1' ){    
    const plmMoviprocesoExternosQuery = `SELECT concepto FROM plm_moviproceso_cards_externos_config where detalle = ? and CIA = ? `;
    const PlmMEParams = [1,'C1'];    
    const PlmME = await executeQuery(plmMoviprocesoExternosQuery, PlmMEParams);  
    
    let conceptos = []
    for (let i = 0; i < PlmME.length; i++) {
      conceptos.push(PlmME[i].concepto)     
    }    

    const plmMCEQuery = `SELECT VALOR_PAGO, FECHA_DE_PAGO, CONCEPTO FROM plm_moviproceso_cards_externos where CONCEPTO In ? 
                          and identificacion = ? and VALOR_PAGO != '0' `;
    const plmMCEParams = [[conceptos],dni ];    
    const plmMCE = await executeQuery(plmMCEQuery, plmMCEParams);  

    // console.log(plmMCE);
    c1Data = [];

    for (let i = 0; i < plmMCE.length; i++) {
      pago = {
        "fecha": plmMCE[i]["FECHA_DE_PAGO"],
        "descripcion" : plmMCE[i]["CONCEPTO"],
        "monto_pagado" : plmMCE[i]["VALOR_PAGO"],
      }
      c1Data.push(pago)     
    }   

    if (c1Data.length == 0){
      c1Data.push(
        {
        "fecha": '00/00/0000',
        "descripcion" : 'Remuneración',
        "monto_pagado" : '0.00',
      },
      {
        "fecha": '00/00/0000',
        "descripcion" : 'Adelanto quincena',
        "monto_pagado" : '0.00',
      },
      {
        "fecha": '00/00/0000',
        "descripcion" : 'Adelanto quincena',
        "monto_pagado" : '0.00',
      },
      )  
    }
    
    return res.send({ error:1, message:'ok', data: c1Data, })
  }
  else{
    
    const plmMCEQuery = `SELECT VALOR_PAGO, FECHA_DE_PAGO, CONCEPTO FROM plm_moviproceso_cards_externos where identificacion = ? and VALOR_PAGO != '0' `;
    const plmMCEParams = [ dni ];    
    const plmMCE = await executeQuery(plmMCEQuery, plmMCEParams);  

    c2Data = []

    for (let i = 0; i < plmMCE.length; i++) {
      pago = {
        "fecha": plmMCE[i]["FECHA_DE_PAGO"],
        "descripcion" : plmMCE[i]["CONCEPTO"],
        "monto_pagado" : plmMCE[i]["VALOR_PAGO"],
      }
      c2Data.push(pago)     
    }   

    if (c2Data.length == 0){
      c2Data.push(
        {
        "fecha": '00/00/0000',
        "descripcion" : 'Remuneración',
        "monto_pagado" : '0.00',
      },
      {
        "fecha": '00/00/0000',
        "descripcion" : 'Adelanto quincena',
        "monto_pagado" : '0.00',
      },
      {
        "fecha": '00/00/0000',
        "descripcion" : 'Adelanto quincena',
        "monto_pagado" : '0.00',
      },
      )  
    }
    
    return res.send({ error:1, message:'ok', data: c2Data, })
  }

  }  catch (error) {
      throw error;
    }
};
    

module.exports = { getResumeGraphics, getPayments };