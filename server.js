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

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de gestión de tareas funcionando');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
