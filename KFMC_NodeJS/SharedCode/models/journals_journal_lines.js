const Base = require('./base').default
const constants = require('../constants')

class JournalsJournalLines extends Base{
    get __schema_name__() { return constants.JOURNALSJOURNALLINES }
    get schema(){
        return [
            {
                field: 'AccountCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountCode',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'AccountID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'AccountName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountName',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'AccountType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountType',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'Description',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'description',
                sql_data_type: '[nvarchar](max)'
            },
            {
                field: 'GrossAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'grossAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'JournalID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'journalID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'JournalLineID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'journalLineID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'NetAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'netAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'TaxAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'taxAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'TaxName',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'taxName',
                sql_data_type: '[nvarchar](255)'
            },
            {
                field: 'TaxType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'taxType',
                sql_data_type: '[nvarchar](100)'
            }
        ]
    }
}
module.exports.default = JournalsJournalLines