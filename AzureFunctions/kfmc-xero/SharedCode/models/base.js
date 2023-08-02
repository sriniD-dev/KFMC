
const moment  = require('moment')
const setDefault = (s) => {
    if(s.not_null)
    {
        let d = null
        if(s.type === Number) d = 0
        if(s.type === String) d = ''
        if(s.type === Date) d = moment.utc().format('YYYY-MM-DD HH:mm:ss')

        if(s.default !== undefined)
        {
            if(typeof s.default == 'function') return s.default()
            return s.default || d
        }

        return d
    }

    return null
}
class Base {
    
    constructor(value)
    {
        if(value) this.fill(value)
    }

    fill(object){
        for(let s of this.schema)
        {
            if(object[s.field] === null)
            {
                this[s.field] = null
                continue
            }
            if(object[s.field] === undefined)
            {
                this[s.field] = setDefault(s)
                continue
            }
            if((object[s.field]).constructor.name === s.type.name )
            {
                this[s.field] = object[s.field]
            }
            /*
            else if(s.default !== undefined)
            {
                if(typeof s.default == 'function') this[s.field] = s.default()
                else this[s.field] = s.default
            }
            */
        }
    }

    set(field, value){
        let s = this.schema.find(x => x.field === field)
        if(s && s.type.name === (value).constructor.name)
        {
            this[field] = value
            return
        }

        if(s) throw new ReferenceError(`Type required for ${field} is ${s.type.name.toString()}`)
        
        throw new ReferenceError(`Field not available`)

    }
}

module.exports.default = Base
