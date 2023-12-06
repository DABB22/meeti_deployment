
const Sequelize = require('sequelize');
const db = require('../config/db.js');


const Categorias = db.define('categorias', {
    id : {
        type: Sequelize.INTEGER, 
        primaryKey: true,
        autoIncrement : true
    }, 
    nombre : Sequelize.TEXT,
    slug : Sequelize.TEXT
}, {
    timestamps : false
});

module.exports = Categorias;


// INSERT INTO "categorias" ("id", "nombre", "slug") VALUES ('1', 'Programación', 'programacion'),
// ('2', 'Diseño', 'diseno'),
// ('3', 'Negocios y Emprendimiento', 'negocios-y-emprendimiento'),
// ('4', 'Moda y Estilo', 'moda-y-estilo'),
// ('5', 'Salud y Ejercicio', 'salud-y-ejercicio'),
// ('6', 'Fotografía y Viajes', 'fotografia-y-viajes'),
// ('7', 'Comida y Bebidas', 'comidad-y-bebidas'),
// ('8', 'Diseño y Arquitectura', 'diseno-y-arquitectura'),
// ('9', 'Café', 'cafe'),
// ('10', 'Cine y Películas', 'cine-y-peliculas'),
// ('11', 'Libros', 'libros'),
// ('12', 'Aprendizaje', 'aprendizaje');