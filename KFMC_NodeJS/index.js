'use strict';
const trigger = require('./HttpTriger/index')
module.exports.syncXero = async(event, context) => {
    try{
        let res = await trigger.syncXero(context, {body: JSON.parse(event.body)})
    

        return {
            statusCode: res.statusCode || 200,
            body: res.body
        }
    }
    catch(err)
    {
        console.log('err testings:',err)
        return {
            statusCode: err.statusCode || 500,
            message: err.body
        }
    }
    
}