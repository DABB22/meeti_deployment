// Importamos Sequelize para poder tener acceso a los metodos de Sequelize
const Sequelize = require('sequelize');
// importamos la base de datos para que sepa a qué base de datos se va crear (el modelo)
const db = require('../config/db.js');
const bcrypt = require('bcrypt');

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    nombre : Sequelize.STRING(60),
    imagen : Sequelize.STRING(60),
    descripcion: Sequelize.TEXT,
    email: {
        type: Sequelize.STRING(30),
        allowNull: false, // con esto indicamos que el campo debe ser obligatorio
        validate: { // Validación del campo con sequelize
            isEmail: { msg : 'Agrega un correo válido'}
        },
        unique : {
            args: true,
            msg : 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false, // campo obligatorio
        validate : { // validación con sequelize
            notEmpty : {
                msg : 'El password no puede ir vacio'
            }
        }
    }, 
    activo : {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tokenPassword : Sequelize.STRING, 
    expiraToken : Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) { 
            usuario.password = Usuarios.prototype.hashPassword(usuario.password);
        }
    }
});

// Método para comparar los password
Usuarios.prototype.validarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
Usuarios.prototype.hashPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null );
}

module.exports = Usuarios;