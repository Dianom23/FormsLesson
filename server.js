const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Для статических файлов

// Инициализация базы данных
const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных:', err.message);
    } else {
        console.log('Подключение к базе данных SQLite установлено');
        
        // Создание таблицы пользователей, если она не существует
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullName TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            registrationDate TEXT DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Ошибка при создании таблицы:', err.message);
            } else {
                console.log('Таблица users создана или уже существует');
            }
        });
    }
});

// Маршрут для регистрации (изменено с POST на GET)
app.get('/register', (req, res) => {
    const { fullName, email } = req.query; // Используем query параметры вместо body
    
    // Проверка наличия параметров
    if (!fullName || !email) {
        return res.status(400).json({
            success: false,
            message: 'Необходимо указать fullName и email'
        });
    }
    
    // Сохранение данных в базу данных
    db.run('INSERT INTO users (fullName, email) VALUES (?, ?)', [fullName, email], function(err) {
        if (err) {
            // Обработка ошибок, например, если email уже существует
            console.log(err);
            return res.status(400).json({
                success: false,
                message: `Ошибка при регистрации: ${err.message}`
            });
        }
        
        // Отправляем ответ
        res.json({
            success: true,
            message: `Пользователь ${fullName} успешно зарегистрирован!`
        });
    });
});

app.get('/users', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Маршрут для получения всех пользователей
app.get('/get_users', (req, res) => {
    db.all('SELECT * FROM users ORDER BY registrationDate DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: `Ошибка при получении списка пользователей: ${err.message}`
            });
        }
        
        res.json({
            success: true,
            users: rows
        });
    });
});

// Маршрут для удаления всех пользователей
app.delete('/users', (req, res) => {
    db.run('DELETE FROM users', [], function(err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: `Ошибка при удалении пользователей: ${err.message}`
            });
        }
        
        res.json({
            success: true,
            message: `Все пользователи успешно удалены`,
            deletedCount: this.changes // количество удаленных строк
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});

// Обработка закрытия соединения с БД при завершении работы сервера
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Ошибка при закрытии базы данных:', err.message);
        } else {
            console.log('Соединение с базой данных закрыто');
        }
        process.exit(0);
    });
}); 