const express = require('express');
const router = express.Router();
const db = require('../db');

// Получение всех квизов с фильтрацией по параметрам
router.get('/', async (req, res) => {
  const { category, isPopular, isNew } = req.query;
  try {
    let query = 'SELECT * FROM quizzes WHERE 1=1';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (isPopular === 'true') {
      query += ' AND is_popular = true';
    }

    if (isNew === 'true') {
      query += ' AND is_new = true';
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении квизов:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;