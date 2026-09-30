const prisma = require('../config/prismaClient')

// GET /api/attorneys
async function getAllAttorneys(req, res) {
  try {
    const attorneys = await prisma.attorney.findMany({
      orderBy: { fullName: 'asc' },
      include: { practiceAreas: true }
    })
    res.json(attorneys)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load attorneys.' })
  }
}

// GET /api/attorneys/:id
async function getAttorneyById(req, res) {
  try {
    const id = Number(req.params.id)

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid attorney id.' })
    }

    const attorney = await prisma.attorney.findUnique({
      where: { id },
      include: { practiceAreas: true }
    })

    if (!attorney) {
      return res.status(404).json({ message: 'Attorney not found.' })
    }

    res.json(attorney)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to load attorney.' })
  }
}

module.exports = { getAllAttorneys, getAttorneyById }
