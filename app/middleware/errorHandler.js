const logger = require('../utils/logger')

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error(err.message)
  logger.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  res.status(500).json({
    error: 'An unexpected error occurred.'
  })
}

module.exports = errorHandler