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

const getAllPermissions = async (req, res) => {
    try {
    const documentNumber = req.query.document_number; 
    const year = moment().year();

    // Se obtiene los datos del trabajdor
    const permissionsQuery = `SELECT * FROM permissions`;
    const loanValidationsParams = [documentNumber];    
    const permissions = await executeQuery(permissionsQuery, loanValidationsParams);  
    console.log(permissions);  
     
    res.send({ error:0, message:'ok', data: permissions, })

    }  catch (error) {
        throw error;
      }
};

const getPosts = async (req, res) => {
  try {
  const documentNumber  = req.query.document_number;   
  const tipo            = req.query.tipo; 
  const category_id     = req.query.category_id;   
  const sub_category_id = req.query.sub_category_id;   
  const DateNow         = moment().format('YYYY-MM-DD');

  // Se obtiene los datos del trabajdor
  const trabajadorQuery = `SELECT * FROM workflow_trabajador where TRAB_NUM_DOC_IDEN = ?`;
  const trabajadorParams = [documentNumber];    
  const trabajador = await executeQuery(trabajadorQuery, trabajadorParams);  
  
  const userQuery = `SELECT * FROM users where document_number = ?`;
  const userParams = [documentNumber];    
  const user = await executeQuery(userQuery, userParams);  
  let dataPost = []


  if (tipo == '1'){
    const postQuery = `SELECT 
                    publicaciones.id, 
                    publicaciones.titulo as title,
                    publicaciones.descripcion as content,
                    CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.imagen) poster,
                    IFNULL(publicaciones.video, '') video,
                    IF(publicaciones.pdf IS NULL OR publicaciones.pdf = '', '', CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.pdf)) document,
                    publicaciones.prioridad,
                    categories.name,
                    publicaciones.desde created_at,
                    0 visto,
                    if (NOT EXISTS (SELECT NULL FROM publicaciones_visto WHERE id_publicacion = publicaciones.id AND id_usuario = ? AND if(publicaciones.video IS NOT NULL, tipo = 'video', tipo IS NOT NULL)), 0, 1) visto_video,
                    if (NOT EXISTS (SELECT NULL FROM publicaciones_visto WHERE id_publicacion = publicaciones.id AND id_usuario = ? AND if(publicaciones.pdf IS NOT NULL, tipo = 'pdf', tipo IS NOT NULL)), 0, 1) visto_pdf
                FROM 
                    publicaciones
                INNER JOIN
                    categories ON publicaciones.id_categoria = categories.id
                INNER JOIN
                    publicaciones_sub_categories ON publicaciones.id_sub_categoria = publicaciones_sub_categories.id
                INNER JOIN
                    publicaciones_filtro ON publicaciones.id = publicaciones_filtro.id_publicacion
                WHERE
                    (publicaciones_filtro.cia like ? OR publicaciones_filtro.cia is null)
                AND
                    (publicaciones_filtro.cliente like ? OR publicaciones_filtro.cliente is null)
                AND
                    (publicaciones_filtro.unidad_negocio like ? OR publicaciones_filtro.unidad_negocio is null)
                AND
                    (publicaciones_filtro.sucursal like ? OR publicaciones_filtro.sucursal is null)
                AND
                    (publicaciones_filtro.area like ? OR publicaciones_filtro.area is null)
                AND
                    ? BETWEEN publicaciones.desde AND publicaciones.hasta
                AND
                    (
                        NOT EXISTS (SELECT NULL FROM publicaciones_visto WHERE id_publicacion = publicaciones.id AND id_usuario = ? AND if(publicaciones.video IS NOT NULL, tipo = 'video', tipo IS NOT NULL))
                        OR 
                        NOT EXISTS (SELECT NULL FROM publicaciones_visto WHERE id_publicacion = publicaciones.id AND id_usuario = ? AND if(publicaciones.pdf IS NOT NULL, tipo = 'pdf', tipo IS NOT NULL))
                    )
                UNION
                SELECT 
                    publicaciones.id, 
                    publicaciones.titulo as title,
                    publicaciones.descripcion as content,
                    CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.imagen) poster,
                    IFNULL(publicaciones.video, '') video,
                    IF(publicaciones.pdf IS NULL OR publicaciones.pdf = '', '', CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.pdf)) document,
                    publicaciones.prioridad,
                    categories.name,
                    publicaciones.desde created_at,
                    1 visto,
                    1 visto_video,
                    1 visto_pdf
                FROM 
                    publicaciones
                INNER JOIN
                    categories ON publicaciones.id_categoria = categories.id
                INNER JOIN
                    publicaciones_sub_categories ON publicaciones.id_sub_categoria = publicaciones_sub_categories.id
                INNER JOIN
                    publicaciones_filtro ON publicaciones.id = publicaciones_filtro.id_publicacion
                WHERE
                    (publicaciones_filtro.cia like ? OR publicaciones_filtro.cia is null)
                AND
                    (publicaciones_filtro.cliente like ? OR publicaciones_filtro.cliente is null)
                AND
                    (publicaciones_filtro.unidad_negocio like ? OR publicaciones_filtro.unidad_negocio is null)
                AND
                    (publicaciones_filtro.sucursal like ? OR publicaciones_filtro.sucursal is null)
                AND
                    (publicaciones_filtro.area like ? OR publicaciones_filtro.area is null)
                AND
                    ? BETWEEN publicaciones.desde AND publicaciones.hasta
                AND
                    (
                        EXISTS (SELECT NULL FROM publicaciones_visto WHERE id_publicacion = publicaciones.id AND id_usuario = ? AND if(publicaciones.video IS NOT NULL, tipo = 'video', tipo IS NOT NULL))
                        AND 
                        EXISTS (SELECT NULL FROM publicaciones_visto WHERE id_publicacion = publicaciones.id AND id_usuario = ? AND if(publicaciones.pdf IS NOT NULL, tipo = 'pdf', tipo IS NOT NULL))
                    )`;
      const postParams = [        
        user[0].id,
        user[0].id, 
        trabajador[0].CIA,
        trabajador[0].CLIE,
        trabajador[0].COD_CRITERIO,
        trabajador[0].ASUC_COD_ASUC,
        trabajador[0].AREA_COD_CCOSTO,
        DateNow,
        user[0].id,
        user[0].id,  
        trabajador[0].CIA,
        trabajador[0].CLIE,
        trabajador[0].COD_CRITERIO,
        trabajador[0].ASUC_COD_ASUC,
        trabajador[0].AREA_COD_CCOSTO,
        DateNow,
        user[0].id,
        user[0].id
      ]
     dataPost = await executeQuery(postQuery, postParams); 
    
  }  else if( sub_category_id == '0') { 
      const postQuery = `SELECT 
      publicaciones.id, 
      publicaciones.titulo as title,
      publicaciones.descripcion as content,
      CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.imagen) poster,
      IFNULL(publicaciones.video, '') video,
      IF(publicaciones.pdf IS NULL OR publicaciones.pdf = '', '', CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.pdf)) document,
      publicaciones.prioridad,
      categories.name,
      publicaciones.desde created_at,
      1 visto,
      1 visto_video,
      1 visto_pdf
      FROM 
          publicaciones
      INNER JOIN
          categories ON publicaciones.id_categoria = categories.id
      INNER JOIN
          publicaciones_sub_categories ON publicaciones.id_sub_categoria = publicaciones_sub_categories.id
      INNER JOIN
          publicaciones_filtro ON publicaciones.id = publicaciones_filtro.id_publicacion
      WHERE
          (publicaciones_filtro.cia like ? OR publicaciones_filtro.cia is null)
      AND
          (publicaciones_filtro.cliente like ? OR publicaciones_filtro.cliente is null)
      AND
          (publicaciones_filtro.unidad_negocio like ? OR publicaciones_filtro.unidad_negocio is null)
      AND
          (publicaciones_filtro.sucursal like ? OR publicaciones_filtro.sucursal is null)
      AND
          (publicaciones_filtro.area like ? OR publicaciones_filtro.area is null)
      AND
          categories.id = ?
                      )`;
        const postParams = [     
          trabajador[0].CIA,
          trabajador[0].CLIE,
          trabajador[0].COD_CRITERIO,
          trabajador[0].ASUC_COD_ASUC,
          trabajador[0].AREA_COD_CCOSTO,
          category_id,
        ]
      dataPost = await executeQuery(postQuery, postParams); 
  }  else {
    const postQuery = `
            SELECT 
                publicaciones.id, 
                publicaciones.titulo as title,
                publicaciones.descripcion as content,
                CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.imagen) poster,
                IFNULL(publicaciones.video, '') video,
                IF(publicaciones.pdf IS NULL OR publicaciones.pdf = '', '', CONCAT('https://hrmorange.s3.amazonaws.com/', publicaciones.pdf)) document,
                publicaciones.prioridad,
                categories.name,
                publicaciones.desde created_at,
                1 visto,
                1 visto_video,
                1 visto_pdf
            FROM 
                publicaciones
            INNER JOIN
                categories ON publicaciones.id_categoria = categories.id
            INNER JOIN
                publicaciones_sub_categories ON publicaciones.id_sub_categoria = publicaciones_sub_categories.id
            INNER JOIN
                publicaciones_filtro ON publicaciones.id = publicaciones_filtro.id_publicacion
            WHERE
                (publicaciones_filtro.cia like ? OR publicaciones_filtro.cia is null)
            AND
                (publicaciones_filtro.cliente like ? OR publicaciones_filtro.cliente is null)
            AND
                (publicaciones_filtro.unidad_negocio like ? OR publicaciones_filtro.unidad_negocio is null)
            AND
                (publicaciones_filtro.sucursal like ? OR publicaciones_filtro.sucursal is null)
            AND
                (publicaciones_filtro.area like ? OR publicaciones_filtro.area is null)
            AND
                categories.id = ?
            AND
                publicaciones_sub_categories.id = ?
            )`;
      const postParams = [     
        trabajador[0].CIA,
        trabajador[0].CLIE,
        trabajador[0].COD_CRITERIO,
        trabajador[0].ASUC_COD_ASUC,
        trabajador[0].AREA_COD_CCOSTO,
        category_id,
        sub_category_id,
      ]
    dataPost = await executeQuery(postQuery, postParams); 
  }  
  
   
  res.send({ error:0, message:'ok', data: dataPost })

  }  catch (error) {
      throw { error:error, message:'ok', data: [], };
    }
};

