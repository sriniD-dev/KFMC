const Base = require('./base').default
const constants = require('../constants')

class InvoicesPayments extends Base {
    get __schema_name__() { return constants.INVOICESPAYMENTS }
    get schema(){
        return [
            {
                field: 'PaymentID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'paymentID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'InvoiceID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'invoiceID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'BatchPaymentID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'batchPaymentID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'Amount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'amount',
                sql_data_type: '[real]'
            },
            {
                field: 'CurrencyRate',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'currencyRate',
                sql_data_type: '[real]'
            },
            {
                field: 'Date',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'date',
                sql_data_type: '[datetime]'
            },
            {
                field: 'HasAccount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'hasAccount',
                sql_data_type: '[int]'
            },
            {
                field: 'HasValidationErrors',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'hasValidationErrors',
                sql_data_type: '[int]'
            },
            {
                field: 'Reference',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'reference',
                sql_data_type: '[nvarchar](max)'
            },
        ]
    }
}
module.exports.default = InvoicesPayments