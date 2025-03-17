# Receipt Processor Challenge

This is an API built with Node.js and Express to process receipts and calculate receipt points for the Fetch Rewards receipt processor challenge found here: https://github.com/fetch-rewards/receipt-processor-challenge/tree/main

## Table of Contents
- [Overview](#overview)
- [API Specification](#api-specification)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)

## Overview

This service provides two main endpoints:
1. Process a receipt, calculate points, and generate a unique ID 
2. Retrieve the points for a processed receipt using its ID

The points are calculated based on specific rules defined in the challenge requirements.

## API Specification

### Process Receipt
- **Endpoint**: `/receipts/process`
- **Method**: POST
- **Payload**: Receipt JSON
- **Response**: JSON containing an ID for the receipt
- **Example Response**: `{ "id": "206fe90a-1d8b-4ded-ae0b-1e7ed1242140" }`

### Get Points
- **Endpoint**: `/receipts/{id}/points`
- **Method**: GET
- **Response**: JSON containing the number of points awarded
- **Example Response**: `{ "points": 13 }`

Additional endpoint documentation can be found in the swagger documentation at http://localhost:3000/api-docs once the server is running.

## Installation 

### Installation with Docker

1. Clone the repository with:
```
git clone https://github.com/theotaylor/receipt-processor-challenge.git
```
2. Within the cloned repository, build the Docker image with:
```
docker build -t receipt-processor .
```
3. Run the Docker container with:
```
docker run -p 3000:3000 receipt-processor
```

### Installation without Docker

1. Clone the repository with:
```
git clone https://github.com/theotaylor/receipt-processor-challenge.git
```
2. Install the dependencies with:
```
npm install
```
3. Start the server with:
```
npm start
```

## Usage

Use the API with Postman, curl, or your preferred method. The API will be available at http://localhost:3000.

## Example Request

### Process Receipt 

POST http://localhost:3000/receipts/process
```
{
  "retailer": "Target",
  "purchaseDate": "2022-01-01",
  "purchaseTime": "13:01",
  "items": [
    {
      "shortDescription": "Mountain Dew 12PK",
      "price": "6.49"
    },{
      "shortDescription": "Emils Cheese Pizza",
      "price": "12.25"
    },{
      "shortDescription": "Knorr Creamy Chicken",
      "price": "1.26"
    },{
      "shortDescription": "Doritos Nacho Cheese",
      "price": "3.35"
    },{
      "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
      "price": "12.00"
    }
  ],
  "total": "35.35"
}
```

### Get Points
```
GET http://localhost:3000/receipts/{id}/points will return:
{
  "points": 28
}
```










