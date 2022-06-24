const asyncHandler = require('../middleware/async');
//const sendEmail = require('../utils/sendEmail');
const {getQueryDB, postQueryDB, execProcedure} = require('../config/db');
 
//Good
exports.registerPatient = asyncHandler( async (req, res, next) => {


    const body = req.body; 
          //Create tercero
    const idTercero = await postQueryDB(` insert into tercero (nombre) values ('${body.names}');`);
    
    if(body.email){
        //Create email
        await postQueryDB(`insert into email(idTercero, email) values('${idTercero}', '${body.email}');`);
    }
        //Insert phone1
        await postQueryDB(`insert into telefono(idTercero, telefono) values ('${idTercero}', '${body.phone1}');`);

    if(body.phone2){
        //Create email
        await postQueryDB(`insert into telefono(idTercero, telefono) values ('${idTercero}', '${body.phone2}');`);
    }
 

    //Fix insert nombreEmer, telEmer and Alergias to be inserted as NULL if nothing is provided
    if(body.idProvider != null){
        body.idProvider = '\''+body.idProvider+'\'';
    }   
    if(body.emerName != null){
        body.emerName = '\''+body.emerName+'\'';
    }   
    if(body.emerPhone != null){
        body.emerPhone = '\''+body.emerPhone+'\'';
    }   
    if(body.patAllergies != null){
        body.patAllergies = '\''+body.patAllergies+'\'';
    }   
    const idPaciente = await postQueryDB(`
    insert into paciente (idTercero, apellido, dob, nombreEmergencia, telEmergencia, idSexo, idProveedor, alergias, direccion, idProvincia, estado, fechacreado) values ('${idTercero}', '${body.lastNames}', '${body.dob}', ${body.emerName}, ${body.emerPhone}, '${body.sex}', ${body.idProvider}, ${body.patAllergies}, '${body.address}',  '${body.provincia}', '1', '${formatDate(new Date+"", true)}');
    `);

    if(body.idSeguro){
        await postQueryDB(`insert into seguro(idPaciente, idTipoSeguro, numSeguro) values ('${idPaciente}', '${body.idSeguro}', '${body.numSeguro}')`);
    }


    return res.status(200).json({
        success: true,
    }); 


}); 

//Good
exports.updatePatient = asyncHandler( async (req, res, next) => {


    const body = req.body;   
    const idPaciente = req.params.idPaciente; 
        console.log(body)
    let idTercero =  await getQueryDB(`select idTercero from paciente where idPaciente = '${idPaciente}';`);
    idTercero = idTercero[0].idTercero;

    if(body.email){
        //Create email
        await postQueryDB(`update email set email = '${body.email}' where  idTercero = '${idTercero}';`);
    }

    //Get old phone 1
        let oldPhones = await getQueryDB(`select telefono from telefono where idTercero = '${idTercero}'`);

        let oldPhone1 = oldPhones.length > 0 ? oldPhones[0].telefono : null;
        let oldPhone2 = oldPhones.length > 1 ? oldPhones[1].telefono : null;
        //Insert phone1
        await postQueryDB(`update telefono set telefono = '${body.phone1}' where idTercero = '${idTercero}' and telefono = '${oldPhone1}';`);

    if(body.phone2){
        let checkPhone = await getQueryDB(`select telefono from telefono where telefono = '${oldPhone2}' and idTercero = '${idTercero}'`);

        if(checkPhone.length > 0){
            await postQueryDB(`update telefono set telefono = '${body.phone2}' where idTercero = '${idTercero}' and telefono = '${oldPhone2}';`);
        }
        else 
            await postQueryDB(`insert into telefono (idTercero, telefono) values ('${idTercero}', '${body.phone2}')`);
    }

    //Fix insert nombreEmer, telEmer and Alergias to be inserted as NULL if nothing is provided
    if(body.idProvider  === ""){
        body.idProvider = null;
    }   
    else if(body.idProvider != null){
        body.idProvider = '\''+body.idProvider+'\'';
    }   
    if(body.emerName != null){
        body.emerName = '\''+body.emerName+'\'';
    }   
    if(body.emerPhone != null){
        body.emerPhone = '\''+body.emerPhone+'\'';
    }   
    if(body.patAllergies != null){
        body.patAllergies = '\''+body.patAllergies+'\'';
    }   
  
    await postQueryDB(`update tercero set nombre = '${body.names}' where idTercero = '${idTercero}'`);
  
    
    await postQueryDB(`update paciente set apellido = '${body.lastNames}', dob = '${body.dob}', nombreEmergencia = ${body.emerName}, telEmergencia = ${body.emerPhone}, idSexo = '${body.idSexo}', idProveedor = ${body.idProvider}, alergias = ${body.patAllergies}, direccion = '${body.address}',  idProvincia = '${body.idProvincia}' where idPaciente = '${idPaciente}'`);

    if(body.idTipoSeguro){
        await postQueryDB(`update seguro set idTipoSeguro = '${body.idTipoSeguro}', numSeguro = '${body.numSeguro}' where idPaciente = '${idPaciente}'`);
    }

    return res.status(200).json({
        success: true,
    }); 


}); 

