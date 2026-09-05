const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')

const app = express()
const cors = require('cors');

// CORS configuration ko strong banao
app.use(cors({
  origin: 'https://project-one-pi-26.vercel.app', // Ya chahe toh '*' bhi kar sakte ho sabke liye
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Preflight requests ke liye ye sabse zaroori hai
app.options('*', cors());

app.use(express.json())

connectDB()

app.get('/', (req, res) => {
  res.send('ConnectPluse API is running')
})

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

module.exports = app