const asyncHandler = require('../middleware/async');
//const sendEmail = require('../utils/sendEmail');
const {getQueryDB, postQueryDB, execProcedure} = require('../config/db');


exports.registerAppointment = asyncHandler( async (req, res, next) => {})

exports.registerAppointmentType = asyncHandler( async (req, res, next) => {

    const body = req.body;
        
    const tipoCita = await postQueryDB(` insert into tipocita (idEspecialidad, nombre, descripcion, minDuracion) values ('${body.specialty}', '${body.names}', '${body.desc}', '${body.duration}')`);


    return res.status(200).json({
        success: true,
    });


}); 

exports.getAllAppointments = asyncHandler( async (req, res, next) => {})
exports.getAllAppointmentTypes = asyncHandler( async (req, res, next) => {

    const result = await getQueryDB("select tc.idTipoCita, tc.nombre, s.especialidad, tc.descripcion, tc.minDuracion from tipoCita as tc join especialidad as s on tc.idEspecialidad = s.idEspecialidad");

    return res.status(200).json({
        success: true,
        data: result,
    });



})

 



