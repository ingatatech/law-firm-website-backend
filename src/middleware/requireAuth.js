const jwt = require('jsonwebtoken')

// Protects any route it's attached to. Checks for a valid JWT token
// in the Authorization header before letting the request continue.
// See BACKEND_ANALYSIS.md section 5 for the full login flow this connects to.
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload // { userId, role }
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

module.exports = requireAuth
