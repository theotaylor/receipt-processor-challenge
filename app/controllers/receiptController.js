const receiptService = require('../services/receiptService')


const processReceipt = (req, res, next) => {
  try {
    const receiptId = receiptService.saveReceipt(req.body)
    res.json({ id: receiptId })
  } catch (error) {
    next(error)
  }
}

const getPoints = (req, res, next) => {
  try {
    const { id } = req.params
    const points = receiptService.getPoints(id)

    if (points === null) {
      return res.status(404).json({ error: 'No receipt found for that ID.' })
    }

    res.json({ points })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  processReceipt,
  getPoints
}
