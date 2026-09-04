const express = require('express')
const cors = require('cors')
require('dotenv').config()

const connectDB = require('./config/db')

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.get('/', (req, res) => {
  res.send('ConnectPluse API is running')
})

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/posts', require('./routes/postRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
