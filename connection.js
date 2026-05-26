const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexiones: reutiliza conexiones eficientemente
const pool = new Pool({
  host:     process.env.DB_HOST     || 'db',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'tienda_db',
  user:     process.env.DB_USER     || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
});

// Función para verificar conexión exitosa
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexión OK a PostgreSQL');
    client.release(); // Liberar el cliente de vuelta al pool
  } catch (error) {
    console.error('Error conectando a PostgreSQL:', error.message);
    // Reintenta cada 5 segundos (útil cuando Docker levanta los contenedores)
    setTimeout(testConnection, 5000);
  }
};

// Función para inicializar las tablas si no existen
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS libros (
  id        SERIAL PRIMARY KEY,
  titulo    VARCHAR(200) NOT NULL,
  autor     VARCHAR(150) NOT NULL,
  genero    VARCHAR(100),
  stock     INTEGER DEFAULT 1,
  disponible BOOLEAN DEFAULT true,
  creado_en TIMESTAMP DEFAULT NOW()
);
    `);
    console.log('Tabla "libros" lista');
  } catch (error) {
    console.error('Error inicializando base de datos:', error.message);
  }
};

module.exports = { pool, testConnection, initDatabase };
