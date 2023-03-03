const { response } = require("express");
const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario= async(req,res=response)=>{


    const{email,password}=req.body;
    try {
        const existeEmail=await Usuario.findOne({email:email});

        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El Correo ya esta registrado'
            })
        }

        const usuario=new Usuario(req.body);

        //Encriptar Contraseña
        const salt=bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password,salt);


        await usuario.save();

        //Generar JWT
        const token=await generarJWT(usuario.id);
        
        res.json({
            ok:true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el Soporte'
        })
    }

    
}   


const loginUsuario=async(req,res=response)=>{

    const {email,password}=req.body;

    try {
        const usuario=await Usuario.findOne({email});
        if (!usuario) {
            return res.status(404).json({
                ok:false,
                msg:'Email No Encontrado'
            });
        }

        const validPasswor=bcrypt.compareSync(password,usuario.password);
        if (!validPasswor) {
            return res.status(400).json({
                ok:false,
                msg:'Password Incorrecto'
            });
        }

        //Generar JWT
        const token=await generarJWT(usuario.id);

        res.json({
            ok:true,
            usuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el Soporte'
        })
    }
}

const renewToken=async(req,res=response)=>{
    
    const uid=req.uid;

    const token=await generarJWT(uid);

    const usuario=await Usuario.findById(uid);
    
    
    res.json({
        ok:true,
        usuario,
        token
    });
}

module.exports={
    renewToken,
    crearUsuario,
    loginUsuario,
}