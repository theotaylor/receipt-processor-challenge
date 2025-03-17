const { describe, test, expect, beforeAll } = require('@jest/globals')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Points Retrieval', () => {
  let receiptId

  // Setup: create a receipt to test with
  beforeAll(async () => {
    const validReceipt = {
      retailer: 'Target',
      purchaseDate: '2022-01-01',
      purchaseTime: '13:01',
      items: [
        { shortDescription: 'Mountain Dew 12PK', price: '6.49' },
        { shortDescription: 'Emils Cheese Pizza', price: '12.25' }
      ],
      total: '18.74'
    }

    const response = await api
      .post('/receipts/process')
      .send(validReceipt)

    receiptId = response.body.id
  })

  test('returns correct points for a valid receipt ID', async () => {
    const response = await api
      .get(`/receipts/${receiptId}/points`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.points).toBeDefined()
    expect(typeof response.body.points).toBe('number')

    // Calculate expected points manually
    // 6 points for "Target" (6 alphanumeric chars)
    // 0 points for total (not a round dollar amount)
    // 0 points for total (not a multiple of 0.25 - 18.74)
    // 5 points for 2 items
    // 3 points for item descriptions (Mountain Dew 12PK = 15 chars = multiple of 3)
    // 6 points for odd purchase day (1st)
    // 0 points for purchase time (not between 2-4pm)
    const expectedPoints = 6 + 0 + 0 + 5 + 3 + 6 + 0  // = 20
    expect(response.body.points).toBe(expectedPoints)
  })

  test('returns 404 for non-existent receipt ID', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'

    const response = await api
      .get(`/receipts/${nonExistentId}/points`)
      .expect(404)

    expect(response.body.error).toBeDefined()
  })

  test('returns 404 for invalid receipt ID format', async () => {
    const invalidId = 'not-a-valid-id'

    const response = await api
      .get(`/receipts/${invalidId}/points`)
      .expect(404)

    expect(response.body.error).toBeDefined()
  })
})