const loanValidations = async (req, res) => {
  try {
  const no_cia = req.query.no_cia; 

  // Se obtiene los datos del trabajdor
  const loanValidationsQuery = `SELECT
          workflow_prestamos.*,
          workflow_prestamos_detalle.porcentaje_interes,
          workflow_prestamos_detalle.numero_max_cuotas,
          workflow_prestamos_detalle.monto_max,
          workflow_prestamos_detalle.val_adjuntos,
          workflow_prestamos_detalle.val_remuneracion,
          workflow_prestamos_detalle.val_lbs,
          workflow_prestamos_detalle.descontar_en,
          workflow_prestamos_detalle.tope_monto,
          workflow_prestamos_detalle.cuota_editable,
          workflow_prestamos_detalle.descontar_en_editable,
          workflow_prestamos_detalle.cuota_default,
          workflow_prestamos_detalle.descontar_en_default
        FROM
          workflow_prestamos_detalle
        JOIN
          workflow_prestamos ON workflow_prestamos.id = workflow_prestamos_detalle.id_workflow_prestamo
        WHERE
          no_cia = ? AND
          workflow_prestamos_detalle.estado = 1
        ORDER BY
          workflow_prestamos.id;
          `;  
  const loanValidationsParams = [no_cia];    
  const loanValidations = await executeQuery(loanValidationsQuery, loanValidationsParams);  
     
  res.send({ error:0, message:'ok', data: loanValidations, })

  }  catch (error) {
      throw error;
    }
};

