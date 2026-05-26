require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const { testConnection, initDatabase } = require('./database/connection');
const librosRouter = require('./routes/libros');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Ruta raíz: información del proyecto ────────────────────
app.get('/', (req, res) => {
  res.json({
    proyecto:  'Biblioteca Virtual',
    version:   '1.0.0',
    materia:   'Proyecto Integración Continua',
    entrega:   'Primera entrega - Escenario 3',
    contenedores: {
      backend:  'Node.js + Express (este servidor)',
      database: 'PostgreSQL',
    },
    endpoints: {
      health:    'GET  /health',
      productos: 'GET  /libros',
      crear:     'POST /libros',
    },
  });
});


app.get('/health', async (req, res) => {
  try {
    const { pool } = require('./database/connection');
    await pool.query('SELECT 1'); // Consulta mínima para verificar conexión

    res.json({
      ok:        true,
      status:    '✓ Sistema operativo',
      backend:   'Node.js corriendo correctamente',
      database:  '✓ PostgreSQL conectado y respondiendo',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ok:       false,
      status:   'X Error en el sistema',
      database: 'X No se pudo conectar a PostgreSQL',
      error:    error.message,
    });
  }
});

// ── Rutas de módulos ────────────────────────────────────────
app.use('/libros', librosRouter);

// ── Ruta no encontrada ──────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// ── Iniciar servidor ────────────────────────────────────────
app.listen(PORT, async () => {
  console.log('  Biblioteca Virtual — Primera Entrega');
  console.log('  Sistema de Reservas de Libros');
  console.log(`  Servidor en puerto ${PORT}`);

  // Intentar conectar a la base de datos al arrancar
  await testConnection();
  await initDatabase();
});

module.exports = app; // Exportar para los tests
