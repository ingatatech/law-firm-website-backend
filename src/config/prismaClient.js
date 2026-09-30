// One shared database connection, reused everywhere in the app.
// Never create a new PrismaClient() inside a controller — always import this file.
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma
