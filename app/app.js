const express = require('express')
const receiptRoutes = require('./routes/receiptRoutes')
const errorHandler = require('./middleware/errorHandler')
const requestLogger = require('./middleware/requestLogger')
const unknownEndpoint = require('./middleware/unknownEndpoint')
const swagger = require('../swagger')

const app = express()

// Middleware
app.use(express.json())
app.use(requestLogger)

// Swagger documentation
app.use('/api-docs', swagger.serve, swagger.setup)

// Routes
app.use('/receipts', receiptRoutes)

// Error handling middleware
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app