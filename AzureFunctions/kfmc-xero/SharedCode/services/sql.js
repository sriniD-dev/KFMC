const sql = require('mssql')
const n = require('./normalizer')
// const moment = require('moment')
const schemas = require('../models/schemas')
const _ = require('lodash')

const joinValues = (values) => {
    let arr = []
    for(let v of values)
    {
        arr.push(n.qsNormalizer(v))
    }
    return arr.join(',')
}

const getSqlConfig = (dbName) => {
    let config = {
        user: process.env.MSSQL_USER,
        password: process.env.MSSQL_PASSWORD,
        server: process.env.MSSQL_SERVER,
        requestTimeout : 120000,
        connectionTimeout: 120000,
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 15000
        },
        options: {
            encrypt: true, // for azure
            trustServerCertificate: true // change to true for local dev / self-signed certs
        }
    }

    if(dbName) config.database = dbName

    return config
}
/*
const getConnectionPool = (dbName) => {
    const promise = new Promise(async (resolve, reject) => {
        try {
            let sqlConfig = getSqlConfig(dbName)

            let connectionPool = await sql.connect(sqlConfig)
            resolve(connectionPool)
            return connectionPool
        }
        catch (err) {
            reject(err)
            return err
        }

    })
    return promise
}
*/
const pools = {}
async function getPool(dbName){
    let config = getSqlConfig(dbName)
    if(!Object.prototype.hasOwnProperty.call(pools, dbName))
    {
        const pool = new sql.ConnectionPool(config)
        const close = pool.close.bind(pool)
        pool.close = (...args) => {
            delete pools[dbName]
            return close(...args)
        }
        await pool.connect()
        pools[dbName] = pool
    }
    return pools[dbName]
}
// close all pools
function closeAll() {
    return Promise.all(Object.values(pools).map((pool) => {
        return pool.close()
    }))
}
module.exports.closeAll = closeAll

const execute = (dbName, qs) => {
    const promise = new Promise(async (resolve, reject) => {
        try {
            let pool = await getPool(dbName)
            const result = await pool.request().query(qs)
            // pool.close()
            resolve(result)
            return result
        }
        catch (err) {
            reject(err)
            return err
        }
    })

    return promise
}
module.exports.execute = execute

const transactions = (dbName, qs) => {
    const promise = new Promise(async(resolve, reject) => {
        let pool = await getPool(dbName)
        const transaction = new sql.Transaction(pool)
        transaction.begin(err => {
            if(err)
            {
                // pool.close()
                reject(err)
                return err
            }
            let rolledBack = false
            transaction.on('rollback', aborted => {
                rolledBack = true
            })
            new sql.Request(transaction).query(qs, (err, result) => {
                if(err)
                {
                    if(!rolledBack)
                    {
                        transaction.rollback(err => {
                            // pool.close()
                            reject(err)
                            return err
                        })
                    }
                    // pool.close()
                    reject(err)
                    return err
                }

                transaction.commit(err => {
                    if(err)
                    {
                        // pool.close()
                        reject(err)
                        return err
                    }

                    result = 'Transaction completed.'
                    // pool.close()
                    resolve(result)
                    return result
                })
            })
        })
    })
    return promise
}
module.exports.transactions = transactions

const insert = (dbName, value) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            let tableName = `${value.__schema_name__}`
            let cols = Object.keys(value)
            let values = Object.values(value)
            qs = `INSERT INTO [${dbName}].[dbo].[${tableName}] ([${cols.join('],[')}]) values (${joinValues(values)})`
            result = await execute(dbName, qs)
            resolve(result)
            return result
        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}

const getUpdateQS = (dbName, value) => {
    const promise = new Promise((resolve, reject) => {
        try {
            let tableName = value.__schema_name__
            let primaryField = value.schema.find(x => x.is_primary_key)
            if(!primaryField) throw new Error(`Primary key is not defined for ${tableName}`)
            let pkey = primaryField.field

            let sets = []
            for(let k in value)
            {
                if(k !== pkey) sets.push(`[${k}]=${n.qsNormalizer(value[k])}`)
            }
            let qs = `UPDATE [${dbName}].[dbo].[${tableName}] SET ${sets.join(',')} where [${pkey}]=${n.qsNormalizer(value[pkey])}`
            resolve(qs)
            return qs
        }
        catch(err) {
            reject(err)
            return err
        }
    })
    return promise
}

const update = (dbName, value) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            let qs = await getUpdateQS(dbName, value)
            let result = await execute(dbName, qs)
            resolve(result)
            return result
        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}
module.exports.update = update

const createOrUpdate = (dbName, value) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            let tableName = value.__schema_name__
            let primaryField = value.schema.find(x => x.is_primary_key)
            if(!primaryField) throw new Error('Primary key not available for table')
            let pkey = primaryField.field
            let qs = `Select * from [${dbName}].[dbo].[${tableName}] where [${pkey}]=${n.qsNormalizer(value[pkey])}`
            let result = await execute(dbName, qs)
            let recordsets = result.recordset
            if(recordsets.length)
            {
                result = await update(dbName, value)
                resolve(result)
                return result
            }
            
            result = await insert(dbName, value)
            resolve(result)
            return result
        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}
module.exports.createOrUpdate = createOrUpdate

