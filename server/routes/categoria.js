const express = require('express');
const app = express();

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');

//Grabar en POSTMAN

//Obtiene todas las categorias
app.get('/categoria', verificaToken ,(req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email') //Rellena los campos especificados
        .exec( (err, categoriasDB) => {
            
            if(err) return res.status(500).json({ok: false, err});

            Categoria.count({}, (err, conteo) => {
                if(err) return res.status(500).json({ok: false, err});

                res.json({
                    ok:true,
                    categorias: categoriasDB,
                    cantidad: conteo,
                });

            });
        });
});

//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;

    Categoria.findById( id, (err, categoriaDB) => { 

        if(err) return res.status(500).json({ok: false, err});

        return res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });


});

//Crear nueva categoria
//req.usuario._id
app.post('/categoria', [verificaToken, verificaAdmin_Role] ,(req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,
    });

    categoria.save( (err, categoriaDB) => {

        if(err) return res.status(500).json({ok: false, err});

        if(!categoriaDB) return res.status(400).json({ok: false, err});


        return res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });

});

//Actualizar una categoria solo descripcion
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role] ,(req, res) => {
    let id = req.params.id;
    let body = req.body;
    
    Categoria.findByIdAndUpdate(id, {descripcion: body.descripcion},{new: true} ,(err, categoriaDB) => {
        if(err) return res.status(500).json({ok: false, err});

        return res.json({
            ok:true,
            categoria: categoriaDB
        })
    })
});

//Delete categoria fisicamente
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role] ,(req, res) => {
    //Solo un adminsitrador puede borrar categorias

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if(err) return res.status(500).json({ok: false, err});

        return res.json({
            ok: true,
            categoria: categoriaDB,
        });
    });

});



module.exports = app;