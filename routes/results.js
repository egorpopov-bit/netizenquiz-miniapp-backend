const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// Получение результатов текущего пользователя
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      'SELECT * FROM results WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении результатов:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Сохранение результата прохождения квиза
router.post('/', verifyToken, async (req, res) => {
  const { quizId, answers, score } = req.body;
  const userId = req.user.id;

  try {
    const result = await db.query(
      'INSERT INTO results (user_id, quiz_id, answers, score) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, quizId, answers, score]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при сохранении результата:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;