const { describe, test, expect } = require('@jest/globals')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Receipt Validation', () => {
  test('returns 400 when receipt is missing required fields', async () => {
    const invalidReceipt = {
      retailer: 'Target',
    }

    const response = await api
      .post('/receipts/process')
      .send(invalidReceipt)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toBeDefined()
  })

  test('returns 400 when date format is invalid', async () => {
    const invalidReceipt = {
      retailer: 'Target',
      purchaseDate: '01/01/2022', // Wrong format
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Item', price: '5.00' }],
      total: '5.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(invalidReceipt)
      .expect(400)

    expect(response.body.error).toBeDefined()
  })

  test('returns 400 when time format is invalid', async () => {
    const invalidReceipt = {
      retailer: 'Target',
      purchaseDate: '2022-01-01',
      purchaseTime: '1:01 PM', // Wrong format
      items: [{ shortDescription: 'Item', price: '5.00' }],
      total: '5.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(invalidReceipt)
      .expect(400)

    expect(response.body.error).toBeDefined()
  })

  test('returns 400 when items array is empty', async () => {
    const invalidReceipt = {
      retailer: 'Target',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [],
      total: '0.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(invalidReceipt)
      .expect(400)

    expect(response.body.error).toBeDefined()
  })

  test('returns 400 when total format is invalid', async () => {
    const invalidReceipt = {
      retailer: 'Target',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Item', price: '5.00' }],
      total: '5' // Missing decimal places
    }

    const response = await api
      .post('/receipts/process')
      .send(invalidReceipt)
      .expect(400)

    expect(response.body.error).toBeDefined()
  })
})