module.exports = async function (context, req) {
    try{
        const functions = require('../SharedCode/functions')
        const res = await functions.deleteTenant(req)
        context.res = res
    }
    catch(err)
    {
        context.res = err
    }

}