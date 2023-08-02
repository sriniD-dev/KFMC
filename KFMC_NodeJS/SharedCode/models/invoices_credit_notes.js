const Base = require('./base').default
const constants = require('../constants')

class InvoicesCreditNotes extends Base {
    get __schema_name__() { return constants.INVOICESCREDITNOTES }
    get schema(){
        return [
            {
                field: 'ID',
                type: String,
                default: '',
                not_null: true,
                object_mapper: 'creditNoteID',
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
                field: 'AppliedAmount',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'appliedAmount',
                sql_data_type: '[real]'
            },
            {
                field: 'CreditNoteID',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'creditNoteID',
                is_primary_key: true,
                sql_data_type: '[nvarchar](50)'
            },
            {
                field: 'CreditNoteNumber',
                type: String,
                default: '',
                not_null: false,
                object_mapper: 'creditNoteNumber',
                sql_data_type: '[nvarchar](100)'
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
                field: 'HasErrors',
                type: Number,
                default: 0,
                not_null: false,
                object_mapper: 'hasErrors',
                sql_data_type: '[int]'
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
module.exports.default = InvoicesCreditNotes