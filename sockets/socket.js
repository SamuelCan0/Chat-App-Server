const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const {usuarioConectado,usuariodesconectado,grabarMensaje}=require('../controllers/socket');


// Mensajes de Sockets
io.on('connection', client => {

    const [valido, uid]=comprobarJWT(client.handshake.headers['x-token']);
    
    if (!valido) {return client.disconnect();} 

    console.log('Cliente Autenticado');
    usuarioConectado(uid);

    client.join(uid);

    client.on('mensaje-personal',async(payload)=>{
        //TODO: Grabar Mensaje
        await grabarMensaje(payload);
        io.to(payload.para).emit('mensaje-personal',payload);
    });


    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuariodesconectado(uid);
    });

});
