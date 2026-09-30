const express = require('express')
const router = express.Router()
const { createContactInquiry } = require('../controllers/contactController')

router.post('/', createContactInquiry)

module.exports = router
