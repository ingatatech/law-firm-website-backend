const express = require('express')
const router = express.Router()
const {
  getAllPracticeAreas,
  getPracticeAreaBySlug
} = require('../controllers/practiceAreaController')

router.get('/', getAllPracticeAreas)
router.get('/:slug', getPracticeAreaBySlug)

module.exports = router
