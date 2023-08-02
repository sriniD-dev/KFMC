const jwt = require('jsonwebtoken')

module.exports.getPayload = (token) => {
    let decoded = jwt.decode(token, {complete: true})
    return decoded.payload || {}
}