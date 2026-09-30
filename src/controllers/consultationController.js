const prisma = require('../config/prismaClient')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/consultation-requests
// Business rule (see BACKEND_ANALYSIS.md, section 6): this endpoint only
// ever creates a row with status "new". It must NEVER imply that
// representation has started — that is a human decision made later
// by an admin, not something this code decides.
async function createConsultationRequest(req, res) {
  try {
    const {
      fullName,
      phone,
      email,
      organization,
      practiceAreaId,
      preferredContactMethod,
      message
    } = req.body

    // Server-side validation. This is required even though the React
    // form also validates — a visitor could bypass the frontend and
    // send a request directly to this endpoint.
    const errors = []
    if (!fullName || !fullName.trim()) errors.push('Full name is required.')
    if (!phone || !phone.trim()) errors.push('Phone number is required.')
    if (!email || !EMAIL_REGEX.test(email)) errors.push('A valid email is required.')
    if (!practiceAreaId) errors.push('Practice area is required.')
    if (!message || !message.trim()) errors.push('Message is required.')

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors })
    }

    const practiceAreaIdNum = Number(practiceAreaId)
    const practiceArea = await prisma.practiceArea.findUnique({
      where: { id: practiceAreaIdNum }
    })

    if (!practiceArea) {
      return res.status(400).json({ message: 'Selected practice area does not exist.' })
    }

    const consultationRequest = await prisma.consultationRequest.create({
      data: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        organization: organization ? organization.trim() : null,
        practiceAreaId: practiceAreaIdNum,
        preferredContactMethod: preferredContactMethod || null,
        message: message.trim(),
        status: 'new'
      }
    })

    res.status(201).json({
      message: 'Your consultation request has been received.',
      id: consultationRequest.id
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to submit consultation request.' })
  }
}

module.exports = { createConsultationRequest }
