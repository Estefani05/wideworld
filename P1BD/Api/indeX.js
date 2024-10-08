const express = require('express');
const bodyParser = require('body-parser'); // Para procesar el cuerpo de las solicitudes POST
const cors = require('cors'); // Importar CORS
const { connectToDB, sql } = require('./db');
const app = express();
app.options('*', cors());

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


app.get('/api/Modulo_Cliente', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    try {
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getAllCustomers`);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/api/Modulo_Proveedores', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    try {
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getAllSupliers`);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/api/Modulo_Inventarios', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    try {
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getAllStock `);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});



app.get('/api/Modulo_Ventas', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    try {
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getAllSales `);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/api/Modulo_Cliente/:name', async (req, res) => {
    try {
        let name = req.params.name;
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getOneCustomer @name = '${name}'`
                                            );
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});




app.get('/api/Modulo_Proveedores/:name', async (req, res) => {
    try {
        let name = req.params.name;
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getOneSuplier @name = '${name}'`
                                            );
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});



app.get('/api/Modulo_Inventarios/:name', async (req, res) => {
    try {
        let name = req.params.name;
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getOneStock @name = '${name}'`
                                            );
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/api/Modulo_Ventas/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getOneSale @id = ${id}`
                                            );
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});



/*FILTERS    Modulo_Cliente */

app.get('/api/Modulo_Cliente_filtered', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    console.log("entre")
    let Filters = req.query.toFilter;
    console.log(Filters)
    let SQLfilters = '(';
 
    Filters.map((filter)=>{
        SQLfilters = `${SQLfilters} CustomerName like ''%${filter}%''`
        SQLfilters = `${SQLfilters} and`
    })
    SQLfilters = `${SQLfilters} CustomerName like ''%${Filters[0]}%'' )`
    console.log(SQLfilters);
    
    try {
    
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getFilteredCustomers @SQLfilters = '${SQLfilters}'`);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});




app.get('/api/Modulo_Proveedores_filtered', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    console.log("entre")
    let Filters = req.query.toFilter;
    console.log(Filters)
    let SQLfilters = '(';
    let SQLfilters2 = '(';
    Filters.map((filter)=>{
        SQLfilters = `${SQLfilters} SupplierName like ''%${filter}%''`
        SQLfilters = `${SQLfilters} and`
    })
    SQLfilters = `${SQLfilters} SupplierName like ''%${Filters[0]}%'' )`
    console.log(SQLfilters);
    Filters.map((filter)=>{
        SQLfilters2 = `${SQLfilters2} PSC.SupplierCategoryName like ''%${filter}%''`
        SQLfilters2 = `${SQLfilters2} and`
    })
    SQLfilters2 = `${SQLfilters2} PSC.SupplierCategoryName like ''%${Filters[0]}%'' )`
    console.log(SQLfilters2)
    
    try {
    
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getFilteredSupliers @SQLfilters = '${SQLfilters}', @SQLfilters2 =  '${SQLfilters2}'
                                                    ;`);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});





app.get('/api/Modulo_Inventarios_filtered', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    console.log("entre")
    let Filters = req.query.toFilter;
    console.log(Filters)
    let SQLfilters = '(';
    let SQLfilters2 = '(';
    Filters.map((filter)=>{
        SQLfilters = `${SQLfilters} WS.StockItemName like ''%${filter}%''`
        SQLfilters = `${SQLfilters} and`
    })
    SQLfilters = `${SQLfilters} WS.StockItemName like ''%${Filters[0]}%'' )`

    Filters.map((filter)=>{
        SQLfilters2 = `${SQLfilters2} WSG.StockGroupName like ''%${filter}%''`
        SQLfilters2 = `${SQLfilters2} and`
    })
    SQLfilters2 = `${SQLfilters2} WSG.StockGroupName like ''%${Filters[0]}%'' )`
    
    
    try {
    
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getFilteredStock @SQLfilters = '${SQLfilters}', @SQLfilters2 =  '${SQLfilters2}'`);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});

app.get('/api/Modulo_ventas_filtered', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    console.log("entre")
    let Filters = req.query.toFilter;
    console.log(Filters)
    let SQLfilters = '(';
    Filters.map((filter)=>{
        SQLfilters = `${SQLfilters} SC.CustomerName like ''%${filter}%''`
        SQLfilters = `${SQLfilters} and`
    })
    SQLfilters = `${SQLfilters} SC.CustomerName like ''%${Filters[0]}%'' )`

    
    try {
    
        let pool = await connectToDB();
        let result = await pool.request().query(`EXEC getFilteredSales @SQLfilters = '${SQLfilters}'`);
        res.json(result.recordset);  // Enviar los datos obtenidos
    } catch (err) {
        console.error('Error ejecutando la consulta: ', err);
        res.status(500).send('Error en el servidor');
    }
});




// Iniciar el servidor
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}/api/`);
});
