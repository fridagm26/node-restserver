const express = require('express');
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const categoria = require('../models/categoria');
let app = express();
let Categoria = require('../models/categoria');
const usuario = require('../models/usuario');

//Mostrar todas las categorías

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });

});

//Mostrar una categoría por id

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

//Crear nueva categoría

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

//Actualizar categoria

app.put('/categoria/:id', (req, res) => {
    let body = req.body;
    let id = req.params.id;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

//Eliminar categoria

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Solo administrador puede borrar
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        })

    });
});

module.exports = app;