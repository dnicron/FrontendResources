import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import pool from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

dotenv.config()
const SECRET_KEY = process.env.JWT_SECRET
const app = express()
const PORT = 8000

app.use(cors())
app.use(express.json())

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Токен недействителен или просрочен' })
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ error: 'Токен недействителен или просрочен' })
    }

    req.user = user

    next()
  })
}

app.get('/api/me', authenticateToken, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
  })
})

app.get('/resources', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resources ORDER BY id ASC')
    res.json(result.rows)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
})

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword],
    )
    res.status(201).json(newUser.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email],
    )
    if (userResult.rowCount === 0) {
      return res.status(400).json({ error: 'Такой почты нет' })
    }

    const user = userResult.rows[0]

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '7d' },
      )
      res.json({ message: 'Добро пожаловать!', username: user.username, token })
    } else {
      // Пароль не подошел
      res.status(401).json({ error: 'Неверный пароль' })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`)
})
