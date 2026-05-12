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
    return res.status(401).json({ error: 'Токен отсутствует' })
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log('JWT Error:', err.message)
      return res
        .status(403)
        .json({ error: 'Токен недействителен или просрочен' })
    }

    if (!decoded.id) {
      console.log('JWT Payload Error: ID missing in token')
      return res.status(403).json({ error: 'Некорректный формат токена' })
    }

    req.user = decoded
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
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  let userId = null
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY)
      userId = decoded.id
    } catch (err) {
      console.log('JWT Verify error in /resources:', err.message)
      userId = null
    }
  }

  try {
    const query = `
      SELECT r.*,
      CASE WHEN f.user_id IS NOT NULL THEN true ELSE false END AS "isFavorite"
      FROM resources r
      LEFT JOIN favorites f ON r.id = f.resource_id AND f.user_id = $1
      ORDER BY r.id ASC
    `
    const result = await pool.query(query, [userId])
    res.json(result.rows)
  } catch (err) {
    console.error(err.message)
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
        { id: user.user_id, username: user.username },
        SECRET_KEY,
        { expiresIn: '7d' },
      )
      res.json({ message: 'Добро пожаловать!', username: user.username, token })
    } else {
      res.status(401).json({ error: 'Неверный пароль' })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/favorites/toggle', authenticateToken, async (req, res) => {
  const { resourceId } = req.body
  const userId = req.user.id

  if (!userId) {
    return res.status(401).json({ error: 'Пользователь не идентифицирован' })
  }

  try {
    const checkExist = await pool.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND resource_id = $2',
      [userId, resourceId],
    )

    if (checkExist.rows.length > 0) {
      await pool.query(
        'DELETE FROM favorites WHERE user_id = $1 AND resource_id = $2',
        [userId, resourceId],
      )
      res.json({ message: 'Removed', added: false })
    } else {
      await pool.query(
        'INSERT INTO favorites (user_id, resource_id) VALUES ($1, $2)',
        [userId, resourceId],
      )
      res.status(201).json({ message: 'Added', added: true })
    }
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

app.get('/api/favorites', authenticateToken, async (req, res) => {
  const userId = req.user.id

  try {
    const result = await pool.query(
      `SELECT r.* FROM resources r
             JOIN favorites f ON r.id = f.resource_id
             WHERE f.user_id = $1
             ORDER BY f.created_at DESC`,
      [userId],
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`)
})
