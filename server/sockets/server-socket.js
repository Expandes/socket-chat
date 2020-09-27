const { io } = require('../server');
const { Usuarios } = require('../classes/clsUsuarios');
const { crearMensaje } = require('../utilidades/utilidades');


const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (dataDelCliente, respAlClienteCallback) => {

        //console.log(dataDelCliente);

        if (!dataDelCliente.nombre || !dataDelCliente.sala) {
            return respAlClienteCallback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        //Ingresar a una sala
        client.join(dataDelCliente.sala);



        usuarios.agregarPersona(client.id, dataDelCliente.nombre, dataDelCliente.sala);

        //Broadcast a todas las personas en el chat
        //client.broadcast.emit('listaPersona', usuarios.getTodasLasPersonas());

        //Broadcast sólo a personas de la sala
        client.broadcast.to(dataDelCliente.sala).emit('listaPersona', usuarios.getPersonasPorSala(dataDelCliente.sala));


        respAlClienteCallback(usuarios.getPersonasPorSala(dataDelCliente.sala));
    });


    //Escucha el EMIT del cliente para crear mensajes, y lo devuelve como broadcast para todos
    //No olvidar que el SERVER es el nodo del chat
    client.on('crearMensaje', (data) => {

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });



    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('CrearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        //client.broadcast.emit('CrearMensaje', { usuario: 'Administrador', mensae: `${personaBorrada.nombre} abandonó el chat` });

        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    //Mensajes privados NODO

    client.on('mensajePrivado', data => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
        //client.broadcast.emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });



});