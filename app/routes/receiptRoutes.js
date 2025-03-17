const express = require('express')
const receiptController = require('../controllers/receiptController')
const validateReceipt = require('../middleware/validator')

const router = express.Router()

/**
 * @swagger
 * /receipts/process:
 *   post:
 *     summary: Submits a receipt for processing.
 *     description: Submits a receipt for processing.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - retailer
 *               - purchaseDate
 *               - purchaseTime
 *               - items
 *               - total
 *             properties:
 *               retailer:
 *                 description: The name of the retailer or store the receipt is from.
 *                 type: string
 *                 pattern: "^[\\w\\s\\-&]+$"
 *                 example: "M&M Corner Market"
 *               purchaseDate:
 *                 description: The date of the purchase printed on the receipt.
 *                 type: string
 *                 format: date
 *                 example: "2022-01-01"
 *               purchaseTime:
 *                 description: The time of the purchase printed on the receipt. 24-hour time expected.
 *                 type: string
 *                 format: time
 *                 example: "13:01"
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - shortDescription
 *                     - price
 *                   properties:
 *                     shortDescription:
 *                       description: The Short Product Description for the item.
 *                       type: string
 *                       pattern: "^[\\w\\s\\-]+$"
 *                       example: "Mountain Dew 12PK"
 *                     price:
 *                       description: The total price payed for this item.
 *                       type: string
 *                       pattern: "^\\d+\\.\\d{2}$"
 *                       example: "6.49"
 *               total:
 *                 description: The total amount paid on the receipt.
 *                 type: string
 *                 pattern: "^\\d+\\.\\d{2}$"
 *                 example: "6.49"
 *     responses:
 *       200:
 *         description: Returns the ID assigned to the receipt.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   pattern: "^\\S+$"
 *                   example: adb6b560-0eef-42bc-9d16-df48f30e89b2
 *       400:
 *         description: The receipt is invalid.
 */
router.post('/process', validateReceipt, receiptController.processReceipt)

/**
 * @swagger
 * /receipts/{id}/points:
 *   get:
 *     summary: Returns the points awarded for the receipt.
 *     description: Returns the points awarded for the receipt.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the receipt.
 *         schema:
 *           type: string
 *           pattern: "^\\S+$"
 *     responses:
 *       200:
 *         description: The number of points awarded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 points:
 *                   type: integer
 *                   format: int64
 *                   example: 100
 *       404:
 *         description: No receipt found for that ID.
 */
router.get('/:id/points', receiptController.getPoints)

module.exports = router