require('./config/config.js');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res){
    res.json('get Usuario')
});

app.post('/usuario', function(req, res){

    let body = req.body;

    res.json({
        persona: body
    })
});

app.put('/usuario/:id', function(req, res){

    let id = req.params.id;

    res.json({id});
});

app.delete('/usuario', function(req, res){
    res.json('delete Usuario')
});



app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto: ", 3000)
});