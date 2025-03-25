const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la base de datos
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Conectar a la base de datos
sql.connect(dbConfig).then(() => {
    console.log('Conectado a SQL Server');
}).catch(err => console.error('Error de conexión:', err));

app.get('/api/tareas', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Tareas');
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener las tareas:', err);
        res.status(500).send('Error al obtener las tareas');
    }
});

// Obtener una tarea por ID
app.get('/api/tareas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query(`SELECT * FROM Tareas WHERE id = ${id}`);
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    } catch (err) {
        console.error('Error al obtener la tarea:', err);
        res.status(500).send('Error al obtener la tarea');
    }
});

// Crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
    const { titulo, descripcion, estado, id_tester, id_desarrollador } = req.body;
    try {
        await sql.query(`
            INSERT INTO Tareas (titulo, descripcion, estado, id_tester, id_desarrollador)
            VALUES ('${titulo}', '${descripcion}', '${estado}', ${id_tester}, ${id_desarrollador})
        `);
        res.status(201).send('Tarea creada con éxito');
    } catch (err) {
        console.error('Error al crear la tarea:', err);
        res.status(500).send('Error al crear la tarea');
    }
});

// Actualizar estado de una tarea
app.put('/api/tareas/:id', async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    try {
        await sql.query(`
            UPDATE Tareas SET estado = '${estado}' WHERE id = ${id}
        `);
        res.send('Estado de la tarea actualizado');
    } catch (err) {
        console.error('Error al actualizar la tarea:', err);
        res.status(500).send('Error al actualizar la tarea');
    }
});

// Agregar un comentario a una tarea
app.post('/api/comentarios', async (req, res) => {
    const { id_tarea, id_usuario, comentario } = req.body;
    try {
        await sql.query(`
            INSERT INTO Comentarios (id_tarea, id_usuario, comentario)
            VALUES (${id_tarea}, ${id_usuario}, '${comentario}')
        `);
        res.status(201).send('Comentario agregado con éxito');
    } catch (err) {
        console.error('Error al agregar el comentario:', err);
        res.status(500).send('Error al agregar el comentario');
    }
});

// Obtener comentarios de una tarea
app.get('/api/comentarios/:id_tarea', async (req, res) => {
    const { id_tarea } = req.params;
    try {
        const result = await sql.query(`
            SELECT * FROM Comentarios WHERE id_tarea = ${id_tarea}
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error('Error al obtener los comentarios:', err);
        res.status(500).send('Error al obtener los comentarios');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
