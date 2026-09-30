const express = require('express')
const router = express.Router()
const { getPublishedArticles, getArticleBySlug } = require('../controllers/articleController')

router.get('/', getPublishedArticles)
router.get('/:slug', getArticleBySlug)

module.exports = router
