
const getErrorMessage = (err) => {
    return err.error ? JSON.stringify(err.error) : err.message || 'Server Error'
}

const storeToken = (req) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            const xeroAuth = require('./services/xero_auth')
            const xeroClient = require('./services/xero_client')
            const moment = require('moment')
            const sql = require('./services/sql')

            xeroAuth.setSql(sql)
            xeroClient.setSql(sql)

            let reqBody = req.body

            let r = await xeroAuth.storeToken(reqBody.xero_code)
            let userId = r.userDetails.email
            let xero = await xeroClient.initalize(userId)

            for(let t of xero.MyTenants)
            {
                if(!t.DbName)
                {
                    let name = t.OrgData_Name || t.OrgData_LegalName || t.TenantName
                    let dbIdentifier = name.split(' ')
                    dbIdentifier = dbIdentifier[0]
                    let dbName = `${dbIdentifier}_${t.OrgData_CountryCode}_${moment.utc(t.OrgData_CreatedDateUTC).format('YYYYMMDDHHmmss')}`
                    await sql.createDb(dbName)
                    t.DbName = dbName
                    await sql.update(process.env.DB_NAME, t)
                }
            }

            await sql.closeAll()

            let res = {
                statusCode: 200,
                body: 'Token stored.'
            }
            resolve(res)
            return res
        }
        catch(err)
        {
            let res = {
                status: err.statusCode || 500,
                body: getErrorMessage(err)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.storeToken = storeToken

const fetchByUserId = (req) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            const xeroClient = require('./services/xero_client')
            const xeroApi = require('./services/xero_api')
            const sql = require('./services/sql')
            const constants = require('./constants')

            xeroClient.setSql(sql)
            xeroApi.setSql(sql)
            xeroApi.setXeroClient(xeroClient)

            let reqBody = req.body

            let userId = reqBody.user_id
            let xero = await xeroClient.initalize(userId)
            let myDb = process.env.DB_NAME

            let rTenants = []
            for(let t of xero.MyTenants)
            {
                let options = {
                    tenantId: t.TenantId,
                    dbName: t.DbName,
                    modules: reqBody.modules || ['all'],
                    userId: userId
                }
                let stats = await xeroApi.fetchAllData(options)
                t.LastSyncDate = new Date()
                await sql.update(process.env.DB_NAME, t)

                let qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}] where [TenantId]='${t.TenantId}'`
                let result = await sql.execute(myDb, qs)
                let rTenant = result.recordset[0]
                if(rTenant)
                {
                    rTenant.Stats = stats
                    rTenants.push(rTenant)
                }
            }
            await sql.closeAll()
            let res = {
                statusCode: 200,
                body: JSON.stringify({tenants: rTenants})
            }
            resolve(res)
            return res 
        }
        catch(err)
        {
            let res = {
                status: err.statusCode || 500,
                body: getErrorMessage(err)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.fetchByUserId = fetchByUserId

const fetchByTenantId = (req) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            const xeroClient = require('./services/xero_client')
            const xeroApi = require('./services/xero_api')
            const sql = require('./services/sql')
            const constants = require('./constants')

            xeroClient.setSql(sql)
            xeroApi.setSql(sql)
            xeroApi.setXeroClient(xeroClient)

            let reqBody = req.body

            let myDb = process.env.DB_NAME

            let tenantId = reqBody.tenant_id
            let qs = `select [UserId] from [${myDb}].[dbo].[${constants.TENANTS}] where [TenantId]='${tenantId}'`
            let result = await sql.execute(myDb, qs)
            let rows = result.recordset
            if(!rows.length) throw new Error('Tenant ID not found.')
            let userId = rows[0].UserId
            let xero = await xeroClient.initalize(userId)

            let t = xero.MyTenants.find(x => x.TenantId === tenantId)
            if(!t) throw new Error('Tenant authorisation is revoked.')
            

            let options = {
                tenantId: t.TenantId,
                dbName: t.DbName,
                modules: reqBody.modules || ['all'],
                userId: userId
            }
            let stats = await xeroApi.fetchAllData(options)
            t.LastSyncDate = new Date()
            await sql.update(process.env.DB_NAME, t)

            qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}] where [TenantId]='${tenantId}'`
            result = await sql.execute(myDb, qs)
            let rTenant = result.recordset[0]
            if(rTenant)
            {
                rTenant.Stats = stats
            }

            await sql.closeAll()

            let res = {
                statusCode: 200,
                body: JSON.stringify({tenant: rTenant})
            }
            resolve(res)
            return res 
        }
        catch(err)
        {
            console.log('fetchByTenantId err:',err)
            let res = {
                status: err.statusCode || 500,
                body: getErrorMessage(err)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.fetchByTenantId = fetchByTenantId

const getTenants = (req) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            const sql = require('./services/sql')
            const constants = require('./constants')
            let myDb = process.env.DB_NAME

            let reqBody = req.body
            let qs = ''
            if (reqBody.user_type == 'admin') qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}]`
            else if (reqBody.user_type == 'user') qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}] where [UserId]='${reqBody.user_id || ''}'`
            let res = null
            if(!qs)
            {
                res = {
                    statusCode: 200,
                    body: 'User Type not available.'
                }
                resolve(res)
                return res
            }
            let result = await sql.execute(myDb, qs)
            let rows = result.recordset

            await sql.closeAll()

            res = {
                statusCode: 200,
                body: JSON.stringify(rows)
            }
            resolve(res)
            return res
        }
        catch(err)
        {
            let res = {
                status: err.statusCode || 500,
                body: JSON.stringify(err.error||err.message)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.getTenants = getTenants

const validateUser = (req) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            const moment = require('moment')
            const sql = require('./services/sql')
            const constants = require('./constants')
            const jwt = require('./services/jwt')
            let myDb = process.env.DB_NAME
            
            let reqBody = req.body
            let qs = `select [UserId], [IdToken] from [${myDb}].[dbo].[${constants.TOKENSET}]`
            let result = await sql.execute(myDb, qs)
            let rows = result.recordset.map(x => {
                x.User = jwt.getPayload(x.IdToken)
                delete x.IdToken
                return x
            })

            let res = {
                statusCode: 200
            }
            let loggedIn = rows.filter(x => reqBody.email == x.User.email)
            if(!loggedIn.length)
            {
                res.body = 'INVALID_EMAIL'
                resolve(res)
                return res
            }
            loggedIn = loggedIn.filter(x => reqBody.password.toLowerCase() == `${x.User.given_name.toLowerCase()}@${moment().format('YYYY')}`)
            res.body = loggedIn.length ? loggedIn[0].UserId : 'INVALID_PASSWORD'
            
            await sql.closeAll()

            resolve(res)
            return res
            
        }
        catch(err)
        {
            let res = {
                status: err.statusCode || 500,
                body: getErrorMessage(err)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.validateUser = validateUser

const deleteTenant = (req) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            const xeroClient = require('./services/xero_client')
            const sql = require('./services/sql')
            const constants = require('./constants')

            xeroClient.setSql(sql)

            let myDb = process.env.DB_NAME

            let reqBody = req.body

            let tenantId = reqBody.tenant_id
            let qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}] where [TenantId]='${tenantId}'`
            let result = await sql.execute(myDb, qs)
            let rows = result.recordset
            if(!rows.length) throw new Error('Tenant ID not found.')
            let tenant = rows[0]
            let userId = tenant.UserId
            await xeroClient.initalize(userId, null, {
                Id: tenant.Id,
                DbName: tenant.DbName
            })

            await sql.closeAll()

            let res = {
                statusCode: 200,
                body: 'DELETED'
            }
            resolve(res)
            return res
        }
        catch(err)
        {
            let res = {
                status: err.statusCode || 500,
                body: getErrorMessage(err)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.deleteTenant = deleteTenant

const patch = (req) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            const xeroClient = require('./services/xero_client')
            const xeroApi = require('./services/xero_api')
            const sql = require('./services/sql')
            const constants = require('./constants')
            const jwt = require('./services/jwt')

            xeroClient.setSql(sql)
            xeroApi.setSql(sql)
            xeroApi.setXeroClient(xeroClient)

            let reqBody = req.body

            let myDb = process.env.DB_NAME

            /*
            let tenantId = reqBody.tenant_id
            let qs = `select * from [${myDb}].[dbo].[${constants.TENANTS}] where [TenantId]='${tenantId}'`
            let result = await sql.execute(myDb, qs)
            let rows = result.recordset
            if(!rows.length) throw new Error('Tenant ID not found.')
            let tenant = rows[0]
            let userId = tenant.UserId
            */
            let userId = reqBody.user_id
            let qs = `select * from [${myDb}].[dbo].[${constants.TOKENSET}] where [UserId]='${userId}'`
            let result = await sql.execute(myDb, qs)
            let user = result.recordset[0]

            console.log('user:', user)

            let idToken = user.IdToken
            let userDetails = jwt.getPayload(idToken)
            console.log('userDetails:',userDetails)
            let accessToken = user.AccessToken
            let details = jwt.getPayload(accessToken)
            console.log('details:',details)
            
            await sql.closeAll()

            let res = {
                statusCode: 200,
                body: 'Patch is done.'
            }
            resolve(res)
            return res 
        }
        catch(err)
        {
            console.log('fetchByTenantId err:',err)
            let res = {
                status: err.statusCode || 500,
                body: getErrorMessage(err)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.patch = patch

const cronScheduler = () => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            const xeroClient = require('./services/xero_client')
            const xeroApi = require('./services/xero_api')
            const sql = require('./services/sql')
            const constants = require('./constants')
            
            xeroClient.setSql(sql)
            xeroApi.setSql(sql)
            xeroApi.setXeroClient(xeroClient)

            let myDb = process.env.DB_NAME

            let qs = `select [UserId] from [${myDb}].[dbo].[${constants.TOKENSET}]`
            let result = await sql.execute(myDb, qs)
            let rows = result.recordset
            if(!rows.length) throw new Error('No User available to update')
            for(let userId of rows)
            {
                let xero = await xeroClient.initalize(userId)

                for(let t of xero.MyTenants)
                {
                    let options = {
                        tenantId: t.TenantId,
                        dbName: t.DbName,
                        modules: ['all'],
                        userId: userId
                    }
                    await xeroApi.fetchAllData(options)
                    t.LastSyncDate = new Date()
                    await sql.update(process.env.DB_NAME, t)
                }
            }
            
            await sql.closeAll()

            let res = {
                statusCode: 200,
                body: "Data fetched"
            }
            resolve(res)
            return res 
        }
        catch(err)
        {
            let res = {
                status: err.statusCode || 500,
                body: getErrorMessage(err)
            }
            reject(res)
            return res
        }
    })
    return promise
}
module.exports.cronScheduler = cronScheduler