const bulkInsert = (dbName, arr) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            const chunks = _.chunk(arr, 1000)
            let sample = arr[0]
            let cols = Object.keys(sample)
            let tableName = sample.__schema_name__

            let batches = _.chunk(chunks, 2)

            let result = null
            for(let batch of batches)
            {
                // let startTime = moment()
                let bqs = []
                for(let c of batch)
                {
                    let qs = `INSERT INTO [${dbName}].[dbo].[${tableName}] ([${cols.join("],[")}]) values`
                    let values = []
                    values.push(c.map(x => `(${joinValues(Object.values(x))})`))
                    qs = `${qs} ${values.join(",")}`
                    bqs.push(qs)
                    
                }

                result = await transactions(dbName, bqs.join(';'))
                // let endTime = moment()
                // console.log('time diff:',endTime.diff(startTime, 's'))
            }
            
            resolve(result)
            return result
        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}
module.exports.bulkInsert = bulkInsert


const bulkUpdate = (dbName, arr) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            console.log('bulkUpdate dbName:',dbName)
            const chunks = _.chunk(arr, 1000)
            let result = null
            for(let values of chunks)
            {
                console.log('update values length:',values.length)
                let qsList = []
                for(let v of values)
                {
                        let qs = await getUpdateQS(dbName, v)
                        qsList.push(qs)
                }
                result = await transactions(dbName, qsList.join(';'))
            }
           
           resolve(result)
           return result
        }
        catch(err) {
            reject(err)
            return err
        }
    })
    return promise
}
module.exports.bulkUpdate = bulkUpdate


const bulkCreateOrUpdate = (dbName, values) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            let result = null
            let sample = values[0]
            let tableName = sample.__schema_name__
            let pKey = sample.schema.find(x => x.is_primary_key)
            if(!pKey)
            {
                let fKey = sample.schema.find(x => x.is_foreign_key)
                if(!fKey) throw new Error(`Both Primary key and Foriegn key are not defined for ${tableName}`)
                console.log('bulkCreate>reInsert values length:', values.length)
                await reInsert(dbName, values, 'foreign')
                result = 'Create Or Update is success.'
                resolve(result)
                return result
            }
            if(values.length) await reInsert(dbName, values)

            

            result = 'Create Or Update is success.'
            resolve(result)
            return result
        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}

module.exports.bulkCreateOrUpdate = bulkCreateOrUpdate

const reInsert = (dbName, values, keyToUse = 'primary') => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            
            let result = await bulkDelete(dbName, values, keyToUse)
            
            result = await bulkInsert(dbName, values)

            resolve(result)
            return result

        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}
module.exports.reInsert = reInsert


const bulkDelete = (dbName, values, keyToUse = 'primary') => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            let sample = values[0]
            let tableName = sample.__schema_name__
            let col = null
            if(keyToUse === 'primary') col = sample.schema.find(x => x.is_primary_key)
            if(keyToUse === 'foreign') col = sample.schema.find(x => x.is_foreign_key)
            if(!col) throw new Error(`Key not available in Table ${tableName}`)
            let key = col.field
            let inValues = _.uniq(values.map(x => x[key]))
            let chunks = _.chunk(inValues, 1000)
            
            let result = null
            for(let chunk of chunks)
            {
                let qs = `delete from [${dbName}].[dbo].[${tableName}] where [${key}] in (${joinValues(chunk)})`
                result = await execute(dbName, qs)
            }
            
            resolve(result)
            return result

        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}
module.exports.bulkDelete = bulkDelete


const getMaxValue = (dbName, _class) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            console.log('dbName:', dbName)
            let colName = 'maxVal'
            let tableName = _class.__schema_name__
            let col = _class.schema.find(x => x.max_value_field)
            if(!col) throw new Error(`Max Value field is not defined in Table ${tableName}`)
            let uKey = col.field
            let qs = `select MAX([${uKey}]) as '${colName}' from [${dbName}].[dbo].[${tableName}]`
            console.log('qs:',qs)
            let result = await execute(dbName, qs)
            let rows = result.recordset
            if(!rows.length)
            {
                resolve(null)
                return null
            }

            let maxValue = rows[0][colName]
            console.log('maxValue:',maxValue)
            if(col.type === Date) maxValue = maxValue ? new Date(maxValue) : null
            resolve(maxValue)
            return maxValue
        }
        catch(err) {
            reject(err)
            return err
        }
    })
    return promise
}

module.exports.getMaxValue = getMaxValue

const createDb = (dbName) => {
    const promise = new Promise(async(resolve, reject) => {
        try {
            let qs = `SELECT * from sys.databases where name='${dbName}'`
            let result = await execute(null, qs)
            let rows = result.recordset
            if(!rows.length)
            {
                qs = `CREATE DATABASE ${dbName};`
                result = await execute(null, qs)
                let tableQS = []
                for(let s in schemas)
                {
                    let table = new schemas[s]()
                    if(!table.is_primary_table)
                    {
                        let cols = []
                        for(let col of table.schema)
                        {
                            cols.push(`[${col.field}] ${col.sql_data_type} ${col.not_null? 'NOT NULL': 'NULL'}`)
                        }
                        tableQS.push(`CREATE TABLE [${table.__schema_name__}] (${cols.join(',')})`)
                    }
                    
                }
                
                result = await execute(dbName, tableQS.join(';'))
            }
            else
            {
                // run Migration.
            }

            resolve(result)
            return result
        }
        catch(err)
        {
            reject(err)
            return err
        }
    })
    return promise
}
module.exports.createDb = createDb