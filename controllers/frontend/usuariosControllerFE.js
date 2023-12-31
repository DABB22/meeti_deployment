const Usuarios = require('../../models/Usuarios.js');
const Grupos = require('../../models/Grupos.js')


exports.mostrarUsuario = async (req, res, next) => {
    const consultas = [];

    // consultas al mismo tiempo
    consultas.push( Usuarios.findOne({ where : { id : req.params.id }}));
    consultas.push( Grupos.findAll({ where : { usuarioId : req.params.id }}) );

    const [usuario, grupos] = await Promise.all(consultas);

    if(!usuario) {
        res.redirect('/');
        return next();
    }

    // mostrar la vista
    res.render('mostar-perfil', {
        nombrePagina : `Organizador del evento: ${usuario.nombre}`,
        usuario,
        grupos
    })
}