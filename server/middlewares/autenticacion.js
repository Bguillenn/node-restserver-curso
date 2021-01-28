const jwt = require('jsonwebtoken');

// ===============================
// Verificar token
// ===============================

let verificaToken = (req, res, next) => {
    
    let token = req.get('api-key'); //Obtiene el header especificado
    //Validamos el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if(err) return res.status(401).json({ok: false, err: {message: "Token invalido"}});
        
        req.usuario = decoded.usuario;
        next();

    });

};


// ===============================
// Verificar rol administrador
// ===============================


let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if( usuario.role === 'ADMIN_ROLE' )
        next();
    else{
        res.status(401).json({
            ok: false,
            err:{
                message: "El usuario no es administrador"
            }
        });
    }
    
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
};