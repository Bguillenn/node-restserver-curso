require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');



const app = express();

const bodyParser = require('body-parser');
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Parse application/json
app.use(bodyParser.json())

app.use( require('./routes/usuario') );


//Conexion a la base de datos de mongoDB
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ,
(err, res) => {
    
    if(err) throw err;
    console.log('Base de datos conectada correctamente!');
})

//Aperturando la conexion al servidor web en el puerto configurado (LOCAL: 3000)
app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto: ", 3000)
});