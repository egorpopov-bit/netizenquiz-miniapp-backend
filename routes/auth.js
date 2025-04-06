const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken'); // Добавляем jwt
const router = express.Router();

const TELEGRAM_BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_USERNAME = '@itsnetizen'; // замени на своё, если нужно

// 👉 Выдача JWT токена
router.post('/', (req, res) => {
  const { id, first_name } = req.body;

  if (!id || !first_name) {
    return res.status(400).json({ error: 'Missing user data' });
  }

  const payload = { id, first_name };
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '30d' });

  res.json({ token });
});

// 👉 Проверка подписки на канал
router.get('/check-subscription', async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember?chat_id=${CHANNEL_USERNAME}&user_id=${user_id}`;
    const response = await axios.get(tgUrl);

    const status = response.data.result.status;
    const isMember = ['member', 'administrator', 'creator'].includes(status);

    res.json({ isMember });
  } catch (error) {
    console.error('Ошибка проверки подписки:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to check subscription' });
  }
});

module.exports = router;