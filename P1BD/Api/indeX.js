const express = require('express');
const bodyParser = require('body-parser'); // Para procesar el cuerpo de las solicitudes POST
const cors = require('cors'); // Importar CORS
const { connectToDB, sql } = require('./db');
const app = express();
const port = 8000; // Elige el puerto 

// Middleware para procesar JSON en las solicitudes
app.use(bodyParser.json());

// Habilitar CORS para todas las solicitudes
app.use(cors()); // Esto habilitará CORS para cualquier origen

app.get('/api/people', async (req, res) => {
    try {
        let pool = await connectToDB();
        let result = await pool.request().query('SELECT PersonID, FullName FROM Application.People;');
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}/api/people`);
});
