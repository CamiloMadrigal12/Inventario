const { Router } = require('express');
const Usuario = require('../models/Usuario');
const bycript = require('bcryptjs');
const { validationResult, check } = require('express-validator');
const { route } = require('./usuario');
const { generarJWT } = require('../helpers/jwt');

const router = Router();

router.post('/', [
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),

], async function (req, resp) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return resp.status(400).json({ mensaje: errors.array() });
        }
        
       
        const usuario = await Usuario.findOne({ email: req.body.email });
        if (!usuario) {
            return resp.status(400).json({mensaje:'User not found'});
        }
 // validar contaseñas
        const esIgual = bycript.compareSync(req.body.password, usuario.password);
        if(!esIgual){
            return resp.status(400).json({mensaje: 'contraseña incorrecta'});
        }
        
        // generar token
        const token = generarJWT(usuario);

        resp.json({
            _id: usuario._id, nombre: usuario.nombre,
            rol: usuario.rol, email: usuario.email, access_token: token
        });


    } catch (error) {
        console.log(error);
        resp.status(500).json({mensaje: 'Internal server error'});
    }
    });
   
    module.exports = router;
