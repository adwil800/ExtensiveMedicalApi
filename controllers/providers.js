const asyncHandler = require('../middleware/async');
//const sendEmail = require('../utils/sendEmail');
const {getQueryDB, postQueryDB, execProcedure} = require('../config/db');
 
//Good
exports.registerProvider = asyncHandler( async (req, res, next) => {

    const body = req.body;
    
    //reg tercero
    const idTercero = await postQueryDB(` insert into tercero (nombre) values ('${body.names}');`);
    //reg phone
    await postQueryDB(` insert into telefono (idTercero, telefono) values ('${idTercero}', '${body.phone}');`);
     //reg provider
    const idProvider = await postQueryDB(` insert into proveedor (idTercero, apellido, idSexo, descripcion) values ('${idTercero}', '${body.lastNames}', '${body.idSexo}', '${body.desc}' )`);
    //reg provider vs centro 
 
    for (let i = 0; i < body.workingCenterArray.length; i++) {

        await postQueryDB(` insert into proveedorvcentros (idProveedor, idCentro) values ('${idProvider}', '${body.workingCenterArray[i][0]}')`);
    }
    //reg provider vs specialty 
    for (let i = 0; i < body.specialtyArray.length; i++) {

        await postQueryDB(` insert into proveedorvespecialidad (idProveedor, idEspecialidad) values ('${idProvider}', '${body.specialtyArray[i][0]}')`);
        
    }


    return res.status(200).json({
        success: true,
    });


}); 
//Good
exports.updateProvider = asyncHandler( async (req, res, next) => {

    const body = req.body;
    const idProveedor = req.params.idProveedor;
    let idTercero = await getQueryDB(`select idTercero from proveedor where idProveedor = '${idProveedor}'`);
        idTercero = idTercero[0].idTercero;
    //update tercero
    await postQueryDB(` update tercero set nombre = '${body.names}' where idTercero = '${idTercero}';`);

    //update phone
    await postQueryDB(`update telefono set telefono = '${body.phone}' where idTercero = '${idTercero}';`);

     //update provider
    await postQueryDB(` update proveedor set apellido = '${body.lastNames}', idSexo = '${body.idSexo}', descripcion = "${body.desc}" where idProveedor = '${idProveedor}'; `);


    //delete existing relationships
    await postQueryDB(`delete from proveedorvcentros where idProveedor = '${idProveedor}'`);
    //insert new
    for (let i = 0; i < body.workingCenterArray.length; i++) {

        await postQueryDB(` insert into proveedorvcentros (idProveedor, idCentro) values ('${idProveedor}', '${body.workingCenterArray[i][0]}')`);
    }
    //delete existing relationships
    await postQueryDB(`delete from proveedorvespecialidad where idProveedor = '${idProveedor}'`);
    //insert new
    for (let i = 0; i < body.specialtyArray.length; i++) {

        await postQueryDB(` insert into proveedorvespecialidad (idProveedor, idEspecialidad) values ('${idProveedor}', '${body.specialtyArray[i][0]}')`);
        
    }


    return res.status(200).json({
        success: true,
    });


}); 
//Good
exports.getAllProviders = asyncHandler( async (req, res, next) => {
 
    const result = await getQueryDB(`select p.idProveedor, t.nombre, p.apellido, es.especialidad from proveedor as p join tercero as t on p.idTercero = t.idTercero join proveedorvespecialidad as ps on p.idProveedor = ps.idProveedor join especialidad as es on ps.idEspecialidad = es.idEspecialidad group by p.idProveedor`);

    return res.status(200).json({
        success: true,
        data: result,
    });


});  

//Good
exports.getProvider = asyncHandler( async (req, res, next) => {
    
    const idProveedor = req.params.idProveedor;

    let idTercero = await getQueryDB(`select idTercero from proveedor where idProveedor = '${idProveedor}'`);
        idTercero = idTercero[0].idTercero;

    //nombre, dir, rnc, id
    const proveedor = await getQueryDB(`select t.nombre, p.apellido, p.idSexo, p.descripcion from proveedor as p join tercero as t on p.idTercero = t.idTercero where idProveedor = '${idProveedor}'`);

    const telefono =  await getQueryDB(`select telefono from telefono where idTercero = '${idTercero}'`)

    const specialtyArray =  await getQueryDB(`select idEspecialidad from proveedorvespecialidad where idProveedor = '${idProveedor}'`)

    const consArray = await getQueryDB(`select idCentro from proveedorvcentros where idProveedor = '${idProveedor}'`);

    const result = {
        proveedor:  proveedor[0],
        telefono: formatPhone(telefono[0].telefono),
        specialtyArray,
        consArray,
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