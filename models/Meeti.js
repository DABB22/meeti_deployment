
const Sequelize = require('sequelize');
const db = require('../config/db.js');
const uuid = require('uuid/v4'); // para crear id unicos
const slug = require('slug'); // para crear las url
const shortid = require('shortid'); // para crear un id corto

const Usuarios = require('../models/Usuarios.js');
const Grupos = require('../models/Grupos.js');


const Meeti = db.define(
    'meeti', {
        id  : {
            type: Sequelize.UUID,
            primaryKey : true,
            allowNull : false
        }, 
        titulo : {
            type : Sequelize.STRING,
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega un Titulo'
                }
            }
        }, 
        slug : {
            type: Sequelize.STRING,
        },
        invitado : Sequelize.STRING,
        cupo : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        descripcion : {
            type : Sequelize.TEXT, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una descripción'
                }
            }
        },
        fecha : {
            type : Sequelize.DATEONLY, // este campo solo nos guarda en formato AA/MM/DD    
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una fecha para el Meeti'
                }
            }
        },
        hora : {
            type : Sequelize.TIME, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una hora para el Meeti'
                }
            }
        },
        direccion : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una dirección'
                }
            }
        },
        ciudad : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una Ciudad'
                }
            }
        },
        estado : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega un estado'
                }
            }
        },
        pais : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega un país'
                }
            }
        },
        ubicacion : { // Geonetry es un tipo de datos de Sequelize, POIN lo que hace es guardar los datos de lat y lng y de esa forma puedes comparar un punto con  otro punto y conocer sus distancias. 
            type : Sequelize.GEOMETRY('POINT') // este tipo de campo(GEOMETRY) nos permitirá guardar en un solo campo latitud y longitud // al momento de correr el codigo el servidor nos va a generar un error por este tipo de campo por lo que debemos crear una extensión o agregarla (abrimos tableplus y en la parte de sql realizaremos este tema por medio de un codigo sql ... "CREATE EXTENSION postgis" )
        },
        interesados : {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue : [] // si no se le define default value lo indica como null por lo que lo indicaremos como un arreglo vacío 
        }
    }, {
        hooks: {
            async beforeCreate(meeti) {
                const url = slug(meeti.titulo).toLowerCase();
                meeti.slug = `${url}-${shortid.generate()}`;
            }
        }
    } 
);
    
Meeti.belongsTo(Usuarios); // cada meeti tiene un usuario
Meeti.belongsTo(Grupos); // cada meeti tiene un grupo

module.exports = Meeti;