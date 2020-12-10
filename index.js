const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;
app.use(express.json());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'listadocompra'
});

conexion.connect((error) => {
    if(error){
        throw error;
    }
    console.log('Database Conectada');
});

app.listen(port, () => {
    console.log(`Conectado en el puerto ${port}`);
})


