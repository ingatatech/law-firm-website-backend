const express = require('express')
const router = express.Router()
const { getAllAttorneys, getAttorneyById } = require('../controllers/attorneyController')

router.get('/', getAllAttorneys)
router.get('/:id', getAttorneyById)

module.exports = router
