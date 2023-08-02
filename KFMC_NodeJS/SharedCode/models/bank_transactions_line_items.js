const Base = require('./base').default
const constants = require('../constants')

class BankTransactionsLineItems extends Base{
    get __schema_name__() { return constants.BANKTRANSACTIONSLINEITEMS }
    get schema(){
        return [
            {
                field: 'LineItemID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'lineItemID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BankTransactionID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'bankTransactionID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'AccountCode',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountCode',
                sql_data_type: '[nvarchar](50)'
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
                field: 'LineAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'lineAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'Quantity',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'quantity',
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
                field: 'TaxType',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'taxType',
                sql_data_type: '[nvarchar](100)'
            },
            {
                field: 'UnitAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'unitAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'AccountID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'accountID',
                sql_data_type: '[nvarchar](max)'
            },
        ]
    }
}
module.exports.default = BankTransactionsLineItems