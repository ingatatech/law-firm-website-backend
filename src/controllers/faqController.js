const prisma = require('../config/prismaClient')

// GET /api/faqs
async function getAllFaqs(req, res) {
  try {
    const faqs = await prisma.faq.findMany({
      orderBy: { orderIndex: 'asc' }
    })
    res.json(faqs)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load FAQs.' })
  }
}

module.exports = { getAllFaqs }
