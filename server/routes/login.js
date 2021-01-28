const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const app = express();

// ====================== INICIO DE CODIGO =============================


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email},(err, usuarioDB) => {
        //Algun error inesperado
        if(err) return res.status(500).json({ok: false, err});

        //Validamos si encontro al usuario o no
        if(!usuarioDB)
            return res.status(400).json({ok: false, err: {message: "Usuario no registrado en el sistema"}});
        //Validamos la contraseña
        if( !bcrypt.compareSync( body.password, usuarioDB.password ) )
            return res.status(400).json({ok: false, err: {message: "La contraseña introducida es incorrecta"}});


        //Creamos el token del usuario
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED , {expiresIn: process.env.CADUCIDAD_TOKEN});


        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });

    });
});


// ====================== FIN DE CODIGO =============================

module.exports = app;