const vacationValidations = async (req, res) => {
  try {
  const no_cia = req.query.no_cia; 

  // Se obtiene los datos de las vacaciones
  const vacationQuery = `
              SELECT
              workflow_vacaciones.*,
              workflow_vacaciones_detalle.maximo_vac,
              workflow_vacaciones_detalle.val_adjuntos
            FROM
              workflow_vacaciones_detalle
            JOIN
              workflow_vacaciones ON workflow_vacaciones.id = workflow_vacaciones_detalle.id_workflow_vacaciones
            WHERE
              cia = ?
            ORDER BY
              workflow_vacaciones.id;
          `;  
  const vacationParams = [no_cia];    
  const vacations = await executeQuery(vacationQuery, vacationParams);  
     
  res.send({ error:0, message:'ok', data: vacations, })

  }  catch (error) {
      throw error;
    }
};

const campaniasValidations = async (req, res) => {
  try {
  const no_cia = req.query.no_cia; 

  // Se obtiene los datos de las vacaciones
  const campaniasValidationsQuery = `
          SELECT
          workflow_campanias.*,
          workflow_campanias_detalle.porcentaje_interes,
          workflow_campanias_detalle.numero_max_cuotas,
          workflow_campanias_detalle.monto_max,
          workflow_campanias_detalle.val_adjuntos,
          workflow_campanias_detalle.val_remuneracion,
          workflow_campanias_detalle.val_lbs,
          workflow_campanias_detalle.descontar_en,
          workflow_campanias_detalle.tope_monto,
          workflow_campanias_detalle.cuota_editable,
          workflow_campanias_detalle.descontar_en_editable,
          workflow_campanias_detalle.cuota_default,
          workflow_campanias_detalle.descontar_en_default
          FROM
          workflow_campanias_detalle
          JOIN
          workflow_campanias ON workflow_campanias.id = workflow_campanias_detalle.id_workflow_campania
          WHERE
          no_cia = ?
          ORDER BY
          workflow_campanias.id;
          `;  
  const campaniasValidationParams = [no_cia];    
  const campaniasValidation = await executeQuery(campaniasValidationsQuery, campaniasValidationParams);  
     
  res.send({ error:0, message:'ok', data: campaniasValidation, })

  }  catch (error) {
      throw error;
    }
};

