const express = require('express');
const cors = require('cors');
require('dotenv').config();

const quizzesRoutes = require('./routes/quizzes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); // ← добавляем здесь

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Подключаем роуты
app.use('/quizzes', quizzesRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes); // ← и вот здесь используем

app.get('/', (req, res) => {
  res.send('Netizen Quiz MiniApp Backend is running 🎉');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });