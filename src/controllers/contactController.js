const prisma = require('../config/prismaClient')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/contact-inquiries
async function createContactInquiry(req, res) {
  try {
    const { fullName, email, phone, subject, message } = req.body

    const errors = []
    if (!fullName || !fullName.trim()) errors.push('Full name is required.')
    if (!email || !EMAIL_REGEX.test(email)) errors.push('A valid email is required.')
    if (!subject || !subject.trim()) errors.push('Subject is required.')
    if (!message || !message.trim()) errors.push('Message is required.')

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed.', errors })
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim()
      }
    })

    res.status(201).json({
      message: 'Your message has been sent.',
      id: inquiry.id
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to send message.' })
  }
}

module.exports = { createContactInquiry }
