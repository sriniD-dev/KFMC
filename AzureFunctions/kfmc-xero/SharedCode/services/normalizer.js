const schemas = require('../models/schemas')
const moment = require('moment')

const handleConversions = (s, val) => {
    if(s.date_to_string) return val ? `${moment.utc(val).format()}` : val
    if(s.boolean_to_string) return typeof val === 'boolean' ? `${val ? 1 : 0}` : val
    if(s.number_to_string) return typeof val === 'number' ? `${val}` : val
    if(typeof val === 'boolean') return val === true ? 1 : 0
    return val
}
const normalizer = (schema, json) => {
    let o = {}
    for(let s of schema)
    {
        if(s.object_mapper)
        {
            if(s.object_mapper.includes('.')) 
            {
                let val = s.object_mapper.split('.').reduce((acc, curr) => acc ? acc[curr] : null, json)
                o[s.field] = handleConversions(s, val)
            }
            else {
                o[s.field] = handleConversions(s, json[s.object_mapper])
                /*
                o[s.field] = json[s.object_mapper]
                if(s.date_to_string) o[s.field] = json[s.object_mapper] ? `${moment.utc(json[s.object_mapper]).format()}` : json[s.object_mapper]
                if(s.boolean_to_string) o[s.field] = typeof json[s.object_mapper] === 'boolean' ? `${json[s.object_mapper] ? 1 : 0}` : json[s.object_mapper]
                */
            }

            // if(typeof o[s.field] === 'boolean')  o[s.field] = o[s.field] === true ? 1 : 0
        }
    }
    return o
}

const xeroDataNormalizer = (table, json) => {
    return new schemas[table](normalizer(new schemas[table]().schema,json))
}
module.exports.xeroDataNormalizer = xeroDataNormalizer

const qsNormalizer = (value) => {
    if(value === null || value=== undefined) return 'NULL'
    if(value.constructor.name === 'String') return `'${value.replace(/\'/g, '\'\'')}'`
    if(value.constructor.name === 'Date') return `'${moment.utc(value).format('YYYY-MM-DD HH:mm:ss')}'`
    return value
}
module.exports.qsNormalizer = qsNormalizer