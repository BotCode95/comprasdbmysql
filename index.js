const express = require('express');
const mysql = require('mysql');
const util = require('util');

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

const qy = util.promisify(conexion.query).bind(conexion); //permite el uso
//de async-await en la conexion mysql
/**
 * Categorias
 * Ruta > /categoria
 */

 //get categoria
 app.get('/categoria', async (req,res) => {
        try {
            const query = 'SELECT * FROM categoria';
            const response = await qy(query);
            res.send({mensaje: response});
            
        } catch (error) {
            console.log(error);
            res.status(413).send({"error": error.message});
            
        }
 });

 //get categoriaid
 app.get('/categoria/:id', async (req, res) => {
     try {
         const query = 'SELECT * FROM categoria WHERE id = ?';
         const response = await qy(query, [req.params.id]);
         res.send({"categoria_id" : response})
     } catch (error) {
         res.status(413).send({"error": error.message});
     }
 });

 //post categoria
 app.post('/categoria', async (req,res) => {
     try {
         if(!req.body.nombre){
            throw new Error('Falta enviar el nombre')
         }
         const {nombre} = req.body;
         const nombreCat = nombre;
         let query = 'SELECT id FROM categoria WHERE nombre = ?'
         let response = await qy(query, [nombreCat]);
         if(response.length > 0) {
             throw new Error('Esa categoria ya existe');
         }

         //almaceno la nueva categoria
         query = 'INSERT INTO categoria (nombre) VALUE (?)';
         response = await qy(query, [nombreCat]);
         res.send({"respuesta" : response.insertId});
     } catch (error) {
         res.status(413).send({"error": error.message});
     }
 })

 app.put('/categoria/:id', async (req,res) => {
     try {
         if(!req.body.nombre){
             throw new Error('Se requiere el nombre')
         }
         let query = 'SELECT * FROM categoria WHERE nombre = ? AND id <> ?';
         let response = await qy(query, [req.body.nombre, req.params.id])
         if(response.length > 0){
             throw new Error('El nombre de la categoria ya existe')
         }
         query = 'UPDATE categoria SET nombre = ? WHERE id = ?';
         response = await qy(query, [req.body.nombre, req.params.id])
         res.send({"respuesta": response});
     } catch (error) {
         res.status(413).send({"error": error.message});
     }
 })

 app.delete('/categoria/:id', async (req, res) => {
    try {
        let query = 'SELECT * FROM producto WHERE categoria_id = ?';
        let response = await qy(query, [req.params.id])
        if(response.length > 0) {
            throw new Error("esta categoria tiene productos asociados");
        }

        query = 'DELETE FROM categoria WHERE id = ?';
        response = await qy(query, [req.params.id]);
        res.send({'respuesta': response});
    } catch (error) {
        res.status(413).send({"Error" : error.message});
    }
})

/**
    Productos
    Ruta  > /producto
*/

/**
 * Lista de compras 
 * Ruta > /lista
 */
app.listen(port, () => {
    console.log(`Conectado en el puerto ${port}`);
})


