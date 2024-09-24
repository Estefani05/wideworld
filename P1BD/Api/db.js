// conexión a base de datos Wide World Importers

// dbConfig.js
const sql = require('mssql');

const config = {
    user: 'sa',                // usuario de SQL Server
    password: 'estefaniyo',     // contraseña de SQL Server
    server: 'localhost',           //  nombre del servidor
    database: 'WideWorldImporters', // base de datos
    options: {
        encrypt: false,         // Puede que necesites deshabilitar el cifrado si no está configurado en el servidor
        enableArithAbort: true
    },
    port: 1433                  // Verifica que sea el puerto correcto
};

async function connectToDB() {
    try {
        let pool = await sql.connect(config);
        console.log("Conexión a la base de datos exitosa");
        return pool;
    } catch (err) {
        console.error('Error conectando a la base de datos: ', err);
        throw err;
    }
}

module.exports = {
    connectToDB,
    sql
};