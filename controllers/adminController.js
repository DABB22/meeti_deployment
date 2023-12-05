
const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; // función de comparación de sequelize 

exports.panelAdministracion = async (req, res) => {

    // const grupos = await Grupos.findAll({ where: { usuarioId : req.user.id }})
    // const meeti = Meeti.findAll({ where: { usuarioId : req.user.id }}) ); 

    // consultas
    const consultas = [];
    consultas.push( Grupos.findAll({ where: { usuarioId : req.user.id }}) ); 
    consultas.push( Meeti.findAll({ where : { usuarioId : req.user.id, 
                                              fecha : { [Op.gte] : moment(new Date()).format("YYYY-MM-DD") } // operador grater than or equals (gte)
                                            },
                                    order : [
                                        ['fecha', 'ASC'] // arreglo donde indicamos por cuál columna queremos ordenar y el tipo de orden que queremos
                                    ] 
    }) );
    consultas.push( Meeti.findAll({ where : { usuarioId : req.user.id, 
                                            fecha : { [Op.lt] : moment(new Date()).format("YYYY-MM-DD") } // operador less than (lt)
                                            },
                                    order : [
                                        ['fecha', 'DESC'] // arreglo donde indicamos por cuál columna queremos ordenar y el tipo de orden que queremos
                                    ] 
    }) );
    // array destructuring
    // const [grupos, meeti] = await Promise.all(consultas);
    const [grupos, meeti, anteriores] = await Promise.all(consultas);
    
    res.render('administracion', {
        nombrePagina : 'Panel de Administracion', 
        grupos,
        meeti,
        anteriores,
        moment
    })
}