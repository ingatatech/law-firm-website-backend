const prisma = require('../config/prismaClient')

// GET /api/articles
// Business rule (see BACKEND_ANALYSIS.md, section 6): the public endpoint
// must only return published articles. Drafts stay hidden from visitors.
async function getPublishedArticles(req, res) {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      include: { author: true, practiceArea: true }
    })
    res.json(articles)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load articles.' })
  }
}

// GET /api/articles/:slug
async function getArticleBySlug(req, res) {
  try {
    const { slug } = req.params
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { author: true, practiceArea: true }
    })

    // Also hide unpublished articles from the public detail route,
    // even if someone guesses the correct slug.
    if (!article || article.status !== 'published') {
      return res.status(404).json({ message: 'Article not found.' })
    }

    res.json(article)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load article.' })
  }
}

module.exports = { getPublishedArticles, getArticleBySlug }
