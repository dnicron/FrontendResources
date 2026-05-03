import http from 'http'
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database('./frontend_resources.db')
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tech TEXT,
    title TEXT,
    source TEXT,
    description TEXT,
    fullDescription TEXT,
    grade TEXT,
    cost TEXT
  )`)
})
const server = new http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
  }

  if (req.method === 'GET' && req.url === '/resources') {
    db.all('SELECT * FROM resources', [], (err, rows) => {
      if (err) {
        res.writeHead(500)
        return res.end(JSON.stringify({ error: err.message }))
      }
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
      return res.end(JSON.stringify(rows))
    })
    return
  }

  if (req.method === 'GET') {
    res.statusCode = 200
    return res.end()
  }

  if (req.url === '/register' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => (body += chunk.toString()))
    req.on('error', (err) => {
      console.error('Ошибка в потоке запроса:', err)
      res.statusCode = 400
      res.end()
    })
    req.on('end', () => {
      console.log('Регистрация:', body)
      const { username, email, password } = JSON.parse(body)
      const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`
      db.run(sql, [username, email, password], function (err) {
        if (err) {
          res.writeHead(500)
          return res.end(
            JSON.stringify({
              message: 'Ошибка: почта уже занята или данные неверны',
            }),
          )
        }

        res.writeHead(201, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            message: 'Пользователь успешно создан!',
            username: username,
            userId: this.lastID, // ID нового юзера из базы
          }),
        )
      })
    })
    return
  }

  if (req.url === '/login' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => (body += chunk.toString()))
    req.on('error', (err) => {
      console.error('Ошибка в потоке запроса:', err)
      res.statusCode = 400
      res.end()
    })
    req.on('end', () => {
      console.log('Логин:', body)
      const { email, password } = JSON.parse(body)
      const sql = `SELECT * FROM users WHERE email = ? AND password = ?`
      db.get(sql, [email, password], function (err, user) {
        if (err) {
          res.writeHead(500)
          return res.end(
            JSON.stringify({
              message: 'Ошибка сервера',
            }),
          )
        }

        if (!user) {
          res.writeHead(401)
          return res.end(
            JSON.stringify({ message: 'Неверный email или пароль' }),
          )
        }

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            message: 'Вход успешен!',
            username: user.username,
            userId: user.id,
          }),
        )
      })
    })
    return
  }

  res.statusCode = 404
  res.end(JSON.stringify({ message: 'Маршрут не найден' }))
})

server.listen(8000, 'localhost', () => {
  console.log('Сервер запущен!')
})
