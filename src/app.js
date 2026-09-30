const express = require('express')
const cors = require('cors')
require('dotenv').config()

const practiceAreaRoutes = require('./routes/practiceAreaRoutes')
const attorneyRoutes = require('./routes/attorneyRoutes')
const articleRoutes = require('./routes/articleRoutes')
const faqRoutes = require('./routes/faqRoutes')
const consultationRoutes = require('./routes/consultationRoutes')
const contactRoutes = require('./routes/contactRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

app.use(cors())
app.use(express.json())

// Public + auth routes (built and working)
app.use('/api/practice-areas', practiceAreaRoutes)
app.use('/api/attorneys', attorneyRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/faqs', faqRoutes)
app.use('/api/consultation-requests', consultationRoutes)
app.use('/api/contact-inquiries', contactRoutes)
app.use('/api/auth', authRoutes)

// Simple health check — useful to confirm the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

// TODO (Phase 2, not built yet — see BACKEND_ANALYSIS.md section 4.2):
// admin CRUD routes for managing practice areas, attorneys, articles,
// FAQs, and viewing/updating consultation requests. These all need the
// requireAuth middleware from src/middleware/requireAuth.js.

// 404 handler — must be the last route registered
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

module.exports = app
