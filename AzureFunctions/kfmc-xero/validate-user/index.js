module.exports = async function (context, req) {
    try{
        const functions = require('../SharedCode/functions')
        const res = await functions.validateUser(req)
        context.res = res
    }
    catch(err)
    {
        context.res = err
    }

}