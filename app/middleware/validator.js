const validateReceipt = (req, res, next) => {
  const receipt = req.body

  // Check required fields
  if (!receipt.retailer || !receipt.purchaseDate || !receipt.purchaseTime ||
      !receipt.items || !receipt.total) {
    return res.status(400).json({ error: 'The receipt is invalid.' })
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(receipt.purchaseDate)) {
    return res.status(400).json({ error: 'Invalid purchase date format.' })
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
  if (!timeRegex.test(receipt.purchaseTime)) {
    return res.status(400).json({ error: 'Invalid purchase time format.' })
  }

  // Validate items array
  if (!Array.isArray(receipt.items) || receipt.items.length === 0) {
    return res.status(400).json({ error: 'Receipt must contain at least one item.' })
  }

  // Validate total format
  const totalRegex = /^\d+\.\d{2}$/
  if (!totalRegex.test(receipt.total)) {
    return res.status(400).json({ error: 'Invalid total format.' })
  }

  next()
}

module.exports = validateReceipt