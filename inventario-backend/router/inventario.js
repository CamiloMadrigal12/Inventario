const { Router } = require('express');
const inventario = require('../models/Inventario');
const bycript = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { validarJWT } =  require('../middleware/validar-jwt');


const router = Router();

router.post('/',validarJWT,[
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    // ... Otras validaciones ...
], async function (req, resp) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ mensaje: errors.array() });
        }

        const existeInventarioPorSerial = await inventario.findOne({ serial: req.body.serial });
        if (existeInventarioPorSerial) {
            return resp.status(400).send('Ya existe el serial para otro equipo');
        }

        let nuevoInventario = new inventario();
        nuevoInventario.serial = req.body.serial;
        nuevoInventario.modelo = req.body.modelo;
        nuevoInventario.descripcion = req.body.descripcion;
        nuevoInventario.color = req.body.color;
        nuevoInventario.foto = req.body.foto;
        nuevoInventario.fechaCompra = req.body.fechaCompra;
        nuevoInventario.precio = req.body.precio;
        nuevoInventario.usuario = req.body.usuario._id;
        nuevoInventario.marca = req.body.marca._id;
        nuevoInventario.estadoEquipo = req.body.estadoEquipo._id;
        nuevoInventario.tipoEquipo = req.body.tipoEquipo._id;
        nuevoInventario.estadoEquipo = req.body.estadoEquipo
        nuevoInventario.fechaCreacion = new Date();
        nuevoInventario.fechaActualizacion = new Date();

        nuevoInventario = await nuevoInventario.save();
        resp.send(nuevoInventario);

    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

router.get('/', validarJWT, async function (req, resp) {
    try {
        const inventarios = await inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado'
            },
            {
                path: 'marca', select: 'nombre estado'

            },
            {
                path: 'estadoEquipo', select: 'nombre estado'

            },
            {
                path: 'tipoEquipo', select: 'nombre estado'

            }

        ]);
        resp.send(inventarios);
    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

module.exports = router;