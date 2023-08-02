
const n = require('./normalizer')
const constants = require('../constants')
// const sql = require('./sql')
const schemas = require('../models/schemas')
const moment = require('moment')
const _ = require('lodash')
const util = require('./utilities')

// let sql = null
const setSql = (sql) => {
    this.sql = sql
}
module.exports.setSql = setSql

const setXeroClient = (xeroClient) => {
    this.xeroClient = xeroClient
}
module.exports.setXeroClient = setXeroClient

const getAccounts = (options) => {
    
    const promise = new Promise(async(resolve, reject) => {
        try {
            const activeTenantId = options.tenantId
            let dbName = options.dbName
            console.log('getAccounts options:', options)
            console.log('getAccounts dbName:', dbName)
            let lastUpdatedDate = await this.sql.getMaxValue(dbName, new schemas[constants.ACCOUNTS]())
            console.log('accounts lastUpdatedDate:',lastUpdatedDate)
            const response = await this.xeroClient.xero.accountingApi.getAccounts(activeTenantId, lastUpdatedDate || null)
            const xAccounts = response.body.accounts
            console.log('xAccounts length:',xAccounts.length)

            console.log('xAccounts:',xAccounts[0])
            
            let accounts = xAccounts.map(x => n.xeroDataNormalizer(constants.ACCOUNTS, x))

            console.log('accounts:',accounts[0])

            let result = {accounts}
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
module.exports.getAccounts = getAccounts


const getContacts = (options) => {
    
    const promise = new Promise(async(resolve, reject) => {
        try {
            const activeTenantId = options.tenantId
            let dbName = options.dbName
            let lastUpdatedDate = await this.sql.getMaxValue(dbName, new schemas[constants.CONTACTS]())
            const response = await this.xeroClient.xero.accountingApi.getContacts(activeTenantId, lastUpdatedDate || null)
            const xContacts = response.body.contacts
            console.log('xContacts:',xContacts[0])
            let contacts = []
            let contactsAddresses = []
            let contactsPhones = []
            for(let c of xContacts)
            {
                contacts.push(n.xeroDataNormalizer(constants.CONTACTS, c))
                if(c.addresses && c.addresses.length) contactsAddresses.push(...c.addresses.map(x => n.xeroDataNormalizer(constants.CONTACTSADDRESSES, {...x, contactID: c.contactID})))
                if(c.phones && c.phones.length) contactsPhones.push(...c.phones.map(x => n.xeroDataNormalizer(constants.CONTACTSPHONES, {...x, contactID: c.contactID})))
            }
            console.log('contacts:', contacts[0])
            console.log('contactsAddresses:', contactsAddresses[0])
            console.log('contactsPhones:', contactsPhones[0])

            let result = {contacts, contactsAddresses, contactsPhones}
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
module.exports.getContacts = getContacts

const xeroBatchProcess = (entity, apiPromise) => {
    const promise = new Promise(async(resolve, reject) => {
        let data = []
        let statusCode = 200
        let error = null
        let daylimit = 0
        let retryAfter = 0
        try {
            const response = await apiPromise
            const rows = response.body[entity]
            data = rows
        }
        catch(err)
        {
            if(err.response && err.response.statusCode) 
            {
                statusCode = err.response.statusCode
                retryAfter = Number(err.response.headers['retry-after'] || 0)
                daylimit = Number(err.response.headers['x-daylimit-remaining'] || 0)
            }
            else error = err
        }

        // console.log('error:',error)

        if(error) 
        {
            reject(error)
            return error
        }

        let response = {
            data,
            statusCode,
            daylimit,
            retryAfter
        }
        console.log('response: ', {daylimit, retryAfter})
        resolve(response)
        return response
    })
    return promise
} 



const getInvoices = (options) => {
    
    const promise = new Promise(async(resolve, reject) => {
        try {
            const activeTenantId = options.tenantId
            let dbName = options.dbName
            let lastUpdatedDate = await this.sql.getMaxValue(dbName, new schemas[constants.INVOICES]())
            /*
            const sResponse = await this.xeroClient.xero.accountingApi.getInvoices(activeTenantId, lastUpdatedDate || null)
            const invSummary = sResponse.body.invoices

            console.log('invSummary length:', invSummary.length)
            const xInvoices = []

            let invIds = invSummary.map(x => x.invoiceID)
            let chunks = _.chunk(invIds, 50)
            let k = 0
            */
            const xInvoices = []

            let page = 1

            let retryCounter = 0
            while(true)
            {
                // let chunk = chunks[k]
                const apiPromise = this.xeroClient.xero.accountingApi.getInvoices(activeTenantId, lastUpdatedDate || null, null, null, null, null, null, null, page)
                let response = await xeroBatchProcess('invoices',apiPromise)
                // let response = await getDetailedInvoice(chunk, options)
                
                if(response.statusCode === 200)
                {
                    page++
                    retryCounter = 0
                    xInvoices.push(...response.data)
                    if(response.data.length < 100) break
                    // if(k === chunks.length) break
                }
                if(response.statusCode === 429)
                {
                    if(response.daylimit > 0 && response.retryAfter < 100)
                    {
                        await util.delay(response.retryAfter)
                        retryCounter++
                    }
                    else break
                }

                if(response.statusCode === 401 || response.statusCode === 400)
                {
                    await this.xeroClient.refreshToken()
                    retryCounter++
                }
                
                if(retryCounter > 50) break            
                
            }
            // const xInvoices = []
            let invoices = []
            let invoicesLineItems = []
            let invoicesLineItemsTracking = []
            let invoicesPayments = []
            let invoicesOverpayments = []
            let invoicesCreditNotes = []
            
            for(let i of xInvoices)
            {
                invoices.push(n.xeroDataNormalizer(constants.INVOICES, i))
                if(i.payments && i.payments.length) invoicesPayments.push(...i.payments.map(x => n.xeroDataNormalizer(constants.INVOICESPAYMENTS, {...x, invoiceID: i.invoiceID})))
                if(i.overpayments && i.overpayments.length) invoicesOverpayments.push(...i.overpayments.map(x => n.xeroDataNormalizer(constants.INVOICESOVERPAYMENTS, {...x, invoiceID: i.invoiceID})))
                if(i.creditNotes && i.creditNotes.length) invoicesCreditNotes.push(...i.creditNotes.map(x => n.xeroDataNormalizer(constants.INVOICESCREDITNOTES, {...x, invoiceID: i.invoiceID})))

                if(i.lineItems && i.lineItems.length)
                {
                    for(let lineItem of i.lineItems)
                    {
                        let trackings = lineItem.tracking.map(x => n.xeroDataNormalizer(constants.INVOICESLINEITEMSTRACKING, {...x, lineItemID: lineItem.lineItemID}))
                        invoicesLineItemsTracking.push(...trackings)
                        invoicesLineItems.push(n.xeroDataNormalizer(constants.INVOICESLINEITEMS, {...lineItem, invoiceID:i.invoiceID}))
                    }
                }
                
            }
            
            console.log('invoices:', invoices[0])
            console.log('invoicesLineItems:', invoicesLineItems[0])
            console.log('invoicesLineItemsTracking:', invoicesLineItemsTracking[0])
            console.log('invoicesPayments:', invoicesPayments[0])
            console.log('invoicesOverpayments:', invoicesOverpayments[0])
            console.log('invoicesPayments:', invoicesCreditNotes[0])

            console.log('invoicesLineItemsTracking length:',invoicesLineItemsTracking.length)

            let result = {invoices, invoicesLineItems, invoicesLineItemsTracking, invoicesPayments, invoicesOverpayments, invoicesCreditNotes}
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
module.exports.getInvoices = getInvoices



const getBankTransactions = (options) => {
    
    const promise = new Promise(async(resolve, reject) => {
        try {
            const activeTenantId = options.tenantId
            let dbName = options.dbName
            let lastUpdatedDate = await this.sql.getMaxValue(dbName, new schemas[constants.BANKTRANSACTIONS]())

            const xBankTransactions = []

            let page = 1

            let retryCounter = 0
            while(true)
            {
                const apiPromise = this.xeroClient.xero.accountingApi.getBankTransactions(activeTenantId, lastUpdatedDate || null, null, null, page)
                let response = await xeroBatchProcess('bankTransactions',apiPromise)
                
                if(response.statusCode === 200)
                {
                    page++
                    retryCounter = 0
                    xBankTransactions.push(...response.data)
                    if(response.data.length < 100) break
                }
                if(response.statusCode === 429)
                {
                    if(response.daylimit > 0 && response.retryAfter < 100)
                    {
                        await util.delay(response.retryAfter)
                        retryCounter++
                    }
                    else break
                }

                if(response.statusCode === 401 || response.statusCode === 400)
                {
                    await this.xeroClient.refreshToken()
                    retryCounter++
                }
                
                if(retryCounter > 50) break            
                
            }

            /*
            console.log('xBankTransactions:',xBankTransactions[0])
            let xxBankTransactions = []
            for(let xb of xBankTransactions)
            {
                let bt = xb
                if(bt.contact && bt.contact.batchPayments && bt.contact.batchPayments.length)
                {
                    for(let payment of bt.contact.batchPayments)
                    {
                        let bPayment = Object.keys(payment).reduce((acc, curr) => acc[`batchPayment_${curr}`] = payment[curr],{})
                        let bankTransaction = {
                            ...bt,
                            ...bPayment
                        }
                        xxBankTransactions.push(bankTransaction)
                    }
                    continue
                }

                xxBankTransactions.push(bt)
            }
            */
            console.log('xBankTransactions:',xBankTransactions[0])

            let bankTransactions = []
            let bankTransactionsLineItems = []
            let bankTransactionsLineItemsTracking = []

            for(let bankTransaction of xBankTransactions)
            {
                bankTransactions.push(n.xeroDataNormalizer(constants.BANKTRANSACTIONS, bankTransaction))
                for(let lineItem of bankTransaction.lineItems)
                {
                    bankTransactionsLineItems.push(n.xeroDataNormalizer(constants.BANKTRANSACTIONSLINEITEMS, {...lineItem, bankTransactionID: bankTransaction.bankTransactionID}))
                    bankTransactionsLineItemsTracking.push(...lineItem.tracking.map(x => n.xeroDataNormalizer(constants.BANKTRANSACTIONSLINEITEMSTRACKING, {...x, lineItemID: lineItem.lineItemID})))
                }
            }

            console.log('bankTransactions:', bankTransactions[0])
            console.log('bankTransactionsLineItems:', bankTransactionsLineItems[0])
            console.log('bankTransactionsLineItemsTracking:', bankTransactionsLineItemsTracking[0])
            
            let result = {bankTransactions, bankTransactionsLineItems, bankTransactionsLineItemsTracking}
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
module.exports.getBankTransactions = getBankTransactions

const getJournals = (options) => {
    
    const promise = new Promise(async(resolve, reject) => {
        try {
            // let _xero = xero
            let dbName = options.dbName
            let lastJournalNumber = await this.sql.getMaxValue(dbName, new schemas[constants.JOURNALS]())
            console.log('lastJournalNumber:',lastJournalNumber)
            const activeTenantId = options.tenantId
            
            const startTime = moment()
            let xJournals = []
            let offset = lastJournalNumber || 0
            let retryCounter = 0
            while(true)
            {
                const apiPromise = this.xeroClient.xero.accountingApi.getJournals(activeTenantId, null, offset)
                let response = await xeroBatchProcess('journals',apiPromise)
                
                if(response.statusCode === 200) 
                {
                    let _rows = _.sortBy(response.data, ['journalNumber'])
                    xJournals.push(..._rows)
                    let lastVal = _rows.length ? _.last(_rows) : null
                    offset = lastVal ? lastVal.journalNumber : 0
                    retryCounter = 0
                    if(_rows.length < 100) break
                }

                if(response.statusCode === 429)
                {
                    retryCounter++
                    if(response.daylimit > 0 && response.retryAfter < 100) await util.delay(response.retryAfter)
                    else break
                }
                
                if(response.statusCode === 401 || response.statusCode === 400)
                {
                    retryCounter++
                    await this.xeroClient.refreshToken()
                }
                if(retryCounter > 50) break
            }
            
            const endTime = moment()

            console.log('diff:', endTime.diff(startTime, 's'))


            if(xJournals.length) xJournals = _.uniq(xJournals, 'journalID')
            
            /*
            const response = await xero.accountingApi.getJournals(activeTenantId, ifModifiedSince, 0)
            const xJournals = response.body.journals.sort((a,b) => b.createdDateUTC - a.createdDateUTC)
            */

            // await util.writeJsonLogs('xJournals.json', xJournals)

            console.log('xJournal length:',xJournals.length)

            console.log('xJournals[0]:',xJournals[0])
            // console.log('xJournals[xJournals.length-1]:',xJournals[xJournals.length-1])

            let journals = []
            let journalLines = []
            let trackingCategories = []
            for(let j of xJournals)
            {
                journals.push(n.xeroDataNormalizer(constants.JOURNALS, j))
                if(j.journalLines && j.journalLines.length)
                {
                    for(let jjl of j.journalLines)
                    {
                        journalLines.push(n.xeroDataNormalizer(constants.JOURNALSJOURNALLINES, { ...jjl, journalID: j.journalID}))
                        if(jjl.trackingCategories && jjl.trackingCategories.length) trackingCategories.push(...jjl.trackingCategories.map(x => n.xeroDataNormalizer(constants.JOURNALSJOURNALLINESTRACKINGCATEGORIES, { ...x, journalLineID: jjl.journalLineID})))
                    }
                }

            }

            console.log('journals:',journals[0])
            console.log('journalLines:',journalLines[0])
            console.log('trackingCategories:',trackingCategories[0])

            let result = {journals, journalLines, trackingCategories}
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
module.exports.getJournals = getJournals



const getLinkedTransactions = (options) => {
    
    const promise = new Promise(async(resolve, reject) => {
        try {
            const activeTenantId = options.tenantId
            let dbName = options.dbName
            let lastUpdatedDate = await this.sql.getMaxValue(dbName, new schemas[constants.LINKEDTRANSACTIONS]())
            const response = await this.xeroClient.xero.accountingApi.getLinkedTransactions(activeTenantId, lastUpdatedDate || null)
            const xLinkedTransactions = response.body.linkedTransactions
            console.log('xLinkedTransactions:',xLinkedTransactions)

            let linkedTransactions = []

            for(let lt of xLinkedTransactions)
            {
                linkedTransactions.push(n.xeroDataNormalizer(constants.LINKEDTRANSACTIONS, lt))
            }

            console.log('linkedTransactions:',linkedTransactions[0])

            let result = {linkedTransactions}
            resolve(result)
            return result
        }
        catch(err)
        {
            console.log('linked transaction err:',err)
            reject(err)
            return err
        }
    })

    return promise
}
module.exports.getLinkedTransactions = getLinkedTransactions


const getTrackingCategories = (options) => {
    
    const promise = new Promise(async(resolve, reject) => {
        try {
            const activeTenantId = options.tenantId
            const response = await this.xeroClient.xero.accountingApi.getTrackingCategories(activeTenantId)
            const xTrackingCategories = response.body.trackingCategories

            console.log('xTrackingCategories:',xTrackingCategories[0])


            let trackingCategories = []
            let trackingCategoriesOptions = []

            for(let tc of xTrackingCategories)
            {
                trackingCategories.push(n.xeroDataNormalizer(constants.TRACKINGCATEGORIES, tc))
                if(tc.options && tc.options.length) trackingCategoriesOptions.push(...tc.options.map(x => n.xeroDataNormalizer(constants.TRACKINGCATEGORIESOPTIONS, {...x, trackingCategoryID: tc.trackingCategoryID})))
            }
            console.log('trackingCategories:',trackingCategories[0])
            console.log('trackingCategoriesOptions:',trackingCategoriesOptions[0])
            let result = {trackingCategories, trackingCategoriesOptions}
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
module.exports.getTrackingCategories = getTrackingCategories

const fetchAllData = (options) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            let dbName = options.dbName
            let modules = options.modules || ['all']
            console.log('dbName:',dbName)

            let stats = []

            if(modules.includes('all') || modules.includes('accounts'))
            {
                let stat = 'No account affected.'
                let a = await getAccounts(options)
                if(a.accounts.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, a.accounts)
                    stat = `${a.accounts.length} accounts affected.`
                }

                stats.push(stat)
            }

            if(modules.includes('all') || modules.includes('contacts')){
                let stat = 'No contact affected.'
                let c = await getContacts(options)
                if(c.contacts.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, c.contacts)
                    stat = `${c.contacts.length} contacts affected.`
                }
                if(c.contactsAddresses.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, c.contactsAddresses)
                }
                if(c.contactsPhones.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, c.contactsPhones)
                }
                stats.push(stat)
            }
            
            if(modules.includes('all') || modules.includes('invoices'))
            {
                let stat = 'No invoice affected.'
                let i = await getInvoices(options)
                if(i.invoices.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, i.invoices)
                    stat = `${i.invoices.length} invoices affected.`

                }
                if(i.invoicesLineItems.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, i.invoicesLineItems)
                }
                if(i.invoicesLineItemsTracking.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, i.invoicesLineItemsTracking)
                }
                if(i.invoicesPayments.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, i.invoicesPayments)
                }
                if(i.invoicesOverpayments.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, i.invoicesOverpayments)
                }
                if(i.invoicesCreditNotes.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, i.invoicesCreditNotes)
                }
                stats.push(stat)
            }
            
            
            
            if(modules.includes('all') || modules.includes('bank_transactions'))
            {
                let stat = 'No bank transaction affected.'
                let b = await getBankTransactions(options)
                if(b.bankTransactions.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, b.bankTransactions)
                    stat = `${b.bankTransactions.length} bank transactions affected.`
                }
                if(b.bankTransactionsLineItems.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, b.bankTransactionsLineItems)
                }
                if(b.bankTransactionsLineItemsTracking.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, b.bankTransactionsLineItemsTracking)
                }
                stats.push(stat)
            }
            
            
            if(modules.includes('all') || modules.includes('journals'))
            {
                let stat = 'No journal affected.'
                let j = await getJournals(options)
                if(j.journals.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, j.journals)
                    stat = `${j.journals.length} journals affected.`
                }
                if(j.journalLines.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, j.journalLines)
                }
                
                if(j.trackingCategories.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, j.trackingCategories)
                }
                stats.push(stat)
            }
            
            

            
            if(modules.includes('all') || modules.includes('linked_transactions'))
            {
                let stat = 'No linked transaction affected.'
                let lt = await getLinkedTransactions(options)
                if(lt.linkedTransactions.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, lt.linkedTransactions)
                    stat = `${lt.linkedTransactions.length} linked transaction affected.`
                }
                stats.push(stat)
            }
            
            
            if(modules.includes('all') || modules.includes('tracking_categories'))
            {
                let stat = 'No tracking categories affected.'
                let tc = await getTrackingCategories(options)
                if(tc.trackingCategories.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, tc.trackingCategories)
                    stat = `${tc.trackingCategories.length} tracking categories affected.`
                }
                
                if(tc.trackingCategoriesOptions.length)
                {
                    await this.sql.bulkCreateOrUpdate(dbName, tc.trackingCategoriesOptions)
                }
                stats.push(stat)

                
            }
            
            resolve(stats)
            return stats
        }
        catch(err)
        {
            
            reject(err)
            return err
        }
    })

    return promise
}
module.exports.fetchAllData = fetchAllData
