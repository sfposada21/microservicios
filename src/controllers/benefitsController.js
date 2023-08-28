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

const getBenefits = async (req, res) => {
    try {
    const provincia = req.query.provincia; 
    const categoria = req.query.categoria; 

    // Se obtiene los datos del trabajdor
    const userQuery = 'SELECT * FROM workflow_trabajador WHERE TRAB_NUM_DOC_IDEN = ?';
    const userParams = [req.query.document_number];    
    const user = await executeQuery(userQuery, userParams);  
    const COD_CRITERIO= user[0].COD_CRITERIO 
    const CIA= user[0].CIA        
    const benefitParams = [CIA, COD_CRITERIO];    

    // Se obtiene el pais
    let   countryId = 48;
    if (CIA != '01'){
      countryId = 48; 
    } else {
      countryId = 172 ;
    }

    // Se obtiene provincias y categorias
    const provinciasQuery = 'SELECT * FROM departaments WHERE country_id = ?';
    const provinciasParams = [countryId];    
    const provincias = await executeQuery(provinciasQuery, provinciasParams);  

    const categoriasQuery = 'SELECT * FROM beneficio_categoria WHERE country_id = ?';
    const categoriasParams = [countryId];    
    const categorias = await executeQuery(categoriasQuery, categoriasParams);  

    // Se establece los filtros
    let categoriaQuery = '' 
    let provinciaQuery = '' 
    const DateNow = moment().format('YYYY-MM-DD');

    if (categoria != 'TODOS'){
      categoriaQuery = 'AND beneficios.categoria = ?';  
      benefitParams.push(categoria);
    }   
    if (provincia != 'TODOS'){
      provinciaQuery = 'AND beneficio_provincia.id_provincia = ?';  
      benefitParams.push(provincia);
    }   
    
    // Se obtiene los beneficicios del cliente v1
    const beneficiosClientesQuerry = `SELECT beneficios.id, beneficios.nombre, beneficios.imagen,    
                          beneficios.link, beneficios.orden,  beneficios.restriccion, beneficios.categoria FROM beneficios
                          INNER JOIN beneficios_un ON beneficios.id = beneficios_un.id_beneficio   
                          INNER JOIN beneficios_consultora ON beneficios.id = beneficios_consultora.id_beneficio
                          LEFT JOIN beneficio_clientes ON beneficios.id = beneficio_clientes.id_beneficio
                          LEFT JOIN beneficio_provincia ON beneficios.id = beneficio_provincia.id_beneficio
                          WHERE  beneficios_consultora.cia = ?
                            AND beneficios_un.uni_neg = ?
                            AND activo = 1
                            AND ${"`desde`"} <= '${DateNow}' 
	                          AND ${"`hasta`"} >= '${DateNow}' 
                            ${categoriaQuery}
                            ${provinciaQuery}
                            GROUP BY beneficios.id`;      
    const beneficiosClientes = await executeQuery(beneficiosClientesQuerry, benefitParams);
    
    // Se obtiene los beneficicios del cliente v2
    const beneficiosQuerry = `SELECT DISTINCT beneficios.* from beneficios 
                            left join beneficio_provincia on beneficio_provincia.id_beneficio = beneficios.id 
                            WHERE activo = 1
                            ${categoriaQuery}
                            ${provinciaQuery}
                            `;      
    const beneficios = await executeQuery(beneficiosQuerry, benefitParams);
         
    // Se organiza el array que se va enviar
    let beneficiosArray = [];    

    for (const item of beneficios) {                  
          const beneficioItem = {
            id: item.id_beneficio,
            cupones: item.cupones,            
            estado: item.estado,                      
            orden: item.orden,
            nombre: item.nombre,
            country_id : item.country_id,
            imagen: 'https://hrmorange.s3.amazonaws.com/' + item.imagen,
            categoria: item.categoria,
            activo: item.activo,
            link: item.link,
            restriccion: item.restriccion,
            oped_cod_criterio: item.oped_cod_criterio,
            created_at: item.created_at,
            updated_at: item.updated_at,
            detail: [],
          };    

        beneficiosArray.push(beneficioItem);
    }

    const data = {
      beneficios: beneficiosArray,
      provincias: provincias,
      categorias: categorias,
      banner: "https://hrm.overall.pe/hrm/public/img/beneficios.jpg"
    }; 


    res.send({ error:0, message:'ok', data: data, })


    }  catch (error) {
        throw error;
      }
};

