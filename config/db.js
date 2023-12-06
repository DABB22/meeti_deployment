
const Sequelize = require('sequelize');
const fs = require('fs');
require('dotenv').config({ path: 'variables.env'});

// Read the certificate file (use the correct path for your certificate file)
// const rootCert = fs.readFileSync('/etc/ssl/certs/ca-certificates.crt');

module.exports = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.BD_HOST,
    port: process.env.BD_PORT,
    dialect : 'postgres', 
    ssl: true,
    dialectOptions: {
        // project: "bb-core-demo-db",
        ssl: true && {
          require: true,
        //   native: true,
        //   ca: rootCert, // Use the root certificate
        //   rejectUnauthorized: false,
        },
    },
    pool : {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // define: {
    //     timestamps : true
    //     // timestamps : false
    // },
    // logging : false
});