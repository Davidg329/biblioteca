const express = require('express');
const router = express.Router();
const { pool } = require('../database/connection');

// ── GET /libros ──────────────────────────────────────────
// Retorna todos los libros de la base de datos
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM libros ORDER BY id ASC');

    res.json({
      ok: true,
      total: result.rowCount,
      libros: result.rows,
    });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
});

// ── POST /libros ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const { titulo, autor, genero, stock } = req.body;

  if (!titulo || !autor) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Los campos titulo y autor son obligatorios',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO libros (titulo, autor, genero, stock)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [titulo, autor, genero || 'General', stock || 1]
    );
    res.status(201).json({ ok: true, libro: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
});

// ── GET /libros/:id ──────────────────────────────────────
// Retorna un producto por su ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM libros WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Libro no encontrado' });
    }
    res.json({ ok: true, libro: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
});

// ── DELETE /libros/:id ───────────────────────────────────
// Elimina un producto por su ID
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM libros WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Libro no encontrado' })};

res.json({ ok: true, mensaje: 'Libro eliminado', libro: result.rows[0] });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: error.message });
  }
});

module.exports = router;
