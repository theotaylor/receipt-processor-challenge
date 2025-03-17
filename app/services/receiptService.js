const { v4: uuidv4 } = require('uuid')
const pointsCalculator = require('./pointsCalculator')

// In memory storage
const receipts = {}

const saveReceipt = (receipt) => {
  const receiptId = uuidv4()
  const points = pointsCalculator.calculatePoints(receipt)
  receipts[receiptId] = { receipt, points }
  return receiptId
}

const getReceiptById = (id) => {
  return receipts[id]
}

const calculatePoints = (receipt) => {
  return pointsCalculator.calculatePoints(receipt)
}

const getPoints = (id) => {
  const data = receipts[id]
  return data ? data.points : null
}

module.exports = {
  saveReceipt,
  getReceiptById,
  calculatePoints,
  getPoints
}