const getTest = async (req, res) => {  
     res.send('Conexion aprobada!')
}

const postBitacora = async (req, res) => {  
  try {
    const provincia = req.query.provincia; 
    const categoria = req.query.categoria; 

    // Se obtiene los datos del trabajdor
    const userQuery = 'SELECT * FROM workflow_trabajador WHERE TRAB_NUM_DOC_IDEN = ?';
    const userParams = [req.query.document_number];    
    const user = await executeQuery(userQuery, userParams);  
    const COD_CRITERIO= user[0].COD_CRITERIO 
    const CIA= user[0].CIA        
    const benefitParams = [CIA, COD_CRITERIO];    

    // Se obtiene el pais
    let   countryId = 48;
    if (CIA != '01'){
      countryId = 48; 
    } else {
      countryId = 172 ;
    }

    // Se obtiene provincias y categorias
    const provinciasQuery = 'SELECT * FROM departaments WHERE country_id = ?';
    const provinciasParams = [countryId];    
    const provincias = await executeQuery(provinciasQuery, provinciasParams);  

    const categoriasQuery = 'SELECT * FROM beneficio_categoria WHERE country_id = ?';
    const categoriasParams = [countryId];    
    const categorias = await executeQuery(categoriasQuery, categoriasParams);  

    // Se establece los filtros
    let categoriaQuery = '' 
    let provinciaQuery = '' 
    const DateNow = moment().format('YYYY-MM-DD');

    if (categoria != 'TODOS'){
      categoriaQuery = 'AND beneficios.categoria = ?';  
      benefitParams.push(categoria);
    }   
    if (provincia != 'TODOS'){
      provinciaQuery = 'AND beneficio_provincia.id_provincia = ?';  
      benefitParams.push(provincia);
    }   
    
    // Se obtiene los beneficicios del cliente v1
    const beneficiosClientesQuerry = `SELECT beneficios.id, beneficios.nombre, beneficios.imagen,    
                          beneficios.link, beneficios.orden,  beneficios.restriccion, beneficios.categoria FROM beneficios
                          INNER JOIN beneficios_un ON beneficios.id = beneficios_un.id_beneficio   
                          INNER JOIN beneficios_consultora ON beneficios.id = beneficios_consultora.id_beneficio
                          LEFT JOIN beneficio_clientes ON beneficios.id = beneficio_clientes.id_beneficio
                          LEFT JOIN beneficio_provincia ON beneficios.id = beneficio_provincia.id_beneficio
                          WHERE  beneficios_consultora.cia = ?
                            AND beneficios_un.uni_neg = ?
                            AND activo = 1
                            AND ${"`desde`"} <= '${DateNow}' 
	                          AND ${"`hasta`"} >= '${DateNow}' 
                            ${categoriaQuery}
                            ${provinciaQuery}
                            GROUP BY beneficios.id`;      
    const beneficiosClientes = await executeQuery(beneficiosClientesQuerry, benefitParams);
    
    // Se obtiene los beneficicios del cliente v2
    const beneficiosQuerry = `SELECT DISTINCT beneficios.* from beneficios 
                            left join beneficio_provincia on beneficio_provincia.id_beneficio = beneficios.id 
                            WHERE activo = 1
                            ${categoriaQuery}
                            ${provinciaQuery}
                            `;      
    const beneficios = await executeQuery(beneficiosQuerry, benefitParams);
         
    // Se organiza el array que se va enviar
    let beneficiosArray = [];    

    for (const item of beneficios) {                  
          const beneficioItem = {
            id: item.id_beneficio,
            cupones: item.cupones,            
            estado: item.estado,                      
            orden: item.orden,
            nombre: item.nombre,
            country_id : item.country_id,
            imagen: 'https://hrmorange.s3.amazonaws.com/' + item.imagen,
            categoria: item.categoria,
            activo: item.activo,
            link: item.link,
            restriccion: item.restriccion,
            oped_cod_criterio: item.oped_cod_criterio,
            created_at: item.created_at,
            updated_at: item.updated_at,
            detail: [],
          };    

        beneficiosArray.push(beneficioItem);
    }

    const data = {
      beneficios: beneficiosArray,
      provincias: provincias,
      categorias: categorias,
      banner: "https://hrm.overall.pe/hrm/public/img/beneficios.jpg"
    }; 


    res.send({ error:0, message:'ok', data: data, })


    }  catch (error) {
        throw error;
      }
}
     

module.exports = { getBenefits,  getTest, postBitacora };