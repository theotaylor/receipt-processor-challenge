const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Receipt Processor API',
      version: '1.0.0',
      description: 'API for processing receipts and calculating points',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./app/routes/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
}