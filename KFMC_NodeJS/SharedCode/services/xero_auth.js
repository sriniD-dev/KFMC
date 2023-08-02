
const qs = require('query-string')
const jwt = require('./jwt')
const base = require('./network_base')
// const sql = require('./sql')
const n = require('./normalizer')
const constants = require('../constants')


// let sql = null
const setSql = (sql) => {
    this.sql = sql
}
module.exports.setSql = setSql

module.exports.storeToken = (code) => {
    const promise = new Promise(async (resolve, reject) => {

        try{
            let clientId = process.env.CLIENT_ID
            let clientSecret = process.env.CLIENT_SECRET
            let redirectUri = process.env.REDIRECT_URI

            let base64String = Buffer.from([clientId, clientSecret].join(':')).toString('base64')

            let data = {
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri
            }
            let getTokenOptions = {
                method: 'POST',
                headers: { 'Authorization': `Basic ${base64String}`, 'content-type': 'application/x-www-form-urlencoded' },
                data: qs.stringify(data),
                url: 'https://identity.xero.com/connect/token'
            }
            
            let res = await base.execute(getTokenOptions)
            let tokenset = res.data

            //let accessToken = tokenset && tokenset.access_token ? tokenset.access_token || '' : ''
            let idToken = tokenset && tokenset.id_token ? tokenset.id_token || '' : ''

            //let details = jwt.getPayload(accessToken)
            let userDetails = jwt.getPayload(idToken)
            
            let ts = n.xeroDataNormalizer(constants.TOKENSET, {user_id: userDetails.email, ...tokenset})

            let myDb = process.env.DB_NAME
            // await xeroClient.initalize(tokenset)
            let result = await this.sql.createOrUpdate(myDb,ts)

            let response = {result, userDetails}
            resolve(response)
            return response

        }
        catch(err)
        {
            reject(err)
            return err
        }
        
    })

    return promise
}
