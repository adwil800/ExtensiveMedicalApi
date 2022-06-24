const asyncHandler = require('../middleware/async');
//const sendEmail = require('../utils/sendEmail');
const {getQueryDB, postQueryDB, execProcedure} = require('../config/db');

//Path: /new
exports.registerDocument = asyncHandler( async (req, res, next) => {

    const body = req.body;
        
    //Insert into main document
    const idDocumento = await postQueryDB(` insert into documento (idTipoDocumento, porProveedor, paciente, fechaEnviado, expiracion, nota, enviado) values ('${body.idTipoDocumento}', '${body.idProvider}', '${body.idPaciente}', '${body.fechaEnvio}', '${body.fechaExpiracion}', '${body.nota}', '${body.enviado}'`);
//'${}', '${}', '${}', '${}', '${}', '${}', '${}', 
    if(body.docType === "referido"){
        //Check if centroobjetivo and proveedorObjetivo should be integer or string due to the fact that the patient can be referred to an outsider
        const idReferido = await postQueryDB(` insert into documentoreferido (idDocumento, idEspecialidad, proveedorObjetivo, centroObjetivo) values ('${idDocumento}', '${body.idEspecialidad}', '${body.idProveedor}', '${body.idCentro}')`);
    }
    else if(body.docType === "prescripcion"){

        const idPrescripcion = await postQueryDB(` insert into documentoprescripcion (idDocumento, farmacia, medicacion, cantidad) values ('${idDocumento}', '${body.idFarmacia}', '${body.medicacion}','${body.cantidad}' )`);

    }
    else if(body.docType === "resultado"){

        const idResultado = await postQueryDB(` insert into documentoresultado (idDocumento, idTipoResultado, archivo) values ('${idDocumento}', '${body.idTipoResultado}', '${body.archivo}'`);

    }


    return res.status(200).json({
        success: true,
    });

})
//Path: /new/type
exports.registerDocumentType = asyncHandler( async (req, res, next) => {

    const body = req.body;
        
    const tipoDoc = await postQueryDB(` insert into tipodocumento (tipoDocumento) values ('${body.tipoDocumento}'`);


    return res.status(200).json({
        success: true,
    });


})
//Path: /new/pharmacy
exports.registerPharmacy = asyncHandler( async (req, res, next) => {

    const body = req.body;

    const idTercero = await postQueryDB(` insert into tercero (nombre) values('${body.nombre}');`);

    //Insert email if exist
    if(body.email){
        await postQueryDB(` insert into email (idTercero, email) values('${idTercero}', '${body.email}');`);
    }
        
    const idFarmacia = await postQueryDB(` insert into farmacia (idTercero, direccion, telefono) values ('${idTercero}', '${body.direccion}', '${body.telefono}');`);


    return res.status(200).json({
        success: true,
    });


})
exports.getAllDocuments = asyncHandler( async (req, res, next) => {}); 

exports.getPatientDocuments = asyncHandler( async (req, res, next) => {})
exports.getProviderDocuments = asyncHandler( async (req, res, next) => {})

 


