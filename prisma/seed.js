// Run with: node prisma/seed.js
require('dotenv').config()

const bcrypt = require('bcrypt')
const prisma = require('../src/config/prismaClient')

async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example-law.rw' },
    update: {},
    create: {
      fullName: 'Vincent Habayimana',
      email: 'admin@example-law.rw',
      passwordHash,
      role: 'admin'
    }
  })
  console.log('Admin user ready:', admin.email, '(password: ChangeMe123!)')

  // ---- Practice Areas ----
  const practiceAreaData = [
    {
      name: 'Corporate & Commercial Law',
      slug: 'corporate-commercial',
      headline: 'Legal Support for Your Business',
      description:
        'We support businesses and organizations with commercial transactions, contracts, corporate governance, and business structures.'
    },
    {
      name: 'Litigation & Dispute Resolution',
      slug: 'litigation',
      headline: 'Strategic Representation When Disputes Arise',
      description:
        'Legal representation and dispute-resolution services for civil, commercial, and other approved matters.'
    },
    {
      name: 'Employment & Labour Law',
      slug: 'employment',
      headline: 'Practical Legal Support for Employment Matters',
      description:
        'Assistance for employers and employees with applicable employment-related legal matters.'
    },
    {
      name: 'Family Law',
      slug: 'family-law',
      headline: 'Professional Guidance Through Important Family Matters',
      description: 'Legal support for approved family-related matters.'
    },
    {
      name: 'Real Estate & Property Law',
      slug: 'real-estate',
      headline: 'Legal Guidance for Property Matters',
      description: 'Legal services relating to property transactions, ownership, and development.'
    },
    {
      name: 'Intellectual Property',
      slug: 'intellectual-property',
      headline: 'Protecting Your Intellectual Assets',
      description: 'Protection, management, and enforcement of intellectual-property rights.'
    }
  ]

  const practiceAreas = {}
  for (const area of practiceAreaData) {
    const saved = await prisma.practiceArea.upsert({
      where: { slug: area.slug },
      update: {},
      create: area
    })
    practiceAreas[area.slug] = saved
    console.log('Practice area ready:', saved.name)
  }

  // ---- Attorneys ----
  const attorneyData = [
    {
      fullName: 'Grace Uwimana',
      title: 'Senior Partner',
      bio: "Grace leads the firm's corporate practice, advising businesses across East Africa on transactions and governance.",
      education: 'LLB, University of Rwanda — LLM, University of Cape Town',
      barAdmission: 'Rwanda Bar Association',
      email: 'g.uwimana@example-law.rw',
      practiceAreaSlugs: ['corporate-commercial', 'intellectual-property']
    },
    {
      fullName: 'Eric Nshimiyimana',
      title: 'Partner, Litigation',
      bio: 'Eric represents clients in commercial and civil disputes, with a focus on arbitration and mediation.',
      education: 'LLB, University of Rwanda',
      barAdmission: 'Rwanda Bar Association',
      email: 'e.nshimiyimana@example-law.rw',
      practiceAreaSlugs: ['litigation']
    },
    {
      fullName: 'Diane Mukamana',
      title: 'Associate',
      bio: 'Diane advises on employment and family law matters, working closely with individual and corporate clients.',
      education: 'LLB, Kigali Independent University',
      barAdmission: 'Rwanda Bar Association',
      email: 'd.mukamana@example-law.rw',
      practiceAreaSlugs: ['employment', 'family-law']
    }
  ]

  const attorneys = {}
