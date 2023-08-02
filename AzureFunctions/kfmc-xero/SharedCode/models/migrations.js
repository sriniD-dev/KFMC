const Base = require('./base').default
const constants = require('../constants')

class Migrations extends Base{
    get __schema_name__() { return constants.MIGRATIONS }
    get schema(){
        return [
            {
                field: 'Id',
                type: Number,
                default: 0,
                not_null: false,
                sql_data_type: '[int]'
            },
            {
                field: 'Name',
                type: String,
                default: '',
                not_null: false,
                sql_data_type: '[nvarchar](250)'
            },
            {
                field: 'Date',
                type: Date,
                default: null,
                not_null: false,
                sql_data_type: '[datetime]'
            }
        ]
    }
}
module.exports.default = Migrations