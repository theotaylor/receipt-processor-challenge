const calculatePoints = (receipt) => {
  let points = 0

  // Rule 1: One point per alphanumeric character in retailer name
  points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length

  // Rule 2: 50 points if total is a whole number
  if (Number(receipt.total) % 1 === 0) points += 50

  // Rule 3: 25 points if total is a multiple of 0.25
  if (Number(receipt.total) % 0.25 === 0) points += 25

  // Rule 4: 5 points per pair of items
  points += Math.floor(receipt.items.length / 2) * 5

  // Rule 5: Points based on item description length being multiple of 3
  receipt.items.forEach(item => {
    const trimmedDesc = item.shortDescription.trim()
    if (trimmedDesc.length % 3 === 0) {
      points += Math.ceil(Number(item.price) * 0.2)
    }
  })

  // Rule 6: 6 points if purchase day is odd
  const day = Number(receipt.purchaseDate.split('-')[2])
  if (day % 2 !== 0) points += 6

  // Rule 7: 10 points if purchase time is between 2:00pm and 4:00pm
  const [hour] = receipt.purchaseTime.split(':').map(Number)
  if (hour >= 14 && hour < 16) points += 10

  return points
}

module.exports = { calculatePoints }