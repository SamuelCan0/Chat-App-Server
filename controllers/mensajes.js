const Mensajes=require('../models/mensaje');

const obtenerChat=async(req,res)=>{
    const mId=req.uid;
    const mensajesDe=req.params.de;


    const last30=await Mensajes.find({
        $or:[{de:mId,para:mensajesDe},{de:mensajesDe, para:mId}]
    })
    .sort({createdAt:'desc'})
    .limit(30);

    res.json({
        ok:true,
        mensajes:last30
    });
};

module.exports={
    obtenerChat,
}