const { Router } = require('express');
const TipoEquipo = require('../models/TipoEquipo');
const { validationResult, check } = require('express-validator');
const { validarJWT } =  require('../middleware/validar-jwt')
const {validarRolAdmin} = require('../middleware/validar-rol-admin');



const router = Router();

router.post('/', validarJWT,validarRolAdmin, [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, resp) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ mensaje: errors.array() });
        }

        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;    
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        resp.send(tipoEquipo);

    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

router.get('/', validarJWT,validarRolAdmin, async function (req, resp) {
    try {
        const tipoEquipos = await TipoEquipo.find();
        resp.send(tipoEquipos);
    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

module.exports = router;