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


app.get('/api/Modulo_Cliente', async (req, res) => {
    //res.header('Access-Control-Allow-Origin','*');
    try {
        let pool = await connectToDB();
        let result = await pool.request().query(`Select CustomerName, CustomerCategoryName,
                                                    DeliveryMethodName
                                                    from Sales.Customers
                                                    join Sales.CustomerCategories on 
                                                    Sales.Customers.CustomerCategoryID = 
                                                    Sales.CustomerCategories.CustomerCategoryID
                                                    join Application.DeliveryMethods on 
                                                    Application.DeliveryMethods.DeliveryMethodID = 
                                                    Sales.Customers.DeliveryMethodID Where BuyingGroupID IS NOT NULL 
                                                    order by 
                                                    CustomerName;`);
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
        let result = await pool.request().query(`Select PS.SupplierName, PSC.SupplierCategoryName,AD.DeliveryMethodName
                                                    from Purchasing.Suppliers PS
                                                    join Purchasing.SupplierCategories PSC on PS.SupplierCategoryID = PSC.SupplierCategoryID
                                                    join Application.DeliveryMethods AD on PS.DeliveryMethodID = AD.DeliveryMethodID
                                                    Where PS.SupplierCategoryID IS NOT NULL and PS.DeliveryMethodID IS NOT NULL order by
                                                    SupplierName;`);
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
        let result = await pool.request().query(`SELECT TOP 500 SIL.InvoiceLineID,SI.InvoiceDate,SC.CustomerName,AD.DeliveryMethodName,
                                                    SIL.ExtendedPrice

                                                    from Sales.InvoiceLines  SIL

                                                    join Sales.Invoices SI on SI.InvoiceID = SIL.InvoiceID
                                                    join Sales.Customers SC on SI.CustomerID = SC.CustomerID
                                                    join Application.DeliveryMethods AD on SI.DeliveryMethodID = AD.DeliveryMethodID
                                                    Order by SIL.InvoiceLineID`);
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
        let result = await pool.request().query(`Select SC.CustomerName, CustomerCategoryName,
                                                    DeliveryMethodName, BuyingGroupName,AP.PreferredName as Contact,APT.PreferredName as AlterContact, SCT.CustomerName as ClienteAFacturar,
                                                    SC.PostalPostalCode, SC.PhoneNumber, SC.FaxNumber,SC.PaymentDays,SC.WebsiteURL,SC.DeliveryAddressLine1
                                                    from Sales.Customers SC
                                                    join Sales.CustomerCategories SCC on SC.CustomerCategoryID = SCC.CustomerCategoryID
                                                    join Application.DeliveryMethods AD on AD.DeliveryMethodID = SC.DeliveryMethodID 
                                                    join Sales.BuyingGroups  SB on SB.BuyingGroupID = SC.BuyingGroupID
                                                    join Application.People AP on AP.PersonID = SC.PrimaryContactPersonID 
                                                    join Application.People APT on  APT.PersonID = SC.AlternateContactPersonID
                                                    join Sales.Customers SCT on SC.BillToCustomerID = SCT.CustomerID
                                                    join Application.Cities AC on SC.DeliveryCityID = AC.CityID 
                                                    Where SC.CustomerName like '%${name}%'
                                                    order by CustomerName`
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
        let result = await pool.request().query(`Select PS.SupplierReference,PS.SupplierName,PSC.SupplierCategoryName,AP.PreferredName as Contact,APT.PreferredName as AlterContact,
                                                    AC.CityName, PS.PhoneNumber, PS.FaxNumber, PS.WebsiteURL,CONCAT(PS.DeliveryAddressLine1, ' ', PS.DeliveryAddressLine2) as DeliveryAddress,
                                                    CONCAT(PS.PostalAddressLine1,' ',PS.PostalAddressLine2) as Postal,PS.BankAccountName,PS.BankAccountNumber,PS.PaymentDays

                                                    from Purchasing.Suppliers PS
                                                    join Purchasing.SupplierCategories PSC on PS.SupplierCategoryID = PSC.SupplierCategoryID
                                                    join Application.People AP on AP.PersonID = PS.PrimaryContactPersonID 
                                                    join Application.People APT on  APT.PersonID = PS.AlternateContactPersonID
                                                    join Application.DeliveryMethods AD on AD.DeliveryMethodID = PS.DeliveryMethodID 
                                                    join Application.Cities AC on   AC.CityID = PS.DeliveryCityID
                                                    Where PS.SupplierName like '%${name}%'
                                                    Order by PS.SupplierName;`
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
        let result = await pool.request().query(`select  SIL.InvoiceLineID,SC.CustomerName,AD.DeliveryMethodName,SO.CustomerPurchaseOrderNumber,
                                                    AP.PreferredName as CopntactPerson,
                                                    APT.FullName as SellerName, SI.InvoiceDate,SI.DeliveryInstructions,WS.StockItemName,SIL.Quantity,WS.UnitPrice,
                                                    SIL.TaxRate,SIL.TaxAmount,SIL.LineProfit


                                                    from Sales.InvoiceLines  SIL 
                                                    join Sales.Invoices SI on SI.InvoiceID = SIL.InvoiceID
                                                    join Sales.Customers SC on SC.CustomerID = SI.CustomerID
                                                    join Application.DeliveryMethods AD on SI.DeliveryMethodID = AD.DeliveryMethodID
                                                    join Sales.Orders SO on SI.OrderID = SO.OrderID
                                                    join Application.People AP on AP.PersonID =  SI.ContactPersonID 
                                                    join Application.People APT on APT.PersonID =  SI.SalespersonPersonID
                                                    join Warehouse.StockItems WS on SIL.StockItemID = WS.StockItemID
                                                    Where SIL.InvoiceLineID = ${id}`
                                            );
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
