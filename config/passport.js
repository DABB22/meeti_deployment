

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // este te permite iniciar sesión con un usuario y un password de una BD
const Usuarios = require('../models/Usuarios'); // modelo de usuarios donde van a obtener los registros

passport.use(new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
    }, 
    async (email, password, next) => { 
        // código se ejecuta al llenar el formulario
        const usuario = await Usuarios.findOne({ 
                                              where : { email, activo : 1 } });

        // revisar si existe o no
        if(!usuario) return next(null, false, { // null porque no hay errores, false porque no se va a retornar ningun usuario ya que no se encontró, pero sí vamos a pasar un mensaje en las opciones.
            message : 'Ese usuario no existe'
        });
        // El usuario existe, comparar su password
        const verificarPass = usuario.validarPassword(password);
        // si el password es incorrecto
        if(!verificarPass) return next(null, false, { // null porque no hay errores, false porque no se va a retornar ningun usuario ya que no coincide el password, pero sí vamos a pasar un mensaje en las opciones.
            message : 'Password Incorrecto'
        });

        //- Todo bien
        return next(null, usuario); // null porque no hay errores, retornamos el usuario porque pasaron todas las validaciones
        
    }

))

//configuración que requiere passport 
passport.serializeUser(function(usuario, cb) {
    cb(null, usuario);
});
passport.deserializeUser(function(usuario, cb) {
    cb(null, usuario);
});

module.exports = passport;