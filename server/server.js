/* Библиотеки */
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');

const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');

/* Переменные */
const PORT = process.env.PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const corsOptions = { origin: CLIENT_URL, credentials: true }; // Разрешённые источники

/* Подключение middleware к Express */
app.use(cors(corsOptions));        // Разрешаем запросы CORS
app.use(express.json());           // JSON-парсер
app.use(express.static('public')); // Делаем папку public доступной для всех клиентов
app.use(cookieSession({
    name: 'session',
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000 // 1 день
}));

/* Запросы */
app.use('/', authRoutes); // Регистрация, авторизация
app.use('/', apiRoutes);  // API

// Путь к папке с курсами
const scormBasePath = path.join(process.cwd(), 'scorm');
app.use('/scorm', express.static(scormBasePath));

/* Запуск сервера */
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
})