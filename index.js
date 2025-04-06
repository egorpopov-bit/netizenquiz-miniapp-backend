const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const quizzesRoutes = require('./routes/quizzes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); // ← добавляем здесь
const resultsRoutes = require('./routes/results');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Подключаем роуты
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // ← и вот здесь используем
app.use('/api/results', resultsRoutes);

app.get('/', (req, res) => {
  res.send('Netizen Quiz MiniApp Backend is running 🎉');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });