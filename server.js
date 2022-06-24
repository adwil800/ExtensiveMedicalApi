const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
//const {connectDB} = require('./config/db');


const cors = require('cors');
 
//Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to DB 
//connectDB();

//Routes
const auth = require("./routes/auth");
const patients = require("./routes/patients");
const providers = require("./routes/providers");
const consultory = require("./routes/consultory");
const documents = require("./routes/documents");
const appointments = require("./routes/appointments");

//Body parser

app.use(express.json({limit: '1mb'}));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') 
    app.use(morgan('dev'));

//Allow other domains to access the api
app.use(cors());

//Use routes: Route to acces and function to serve
app.use("/em/api/auth", auth);
app.use("/em/api/patients", patients);
app.use("/em/api/providers", providers);
app.use("/em/api/consultory", consultory);
app.use("/em/api/documents", documents);
app.use("/em/api/appointments", appointments);

PORT = process.env.PORT || 5500;

const server = app.listen(
    PORT,
    console.log(
      `Server running on port ${PORT}`
    ) 
  );
  





