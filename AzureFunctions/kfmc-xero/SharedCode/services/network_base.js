const axios = require('axios')

module.exports.execute = (apiOptions) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            let getToken = await axios(apiOptions)
            let data = getToken.data
            let statusCode = getToken.status
            let res = {
                statusCode,
                data
            }
            resolve(res)
            return res
        }
        catch(err)
        {
            let error = err.response.data
            let statusCode = err.response.status
            let res = {
                statusCode,
                error
            }
            reject(res)
            return res
        }
    })

    return promise
}