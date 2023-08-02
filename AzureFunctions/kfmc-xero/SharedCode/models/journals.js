const Base = require('./base').default
const constants = require('../constants')

class Journals extends Base{
    get __schema_name__() { return constants.JOURNALS }
    get schema(){
        return [
            {
                field: 'CreatedDateUTC',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'createdDateUTC',
                sql_data_type: '[datetime]'
            },
            {
                field: 'JournalDate',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'journalDate',
                sql_data_type: '[datetime]'
            },
            {
                field: 'JournalID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'journalID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'JournalNumber',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'journalNumber',
                max_value_field: true,
                sql_data_type: '[int]'
            },
            {
                field: 'Reference',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'reference',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'SourceID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'sourceID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'SourceType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'sourceType',
                sql_data_type: '[nvarchar](50)'
            }
        ]
    }
}
module.exports.default = Journals