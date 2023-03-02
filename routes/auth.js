const {Router,response}=require('express');
const { crearUsuario, loginUsuario, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router=Router();

router.post('/new',[
    check('nombre','El Nombre es Obligatorio').not().isEmpty(),
    check('email','El email es Obligatorio').not().isEmpty(),
    check('password','El password es Obligatorio').not().isEmpty(),
    validarCampos
],crearUsuario);


router.post('/',[
    check('email','El email es Obligatorio').not().isEmpty(),
    check('password','El password es Obligatorio').not().isEmpty(),
    validarCampos
],loginUsuario);

router.get('/renew',validarJWT,renewToken);

module.exports=router;