//Good
exports.getAllPatients = asyncHandler( async (req, res, next) => {
 
    const result = await getQueryDB("select p.idPaciente, t.nombre, p.apellido, p.dob, tel.telefono from paciente as p join tercero as t on p.idTercero = t.idTercero join telefono as tel on p.idTercero = tel.idTercero group by p.idPaciente;");


    result.forEach(e => {
        
        //Alter phone
            for(key in e){
                if(key === "telefono"){
                   e[key] = formatPhone(e[key]);
                }
                if(key === "dob"){
                   e[key] = formatDate(e[key].toString());
                }
            }


    });


    return res.status(200).json({
        success: true,
        data: result,
    });


});  

//Good
exports.getPatient = asyncHandler( async (req, res, next) => {


    let paciente =  await getQueryDB(`select p.idPaciente, p.dob, p.alergias, p.idTercero, t.nombre, p.apellido, p.direccion, p.fechacreado, p.nombreEmergencia, p.telEmergencia  from paciente as p join tercero as t  on p.idTercero = t.idTercero where p.idPaciente = '${req.params.idPaciente}' ;`);
    paciente = paciente[0];

    let provincia =  await getQueryDB(`select pro.idProvincia, pro.provincia from provincia as pro join paciente as p on p.idProvincia = pro.idProvincia where p.idPaciente = '${req.params.idPaciente}'`);
    provincia = provincia[0];

    let sexo =  await getQueryDB(`select s.idSexo, s.sexo from sexo as s join paciente as p on p.idSexo = s.idSexo where idTercero = '${paciente.idTercero}';`);
    sexo = sexo[0];

    const telefono =  await getQueryDB(`select telefono from telefono where idTercero = '${paciente.idTercero}';`);

    let email =  await getQueryDB(`select email from email where idTercero = '${paciente.idTercero}';`);
    email = email[0];

    const seguro =  await getQueryDB(`select s.idTipoSeguro as idSeguro, t.nombreSeguro, s.numSeguro from seguro as s join tipoSeguro as t on s.idTipoSeguro = t.idTipoSeguro where s.idPaciente = '${req.params.idPaciente}'`);
    
    const proveedor = await getQueryDB(`select pro.idProveedor, t.nombre, pro.apellido from proveedor as pro join tercero as t on pro.idTercero = t.idTercero join paciente as p on pro.idProveedor = p.idProveedor where p.idPaciente = '${req.params.idPaciente}';`);

 
    const result = {

        nombre: paciente.nombre, 
        apellido: paciente.apellido, 
        numPaciente: paciente.idPaciente, 
        sexo: sexo.sexo,
        idSexo: sexo.idSexo,
        direccion: paciente.direccion,
        proveedor: proveedor[0] === undefined || proveedor.length < 1 ? "" : proveedor[0],
        pacienteDesde: formatDate(paciente.fechacreado.toString()), 
        dob: formatDate(paciente.dob.toString()),
        provincia: provincia.provincia,
        idProvincia: provincia.idProvincia === undefined ? "null" : provincia.idProvincia,
        alergias: paciente.alergias,
        idSeguro: seguro[0] === undefined || seguro.length < 1 ? "null" : seguro[0].idSeguro,
        seguro: seguro[0] === undefined || seguro.length < 1 ? "" : seguro[0].nombreSeguro,
        numSeguro: seguro[0] === undefined || seguro.length < 1 ? "" : seguro[0].numSeguro,

        email: email.email,
        telefono: {
                "main": telefono[0] === undefined ? "" : formatPhone(telefono[0].telefono) ,
                "alt": telefono[1] === undefined ? "" : formatPhone(telefono[1].telefono) 
        },
        nombreEmer: paciente.nombreEmergencia,
        telEmer:formatPhone(paciente.telEmergencia),
    }

    return res.status(200).json({
        success: true,
        data: result,
    });


}); 






function formatDate(date, sqlDate = false){

    date = date.toString();

    if(date === null || date === "" || date === undefined)    return "Empty date";

    if(!sqlDate){
    let month = date.split(" ")[1];
    const day = date.split(" ")[2];
    const year = date.split(" ")[3];

    month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
    month = month < 10 ? "0"+month : month;

    return day+"/"+month+"/"+year;
    }
    else
    {
        let month = date.split(" ")[1];
        const day = date.split(" ")[2];
        const year = date.split(" ")[3];
    
        month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
        month = month < 10 ? "0"+month : month;
    
        return year+"/"+month+"/"+day;
    }

}
function formatPhone(phone) {
   
    let tempPhone = "";  

    for (let i = 0; i < phone.length; i++) {

        tempPhone+= phone[i];

        if(i == 2) tempPhone += "-";
        if(i == 5) tempPhone += "-";

    }

    return tempPhone;

}

