const Base = require('./base').default
const constants = require('../constants')

class LinkedTransactions extends Base {
    get __schema_name__() { return constants.LINKEDTRANSACTIONS }
    get schema(){
        return [
            {
                field: 'LinkedTransactionID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'linkedTransactionID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'ContactID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'contactID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'SourceLineItemID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'sourceLineItemID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'SourceTransactionID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'sourceTransactionID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'SourceTransactionTypeCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'sourceTransactionTypeCode',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'Status',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'status',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'TargetLineItemID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'targetLineItemID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'TargetTransactionID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'targetTransactionID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'Type',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'type',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'UpdatedDateUTC',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'updatedDateUTC',
                max_value_field: true,
                sql_data_type: '[datetime]'
            }
        ]
    }
}
module.exports.default = LinkedTransactions