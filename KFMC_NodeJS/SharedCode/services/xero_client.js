const xeroNode = require('xero-node')
const schemas = require('../models/schemas')
// const sql = require('./sql')
const n = require('./normalizer')
const constants = require('../constants')
const jwt = require('./jwt')


// let sql = null
const setSql = (sql) => {
    this.sql = sql
}
module.exports.setSql = setSql

const refreshToken = () => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            let myDb = process.env.DB_NAME
            const newToken = await this.xero.refreshToken()
            let ts = n.xeroDataNormalizer(constants.TOKENSET, {...newToken, user_id: this.userId, expires_in: newToken.expires_in})
            await this.sql.createOrUpdate(myDb, ts)
            await this.xero.setTokenSet(ts.tokenset)
            let response = {
                ts
            }
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
module.exports.refreshToken = refreshToken

const initalize = (userId, tokenSet = null, deleteOptions = null) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            this.userId = userId
            let myDb = process.env.DB_NAME
            this.xero = new xeroNode.XeroClient({
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            })

            let ts = tokenSet
            if(this.userId)
            {
                let qs = `select * from [${myDb}].[dbo].[${constants.TOKENSET}] where [UserId]='${this.userId}'`

                let result = await this.sql.execute(myDb, qs)
                let rows = result.recordset
                if(!rows.length) throw new Error('User unauthorized.')
                ts = new schemas[constants.TOKENSET](rows[0])
            }

            if(ts) this.userId = ts.UserId
            
            
            await this.xero.initialize()
            await this.xero.setTokenSet(ts.tokenset)
            if(ts.is_expired)
            {
                let response = await refreshToken()
                ts = response.ts
            }
            if(deleteOptions)
            {
                await this.xero.disconnect(deleteOptions.Id)
                await this.sql.execute(null, `drop database ${deleteOptions.DbName};`)
            }
            await this.xero.updateTenants()

            if(!this.userId)
            {
                let userDetails = jwt.getPayload(ts.tokenset.id_token)
                this.userId = userDetails.email
            }
            

            // for updating last Sync date of prev tenants
            let qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}] where [UserId]='${this.userId}'`
            let result = await this.sql.execute(myDb, qs)
            let myTenants  = result.recordset.map(x => new schemas[constants.TENANTS](x))

            let deleteTenants = []
            let newTenants = []

            let xeroTenants = this.xero.tenants

            if(!xeroTenants.length) deleteTenants.push(...myTenants)
            else {
                let xeroTenantIds = xeroTenants.map(x => x.tenantId)
                for(let myTenant of myTenants)
                {
                    if(!xeroTenantIds.includes(myTenant.TenantId)) deleteTenants.push(myTenant)
                }
            }

            if(!myTenants.length) newTenants.push(...xeroTenants)
            else {
                let myTenantIds = myTenants.map(x => x.TenantId)
                for(let xeroTenant of xeroTenants)
                {
                    if(!myTenantIds.includes(xeroTenant.tenantId)) newTenants.push(xeroTenant)
                }
            }

            if(newTenants.length)
            {
                newTenants = newTenants.map(x => n.xeroDataNormalizer(constants.TENANTS, {...x, user_id: this.userId, lastSyncDate: null, dbName: null, isActive: 1}))
                await this.sql.bulkInsert(myDb, newTenants)
            }

            if(deleteTenants.length) await this.sql.bulkDelete(myDb, deleteTenants, 'primary')
            
            if(!newTenants.length && !deleteTenants.length)
            {
                this.xero.MyTenants = myTenants
            }
            else {
                qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}] where [UserId]='${this.userId}'`
                result = await this.sql.execute(myDb, qs)
                this.xero.MyTenants  = result.recordset.map(x => new schemas[constants.TENANTS](x))
            }
            

            resolve(this.xero)
            return this.xero
        }
        catch(err)
        {
            reject(err)
            return err
        }
        
    })

    return promise
}

module.exports.initalize = initalize