const { describe, test, expect } = require('@jest/globals')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Receipt Processing', () => {
  test('successfully processes a valid receipt', async () => {
    const validReceipt = {
      retailer: 'Target',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [
        {
          shortDescription: 'Mountain Dew 12PK',
          price: '6.49'
        },
        {
          shortDescription: 'Emils Cheese Pizza',
          price: '12.25'
        }
      ],
      total: '18.74'
    }

    const response = await api
      .post('/receipts/process')
      .send(validReceipt)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.id).toBeDefined()
    expect(typeof response.body.id).toBe('string')
    expect(response.body.id.length).toBeGreaterThan(0)
  })

  test('returns different IDs for different receipts', async () => {
    const receipt1 = {
      retailer: 'Target',
      purchaseDate: '2022-01-02',
      purchaseTime: '13:13',
      items: [{ shortDescription: 'Dasani', price: '1.40' }],
      total: '1.40'
    }

    const receipt2 = {
      retailer: 'Walmart',
      purchaseDate: '2022-01-02',
      purchaseTime: '08:03',
      items: [{ shortDescription: 'Pepsi - 12-oz', price: '1.25' }],
      total: '1.25'
    }

    const response1 = await api
      .post('/receipts/process')
      .send(receipt1)
      .expect(200)

    const response2 = await api
      .post('/receipts/process')
      .send(receipt2)
      .expect(200)

    expect(response1.body.id).not.toBe(response2.body.id)
  })
})