const Base = require('./base').default
const constants = require('../constants')

class InvoicesOverpayments extends Base {
    get __schema_name__() { return constants.INVOICESOVERPAYMENTS }
    get schema(){
        return [
            {
                field: 'ID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'overpaymentID',
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
                field: 'OverpaymentID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'overpaymentID',
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'AppliedAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'appliedAmount',
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
                field: 'DateString',
                type: Date,
                default: null,
                not_null: false,
                object_mapper: 'date',
                sql_data_type: '[datetime]'
            },
            {
                field: 'Total',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'total',
                sql_data_type: '[real]'
            }
        ]
    }
}
module.exports.default = InvoicesOverpayments