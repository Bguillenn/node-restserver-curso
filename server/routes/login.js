const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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


//Configuracion de google
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }

}

app.post('/google', async (req, res) => {
    
    let token = req.body.idtoken;
    
    //Validamos el token y obtenemos el usuario de google
    let googleUser = await verify(token)
    .catch( err => {
        return res.status(403).json({ok: false, err});
    });


    //Comprobamos la existencia o no del usuario en la base de datos
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {

        if(err) return res.status(500).json({ok:false, err});

        if(usuarioDB) {
            if(usuarioDB.google === false) {
                return res.status(400).json({ok:false, err: {message: "El usuario ya se autentifico con credenciales normales"}});
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });

            }

        }else { //Si el usuario no existe en la base de datos
            let usuario = Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuarioDB) => {

                if(err) return res.status(500).json({ok:false, err});
               
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });

            } );
        }

    });
});


// ====================== FIN DE CODIGO =============================

module.exports = app;