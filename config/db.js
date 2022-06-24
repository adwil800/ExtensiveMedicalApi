let mysql = require('mysql');

let con;
const connectDB = () => {

    con =  mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "extensivemedical"
    });

    con.connect((err)=>{

        if(err) throw err;
        //console.log("Connected");
      });

      //console.log("Connected to DB");
 
};
        
//async to follow the flow of connect -> query -> end connection
const getQueryDB =  (query) => {
    connectDB();
    return new Promise((resolve, reject) => {

        con.query(query, (err, rows, fields)=> {
            if (err) {
               con.end();
               return reject(err.sqlMessage);//throw err;
            }
            else{
                con.end();
                return resolve(rows);
            }
    
        });

    });
   


};



   //async to follow the flow of connect -> query -> end connection
   const postQueryDB = (query) => {
    connectDB();

    return new Promise((resolve, reject) => {

        con.query(query, (err, rows, fields)=> {
            if (err) {
               con.end();
               return reject(err.sqlMessage);//throw err;
            }
            else{
                con.end();
                return resolve(rows.insertId);
            }
    
        });

    });

};
   //async to follow the flow of connect -> query -> end connection
const execProcedure = (procedure) => {
    connectDB();

    return new Promise((resolve, reject) => {

        con.query("call "+procedure, (err, rows, fields)=> {
            if (err) {
               con.end();
               return reject(err.sqlMessage);//throw err;
            }
            else{
                con.end();
                return resolve(rows[0]);
            }
    
        });

    });

};

module.exports = {connectDB, getQueryDB, postQueryDB, execProcedure};


