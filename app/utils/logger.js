const getTimestamp = () => {
  return new Date().toISOString()
}

const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${getTimestamp()}] [INFO]`, ...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[${getTimestamp()}] [ERROR]`, ...params)
  }
}

module.exports = {
  info, error
}