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

router.get('/:id', async (req, res) => {
  const quizId = req.params.id;

  try {
    const quizResult = await db.query('SELECT * FROM quizzes WHERE id = $1', [quizId]);

    if (quizResult.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questionsResult = await db.query(
      'SELECT id, question_text FROM questions WHERE quiz_id = $1 ORDER BY id',
      [quizId]
    );

    const questionIds = questionsResult.rows.map(q => q.id);

    let answersResult = { rows: [] };
    if (questionIds.length > 0) {
      answersResult = await db.query(
        'SELECT id, question_id, answer_text, is_correct FROM answers WHERE question_id = ANY($1::int[])',
        [questionIds]
      );
    }

    const answersMap = {};
    for (const answer of answersResult.rows) {
      if (!answersMap[answer.question_id]) {
        answersMap[answer.question_id] = [];
      }
      answersMap[answer.question_id].push({
        id: answer.id,
        answer_text: answer.answer_text,
        is_correct: answer.is_correct,
      });
    }

    const questions = questionsResult.rows.map((q) => ({
      id: q.id,
      question_text: q.question_text,
      answers: answersMap[q.id] || [],
    }));

    const quiz = {
      ...quizResult.rows[0],
      questions,
    };

    res.json(quiz);
  } catch (err) {
    console.error('Ошибка при получении квиза:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});