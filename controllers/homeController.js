const Categorias = require('../models/Categorias.js');
const Meeti = require('../models/Meeti.js');
const Grupos = require('../models/Grupos.js');
const Usuarios = require('../models/Usuarios.js');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.home = async (req, res) => {

    // Promise para consultas en el home
    const consultas = [];
    consultas.push( Categorias.findAll({}) );
    consultas.push( Meeti.findAll ({
            attributes : ['slug', 'titulo', 'fecha', 'hora'], // con esta propiedad podemos extraer solo los datos o campos que queremos de la consulta
            where :{
                fecha : { [Op.gte] : moment(new Date()).format("YYYY-MM-DD") }
            },
            limit: 3, // propiedad para limitar la consulta
            order : [
                ['fecha', 'ASC']
            ], 
            include : [ // con esta propiedad podemos traer a la consulta las tablas que esten relacionadas
                {
                    model : Grupos, 
                    attributes: ['imagen']
                },
                {
                    model : Usuarios, 
                    attributes: ['nombre', 'imagen']
                }
            ]
    }));

    // extraer y pasar a la vista
    const [ categorias, meetis ] = await Promise.all(consultas);

    res.render('home', {
        nombrePagina : 'Inicio',
        categorias, 
        meetis, 
        moment
    })
};