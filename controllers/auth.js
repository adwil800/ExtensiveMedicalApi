const asyncHandler = require('../middleware/async');
//const sendEmail = require('../utils/sendEmail');
const {getQueryDB, postQueryDB, execProcedure} = require('../config/db');


exports.getQuery = asyncHandler( async (req, res, next) => {

    const result = await getQueryDB(req.params.query);

    // console.log(result)
    if(result.length < 1){

        result.push({"errorId": "null", "message": "not found"})

    }
    return res.status(200).json({
        success: true,
        data: result,
    });


}); 

exports.postQuery = asyncHandler( async (req, res, next) => {

    await postQueryDB(req.params.query);

    return res.status(200).json({
        success: true,
    });


});


