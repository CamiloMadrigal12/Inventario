const { Router } = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } =  require('../middleware/validar-jwt')
const {validarRolAdmin} = require('../middleware/validar-rol-admin');


const router = Router();

router.post('/', [validarJWT,validarRolAdmin],[
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, resp) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ mensaje: errors.array() });
        }

        let estadoEquipo = new EstadoEquipo();
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        resp.send(estadoEquipo);

    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

router.get('/', [validarJWT,validarRolAdmin],async function (req, resp) {
    try {
        const estadoEquipos = await EstadoEquipo.find();
        resp.send(estadoEquipos);
    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

module.exports = router;