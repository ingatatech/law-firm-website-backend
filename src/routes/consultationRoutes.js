const express = require('express')
const router = express.Router()
const { createConsultationRequest } = require('../controllers/consultationController')

router.post('/', createConsultationRequest)

module.exports = router
