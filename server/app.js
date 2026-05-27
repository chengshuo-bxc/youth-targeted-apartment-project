const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')
const roomRoutes = require('./routes/rooms')
const orderRoutes = require('./routes/orders')
const contractRoutes = require('./routes/contracts')
const paymentRoutes = require('./routes/payments')
const announcementRoutes = require('./routes/announcements')
const statsRoutes = require('./routes/stats')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/contracts', contractRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/announcements', announcementRoutes)
app.use('/api/stats', statsRoutes)

app.listen(process.env.PORT || 3000, () => {
  console.log(`服务已启动: http://localhost:${process.env.PORT || 3000}`)
})

module.exports = app
