const express = require('express');
const  {verificaToken} = require('../middlewares/autenticacion');
const _ = require('underscore');

const app = express();

const Producto = require('../models/producto');



//Obtener todos los productos
app.get('/productos', verificaToken, (req, res) => {
    //Trae todos los productos
    //Traer paginado
    //Usar populate

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 10;
    let all = Boolean(req.query.all) || true;

    let query = all ? {} : {disponible: true};

    Producto.find(query)
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, productosDB)  => {
            if(err) return res.status(500).json({ok: false, err});

            Producto.count(query, (err, conteo) => {
                if(err) return res.status(500).json({ok: false, err});

                return res.json({
                    ok: true,
                    productos: productosDB,
                    cantidad: conteo,
                });

            });

        });

});

//Obtener un producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate

    let id = req.params.id;
    
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, productoDB) => {
            if(err) return res.status(500).json({ok: false, err});

            return res.json({
                ok: true,
                producto: productoDB
            });

        });


});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec(( err, productosDB) => {
            
            if(err) return res.status(500).json({ok: false, err});

            return res.json({
                ok: true,
                productos: productosDB
            })

        });

});

//Crear un producto
app.post('/productos', verificaToken ,(req, res) => {
    //Grabar ID Usuario
    //Grabar ID Categoria

    let usuario = req.usuario;
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario._id,
    });


    producto.save( (err, productoDB) => {
        
        if(err) return res.stats(500).json({ok: false, err});

        return res.json({
            ok: true,
            producto: productoDB,
        });

    });

});

//Actualizar un producto
app.put('/productos/:id', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar la categoria

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'categoria', 'precioUni', 'disponible']);

    Producto.findByIdAndUpdate(id, body, {new: true})
        .exec( (err, productoDB)  => {
            if(err) return res.status(500).json({ok: false, err});

            return res.json({
                ok: true,
                producto: productoDB,
            });
        });

});

//Eliminacion logica campo disponible
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true})
        .exec( (err, productoDB) => {
            if(err) return res.status(500).json({ok: false, err});

            return res.json({
                ok: true,
                producto: productoDB,
            });
        });

});




module.exports = app;