for (const data of attorneyData) {
  const { practiceAreaSlugs, ...attorneyFields } = data

  // Attorney.email has no @unique constraint in the schema, so upsert()
  // can't use it in `where`. Check manually instead, same pattern as FAQs below.
  let saved = await prisma.attorney.findFirst({ where: { email: attorneyFields.email } })

  if (!saved) {
    saved = await prisma.attorney.create({
      data: {
        ...attorneyFields,
        practiceAreas: {
          connect: practiceAreaSlugs.map((slug) => ({ id: practiceAreas[slug].id }))
        }
      }
    })
    console.log('Attorney ready:', saved.fullName)
  } else {
    console.log('Attorney already exists:', saved.fullName)
  }

  attorneys[saved.email] = saved
}

  // ---- Articles ----
  const articleData = [
    {
      title: 'What to Expect During an Initial Legal Consultation',
      slug: 'initial-legal-consultation',
      summary: 'A plain-language guide to what happens when you first contact a law firm.',
      content:
        'When you reach out for a first consultation, the firm reviews your inquiry, checks for any conflicts of interest, and, where appropriate, arranges a meeting to discuss your matter in more detail. This initial step does not by itself create a lawyer-client relationship.',
      authorEmail: 'g.uwimana@example-law.rw',
      practiceAreaSlug: 'corporate-commercial',
      status: 'published',
      publishedAt: new Date('2026-06-01')
    },
    {
      title: 'Understanding Commercial Contract Basics',
      slug: 'commercial-contract-basics',
      summary: 'Key terms every business owner should understand before signing a contract.',
      content:
        'A commercial contract sets out the rights and obligations of each party. Before signing, it is worth understanding key terms such as consideration, termination clauses, and dispute-resolution mechanisms.',
      authorEmail: 'g.uwimana@example-law.rw',
      practiceAreaSlug: 'corporate-commercial',
      status: 'published',
      publishedAt: new Date('2026-05-15')
    },
    {
      title: 'Employment Contracts: What Employees Should Know',
      slug: 'employment-contracts-basics',
      summary: 'A short guide to reading and understanding your employment contract.',
      content:
        'Your employment contract should clearly state your role, compensation, working hours, and termination conditions. If any of these are unclear, it is worth seeking clarification before signing.',
      authorEmail: 'd.mukamana@example-law.rw',
      practiceAreaSlug: 'employment',
      status: 'published',
      publishedAt: new Date('2026-04-22')
    }
  ]

  for (const data of articleData) {
    const { authorEmail, practiceAreaSlug, ...articleFields } = data
    const saved = await prisma.article.upsert({
      where: { slug: articleFields.slug },
      update: {},
      create: {
        ...articleFields,
        authorId: attorneys[authorEmail].id,
        practiceAreaId: practiceAreas[practiceAreaSlug].id
      }
    })
    console.log('Article ready:', saved.title)
  }

  // ---- FAQs ----
  const faqData = [
    {
      question: 'What areas of law does the firm handle?',
      answer:
        'We handle Corporate & Commercial Law, Litigation & Dispute Resolution, Employment Law, Family Law, Real Estate Law, and Intellectual Property. See our Practice Areas page for details.',
      orderIndex: 1
    },
    {
      question: 'How can I request a consultation?',
      answer:
        'Use the "Request a Consultation" form on our website, or contact us directly by phone or email. A member of our team will review your request.',
      orderIndex: 2
    },
    {
      question: 'Does submitting an inquiry create a lawyer-client relationship?',
      answer:
        'No. Submitting an inquiry or consultation request does not by itself establish a lawyer-client relationship. Representation begins only once the firm formally agrees to act for you.',
      orderIndex: 3
    },
    {
      question: 'How are legal fees determined?',
      answer: 'Fees depend on the nature and complexity of your matter. This is discussed and agreed upon during your initial consultation.',
      orderIndex: 4
    },
    {
      question: 'Where is the firm located?',
      answer: 'Our office is in Kigali, Rwanda. See our Contact page for the full address and map.',
      orderIndex: 5
    }
  ]

  for (const faq of faqData) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } })
    if (!existing) {
      const saved = await prisma.faq.create({ data: faq })
      console.log('FAQ ready:', saved.question)
    } else {
      console.log('FAQ already exists:', faq.question)
    }
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })