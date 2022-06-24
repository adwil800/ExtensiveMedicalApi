const asyncHandler = require('../middleware/async');
//const sendEmail = require('../utils/sendEmail');
const {getQueryDB, postQueryDB, execProcedure} = require('../config/db');
 
//Good
exports.registerConsultory = asyncHandler( async (req, res, next) => {

 
    const body = req.body;
    //reg tercero
    const idTercero = await postQueryDB(` insert into tercero (nombre) values ('${body.names}');`);
    //reg phone
        await postQueryDB(` insert into telefono (idTercero, telefono) values ('${idTercero}', '${body.phone}');`);
    //reg centro
    const idCentro = await postQueryDB(` insert into centro (idTercero, direccion, rnc) values ('${idTercero}', '${body.address}', '${body.rnc}' )`);

    //reg horariocentro
    await postQueryDB(` insert into horariocentro(idCentro, l, m, x, j, v, s, d) values ('${idCentro}', ${body.daysArray[0][1]}, ${body.daysArray[1][1]}, ${body.daysArray[2][1]}, ${body.daysArray[3][1]}, ${body.daysArray[4][1]}, ${body.daysArray[5][1]}, ${body.daysArray[6][1]})`);
    //reg centro vs specialty 

    for (let i = 0; i < body.consSpecialtyArray.length; i++) {

        await postQueryDB(` insert into centrosvespecialidad (idCentro, idEspecialidad) values ('${idCentro}', '${body.consSpecialtyArray[i][0]}')`);
        
    }
    //reg included providers 
    if(body.consProviderArray.length > 0)
        for (let i = 0; i < body.consProviderArray.length; i++) {

            await postQueryDB(` insert into proveedorvcentros (idProveedor, idCentro) values ('${body.consProviderArray[i]}', '${idCentro}')`);
            
        }


    return res.status(200).json({
        success: true,
    });


}); 
//Good
exports.updateConsultory = asyncHandler( async (req, res, next) => {

 
    const body = req.body;
    const idCentro = req.params.idCentro;
    //get tercero 
    let idTercero = await getQueryDB(`select idTercero from centro where idCentro = '${idCentro}'`);
        idTercero = idTercero[0].idTercero;   
    //update telefono
    await postQueryDB(`update telefono set telefono = '${body.phone}' where idTercero = '${idTercero}';`);
    //update tercero 
    await postQueryDB(`update tercero set nombre = '${body.names}' where idTercero = '${idTercero}'`);
    //update centro, 
    await postQueryDB(`update centro set direccion = '${body.address}', rnc = '${body.rnc}' where idCentro = '${idCentro}'`);

    //update horariocentro
    await postQueryDB(`update horariocentro  set l = ${body.daysArray[0][1]}, m = ${body.daysArray[1][1]}, x = ${body.daysArray[2][1]}, j = ${body.daysArray[3][1]}, v = ${body.daysArray[4][1]}, s = ${body.daysArray[5][1]}, d = ${body.daysArray[6][1]} where idCentro = '${idCentro}'`);

    //delete existing relationships
    await postQueryDB(`delete from centrosvespecialidad where idCentro = '${idCentro}'`);
    //reg centro vs specialty 
    for (let i = 0; i < body.consSpecialtyArray.length; i++) {

        await postQueryDB(` insert into centrosvespecialidad (idCentro, idEspecialidad) values ('${idCentro}', '${body.consSpecialtyArray[i][0]}')`);
        
    }
    //delete existing relationships
    await postQueryDB(`delete from proveedorvcentros where idCentro = '${idCentro}'`);
    //update included providers 
    if(body.consProviderArray.length > 0)
        for (let i = 0; i < body.consProviderArray.length; i++) {

            await postQueryDB(` insert into proveedorvcentros (idProveedor, idCentro) values ('${body.consProviderArray[i]}', '${idCentro}')`);
            
        }


    return res.status(200).json({
        success: true,
    });


}); 
//Good
exports.getAllConsultories = asyncHandler( async (req, res, next) => {

    const result = await getQueryDB("select c.idCentro, t.nombre, c.direccion, c.rnc from centro as c join tercero as t on c.idTercero = t.idTercero;");



    return res.status(200).json({
        success: true,
        data: result,
    });


}); 
//Good
exports.getConsultory = asyncHandler( async (req, res, next) => {
    
    const idCentro = req.params.idCentro;
    //nombre, dir, rnc, id
    const centro = await getQueryDB(`select c.idCentro, c.idTercero, t.nombre, c.direccion, c.rnc from centro as c join tercero as t on c.idTercero = t.idTercero where idCentro = '${idCentro}'`);

    const telefono =  await getQueryDB(`select telefono from telefono where idTercero = '${centro[0].idTercero}'`)

    const especialidades =  await getQueryDB(`select idEspecialidad from centrosvespecialidad where idCentro = '${centro[0].idCentro}'`)

    const proveedores = await getQueryDB(`select idProveedor from proveedorvcentros where idCentro = '${centro[0].idCentro}'`);

    const days = await getQueryDB(`select * from horariocentro where idCentro = '${centro[0].idCentro}'`);

    const result = {
        centro: centro[0], 
        telefono: formatPhone(telefono[0].telefono),
        especialidades,
        proveedores,
        days: days[0],
    }

    return res.status(200).json({
        success: true,
        data: result,
    });


}); 





 
function formatPhone(phone) {
   
    let tempPhone = "";  

    for (let i = 0; i < phone.length; i++) {

        tempPhone+= phone[i];

        if(i == 2) tempPhone += "-";
        if(i == 5) tempPhone += "-";

    }

    return tempPhone;

}