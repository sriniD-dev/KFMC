module.exports = async function (context, req) {
    try{
        const functions = require('../SharedCode/functions')
        const res = await functions.storeToken(req)
        context.res = res
    }
    catch(err)
    {
        context.res = err
    }
}