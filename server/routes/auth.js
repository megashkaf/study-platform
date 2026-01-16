require('dotenv').config();

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;

// Transporter (тестовый через ethereal.email)
const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true, // SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

// Регистрация
// TODO: сделать транзакцию, чтобы запись в БД создавалась только если письмо получилось отправить и наоборот
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    // Проверяем, есть ли уже такой email в БД
    const existingUser = db.prepare('SELECT id FROM users WHERE email_address = ?').get(email);
    if (existingUser) {
        return res.status(400).json({ error: 'Этот email уже зарегистрирован' });
    }

    const hash = await bcrypt.hash(password, 10); // хешируем пароль
    const token = crypto.randomBytes(32).toString('hex'); // создаём токен подтверждения

    try {
        const url = `http://localhost:${PORT}/verify?token=${token}`; // ссылка подтверждения

        await transporter.sendMail({
            from: `"Поддержка" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Подтверждение регистрации',
            text: `Верифицируйте email: ${url}`,
        }).then(() => {
            db.prepare('INSERT INTO users (first_name, last_name, email_address, password, verification_token) VALUES (?, ?, ?, ?, ?)')
            .run(firstName, lastName, email, hash, token);
            res.json({ success: true });
        }).catch(err => {
            console.error('Ошибка отправки письма:', err);
        });
    } catch (err) {
        res.status(400).json({ error: 'Не получилось отправить письмо или сделать запись в БД' });
    }
});

// Подтверждение почты
router.get('/verify', (req, res) => {
    const { token } = req.query;
    const user = db.prepare('SELECT * FROM users WHERE verification_token = ?').get(token);
    if (!user) return res.status(400).send('Invalid token');

    db.prepare('UPDATE users SET verified = 1, verification_token = NULL WHERE id = ?').run(user.id);
    res.send('Email verified. You can now login.');
});

// Логин
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email_address = ?').get(email);
    if (!user || !user.verified) return res.status(401).json({ error: 'Invalid credentials or email not verified' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.userId = user.id;
    res.json({ success: true });
});

// Проверка сессии
router.get('/me', (req, res) => {
    const id = req.session.userId;
    if (!id) return res.status(401).json({ error: 'Not logged in' });

    const user = db.prepare('SELECT id, email_address FROM users WHERE id = ?').get(id);
    res.json(user);
});

// Выход
router.post('/logout', (req, res) => {
    req.session = null;
    res.json({ success: true });
});

module.exports = router;