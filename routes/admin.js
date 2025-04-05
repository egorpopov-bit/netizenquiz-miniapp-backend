const express = require('express');
const router = express.Router();
const db = require('../db');

// Проверка секрета из .env
function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (token === process.env.ADMIN_SECRET) {
    return next();
  }

  return res.status(401).json({ error: 'Unauthorized' });
}

// Получить все квизы (в админке)
router.get('/quizzes', checkAuth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM quizzes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Добавить квиз
router.post('/quizzes', checkAuth, async (req, res) => {
  const {
    title, category, image, is_new, is_popular, show_answer_after_each, description
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO quizzes (id, title, category, image, is_new, is_popular, show_answer_after_each, description)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, category, image, is_new, is_popular, show_answer_after_each, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create quiz' });
  }
});

// Добавить вопрос к квизу
router.post('/questions', checkAuth, async (req, res) => {
  const {
    quiz_id, question_type, content, question, options, correct_index, explanation
  } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO questions (id, quiz_id, question_type, content, question, options, correct_index, explanation)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [quiz_id, question_type, content, question, options, correct_index, explanation]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

module.exports = router;