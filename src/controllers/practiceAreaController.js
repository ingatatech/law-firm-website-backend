const prisma = require('../config/prismaClient')

// GET /api/practice-areas
async function getAllPracticeAreas(req, res) {
  try {
    const practiceAreas = await prisma.practiceArea.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(practiceAreas)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load practice areas.' })
  }
}

// GET /api/practice-areas/:slug
async function getPracticeAreaBySlug(req, res) {
  try {
    const { slug } = req.params
    const practiceArea = await prisma.practiceArea.findUnique({
      where: { slug },
      include: { attorneys: true }
    })

    if (!practiceArea) {
      return res.status(404).json({ message: 'Practice area not found.' })
    }

    res.json(practiceArea)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load practice area.' })
  }
}

module.exports = { getAllPracticeAreas, getPracticeAreaBySlug }
