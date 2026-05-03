import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('./frontend_resources.db')

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) console.error('Ошибка при создании таблицы:', err.message)
      else console.log('Таблица users готова!')
    },
  )
})

db.close()
