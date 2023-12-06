
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path'); // nos ayuda a darnos la ruta de la pagina actual
const bodyParser = require('body-parser'); // Para habilitar lectura de formularios
const flash = require('connect-flash');
// const session = require('express-session');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const router = require('./routes');

//* Configuración y Modelos BD
// const sequelize = require('./config/db.js');
// sequelize.authenticate().then(()=> console.log('Conexión exitosa')).catch(err => console.error('Conexión no establecida'));
const db = require('./config/db.js');
    require('./models/Usuarios.js');
    require('./models/Categorias.js');
    require('./models/Comentarios.js');
    require('./models/Grupos.js');
    require('./models/Meeti.js');
db.sync().then(() => console.log('DataBase Conectada')).catch((error) => console.log(error));

//* Variables de Desarrollo
require('dotenv').config({path: 'variables.env'});


//* Aplicación Principal
const app = express();

//* Body parser, leer formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));

//* Express validator (validación con bastantes funciones)
app.use(expressValidator());

// Habilitar EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views')); // Ubicación vistas 

// archivos staticos
app.use(express.static('public'));

// habilitar cookie parser
app.use(cookieParser());

// crear la session
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave : false,
    saveUninitialized : false
}))

// inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Agrega flash messages
app.use(flash());

// Middleware (usuario logueado, flash messages, fecha actual)
app.use((req, res, next) => {
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

// Routing
app.use('/', router());

//Agrega el puerto
// app.listen(process.env.PORT, () => {
//     console.log('El servidor esta funcionando');
// });

//leer el host y el puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;
app.listen(port, host, () => {
    console.log('El servidor esta funcionando en el puerto', port);
    console.log('El host es ', host);
});
