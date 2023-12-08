const { Router } = require('express');
const Usuario = require('../models/Usuario');
const bycript = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

const router = Router();

router.post('/', [validarJWT, validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
    check('rol', 'invalid.rol').isIn(['Administrador', 'Docente']),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, resp) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ mensaje: errors.array() });
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email });
        if (existeUsuario) {
            return resp.status(400).send('Email ya existe');
        }

        let nuevoUsuario = new Usuario();
        nuevoUsuario.nombre = req.body.nombre;
        nuevoUsuario.email = req.body.email;
        nuevoUsuario.estado = req.body.estado;

        const salt = bycript.genSaltSync();
        const password = bycript.hashSync(req.body.password, salt);
        nuevoUsuario.password = password;

        nuevoUsuario.rol = req.body.rol;
        nuevoUsuario.fechaCreacion = new Date();
        nuevoUsuario.fechaActualizacion = new Date();

        nuevoUsuario = await nuevoUsuario.save();

        resp.send(nuevoUsuario);

    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

router.get('/', [validarJWT, validarRolAdmin], async function (req, resp) {
    try {
        const usuarios = await Usuario.find();
        resp.send(usuarios);
    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

module.exports = router;