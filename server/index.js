const express = require('express');     // express
const upload = require('express-fileupload');     // for uploading file to server or sending file to front end
require('dotenv').config(); 
const cors = require('cors');
const {connect} = require('mongoose');
const { notFound, errorHnadler } = require('./middlewares/errorMiddleware');
// router import  
const routes = require('./routes/routes');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json({extended:true}));
app.use(cors({credentials: true, origin:['http://localhost:5173']}));
app.use(upload());
// routing in web 
app.use('/api', routes);



// using error handle in code before starting server 

app.use(notFound);
app.use(errorHnadler);
// making connection with  database 
connect(process.env.MONGO_URL).then(app.listen(process.env.PORT, () => console.log(`server is running at http://localhost:${process.env.PORT}`))).catch((err) => console.log(err));