const SickLeaveReasons = async (req, res) => {
    try {  
        const SickLeaveDiagnosisQuery = `
            SELECT
            *
            FROM
            sick_leave_reason
                `;  
        const SickLeaveDiagnosisParams = [no_cia];    
        const SickLeaveDiagnosis = await executeQuery(SickLeaveDiagnosisQuery, SickLeaveDiagnosisParams);  
           
        res.send({ error:0, message:'ok', data: SickLeaveDiagnosis, })
      
        }  catch (error) {
            throw error;
          }
      };
    
  const SickLeaveTypes = async (req, res) => {
    try {  
        const SickLeaveDiagnosisQuery = `
            SELECT
            *
            FROM
            sick_leave_type
                `;  
        const SickLeaveDiagnosisParams = [no_cia];    
        const SickLeaveDiagnosis = await executeQuery(SickLeaveDiagnosisQuery, SickLeaveDiagnosisParams);  
           
        res.send({ error:0, message:'ok', data: SickLeaveDiagnosis, })
      
        }  catch (error) {
            throw error;
          }
      };

  const SickLeaveDiagnosis = async (req, res) => {
    try {  
    const SickLeaveDiagnosisQuery = `
        SELECT
        *
        FROM
        sick_leave_diagnosis
            `;  
    const SickLeaveDiagnosisParams = [no_cia];    
    const SickLeaveDiagnosis = await executeQuery(SickLeaveDiagnosisQuery, SickLeaveDiagnosisParams);  
       
    res.send({ error:0, message:'ok', data: SickLeaveDiagnosis, })
  
    }  catch (error) {
        throw error;
      }
  };
    

module.exports = { 
    getAllPermissions, 
    getPosts, 
    loanValidations, 
    vacationValidations, 
    campaniasValidations, 
    SickLeaveReasons, 
    SickLeaveDiagnosis, 
    SickLeaveTypes 
};