'use strict';

module.exports.syncXero = async(context, req) => {
    const promise = new Promise(async(resolve, reject) => {
        try{
            const functions = require('../SharedCode/functions')
            let reqBody = req.body

            console.log('reqBody:',reqBody)
    
            if(reqBody.action)
            {
                if(reqBody.action==='store-token')
                {
                   let res = await functions.storeToken(req)
                   resolve(res)
                   return res
                }
                
                if(reqBody.action==='fetch-data')
                {
                    let res = await functions.fetchByUserId(req)
                    resolve(res)
                    return res
                }

                if(reqBody.action==='fetch-by-user-id')
                {
                    
                    let res = await functions.fetchByUserId(req)
                    resolve(res)
                    return res
                }

                if(reqBody.action === 'fetch-by-tenant-id')
                {
                    console.log("coming insde if",req);
                    let res = await functions.fetchByTenantId(req)
                    console.log(res,"resfrompromise");
                    resolve(res)
                    return res
                }

                if(reqBody.action === 'patch')
                {
                    let res = await functions.patch(req)
                    resolve(res)
                    return res
                }

                if(reqBody.action === 'get-tenants')
                {
                    let res = await functions.getTenants(req)
                    resolve(res)
                    return res
                }

                if(reqBody.action === 'validate-user')
                {
                    let res = await functions.validateUser(req)
                    resolve(res)
                    return res
                }

                /*
                if(reqBody.action === 'update-sync-status')
                {
                    let res = await functions.updateSyncStatus(req)
                    resolve(res)
                    return res
                }
                */

                
                if(reqBody.action === 'delete-tenant')
                {
                    let res = await functions.deleteTenant(req)
                    resolve(res)
                    return res
                }
                

                if(reqBody.action==='cron-scheduler')
                {

                    let res = await functions.cronScheduler()
                    resolve(res)
                    return res
                }
            }
    
            let res = {
                status: 200,
                body: 'Request Processed'
            }
            resolve(res)
            return res
        }
        catch(err)
        {
            reject(err)
            console.log(err,"err")
            return err
        }
    })
    
    return promise
}