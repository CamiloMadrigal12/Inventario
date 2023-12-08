const { Router } = require('express');
const Marca = require('../models/Marca');
const { validationResult, check } = require('express-validator');
const { validarJWT } =  require('../middleware/validar-jwt')
const {validarRolAdmin} = require('../middleware/validar-rol-admin');


const router = Router();

router.post('/', validarJWT, validarRolAdmin, [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, resp) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ mensaje: errors.array() });
        }

        let marca = new Marca();
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;


        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save();

        resp.send(marca);

    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

router.get('/', validarJWT,validarRolAdmin,  async function (req, resp) {
    try {
        const marcas = await Marca.find();
        resp.send(marcas);
    } catch (error) {
        console.log(error);
        resp.status(500).send('Ocurrió un error');
    }
});

router.put('/', validarJWT, validarRolAdmin, [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
], async function (req, resp){
   
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ mensaje: errors.array() });
        }

        let marca = await Marca.findById(req.params.marcaId);
        if(!marca){
            return resp.status(400).send('Marca no existe');
        }
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();
        marca = await marca.save();
        resp.send(marca);

    } catch (error) {
        
    }
});


module.exports = router;