const { describe, test, expect } = require('@jest/globals')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

describe('Points Calculation Rules', () => {
  test('awards points based on retailer name', async () => {
    const receipt = {
      retailer: 'Target',
      purchaseDate: '2025-03-16',
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Item', price: '5.00' }],
      total: '5.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    // 6 for retailer name + 50 for round dollar + 25 for multiple of 0.25
    const expectedPoints = 6 + 50 + 25
    expect(pointsResponse.body.points).toBe(expectedPoints)
  })

  test('awards 50 points for round dollar amounts', async () => {
    const receipt = {
      retailer: 'X',
      purchaseDate: '2025-03-16',
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Item', price: '5.00' }],
      total: '5.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    // 1 for retailer name + 50 for round dollar + 25 for multiple of 0.25
    const expectedPoints = 1 + 50 + 25
    expect(pointsResponse.body.points).toBe(expectedPoints)
  })

  test('awards 25 points for multiples of 0.25', async () => {
    const receipt = {
      retailer: 'X',
      purchaseDate: '2025-03-16',
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Item', price: '5.25' }],
      total: '5.25'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    // 1 for retailer name + 25 for multiple of 0.25
    const expectedPoints = 1 + 25
    expect(pointsResponse.body.points).toBe(expectedPoints)
  })

  test('awards 5 points for every two items', async () => {
    const receipt = {
      retailer: 'X',
      purchaseDate: '2025-03-16',
      purchaseTime: '13:01',
      items: [
        { shortDescription: 'Item 1', price: '1.00' },
        { shortDescription: 'Item 2', price: '1.00' },
        { shortDescription: 'Item 3', price: '1.00' },
        { shortDescription: 'Item 4', price: '1.00' }
      ],
      total: '4.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    // 1 for retailer name + 50 for round dollar + 25 for multiple of 0.25 + 10 for 4 items
    // + 4 points for item descriptions (each "Item N" is 6 chars, a multiple of 3)
    // Each item is $1.00, so 0.2 * $1.00 = 0.2, rounded up to 1 point per item
    const expectedPoints = 1 + 50 + 25 + 10 + (4 * 1)
    expect(pointsResponse.body.points).toBe(expectedPoints)
  })

  test('awards points for item descriptions with length multiple of 3', async () => {
    const receipt = {
      retailer: 'X',
      purchaseDate: '2025-03-16',
      purchaseTime: '13:01',
      items: [
        { shortDescription: 'ABC', price: '1.00' },
        { shortDescription: 'ABCDEF', price: '2.00' }
      ],
      total: '3.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    // 1 for retailer name + 50 for round dollar + 25 for multiple of 0.25 + 5 for 2 items + 1 for each item with length multiple of 3
    const expectedPoints = 1 + 50 + 25 + 5 + 1 + 1
    expect(pointsResponse.body.points).toBe(expectedPoints)
  })

  test('awards 6 points for odd purchase day', async () => {
    const receipt = {
      retailer: 'X',
      purchaseDate: '2025-03-17',
      purchaseTime: '13:01',
      items: [{ shortDescription: 'Item', price: '1.00' }],
      total: '1.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    // 1 for retailer + 50 for round dollar + 25 for multiple of 0.25 + 6 for odd day
    const expectedPoints = 1 + 50 + 25 + 6
    expect(pointsResponse.body.points).toBe(expectedPoints)
  })

  test('awards 10 points for purchase time between 2:00pm and 4:00pm', async () => {
    const receipt = {
      retailer: 'X',
      purchaseDate: '2025-03-16',
      purchaseTime: '14:30',
      items: [{ shortDescription: 'Item', price: '1.00' }],
      total: '1.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    // 1 for retailer name + 50 for round dollar + 25 for multiple of 0.25 + 10 for time between 2-4pm
    const expectedPoints = 1 + 50 + 25 + 10
    expect(pointsResponse.body.points).toBe(expectedPoints)
  })

  test('correctly calculates points for the example receipt', async () => {
    const receipt = {
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
        },
        {
          shortDescription: 'Knorr Creamy Chicken',
          price: '1.26'
        },
        {
          shortDescription: 'Doritos Nacho Cheese',
          price: '3.35'
        },
        {
          shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
          price: '12.00'
        }
      ],
      total: '35.35'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    expect(pointsResponse.body.points).toBe(28)
  })

  test('correctly calculates points for the second example receipt', async () => {
    const receipt = {
      retailer: 'M&M Corner Market',
      purchaseDate: '2022-03-20',
      purchaseTime: '14:33',
      items: [
        {
          shortDescription: 'Gatorade',
          price: '2.25'
        },
        {
          shortDescription: 'Gatorade',
          price: '2.25'
        },
        {
          shortDescription: 'Gatorade',
          price: '2.25'
        },
        {
          shortDescription: 'Gatorade',
          price: '2.25'
        }
      ],
      total: '9.00'
    }

    const response = await api
      .post('/receipts/process')
      .send(receipt)

    const pointsResponse = await api
      .get(`/receipts/${response.body.id}/points`)
      .expect(200)

    expect(pointsResponse.body.points).toBe(109)
  })
})