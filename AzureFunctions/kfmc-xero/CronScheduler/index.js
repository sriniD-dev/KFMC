
module.exports = async function (context, myTimer) {
    try{
        const functions = require('../SharedCode/functions')
        const res = await functions.cronScheduler(context)
        context.res = res
    }
    catch(err)
    {
        context.res = err
    }
};